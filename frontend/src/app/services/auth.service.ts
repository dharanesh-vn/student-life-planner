import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenPresent());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  private isTokenPresent(): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return !!token;
  }

  register(credentials: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
          this.router.navigate(['/academic/assignments']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  // This is the crucial method the guard calls. It's a simple, synchronous check.
  isLoggedIn(): boolean {
    return this.isTokenPresent();
  }
}