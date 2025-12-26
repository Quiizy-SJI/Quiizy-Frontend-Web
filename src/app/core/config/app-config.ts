import { InjectionToken } from '@angular/core';

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
    apiBaseUrl: cfg?.apiBaseUrl ?? 'http://localhost:3000',
  };
}
