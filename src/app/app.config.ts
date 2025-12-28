import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_CONFIG, resolveAppConfig } from './core/config/app-config';
import { authInterceptor } from './core/http/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configure change detection options (works with Zone.js); enables event coalescing
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: APP_CONFIG,
      useFactory: resolveAppConfig,
    },
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
