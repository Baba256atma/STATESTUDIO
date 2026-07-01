import type {
  ExecutiveCommunicationResult,
  ExecutiveCommunicationValidationIssue,
  ExecutiveCommunicationValidationResult,
} from "./executiveCommunicationTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveCommunicationValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveCommunicationValidationIssue[]): ExecutiveCommunicationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveCommunication(candidate: ExecutiveCommunicationResult): ExecutiveCommunicationValidationResult {
  const issues: ExecutiveCommunicationValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-8") {
    issues.push(issue("invalid_session", "session", "Communication session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId ||
    candidate.session.thoughtPartnerSessionId !== candidate.input.thoughtPartner.session.sessionId ||
    candidate.session.visualReasoningSessionId !== candidate.input.visualReasoning.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Communication must trace to LAY-2 through LAY-7."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid ||
    !candidate.input.thoughtPartner.validation.valid ||
    !candidate.input.visualReasoning.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Communication requires valid upstream layer inputs."));
  }
  if (
    candidate.audienceFrames.length !== candidate.context.audienceIds.length ||
    candidate.audienceFrames.some((frame) => !frame.focus.trim() || frame.sourceReferences.length < 4 || !frame.explanation.trim())
  ) {
    issues.push(issue("invalid_audience_frame", "audienceFrames", "Every audience frame must be complete and traceable."));
  }
  if (
    !candidate.briefing.situation.trim() ||
    !candidate.briefing.judgmentRationale.trim() ||
    !candidate.briefing.planOverview.trim() ||
    candidate.briefing.sourceReferences.length < 6 ||
    !candidate.briefing.explanation.trim()
  ) {
    issues.push(issue("invalid_briefing", "briefing", "Briefing must include situation, rationale, plan overview, explanation, and traces."));
  }
  if (
    !candidate.summary.headline.trim() ||
    candidate.summary.keyPoints.length === 0 ||
    candidate.summary.rationalePoints.length === 0 ||
    candidate.summary.traceReferences.length < 6
  ) {
    issues.push(issue("invalid_summary", "summary", "Summary must include headline, key points, rationale, and traces."));
  }
  if (
    candidate.riskCommunication.riskStatements.length === 0 ||
    candidate.riskCommunication.sourceReferences.length === 0 ||
    !candidate.riskCommunication.explanation.trim()
  ) {
    issues.push(issue("invalid_risk_communication", "riskCommunication", "Risk communication must include risk statements and traces."));
  }
  if (
    candidate.planCommunication.goalMessages.length === 0 ||
    candidate.planCommunication.milestoneMessages.length === 0 ||
    candidate.planCommunication.dependencyMessages.length === 0 ||
    candidate.planCommunication.sourceReferences.length === 0 ||
    !candidate.planCommunication.explanation.trim()
  ) {
    issues.push(issue("invalid_plan_communication", "planCommunication", "Plan communication must include goals, milestones, dependencies, and traces."));
  }
  if (
    !isSorted(candidate.audienceFrames.map((frame) => frame.frameId)) ||
    !isSorted(candidate.briefing.risks) ||
    !isSorted(candidate.planCommunication.goalMessages)
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Communication output must use deterministic ordering."));
  }

  return result(issues);
}
