import type {
  ExecutiveNegotiationResult,
  ExecutiveNegotiationValidationIssue,
  ExecutiveNegotiationValidationResult,
} from "./executiveNegotiationTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveNegotiationValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveNegotiationValidationIssue[]): ExecutiveNegotiationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveNegotiation(candidate: ExecutiveNegotiationResult): ExecutiveNegotiationValidationResult {
  const issues: ExecutiveNegotiationValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-9") {
    issues.push(issue("invalid_session", "session", "Negotiation session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId ||
    candidate.session.thoughtPartnerSessionId !== candidate.input.thoughtPartner.session.sessionId ||
    candidate.session.visualReasoningSessionId !== candidate.input.visualReasoning.session.sessionId ||
    candidate.session.communicationSessionId !== candidate.input.communication.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Negotiation must trace to LAY-2 through LAY-8."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid ||
    !candidate.input.thoughtPartner.validation.valid ||
    !candidate.input.visualReasoning.validation.valid ||
    !candidate.input.communication.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Negotiation requires valid upstream layer inputs."));
  }
  if (candidate.stakeholderPositions.some((position) => !position.statedPosition.trim() || !position.sourceReference.trim() || !position.explanation.trim())) {
    issues.push(issue("invalid_position", "stakeholderPositions", "Every stakeholder position must be complete."));
  }
  if (candidate.interests.some((interest) => !interest.underlyingInterest.trim() || !interest.contrastedPosition.trim() || !interest.explanation.trim())) {
    issues.push(issue("invalid_interest", "interests", "Every interest must separate interest and position."));
  }
  if (candidate.leveragePoints.some((leverage) => !leverage.leverageStatement.trim() || !leverage.sourceReference.trim() || !leverage.explanation.trim())) {
    issues.push(issue("invalid_leverage", "leveragePoints", "Every leverage point must be complete and traceable."));
  }
  if (candidate.concessionCandidates.some((concession) => !concession.candidate.trim() || !concession.boundary.trim() || !concession.explanation.trim())) {
    issues.push(issue("invalid_concession", "concessionCandidates", "Every concession candidate must include a boundary and explanation."));
  }
  if (candidate.conflictZones.some((zone) => !zone.conflictStatement.trim() || zone.sourceReferences.length < 2 || !zone.explanation.trim())) {
    issues.push(issue("invalid_conflict_zone", "conflictZones", "Every conflict zone must include compared positions and traces."));
  }
  if (candidate.negotiationPaths.some((path) => !path.openingFrame.trim() || !path.possibleNextQuestion.trim() || path.sourceReferences.length === 0 || !path.explanation.trim())) {
    issues.push(issue("invalid_path", "negotiationPaths", "Every negotiation path must be complete and non-final."));
  }
  if (
    candidate.explanation.positionReasons.length !== candidate.stakeholderPositions.length ||
    candidate.explanation.interestReasons.length !== candidate.interests.length ||
    candidate.explanation.leverageReasons.length !== candidate.leveragePoints.length ||
    candidate.explanation.concessionReasons.length !== candidate.concessionCandidates.length ||
    candidate.explanation.conflictReasons.length !== candidate.conflictZones.length ||
    candidate.explanation.pathReasons.length !== candidate.negotiationPaths.length ||
    candidate.explanation.traceReferences.length < 7
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Negotiation explanation must cover all negotiation artifacts and traces."));
  }
  if (
    !isSorted(candidate.stakeholderPositions.map((position) => position.stakeholderId)) ||
    !isSorted(candidate.interests.map((interest) => interest.interestId)) ||
    !isSorted(candidate.leveragePoints.map((leverage) => leverage.leverageId)) ||
    !isSorted(candidate.concessionCandidates.map((concession) => concession.concessionId)) ||
    !isSorted(candidate.conflictZones.map((zone) => zone.conflictZoneId)) ||
    !isSorted(candidate.negotiationPaths.map((path) => path.pathId))
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Negotiation output must use deterministic ordering."));
  }

  return result(issues);
}
