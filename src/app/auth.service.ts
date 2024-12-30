import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  generateToken(user: any): string {
    const token = btoa(JSON.stringify(user));
    return token;
  }
  
  getUserFromToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = atob(token);
        return JSON.parse(decoded);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  
  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
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
    }
  }
}
