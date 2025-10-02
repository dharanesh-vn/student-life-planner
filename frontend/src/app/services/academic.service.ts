import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Course {
  _id?: string;
  courseName: string;
  instructor: string;
  scheduleDays: string[];
  scheduleStartTime: string;
  scheduleEndTime: string;
}

export interface Assignment {
  _id?: string;
  title: string;
  dueDate: string;
  status: 'To-Do' | 'In Progress' | 'Done';
  course: string | { _id?: string, courseName?: string };
}

export interface Note {
  _id?: string;
  title: string;
  content: string;
  course: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AcademicService {
  private apiUrl = `${environment.apiUrl}/academic`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- Course Methods ---
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`, { headers: this.getAuthHeaders() });
  }
  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course, { headers: this.getAuthHeaders() });
  }
  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, courseData, { headers: this.getAuthHeaders() });
  }
  deleteCourse(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/courses/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Assignment Methods ---
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments`, { headers: this.getAuthHeaders() });
  }
  addAssignment(assignment: Partial<Assignment>): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.apiUrl}/assignments`, assignment, { headers: this.getAuthHeaders() });
  }
  updateAssignment(id: string, assignmentData: Partial<Assignment>): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/assignments/${id}`, assignmentData, { headers: this.getAuthHeaders() });
  }
  deleteAssignment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/assignments/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Note Methods ---
  getNotesForCourse(courseId: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/courses/${courseId}/notes`, { headers: this.getAuthHeaders() });
  }
  addNote(noteData: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, noteData, { headers: this.getAuthHeaders() });
  }
  updateNote(noteId: string, noteData: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${noteId}`, noteData, { headers: this.getAuthHeaders() });
  }
  deleteNote(noteId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/notes/${noteId}`, { headers: this.getAuthHeaders() });
  }
}