import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from '../../core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {


  
  
  @Input() employees: Employee[] = [];

   directions: string[] = [];

  searchTerm: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
   /*  console.log('ngOnInit appelé'); */ // 🔹 vérification
    this.loadDirections();
  }

  onInputChange() {
  const term = this.searchTerm.trim();
  if (!term) {
    this.employeeService.loadEmployees();
    return;
  }

    this.employeeService.searchEmployees({ global: term } as any)
  .subscribe({
    next: (data) => {
      this.employeeService.filteredEmployees = data;
      this.employeeService.updatePagination();
      console.log('Résultats serveur:', data);
    },
    error: (err) => console.error('Erreur recherche serveur', err)
  });

}

  clearSearch() {
    this.searchTerm = '';
    this.employeeService.loadEmployees();
  }

  quickSearch(term: string) {
    this.searchTerm = term;

    this.employeeService.searchEmployees({ direction: term }).subscribe({
      next: (data) => {
        /* console.log('Résultats recherche rapide:', data); */
        this.employeeService.filteredEmployees = data;
        this.employeeService.updatePagination();
      },
      error: (err) => console.error('Erreur recherche rapide serveur', err)
    });
  }


    loadDirections() {
    this.employeeService.getAllDirections().subscribe({
      next: (data) => {
       /*  console.log('Directions reçues:', data); */
        this.directions = data;
      },
      error: (err) => console.error('Erreur directions:', err)
    });
  }
}
