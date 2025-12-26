import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, merge } from 'rxjs';
import { filter, finalize, map, takeUntil } from 'rxjs/operators';
import { APP_CONFIG, type AppConfig } from '../core/config/app-config';
import { AuthStoreService } from '../core/auth/auth-store.service';
import type { BaseEventPayload, EventType } from './event-types';

export type SseConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface SseConnectOptions {
  rooms?: string[];
  eventTypes?: EventType[];
  reconnectDelayMs?: number;
  maxReconnectAttempts?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SseService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private readonly destroy$ = new Subject<void>();

  private reconnectAttempts = 0;
  private lastOptions: Required<Pick<SseConnectOptions, 'reconnectDelayMs' | 'maxReconnectAttempts'>> &
    Omit<SseConnectOptions, 'reconnectDelayMs' | 'maxReconnectAttempts'> = {
    reconnectDelayMs: 3000,
    maxReconnectAttempts: 10,
  };

  private readonly eventsSubject = new Subject<BaseEventPayload>();
  readonly events$ = this.eventsSubject.asObservable();

  private readonly connectionStateSubject = new BehaviorSubject<SseConnectionState>(
    'disconnected',
  );
  readonly connectionState$ = this.connectionStateSubject.asObservable();

  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly authStore: AuthStoreService,
  ) {}

  connect(options: SseConnectOptions = {}): void {
    this.disconnect();

    this.lastOptions = {
      ...this.lastOptions,
      ...options,
    };

    this.establishConnection();
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.connectionStateSubject.next('disconnected');
    this.reconnectAttempts = 0;
  }

  on<T = unknown>(...types: string[]): Observable<BaseEventPayload<T>> {
    return this.events$.pipe(
      filter((event) => types.includes(event.type)),
      map((event) => event as BaseEventPayload<T>),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  private establishConnection(): void {
    const token = this.authStore.getAccessToken();
    if (!token) {
      this.connectionStateSubject.next('error');
      return;
    }

    this.connectionStateSubject.next('connecting');

    const url = this.buildUrl(token);

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.connectionStateSubject.next('connected');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onerror = () => {
        this.connectionStateSubject.next('error');
        this.scheduleReconnect();
      };

      // Default message handler (in case server emits without event type)
      this.eventSource.onmessage = (event) => this.handleMessage(event);

      // Listen only to the event types we care about (plus connection events)
      const typesToListen = new Set<string>([
        'connected',
        'heartbeat',
        ...(this.lastOptions.eventTypes ?? []),
      ]);

      typesToListen.forEach((eventType) => {
        this.eventSource?.addEventListener(eventType, (event) => {
          this.handleMessage(event as MessageEvent);
        });
      });

      // Safety: stop emitting if service is destroyed
      merge(interval(0)).pipe(takeUntil(this.destroy$), finalize(() => {})).subscribe();
    } catch {
      this.connectionStateSubject.next('error');
      this.scheduleReconnect();
    }
  }

  private buildUrl(token: string): string {
    const base = this.config.apiBaseUrl.replace(/\/$/, '');
    const url = `${base}/events/sse`;

    const params = new URLSearchParams();
    params.set('token', token);

    if (this.lastOptions.rooms?.length) {
      params.set('rooms', this.lastOptions.rooms.join(','));
    }

    if (this.lastOptions.eventTypes?.length) {
      params.set('types', this.lastOptions.eventTypes.join(','));
    }

    return `${url}?${params.toString()}`;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const payload = JSON.parse(event.data) as BaseEventPayload;
      this.eventsSubject.next(payload);
    } catch {
      // ignore malformed messages
    }
  }

  private scheduleReconnect(): void {
    this.disconnect();

    if (this.reconnectAttempts >= this.lastOptions.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;

    const delayMs = this.lastOptions.reconnectDelayMs;
    setTimeout(() => this.establishConnection(), delayMs);
  }
}
