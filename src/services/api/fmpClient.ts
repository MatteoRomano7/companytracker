// =============================================================================
// FMP API Client — Server-side HTTP wrapper with retry and rate-limiting
// Base URL: https://financialmodelingprep.com
// =============================================================================

import { FMPApiError } from '@/types';

/**
 * FMP API base URL for all endpoints.
 */
export const FMP_BASE_URL = 'https://financialmodelingprep.com';

/**
 * Maximum retry attempts for failed requests.
 */
const MAX_RETRIES = 3;

/**
 * Initial backoff delay in milliseconds.
 */
const INITIAL_BACKOFF_MS = 1000;

/**
 * Maximum backoff delay in milliseconds.
 */
const MAX_BACKOFF_MS = 8000;

/**
 * Custom error class for FMP API errors with structured metadata.
 */
export class FMPError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
    public readonly retryAttempt?: number
  ) {
    super(message);
    this.name = 'FMPError';
  }
}

/**
 * Custom error class for schema validation failures.
 */
export class ApiSchemaError extends Error {
  constructor(
    message: string,
    public readonly rawResponse: unknown
  ) {
    super(message);
    this.name = 'ApiSchemaError';
  }
}

/**
 * Custom error class for network failures after retry exhaustion.
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly originalError: unknown
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Custom error class for rate limit exceeded scenarios.
 */
export class RateLimitedError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'RateLimitedError';
  }
}

/**
 * Adds exponential backoff with jitter to retry delays.
 *
 * @param attempt - Current retry attempt (0-indexed).
 * @returns Delay in milliseconds.
 */
function calculateBackoff(attempt: number): number {
  const exponentialDelay = INITIAL_BACKOFF_MS * Math.pow(2, attempt);
  const cappedDelay = Math.min(exponentialDelay, MAX_BACKOFF_MS);
  // Add jitter: random value between 0 and 25% of the delay
  const jitter = Math.random() * cappedDelay * 0.25;
  return cappedDelay + jitter;
}

/**
 * Sleeps for the specified number of milliseconds.
 *
 * @param ms - Milliseconds to sleep.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that the API key is available in the environment.
 *
 * @throws {FMPError} If API key is not configured.
 */
function validateApiKey(): void {
  if (!process.env.FMP_API_KEY) {
    throw new FMPError(
      'FMP_API_KEY environment variable is not configured. Cannot proceed with API requests.',
      undefined,
      undefined,
      undefined
    );
  }
}

/**
 * Checks if a response is a valid FMP API error response.
 *
 * @param data - The parsed JSON response.
 * @returns True if the response contains an FMP error message.
 */
function isFMPApiError(data: unknown): data is FMPApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('Error Message' in data || 'message' in data)
  );
}

/**
 * Core FMP fetch function with retry, rate-limiting, and error handling.
 *
 * @template T - Expected response type.
 * @param endpoint - API endpoint path (e.g., "/stable/search-symbol").
 * @param params - Optional query parameters (apikey is appended automatically).
 * @returns Promise resolving to the typed response.
 *
 * @throws {FMPError} On HTTP 4xx/5xx errors after retries are exhausted.
 * @throws {NetworkError} On network failures after retries are exhausted.
 * @throws {RateLimitedError} On HTTP 429 after retries are exhausted.
 * @throws {ApiSchemaError} If response cannot be parsed as JSON or doesn't match expected structure.
 *
 * @example
 * ```ts
 * const results = await fmpFetch<FMPSearchResponse>('/stable/search-symbol', { query: 'AAPL' });
 * ```
 */
export async function fmpFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  validateApiKey();

  const apiKey = process.env.FMP_API_KEY!;
  const queryParams = new URLSearchParams({
    ...params,
    apikey: apiKey,
  });

  const url = `${FMP_BASE_URL}${endpoint}?${queryParams.toString()}`;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Disable caching for real-time financial data
        cache: 'no-store',
      });

      // Handle rate limiting (HTTP 429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const retryDelayMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : calculateBackoff(attempt);

        console.warn(
          `[FMP Client] Rate limited on ${endpoint}. Retrying after ${retryDelayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
        );

        if (attempt < MAX_RETRIES - 1) {
          await sleep(retryDelayMs);
          continue;
        } else {
          throw new RateLimitedError(
            `Rate limit exceeded for ${endpoint}. Retry after ${retryDelayMs}ms.`,
            retryDelayMs
          );
        }
      }

      // Handle other HTTP errors
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status} ${response.statusText}`;
        let shouldRetry = false;

        // Attempt to parse error body
        try {
          const errorData = await response.json();
          if (isFMPApiError(errorData)) {
            errorMessage = errorData['Error Message'] || errorData.message || errorMessage;
          }
        } catch {
          // If JSON parsing fails, use default error message
        }

        // Retry on 5xx server errors
        if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
          shouldRetry = true;
          const backoffMs = calculateBackoff(attempt);
          console.warn(
            `[FMP Client] Server error ${response.status} on ${endpoint}. Retrying after ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
          );
          await sleep(backoffMs);
          continue;
        }

        if (!shouldRetry) {
          throw new FMPError(errorMessage, response.status, endpoint, attempt);
        }
      }

      // Parse JSON response
      let data: unknown;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new ApiSchemaError(
          `Failed to parse JSON response from ${endpoint}`,
          parseError
        );
      }

      // Log raw response for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[FMP Client] Response from ${endpoint}:`, data);
      }

      // Return typed response (caller is responsible for runtime validation)
      return data as T;
    } catch (error) {
      // If it's one of our custom errors, rethrow immediately
      if (
        error instanceof FMPError ||
        error instanceof ApiSchemaError ||
        error instanceof RateLimitedError
      ) {
        throw error;
      }

      // Handle network errors with retry
      if (attempt < MAX_RETRIES - 1) {
        const backoffMs = calculateBackoff(attempt);
        console.warn(
          `[FMP Client] Network error on ${endpoint}. Retrying after ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
          error
        );
        await sleep(backoffMs);
        continue;
      } else {
        throw new NetworkError(
          `Network request failed after ${MAX_RETRIES} attempts: ${endpoint}`,
          error
        );
      }
    }
  }

  // This should never be reached due to the loop logic, but TypeScript requires it
  throw new NetworkError(
    `Request to ${endpoint} failed after ${MAX_RETRIES} attempts`,
    undefined
  );
}
