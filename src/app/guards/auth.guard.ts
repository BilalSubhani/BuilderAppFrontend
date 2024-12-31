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
    if (admin === 1) {
      if (state.url.includes('/admin-dashboard'))
        return true;
    } 
    else if (admin === 0) {
      if (state.url.includes('/home'))
        return true;
    }
    
    this.router.navigate(['/**']);
    return false;
  }
}
