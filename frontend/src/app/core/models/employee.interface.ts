export interface Employee {
  nom: string;
  prenom: string;
  poste: string;
  idIP: string;
  email: string;
  direction: string;
  service: string;
  tel: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SearchFilters {
  searchTerm: string;
  direction?: string;
  service?: string;
  poste?: string;
}