import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JwtService } from '../../services/jwt-service';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu-service';
import { SidebarItem } from '../../models/sidebar-item.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMobileMenu = false;
  expandedItems: Set<string> = new Set();

  sidebarItems: SidebarItem[] = [];

  selectedUrl: string = '';

  userEmail: string | null = null;
  userRole: string | null = null;

  constructor(private jwtService: JwtService, private router: Router, private menuService: MenuService) {
    this.userEmail = this.jwtService.getEmail();
    this.userRole = this.jwtService.getRole();
    this.sidebarItems = this.menuService.getMenuItems();
    this.selectedUrl = this.router.url;
    
    // Expandir automáticamente el item padre si la URL actual pertenece a una subsección
    this.checkAndExpandParent();
  }

  /**
   * Obtiene el nombre descriptivo del rol del usuario
   */
  get userRoleDisplay(): string {
    if (!this.userRole) return '';

    switch (this.userRole.toLowerCase()) {
      case 'efector':
        return 'Efector de salud';
      case 'agente':
        return 'Agente comunitario';
      case 'usmya':
        return 'USMYA';
      case 'referente':
        return 'Referente afectivo';
      case 'admin':
        return 'Administrador';
      default:
        return this.userRole; // Retorna el rol original si no coincide con ninguno
    }
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

  logout() {
    this.jwtService.removeToken();
    this.router.navigate(['/login']);
    this.showMobileMenu = false;
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    
    // Bloquear/desbloquear scroll del body
    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleSubsections(item: SidebarItem, event: Event): void {
    event.stopPropagation();
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

  isActive(url: string): boolean {
    return this.selectedUrl === url;
  }

  selectItem(url: string) {
    this.selectedUrl = url;
    this.router.navigate([url]);
    this.showMobileMenu = false;
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }
}