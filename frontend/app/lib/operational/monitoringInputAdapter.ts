/**
 * Bridges pipeline HUD / dev pipeline events into `NormalizedExternalOperationalSignal` records for D3 monitoring.
 * Does not call connector transports, HTTP, or WebSockets — ingestion remains upstream of this adapter.
 */
import type { NexoraDomainId } from "../domain/domainTypes.ts";
import type { NormalizedExternalOperationalSignal } from "../connectors/externalSignalTypes.ts";
import { stableSignalKey } from "../intelligence/shared/dedupe.ts";
import type { TypeCPipelineEvent } from "../typec/typeCPipelineTracker.ts";
import type { DeriveOperationalMonitoringSnapshotInput } from "./deriveMonitoringSnapshot.ts";

/** Minimal pipeline HUD fields (mirrors `NexoraPipelineStatusUi` subset; avoids `lib` → `screens` imports). */
export type OperationalPipelineStatusBrief = Readonly<{
  status: "idle" | "processing" | "ready" | "error";
  source: "ingestion" | "chat" | "scanner" | null;
  signalsCount: number;
  mappedObjectsCount: number;
  fragilityLevel: "low" | "medium" | "high" | "critical" | null;
  summary: string | null;
  insightLine: string | null;
  errorMessage: string | null;
  updatedAt: number | null;
}>;

export type ToMonitoringSnapshotInputSource = Readonly<{
  pipelineEvents?: readonly TypeCPipelineEvent[] | null;
  pipelineStatus?: OperationalPipelineStatusBrief | null;
}>;

const DEFAULT_DOMAIN: NexoraDomainId = "general";

function severityFromFragility(fragility: OperationalPipelineStatusBrief["fragilityLevel"]): number {
  switch (fragility) {
    case "critical":
      return 0.92;
    case "high":
      return 0.72;
    case "medium":
      return 0.52;
    case "low":
      return 0.28;
    default:
      return 0.22;
  }
}

function severityFromPipelineStep(step: TypeCPipelineEvent["step"], reason?: string | null): number {
  const r = typeof reason === "string" ? reason.toLowerCase() : "";
  if (r.includes("fail") || r.includes("error")) return 0.88;
  switch (step) {
    case "skipped":
    case "deduped":
      return 0.18;
    case "decision_readiness_snapshot":
      return 0.42;
    case "scenario_draft_created":
    case "scenario_selected":
    case "scenario_ready_for_decision":
      return 0.58;
    case "executive_summary_created":
    case "decision_draft_created":
      return 0.55;
    case "intent_detected":
    case "object_added":
    case "system_model_added":
      return 0.48;
    default:
      return 0.32;
  }
}

function parsePipelineEventTimestamp(iso: string | undefined): number {
  if (typeof iso !== "string" || !iso.trim()) return 0;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

function mapPipelineEventToSignal(event: TypeCPipelineEvent): NormalizedExternalOperationalSignal | null {
  if (!event || typeof event !== "object") return null;
  if (typeof event.id !== "string" || !event.id.trim()) return null;
  const step = event.step ?? "skipped";
  const ts = parsePipelineEventTimestamp(event.timestamp);
  const objectHints = Array.isArray(event.objectIds)
    ? event.objectIds.map((o) => String(o).trim()).filter(Boolean)
    : [];
  const signalType =
    typeof event.intentType === "string" && event.intentType.trim()
      ? `${step}:${event.intentType.trim()}`
      : step;
  const severity = severityFromPipelineStep(step, event.reason ?? null);
  const ingestionSignature =
    stableSignalKey({
      type: `typec_pipeline:${signalType}`,
      sourceId: event.id,
      relatedObjectIds: objectHints,
    }) || `typec_pipeline|${event.id}`;

  return {
    id: event.id,
    sourceConnectorId: "typec_pipeline",
    signalType,
    severity,
    objectHints,
    domainHints: [DEFAULT_DOMAIN],
    payload: {
      step,
      intentType: event.intentType ?? null,
      scenarioId: event.scenarioId ?? null,
      reason: event.reason ?? null,
      input: event.input ?? null,
    },
    timestamp: ts > 0 ? ts : Date.now(),
    ingestionSignature,
  };
}

function shouldEmitPipelineStatusSignal(status: OperationalPipelineStatusBrief | null | undefined): boolean {
  if (!status) return false;
  if (status.status !== "idle") return true;
  if (status.signalsCount > 0) return true;
  if (status.mappedObjectsCount > 0) return true;
  if (status.fragilityLevel != null) return true;
  if (typeof status.summary === "string" && status.summary.trim().length > 0) return true;
  if (typeof status.insightLine === "string" && status.insightLine.trim().length > 0) return true;
  if (typeof status.errorMessage === "string" && status.errorMessage.trim().length > 0) return true;
  return false;
}

function mapPipelineStatusToSignal(status: OperationalPipelineStatusBrief): NormalizedExternalOperationalSignal {
  const baseSev = severityFromFragility(status.fragilityLevel);
  const severity =
    status.status === "error" ? Math.max(baseSev, 0.78) : status.status === "processing" ? Math.max(baseSev, 0.38) : baseSev;
  const updatedAt = typeof status.updatedAt === "number" && Number.isFinite(status.updatedAt) ? status.updatedAt : Date.now();
  const id = `nexora_pipeline_status:${updatedAt}:${status.status}`;
  const signalType = `pipeline_${status.status}`;
  const summaryText = status.summary?.trim() || status.insightLine?.trim() || status.errorMessage?.trim() || status.status;
  const ingestionSignature =
    stableSignalKey({
      type: `nexora_pipeline:${signalType}`,
      sourceId: id,
      relatedObjectIds: [],
    }) || id;

  return {
    id,
    sourceConnectorId: status.source ? `pipeline:${status.source}` : "nexora_pipeline",
    signalType,
    severity,
    objectHints: [],
    domainHints: [DEFAULT_DOMAIN],
    payload: {
      summary: status.summary,
      insightLine: status.insightLine,
      errorMessage: status.errorMessage,
      signalsCount: status.signalsCount,
      mappedObjectsCount: status.mappedObjectsCount,
      message: summaryText,
    },
    timestamp: updatedAt,
    ingestionSignature,
  };
}

/**
 * Maps existing Type-C pipeline events + compact pipeline HUD status into normalized records
 * for `deriveOperationalMonitoringSnapshot`. Does not mutate inputs.
 */
export function toMonitoringSnapshotInput(
  source?: ToMonitoringSnapshotInputSource | null
): DeriveOperationalMonitoringSnapshotInput {
  const out: NormalizedExternalOperationalSignal[] = [];

  const events = source?.pipelineEvents;
  if (Array.isArray(events)) {
    for (const ev of events) {
      const mapped = mapPipelineEventToSignal(ev);
      if (mapped) out.push(mapped);
    }
  }

  const st = source?.pipelineStatus;
  if (shouldEmitPipelineStatusSignal(st) && st) {
    out.push(mapPipelineStatusToSignal(st));
  }

  return { records: out };
}
