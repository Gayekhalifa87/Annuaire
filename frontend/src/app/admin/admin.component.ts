import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnteteComponent } from "../entete/entete.component";
import { AccueilComponent } from "../accueil/accueil.component";
import { SearchComponent } from "../search/search.component";
import { EmployeeService } from '../services/employee.service';
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
  constructor(public employeeService: EmployeeService, private fb: FormBuilder) {
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
  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
  deleteEmployee(index: number) {
    this.employeeService.employees.splice(index, 1);
  }
 
  

}
