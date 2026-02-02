import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarItem } from '../../models/sidebar-item.model';
import { MenuService } from '../../services/menu-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() items: SidebarItem[] = [];
  @Input() selectedUrl: string = '';

  sidebarItems: SidebarItem[] = [];
  expandedItems: Set<string> = new Set();

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sidebarItems = this.menuService.getMenuItems();
    // Establecer la URL actual como seleccionada
    this.selectedUrl = this.router.url;

    // Expandir automáticamente el item padre si la URL actual pertenece a una subsección
    this.checkAndExpandParent();
  }

  private checkAndExpandParent(): void {
    for (const item of this.sidebarItems) {
      if (item.subsections) {
        const hasActiveSubsection = item.subsections.some(sub => this.isActive(sub.url));
        if (hasActiveSubsection) {
          this.expandedItems.add(item.label);
          break;
        }
      }
    }
  }

  get activeUrl(): string {
    return this.selectedUrl;
  }

  isActive(url: string): boolean {
    // Si la URL termina con *, considerar que coincide con cualquier ruta que empiece con esa URL sin el *
    if (url.endsWith('*')) {
      const baseUrl = url.slice(0, -1); // Remover el *
      return this.selectedUrl.startsWith(baseUrl);
    }
    return this.selectedUrl === url;
  }

  toggleSubsections(item: SidebarItem): void {
    if (item.subsections) {
      if (this.expandedItems.has(item.label)) {
        this.expandedItems.delete(item.label);
      } else {
        this.expandedItems.add(item.label);
      }
    }
  }

  isExpanded(item: SidebarItem): boolean {
    return this.expandedItems.has(item.label);
  }

  selectItem(url: string) {
    // Si la URL termina con *, navegar a la URL base (sin el *)
    const actualUrl = url.endsWith('*') ? url.slice(0, -1) + '-general' : url;
    this.selectedUrl = actualUrl;
    this.router.navigate([actualUrl]);
  }
}
