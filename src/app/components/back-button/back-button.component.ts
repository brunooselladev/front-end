import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {
  @Input() route: string = '/';
  @Input() isBackButton: boolean = false;

  constructor(private router: Router) {}

  onBack(): void {
    if (this.isBackButton) {
      window.history.back();
    } else {
      this.router.navigate([this.route]);
    }
  }
}