import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, FinanceAccount, Transaction, Subscription } from '../../../services/finance.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.css']
})
export class FinanceDashboardComponent implements OnInit {
  accounts: FinanceAccount[] = [];
  transactions: Transaction[] = [];
  subscriptions: Subscription[] = [];

  newAccount = { accountName: '', balance: 0 };
  newTransaction = { description: '', amount: 0, type: 'Expense' as 'Income' | 'Expense', date: format(new Date(), 'yyyy-MM-dd'), account: '' };
  newSubscription = { name: '', monthlyCost: 0, billingDate: 1 };
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private financeService: FinanceService) {}

  // Format currency for Indian Rupees
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  ngOnInit(): void {
    this.loadAllFinanceData();
  }

  loadAllFinanceData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.financeService.getAccounts().subscribe({
      next: data => this.accounts = data,
      error: err => this.handleError('Failed to load accounts.')
    });
    this.financeService.getTransactions().subscribe({
      next: data => this.transactions = data,
      error: err => this.handleError('Failed to load transactions.')
    });
    this.financeService.getSubscriptions().subscribe({
      next: data => {
        this.subscriptions = data;
        this.isLoading = false;
      },
      error: err => this.handleError('Failed to load subscriptions.')
    });
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }
  get totalMonthlySubscriptions(): number {
    return this.subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  }

  onAddAccount(): void {
    if (!this.newAccount.accountName.trim()) {
      this.handleError('Account name is required.');
      return;
    }
    this.isLoading = true;
    this.financeService.addAccount(this.newAccount).subscribe({
      next: (acc) => {
        this.accounts.push(acc);
        this.newAccount = { accountName: '', balance: 0 };
        this.handleSuccess('Account added!');
      },
      error: (err) => this.handleError('Failed to add account.')
    });
  }

  onAddTransaction(): void {
    if (!this.newTransaction.description.trim() || !this.newTransaction.amount || this.newTransaction.amount <= 0 || !this.newTransaction.account) {
      this.handleError('Please fill all transaction fields with valid values.');
      return;
    }
    this.isLoading = true;
    this.financeService.addTransaction(this.newTransaction).subscribe({
      next: () => {
        this.loadAllFinanceData();
        this.newTransaction = { description: '', amount: 0, type: 'Expense', date: format(new Date(), 'yyyy-MM-dd'), account: '' };
        this.handleSuccess('Transaction added!');
      },
      error: (err) => this.handleError('Failed to add transaction.')
    });
  }

  onAddSubscription(): void {
    if (!this.newSubscription.name.trim() || !this.newSubscription.monthlyCost || this.newSubscription.monthlyCost <= 0) {
      this.handleError('Subscription name and a valid cost are required.');
      return;
    }
    this.isLoading = true;
    this.financeService.addSubscription(this.newSubscription).subscribe({
      next: (sub) => {
        this.subscriptions.push(sub);
        this.subscriptions.sort((a,b) => a.billingDate - b.billingDate);
        this.newSubscription = { name: '', monthlyCost: 0, billingDate: 1 };
        this.handleSuccess('Subscription added!');
      },
      error: (err) => this.handleError('Failed to add subscription.')
    });
  }
  
  onDeleteAccount(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure? Deleting an account will also delete all its transactions.')) {
      this.isLoading = true;
      this.financeService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAllFinanceData();
          this.handleSuccess('Account deleted!');
        },
        error: (err) => this.handleError('Failed to delete account.')
      });
    }
  }

  onDeleteTransaction(id: string | undefined): void {
    if (!id) return;
    this.isLoading = true;
    this.financeService.deleteTransaction(id).subscribe({
      next: () => {
        this.loadAllFinanceData();
        this.handleSuccess('Transaction deleted!');
      },
      error: (err) => this.handleError('Failed to delete transaction.')
    });
  }

  onDeleteSubscription(id: string | undefined): void {
    if (!id) return;
    this.isLoading = true;
    this.financeService.deleteSubscription(id).subscribe({
      next: () => {
        this.subscriptions = this.subscriptions.filter(s => s._id !== id);
        this.handleSuccess('Subscription deleted!');
      },
      error: (err) => this.handleError('Failed to delete subscription.')
    });
  }

  private handleError(message: string): void { this.errorMessage = message; this.isLoading = false; setTimeout(() => this.errorMessage = '', 3000); }
  private handleSuccess(message: string): void { this.successMessage = message; this.isLoading = false; setTimeout(() => this.successMessage = '', 2000); }
}