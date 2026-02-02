import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtService } from '../services/jwt-service';

@Injectable({
  providedIn: 'root'
})
export class EfectorGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(): boolean {
    const token = this.jwtService.getToken();
    const role = this.jwtService.getRole();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    if (role === 'efector') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}