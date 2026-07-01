export type {
  ExecutiveAssumptionChallenge,
  ExecutiveBlindSpot,
  ExecutiveCoachingContext,
  ExecutiveCoachingExplanation,
  ExecutiveCoachingInput,
  ExecutiveCoachingQuestion,
  ExecutiveCoachingResult,
  ExecutiveCoachingSession,
  ExecutiveCoachingValidationIssue,
  ExecutiveCoachingValidationResult,
  ExecutiveDecisionQualityPrompt,
  ExecutivePlanReviewPrompt,
  ExecutiveReflectionPrompt,
} from "./executiveCoachingTypes.ts";
export { EXECUTIVE_COACHING_CAPABILITY_REGISTRY, listExecutiveCoachingCapabilities } from "./executiveCoachingRegistry.ts";
export { EXECUTIVE_COACHING_CONTRACTS } from "./executiveCoachingContracts.ts";
export { normalizeExecutiveCoachingContext } from "./executiveCoachingContext.ts";
export { buildExecutiveClarifyingQuestions } from "./executiveQuestionBuilder.ts";
export { buildExecutiveAssumptionChallenges } from "./executiveChallengeBuilder.ts";
export { detectExecutiveBlindSpots } from "./executiveBlindSpotDetector.ts";
export {
  buildExecutiveDecisionQualityPrompts,
  buildExecutivePlanReviewPrompts,
  buildExecutiveReflectionPrompts,
} from "./executiveReflectionBuilder.ts";
export { buildExecutiveCoachingExplanation } from "./executiveCoachingExplanation.ts";
export { validateExecutiveCoaching } from "./executiveCoachingValidation.ts";

import { detectExecutiveBlindSpots } from "./executiveBlindSpotDetector.ts";
import { buildExecutiveAssumptionChallenges } from "./executiveChallengeBuilder.ts";
import { buildExecutiveCoachingExplanation } from "./executiveCoachingExplanation.ts";
import { normalizeExecutiveCoachingContext } from "./executiveCoachingContext.ts";
import { buildExecutiveClarifyingQuestions } from "./executiveQuestionBuilder.ts";
import {
  buildExecutiveDecisionQualityPrompts,
  buildExecutivePlanReviewPrompts,
  buildExecutiveReflectionPrompts,
} from "./executiveReflectionBuilder.ts";
import { validateExecutiveCoaching } from "./executiveCoachingValidation.ts";
import type { ExecutiveCoachingInput, ExecutiveCoachingResult } from "./executiveCoachingTypes.ts";

export function buildExecutiveCoaching(input: ExecutiveCoachingInput): ExecutiveCoachingResult {
  const context = normalizeExecutiveCoachingContext(input);
  const questions = buildExecutiveClarifyingQuestions(input, context);
  const challenges = buildExecutiveAssumptionChallenges(input);
  const blindSpots = detectExecutiveBlindSpots(input);
  const reflectionPrompts = buildExecutiveReflectionPrompts(context);
  const decisionQualityPrompts = buildExecutiveDecisionQualityPrompts(input);
  const planReviewPrompts = buildExecutivePlanReviewPrompts(input);
  const explanation = buildExecutiveCoachingExplanation(context.session, questions, challenges, blindSpots);
  const withoutValidation = Object.freeze({
    session: context.session,
    input,
    context,
    questions,
    challenges,
    blindSpots,
    reflectionPrompts,
    decisionQualityPrompts,
    planReviewPrompts,
    explanation,
    validation: Object.freeze({ valid: true, issues: Object.freeze([]) }),
  });
  const validation = validateExecutiveCoaching(withoutValidation);

  return Object.freeze({
    session: context.session,
    input,
    context,
    questions,
    challenges,
    blindSpots,
    reflectionPrompts,
    decisionQualityPrompts,
    planReviewPrompts,
    explanation,
    validation,
  });
}

export const ExecutiveCoachingEngine = Object.freeze({
  buildExecutiveCoaching,
  buildExecutiveClarifyingQuestions,
  buildExecutiveAssumptionChallenges,
  detectExecutiveBlindSpots,
  buildExecutiveCoachingExplanation,
  validateExecutiveCoaching,
});
