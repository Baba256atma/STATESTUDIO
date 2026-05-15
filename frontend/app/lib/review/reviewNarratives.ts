import type { DecisionReviewStatus } from "./decisionReviewTypes.ts";

export function buildDecisionReviewTitle(params: {
  status: DecisionReviewStatus;
  focus: string;
}): string {
  const focus = params.focus || "Strategic decision";
  if (params.status === "stabilized") return `${focus} has stabilized.`;
  if (params.status === "superseded") return `${focus} has been superseded by updated operating evidence.`;
  if (params.status === "resolved") return `${focus} appears resolved.`;
  if (params.status === "monitoring") return `${focus} remains in monitoring review.`;
  return `${focus} remains under active review.`;
}

export function buildDecisionReviewSummary(params: {
  status: DecisionReviewStatus;
  previousState?: string;
  currentState?: string;
}): string {
  if (params.status === "stabilized") {
    return "Operational evidence indicates the decision pressure has moderated and should remain visible for continuity.";
  }
  if (params.status === "superseded") {
    return "Updated evidence has changed the strongest decision context and should be reviewed against the prior recommendation.";
  }
  if (params.status === "resolved") {
    return "The previous decision pressure appears to have moved out of the active review window.";
  }
  if (params.status === "monitoring") {
    return "The decision remains relevant, but the current posture is continued monitoring rather than immediate escalation.";
  }
  return "The decision pressure remains active and should stay connected to its supporting evidence.";
}

export function buildDecisionReviewRationale(params: {
  status: DecisionReviewStatus;
  confidenceDrift?: number;
}): string {
  if (params.status === "stabilized") {
    return "Review status changed because monitoring, confidence, or fragility evidence indicates reduced pressure.";
  }
  if (params.status === "superseded") {
    return "Review status changed because newer recommendation evidence points to a different strategic focus.";
  }
  if (params.status === "resolved") {
    return "Review status changed because the active supporting pressure is no longer visible.";
  }
  if (params.status === "monitoring") {
    return "Review status remains observational while operational conditions continue to be tracked.";
  }
  return "Review status remains active because supporting signals still indicate decision pressure.";
}
