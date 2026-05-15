import type { NormalizedExternalOperationalSignal } from "../connectors/externalSignalTypes.ts";
import { stableSignature } from "../intelligence/shared/dedupe.ts";
import { clamp01, uniqueStrings } from "../intelligence/shared/normalization.ts";
import type {
  OperationalMonitoringSignal,
  OperationalMonitoringSnapshot,
  OperationalMonitoringStatus,
  OperationalTrend,
} from "./monitoringTypes.ts";

export type DeriveOperationalMonitoringSnapshotInput = Readonly<{
  /** Optional stable id; otherwise derived from record content. */
  id?: string;
  records: readonly NormalizedExternalOperationalSignal[];
  /** Epoch ms for `updatedAt` and relative ordering when timestamps tie. */
  now?: number;
}>;

const EMPTY_SUMMARY = "No live operational signals detected yet.";
const EMPTY_FOCUS = "Connect or upload operational data to begin monitoring.";

function toIsoDetectedAt(timestamp: number): string {
  const ms = timestamp > 0 && timestamp < 1e12 ? Math.round(timestamp * 1000) : Math.round(timestamp);
  const d = new Date(Number.isFinite(ms) && ms > 0 ? ms : Date.now());
  return d.toISOString();
}

function humanizeSignalType(signalType: string): string {
  const t = signalType.trim() || "operational signal";
  return t
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveSeriesTrend(sorted: readonly { severity: number }[]): OperationalTrend {
  if (sorted.length < 2) return "unknown";
  const sev = sorted.map((s) => clamp01(s.severity));
  const first = sev[0] ?? 0;
  const last = sev[sev.length - 1] ?? 0;
  if (last > first + 0.08) return "degrading";
  if (last < first - 0.08) return "improving";
  const mean = sev.reduce((a, b) => a + b, 0) / sev.length;
  const variance = sev.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / Math.max(1, sev.length);
  if (variance > 0.06) return "volatile";
  return "stable";
}

function deriveOverallStatus(params: {
  maxSeverity: number;
  trend: OperationalTrend;
  hasSignals: boolean;
}): OperationalMonitoringStatus {
  if (!params.hasSignals) return "idle";
  const max = clamp01(params.maxSeverity);
  if (params.trend === "improving" && max >= 0.7) return "recovering";
  if (max >= 0.85) return "critical";
  if (max >= 0.55) return "degraded";
  return "watching";
}

function signalConfidence(severity: number, objectHintCount: number): number {
  const base = 0.45 + clamp01(severity) * 0.45;
  const hintBoost = Math.min(0.1, objectHintCount * 0.03);
  return clamp01(base + hintBoost);
}

function perSignalTrend(
  globalTrend: OperationalTrend,
  index: number,
  prevSeverity: number | null,
  nextSeverity: number | null,
  selfSeverity: number
): OperationalTrend {
  if (globalTrend === "volatile") return "volatile";
  if (prevSeverity == null && nextSeverity == null) return globalTrend === "unknown" ? "unknown" : globalTrend;
  const neighbors: number[] = [];
  if (prevSeverity != null) neighbors.push(prevSeverity);
  if (nextSeverity != null) neighbors.push(nextSeverity);
  if (neighbors.length === 0) return globalTrend;
  const avg = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
  if (selfSeverity > avg + 0.06) return "degrading";
  if (selfSeverity < avg - 0.06) return "improving";
  return "stable";
}

function pickTopRiskObjectId(
  records: readonly NormalizedExternalOperationalSignal[],
  maxSeverity: number
): string | undefined {
  const candidates = records.filter((r) => clamp01(r.severity) >= maxSeverity - 1e-6);
  const scores = new Map<string, number>();
  for (const r of candidates) {
    const w = clamp01(r.severity);
    for (const oid of r.objectHints) {
      const key = String(oid).trim();
      if (!key) continue;
      scores.set(key, (scores.get(key) ?? 0) + w);
    }
  }
  let best: string | undefined;
  let bestScore = -1;
  for (const [oid, sc] of scores) {
    if (sc > bestScore) {
      bestScore = sc;
      best = oid;
    }
  }
  return best;
}

function buildSummary(params: {
  count: number;
  maxSeverity: number;
  status: OperationalMonitoringStatus;
  topType: string;
}): string {
  if (params.count === 0) return EMPTY_SUMMARY;
  const pct = Math.round(clamp01(params.maxSeverity) * 100);
  return `${params.count} operational signal${params.count === 1 ? "" : "s"}; peak severity ${pct}%. Status: ${params.status}. Dominant pattern: ${humanizeSignalType(params.topType)}.`;
}

function buildRecommendedFocus(status: OperationalMonitoringStatus, trend: OperationalTrend): string {
  if (status === "idle") return EMPTY_FOCUS;
  if (status === "critical") return "Prioritize incident response and validate upstream systems before expanding scope.";
  if (status === "degraded") return "Review affected objects and recent changes; stabilize inputs before automation.";
  if (status === "recovering") return "Trend is improving—keep monitoring until severity returns to normal range.";
  if (trend === "volatile") return "Signals are volatile; narrow the time window and confirm data quality.";
  if (status === "watching") return "Continue monitoring; no immediate escalation, but watch for sustained elevation.";
  return "Review operational signals and align owners for highlighted objects.";
}

/**
 * Pure read-model: maps normalized D3 operational signals into a monitoring snapshot for UI panels.
 * Does not mutate `records` or call network/streaming APIs, connector transports, or WebSocket clients.
 */
export function deriveOperationalMonitoringSnapshot(
  input?: DeriveOperationalMonitoringSnapshotInput | null
): OperationalMonitoringSnapshot {
  const nowMs = typeof input?.now === "number" && Number.isFinite(input.now) ? input.now : Date.now();
  const updatedAt = new Date(nowMs).toISOString();

  const rawRecords = input?.records ?? [];
  const records = [...rawRecords].sort((a, b) => {
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    return a.id.localeCompare(b.id);
  });

  if (records.length === 0) {
    const id = input?.id?.trim() || "monitoring:empty";
    return {
      id,
      status: "idle",
      trend: "unknown",
      signals: [],
      affectedObjectIds: [],
      summary: EMPTY_SUMMARY,
      recommendedFocus: EMPTY_FOCUS,
      updatedAt,
    };
  }

  const maxSeverity = Math.max(...records.map((r) => clamp01(r.severity)));
  const trend = deriveSeriesTrend(records);
  const status = deriveOverallStatus({ maxSeverity, trend, hasSignals: true });
  const affectedObjectIds = uniqueStrings(
    records.flatMap((r) => r.objectHints.map((h) => String(h)))
  ) as readonly string[];

  const topType = records.reduce(
    (best, r) => (clamp01(r.severity) >= clamp01(best.severity) ? r : best),
    records[0]!
  ).signalType;

  const topRiskObjectId = pickTopRiskObjectId(records, maxSeverity);

  const signals: OperationalMonitoringSignal[] = records.map((r, i) => {
    const sev = clamp01(r.severity);
    const prev = i > 0 ? clamp01(records[i - 1]!.severity) : null;
    const next = i < records.length - 1 ? clamp01(records[i + 1]!.severity) : null;
    const st = perSignalTrend(trend, i, prev, next, sev);
    const primaryObject = r.objectHints.map((h) => String(h).trim()).find(Boolean);
    const msg = `${humanizeSignalType(r.signalType)} from ${r.sourceConnectorId}${primaryObject ? ` (object ${primaryObject})` : ""}.`;
    return {
      id: r.id,
      sourceId: r.sourceConnectorId,
      ...(primaryObject ? { objectId: primaryObject } : {}),
      label: humanizeSignalType(r.signalType),
      severity: sev,
      trend: st,
      message: msg,
      detectedAt: toIsoDetectedAt(r.timestamp),
      confidence: signalConfidence(sev, r.objectHints.length),
    };
  });

  const snapshotId =
    input?.id?.trim() ||
    `monitoring:${stableSignature(records.map((r) => ({ i: r.id, s: clamp01(r.severity), t: r.timestamp })))}`;

  return {
    id: snapshotId,
    status,
    trend,
    signals,
    affectedObjectIds,
    ...(topRiskObjectId ? { topRiskObjectId } : {}),
    summary: buildSummary({ count: records.length, maxSeverity, status, topType }),
    recommendedFocus: buildRecommendedFocus(status, trend),
    updatedAt,
  };
}
