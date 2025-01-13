import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private adminKey = 'isAdmin';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  setAdminStatus(a: number): void {
    if (this.isBrowser) {
      localStorage.setItem(this.adminKey, a.toString());
    }
  }

  getAdminStatus(): number {
    if (this.isBrowser) {
      const adminStatus = localStorage.getItem(this.adminKey);
      return adminStatus ? parseInt(adminStatus, 10) : 0;
    }
    return 0;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.isBrowser ? !!this.getToken() : false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.adminKey);
    }
  }
}
