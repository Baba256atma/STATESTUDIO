export type ExecutiveJudgmentPosture =
  | "READY_TO_DECIDE"
  | "READY_WITH_CONSTRAINTS"
  | "INSUFFICIENT_EVIDENCE"
  | "CONSTRAINT_BLOCKED"
  | "TRADEOFF_HEAVY"
  | "RISK_OPPORTUNITY_UNBALANCED"
  | "NEEDS_MORE_CONTEXT"
  | "NO_VALID_ALTERNATIVE"
  | "METADATA_INCOMPLETE";

export type ExecutiveJudgmentReadiness = "ready" | "conditional" | "not-ready";

export type ExecutiveJudgmentRegistry = Readonly<{
  registryId: "executive-judgment-engine-registry";
  phaseId: "APP-JUDGE-7";
  postures: readonly ExecutiveJudgmentPosture[];
  compatibleInputs: readonly string[];
  deterministic: true;
  metadataOnly: true;
}>;

export const EXECUTIVE_JUDGMENT_POSTURES = Object.freeze([
  "READY_TO_DECIDE",
  "READY_WITH_CONSTRAINTS",
  "INSUFFICIENT_EVIDENCE",
  "CONSTRAINT_BLOCKED",
  "TRADEOFF_HEAVY",
  "RISK_OPPORTUNITY_UNBALANCED",
  "NEEDS_MORE_CONTEXT",
  "NO_VALID_ALTERNATIVE",
  "METADATA_INCOMPLETE",
] as const);

export const EXECUTIVE_JUDGMENT_ENGINE_COMPATIBLE_INPUTS = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "APP-JUDGE-3",
  "APP-JUDGE-4",
  "APP-JUDGE-5",
  "APP-JUDGE-6",
  "CORE",
  "DS",
  "INT",
  "KNL",
  "APP",
  "ASS",
  "LAY",
  "LLM",
] as const);

export function getExecutiveJudgmentRegistry(): ExecutiveJudgmentRegistry {
  return Object.freeze({
    registryId: "executive-judgment-engine-registry",
    phaseId: "APP-JUDGE-7",
    postures: EXECUTIVE_JUDGMENT_POSTURES,
    compatibleInputs: EXECUTIVE_JUDGMENT_ENGINE_COMPATIBLE_INPUTS,
    deterministic: true,
    metadataOnly: true,
  });
}
