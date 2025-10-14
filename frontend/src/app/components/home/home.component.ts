import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-promo-panel">
        <div class="promo-content">
          <div class="brand-section">
            <div class="logo-container">
              <svg class="logo-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.928 12.0001C21.928 17.4931 17.493 21.9281 12 21.9281C6.50696 21.9281 2.07202 17.4931 2.07202 12.0001C2.07202 6.50706 6.50696 2.07212 12 2.07212C14.815 2.07212 17.348 3.20012 19.208 5.07112" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.4648 12.0001L12.0008 8.53613L8.53683 12.0001L12.0008 15.4641L15.4648 12.0001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 6L18 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <h1 class="brand-title">Orbit</h1>
            </div>
            <p class="brand-tagline">"Finally, a single place to view everything you're planning to ignore."</p>
          </div>
          <div class="features-section">
            <h3>Everything you need to succeed</h3>
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div class="feature-text"><h4>Academic Management</h4><p>Track courses, assignments, and notes</p></div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div class="feature-text"><h4>Goal Planning</h4><p>Set and track your personal goals</p></div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.2 7.8l-7.4-7.4C12.4.1 12 0 11.7 0H6C4.9 0 4 .9 4 2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8.3c0-.3-.1-.7-.4-.9zM12 4v4h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div class="feature-text"><h4>Finance Tracking</h4><p>Manage your budget and expenses</p></div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div class="feature-text"><h4>AI Assistant</h4><p>Get help with your studies</p></div>
              </div>
            </div>
          </div>
          <div class="promo-buttons">
            <a routerLink="/" class="promo-button primary">Sign In</a>
            <a routerLink="/register" class="promo-button secondary">Create Account</a>
          </div>
        </div>
      </div>
      <div class="auth-card">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: grid; grid-template-columns: 1fr 1.1fr; min-height: 100vh; width: 100%; overflow: hidden; }
    .auth-card { display: flex; flex-direction: column; justify-content: center; background: var(--card-background-color); position: relative; overflow-y: auto; }
    .auth-promo-panel {
      background: var(--primary-gradient); color: white; display: flex; flex-direction: column;
      justify-content: center; align-items: center; text-align: center; padding: 3rem;
      position: relative; overflow-y: auto;
    }
    .auth-promo-panel::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-image: url('https://images.unsplash.com/photo-1524995767962-b52a282b3473?q=80&w=2070');
      background-size: cover; background-position: center; opacity: 0.1; z-index: 0;
    }
    .promo-content { max-width: 500px; position: relative; z-index: 1; display: flex; flex-direction: column; gap: 3rem; }
    .brand-section { margin-bottom: 1rem; }
    .logo-container { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
    .logo-icon { width: 48px; height: 48px; color: white; animation: float 4s ease-in-out infinite; }
    .brand-title { font-size: 4rem; color: white; margin: 0; font-weight: 800; }
    .brand-tagline { font-size: 1.25rem; color: white; opacity: 0.95; font-style: italic; line-height: 1.6; margin: 0; }
    .features-section h3 { font-size: 1.5rem; margin-bottom: 2rem; font-weight: 600; color: white; }
    .features-list { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .feature-item { display: flex; align-items: center; text-align: left; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.1); border-radius: 12px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); transition: var(--transition-normal); }
    .feature-item:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
    .feature-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.2); border-radius: 8px; color: white; flex-shrink: 0; }
    .feature-text h4 { margin: 0 0 0.25rem 0; font-size: 1rem; font-weight: 600; color: white; }
    .feature-text p { margin: 0; font-size: 0.875rem; color: white; opacity: 0.8; }
    .promo-buttons { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
    .promo-button { padding: 0.75rem 2rem; text-decoration: none; border-radius: 8px; font-weight: 600; transition: var(--transition-normal); }
    .promo-button.primary { background: white; color: var(--primary-color); }
    .promo-button.primary:hover { background: #f0f0f0; transform: translateY(-2px); }
    .promo-button.secondary { background: transparent; color: white; border: 2px solid white; }
    .promo-button.secondary:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @media (max-width: 1024px) {
      .auth-container { grid-template-columns: 1fr; grid-template-rows: auto 1fr; min-height: auto; }
      .auth-promo-panel { padding: 2rem; }
      .brand-title { font-size: 3rem; }
      .features-list { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent {}