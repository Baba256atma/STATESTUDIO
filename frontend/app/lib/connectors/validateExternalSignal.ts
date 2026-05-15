import { dedupeByStableKey } from "../intelligence/shared/dedupe.ts";
import { isKnownConnector } from "./connectorRegistry.ts";
import type { ExternalSignalValidationResult, NormalizedExternalOperationalSignal } from "./externalSignalTypes.ts";

export function validateExternalSignal(params: {
  signal: NormalizedExternalOperationalSignal;
  now?: number;
  maxAgeMs?: number;
}): ExternalSignalValidationResult {
  const warnings: string[] = [];
  const now = Number.isFinite(Number(params.now)) ? Number(params.now) : 0;
  const maxAgeMs = Number.isFinite(Number(params.maxAgeMs)) ? Number(params.maxAgeMs) : 7 * 24 * 60 * 60 * 1000;
  const signal = params.signal;

  if (!signal.id.trim()) warnings.push("External signal id is required.");
  if (!signal.sourceConnectorId.trim()) warnings.push("External signal source connector id is required.");
  if (!signal.signalType.trim()) warnings.push("External signal type is required.");
  if (!Number.isFinite(signal.timestamp) || signal.timestamp < 0) warnings.push("External signal timestamp must be a non-negative number.");
  if (now > 0 && signal.timestamp > 0 && now - signal.timestamp > maxAgeMs) warnings.push("External signal is stale.");
  if (signal.severity < 0 || signal.severity > 1) warnings.push("External signal severity must be normalized to 0..1.");
  if (!signal.ingestionSignature.trim()) warnings.push("External signal ingestion signature is required.");
  if (!isKnownConnector(signal.sourceConnectorId) && signal.sourceConnectorId !== "unknown_connector") {
    warnings.push(`Unknown connector id: ${signal.sourceConnectorId}`);
  }

  return {
    valid: warnings.length === 0,
    signal: warnings.length === 0 ? signal : undefined,
    warnings,
  };
}

export function dedupeExternalSignals(signals: NormalizedExternalOperationalSignal[]): NormalizedExternalOperationalSignal[] {
  return dedupeByStableKey(signals, (signal) => signal.ingestionSignature);
}

export function validateExternalSignals(params: {
  signals: NormalizedExternalOperationalSignal[];
  now?: number;
  maxAgeMs?: number;
}): {
  validSignals: NormalizedExternalOperationalSignal[];
  rejectedSignals: NormalizedExternalOperationalSignal[];
  warnings: string[];
} {
  const deduped = dedupeExternalSignals(params.signals);
  const warnings: string[] = [];
  const validSignals: NormalizedExternalOperationalSignal[] = [];
  const rejectedSignals: NormalizedExternalOperationalSignal[] = [];

  if (deduped.length < params.signals.length) {
    warnings.push(`Deduped ${params.signals.length - deduped.length} duplicate external signal(s).`);
  }

  for (const signal of deduped) {
    const validation = validateExternalSignal({ signal, now: params.now, maxAgeMs: params.maxAgeMs });
    warnings.push(...validation.warnings.map((warning) => `${signal.id}: ${warning}`));
    if (validation.valid) validSignals.push(signal);
    else rejectedSignals.push(signal);
  }

  return { validSignals, rejectedSignals, warnings };
}
