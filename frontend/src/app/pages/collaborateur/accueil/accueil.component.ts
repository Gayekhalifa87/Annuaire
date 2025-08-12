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

  onSearch(query: string) {
    this.employeeService.filterEmployees(query);
  }

  trackByEmployee(index: number, emp: Employee) {
    return emp.ip; // ou emp.idIP si c’est unique
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
