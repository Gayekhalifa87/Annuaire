import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../search/search.component";
import { EnteteComponent } from "../entete/entete.component";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, SearchComponent, EnteteComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  searchValue: string = ''; 
  currentPage: number = 1;
  itemsPerPage: number = 6; 

  employees = [
    {
      nom: 'Marie Dupont',
      prenom: 'Marie',
      poste: 'Développeuse Frontend',
      idIP: '1001',
      email: 'marie.dupont@entreprise.com',
      direction: 'Direction Informatique',
      service: 'Développement Web',
      tel: '01.23.45.67.89'
    },
    {
      nom: 'Paul Martin',
      prenom: 'Paul',
      poste: 'Administrateur Systèmes',
      idIP: '1002',
      email: 'paul.martin@entreprise.com',
      direction: 'Service Technique',
      service: 'Support Technique',
      tel: '01.98.76.54.32'
    },
    {
      nom: 'Sophie Bernard',
      prenom: 'Sophie',
      poste: 'Responsable RH',
      idIP: '1003',
      email: 'sophie.bernard@entreprise.com',
      direction: 'Ressources Humaines',
      service: 'Gestion du Personnel',
      tel: '01.11.22.33.44'
    },
    {
      nom: 'Jean Lefebvre',
      prenom: 'Jean',
      poste: 'Chef de Projet',
      idIP: '1004',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: 'Jean Lefebvre',
      prenom: 'Jean',
      poste: 'Chef de Projet',
      idIP: '1004',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: 'Jean Lefebvre',
      prenom: 'Jean',
      poste: 'Chef de Projet',
      idIP: '1004',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: 'Jean Lefebvre',
      prenom: 'Jean',
      poste: 'Chef de Projet',
      idIP: '1004',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: 'Jean Lefebvre',
      prenom: 'Jean',
      poste: 'Chef de Projet',
      idIP: '1004',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: ' khalifa gaye',
      prenom: 'khalifa',
      poste: 'Chef de Projet',
      idIP: '0887',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: ' khalifa gaye',
      prenom: 'khalifa',
      poste: 'Chef de Projet',
      idIP: '0887',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    },
    {
      nom: ' khalifa gaye',
      prenom: 'khalifa',
      poste: 'Chef de Projet',
      idIP: '0887',
      email: 'jean.lefebvre@entreprise.com',
      direction: 'Direction de Projet',
      service: 'Gestion de Projet',
      tel: '77.45.97.41.22'
    }
  ];

  onSearch(value: string) {
    this.searchValue = value;
    this.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
  }

  get filteredEmployees() {
  const value = this.searchValue.toLowerCase();
  return this.employees.filter(emp =>
    emp.nom.toLowerCase().includes(value) ||
    (emp.prenom && emp.prenom.toLowerCase().includes(value)) ||
    emp.idIP.includes(value)
  );
}


  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }
}



