import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  /** Base URL for backend API, e.g. http://localhost:3000 */
  apiBaseUrl: string;
}

declare global {
  // Optional runtime config override (e.g. set in index.html)
  // eslint-disable-next-line no-var
  var __QUIIZY_CONFIG__: Partial<AppConfig> | undefined;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export function resolveAppConfig(): AppConfig {
  const cfg = globalThis.__QUIIZY_CONFIG__;

  return {
    // Prefer runtime override, then the static environment file, then a safe default
    apiBaseUrl: cfg?.apiBaseUrl ?? environment.apiBaseUrl ?? 'http://localhost:4000',
  };
}
