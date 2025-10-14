import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService, FinanceAccount, Transaction, Subscription } from '../../../services/finance.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.css']
})
export class FinanceDashboardComponent implements OnInit {
  accounts: FinanceAccount[] = [];
  transactions: Transaction[] = [];
  subscriptions: Subscription[] = [];

  accountForm: FormGroup;
  transactionForm: FormGroup;
  subscriptionForm: FormGroup;
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private financeService: FinanceService,
    private fb: FormBuilder
  ) {
    this.accountForm = this.fb.group({
      accountName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      balance: [null, [Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]]
    });

    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: ['Expense', Validators.required],
      account: ['', Validators.required]
    });

    this.subscriptionForm = this.fb.group({
      name: ['', Validators.required],
      monthlyCost: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadAllFinanceData();
  }

  get af() { return this.accountForm.controls; }
  get tf() { return this.transactionForm.controls; }
  get sf() { return this.subscriptionForm.controls; }

  loadAllFinanceData(): void {
    this.isLoading = true;
    this.financeService.getAccounts().subscribe({ next: data => this.accounts = data, error: err => this.handleError('Failed to load accounts.')});
    this.financeService.getTransactions().subscribe({ next: data => this.transactions = data, error: err => this.handleError('Failed to load transactions.')});
    this.financeService.getSubscriptions().subscribe({ next: data => { this.subscriptions = data; this.isLoading = false; }, error: err => this.handleError('Failed to load subscriptions.')});
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }
  get totalMonthlySubscriptions(): number {
    return this.subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);
  }

  onAddAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.financeService.addAccount(this.accountForm.value).subscribe({
      next: (acc) => {
        this.accounts.push(acc);
        this.accountForm.reset({ balance: null });
        this.handleSuccess('Account added!');
      },
      error: (err) => this.handleError('Failed to add account.')
    });
  }

  onAddTransaction(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.financeService.addTransaction({ ...this.transactionForm.value, date: new Date().toISOString() }).subscribe({
      next: () => {
        this.loadAllFinanceData();
        this.transactionForm.reset({ type: 'Expense', account: '' });
        this.handleSuccess('Transaction added!');
      },
      error: (err) => this.handleError('Failed to add transaction.')
    });
  }

  onAddSubscription(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.financeService.addSubscription({ ...this.subscriptionForm.value, billingDate: 1 }).subscribe({
      next: (sub) => {
        this.subscriptions.push(sub);
        this.subscriptions.sort((a,b) => a.billingDate - b.billingDate);
        this.subscriptionForm.reset();
        this.handleSuccess('Subscription added!');
      },
      error: (err) => this.handleError('Failed to add subscription.')
    });
  }
  
  onDeleteAccount(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure? This will also delete all associated transactions.')) {
      this.isLoading = true;
      this.financeService.deleteAccount(id).subscribe({
        next: () => { this.loadAllFinanceData(); this.handleSuccess('Account deleted!'); },
        error: (err) => this.handleError('Failed to delete account.')
      });
    }
  }

  onDeleteTransaction(id: string | undefined): void {
    if (!id) return;
    this.isLoading = true;
    this.financeService.deleteTransaction(id).subscribe({
      next: () => { this.loadAllFinanceData(); this.handleSuccess('Transaction deleted!'); },
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