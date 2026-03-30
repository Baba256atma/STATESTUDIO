export type DecisionTraceEvent = {
  stage:
    | "reasoning"
    | "simulation"
    | "recommendation"
    | "execution"
    | "feedback"
    | "pipeline_complete";
  projectId?: string | null;
  timestamp: number;
  confidence?: number | null;
  summary: string;
  metadata?: Record<string, unknown>;
};

const TRACE_STORAGE_KEY = "nexora.aiTraceLog.v1";
const TRACE_LIMIT = 200;

let traceBuffer: DecisionTraceEvent[] = [];
let hydrated = false;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function hydrateTraceBuffer() {
  if (hydrated || !canUseStorage()) return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(TRACE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      traceBuffer = parsed.slice(-TRACE_LIMIT);
    }
  } catch {
    traceBuffer = [];
  }
}

function persistTraceBuffer() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(TRACE_STORAGE_KEY, JSON.stringify(traceBuffer.slice(-TRACE_LIMIT)));
  } catch {
    // Ignore storage failures; trace logging is best-effort.
  }
}

export function logDecisionTrace(event: DecisionTraceEvent): void {
  hydrateTraceBuffer();
  const normalized: DecisionTraceEvent = {
    stage: event.stage,
    projectId: event.projectId ?? null,
    timestamp: Number.isFinite(event.timestamp) ? event.timestamp : Date.now(),
    confidence:
      typeof event.confidence === "number" && Number.isFinite(event.confidence) ? event.confidence : null,
    summary: String(event.summary ?? "").trim() || "Decision trace event",
    metadata: event.metadata ?? undefined,
  };
  traceBuffer = [...traceBuffer, normalized].slice(-TRACE_LIMIT);
  persistTraceBuffer();
}

export function getRecentTraces(limit = 50): DecisionTraceEvent[] {
  hydrateTraceBuffer();
  return traceBuffer.slice(-Math.max(1, Math.min(limit, TRACE_LIMIT))).reverse();
}

export function getTraceByProject(projectId: string | null | undefined): DecisionTraceEvent[] {
  hydrateTraceBuffer();
  const target = String(projectId ?? "").trim();
  if (!target) return [];
  return traceBuffer.filter((entry) => String(entry.projectId ?? "") === target).reverse();
}
