import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private apiUrl = 'http://localhost:3000/data';
  private dataChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public dataChange$: Observable<boolean> = this.dataChange.asObservable();

  constructor(private http: HttpClient) {}

  getNavbar(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/main`);
  }

  getAllData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getNavData(comp: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + comp);
  }

  createData(data: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/data', data).pipe(
      tap(() => {
        this.notifyDataChange(true);
      })
    );
  }

  notifyDataChange(hasChanged: boolean) {
    this.dataChange.next(hasChanged);
  }
}
