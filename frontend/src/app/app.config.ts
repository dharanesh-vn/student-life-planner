import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // This is needed for Markdown
import { provideMarkdown } from 'ngx-markdown'; // We need this function
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // CORRECTED: provideHttpClient() must be included for ngx-markdown to work correctly
    provideHttpClient(),
    // CORRECTED: provideMarkdown() registers all the necessary services, including _MarkdownService
    provideMarkdown()
  ]
};