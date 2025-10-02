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
  // Reusing the login CSS for a consistent look
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent {
  credentials = { name: '', email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = '';
    if (!this.credentials.name || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.credentials.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    this.authService.register(this.credentials).subscribe({
      next: () => {
        // On successful registration, redirect to the login page (root path)
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Registration failed. The email may already be in use.';
      }
    });
  }
}