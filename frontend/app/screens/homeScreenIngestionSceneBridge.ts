/**
 * Phase B.2 — ingestion → fragility scanner → scene (via `nexora:apply-fragility-scan`).
 * Keeps scene application in HomeScreen’s existing listener; this module only orchestrates I/O.
 */

import type { MultiSourceIngestionResponse, TextIngestionResponse } from "../lib/api/ingestionApi";
import { runFragilityScan } from "../lib/api/fragilityScanner";
import type { FragilityScanResponse } from "../types/fragilityScanner";

/** Dedupes `[Nexora][B2] ingestion_to_scanner` for identical bridge payloads. */
let __lastB2IngestionLogKey: string | null = null;
/** Dedupes `[Nexora][B2] scanner_result_ready` when the scan outcome is unchanged. */
let __lastB2ScannerLogKey: string | null = null;

/** Dedupes `[Nexora][MultiSource] bridge_triggered`. */
let __lastMultiSourceBridgeTriggerLogKey: string | null = null;
/** Dedupes `[Nexora][MultiSource] scanner_applied`. */
let __lastMultiSourceScannerAppliedLogKey: string | null = null;

/**
 * B.10.e.5 — stable signature for multi-source → scanner (source counts + merged signal fingerprint).
 * Uses semantic signal keys (not generated ids) so identical merges do not re-run the bridge.
 */
export function buildMultiSourceBridgeSignature(
  res: MultiSourceIngestionResponse,
  activeDomainId?: string | null
): string {
  const b = res.bundle;
  const meta = b.merge_meta ?? {};
  const sourceCount = Number(meta.source_count ?? b.sources.length);
  const successfulCount = Number(meta.successful_source_count ?? 0);
  const mergedSignalCount = Number(meta.merged_signal_count ?? b.signals.length);
  const sigSignals = [...b.signals]
    .map((s) => {
      const desc = (s.description ?? "").slice(0, 160);
      return `${s.type}:${s.label}:${s.strength.toFixed(3)}:${desc}:${[...(s.entities ?? [])].sort().join(",")}`;
    })
    .sort()
    .join("|");
  const domainHint =
    (activeDomainId && String(activeDomainId)) ||
    (typeof meta.domain === "string" ? String(meta.domain) : "");
  return `multi::${domainHint}::sc=${sourceCount}::ok=${successfulCount}::ms=${mergedSignalCount}::${b.summary ?? ""}::${sigSignals}`;
}

/** Synthetic `TextIngestionResponse` so multi-source reuses `runIngestionThroughFragilitySceneBridge` unchanged. */
export function multiSourceIngestionToTextIngestionResponse(
  res: MultiSourceIngestionResponse,
  domain?: string | null
): TextIngestionResponse {
  const b = res.bundle;
  const connectorKey = [...b.sources]
    .map((s) => `${s.connector_id}:${s.ok ? "1" : "0"}`)
    .sort()
    .join("|");
  return {
    ok: true,
    errors: [],
    bundle: {
      source: {
        id: `nexora_multi_source:${connectorKey.slice(0, 200)}`,
        type: "text",
        title: "multi_source",
        raw_content: (b.summary ?? "").trim() || b.signals.map((s) => s.description).join("\n").slice(0, 4000),
        metadata: {
          multi_source: true,
          merge_meta: b.merge_meta,
          connectors: b.sources.map((s) => ({ connector_id: s.connector_id, ok: s.ok })),
        },
      },
      signals: b.signals,
      summary: b.summary ?? "",
      warnings: [...b.warnings],
      ingestion_meta: {
        input_type: "multi_source",
        ...(domain ? { domain } : {}),
      },
      created_at: new Date().toISOString(),
    },
  };
}

/**
 * B.10.e.5 — multi-source merge → same scanner + `nexora:apply-fragility-scan` path as B.2 text ingestion.
 */
