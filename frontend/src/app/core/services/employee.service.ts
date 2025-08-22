import { Injectable } from '@angular/core';
import { Employee, PaginationInfo, SearchFilters } from '../models/employee.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  pageSize = 6; 

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
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<Employee>(`${this.apiUrl}/${id}`, { headers });
}

getEmployeeByEmail(email: string): Observable<Employee> {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<Employee>(`${this.apiUrl}/email/${email}`, { headers });
}

createEmployee(employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.post<Employee>(this.apiUrl, employee, { headers });
}

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee, { headers });
}

  deleteEmployeeById(id: string): Observable<any> {
  const token = localStorage.getItem('auth_token');
  console.log('Token utilise : ', token);
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}

  switchRole(id: string): Observable<any> {
  const token = localStorage.getItem('auth_token'); // ✅ même clé que dans AuthService
  console.log('Token utilisé :', token);
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.patch(`${this.apiUrl}/${id}/role`, {}, { headers });
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

  getAllDirections(): Observable<string[]> {/* 
  console.log('Appel getAllDirections'); // 🔹 vérification */
  return this.http.get<string[]>(`${this.apiUrl}/directions`);
}
  // ✅ Filtrage rapide côté client (nom, prénom, poste, direction)
  filterEmployees(query: string): void {
    const lowerQuery = query.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.nom.toLowerCase().includes(lowerQuery) ||
      emp.prenom.toLowerCase().includes(lowerQuery) ||
      emp.poste.toLowerCase().includes(lowerQuery) ||
      emp.direction.toLowerCase().includes(lowerQuery),
    );
    this.updatePagination();
  }


   searchEmployees(filters: {
    nom?: string,
    prenom?: string,
    ip?: string,
    service?: string,
    direction?: string
  }): Observable<Employee[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof typeof filters];
      if (value && value.trim() !== '') {
        params = params.set(key, value);
      }
    });

    console.log('Recherche params:', params.toString());

    return this.http.get<Employee[]>(`${this.apiUrl}/search`, { headers, params });
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
  


changePassword(id: string, current: string, newPassword: string, confirm: string) {
  const token = localStorage.getItem('auth_token');
  const headers = { Authorization: `Bearer ${token}` };
  const body = { current, new: newPassword, confirm };

  return this.http.put<{message: string}>(`${this.apiUrl}/${id}/password`, body, { headers });
}

getDepartmentCount(): number {
  const departments = this.filteredEmployees.map(emp => emp.direction);
  const uniqueDepartments = new Set(departments); // enlève les doublons
  return uniqueDepartments.size;
}
getServiceCount(): number {
  const services = this.filteredEmployees.map(emp => emp.service);
  const uniqueServices = new Set(services);
  return uniqueServices.size;
}

  
}
