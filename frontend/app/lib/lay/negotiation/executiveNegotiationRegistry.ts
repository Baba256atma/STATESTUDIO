import type { ExecutiveNegotiationCapabilityId } from "./executiveNegotiationTypes.ts";

export type ExecutiveNegotiationCapabilityDefinition = Readonly<{
  id: ExecutiveNegotiationCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_NEGOTIATION_CAPABILITY_REGISTRY: readonly ExecutiveNegotiationCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "stakeholderPositionMapping", name: "Stakeholder Position Mapping", description: "Maps deterministic stakeholder positions as metadata." }),
  Object.freeze({ id: "interestAnalysis", name: "Interest Analysis", description: "Separates stated positions from underlying interests." }),
  Object.freeze({ id: "leverageAnalysis", name: "Leverage Analysis", description: "Identifies traceable leverage metadata without recommendations." }),
  Object.freeze({ id: "concessionMapping", name: "Concession Mapping", description: "Maps possible concession candidates without choosing concessions." }),
  Object.freeze({ id: "conflictZoneDetection", name: "Conflict Zone Detection", description: "Detects structured conflict zones." }),
  Object.freeze({ id: "negotiationPathGeneration", name: "Negotiation Path Generation", description: "Builds possible negotiation paths for downstream consumers." }),
  Object.freeze({ id: "negotiationExplanation", name: "Negotiation Explanation", description: "Explains negotiation metadata traceability." }),
]);

export function listExecutiveNegotiationCapabilities(): readonly ExecutiveNegotiationCapabilityDefinition[] {
  return EXECUTIVE_NEGOTIATION_CAPABILITY_REGISTRY;
}
