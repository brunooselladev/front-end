import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardOptionComponent } from '../../../components/card-option/card-option.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-offer-help-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CardOptionComponent, BreadcrumbComponent],
  templateUrl: './offer-help-page.component.html',
  styleUrl: './offer-help-page.component.scss'
})
export class OfferHelpPageComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Registro', route: '/registro' },
    { label: 'Ofrezco ayuda', active: true }
  ];
}
