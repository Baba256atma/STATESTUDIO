export type ExecutiveJudgmentEvidenceAssessmentDimension =
  | "freshness"
  | "coverage"
  | "completeness"
  | "consistency"
  | "reliability"
  | "traceability"
  | "independence"
  | "relevance"
  | "scope";

export type ExecutiveJudgmentEvidenceRegistry = Readonly<{
  registryId: "executive-judgment-evidence-registry";
  phaseId: "APP-JUDGE-3";
  dimensions: readonly ExecutiveJudgmentEvidenceAssessmentDimension[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_EVIDENCE_DIMENSIONS = Object.freeze([
  "freshness",
  "coverage",
  "completeness",
  "consistency",
  "reliability",
  "traceability",
  "independence",
  "relevance",
  "scope",
] as const);

export const EXECUTIVE_JUDGMENT_EVIDENCE_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentEvidenceRegistry(): ExecutiveJudgmentEvidenceRegistry {
  return Object.freeze({
    registryId: "executive-judgment-evidence-registry",
    phaseId: "APP-JUDGE-3",
    dimensions: EXECUTIVE_JUDGMENT_EVIDENCE_DIMENSIONS,
    compatibleInputs: EXECUTIVE_JUDGMENT_EVIDENCE_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
