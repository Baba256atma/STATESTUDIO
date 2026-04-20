/**
 * B.10.e.4 — dev-only multi-source ingestion (POST `/ingestion/multi/run`).
 * Does not bridge to fragility/scene; mirrors `homeScreenIngestionDev` single-flight style.
 */

import {
  runMultiSourceIngestion,
  type ConnectorRunInputOut,
  type MultiSourceIngestionRequest,
  type MultiSourceIngestionResponse,
} from "../lib/api/ingestionApi";

let __multiSourceInFlight = false;

/** `skipped_in_flight` when another multi-source request is already running. */
export type SubmitMultiSourceIngestionDevResult = MultiSourceIngestionResponse | null | "skipped_in_flight";

let __lastRequestLogSig: string | null = null;
let __lastResponseLogSig: string | null = null;

function buildMultiSourceRequestLogSig(payload: MultiSourceIngestionRequest): string {
  const ids = payload.sources.map((s) => String(s.connector_id ?? "").trim()).join("|");
  return JSON.stringify({
    n: payload.sources.length,
    ids,
    domain: payload.domain ?? null,
  });
}

function buildMultiSourceResponseLogSig(res: MultiSourceIngestionResponse): string {
  const m = res.bundle.merge_meta ?? {};
  return JSON.stringify({
    ok: res.ok,
    source_count: m.source_count,
    successful_source_count: m.successful_source_count,
    failed_source_count: m.failed_source_count,
    merged_signal_count: m.merged_signal_count,
    errN: res.errors.length,
    sigN: res.bundle.signals.length,
  });
}

/**
 * Calls multi-source API + dev `[Nexora][MultiSource]` traces (deduped when payload/response unchanged).
 */
export async function submitMultiSourceIngestionDev(
  payload: MultiSourceIngestionRequest,
  options?: { signal?: AbortSignal }
): Promise<SubmitMultiSourceIngestionDevResult> {
  if (__multiSourceInFlight) {
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.warn?.("[Nexora][MultiSource] skipped_in_flight");
    }
    return "skipped_in_flight";
  }
  __multiSourceInFlight = true;

  const reqSig = buildMultiSourceRequestLogSig(payload);
  if (process.env.NODE_ENV !== "production") {
    if (reqSig !== __lastRequestLogSig) {
      __lastRequestLogSig = reqSig;
      globalThis.console?.log?.("[Nexora][MultiSource] request_sent", {
        path: "/ingestion/multi/run",
        sourceCount: payload.sources.length,
        connectorIds: payload.sources.map((s) => s.connector_id),
        domain: payload.domain ?? null,
      });
    }
  }

  try {
    const res = await runMultiSourceIngestion(payload, options);
    if (process.env.NODE_ENV !== "production") {
      const respSig = buildMultiSourceResponseLogSig(res);
      if (respSig !== __lastResponseLogSig) {
        __lastResponseLogSig = respSig;
        globalThis.console?.log?.("[Nexora][MultiSource] response_received", {
          ok: res.ok,
          sourceCount: res.bundle.merge_meta?.source_count,
          successfulSourceCount: res.bundle.merge_meta?.successful_source_count,
          mergedSignalCount: res.bundle.merge_meta?.merged_signal_count,
          topErrors: res.errors.slice(0, 3),
        });
      }
    }
    return res;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      __lastResponseLogSig = null;
      globalThis.console?.error?.("[Nexora][MultiSource] request_failed", err);
    }
    return null;
  } finally {
    __multiSourceInFlight = false;
  }
}

/** B.10.f — connectors exposed in the compact product multi-source surface (aligned with backend registry). */
export const PRODUCTION_MULTI_SOURCE_CONNECTOR_IDS = ["manual_text", "web_source", "csv_upload"] as const;
export type ProductionMultiSourceConnectorId = (typeof PRODUCTION_MULTI_SOURCE_CONNECTOR_IDS)[number];

export function isProductionMultiSourceConnectorId(id: string): id is ProductionMultiSourceConnectorId {
  return (PRODUCTION_MULTI_SOURCE_CONNECTOR_IDS as readonly string[]).includes(id);
}

let __lastProductionMultiEntrySig: string | null = null;

/** Deduped dev trace when the visible product action runs (not for dev-only hooks). */
export function traceProductionMultiSourceEntry(payload: MultiSourceIngestionRequest): void {
  if (process.env.NODE_ENV === "production") return;
  const sig = JSON.stringify({
    n: payload.sources.length,
    ids: payload.sources.map((s) => s.connector_id).join("|"),
    d: payload.domain ?? null,
  });
  if (sig === __lastProductionMultiEntrySig) return;
  __lastProductionMultiEntrySig = sig;
  globalThis.console?.debug?.("[Nexora][MultiSource] production_entry_triggered", {
    sourceCount: payload.sources.length,
    connectorIds: payload.sources.map((s) => s.connector_id),
    domain: payload.domain ?? null,
  });
}

export type DevMultiSourceIngestionEventDetail = {
  sources: ConnectorRunInputOut[];
  domain?: string | null;
};

/** Shell / product UI: clear submitting state when HomeScreen finishes a product multi-source run. */
export function dispatchMultiSourceAssessmentComplete(
  ok: boolean,
  source: "product" | "dev" | "scheduled" = "product"
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nexora:multi-source-assessment-complete", { detail: { ok, source } })
  );
}

const __scheduledTriggerLogBucketById = new Map<string, number>();

/** B.11 — deduped dev trace when a scheduled assessment actually starts. */
export function traceScheduledAssessmentTriggered(definitionId: string, name: string): void {
  if (process.env.NODE_ENV === "production") return;
  const bucket = Math.floor(Date.now() / 60_000);
  if (__scheduledTriggerLogBucketById.get(definitionId) === bucket) return;
  __scheduledTriggerLogBucketById.set(definitionId, bucket);
  globalThis.console?.debug?.("[Nexora][Scheduled] assessment_triggered", {
    id: definitionId,
    name: name.slice(0, 80),
  });
}

export type UnifiedMultiSourceRunOutcome =
  | { kind: "skipped" }
  | { kind: "failed" }
  | { kind: "ran"; responseOk: boolean };

export function normalizeDevMultiSourcePayload(
  detail: DevMultiSourceIngestionEventDetail | null | undefined
): MultiSourceIngestionRequest | null {
  if (!detail || !Array.isArray(detail.sources) || detail.sources.length === 0) return null;
  const sources = detail.sources
    .map((s) => {
      const connector_id = typeof s.connector_id === "string" ? s.connector_id.trim() : "";
      if (!connector_id) return null;
      const config =
        s.config && typeof s.config === "object" && !Array.isArray(s.config)
          ? (s.config as Record<string, unknown>)
          : {};
      return { connector_id, config };
    })
    .filter((s): s is { connector_id: string; config: Record<string, unknown> } => s !== null);
  if (sources.length === 0) return null;
  const domain =
    detail.domain === undefined || detail.domain === null
      ? undefined
      : typeof detail.domain === "string"
        ? detail.domain.trim() || null
        : null;
  return { sources, ...(domain !== undefined ? { domain } : {}) };
}
