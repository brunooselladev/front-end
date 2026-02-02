import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'email';
  placeholder?: string;
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
}

export interface ActionConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  bgColor?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];

  // Paginación
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  // Filtros - sistema avanzado
  @Input() filters: FilterConfig[] = [];
  @Input() showFilter: boolean = true;

  // Filtros - sistema simple (para compatibilidad)
  @Input() filterPlaceholder: string = 'Buscar...';
  @Input() filterableColumns: string[] = [];

  // Acciones personalizadas
  @Input() customActions: ActionConfig[] = [];
  @Input() showDefaultActions: boolean = true;

  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCustomAction = new EventEmitter<{ action: string; item: any }>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onFilterChange = new EventEmitter<{ [key: string]: any } | string>();

  // Propiedades del filtro avanzado
  filterValues: { [key: string]: any } = {};
  filteredData: any[] = [];

  // Propiedades del filtro simple (para compatibilidad)
  filterText: string = '';

  ngOnInit(): void {
    // Inicializar valores de filtro avanzado
    if (this.filters && this.filters.length > 0) {
      this.filters.forEach(filter => {
        this.filterValues[filter.key] = '';
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['filterValues'] || changes['filterText']) {
      this.applyFilters();
    }
  }

  // Método para manejar cambios en filtros
  handleFilterChange(): void {
    if (this.filters && this.filters.length > 0) {
      this.onFilterChange.emit(this.filterValues);
    } else {
      this.onFilterChange.emit(this.filterText);
    }
    this.applyFilters();
    // Resetear a página 1 cuando se filtra
    if (this.currentPage !== 1) {
      this.changePage(1);
    }
  }

  // Método para filtro simple (para compatibilidad)
  onFilterInput(): void {
    this.handleFilterChange();
  }

  clearFilters(): void {
    if (this.filters && this.filters.length > 0) {
      // Limpiar filtros avanzados
      this.filters.forEach(filter => {
        this.filterValues[filter.key] = '';
      });
    } else {
      // Limpiar filtro simple
      this.filterText = '';
    }
    this.handleFilterChange();
  }

  private applyFilters(): void {
    let dataToFilter = [...this.data];

    if (this.filters && this.filters.length > 0) {
      // Aplicar filtros avanzados
      if (Object.values(this.filterValues).some(value => value && value !== '')) {
        dataToFilter = dataToFilter.filter(item => {
          return this.filters.every(filter => {
            const filterValue = this.filterValues[filter.key];
            if (!filterValue || filterValue === '') return true;

            const itemValue = item[filter.key]?.toString().toLowerCase() || '';
            const searchValue = filterValue.toString().toLowerCase();

            return itemValue.startsWith(searchValue);
          });
        });
      }
    } else if (this.filterText && this.filterText.trim()) {
      // Aplicar filtro simple
      const searchTerm = this.filterText.toLowerCase().trim();
      const columnsToSearch = this.filterableColumns.length > 0 ? this.filterableColumns : this.columns.map(col => col.key);

      dataToFilter = dataToFilter.filter(item =>
        columnsToSearch.some(column => {
          const value = item[column]?.toString().toLowerCase() || '';
          return value.startsWith(searchTerm);
        })
      );
    }

    this.filteredData = dataToFilter;
  }

  // Getters para propiedades calculadas
  get totalFilteredItems(): number {
    return this.filteredData.length;
  }

  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalFilteredItems / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalFilteredItems);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // ...
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages;
  }

  // Métodos de paginación
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.onPageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  // Métodos de acciones
  handleView(item: any): void {
    this.onView.emit(item);
  }

  handleEdit(item: any): void {
    this.onEdit.emit(item);
  }

  handleDelete(item: any): void {
    this.onDelete.emit(item);
  }

  // Método para obtener el valor de filtro para mostrar
  getFilterDisplayValue(filter: FilterConfig): string {
    const value = this.filterValues[filter.key];
    if (filter.type === 'select' && filter.options) {
      const option = filter.options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }

  // Propiedad computada para saber si hay filtros activos
  get hasActiveFilters(): boolean {
    if (this.filters && this.filters.length > 0) {
      return Object.values(this.filterValues).some(value => value && value !== '');
    }
    return !!(this.filterText && this.filterText.trim() !== '');
  }

  // Método para limpiar filtro simple (para compatibilidad)
  clearFilter(): void {
    this.clearFilters();
  }

  // Método para trackBy
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // Método para manejar acciones personalizadas
  handleCustomAction(actionKey: string, item: any): void {
    this.onCustomAction.emit({ action: actionKey, item });
  }

  // Método para determinar si el icono es una imagen
  isImage(icon: string): boolean {
    return icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg') || icon.includes('.svg') || icon.startsWith('assets/');
  }

  // Método para obtener el estilo de la imagen basado en el color
  getImageStyle(color: string): string {
    if (color.includes('blue')) {
      return 'filter: hue-rotate(200deg) saturate(2);';
    } else if (color.includes('green')) {
      return 'filter: hue-rotate(80deg) saturate(2);';
    } else if (color.includes('red')) {
      return 'filter: hue-rotate(0deg) saturate(2);';
    }
    return '';
  }
}