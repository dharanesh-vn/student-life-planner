import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  onLogin(): void {
    this.errorMessage = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Email and Password are required.';
      return;
    }
    this.authService.login(this.credentials).subscribe({
      // On success, the service handles the redirect, so we don't need a 'next' block.
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}