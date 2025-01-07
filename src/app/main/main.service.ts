import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private apiUrl = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {}

  getNavbar(): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}/main`);
  }

  getAllData(): Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }

  createData(data: any): Observable<any>{
    // console.log(data)
    // console.log(this.apiUrl)
    const res = this.http.post<any>(this.apiUrl, data);

    console.log(res);
    return res;
  }
}