export async function runMultiSourceThroughFragilitySceneBridge(options: {
  multi: MultiSourceIngestionResponse;
  domain?: string | null;
  workspaceId?: string | null;
  userId?: string | null;
  bridgeSignature: string;
}): Promise<FragilityScanResponse | null> {
  const { multi, domain, workspaceId, userId, bridgeSignature } = options;
  if (!multi.ok) return null;

  if (process.env.NODE_ENV !== "production") {
    if (bridgeSignature !== __lastMultiSourceBridgeTriggerLogKey) {
      __lastMultiSourceBridgeTriggerLogKey = bridgeSignature;
      const m = multi.bundle.merge_meta ?? {};
      globalThis.console?.log?.("[Nexora][MultiSource] bridge_triggered", {
        sourceCount: m.source_count,
        successfulSourceCount: m.successful_source_count,
        mergedSignalCount: m.merged_signal_count,
        domain: domain ?? null,
      });
    }
  }

  const ingestion = multiSourceIngestionToTextIngestionResponse(multi, domain);
  const scanResult = await runIngestionThroughFragilitySceneBridge({
    ingestion,
    domain,
    workspaceId,
    userId,
    sourceLabel: "nexora:multi_source",
    bridgeSignature,
  });

  if (process.env.NODE_ENV !== "production" && scanResult) {
    const appliedKey = `${bridgeSignature}::${scanResult.ok}:${scanResult.fragility_level}:${scanResult.fragility_score.toFixed(4)}`;
    if (appliedKey !== __lastMultiSourceScannerAppliedLogKey) {
      __lastMultiSourceScannerAppliedLogKey = appliedKey;
      globalThis.console?.log?.("[Nexora][MultiSource] scanner_applied", {
        ok: scanResult.ok,
        level: scanResult.fragility_level,
        score: scanResult.fragility_score,
      });
    }
  }

  return scanResult;
}

/** Stable signature for deduping identical ingestion → scene runs (ignores bundle timestamps). */
export function buildIngestionFragilityBridgeSignature(
  res: TextIngestionResponse,
  activeDomainId?: string | null
): string {
  const b = res.bundle;
  const sigSignals = [...b.signals]
    // Do not include generated ids/source ids: they change every run even when semantics are identical.
    .map((s) => `${s.type}:${s.label}:${s.strength.toFixed(3)}:${[...s.entities].sort().join(",")}`)
    .sort()
    .join("|");
  const domainHint =
    (activeDomainId && String(activeDomainId)) ||
    (typeof b.ingestion_meta?.domain === "string" ? String(b.ingestion_meta.domain) : "");
  return `${domainHint}::${b.summary}::${sigSignals}`;
}

export async function runIngestionThroughFragilitySceneBridge(options: {
  ingestion: TextIngestionResponse;
  domain?: string | null;
  workspaceId?: string | null;
  userId?: string | null;
  sourceLabel?: string | null;
  /** When set (e.g. same as `buildIngestionFragilityBridgeSignature`), dedupes `ingestion_to_scanner` logs. */
  bridgeSignature?: string | null;
}): Promise<FragilityScanResponse | null> {
  const { ingestion, domain, workspaceId, userId, sourceLabel, bridgeSignature } = options;
  if (!ingestion.ok || !ingestion.bundle) return null;

  if (process.env.NODE_ENV !== "production") {
    const ingestLogKey = bridgeSignature ?? buildIngestionFragilityBridgeSignature(ingestion, domain);
    if (ingestLogKey !== __lastB2IngestionLogKey) {
      __lastB2IngestionLogKey = ingestLogKey;
      globalThis.console?.log?.("[Nexora][B2] ingestion_to_scanner", {
        signalCount: ingestion.bundle.signals.length,
        domain: domain ?? null,
        source_label: sourceLabel ?? null,
      });
    }
  }

  const scanResult = await runFragilityScan({
    signal_bundle: ingestion.bundle,
    metadata: {
      ...(domain ? { domain } : {}),
      ...(sourceLabel ? { ingestion_source_label: sourceLabel } : {}),
    },
    workspace_id: workspaceId ?? undefined,
    user_id: userId ?? undefined,
    mode: "business",
    source_type: "text",
  });

  if (process.env.NODE_ENV !== "production") {
    const suggested = [...(scanResult.suggested_objects ?? [])].map(String).sort().join(",");
    const scannerLogKey = `${scanResult.fragility_level}:${scanResult.fragility_score.toFixed(4)}:${suggested}`;
    if (scannerLogKey !== __lastB2ScannerLogKey) {
      __lastB2ScannerLogKey = scannerLogKey;
      globalThis.console?.log?.("[Nexora][B2] scanner_result_ready", {
        ok: scanResult.ok,
        level: scanResult.fragility_level,
        score: scanResult.fragility_score,
      });
    }
  }

  if (typeof window !== "undefined") {
    const intakeHandoff = sourceLabel === "source_control_panel" ? ("input_center" as const) : null;
    window.dispatchEvent(
      new CustomEvent("nexora:apply-fragility-scan", {
        detail: {
          result: scanResult,
          bridge: "phase_b2" as const,
          intakeHandoff,
          reactionPolicy: {
            maxPrimary: 1,
            maxSecondary: 1,
            dimOthers: true,
            forceFocus: true,
          },
        },
      })
    );
  }
  return scanResult;
}
