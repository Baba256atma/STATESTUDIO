import type { ExecutiveJudgmentCapabilityId } from "./executiveJudgmentTypes.ts";

export type ExecutiveJudgmentCapabilityDefinition = Readonly<{
  id: ExecutiveJudgmentCapabilityId;
  name: string;
  description: string;
  runtime: "deterministic";
}>;

export const EXECUTIVE_JUDGMENT_CAPABILITY_REGISTRY: readonly ExecutiveJudgmentCapabilityDefinition[] = Object.freeze([
  Object.freeze({
    id: "alternativeEvaluation",
    name: "Alternative Evaluation",
    description: "Evaluates reasoning alternatives without selecting or executing a decision.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "priorityEvaluation",
    name: "Priority Evaluation",
    description: "Orders judgment subjects with transparent justification and no scheduling.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "tradeoffEvaluation",
    name: "Trade-off Evaluation",
    description: "Evaluates tensions exposed by LAY-2 trade-off reasoning.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "riskEvaluation",
    name: "Risk Evaluation",
    description: "Surfaces risk awareness from assumptions, constraints, and trade-offs.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "opportunityEvaluation",
    name: "Opportunity Evaluation",
    description: "Surfaces opportunity awareness from alternatives and causal/dependency reasoning.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "confidenceEvaluation",
    name: "Confidence Evaluation",
    description: "Builds confidence metadata from completeness, evidence, assumptions, and constraints.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "rationaleGeneration",
    name: "Rationale Generation",
    description: "Generates executive rationale without recommendations.",
    runtime: "deterministic",
  }),
]);

export function listExecutiveJudgmentCapabilities(): readonly ExecutiveJudgmentCapabilityDefinition[] {
  return EXECUTIVE_JUDGMENT_CAPABILITY_REGISTRY;
}
