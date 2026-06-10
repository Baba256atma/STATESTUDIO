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

const loggedPerformanceGuardSignatures = new Set<string>();

function reportDashboardTraceFromGuard(label: string, elapsed: number, signature?: string): void {
  if (label !== "executive_dashboard_decision_trace") return;
  if (process.env.NODE_ENV === "production") return;
  void import("../dashboard/dashboardPerformanceMetrics.ts").then(({ reportDashboardTrace }) => {
    reportDashboardTrace({
      phase: "performance_guard",
      signature: signature ?? label,
      durationMs: elapsed,
      fromCache: false,
      source: "PerformanceGuard",
    });
  });
}

export function resetPerformanceGuardForTests(): void {
  loggedPerformanceGuardSignatures.clear();
}

export function guardHeavyComputation<T>(
  label: string,
  fn: () => T,
  thresholdMs = DEFAULT_THRESHOLD_MS,
  options?: { fromCache?: boolean; signature?: string }
): T {
  if (options?.fromCache) {
    return fn();
  }
  const started = nowMs();
  const result = fn();
  const elapsed = nowMs() - started;
  if (elapsed > thresholdMs) {
    const guardSignature = options?.signature ?? `${label}:slow`;
    const guardKey = `${label}:${guardSignature}`;
    if (!loggedPerformanceGuardSignatures.has(guardKey)) {
      loggedPerformanceGuardSignatures.add(guardKey);
      console.warn(`[Nexora][PerformanceGuard] ${label} took ${elapsed.toFixed(1)}ms`);
      reportDashboardTraceFromGuard(label, elapsed, options?.signature);
    }
    return truncateLargeArrays(result);
  }
  return result;
}
