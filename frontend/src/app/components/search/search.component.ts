import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() employees: any[] = [];
  @Output() search = new EventEmitter<string>();
  searchTerm: string = '';

  onInputChange() {
    this.search.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.search.emit(this.searchTerm);
  }

  quickSearch(term: string) {
    this.searchTerm = term;
    this.search.emit(this.searchTerm);
  }

}
