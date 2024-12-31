import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const admin = this.authService.getAdminStatus();
    const adminRoutes = ['/admin-dashboard', '/burq', '/home'];
    const userRoutes = ['/burq', '/home'];

    if (admin === 1) {
      if (adminRoutes.some(route => state.url.includes(route))) {
        return true;
      }
    } else if (admin === 0) {
      if (userRoutes.some(route => state.url.includes(route))) {
        return true;
      }
    }
    
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
