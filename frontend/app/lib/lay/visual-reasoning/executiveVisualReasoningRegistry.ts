import type { ExecutiveVisualReasoningCapabilityId } from "./executiveVisualReasoningTypes.ts";

export type ExecutiveVisualReasoningCapabilityDefinition = Readonly<{
  id: ExecutiveVisualReasoningCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_VISUAL_REASONING_CAPABILITY_REGISTRY: readonly ExecutiveVisualReasoningCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "executiveMapGeneration", name: "Executive Map Generation", description: "Builds aggregate executive visual metadata." }),
  Object.freeze({ id: "causeEffectMapping", name: "Cause-Effect Mapping", description: "Builds cause-effect visual metadata from reasoning." }),
  Object.freeze({ id: "decisionMapping", name: "Decision Mapping", description: "Builds judgment and decision-driver visual metadata." }),
  Object.freeze({ id: "tradeoffMapping", name: "Trade-Off Mapping", description: "Builds trade-off and tension visual metadata." }),
  Object.freeze({ id: "planMapping", name: "Plan Mapping", description: "Builds logical plan visual metadata." }),
  Object.freeze({ id: "tensionMapping", name: "Tension Mapping", description: "Maps thought-partner tensions as visual metadata." }),
  Object.freeze({ id: "visualExplanation", name: "Visual Explanation", description: "Explains visual structures without rendering." }),
]);

export function listExecutiveVisualReasoningCapabilities(): readonly ExecutiveVisualReasoningCapabilityDefinition[] {
  return EXECUTIVE_VISUAL_REASONING_CAPABILITY_REGISTRY;
}
