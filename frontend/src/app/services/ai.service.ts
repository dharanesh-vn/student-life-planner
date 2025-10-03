import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type AiAction = 'summarize' | 'key-concepts' | 'quiz' | 'flashcards';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  processNotes(courseId: string, action: AiAction): Observable<{ result: string }> {
    const body = { courseId, action };
    return this.http.post<{ result: string }>(`${this.apiUrl}/process-notes`, body, { headers: this.getAuthHeaders() });
  }
}