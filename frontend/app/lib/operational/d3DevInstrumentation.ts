/**
 * Dev-only timing for D3 derivations. Safe in browser + SSR (performance with Date.now fallback).
 */

import { devLogOnSignatureChange } from "../runtime/diagnosticIdleGate";

function monotonicNowMs(): number {
  try {
    const perf = globalThis.performance;
    if (perf && typeof perf.now === "function") {
      return perf.now();
    }
  } catch {
    // ignore
  }
  return Date.now();
}

const d3DevTimedLastLoggedAtBySignature = new Map<string, number>();
const d3DevTimedLastEventSignatureByLabel = new Map<string, string>();
const d3DevTimedLastSkippedSignatureByLabel = new Map<string, string>();
const D3_DEV_TIMED_LOG_WINDOW_MS = 5_000;
const D3_DEV_TIMED_DURATION_BUCKET_MS = 50;

function durationBucketMs(durationMs: number): number {
  if (!Number.isFinite(durationMs)) return 0;
  return Math.round(durationMs / D3_DEV_TIMED_DURATION_BUCKET_MS) * D3_DEV_TIMED_DURATION_BUCKET_MS;
}

function shouldLogD3DevTimed(label: string, bucketMs: number, nowMs: number): boolean {
  const signature = `${label}:${bucketMs}`;
  const lastLoggedAt = d3DevTimedLastLoggedAtBySignature.get(signature);
  if (lastLoggedAt !== undefined && nowMs - lastLoggedAt < D3_DEV_TIMED_LOG_WINDOW_MS) {
    return false;
  }
  d3DevTimedLastLoggedAtBySignature.set(signature, nowMs);
  return true;
}

export function runD3DevTimed<T>(label: string, fn: () => T): T {
  return runD3DevTimedWithSignature(label, "__runtime__", fn);
}

export function runD3DevTimedWithSignature<T>(
  label: string,
  inputSignature: string,
  fn: () => T
): T {
  const startedAt = monotonicNowMs();

  try {
    return fn();
  } finally {
    if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
      const finishedAt = monotonicNowMs();
      const durationMs = Math.round((finishedAt - startedAt) * 100) / 100;
      const bucketMs = durationBucketMs(durationMs);
      const eventSignature = `${inputSignature}:${bucketMs}`;
      if (d3DevTimedLastEventSignatureByLabel.get(label) === eventSignature) {
        if (d3DevTimedLastSkippedSignatureByLabel.get(label) !== eventSignature) {
          d3DevTimedLastSkippedSignatureByLabel.set(label, eventSignature);
          devLogOnSignatureChange("[Nexora][D3DevTimedSkipped]", `${label}:${eventSignature}`, {
            label,
            inputSignature,
            durationBucketMs: bucketMs,
          });
        }
      } else {
        d3DevTimedLastEventSignatureByLabel.set(label, eventSignature);
        d3DevTimedLastSkippedSignatureByLabel.delete(label);
        if (shouldLogD3DevTimed(label, bucketMs, finishedAt)) {
          devLogOnSignatureChange("[Nexora][D3DevTimed]", `${label}:${inputSignature}:${bucketMs}`, {
            label,
            inputSignature,
            durationMs,
            durationBucketMs: bucketMs,
          });
        }
      }
    }
  }
}
