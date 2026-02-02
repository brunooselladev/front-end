import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-left.component.html',
  styleUrls: ['./register-left.component.scss']
})
export class RegisterLeftComponent {
  @Input() title: string = 'Bienvenido a <span class="mappa">MiWeb!</span>';
  @Input() image: string = 'assets/img-background-login.jpg';
}
