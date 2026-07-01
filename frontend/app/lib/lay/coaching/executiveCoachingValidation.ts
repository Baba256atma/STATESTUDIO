import type {
  ExecutiveCoachingResult,
  ExecutiveCoachingValidationIssue,
  ExecutiveCoachingValidationResult,
} from "./executiveCoachingTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveCoachingValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveCoachingValidationIssue[]): ExecutiveCoachingValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveCoaching(candidate: ExecutiveCoachingResult): ExecutiveCoachingValidationResult {
  const issues: ExecutiveCoachingValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-5") {
    issues.push(issue("invalid_session", "session", "Coaching session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Coaching session must trace to LAY-2, LAY-3, and LAY-4."));
  }
  if (!candidate.input.reasoning.validation.valid || !candidate.input.judgment.validation.valid || !candidate.input.planning.validation.valid) {
    issues.push(issue("invalid_inputs", "input", "Coaching requires valid reasoning, judgment, and planning inputs."));
  }
  if (candidate.questions.some((question) => !question.prompt.trim() || !question.sourceId.trim() || !question.coachingIntent.trim())) {
    issues.push(issue("invalid_question", "questions", "Every question must include prompt, source, and intent."));
  }
  if (
    candidate.challenges.some(
      (challenge) =>
        !challenge.challengedAssumptionId.trim() ||
        !challenge.reasonForChallenge.trim() ||
        !challenge.relatedEvidence.trim() ||
        !challenge.relatedRisk.trim() ||
        !challenge.coachingIntent.trim()
    )
  ) {
    issues.push(issue("invalid_challenge", "challenges", "Every challenge must be complete."));
  }
  if (candidate.blindSpots.some((blindSpot) => !blindSpot.sourceId.trim() || !blindSpot.traceReference.trim())) {
    issues.push(issue("invalid_blind_spot", "blindSpots", "Every blind spot must preserve source and trace reference."));
  }
  if (
    candidate.explanation.questionReasons.length !== candidate.questions.length ||
    candidate.explanation.challengeReasons.length !== candidate.challenges.length ||
    candidate.explanation.blindSpotReasons.length !== candidate.blindSpots.length ||
    candidate.explanation.traceReferences.length < 3
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Coaching explanation must cover questions, challenges, blind spots, and traces."));
  }
  if (!isSorted(candidate.questions.map((question) => question.questionId)) || !isSorted(candidate.blindSpots.map((blindSpot) => blindSpot.blindSpotId))) {
    issues.push(issue("non_deterministic_order", "ordering", "Coaching output must be deterministically ordered."));
  }

  return result(issues);
}
