/**
 * B.26 — Single delayed retry for likely network failures only.
 */

import { NexoraError, toNexoraError } from "./nexoraErrors";
import { emitNexoraB26RetryAttempt } from "./nexoraReliabilityLog";

const RETRY_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isLikelyNetworkFailure(e: unknown): boolean {
  if (e instanceof TypeError) return true;
  if (e instanceof NexoraError && e.code === "network") return true;
  const m = e instanceof Error ? e.message : String(e ?? "");
  return /failed to fetch|networkerror|network request failed|load failed|econnrefused|enotfound|aborted|abort/i.test(m);
}

/**
 * Runs `fn` once; on likely network failure waits 300ms and runs `fn` one more time.
 * Does not retry HTTP 4xx/5xx (unless also classified as network by message heuristics).
 */
export async function withSingleNetworkRetry<T>(endpoint: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (first: unknown) {
    const wrapped = toNexoraError(first);
    if (!isLikelyNetworkFailure(first) && wrapped.code !== "network") {
      throw wrapped;
    }
    emitNexoraB26RetryAttempt(endpoint);
    await delay(RETRY_DELAY_MS);
    try {
      return await fn();
    } catch (second: unknown) {
      throw toNexoraError(second);
    }
  }
}
