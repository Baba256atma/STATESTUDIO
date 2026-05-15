import {
  normalizeConnectorIngressEnvelope,
  validateConnectorIngressBoundary,
  type ConnectorIngressEnvelope,
} from "../architecture/connectorIngressBoundaries.ts";
import type { IntelligenceContractEnvelope } from "../contracts/intelligenceContracts.ts";
import { normalizeExternalSignals } from "./normalizeExternalSignals.ts";
import { validateExternalSignals } from "./validateExternalSignal.ts";

export type ConnectorIngressBoundaryResult = {
  success: boolean;
  envelope: ConnectorIngressEnvelope;
  canonicalSignals: IntelligenceContractEnvelope[];
  warnings: string[];
};

export function runConnectorIngressBoundary(params: {
  connectorId?: unknown;
  rawSignals: unknown[] | unknown;
  receivedAt?: unknown;
  now?: number;
}): ConnectorIngressBoundaryResult {
  const normalizedSignals = normalizeExternalSignals({
    connectorId: params.connectorId,
    rawSignals: params.rawSignals,
    receivedAt: params.receivedAt,
  });
  const validation = validateExternalSignals({
    signals: normalizedSignals,
    now: params.now,
  });
  const envelope = normalizeConnectorIngressEnvelope({
    connectorId: params.connectorId,
    rawPayload: params.rawSignals,
    receivedAt: params.receivedAt,
    signals: validation.validSignals.map((signal) => ({
      id: signal.id,
      layerId: "connector_ingress",
      severity: signal.severity,
      confidence: Math.max(0.35, 1 - signal.severity * 0.18),
      relatedObjectIds: signal.objectHints,
      title: signal.signalType.replace(/_/g, " "),
      summary: `External ${signal.signalType.replace(/_/g, " ")} signal from ${signal.sourceConnectorId}.`,
    })),
  });
  const envelopeValidation = validateConnectorIngressBoundary(envelope);
  const warnings = [...validation.warnings, ...envelopeValidation.warnings];

  return {
    success: validation.rejectedSignals.length === 0 && envelopeValidation.valid,
    envelope: {
      ...envelope,
      warnings,
    },
    canonicalSignals: envelope.normalizedSignals,
    warnings,
  };
}
