/**
 * Phase B.1+ — manual text ingestion client (used by production and dev entry paths; dev-only console traces).
 */

import {
  fetchConnectorCatalog,
  runTextIngestion,
  type TextIngestionRequest,
  type TextIngestionResponse,
} from "../lib/api/ingestionApi";

let __ingestionInFlight = false;

export type HomeScreenLastIngestion = TextIngestionResponse | null;

/** `skipped_in_flight` when another manual ingestion request is already running (single-flight guard). */
export type SubmitManualTextIngestionResult = TextIngestionResponse | null | "skipped_in_flight";

export async function prefetchIngestionConnectorCatalogDev(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  try {
    await fetchConnectorCatalog();
  } catch (e) {
    globalThis.console?.error?.("[Nexora][IngestionUI] request_failed", { context: "connector_catalog", error: e });
  }
}

/**
 * Single entry for manual text ingestion from HomeScreen: calls API + dev-only `[Nexora][IngestionUI]` traces.
 * Returns `null` on network/parse failure, `skipped_in_flight` if a call is already in progress.
 */
export async function submitManualTextIngestion(
  payload: TextIngestionRequest,
  options?: { signal?: AbortSignal }
): Promise<SubmitManualTextIngestionResult> {
  if (__ingestionInFlight) {
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.warn?.("[Nexora][IngestionUI] skipped_duplicate_request");
    }
    return "skipped_in_flight";
  }
  __ingestionInFlight = true;

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.log?.("[Nexora][IngestionUI] request_sent", {
      path: "/ingestion/text",
      charLength: payload.text.length,
      source_label: payload.source_label ?? null,
    });
  }

  try {
    const res = await runTextIngestion(payload, options);
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.log?.("[Nexora][IngestionUI] response_received", {
        ok: res.ok,
        signalCount: res.bundle.signals.length,
        signalTypes: res.bundle.signals.map((s) => s.type),
        warnings: res.bundle.warnings,
      });
    }
    return res;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.error?.("[Nexora][IngestionUI] request_failed", err);
    }
    return null;
  } finally {
    __ingestionInFlight = false;
  }
}
