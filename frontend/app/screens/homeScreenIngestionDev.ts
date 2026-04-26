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
let hasFetchedConnectorCatalog = false;
let hasLoggedConnectorCatalogFailure = false;
const CONNECTOR_CATALOG_TIMEOUT_MS = 3000;

export type HomeScreenLastIngestion = TextIngestionResponse | null;

/** `skipped_in_flight` when another manual ingestion request is already running (single-flight guard). */
export type SubmitManualTextIngestionResult = TextIngestionResponse | null | "skipped_in_flight";

export type ConnectorCatalogAvailability = {
  status: "ready" | "unavailable";
  message: string | null;
  catalog: unknown[];
};

async function safeFetchConnectorCatalog(): Promise<unknown[]> {
  let timeoutId: number | null = null;
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = globalThis.setTimeout(() => {
        reject(new Error("timeout"));
      }, CONNECTOR_CATALOG_TIMEOUT_MS);
    });
    const res = await Promise.race([fetchConnectorCatalog(), timeoutPromise]);
    if (!res) {
      throw new Error("empty_response");
    }
    if (!Array.isArray(res)) {
      throw new Error("invalid_response");
    }
    return res;
  } catch (e) {
    if (process.env.NODE_ENV === "development" && !hasLoggedConnectorCatalogFailure) {
      hasLoggedConnectorCatalogFailure = true;
      globalThis.console?.warn?.("[Nexora][IngestionUI] connector_catalog_failed", {
        reason: e instanceof Error ? e.message : "unknown",
      });
    }
    return [];
  } finally {
    if (timeoutId != null) {
      globalThis.clearTimeout(timeoutId);
    }
  }
}

export async function getConnectorCatalogAvailabilityDev(): Promise<ConnectorCatalogAvailability> {
  const catalog = await safeFetchConnectorCatalog();
  if (!catalog || catalog.length === 0) {
    return {
      status: "unavailable",
      message: "Connectors not available",
      catalog: [],
    };
  }
  return {
    status: "ready",
    message: null,
    catalog,
  };
}

export async function prefetchIngestionConnectorCatalogDev(): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  if (hasFetchedConnectorCatalog) return;
  hasFetchedConnectorCatalog = true;
  // No retries here: failed state should stay silent and stable.
  await safeFetchConnectorCatalog();
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
      globalThis.console?.warn?.("[Nexora][IngestionUI] request_failed", err);
    }
    return null;
  } finally {
    __ingestionInFlight = false;
  }
}
