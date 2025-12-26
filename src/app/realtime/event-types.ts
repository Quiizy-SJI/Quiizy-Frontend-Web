/**
 * Real-time event types (mirrors backend).
 * Keep in sync with quizzy-backend-api/src/dtos/events/event-types.enum.ts
 */
export enum EventType {
  CONNECTED = 'connected',
  HEARTBEAT = 'heartbeat',

  // Dean/Admin dashboard
  DEAN_STATS_UPDATED = 'dean:stats-updated',

  EXAM_AVAILABLE = 'exam:available',
  EXAM_STARTING_SOON = 'exam:starting-soon',
  EXAM_STARTED = 'exam:started',
  EXAM_MISSED = 'exam:missed',

  RESULTS_PUBLISHED = 'results:published',
}

export interface BaseEventPayload<T = unknown> {
  type: EventType | string;
  timestamp: string;
  eventId: string;
  correlationId?: string;
  data: T;
}
