import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private loginUrl = 'http://localhost:3000/auth/login';
  private statusUrl = 'http://localhost:3000/auth/status';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  loginUser(cred: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, cred);
  }

  getStatus(token: any): Observable<any> {
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get<any>(this.statusUrl, { headers });
  }
}
