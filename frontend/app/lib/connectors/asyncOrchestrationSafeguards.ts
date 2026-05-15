import type { NormalizedExternalOperationalSignal } from "./externalSignalTypes.ts";
import { dedupeExternalSignals } from "./validateExternalSignal.ts";

export type AsyncConnectorBatch = {
  batchId: string;
  signals: NormalizedExternalOperationalSignal[];
  droppedSignalIds: string[];
  warnings: string[];
};

export type AsyncSafeguardDecision = {
  accept: boolean;
  reason: "accepted" | "stale" | "duplicate" | "burst_limited";
  signalId: string;
};

export function buildAsyncConnectorBatch(params: {
  signals: NormalizedExternalOperationalSignal[];
  previousSignatures?: string[];
  now?: number;
  maxAgeMs?: number;
  maxBatchSize?: number;
}): AsyncConnectorBatch {
  const previous = new Set(params.previousSignatures ?? []);
  const now = Number.isFinite(Number(params.now)) ? Number(params.now) : 0;
  const maxAgeMs = Number.isFinite(Number(params.maxAgeMs)) ? Number(params.maxAgeMs) : 5 * 60 * 1000;
  const maxBatchSize = Math.max(1, Math.floor(Number(params.maxBatchSize ?? 25)));
  const deduped = dedupeExternalSignals(params.signals);
  const accepted: NormalizedExternalOperationalSignal[] = [];
  const decisions: AsyncSafeguardDecision[] = [];

  for (const signal of deduped) {
    if (previous.has(signal.ingestionSignature)) {
      decisions.push({ accept: false, reason: "duplicate", signalId: signal.id });
      continue;
    }
    if (now > 0 && signal.timestamp > 0 && now - signal.timestamp > maxAgeMs) {
      decisions.push({ accept: false, reason: "stale", signalId: signal.id });
      continue;
    }
    if (accepted.length >= maxBatchSize) {
      decisions.push({ accept: false, reason: "burst_limited", signalId: signal.id });
      continue;
    }
    accepted.push(signal);
    decisions.push({ accept: true, reason: "accepted", signalId: signal.id });
  }

  const dropped = decisions.filter((decision) => !decision.accept);
  return {
    batchId: `connector_batch:${accepted.map((signal) => signal.ingestionSignature).join("|") || "empty"}`,
    signals: accepted,
    droppedSignalIds: dropped.map((decision) => decision.signalId),
    warnings: dropped.map((decision) => `${decision.signalId}: ${decision.reason}`),
  };
}

export function shouldRecomputeConnectorIntelligence(params: {
  previousBatchId?: string | null;
  nextBatch: AsyncConnectorBatch;
}): boolean {
  return params.nextBatch.signals.length > 0 && params.previousBatchId !== params.nextBatch.batchId;
}
