import { Injectable } from '@angular/core';
import { Employee, PaginationInfo, SearchFilters } from '../models/employee.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];

  currentPageNumber = 1;
  totalPages = 1;
  pages: number[] = [];

  pageSize = 6; // nombre d'éléments par page

  private apiUrl = 'http://localhost:3000/api/employes'; 

  constructor(private http: HttpClient) {}

  loadEmployees(): void {
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = [...data];
        this.updatePagination();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employés', err);
      }
    });
  }



getEmployeeById(id: string): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<Employee>(`${this.apiUrl}/${id}`, { headers });
}

getEmployeeByEmail(email: string): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<Employee>(`${this.apiUrl}/email/${email}`, { headers });
}

createEmployee(employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post<Employee>(this.apiUrl, employee, { headers });
}


/* updateEmployee(id: string, employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<Employee>(`${this.apiUrl}/${id}`, { headers });
} */

 /*  updateEmployee(id: string, employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, { headers });
} */

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, { headers });
}





  deleteEmployeeById(id: string): Observable<any> {
  const token = localStorage.getItem('token'); // ou sessionStorage
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}

switchRole(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.patch(`${this.apiUrl}/${id}/role`, {}, { headers });
}


  

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.goToPage(this.currentPageNumber);
  }

  goToPage(page: number): void {
    this.currentPageNumber = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPageNumber < this.totalPages) {
      this.goToPage(this.currentPageNumber + 1);
    }
  }

  prevPage(): void {
    if (this.currentPageNumber > 1) {
      this.goToPage(this.currentPageNumber - 1);
    }
  }

  filterEmployees(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.nom.toLowerCase().includes(lowerQuery) ||
      emp.prenom.toLowerCase().includes(lowerQuery) ||
      emp.poste.toLowerCase().includes(lowerQuery) ||
      emp.direction.toLowerCase().includes(lowerQuery)
    );
    this.updatePagination();
  }
}
