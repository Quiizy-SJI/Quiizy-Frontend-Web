/**
 * Payload Sanitization Utilities
 *
 * These utilities ensure that all data sent to the backend is properly typed
 * to avoid "bad request" errors from type mismatches.
 *
 * Common issues prevented:
 * - Numbers sent as strings (e.g., "123" instead of 123)
 * - Strings sent as numbers
 * - Booleans sent as strings (e.g., "true" instead of true)
 * - Undefined values that should be omitted
 * - Empty strings that should be null or undefined
 * - Arrays with wrong element types
 */

/**
 * Converts a value to a string, returns undefined if null/undefined/empty
 */
export function toString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const str = String(value).trim();
  return str.length > 0 ? str : undefined;
}

/**
 * Converts a value to a string, returns the value even if empty string
 */
export function toStringRequired(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Converts a value to a number, returns undefined if not a valid number
 */
export function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

/**
 * Converts a value to a number, returns 0 if not valid
 */
export function toNumberRequired(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

/**
 * Converts a value to an integer, returns undefined if not valid
 */
export function toInt(value: unknown): number | undefined {
  const num = toNumber(value);
  return num !== undefined ? Math.floor(num) : undefined;
}

/**
 * Converts a value to an integer, returns 0 if not valid
 */
export function toIntRequired(value: unknown): number {
  return Math.floor(toNumberRequired(value));
}

/**
 * Converts a value to a boolean, returns undefined if not valid
 */
export function toBoolean(value: unknown): boolean | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
  }
  if (typeof value === 'number') return value !== 0;
  return undefined;
}

/**
 * Converts a value to a boolean, returns false if not valid
 */
export function toBooleanRequired(value: unknown): boolean {
  return toBoolean(value) ?? false;
}

/**
 * Converts a value to an ISO date string (YYYY-MM-DD), returns undefined if not valid
 */
export function toDateString(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;

  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    return undefined;
  }

  if (isNaN(date.getTime())) return undefined;

  // Return ISO date string (YYYY-MM-DD)
  return date.toISOString().split('T')[0];
}

/**
 * Converts a value to an ISO datetime string, returns undefined if not valid
 */
export function toISOString(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return undefined;

  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else {
    return undefined;
  }

  if (isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/**
 * Converts an array of values to strings, filtering out invalid entries
 */
export function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const result = value
    .map((item) => toString(item))
    .filter((item): item is string => item !== undefined);
  return result.length > 0 ? result : undefined;
}

/**
 * Removes undefined values from an object (shallow)
 * Useful for PATCH requests where undefined means "don't change"
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Removes undefined and null values from an object (shallow)
 */
export function removeNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      obj[key] !== undefined &&
      obj[key] !== null
    ) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Deep sanitizes an object, converting all values to their expected types
 * based on the value's current type
 */
export function sanitizePayload<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];

    if (value === undefined) {
      // Skip undefined values
      continue;
    }

    if (value === null) {
      result[key] = null;
      continue;
    }

    if (Array.isArray(value)) {
      // Recursively sanitize array elements
      result[key] = value.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return sanitizePayload(item as Record<string, unknown>);
        }
        return item;
      });
      continue;
    }

    if (typeof value === 'object') {
      // Recursively sanitize nested objects
      result[key] = sanitizePayload(value as Record<string, unknown>);
      continue;
    }

    // Primitives are kept as-is
    result[key] = value;
  }

  return result as T;
}
