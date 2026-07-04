import type { ExecutiveJudgmentConstraintAssessmentCollection } from "./executiveJudgmentConstraintAnalyzer.ts";
import { validateExecutiveJudgmentConstraints, type ExecutiveJudgmentConstraintValidation } from "./executiveJudgmentConstraintValidation.ts";

export type ExecutiveJudgmentConstraintSnapshotEntry = Readonly<{
  constraintId: string;
  constraintType: string;
  status: string;
  completeness: string;
  traceability: string;
  dependencyCount: number;
  referenceCount: number;
}>;

export type ExecutiveJudgmentConstraintSnapshot = Readonly<{
  contextId: string;
  constraintCount: number;
  entries: readonly ExecutiveJudgmentConstraintSnapshotEntry[];
  validation: ExecutiveJudgmentConstraintValidation;
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

export function buildExecutiveJudgmentConstraintSnapshot(collection: ExecutiveJudgmentConstraintAssessmentCollection): ExecutiveJudgmentConstraintSnapshot {
  const entries = Object.freeze(
    collection.assessments.map((assessment) =>
      Object.freeze({
        constraintId: assessment.constraintId,
        constraintType: assessment.constraintType,
        status: assessment.status,
        completeness: assessment.completeness,
        traceability: assessment.traceability,
        dependencyCount: assessment.normalizedRecord.dependencies.length,
        referenceCount: assessment.normalizedRecord.references.length,
      })
    )
  );
  const validation = validateExecutiveJudgmentConstraints(collection);
  const base = Object.freeze({
    contextId: collection.contextId,
    constraintCount: entries.length,
    entries,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.contextId,
    base.entries.map((entry) => `${entry.constraintId}:${entry.constraintType}:${entry.status}:${entry.dependencyCount}:${entry.referenceCount}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
