import type { ExecutiveCoachingCapabilityId } from "./executiveCoachingTypes.ts";

export type ExecutiveCoachingCapabilityDefinition = Readonly<{
  id: ExecutiveCoachingCapabilityId;
  name: string;
  description: string;
  runtime: "deterministic";
}>;

export const EXECUTIVE_COACHING_CAPABILITY_REGISTRY: readonly ExecutiveCoachingCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "clarifyingQuestions", name: "Clarifying Questions", description: "Builds deterministic questions from uncertain reasoning and planning structures.", runtime: "deterministic" }),
  Object.freeze({ id: "assumptionChallenges", name: "Assumption Challenges", description: "Challenges assumptions using related evidence and risks.", runtime: "deterministic" }),
  Object.freeze({ id: "blindSpotDetection", name: "Blind Spot Detection", description: "Detects missing stakeholders, risks, confidence concerns, unsupported priorities, constraints, and fragile dependencies.", runtime: "deterministic" }),
  Object.freeze({ id: "reflectionPrompts", name: "Reflection Prompts", description: "Builds structured prompts for executive self-reflection.", runtime: "deterministic" }),
  Object.freeze({ id: "decisionQualityPrompts", name: "Decision Quality Prompts", description: "Builds prompts that improve decision quality without making decisions.", runtime: "deterministic" }),
  Object.freeze({ id: "planReviewPrompts", name: "Plan Review Prompts", description: "Builds prompts for reviewing logical planning structures without execution.", runtime: "deterministic" }),
  Object.freeze({ id: "coachingExplanation", name: "Coaching Explanation", description: "Explains why coaching outputs were generated and what triggered them.", runtime: "deterministic" }),
]);

export function listExecutiveCoachingCapabilities(): readonly ExecutiveCoachingCapabilityDefinition[] {
  return EXECUTIVE_COACHING_CAPABILITY_REGISTRY;
}
