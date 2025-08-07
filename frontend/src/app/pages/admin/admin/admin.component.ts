import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnteteComponent } from "../../../layout/entete/entete.component";
import { SearchComponent } from "../../../components/search/search.component";
import { EmployeeService } from '../../../core/services/employee.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnteteComponent, SearchComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  addEmployeeForm: FormGroup;
  showAddForm = false;
  constructor(public employeeService: EmployeeService, private fb: FormBuilder, private router: Router) {
    this.addEmployeeForm = this.fb.group({
      nom: ['', Validators.required],
      poste: ['', Validators.required],
      direction: ['', Validators.required],
      service: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idIP: ['', Validators.required],
      tel: ['', Validators.required]
      
    });
  }

  onSearch(value: string) {
    this.employeeService.setSearch(value);
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

  
  addEmployee() {
  if (this.addEmployeeForm.valid) {
    this.employeeService.employees.push(this.addEmployeeForm.value);
    this.addEmployeeForm.reset();
    this.showAddForm = false;
  }
}
  
  
 
  editEmployee(employee: any) {
    this.addEmployeeForm.patchValue(employee);
    this.showAddForm = true;
  }

  deleteEmployee(emp: any) {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cet employe?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result: any) => {
    if (result.isConfirmed) {
      // Supprime l'employé ici
      const index = this.employeeService.employees.indexOf(emp);
      if (index > -1) {
        this.employeeService.employees.splice(index, 1);
      }
      Swal.fire({
        title: 'Supprimé !',
        text: "L'employé a été supprimé.",
        icon: 'success',
        showConfirmButton: true,
        timer: 2000
      });
    }
  });
}

logout(event: Event) {
  event.preventDefault(); // Empêche le comportement par défaut du lien

  Swal.fire({
    title: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, déconnecter',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Déconnecté');
      this.router.navigate(['/accueil']);
    }
  });
}

parametre(event: Event) {
  event.preventDefault();
  alert('Aucune option de paramétrage disponible pour le moment.');
}
}