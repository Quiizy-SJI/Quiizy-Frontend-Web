import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG, type AppConfig } from '../config/app-config';

export type RequestOptions = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | (string | number | boolean)[]>;
  context?: HttpContext;
  withCredentials?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  get<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.toUrl(path), options);
  }

  post<T>(path: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.http.post<T>(this.toUrl(path), body, options);
  }

  put<T>(path: string, body: unknown, options: RequestOptions = {}): Observable<T> {
    return this.http.put<T>(this.toUrl(path), body, options);
  }

  delete<T>(path: string, options: RequestOptions = {}): Observable<T> {
    return this.http.delete<T>(this.toUrl(path), options);
  }

  private toUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;

    const base = this.config.apiBaseUrl.replace(/\/$/, '');
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalized}`;
  }
}
