import type { StructuredExecutiveJudgmentExplanation } from "./executiveJudgmentExplanationBuilder.ts";
import { validateExecutiveJudgmentExplanation, type ExecutiveJudgmentExplanationValidation } from "./executiveJudgmentExplanationValidation.ts";

export type ExecutiveJudgmentExplanationSnapshot = Readonly<{
  explanationId: string;
  judgmentId: string;
  sectionCount: number;
  traceabilityCount: number;
  referencedObjectCount: number;
  referencedAssessmentCount: number;
  validation: ExecutiveJudgmentExplanationValidation;
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

export function buildExecutiveJudgmentExplanationSnapshot(explanation: StructuredExecutiveJudgmentExplanation): ExecutiveJudgmentExplanationSnapshot {
  const validation = validateExecutiveJudgmentExplanation(explanation);
  const base = Object.freeze({
    explanationId: explanation.explanationId,
    judgmentId: explanation.judgmentId,
    sectionCount: explanation.sections.length,
    traceabilityCount: explanation.traceabilityMap.length,
    referencedObjectCount: explanation.referencedObjects.length,
    referencedAssessmentCount: explanation.referencedAssessments.length,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.explanationId,
    base.judgmentId,
    explanation.sections.map((section) => `${section.sectionId}:${section.references.join(",")}`).join("|"),
    explanation.traceabilityMap.map((entry) => `${entry.sourceType}:${entry.sourceId}:${entry.targetSectionId}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
