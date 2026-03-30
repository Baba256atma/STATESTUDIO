const DEFAULT_THRESHOLD_MS = 120;
const DEGRADED_ARRAY_LIMIT = 20;

function nowMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function truncateLargeArrays<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.slice(0, DEGRADED_ARRAY_LIMIT).map((entry) => truncateLargeArrays(entry)) as T;
  }
  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      output[key] = truncateLargeArrays(entry);
    });
    return output as T;
  }
  return value;
}

export function guardHeavyComputation<T>(label: string, fn: () => T, thresholdMs = DEFAULT_THRESHOLD_MS): T {
  const started = nowMs();
  const result = fn();
  const elapsed = nowMs() - started;
  if (elapsed > thresholdMs) {
    console.warn(`[Nexora][PerformanceGuard] ${label} took ${elapsed.toFixed(1)}ms`);
    return truncateLargeArrays(result);
  }
  return result;
}
