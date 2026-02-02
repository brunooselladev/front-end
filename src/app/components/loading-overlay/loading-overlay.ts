import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss'
})
export class LoadingOverlayComponent {
  @Input() message = 'Cargando...';
  @Input() fullscreen = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showBackdrop = true;
}
