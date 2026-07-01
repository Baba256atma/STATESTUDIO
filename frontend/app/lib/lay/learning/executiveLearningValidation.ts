import type {
  ExecutiveLearningResult,
  ExecutiveLearningValidationIssue,
  ExecutiveLearningValidationResult,
} from "./executiveLearningTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveLearningValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveLearningValidationIssue[]): ExecutiveLearningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveLearning(candidate: ExecutiveLearningResult): ExecutiveLearningValidationResult {
  const issues: ExecutiveLearningValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-11") {
    issues.push(issue("invalid_session", "session", "Learning session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId ||
    candidate.session.thoughtPartnerSessionId !== candidate.input.thoughtPartner.session.sessionId ||
    candidate.session.visualReasoningSessionId !== candidate.input.visualReasoning.session.sessionId ||
    candidate.session.communicationSessionId !== candidate.input.communication.session.sessionId ||
    candidate.session.negotiationSessionId !== candidate.input.negotiation.session.sessionId ||
    candidate.session.creativitySessionId !== candidate.input.creativity.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Learning must trace to LAY-2 through LAY-10."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid ||
    !candidate.input.thoughtPartner.validation.valid ||
    !candidate.input.visualReasoning.validation.valid ||
    !candidate.input.communication.validation.valid ||
    !candidate.input.negotiation.validation.valid ||
    !candidate.input.creativity.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Learning requires valid upstream layer inputs."));
  }
  if (candidate.patterns.some((pattern) => pattern.sourceReferences.length === 0 || !pattern.observation.trim() || !pattern.explanation.trim())) {
    issues.push(issue("invalid_pattern", "patterns", "Every pattern must include sources, observation, and explanation."));
  }
  if (candidate.assumptionPatterns.some((pattern) => pattern.occurrenceCount !== pattern.sourceReferences.length || !pattern.explanation.trim())) {
    issues.push(issue("invalid_assumption_pattern", "assumptionPatterns", "Every assumption pattern must preserve occurrence metadata."));
  }
  if (candidate.lessons.some((lesson) => lesson.memoryMutation !== false || !lesson.lesson.trim() || !lesson.explanation.trim())) {
    issues.push(issue("invalid_lesson", "lessons", "Every reusable lesson must remain metadata-only."));
  }
  if (
    candidate.judgmentReflection.sourceReferences.length === 0 ||
    candidate.planReflection.sourceReferences.length === 0 ||
    candidate.coachingReflection.sourceReferences.length === 0
  ) {
    issues.push(issue("invalid_reflection", "reflections", "Every reflection must include source references."));
  }
  if (
    candidate.explanation.patternReasons.length !== candidate.patterns.length ||
    candidate.explanation.assumptionReasons.length !== candidate.assumptionPatterns.length ||
    candidate.explanation.reflectionReasons.length !== 3 ||
    candidate.explanation.lessonReasons.length !== candidate.lessons.length ||
    candidate.explanation.traceReferences.length < 9
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Learning explanation must cover all learning artifacts and source layers."));
  }
  if (
    !isSorted(candidate.patterns.map((pattern) => pattern.patternId)) ||
    !isSorted(candidate.assumptionPatterns.map((pattern) => pattern.assumptionPatternId)) ||
    !isSorted(candidate.lessons.map((lesson) => lesson.lessonId))
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Learning output must use deterministic ordering."));
  }

  return result(issues);
}
