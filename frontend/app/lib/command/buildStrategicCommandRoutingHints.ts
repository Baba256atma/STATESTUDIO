import type { StrategicCommandRoutingHint } from "./strategicCommandTypes";

type RoutingContext = {
  priority: string;
  governanceMode?: string | null;
  approvalStatus?: string | null;
  councilConsensus?: string | null;
  teamAlignment?: string | null;
  collaborationAlignment?: string | null;
  orgWarning?: string | null;
};

function dedupe(hints: StrategicCommandRoutingHint[]): StrategicCommandRoutingHint[] {
  const seen = new Set<string>();
  return hints.filter((hint) => {
    const key = `${hint.target_view}:${hint.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildStrategicCommandRoutingHints(
  context: RoutingContext
): StrategicCommandRoutingHint[] {
  const hints: StrategicCommandRoutingHint[] = [];

  if (context.priority === "simulate") {
    hints.push({
      label: "Open Simulation",
      target_view: "simulate",
      reason: "Simulation is the main validation step before stronger action.",
    });
    hints.push({
      label: "Open Timeline",
      target_view: "timeline",
      reason: "Use the timeline to inspect downstream impact before action.",
    });
  }

  if (context.priority === "compare") {
    hints.push({
      label: "Open Compare",
      target_view: "compare",
      reason: "Trade-offs remain material enough to compare one lower-risk path.",
    });
  }

  if (context.priority === "approve" || context.approvalStatus === "pending_review") {
    hints.push({
      label: "Open Executive Approval",
      target_view: "executive_approval",
      reason: "Approval is the next operational blocker.",
    });
  }

  if (context.priority === "review" || context.governanceMode === "blocked") {
    hints.push({
      label: "Open Governance",
      target_view: "decision_governance",
      reason: "Governance controls are shaping what is currently allowed.",
    });
    hints.push({
      label: "Open Policy",
      target_view: "decision_policy",
      reason: "Policy drivers explain why the system is holding a cautious posture.",
    });
  }

  if (context.teamAlignment === "low") {
    hints.push({
      label: "Open Team Decision",
      target_view: "team_decision",
      reason: "Cross-role disagreement still needs alignment.",
    });
  }

  if (context.collaborationAlignment === "low") {
    hints.push({
      label: "Open Collaboration",
      target_view: "collaboration_intelligence",
      reason: "Contributor disagreement is still influencing the next move.",
    });
  }

  if (context.councilConsensus === "low" || context.councilConsensus === "moderate") {
    hints.push({
      label: "Open Decision Council",
      target_view: "decision_council",
      reason: "The internal council still has reservations that deserve review.",
    });
  }

  if (context.orgWarning) {
    hints.push({
      label: "Open Organization Memory",
      target_view: "org_memory",
      reason: "Cross-project history is adding caution to the current path.",
    });
  }

  hints.push({
    label: "Open Lifecycle",
    target_view: "decision_lifecycle",
    reason: "Review the full decision loop in one place if you need broader context.",
  });

  return dedupe(hints).slice(0, 4);
}
