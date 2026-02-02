import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardOptionComponent } from '../../../components/card-option/card-option.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-need-help',
  imports: [CommonModule, RouterModule, CardOptionComponent],
  templateUrl: './need-help.html',
  styleUrl: './need-help.scss'
})
export class NeedHelp {
}
