export type ActivityTone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'secondary' | 'accent';

export interface StoredActivityItem {
  message: string;
  tone: ActivityTone;
  ts: number; // epoch ms
}

export interface ActivityItem {
  message: string;
  timeAgo: string;
  tone: ActivityTone;
}

const STORAGE_KEY = 'head:recent-activity:v1';
const MAX_ITEMS = 25;

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatTimeAgo(ts: number): string {
  const diffMs = Date.now() - ts;
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function getUserScopeKey(): string {
  // Keep activity scoped per logged-in user if possible.
  try {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    const id = user?.id ?? user?.user?.id ?? '';
    return id ? `${STORAGE_KEY}:${String(id)}` : STORAGE_KEY;
  } catch {
    return STORAGE_KEY;
  }
}

export function loadHeadActivity(): ActivityItem[] {
  const key = getUserScopeKey();
  const stored = safeParseJson<StoredActivityItem[]>(localStorage.getItem(key)) ?? [];
  return stored
    .filter((x) => !!x?.message)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, MAX_ITEMS)
    .map((x) => ({ message: x.message, tone: x.tone, timeAgo: formatTimeAgo(x.ts) }));
}

export function pushHeadActivity(message: string, tone: ActivityTone): ActivityItem[] {
  const key = getUserScopeKey();
  const stored = safeParseJson<StoredActivityItem[]>(localStorage.getItem(key)) ?? [];

  stored.unshift({ message, tone, ts: Date.now() });
  const trimmed = stored.slice(0, MAX_ITEMS);
  localStorage.setItem(key, JSON.stringify(trimmed));

  return trimmed.map((x) => ({ message: x.message, tone: x.tone, timeAgo: formatTimeAgo(x.ts) }));
}
