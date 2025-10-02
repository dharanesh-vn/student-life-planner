import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  // No 'styles' or 'styleUrls' are needed here anymore.
})
export class AppComponent {
  title = 'Gradify';
}