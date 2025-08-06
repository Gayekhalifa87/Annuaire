import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../search/search.component";
import { EnteteComponent } from "../entete/entete.component";
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, SearchComponent, EnteteComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {

  constructor(public employeeService: EmployeeService) {}

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
}



