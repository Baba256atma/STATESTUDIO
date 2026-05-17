/**
 * D7:1:10 — Safe governance responses (explicit, never silent mutation).
 */

import type {
  GovernanceFinding,
  GovernanceResponse,
  GovernanceResponseAction,
  ReplayIntegrityReport,
  SimulationGovernanceStatus,
} from "./simulationGovernanceTypes.ts";
import { GOVERNANCE_POLICY } from "./governancePolicies.ts";

function response(
  action: GovernanceResponseAction,
  finding: GovernanceFinding
): GovernanceResponse {
  return Object.freeze({
    action,
    reason: finding.message,
    findingCode: finding.code,
  });
}

export function deriveGovernanceResponses(
  findings: readonly GovernanceFinding[],
  replayIntegrity: ReplayIntegrityReport
): readonly GovernanceResponse[] {
  const responses: GovernanceResponse[] = [];

  if (!replayIntegrity.verified) {
    for (const failure of replayIntegrity.failures) {
      responses.push(
        Object.freeze({
          action: "halt_replay",
          reason: failure.message,
          findingCode: "replay_inconsistency",
        })
      );
    }
  }

  for (const finding of findings) {
    switch (finding.code) {
      case "branch_explosion_risk":
        responses.push(
          response(
            finding.severity === "critical" ? "reject_branch" : "protect",
            finding
          )
        );
        break;
      case "timeline_corruption":
      case "branch_lineage_cycle":
      case "snapshot_fingerprint_drift":
        responses.push(response("isolate_timeline", finding));
        break;
      case "orchestration_overload":
        responses.push(response("block_orchestration", finding));
        break;
      case "replay_inconsistency":
        responses.push(response("halt_replay", finding));
        break;
      case "propagation_instability":
      case "sync_pressure":
      case "universe_complexity_high":
        responses.push(response("advise", finding));
        break;
      case "causality_order_violation":
        responses.push(
          response(finding.severity === "critical" ? "isolate_timeline" : "advise", finding)
        );
        break;
      default:
        responses.push(response("advise", finding));
    }
  }

  if (responses.length === 0) {
    responses.push(
      Object.freeze({
        action: "allow",
        reason: "Simulation universe within enterprise-safe governance thresholds.",
        findingCode: "governance_nominal",
      })
    );
  }

  return Object.freeze(responses);
}

export function deriveGovernanceStatus(
  integrityScore: number,
  findings: readonly GovernanceFinding[],
  replayIntegrity: ReplayIntegrityReport
): SimulationGovernanceStatus {
  if (!replayIntegrity.verified && replayIntegrity.failures.length > 0) {
    return "halted";
  }
  if (findings.some((f) => f.severity === "critical")) {
    return integrityScore < GOVERNANCE_POLICY.minIntegrityScoreDegraded ? "halted" : "protected";
  }
  if (integrityScore < GOVERNANCE_POLICY.minIntegrityScoreDegraded) return "halted";
  if (integrityScore < GOVERNANCE_POLICY.minIntegrityScoreMonitoring) return "degraded";
  if (integrityScore < GOVERNANCE_POLICY.minIntegrityScoreStable) return "monitoring";
  if (findings.some((f) => f.severity === "warning")) return "monitoring";
  return "stable";
}

export function isUniverseOperationAllowed(
  status: SimulationGovernanceStatus,
  responses: readonly GovernanceResponse[]
): boolean {
  if (status === "halted") return false;
  if (responses.some((r) => r.action === "halt_replay" || r.action === "isolate_timeline")) {
    return status !== "protected";
  }
  if (responses.some((r) => r.action === "block_orchestration" || r.action === "reject_branch")) {
    return false;
  }
  return true;
}
