import type {
  ExecutiveJudgmentResult,
  ExecutiveJudgmentValidationIssue,
  ExecutiveJudgmentValidationResult,
} from "./executiveJudgmentTypes.ts";

function issue(code: string, field: string, message: string): ExecutiveJudgmentValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly ExecutiveJudgmentValidationIssue[]): ExecutiveJudgmentValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

function isSequential(values: readonly number[]): boolean {
  return values.every((value, index) => value === index + 1);
}

function isSortedByOrder(values: readonly number[]): boolean {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

export function validateExecutiveJudgment(candidate: ExecutiveJudgmentResult): ExecutiveJudgmentValidationResult {
  const issues: ExecutiveJudgmentValidationIssue[] = [];

  if (!candidate.session.sessionId.trim() || candidate.session.phase !== "LAY-3") {
    issues.push(issue("invalid_session", "session", "Judgment session is invalid."));
  }
  if (!candidate.input.reasoning.validation.valid) {
    issues.push(issue("invalid_reasoning", "input.reasoning", "Judgment requires valid LAY-2 reasoning."));
  }
  if (candidate.judgment.alternativeEvaluations.length !== candidate.input.reasoning.components.alternatives.length) {
    issues.push(issue("invalid_alternative_evaluation", "judgment.alternativeEvaluations", "Every reasoning alternative must be evaluated."));
  }
  if (candidate.judgment.tradeoffJudgments.length !== candidate.input.reasoning.components.tradeoffs.length) {
    issues.push(issue("invalid_tradeoff_evaluation", "judgment.tradeoffJudgments", "Every reasoning trade-off must be evaluated."));
  }
  if (
    candidate.judgment.confidence.reasoningCompleteness < 0 ||
    candidate.judgment.confidence.evidenceCoverage < 0 ||
    candidate.judgment.confidence.assumptionQuality < 0 ||
    candidate.judgment.confidence.constraintConsistency < 0
  ) {
    issues.push(issue("invalid_confidence", "judgment.confidence", "Confidence values must be non-negative."));
  }
  if (
    candidate.rationale.whyThisJudgment.length === 0 ||
    candidate.rationale.evidence.length === 0 ||
    candidate.rationale.assumptions.length === 0 ||
    candidate.rationale.constraints.length === 0 ||
    candidate.rationale.narrative.toLowerCase().includes("recommend")
  ) {
    issues.push(issue("invalid_rationale", "rationale", "Rationale must be complete and avoid recommendations."));
  }

  const orders = candidate.judgment.priorities.map((priority) => priority.order);
  if (!isSequential(orders) || !isSortedByOrder(orders)) {
    issues.push(issue("invalid_priority_order", "judgment.priorities", "Priority ordering must be deterministic and sequential."));
  }

  return result(issues);
}
