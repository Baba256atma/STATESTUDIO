export type ExecutiveJudgmentConstraintAssessmentDimension =
  | "severity"
  | "criticality"
  | "applicability"
  | "dependency"
  | "coverage"
  | "completeness"
  | "consistency"
  | "traceability"
  | "scope";

export type ExecutiveJudgmentConstraintRegistry = Readonly<{
  registryId: "executive-judgment-constraint-registry";
  phaseId: "APP-JUDGE-4";
  dimensions: readonly ExecutiveJudgmentConstraintAssessmentDimension[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_CONSTRAINT_DIMENSIONS = Object.freeze([
  "severity",
  "criticality",
  "applicability",
  "dependency",
  "coverage",
  "completeness",
  "consistency",
  "traceability",
  "scope",
] as const);

export const EXECUTIVE_JUDGMENT_CONSTRAINT_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "APP-JUDGE-3",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentConstraintRegistry(): ExecutiveJudgmentConstraintRegistry {
  return Object.freeze({
    registryId: "executive-judgment-constraint-registry",
    phaseId: "APP-JUDGE-4",
    dimensions: EXECUTIVE_JUDGMENT_CONSTRAINT_DIMENSIONS,
    compatibleInputs: EXECUTIVE_JUDGMENT_CONSTRAINT_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
