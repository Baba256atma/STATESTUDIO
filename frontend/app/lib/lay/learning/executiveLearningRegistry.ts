import type { ExecutiveLearningCapabilityId } from "./executiveLearningTypes.ts";

export type ExecutiveLearningCapabilityDefinition = Readonly<{
  id: ExecutiveLearningCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_LEARNING_CAPABILITY_REGISTRY: readonly ExecutiveLearningCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "patternExtraction", name: "Pattern Extraction", description: "Extracts deterministic reusable learning patterns." }),
  Object.freeze({ id: "assumptionPatternDetection", name: "Assumption Pattern Detection", description: "Detects repeated assumption references." }),
  Object.freeze({ id: "judgmentReflection", name: "Judgment Reflection", description: "Builds judgment quality reflection metadata." }),
  Object.freeze({ id: "planReflection", name: "Plan Reflection", description: "Builds plan quality reflection metadata." }),
  Object.freeze({ id: "coachingReflection", name: "Coaching Reflection", description: "Builds coaching effectiveness reflection metadata." }),
  Object.freeze({ id: "lessonGeneration", name: "Lesson Generation", description: "Builds reusable lesson metadata." }),
  Object.freeze({ id: "learningExplanation", name: "Learning Explanation", description: "Explains learning artifact traceability." }),
]);

export function listExecutiveLearningCapabilities(): readonly ExecutiveLearningCapabilityDefinition[] {
  return EXECUTIVE_LEARNING_CAPABILITY_REGISTRY;
}
