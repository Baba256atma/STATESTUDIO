/**
 * B.28 — Pilot metrics / usage review (local only; no backend or analytics SDK).
 */

export type NexoraMetricEvent =
  | "input_submitted"
  | "analysis_completed"
  | "compare_opened"
  | "decision_made"
  | "outcome_recorded"
  | "replay_used"
  | "error_occurred";

export type NexoraMetricRecord = {
  event: NexoraMetricEvent;
  timestamp: number;
  runId?: string;
  mode?: "adaptive" | "pure";
};

const STORAGE_KEY = "nexora.metrics.v1";
const MAX_RECORDS = 200;

function parseStored(raw: string | null): NexoraMetricRecord[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const out: NexoraMetricRecord[] = [];
    for (const row of parsed) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      const event = o.event as NexoraMetricEvent | undefined;
      const ts = typeof o.timestamp === "number" ? o.timestamp : Number(o.timestamp);
      if (!event || !Number.isFinite(ts)) continue;
      const allowed: NexoraMetricEvent[] = [
        "input_submitted",
        "analysis_completed",
        "compare_opened",
        "decision_made",
        "outcome_recorded",
        "replay_used",
        "error_occurred",
      ];
      if (!allowed.includes(event)) continue;
      const rec: NexoraMetricRecord = { event, timestamp: ts };
      if (typeof o.runId === "string" && o.runId.trim()) rec.runId = o.runId.trim();
      if (o.mode === "adaptive" || o.mode === "pure") rec.mode = o.mode;
      out.push(rec);
    }
    return out;
  } catch {
    return [];
  }
}

export function loadNexoraMetricRecords(): NexoraMetricRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function persistRecords(next: NexoraMetricRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed = next.length > MAX_RECORDS ? next.slice(next.length - MAX_RECORDS) : next;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* ignore quota / privacy mode */
  }
}

export function logNexoraMetric(event: NexoraMetricEvent, data?: Partial<NexoraMetricRecord>): void {
  const record: NexoraMetricRecord = {
    event,
    timestamp: Date.now(),
    ...(data ?? {}),
  };
  if (typeof window !== "undefined") {
    const prev = loadNexoraMetricRecords();
    persistRecords([...prev, record]);
  }
  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[Nexora][B28] metric_logged", record);
  }
}

export function clearNexoraMetricsStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export type NexoraMetricsSummary = {
  totalRuns: number;
  completedRuns: number;
  compareRate: number;
  decisionRate: number;
  outcomeRate: number;
  errorRate: number;
};

export function buildNexoraMetricsSummary(records: NexoraMetricRecord[]): NexoraMetricsSummary {
  const inputs = records.filter((r) => r.event === "input_submitted").length;
  const compare = records.filter((r) => r.event === "compare_opened").length;
  const decision = records.filter((r) => r.event === "decision_made").length;
  const outcome = records.filter((r) => r.event === "outcome_recorded").length;
  const errors = records.filter((r) => r.event === "error_occurred").length;
  const base = inputs;
  const denom = Math.max(1, base);
  return {
    totalRuns: inputs,
    completedRuns: outcome,
    compareRate: base === 0 ? 0 : Math.min(1, compare / denom),
    decisionRate: base === 0 ? 0 : Math.min(1, decision / denom),
    outcomeRate: base === 0 ? 0 : Math.min(1, outcome / denom),
    errorRate: base === 0 ? 0 : Math.min(1, errors / denom),
  };
}

export type NexoraMetricDropoff = { label: string; rate: number };

export function buildNexoraMetricDropoffs(records: NexoraMetricRecord[]): NexoraMetricDropoff[] {
  const A = records.filter((r) => r.event === "input_submitted").length;
  const B = records.filter((r) => r.event === "analysis_completed").length;
  const C = records.filter((r) => r.event === "compare_opened").length;
  const D = records.filter((r) => r.event === "decision_made").length;
  const E = records.filter((r) => r.event === "outcome_recorded").length;
  const drops: NexoraMetricDropoff[] = [];
  drops.push({
    label: "Input → Analysis",
    rate: A > 0 ? 1 - B / A : 0,
  });
  drops.push({
    label: "Analysis → Compare",
    rate: B > 0 ? 1 - C / B : 0,
  });
  drops.push({
    label: "Compare → Decision",
    rate: C > 0 ? 1 - D / C : 0,
  });
  drops.push({
    label: "Decision → Outcome",
    rate: D > 0 ? 1 - E / D : 0,
  });
  return drops;
}

export function describeBiggestMetricsDropoff(records: NexoraMetricRecord[]): string {
  const drops = buildNexoraMetricDropoffs(records);
  const meaningful = drops.filter((d) => d.rate > 0);
  if (meaningful.length === 0) {
    return "No drop-off signal yet — run a few flows.";
  }
  const worst = meaningful.reduce((a, b) => (b.rate > a.rate ? b : a));
  return `Biggest drop: ${worst.label}`;
}

export function formatMetricPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
