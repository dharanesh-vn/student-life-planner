import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FinanceAccount {
  _id?: string;
  accountName: string;
  balance: number;
}

export interface Transaction {
  _id?: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  date: string;
  account: string | { _id?: string; accountName?: string };
}

export interface Subscription {
  _id?: string;
  name: string;
  monthlyCost: number;
  billingDate: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = `${environment.apiUrl}/finance`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Account Methods
  getAccounts(): Observable<FinanceAccount[]> {
    return this.http.get<FinanceAccount[]>(`${this.apiUrl}/accounts`, { headers: this.getAuthHeaders() });
  }
  addAccount(accountData: Partial<FinanceAccount>): Observable<FinanceAccount> {
    return this.http.post<FinanceAccount>(`${this.apiUrl}/accounts`, accountData, { headers: this.getAuthHeaders() });
  }
  deleteAccount(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/accounts/${id}`, { headers: this.getAuthHeaders() });
  }

  // Transaction Methods
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, { headers: this.getAuthHeaders() });
  }
  addTransaction(transactionData: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transactionData, { headers: this.getAuthHeaders() });
  }
  deleteTransaction(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/transactions/${id}`, { headers: this.getAuthHeaders() });
  }

  // Subscription Methods
  getSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}/subscriptions`, { headers: this.getAuthHeaders() });
  }
  addSubscription(subData: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, subData, { headers: this.getAuthHeaders() });
  }
  deleteSubscription(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/subscriptions/${id}`, { headers: this.getAuthHeaders() });
  }
}