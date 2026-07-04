export type ExecutiveJudgmentExplanationSectionType =
  | "executive-summary"
  | "evidence-basis"
  | "constraint-basis"
  | "tradeoff-basis"
  | "risk-opportunity-basis"
  | "alternative-analysis"
  | "blocking-factors"
  | "decision-boundaries"
  | "known-gaps"
  | "supporting-metadata"
  | "validation-summary";

export type ExecutiveJudgmentExplanationRegistry = Readonly<{
  registryId: "executive-judgment-explanation-registry";
  phaseId: "APP-JUDGE-8";
  sectionTypes: readonly ExecutiveJudgmentExplanationSectionType[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_EXPLANATION_SECTION_TYPES = Object.freeze([
  "executive-summary",
  "evidence-basis",
  "constraint-basis",
  "tradeoff-basis",
  "risk-opportunity-basis",
  "alternative-analysis",
  "blocking-factors",
  "decision-boundaries",
  "known-gaps",
  "supporting-metadata",
  "validation-summary",
] as const);

export const EXECUTIVE_JUDGMENT_EXPLANATION_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-7",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentExplanationRegistry(): ExecutiveJudgmentExplanationRegistry {
  return Object.freeze({
    registryId: "executive-judgment-explanation-registry",
    phaseId: "APP-JUDGE-8",
    sectionTypes: EXECUTIVE_JUDGMENT_EXPLANATION_SECTION_TYPES,
    compatibleInputs: EXECUTIVE_JUDGMENT_EXPLANATION_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
