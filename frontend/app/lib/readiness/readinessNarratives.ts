import type { DecisionReadinessState } from "./executiveDecisionReadinessTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the current operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" - ");
}

function stateLabel(state: DecisionReadinessState): string {
  if (state === "not_ready") return "Not Ready";
  if (state === "limited") return "Limited";
  if (state === "developing") return "Developing";
  if (state === "ready_for_review") return "Ready for Review";
  return "Ready";
}

export function readinessStateFromInputs(params: {
  readinessScore: number;
  uncertaintyLevel: number;
  blockerCount: number;
}): DecisionReadinessState {
  if (params.blockerCount >= 3 || params.uncertaintyLevel >= 0.78 || params.readinessScore < 0.22) return "not_ready";
  if (params.blockerCount >= 2 || params.uncertaintyLevel >= 0.62 || params.readinessScore < 0.38) return "limited";
  if (params.blockerCount >= 1 || params.uncertaintyLevel >= 0.42 || params.readinessScore < 0.56) return "developing";
  if (params.readinessScore < 0.76) return "ready_for_review";
  return "ready";
}

export function buildReadinessTitle(params: {
  readinessState: DecisionReadinessState;
  relatedObjectIds: string[];
}): string {
  return `Decision Readiness ${stateLabel(params.readinessState)}: ${objectPhrase(params.relatedObjectIds)}`;
}

export function buildReadinessSummary(params: {
  readinessState: DecisionReadinessState;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.readinessState === "ready") {
    return `Operational evidence appears sufficiently mature for executive decision review across ${path}.`;
  }
  if (params.readinessState === "ready_for_review") {
    return `Operational conditions appear stable enough to prepare executive review across ${path}.`;
  }
  if (params.readinessState === "developing") {
    return `Decision readiness is developing, but some evidence still needs stabilization across ${path}.`;
  }
  if (params.readinessState === "limited") {
    return `Decision readiness remains limited by unresolved uncertainty across ${path}.`;
  }
  return `Executive action timing is not ready because operational evidence remains too unsettled across ${path}.`;
}

export function buildReadinessRationale(params: {
  readinessState: DecisionReadinessState;
  blockerCount: number;
}): string {
  if (params.readinessState === "ready" || params.readinessState === "ready_for_review") {
    return "Confidence, monitoring maturity, and operating stability are sufficiently aligned for executive review.";
  }
  if (params.blockerCount > 0) {
    return "Readiness is constrained by unresolved blockers that should be reviewed before executive action.";
  }
  return "Readiness is still forming as evidence quality, monitoring maturity, and coordination alignment converge.";
}

export function buildTimingGuidance(params: {
  readinessState: DecisionReadinessState;
  blockerLabels: string[];
}): string {
  if (params.readinessState === "ready") {
    return "Proceed with executive review while maintaining monitoring discipline.";
  }
  if (params.readinessState === "ready_for_review") {
    return "Prepare executive review and confirm remaining assumptions before action.";
  }
  if (params.readinessState === "developing") {
    return "Continue monitoring evidence convergence before committing to action.";
  }
  const blocker = params.blockerLabels[0] ?? "unresolved operational uncertainty";
  return `Delay executive action until ${blocker.toLowerCase()} improves.`;
}
