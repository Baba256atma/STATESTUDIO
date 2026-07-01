import type {
  ExecutiveCreativityResult,
  ExecutiveCreativityValidationIssue,
  ExecutiveCreativityValidationResult,
} from "./executiveCreativityTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveCreativityValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveCreativityValidationIssue[]): ExecutiveCreativityValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveCreativity(candidate: ExecutiveCreativityResult): ExecutiveCreativityValidationResult {
  const issues: ExecutiveCreativityValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-10") {
    issues.push(issue("invalid_session", "session", "Creativity session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId ||
    candidate.session.thoughtPartnerSessionId !== candidate.input.thoughtPartner.session.sessionId ||
    candidate.session.visualReasoningSessionId !== candidate.input.visualReasoning.session.sessionId ||
    candidate.session.communicationSessionId !== candidate.input.communication.session.sessionId ||
    candidate.session.negotiationSessionId !== candidate.input.negotiation.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Creativity must trace to LAY-2 through LAY-9."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid ||
    !candidate.input.thoughtPartner.validation.valid ||
    !candidate.input.visualReasoning.validation.valid ||
    !candidate.input.communication.validation.valid ||
    !candidate.input.negotiation.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Creativity requires valid upstream layer inputs."));
  }
  if (candidate.reframes.some((item) => !item.reframe.trim() || !item.sourceReference.trim() || !item.explanation.trim())) {
    issues.push(issue("invalid_reframe", "reframes", "Every reframe must be complete and traceable."));
  }
  if (candidate.alternatives.some((item) => !item.alternative.trim() || item.selectionState !== "not-selected" || !item.explanation.trim())) {
    issues.push(issue("invalid_alternative", "alternatives", "Every alternative must remain unselected and complete."));
  }
  if (candidate.opportunities.some((item) => !item.idea.trim() || item.domainSpecific !== false || !item.explanation.trim())) {
    issues.push(issue("invalid_opportunity", "opportunities", "Every opportunity idea must be generic and complete."));
  }
  if (candidate.constraintReframes.some((item) => !item.designInput.trim() || item.blockerState !== "reframed-as-input" || !item.explanation.trim())) {
    issues.push(issue("invalid_constraint_reframe", "constraintReframes", "Every constraint must be reframed as design input."));
  }
  if (candidate.strategicAngles.some((item) => !item.angle.trim() || !item.sourceReference.trim() || !item.explanation.trim())) {
    issues.push(issue("invalid_strategic_angle", "strategicAngles", "Every strategic angle must be complete."));
  }
  if (candidate.innovationPaths.some((item) => !item.openingReframe.trim() || !item.creativeAlternative.trim() || item.conceptualOnly !== true || !item.explanation.trim())) {
    issues.push(issue("invalid_innovation_path", "innovationPaths", "Every innovation path must be conceptual and complete."));
  }
  if (
    candidate.explanation.reframeReasons.length !== candidate.reframes.length ||
    candidate.explanation.alternativeReasons.length !== candidate.alternatives.length ||
    candidate.explanation.opportunityReasons.length !== candidate.opportunities.length ||
    candidate.explanation.constraintReasons.length !== candidate.constraintReframes.length ||
    candidate.explanation.angleReasons.length !== candidate.strategicAngles.length ||
    candidate.explanation.pathReasons.length !== candidate.innovationPaths.length ||
    candidate.explanation.traceReferences.length < 8
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Creativity explanation must cover all creative artifacts and upstream traces."));
  }
  if (
    !isSorted(candidate.reframes.map((item) => item.reframeId)) ||
    !isSorted(candidate.alternatives.map((item) => item.alternativeId)) ||
    !isSorted(candidate.opportunities.map((item) => item.opportunityIdeaId)) ||
    !isSorted(candidate.constraintReframes.map((item) => item.constraintReframeId)) ||
    !isSorted(candidate.strategicAngles.map((item) => item.angleId)) ||
    !isSorted(candidate.innovationPaths.map((item) => item.pathId))
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Creativity output must use deterministic ordering."));
  }

  return result(issues);
}
