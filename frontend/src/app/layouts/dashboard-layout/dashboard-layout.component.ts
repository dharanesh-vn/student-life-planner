import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, RouterLink, RouterLinkActive ],
  template: `
    <div class="app-container">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2>Orbit</h2>
        </div>
        <ul class="sidebar-nav">
          <li><a routerLink="/ai-assistant" routerLinkActive="active" class="ai-link">✨ AI Assistant</a></li>
          <li class="nav-section-header">Academic</li>
          <li><a routerLink="/academic/assignments" routerLinkActive="active">Assignments</a></li>
          <li><a routerLink="/academic/classes" routerLinkActive="active">Courses</a></li>
          <li><a routerLink="/academic/pomodoro" routerLinkActive="active">Pomodoro Timer</a></li>
          <li class="nav-section-header">Planning</li>
          <li><a routerLink="/planning/planner" routerLinkActive="active">Planner</a></li>
          <li><a routerLink="/planning/goals" routerLinkActive="active">Goals</a></li>
          <li class="nav-section-header">Finance</li>
          <li><a routerLink="/finance" routerLinkActive="active">Dashboard</a></li>
        </ul>
        <div class="sidebar-footer">
          <button (click)="onLogout()">Logout</button>
        </div>
      </nav>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container { display: flex; height: 100vh; }
    .sidebar { width: 260px; background-color: var(--card-background-color); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; padding: 1.5rem 0; flex-shrink: 0; box-shadow: var(--shadow); }
    .sidebar-header h2 { padding: 0 1.5rem; margin-bottom: 2rem; font-size: 1.5rem; color: var(--primary-color); font-weight: 700; }
    .sidebar-nav { list-style-type: none; padding: 0; margin: 0; flex-grow: 1; }
    .sidebar-nav a { display: block; padding: 0.9rem 1.5rem; color: var(--text-color-light); text-decoration: none; font-weight: 500; margin: 0 1rem; border-radius: 8px; transition: background-color 0.2s, color 0.2s; }
    .sidebar-nav a:hover { background-color: #f0f0f0; color: var(--text-color); }
    .sidebar-nav a.active { background-color: rgba(137, 103, 179, 0.1); color: var(--primary-color); font-weight: 600; }
    .sidebar-footer { padding: 0 1.5rem; }
    .sidebar-footer button { width: 100%; padding: 0.75rem; background: none; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; font-weight: 500; color: var(--text-color-light); }
    .sidebar-footer button:hover { background-color: #f0f0f0; }
    .main-content { flex-grow: 1; padding: 2.5rem; overflow-y: auto; background-color: var(--background-color); }
    .nav-section-header { padding: 1.5rem 1.5rem 0.5rem; font-size: 0.8rem; font-weight: 600; color: var(--text-color-light); text-transform: uppercase; letter-spacing: 0.5px; }
    .sidebar-nav a.ai-link { background-color: var(--primary-color); color: white; font-weight: 600; margin-bottom: 1.5rem; }
    .sidebar-nav a.ai-link:hover { background-color: var(--primary-color-dark); }
    .sidebar-nav a.ai-link.active { background-color: var(--primary-color-dark); }
  `]
})
export class DashboardLayoutComponent {
  constructor(private authService: AuthService) {}
  onLogout(): void {
    this.authService.logout();
  }
}