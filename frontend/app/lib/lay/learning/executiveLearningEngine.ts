export type {
  ExecutiveAssumptionPattern,
  ExecutiveCoachingReflection,
  ExecutiveJudgmentReflection,
  ExecutiveLearningContext,
  ExecutiveLearningExplanation,
  ExecutiveLearningInput,
  ExecutiveLearningPattern,
  ExecutiveLearningResult,
  ExecutiveLearningSession,
  ExecutiveLearningValidationIssue,
  ExecutiveLearningValidationResult,
  ExecutivePlanReflection,
  ExecutiveReusableLesson,
} from "./executiveLearningTypes.ts";
export { EXECUTIVE_LEARNING_CAPABILITY_REGISTRY, listExecutiveLearningCapabilities } from "./executiveLearningRegistry.ts";
export { EXECUTIVE_LEARNING_CONTRACTS } from "./executiveLearningContracts.ts";
export { normalizeExecutiveLearningContext } from "./executiveLearningContext.ts";
export { extractExecutivePatterns } from "./executivePatternExtractor.ts";
export { detectExecutiveAssumptionPatterns } from "./executiveAssumptionPatternDetector.ts";
export { buildExecutiveJudgmentReflection } from "./executiveJudgmentReflectionBuilder.ts";
export { buildExecutivePlanReflection } from "./executivePlanReflectionBuilder.ts";
export { buildExecutiveCoachingReflection } from "./executiveCoachingReflectionBuilder.ts";
export { buildExecutiveLessons } from "./executiveLessonBuilder.ts";
export { buildExecutiveLearningExplanation } from "./executiveLearningExplanation.ts";
export { validateExecutiveLearning } from "./executiveLearningValidation.ts";

import { detectExecutiveAssumptionPatterns } from "./executiveAssumptionPatternDetector.ts";
import { buildExecutiveCoachingReflection } from "./executiveCoachingReflectionBuilder.ts";
import { buildExecutiveJudgmentReflection } from "./executiveJudgmentReflectionBuilder.ts";
import { buildExecutiveLearningExplanation } from "./executiveLearningExplanation.ts";
import { normalizeExecutiveLearningContext } from "./executiveLearningContext.ts";
import { validateExecutiveLearning } from "./executiveLearningValidation.ts";
import { buildExecutiveLessons } from "./executiveLessonBuilder.ts";
import { buildExecutivePlanReflection } from "./executivePlanReflectionBuilder.ts";
import { extractExecutivePatterns } from "./executivePatternExtractor.ts";
import type { ExecutiveLearningInput, ExecutiveLearningResult } from "./executiveLearningTypes.ts";

export function buildExecutiveLearning(input: ExecutiveLearningInput): ExecutiveLearningResult {
  const context = normalizeExecutiveLearningContext(input);
  const patterns = extractExecutivePatterns(context);
  const assumptionPatterns = detectExecutiveAssumptionPatterns(input);
  const judgmentReflection = buildExecutiveJudgmentReflection(input);
  const planReflection = buildExecutivePlanReflection(input);
  const coachingReflection = buildExecutiveCoachingReflection(input);
  const lessons = buildExecutiveLessons(patterns, assumptionPatterns, judgmentReflection, planReflection, coachingReflection);
  const explanation = buildExecutiveLearningExplanation(context.session, patterns, assumptionPatterns, judgmentReflection, planReflection, coachingReflection, lessons);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    patterns,
    assumptionPatterns,
    judgmentReflection,
    planReflection,
    coachingReflection,
    lessons,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveLearning(withoutValidation);

  return Object.freeze({ ...withoutValidation, validation });
}

export const ExecutiveLearningEngine = Object.freeze({
  buildExecutiveLearning,
  extractExecutivePatterns,
  detectExecutiveAssumptionPatterns,
  buildExecutiveJudgmentReflection,
  buildExecutivePlanReflection,
  buildExecutiveCoachingReflection,
  buildExecutiveLessons,
  buildExecutiveLearningExplanation,
  validateExecutiveLearning,
});
