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
    const token = this.authService.getToken();
    if (token) {
      const user = this.getUserFromToken(token);
      console.log(user);
      if (user && user.isAdmin === 1) {
        if (state.url.includes('/admin-dashboard')) {
          return true;
        }
      } else if (user && user.isAdmin === 0) {
        if (state.url.includes('/home')) {
          return true;
        }
      }
    }
    this.router.navigate(['/login']);
    return false;
  }

  private getUserFromToken(token: string) {
    try {
      const decodedToken = atob(token); 
      return JSON.parse(decodedToken);
    } catch (e) {
      return null; 
    }
  }
}
