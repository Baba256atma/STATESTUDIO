import type { StrategicCommandPriority } from "./strategicCommandTypes";

type CommandPriorityContext = {
  metaStrategy?: string | null;
  policyPosture?: string | null;
  governanceMode?: string | null;
  approvalStatus?: string | null;
  confidenceLevel?: string | null;
  calibrationLabel?: string | null;
  teamAlignment?: string | null;
  collaborationAlignment?: string | null;
  councilConsensus?: string | null;
  councilReservation?: string | null;
  orgWarning?: string | null;
  outcomeStatus?: string | null;
};

export function buildStrategicCommandPriority(
  context: CommandPriorityContext
): { priority: StrategicCommandPriority; reason: string } {
  if (context.approvalStatus === "escalated" || context.governanceMode === "executive_review_required") {
    return {
      priority: "escalate",
      reason: "Executive review is the main blocker before stronger action can proceed.",
    };
  }

  if (context.approvalStatus === "pending_review" || context.governanceMode === "approval_required") {
    return {
      priority: "approve",
      reason: "Analysis is far enough along that approval is the next gating step.",
    };
  }

  if (context.governanceMode === "blocked" || context.policyPosture === "restricted") {
    return {
      priority: "review",
      reason: "Current controls restrict stronger action until the decision is reviewed.",
    };
  }

  if (context.policyPosture === "compare_first" || context.governanceMode === "compare_required" || context.metaStrategy === "compare_first") {
    return {
      priority: "compare",
      reason: "Trade-offs remain material enough that comparison should happen before commitment.",
    };
  }

  if (context.policyPosture === "simulation_first" || context.metaStrategy === "simulation_first" || context.governanceMode === "simulation_allowed") {
    return {
      priority: "simulate",
      reason: "Downstream uncertainty remains meaningful enough to favor simulation first.",
    };
  }

  if (
    context.confidenceLevel === "low" ||
    context.calibrationLabel === "overconfident" ||
    context.outcomeStatus === "worse_than_expected"
  ) {
    return {
      priority: "investigate",
      reason: "Confidence and outcome signals suggest the recommendation needs more validation.",
    };
  }

  if (
    context.teamAlignment === "low" ||
    context.collaborationAlignment === "low" ||
    context.councilConsensus === "low"
  ) {
    return {
      priority: "review",
      reason: "Alignment remains too weak for a stronger execution posture.",
    };
  }

  if (context.councilReservation || context.orgWarning) {
    return {
      priority: "stabilize",
      reason: "Reservations remain active, so the safest posture is to stabilize before escalating.",
    };
  }

  return {
    priority: "act",
    reason: "The recommendation is stable enough that safe action is the main next step.",
  };
}
