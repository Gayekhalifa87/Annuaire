import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../../../components/search/search.component";
import { EnteteComponent } from "../../../layout/entete/entete.component";
import { EmployeeService } from '../../../core/services/employee.service';
import { getInitials } from '../../../shared/utils/string.utils';

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

  trackByEmployee(_: number, employee: any): any {
    return employee.idIP;
  }

  getInitials = getInitials;
}



