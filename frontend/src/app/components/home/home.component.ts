import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-container">
      <div class="auth-promo-panel">
        <div class="promo-content">
          <!-- UPDATED BRANDING -->
          <h1>Orbit</h1>
          <p>"Finally, a single place to view everything you're planning to ignore."</p>
        </div>
      </div>
      <div class="auth-card">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; width: 100%; overflow: hidden; }
    .auth-card { display: flex; flex-direction: column; justify-content: center; padding: 3rem 4rem; background-color: var(--card-background-color); }
    .auth-promo-panel {
      background-color: var(--primary-color);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 3rem;
      background-image: linear-gradient(rgba(137, 103, 179, 0.9), rgba(106, 74, 143, 0.98)), url('https://images.unsplash.com/photo-1524995767962-b52a282b3473?q=80&w=2070');
      background-size: cover;
      background-position: center;
    }
    .promo-content { max-width: 450px; }
    .promo-content h1 { font-size: 3.5rem; color: white; margin-bottom: 1rem; font-weight: 700; }
    .promo-content p { font-size: 1.2rem; opacity: 0.9; font-style: italic; }
    
    @media (max-width: 992px) {
      .auth-container { grid-template-columns: 1fr; }
      .auth-promo-panel { display: none; }
      .auth-card { padding: 2rem; }
    }
  `]
})
export class HomeComponent {}