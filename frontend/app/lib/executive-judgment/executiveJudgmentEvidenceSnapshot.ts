import type { ExecutiveJudgmentEvidenceAssessmentCollection } from "./executiveJudgmentEvidenceEvaluator.ts";
import { validateExecutiveJudgmentEvidence, type ExecutiveJudgmentEvidenceValidation } from "./executiveJudgmentEvidenceValidation.ts";

export type ExecutiveJudgmentEvidenceSnapshotEntry = Readonly<{
  evidenceId: string;
  evidenceType: string;
  status: string;
  completeness: string;
  traceability: string;
  referenceCount: number;
}>;

export type ExecutiveJudgmentEvidenceSnapshot = Readonly<{
  contextId: string;
  evidenceCount: number;
  entries: readonly ExecutiveJudgmentEvidenceSnapshotEntry[];
  validation: ExecutiveJudgmentEvidenceValidation;
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

export function buildExecutiveJudgmentEvidenceSnapshot(collection: ExecutiveJudgmentEvidenceAssessmentCollection): ExecutiveJudgmentEvidenceSnapshot {
  const entries = Object.freeze(
    collection.assessments.map((assessment) =>
      Object.freeze({
        evidenceId: assessment.evidenceId,
        evidenceType: assessment.evidenceType,
        status: assessment.status,
        completeness: assessment.completeness,
        traceability: assessment.traceability,
        referenceCount: assessment.normalizedRecord.references.length,
      })
    )
  );
  const validation = validateExecutiveJudgmentEvidence(collection);
  const base = Object.freeze({
    contextId: collection.contextId,
    evidenceCount: entries.length,
    entries,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.contextId,
    base.entries.map((entry) => `${entry.evidenceId}:${entry.evidenceType}:${entry.status}:${entry.referenceCount}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
