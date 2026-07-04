import type { ExecutiveJudgmentTradeoffAssessmentCollection } from "./executiveJudgmentTradeoffAnalyzer.ts";
import { validateExecutiveJudgmentTradeoffs, type ExecutiveJudgmentTradeoffValidation } from "./executiveJudgmentTradeoffValidation.ts";

export type ExecutiveJudgmentTradeoffSnapshotEntry = Readonly<{
  tradeoffId: string;
  tradeoffType: string;
  direction: string;
  status: string;
  traceability: string;
  participantCount: number;
  dependencyCount: number;
}>;

export type ExecutiveJudgmentTradeoffSnapshot = Readonly<{
  contextId: string;
  tradeoffCount: number;
  entries: readonly ExecutiveJudgmentTradeoffSnapshotEntry[];
  validation: ExecutiveJudgmentTradeoffValidation;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function buildExecutiveJudgmentTradeoffSnapshot(collection: ExecutiveJudgmentTradeoffAssessmentCollection): ExecutiveJudgmentTradeoffSnapshot {
  const entries = Object.freeze(
    collection.assessments.map((assessment) =>
      Object.freeze({
        tradeoffId: assessment.tradeoffId,
        tradeoffType: assessment.tradeoffType,
        direction: assessment.direction,
        status: assessment.status,
        traceability: assessment.traceability,
        participantCount: assessment.participants.length,
        dependencyCount: assessment.normalizedRecord.dependencies.length,
      })
    )
  );
  const validation = validateExecutiveJudgmentTradeoffs(collection);
  const base = Object.freeze({
    contextId: collection.contextId,
    tradeoffCount: entries.length,
    entries,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.contextId,
    base.entries.map((entry) => `${entry.tradeoffId}:${entry.tradeoffType}:${entry.direction}:${entry.participantCount}:${entry.dependencyCount}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
