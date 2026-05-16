/**
 * Dev-only timing for D3 derivations. Safe in browser + SSR (performance with Date.now fallback).
 */

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

export function runD3DevTimed<T>(label: string, fn: () => T): T {
  const startedAt = monotonicNowMs();

  try {
    return fn();
  } finally {
    if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
      const durationMs = Math.round((monotonicNowMs() - startedAt) * 100) / 100;
      globalThis.console?.debug?.("[Nexora][D3DevTimed]", {
        label,
        durationMs,
      });
    }
  }
}
