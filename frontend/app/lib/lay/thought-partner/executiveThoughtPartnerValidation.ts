import type {
  ExecutiveThoughtPartnerResult,
  ExecutiveThoughtPartnerValidationIssue,
  ExecutiveThoughtPartnerValidationResult,
} from "./executiveThoughtPartnerTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveThoughtPartnerValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveThoughtPartnerValidationIssue[]): ExecutiveThoughtPartnerValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSorted(values: readonly string[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1].localeCompare(value) <= 0);
}

export function validateExecutiveThoughtPartner(candidate: ExecutiveThoughtPartnerResult): ExecutiveThoughtPartnerValidationResult {
  const issues: ExecutiveThoughtPartnerValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-6") {
    issues.push(issue("invalid_session", "session", "Thought partner session is invalid."));
  }
  if (
    candidate.session.reasoningSessionId !== candidate.input.reasoning.session.sessionId ||
    candidate.session.judgmentSessionId !== candidate.input.judgment.session.sessionId ||
    candidate.session.planningSessionId !== candidate.input.planning.session.sessionId ||
    candidate.session.coachingSessionId !== candidate.input.coaching.session.sessionId
  ) {
    issues.push(issue("invalid_traceability", "session", "Thought partner session must trace to LAY-2, LAY-3, LAY-4, and LAY-5."));
  }
  if (
    !candidate.input.reasoning.validation.valid ||
    !candidate.input.judgment.validation.valid ||
    !candidate.input.planning.validation.valid ||
    !candidate.input.coaching.validation.valid
  ) {
    issues.push(issue("invalid_inputs", "input", "Thought partner requires valid upstream layer inputs."));
  }
  if (
    candidate.perspectives.some(
      (perspective) =>
        !perspective.perspectiveId.trim() ||
        !perspective.perspectiveName.trim() ||
        !perspective.basis.trim() ||
        perspective.linkedReferences.length < 4
    )
  ) {
    issues.push(issue("invalid_perspective", "perspectives", "Every perspective frame must be complete and traceable."));
  }
  if (
    candidate.counterpoints.some(
      (counterpoint) =>
        !counterpoint.statement.trim() ||
        !counterpoint.reason.trim() ||
        !counterpoint.sourceReference.trim() ||
        !counterpoint.executiveRelevance.trim()
    )
  ) {
    issues.push(issue("invalid_counterpoint", "counterpoints", "Every counterpoint must be complete."));
  }
  if (
    candidate.alternativeViewpoints.some(
      (viewpoint) =>
        !viewpoint.viewpoint.trim() ||
        !viewpoint.whyItMatters.trim() ||
        !viewpoint.supportingSource.trim() ||
        !viewpoint.uncertaintyNote.trim()
    )
  ) {
    issues.push(issue("invalid_viewpoint", "alternativeViewpoints", "Every alternative viewpoint must be complete."));
  }
  if (
    candidate.debatePaths.some(
      (path) =>
        !path.openingPosition.trim() ||
        !path.counterpoint.trim() ||
        !path.refinementQuestion.trim() ||
        !path.possibleSynthesis.trim() ||
        path.traceReferences.length === 0
    )
  ) {
    issues.push(issue("invalid_debate_path", "debatePaths", "Every debate path must preserve non-decisional structure and traceability."));
  }
  if (
    candidate.tensionMap.some(
      (tension) =>
        !tension.leftPole.trim() ||
        !tension.rightPole.trim() ||
        !tension.sourceReference.trim() ||
        tension.traceReferences.length === 0
    )
  ) {
    issues.push(issue("invalid_tension_map", "tensionMap", "Every tension must be complete and traceable."));
  }
  if (
    candidate.explanation.perspectiveReasons.length !== candidate.perspectives.length ||
    candidate.explanation.counterpointReasons.length !== candidate.counterpoints.length ||
    candidate.explanation.tensionReasons.length !== candidate.tensionMap.length ||
    candidate.explanation.traceReferences.length < 4
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Thought partner explanation must cover perspectives, counterpoints, tensions, and traces."));
  }
  if (
    !isSorted(candidate.perspectives.map((perspective) => perspective.perspectiveId)) ||
    !isSorted(candidate.counterpoints.map((counterpoint) => counterpoint.counterpointId)) ||
    !isSorted(candidate.alternativeViewpoints.map((viewpoint) => viewpoint.viewpointId)) ||
    !isSorted(candidate.tensionMap.map((tension) => tension.tensionId))
  ) {
    issues.push(issue("non_deterministic_order", "ordering", "Thought partner output must be deterministically ordered."));
  }

  return result(issues);
}
