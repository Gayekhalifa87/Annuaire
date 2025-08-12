import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EnteteComponent } from "../../../layout/entete/entete.component";
import { SearchComponent } from "../../../components/search/search.component";
import { EmployeeService } from '../../../core/services/employee.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { Employee } from '../../../shared';
import { Token } from '@angular/compiler';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnteteComponent, SearchComponent ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  addEmployeeForm: FormGroup;
  showAddForm = false;
  constructor(public employeeService: EmployeeService, 
    private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router) {
    this.addEmployeeForm = this.fb.group({
      
      nom: ['', Validators.required],
      prenom: ['',Validators.required],
      poste: ['', Validators.required],
      direction: ['', Validators.required],
      service: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ip: ['', Validators.required],
      telephone: ['', Validators.required],
      role: ['', Validators.required],
      password: ['']
      
    });

    // Écoute les changements sur role pour appliquer ou enlever la validation password
    this.addEmployeeForm.get('role')?.valueChanges.subscribe(role => {
      this.updatePasswordValidator(role);
    });


  }
  ngOnInit() {
    this.employeeService.loadEmployees();
  }
  onSearch(value: string) {
    this.employeeService.filterEmployees(value);

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

   // Met à jour la validation de password selon le contexte
  private updatePasswordValidator(role: string) {
    const passwordControl = this.addEmployeeForm.get('password');
    if (!this.isEditing && role === 'admin') {
      passwordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }


  editingEmployeeId: string | null = null;



  addEmployee() {
  if (this.addEmployeeForm.valid) {
    const employeeData = this.addEmployeeForm.value;

    if (this.isEditing && this.editingEmployeeId) {
      console.log('📌 Modification employé', this.editingEmployeeId, employeeData);
      this.employeeService.updateEmployee(this.editingEmployeeId, employeeData).subscribe({
        next: (updatedEmp) => {
          const index = this.employeeService.employees.findIndex(e => e.id === updatedEmp.id);
          if (index !== -1) {
            this.employeeService.employees[index] = updatedEmp;
          }
          this.resetForm();
          Swal.fire('Succès', 'Employé modifié avec succès', 'success');
        },
        error: (err) => {
          console.error('Erreur modification:', err);
          Swal.fire('Erreur', 'Erreur lors de la modification', 'error');
        }
      });
    } else {
      console.log('📌 Création employé', employeeData);
      this.employeeService.createEmployee(employeeData).subscribe({
        next: (newEmp: Employee) => {
          this.employeeService.employees.push(newEmp);
          this.resetForm();
          Swal.fire('Succès', 'Employé ajouté avec succès', 'success');
        },
        error: (err: any) => {
          console.error('Erreur ajout:', err);
          Swal.fire('Erreur', 'Erreur lors de l\'ajout', 'error');
        }
      });
    }
  }
}


  isEditing = false;


 editEmployee(employee: any) {
  this.isEditing = true;
  this.editingEmployeeId = employee.id || employee._id; // adapte selon ta donnée
  this.addEmployeeForm.patchValue(employee);

  // Met à jour la validation password si nécessaire
  this.updatePasswordValidator(this.addEmployeeForm.get('role')?.value || '');
  console.log("mise a jour $ {{user}}")

  this.showAddForm = true;
}


  resetForm() {
  this.isEditing = false;
  this.editingEmployeeId = null;
  this.addEmployeeForm.reset({
    role: 'user',
    password: ''
  });
  this.showAddForm = false;
}



  deleteEmployee(emp: Employee) {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cet employé?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.employeeService.deleteEmployeeById(emp.id).subscribe({
        next: () => {
          const index = this.employeeService.employees.findIndex(e => e.id === emp.id);
          if (index !== -1) {
            this.employeeService.employees.splice(index, 1);
            this.employeeService.filterEmployees('');  // met à jour la pagination et l’affichage
          }
          Swal.fire({
            title: 'Supprimé !',
            text: "L'employé a été supprimé.",
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
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
    text: "Êtes-vous sûr de vouloir changer le rôle de cet employé ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, changer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.employeeService.switchRole(id).subscribe({
        next: (response) => {
          console.log('✅ Réponse backend:', response);
          Swal.fire({
            title: 'Succès',
            text: response.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.employeeService.loadEmployees();
        },
        error: (err) => {
          console.error('❌ Erreur changement de rôle', err);
          console.log('📩 Détails erreur:', err.error);
          Swal.fire('Erreur', 'Le changement de rôle a échoué.', 'error');
        }
      });
    }
  });
}



 logout(event: Event) {
  event.preventDefault();

  Swal.fire({
    title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.performLogout(); // on lance la déconnexion
    }
  });
}

performLogout() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  this.authService.logout(token).subscribe({
    next: () => {
      localStorage.removeItem('token');

      Swal.fire({
        title: 'Déconnexion réussie',
        text: 'deconnexion reussie vous serez redirige vers l accueil.',
        icon: 'success',
        showConfirmButton: false,
        timer: 2000, 
        timerProgressBar: true
      }).then(() => {
        this.router.navigate(['/accueil']);
      });
    },
    error: () => {
      localStorage.removeItem('token');
      this.router.navigate(['/accueil']);
    }
  });
}


parametre(event: Event) {
  event.preventDefault();
  alert('Aucune option de paramétrage disponible pour le moment.');
}
}

