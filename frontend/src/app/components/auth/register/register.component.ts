import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials = { name: '', email: '', password: '' };
  errorMessage: string = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = '';
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (!this.isPasswordValid()) {
      this.errorMessage = 'Password does not meet all requirements.';
      return;
    }
    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Registration failed. The email may already be in use.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  hasUppercase(): boolean { return /[A-Z]/.test(this.credentials.password); }
  hasLowercase(): boolean { return /[a-z]/.test(this.credentials.password); }
  hasNumber(): boolean { return /[0-9]/.test(this.credentials.password); }
  hasMinLength(): boolean { return this.credentials.password.length >= 8; }
  isPasswordValid(): boolean {
    return this.hasUppercase() && this.hasLowercase() && this.hasNumber() && this.hasMinLength();
  }
}