/**
 * Dev-only timing for D3 derivations. No-op in production; avoids noisy logs (threshold ms).
 */

const D3_TIMING_LOG_THRESHOLD_MS = 18;

export function runD3DevTimed<T>(label: string, fn: () => T): T {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return fn();
  }
  const perf = typeof globalThis !== "undefined" ? (globalThis as unknown as { performance?: { now: () => number } }).performance : undefined;
  const t0 = typeof perf?.now === "function" ? perf.now() : Date.now();
  try {
    return fn();
  } finally {
    const t1 = typeof perf?.now === "function" ? perf.now() : Date.now();
    const ms = t1 - t0;
    if (ms >= D3_TIMING_LOG_THRESHOLD_MS && typeof globalThis !== "undefined" && globalThis.console?.debug) {
      globalThis.console.debug(`[Nexora][D3][timing] ${label} ${ms.toFixed(1)}ms`);
    }
  }
}
