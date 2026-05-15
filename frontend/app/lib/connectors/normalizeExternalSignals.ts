import { stableSignalKey, stableSignature } from "../intelligence/shared/dedupe.ts";
import { clamp01, normalizeIdPart, uniqueStrings } from "../intelligence/shared/normalization.ts";
import { resolveConnectorDomainHints } from "./connectorDomainMapping.ts";
import type { ExternalOperationalSignal, NormalizedExternalOperationalSignal } from "./externalSignalTypes.ts";

function timestampFromUnknown(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric) : 0;
}

function inferSignalType(payload: unknown): string {
  const text = JSON.stringify(payload ?? "").toLowerCase();
  if (/outage|incident|down|error|latency/.test(text)) return "operational_instability";
  if (/ticket|blocked|delay|milestone|sla/.test(text)) return "operational_delay";
  if (/inventory|stock|supplier|erp/.test(text)) return "supply_fragility";
  if (/cash|liquidity|revenue|cost|margin/.test(text)) return "financial_pressure";
  if (/threat|vulnerability|access|breach/.test(text)) return "security_exposure";
  return "operational_signal";
}

function severityFromUnknown(value: unknown, payload: unknown): number {
  if (typeof value === "number" || typeof value === "string") return clamp01(Number(value));
  const text = JSON.stringify(payload ?? "").toLowerCase();
  if (/critical|outage|breach|blocked/.test(text)) return 0.9;
  if (/high|delay|degrad|risk/.test(text)) return 0.72;
  if (/medium|watch|warning/.test(text)) return 0.5;
  return 0.28;
}

export function normalizeExternalSignal(input: {
  connectorId?: unknown;
  sourceType?: unknown;
  rawSignal: unknown;
  receivedAt?: unknown;
}): NormalizedExternalOperationalSignal {
  const record = input.rawSignal && typeof input.rawSignal === "object" ? input.rawSignal as Record<string, unknown> : {};
  const sourceConnectorId = normalizeIdPart(record.sourceConnectorId ?? record.connectorId ?? input.connectorId ?? "unknown_connector") || "unknown_connector";
  const signalType = normalizeIdPart(record.signalType ?? record.type ?? inferSignalType(input.rawSignal)) || "operational_signal";
  const objectHints = uniqueStrings([
    ...(Array.isArray(record.objectHints) ? record.objectHints : []),
    ...(Array.isArray(record.objects) ? record.objects : []),
    record.objectId,
  ]);
  const domainHints = resolveConnectorDomainHints({
    connectorId: sourceConnectorId,
    domainHints: Array.isArray(record.domainHints) ? record.domainHints : [],
  });
  const timestamp = timestampFromUnknown(record.timestamp ?? record.createdAt ?? input.receivedAt);
  const id = normalizeIdPart(record.id ?? `${sourceConnectorId}:${signalType}:${timestamp || stableSignature(input.rawSignal).slice(0, 16)}`);
  const severity = severityFromUnknown(record.severity, input.rawSignal);
  const ingestionSignature = stableSignalKey({
    type: `${sourceConnectorId}:${signalType}:${severity}`,
    sourceId: id,
    relatedObjectIds: objectHints,
  }) || stableSignature({ sourceConnectorId, signalType, severity, objectHints, domainHints, payload: input.rawSignal });

  return {
    id: id || "external_signal",
    sourceConnectorId,
    signalType,
    severity,
    objectHints,
    domainHints,
    payload: record.payload ?? input.rawSignal,
    timestamp,
    ingestionSignature,
  };
}

export function normalizeExternalSignals(input: {
  connectorId?: unknown;
  sourceType?: unknown;
  rawSignals: unknown[] | unknown;
  receivedAt?: unknown;
}): NormalizedExternalOperationalSignal[] {
  const rawSignals = Array.isArray(input.rawSignals) ? input.rawSignals : [input.rawSignals];
  return rawSignals
    .map((rawSignal) => normalizeExternalSignal({
      connectorId: input.connectorId,
      sourceType: input.sourceType,
      rawSignal,
      receivedAt: input.receivedAt,
    }))
    .sort((left, right) => {
      if (left.timestamp !== right.timestamp) return left.timestamp - right.timestamp;
      return left.id.localeCompare(right.id);
    });
}
