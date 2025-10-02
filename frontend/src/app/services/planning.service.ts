import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
  _id?: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface Goal {
  _id?: string;
  title: string;
  description: string;
  category: 'Academic' | 'Personal' | 'Career' | 'Health' | 'Other';
  status: 'Not Started' | 'In Progress' | 'Achieved';
}

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/planning`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Task Methods
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() });
  }
  addTask(taskData: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, taskData, { headers: this.getAuthHeaders() });
  }
  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, taskData, { headers: this.getAuthHeaders() });
  }
  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tasks/${id}`, { headers: this.getAuthHeaders() });
  }

  // Goal Methods
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/goals`, { headers: this.getAuthHeaders() });
  }
  addGoal(goalData: Partial<Goal>): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/goals`, goalData, { headers: this.getAuthHeaders() });
  }
  updateGoal(id: string, goalData: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/goals/${id}`, goalData, { headers: this.getAuthHeaders() });
  }
  deleteGoal(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/goals/${id}`, { headers: this.getAuthHeaders() });
  }
}