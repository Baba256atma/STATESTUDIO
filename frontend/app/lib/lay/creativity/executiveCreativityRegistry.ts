import type { ExecutiveCreativityCapabilityId } from "./executiveCreativityTypes.ts";

export type ExecutiveCreativityCapabilityDefinition = Readonly<{
  id: ExecutiveCreativityCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_CREATIVITY_CAPABILITY_REGISTRY: readonly ExecutiveCreativityCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "situationReframing", name: "Situation Reframing", description: "Builds deterministic reframes from upstream executive metadata." }),
  Object.freeze({ id: "alternativeGeneration", name: "Alternative Generation", description: "Generates creative alternatives without selecting an option." }),
  Object.freeze({ id: "opportunityDiscovery", name: "Opportunity Discovery", description: "Discovers generic opportunity ideas without domain logic." }),
  Object.freeze({ id: "constraintReframing", name: "Constraint Reframing", description: "Reframes constraints as design inputs." }),
  Object.freeze({ id: "strategicAngleGeneration", name: "Strategic Angle Generation", description: "Builds traceable strategic angles." }),
  Object.freeze({ id: "innovationPathGeneration", name: "Innovation Path Generation", description: "Builds conceptual innovation paths." }),
  Object.freeze({ id: "creativityExplanation", name: "Creativity Explanation", description: "Explains creativity metadata traceability." }),
]);

export function listExecutiveCreativityCapabilities(): readonly ExecutiveCreativityCapabilityDefinition[] {
  return EXECUTIVE_CREATIVITY_CAPABILITY_REGISTRY;
}
