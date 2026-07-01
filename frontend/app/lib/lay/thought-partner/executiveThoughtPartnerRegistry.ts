import type { ExecutiveThoughtPartnerCapabilityId } from "./executiveThoughtPartnerTypes.ts";

export type ExecutiveThoughtPartnerCapabilityDefinition = Readonly<{
  id: ExecutiveThoughtPartnerCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_THOUGHT_PARTNER_CAPABILITY_REGISTRY: readonly ExecutiveThoughtPartnerCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "perspectiveFraming", name: "Perspective Framing", description: "Frames deterministic executive perspectives." }),
  Object.freeze({ id: "counterpointGeneration", name: "Counterpoint Generation", description: "Builds traceable counterpoints without recommendations." }),
  Object.freeze({ id: "alternativeViewpoints", name: "Alternative Viewpoints", description: "Builds structured alternative viewpoints." }),
  Object.freeze({ id: "strategicReflection", name: "Strategic Reflection", description: "Builds strategic reflection prompts." }),
  Object.freeze({ id: "debatePaths", name: "Debate Paths", description: "Builds non-decisional debate paths." }),
  Object.freeze({ id: "tensionMapping", name: "Tension Mapping", description: "Maps deterministic executive tensions." }),
  Object.freeze({ id: "explanationGeneration", name: "Explanation Generation", description: "Explains thought-partner output traceability." }),
]);

export function listExecutiveThoughtPartnerCapabilities(): readonly ExecutiveThoughtPartnerCapabilityDefinition[] {
  return EXECUTIVE_THOUGHT_PARTNER_CAPABILITY_REGISTRY;
}
