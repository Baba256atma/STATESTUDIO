import type { ExecutiveReasoningCapabilityId } from "./executiveReasoningTypes.ts";

export type ExecutiveReasoningCapabilityDefinition = Readonly<{
  id: ExecutiveReasoningCapabilityId;
  name: string;
  description: string;
  runtime: "deterministic";
}>;

export const EXECUTIVE_REASONING_CAPABILITY_REGISTRY: readonly ExecutiveReasoningCapabilityDefinition[] = Object.freeze([
  Object.freeze({
    id: "causalReasoning",
    name: "Causal Reasoning",
    description: "Identifies cause and effect relationships in normalized context.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "dependencyReasoning",
    name: "Dependency Reasoning",
    description: "Traces dependency paths without scoring or prioritization.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "assumptionReasoning",
    name: "Assumption Reasoning",
    description: "Surfaces assumptions and their structural impact.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "constraintReasoning",
    name: "Constraint Reasoning",
    description: "Propagates constraints to affected context elements.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "tradeoffReasoning",
    name: "Trade-off Reasoning",
    description: "Discovers explicit trade-off tensions in context.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "alternativeReasoning",
    name: "Alternative Reasoning",
    description: "Generates alternative reasoning paths without recommendations.",
    runtime: "deterministic",
  }),
  Object.freeze({
    id: "explanationGeneration",
    name: "Explanation Generation",
    description: "Builds transparent why, because, therefore explanations.",
    runtime: "deterministic",
  }),
]);

export function listExecutiveReasoningCapabilities(): readonly ExecutiveReasoningCapabilityDefinition[] {
  return EXECUTIVE_REASONING_CAPABILITY_REGISTRY;
}
