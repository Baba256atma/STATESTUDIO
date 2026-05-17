/**
 * D7:1:10 — Executive governance narratives.
 */

import type {
  ExecutiveGovernanceNarrative,
  GovernanceFinding,
  GovernanceResponse,
  ReplayIntegrityReport,
  SimulationGovernanceStatus,
  SimulationStabilityMetrics,
} from "./simulationGovernanceTypes.ts";

const STATUS_HEADLINES: Record<SimulationGovernanceStatus, string> = {
  stable: "The simulation universe remains within enterprise-safe stability thresholds.",
  monitoring: "Governance is monitoring elevated simulation complexity while operations continue under observation.",
  degraded: "Simulation integrity has degraded; executive review is recommended before expanding scenarios.",
  protected: "The simulation governance layer entered protected mode to contain branch and orchestration complexity.",
  halted: "Unsafe simulation conditions were detected; high-risk replay and expansion activity is halted.",
};

export function buildExecutiveGovernanceNarrative(input: {
  status: SimulationGovernanceStatus;
  metrics: SimulationStabilityMetrics;
  findings: readonly GovernanceFinding[];
  responses: readonly GovernanceResponse[];
  replayIntegrity: ReplayIntegrityReport;
}): ExecutiveGovernanceNarrative {
  const headline = STATUS_HEADLINES[input.status];
  const summaryParts: string[] = [headline];

  const branchFinding = input.findings.find((f) => f.code === "branch_explosion_risk");
  if (branchFinding) {
    summaryParts.push(
      "Scenario branching is approaching or exceeding safe operational thresholds."
    );
  }

  if (!input.replayIntegrity.verified && input.replayIntegrity.failures.length > 0) {
    summaryParts.push(
      `${input.replayIntegrity.failures.length} replay integrity issue(s) require review before playback continues.`
    );
  }

  if (input.metrics.orchestrationPressure > 0.5) {
    summaryParts.push("War-room orchestration load is elevated across active sessions.");
  }

  const bullets: string[] = [];
  for (const response of input.responses.filter((r) => r.action !== "allow").slice(0, 4)) {
    bullets.push(`${response.action}: ${response.reason}`);
  }
  for (const finding of input.findings.slice(0, 3)) {
    if (!bullets.some((b) => b.includes(finding.message.slice(0, 32)))) {
      bullets.push(finding.message);
    }
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    bullets,
  };
}
