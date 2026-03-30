import type { StrategicCommandAlert } from "./strategicCommandTypes";

type AlertsContext = {
  confidenceLevel?: string | null;
  calibrationLabel?: string | null;
  policyPosture?: string | null;
  governanceMode?: string | null;
  approvalStatus?: string | null;
  teamAlignment?: string | null;
  collaborationAlignment?: string | null;
  councilConsensus?: string | null;
  councilReservation?: string | null;
  orgWarning?: string | null;
  outcomeStatus?: string | null;
};

function pushAlert(
  list: StrategicCommandAlert[],
  alert: StrategicCommandAlert | null
) {
  if (!alert) return;
  if (list.some((item) => item.id === alert.id)) return;
  list.push(alert);
}

export function buildStrategicCommandAlerts(
  context: AlertsContext
): StrategicCommandAlert[] {
  const alerts: StrategicCommandAlert[] = [];

  pushAlert(
    alerts,
    context.approvalStatus === "pending_review"
      ? {
          id: "approval_pending",
          level: "warning",
          title: "Approval pending",
          summary: "Direct apply remains gated until approval is resolved.",
          source: "approval",
        }
      : null
  );

  pushAlert(
    alerts,
    context.governanceMode === "blocked"
      ? {
          id: "governance_blocked",
          level: "critical",
          title: "Action is currently blocked",
          summary: "Governance does not allow stronger action in the current posture.",
          source: "governance",
        }
      : null
  );

  pushAlert(
    alerts,
    context.calibrationLabel === "overconfident"
      ? {
          id: "calibration_overconfident",
          level: "warning",
          title: "Confidence weakened after calibration",
          summary: "Recent evidence suggests this class of recommendation may be overstated.",
          source: "calibration",
        }
      : null
  );

  pushAlert(
    alerts,
    context.teamAlignment === "low" || context.collaborationAlignment === "low"
      ? {
          id: "alignment_low",
          level: "warning",
          title: "Alignment remains low",
          summary: "Team or collaboration disagreement is still material enough to slow stronger action.",
          source: context.collaborationAlignment === "low" ? "collaboration" : "team",
        }
      : null
  );

  pushAlert(
    alerts,
    context.councilConsensus === "moderate" || context.councilConsensus === "low"
      ? {
          id: "council_reservation",
          level: context.councilConsensus === "low" ? "critical" : "warning",
          title: `Council consensus is ${context.councilConsensus ?? "limited"}`,
          summary: context.councilReservation ?? "The internal council still holds reservations about stronger action.",
          source: "council",
        }
      : null
  );

  pushAlert(
    alerts,
    context.orgWarning
      ? {
          id: "org_warning",
          level: "warning",
          title: "Organization memory warning",
          summary: context.orgWarning,
          source: "org_memory",
        }
      : null
  );

  pushAlert(
    alerts,
    context.policyPosture === "simulation_first"
      ? {
          id: "simulation_first",
          level: "info",
          title: "Simulation-first posture active",
          summary: "Nexora still recommends validating downstream impact before stronger action.",
          source: "simulation",
        }
      : null
  );

  pushAlert(
    alerts,
    context.outcomeStatus === "worse_than_expected"
      ? {
          id: "outcome_worse",
          level: "warning",
          title: "Outcome feedback weakened trust",
          summary: "Observed results underperformed relative to expectation.",
          source: "confidence",
        }
      : null
  );

  return alerts.slice(0, 5);
}
