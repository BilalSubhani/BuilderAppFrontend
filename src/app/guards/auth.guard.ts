import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const admin = this.authService.getAdminStatus();
    const adminRoutes = [
      '/customization',
      '/admin',
      '/admin/users',
      '/customization/changetext',
      '/customization/uploadvideo',
      '/customization/uploadimage',
      '/burq',
    ];
    const userRoutes = ['/burq'];
  
    if (admin === 1 && adminRoutes.some(route => state.url.startsWith(route))) {
      return true;
    }
  
    if (admin === 0 && userRoutes.some(route => state.url.startsWith(route))) {
      return true;
    }

    this.router.navigate(['/not-authorized']);
    return false;
  }
  
}
