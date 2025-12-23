import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { EventType, BaseEventPayload } from './event-types';

/**
 * Configuration for SSE connection.
 */
export interface SseConfig {
  /** Base URL for SSE endpoint */
  baseUrl: string;
  /** Rooms to subscribe to (e.g., 'quiz:123', 'class:456') */
  rooms?: string[];
  /** Event types to filter */
  eventTypes?: EventType[];
  /** Reconnection delay in ms */
  reconnectDelay?: number;
  /** Max reconnection attempts */
  maxReconnectAttempts?: number;
}

/**
 * Connection state for SSE.
 */
export type SseConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Angular service for Server-Sent Events connection.
 * Provides RxJS Observable wrapper over EventSource with auto-reconnect.
 *
 * Usage:
 * ```typescript
 * @Component({ ... })
 * export class QuizComponent implements OnInit, OnDestroy {
 *   private sseService = inject(SseService);
 *
 *   ngOnInit() {
 *     this.sseService.connect({
 *       baseUrl: environment.apiUrl,
 *       rooms: ['quiz:123'],
 *     });
 *
 *     this.sseService.events$
 *       .pipe(filter(e => e.type === EventType.QUIZ_STARTED))
 *       .subscribe(event => {
 *         console.log('Quiz started!', event.data);
 *       });
 *   }
 *
 *   ngOnDestroy() {
 *     this.sseService.disconnect();
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SseService implements OnDestroy {
  private eventSource: EventSource | null = null;
  private destroy$ = new Subject<void>();
  private reconnectAttempts = 0;

  /** All incoming events */
  private eventsSubject = new Subject<BaseEventPayload>();
  public events$ = this.eventsSubject.asObservable();

  /** Connection state */
  private connectionStateSubject = new BehaviorSubject<SseConnectionState>('disconnected');
  public connectionState$ = this.connectionStateSubject.asObservable();

  /** Current configuration */
  private config: SseConfig | null = null;

  /** Token getter function (inject your auth service) */
  private tokenGetter: (() => string | null) | null = null;

  /**
   * Sets the function to retrieve JWT token.
   * Call this from your auth service or app initializer.
   */
  setTokenGetter(getter: () => string | null): void {
    this.tokenGetter = getter;
  }

  /**
   * Connects to the SSE endpoint.
   */
  connect(config: SseConfig): void {
    if (this.eventSource) {
      this.disconnect();
    }

    this.config = {
      reconnectDelay: 3000,
      maxReconnectAttempts: 10,
      ...config,
    };

    this.establishConnection();
  }

  /**
   * Disconnects from the SSE endpoint.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connectionStateSubject.next('disconnected');
    this.reconnectAttempts = 0;
  }

  /**
   * Creates a filtered observable for specific event types.
   */
  on<T = unknown>(...types: EventType[]): Observable<BaseEventPayload<T>> {
    return this.events$.pipe(
      filter((event) => types.includes(event.type as EventType)),
      map((event) => event as BaseEventPayload<T>),
    );
  }

  /**
   * Gets quiz-specific events.
   */
  quizEvents$(quizId: string): Observable<BaseEventPayload> {
    return this.events$.pipe(
      filter((event) => {
        const data = event.data as { quizId?: string };
        return data?.quizId === quizId;
      }),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }

  private establishConnection(): void {
    if (!this.config) return;

    const token = this.tokenGetter?.();
    if (!token) {
      console.error('SSE: No auth token available');
      this.connectionStateSubject.next('error');
      return;
    }

    this.connectionStateSubject.next('connecting');

    // Build URL with query parameters
    const url = this.buildUrl(token);

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('SSE: Connected');
        this.connectionStateSubject.next('connected');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE: Error', error);
        this.connectionStateSubject.next('error');
        this.handleReconnect();
      };

      // Listen for all message types
      this.eventSource.onmessage = (event) => {
        this.handleMessage(event);
      };

      // Listen for specific event types
      Object.values(EventType).forEach((eventType) => {
        this.eventSource?.addEventListener(eventType, (event) => {
          this.handleMessage(event as MessageEvent);
        });
      });

      // Connected event
      this.eventSource.addEventListener('connected', (event) => {
        const data = JSON.parse((event as MessageEvent).data);
        console.log('SSE: Connection confirmed', data);
      });

      // Heartbeat event
      this.eventSource.addEventListener('heartbeat', () => {
        // Keep connection alive - no action needed
      });
    } catch (error) {
      console.error('SSE: Failed to create EventSource', error);
      this.connectionStateSubject.next('error');
      this.handleReconnect();
    }
  }

  private buildUrl(token: string): string {
    const base = `${this.config!.baseUrl}/events/sse`;
    const params = new URLSearchParams();
    params.set('token', token);

    if (this.config!.rooms?.length) {
      params.set('rooms', this.config!.rooms.join(','));
    }

    if (this.config!.eventTypes?.length) {
      params.set('types', this.config!.eventTypes.join(','));
    }

    return `${base}?${params.toString()}`;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const payload = JSON.parse(event.data) as BaseEventPayload;
      this.eventsSubject.next(payload);
    } catch (error) {
      console.error('SSE: Failed to parse message', error, event.data);
    }
  }

  private handleReconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reconnectAttempts >= (this.config?.maxReconnectAttempts ?? 10)) {
      console.error('SSE: Max reconnection attempts reached');
      this.connectionStateSubject.next('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config?.reconnectDelay ?? 3000;

    console.log(
      `SSE: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
    );

    timer(delay)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.establishConnection();
      });
  }
}
