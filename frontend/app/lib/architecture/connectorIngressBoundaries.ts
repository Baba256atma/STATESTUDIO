import {
  buildIntelligenceContractEnvelope,
  validateIntelligenceContractEnvelope,
  type IntelligenceContractEnvelope,
  type IntelligenceSourceKind,
} from "../contracts/intelligenceContracts.ts";
import { stableSignature } from "../intelligence/shared/dedupe.ts";
import { normalizeIdPart, uniqueStrings } from "../intelligence/shared/normalization.ts";

export type ConnectorIngressBoundaryRule =
  | "no_direct_scene_mutation"
  | "normalize_before_orchestration"
  | "derive_overlays_from_contracts"
  | "do_not_bypass_canonical_pipeline";

/**
 * ARCHITECTURE CONTRACT:
 * Source Management owns source metadata and health. Connector ingress may only
 * normalize upstream evidence for operational modeling; it must never mutate
 * the scene directly.
 */
export type ConnectorIngressEnvelope = {
  version: "connector-ingress-v1";
  connectorId: string;
  sourceKind: IntelligenceSourceKind;
  receivedAt: number;
  payloadSignature: string;
  rawPayload: unknown;
  normalizedSignals: IntelligenceContractEnvelope[];
  boundaryRules: ConnectorIngressBoundaryRule[];
  warnings: string[];
};

const CONNECTOR_BOUNDARY_RULES: ConnectorIngressBoundaryRule[] = [
  "no_direct_scene_mutation",
  "normalize_before_orchestration",
  "derive_overlays_from_contracts",
  "do_not_bypass_canonical_pipeline",
];

export function normalizeConnectorIngressEnvelope(params: {
  connectorId?: unknown;
  rawPayload: unknown;
  signals?: Array<{
    id?: unknown;
    layerId?: string;
    severity?: unknown;
    confidence?: unknown;
    relatedObjectIds?: unknown[];
    title?: unknown;
    summary?: unknown;
  }> | null;
  receivedAt?: unknown;
}): ConnectorIngressEnvelope {
  const connectorId = normalizeIdPart(params.connectorId ?? "unknown_connector") || "unknown_connector";
  const receivedAt = Number.isFinite(Number(params.receivedAt)) ? Math.round(Number(params.receivedAt)) : 0;
  const warnings: string[] = [];
  const normalizedSignals = (params.signals ?? []).map((signal) =>
    buildIntelligenceContractEnvelope({
      id: signal.id ?? `${connectorId}:${signal.layerId ?? "connector_signal"}`,
      sourceKind: "connector",
      layerId: signal.layerId ?? "connector_ingress",
      timestamp: receivedAt,
      severity: signal.severity,
      confidence: signal.confidence,
      relatedObjectIds: uniqueStrings(signal.relatedObjectIds ?? []),
      narrative: {
        headline: String(signal.title ?? ""),
        summary: String(signal.summary ?? ""),
      },
    })
  );

  if (connectorId === "unknown_connector") warnings.push("Connector id was missing and safely normalized.");
  for (const signal of normalizedSignals) {
    const validation = validateIntelligenceContractEnvelope(signal);
    warnings.push(...validation.warnings.map((warning) => `${signal.id}: ${warning}`));
  }

  return {
    version: "connector-ingress-v1",
    connectorId,
    sourceKind: "connector",
    receivedAt,
    payloadSignature: stableSignature(params.rawPayload),
    rawPayload: params.rawPayload,
    normalizedSignals,
    boundaryRules: [...CONNECTOR_BOUNDARY_RULES],
    warnings,
  };
}

export function validateConnectorIngressBoundary(envelope: ConnectorIngressEnvelope): {
  valid: boolean;
  warnings: string[];
} {
  const warnings = [...envelope.warnings];
  for (const rule of CONNECTOR_BOUNDARY_RULES) {
    if (!envelope.boundaryRules.includes(rule)) warnings.push(`Missing connector boundary rule: ${rule}`);
  }
  if (envelope.version !== "connector-ingress-v1") warnings.push("Unsupported connector ingress version.");
  if (!envelope.connectorId) warnings.push("Connector id is required.");
  if (!envelope.payloadSignature) warnings.push("Payload signature is required.");
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
