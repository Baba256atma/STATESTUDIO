import type {
  ExecutivePlanningResult,
  ExecutivePlanningValidationIssue,
  ExecutivePlanningValidationResult,
} from "./executivePlanningTypes.ts";

function issue(code: string, field: string, message: string): ExecutivePlanningValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutivePlanningValidationIssue[]): ExecutivePlanningValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSequential(values: readonly number[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1] < value);
}

export function validateExecutivePlanning(candidate: ExecutivePlanningResult): ExecutivePlanningValidationResult {
  const issues: ExecutivePlanningValidationIssue[] = [];
  const goalIds = new Set(candidate.goals.map((goal) => goal.goalId));
  const milestoneIds = new Set(candidate.milestones.map((milestone) => milestone.milestoneId));
  const phaseIds = new Set(candidate.phases.map((phase) => phase.phaseId));
  const knownIds = new Set([...goalIds, ...milestoneIds, ...phaseIds]);

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-4") {
    issues.push(issue("invalid_session", "session", "Planning session is invalid."));
  }
  if (!candidate.input.judgment.validation.valid) {
    issues.push(issue("invalid_judgment", "input.judgment", "Planning requires valid LAY-3 judgment."));
  }
  if (candidate.goals.length !== candidate.input.judgment.judgment.priorities.length) {
    issues.push(issue("invalid_goal_trace", "goals", "Every judgment priority must produce a goal."));
  }
  candidate.goals.forEach((goal) => {
    if (!goal.sourceJudgmentId.trim() || !goal.rationaleReference.trim()) {
      issues.push(issue("missing_judgment_trace", goal.goalId, "Goal must trace to judgment and rationale."));
    }
  });
  candidate.milestones.forEach((milestone) => {
    if (!goalIds.has(milestone.goalId)) {
      issues.push(issue("invalid_milestone", milestone.milestoneId, "Milestone must reference a known goal."));
    }
  });
  candidate.dependencies.forEach((dependency) => {
    if (!knownIds.has(dependency.fromId) || !knownIds.has(dependency.toId)) {
      issues.push(issue("invalid_dependency", dependency.dependencyId, "Dependency must reference known planning elements."));
    }
  });
  candidate.phases.forEach((phase) => {
    if (phase.milestoneIds.some((milestoneId) => !milestoneIds.has(milestoneId))) {
      issues.push(issue("invalid_phase", phase.phaseId, "Phase must reference known milestones."));
    }
  });
  if (!isSequential(candidate.timeline.sequence.map((entry) => candidate.timeline.sequence.indexOf(entry)))) {
    issues.push(issue("invalid_timeline_order", "timeline.sequence", "Timeline sequence must be deterministic."));
  }
  if (candidate.timeline.realDatesAssigned || candidate.timeline.durationsAssigned || candidate.timeline.mode !== "logical-only") {
    issues.push(issue("invalid_timeline", "timeline", "Timeline must be logical-only with no dates or durations."));
  }
  if (
    candidate.explanation.whyThisPlan.length === 0 ||
    candidate.explanation.whyTheseMilestones.length === 0 ||
    candidate.explanation.whyThisSequence.length === 0 ||
    candidate.explanation.judgmentTrace.length !== candidate.goals.length
  ) {
    issues.push(issue("invalid_explanation", "explanation", "Plan explanation must be complete and traceable."));
  }

  return result(issues);
}
