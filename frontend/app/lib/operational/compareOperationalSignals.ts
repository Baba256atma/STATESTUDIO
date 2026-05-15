import type {
  OperationalMonitoringSignal,
  OperationalMonitoringStatus,
  OperationalTrend,
} from "./monitoringTypes.ts";

/** Index signals by `id` (primary join key from monitoring derivation). */
export function indexSignalsById(
  signals: readonly OperationalMonitoringSignal[]
): ReadonlyMap<string, OperationalMonitoringSignal> {
  const m = new Map<string, OperationalMonitoringSignal>();
  for (const s of signals) {
    const id = typeof s.id === "string" ? s.id.trim() : "";
    if (id) m.set(id, s);
  }
  return m;
}

/** Fallback key when correlating by connector + object + label. */
export function buildSignalCompositeKey(signal: OperationalMonitoringSignal): string {
  const src = typeof signal.sourceId === "string" ? signal.sourceId.trim() : "";
  const obj = typeof signal.objectId === "string" ? signal.objectId.trim() : "";
  const label = typeof signal.label === "string" ? signal.label.trim() : "";
  return `${src}\u0000${obj}\u0000${label}`;
}

/** Compare clamped numeric severities in [0,1]. Returns 1 if curr higher, -1 if lower, 0 if equal within epsilon. */
export function compareSignalSeverity(prev: number, curr: number): -1 | 0 | 1 {
  const p = clamp01(prev);
  const c = clamp01(curr);
  const eps = 1e-5;
  if (c > p + eps) return 1;
  if (c < p - eps) return -1;
  return 0;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Dedupe trimmed non-empty object ids and sort for stable output. */
export function dedupeSortedObjectIds(ids: readonly string[]): readonly string[] {
  const out = [...new Set(ids.map((x) => String(x).trim()).filter(Boolean))];
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

export function trendsEqual(a: OperationalTrend, b: OperationalTrend): boolean {
  return a === b;
}

export function statusesEqual(a: OperationalMonitoringStatus, b: OperationalMonitoringStatus): boolean {
  return a === b;
}

/** Higher rank = worse operational posture for aggregate status. */
export function rankOperationalStatus(status: OperationalMonitoringStatus): number {
  switch (status) {
    case "idle":
      return 0;
    case "unknown":
      return 1;
    case "watching":
      return 2;
    case "recovering":
      return 2.5;
    case "degraded":
      return 3;
    case "critical":
      return 4;
    default:
      return 0;
  }
}

export function isStatusWorse(
  prev: OperationalMonitoringStatus,
  curr: OperationalMonitoringStatus
): boolean {
  return rankOperationalStatus(curr) > rankOperationalStatus(prev);
}

export function isStatusBetter(
  prev: OperationalMonitoringStatus,
  curr: OperationalMonitoringStatus
): boolean {
  return rankOperationalStatus(curr) < rankOperationalStatus(prev);
}

/** Higher rank = more risk in trend dimension. */
export function rankTrendForRisk(trend: OperationalTrend): number {
  switch (trend) {
    case "improving":
      return 0;
    case "stable":
      return 1;
    case "unknown":
      return 2;
    case "volatile":
      return 3;
    case "degrading":
      return 4;
    default:
      return 2;
  }
}

export function isTrendWorse(prev: OperationalTrend, curr: OperationalTrend): boolean {
  return rankTrendForRisk(curr) > rankTrendForRisk(prev);
}

export function isTrendBetter(prev: OperationalTrend, curr: OperationalTrend): boolean {
  return rankTrendForRisk(curr) < rankTrendForRisk(prev);
}
