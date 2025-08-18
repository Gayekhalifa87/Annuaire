import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnteteComponent } from '../../../layout/entete/entete.component';
import { SearchComponent } from '../../../components/search/search.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employee } from '../../../shared';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnteteComponent, SearchComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  addEmployeeForm: FormGroup;
  showAddForm = false;
  isEditing = false;
  editingEmployeeId: string | null = null;

  constructor(
    public employeeService: EmployeeService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addEmployeeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      poste: ['', Validators.required],
      direction: ['', Validators.required],
      service: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ip: ['', Validators.required],
      telephone: ['', Validators.required],
      role: ['user', Validators.required],
      password: ['']
    });

    this.addEmployeeForm.get('role')?.valueChanges.subscribe(role => {
      this.updatePasswordValidator(role);
    });
  }

  ngOnInit() {
    this.employeeService.loadEmployees();
  }

  private updatePasswordValidator(role: string) {
    const passwordControl = this.addEmployeeForm.get('password');
    if (!this.isEditing && role === 'admin') {
      passwordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }

  addEmployee() {
    if (!this.addEmployeeForm.valid) return;

    const employeeData = this.addEmployeeForm.value;

    if (this.isEditing && this.editingEmployeeId) {
      this.employeeService.updateEmployee(this.editingEmployeeId, employeeData).subscribe({
        next: updatedEmp => {
          const index = this.employeeService.employees.findIndex(e => e.id === updatedEmp.id);
          if (index !== -1) this.employeeService.employees[index] = updatedEmp;
          this.resetForm();
          Swal.fire('Succès', 'Employé modifié avec succès', 'success');
          this.employeeService.loadEmployees();
        },
        error: err => {
          console.error('Erreur modification:', err);
          Swal.fire('Erreur', 'Erreur lors de la modification', 'error');
        }
      });
    } else {
      this.employeeService.createEmployee(employeeData).subscribe({
        next: newEmp => {
          this.employeeService.employees.push(newEmp);
          this.resetForm();
          Swal.fire('Succès', 'Employé ajouté avec succès', 'success');
          this.employeeService.loadEmployees();
        },
        error: err => {
          console.error('Erreur ajout:', err);
          Swal.fire('Erreur', 'Erreur lors de l\'ajout', 'error');
        }
      });
    }
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.editingEmployeeId = employee.id;
    this.addEmployeeForm.patchValue(employee);
    this.updatePasswordValidator(employee.role || '');
    this.showAddForm = true;
  }

  resetForm() {
    this.isEditing = false;
    this.editingEmployeeId = null;
    this.addEmployeeForm.reset({ role: 'user', password: '' });
    this.showAddForm = false;
  }

  deleteEmployee(emp: Employee) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployeeById(emp.id).subscribe({
          next: () => {
            const index = this.employeeService.employees.findIndex(e => e.id === emp.id);
            if (index !== -1) this.employeeService.employees.splice(index, 1);
            this.employeeService.loadEmployees();
            Swal.fire('Supprimé !', "L'employé a été supprimé.", 'success');
          },
          error: err => {
            console.error('Erreur lors de la suppression', err);
            Swal.fire('Erreur', 'La suppression a échoué.', 'error');
          }
        });
      }
    });
  }

  onSwitchRole(id: string) {
    Swal.fire({
      title: 'Changer le rôle',
      text: "Êtes-vous sûr ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, changer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.employeeService.switchRole(id).subscribe({
          next: res => {
            Swal.fire('Succès', res.message, 'success');
            this.employeeService.loadEmployees();
          },
          error: err => {
            console.error('Erreur changement de rôle', err);
            Swal.fire('Erreur', 'Le changement de rôle a échoué.', 'error');
          }
        });
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Déconnexion ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) this.performLogout();
    });
  }

  performLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        Swal.fire({
          title: 'Déconnexion réussie',
          text: 'Vous serez redirigé vers l\'accueil.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: true,
          timerProgressBar: true
        }).then(() => this.router.navigate(['/accueil']));
      },
      error: () => {
        this.authService.clearToken();
        this.router.navigate(['/accueil']);
      }
    });
  }

  parametre(event: Event) {
    event.preventDefault();
    alert('Aucune option de paramétrage disponible pour le moment.');
  }

  nextPage() {
    this.employeeService.nextPage();
  }

  prevPage() {
    this.employeeService.prevPage();
  }

  goToPage(page: number) {
    this.employeeService.goToPage(page);
  }
}
