import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front';

  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.startsWith('/registro') || url.startsWith('/login');
  }
}
