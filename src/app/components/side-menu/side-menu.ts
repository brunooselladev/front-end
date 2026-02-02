import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss'
})
export class SideMenu {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.isOpen = false;
    this.closeEvent.emit();
  }
}
