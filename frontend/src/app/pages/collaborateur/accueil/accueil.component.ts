import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../../../components/search/search.component";
import { EnteteComponent } from "../../../layout/entete/entete.component";
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, getInitials } from '../../../shared';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, SearchComponent, EnteteComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})

export class AccueilComponent {
  constructor(public employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.loadEmployees();
  }
  loadEmployees() {
    this.employeeService.loadEmployees();
  }

  getInitials(name: string): string {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '';
  }

  onSearch(term: string) {
  this.employeeService.searchEmployees({ nom: term, prenom: term, ip: term, service: term, direction: term })
    .subscribe({
      next: (data) => {
        this.employeeService.filteredEmployees = data;
        this.employeeService.updatePagination();
      },
      error: (err) => console.error('Erreur recherche', err)
    });
}


  trackByEmployee(index: number, emp: Employee) {
    return emp.ip; 
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
