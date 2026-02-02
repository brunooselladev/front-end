import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SidebarItem {
  label: string;
  url: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-menu.component.html',
  styleUrls: ['./navbar-menu.component.scss']
})
export class NavbarMenuComponent {
  @Input() items: SidebarItem[] = [];
  @Input() show = false;
  @Output() selectItem = new EventEmitter<number>();

  onSelect(selectedIndex: number) {
    this.selectItem.emit(selectedIndex);
  }
}
