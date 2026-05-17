/**
 * D7:1:10 — Anti-chaos governance engine (deterministic, non-mutating).
 */

import type {
  EnterpriseSimulationGovernanceContract,
  GovernSimulationUniverseInput,
  SimulationGovernanceReport,
  SimulationGovernanceState,
  SimulationGovernanceVerdict,
} from "./simulationGovernanceTypes.ts";
import { collectSimulationStabilityMetrics, deriveIntegrityScore } from "./stabilityMonitoring.ts";
import {
  validateDeterministicConsistency,
  validateSimulationIntegrity,
} from "./simulationIntegrityValidation.ts";
import { verifyReplayIntegrity } from "./replayIntegrityVerification.ts";
import {
  deriveGovernanceResponses,
  deriveGovernanceStatus,
  isUniverseOperationAllowed,
} from "./governanceResponses.ts";
import { buildExecutiveGovernanceNarrative } from "./executiveGovernanceNarratives.ts";
import { logGovernanceDev } from "./governanceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

export function buildGovernanceFingerprint(input: GovernSimulationUniverseInput): string {
  return stableStringify({
    timelines: input.activeTimelines.map((t) => t.timelineId).sort(),
    branches: (input.branchForests ?? []).map((f) => f.fingerprint),
    replays: (input.replaySnapshots ?? []).map((r) => r.fingerprint),
    warRooms: (input.warRoomSnapshots ?? []).map((w) => w.fingerprint),
    propagationDepths: input.propagationDepthSamples ?? [],
    comparisonCount: input.comparisonCount ?? 0,
  });
}

export function buildEnterpriseGovernanceContract(input: {
  governanceId: string;
  report: SimulationGovernanceReport;
}): EnterpriseSimulationGovernanceContract {
  const activeResponses = [
    ...new Set(input.report.responses.map((r) => r.action)),
  ] as EnterpriseSimulationGovernanceContract["activeResponses"];

  const viewHint =
    input.report.state.governanceStatus === "halted"
      ? "halt_review"
      : input.report.state.governanceStatus === "protected"
        ? "protected_mode"
        : !input.report.replayIntegrity.verified
          ? "integrity_audit"
          : "stability_dashboard";

  return Object.freeze({
    governanceId: input.governanceId,
    status: input.report.state.governanceStatus,
    integrityScore: input.report.state.integrityScore,
    stabilityMetrics: input.report.metrics,
    activeResponses: Object.freeze(activeResponses),
    auditSummary: input.report.narrative.summary,
    replayIntegrityVerified: input.report.replayIntegrity.verified,
    viewHint,
  });
}

/**
 * Assess simulation universe health and return explicit governance verdict.
 * Never mutates timelines, forests, replays, or war-room state.
 */
export function governSimulationUniverse(
  input: GovernSimulationUniverseInput
): SimulationGovernanceVerdict {
  const governanceId = String(input.governanceId ?? "gov-universe").trim() || "gov-universe";

  logGovernanceDev("Governance", {
    governanceId,
    timelines: input.activeTimelines.length,
    forests: input.branchForests?.length ?? 0,
  });

  const metrics = collectSimulationStabilityMetrics(input);
  const integrityFindings = validateSimulationIntegrity(input);
  const consistencyFindings = validateDeterministicConsistency(input.activeTimelines);
  const replayIntegrity = verifyReplayIntegrity(input.replaySnapshots);

  const replayFindings = replayIntegrity.failures.map((f) =>
    Object.freeze({
      code: "replay_inconsistency" as const,
      severity: "critical" as const,
      message: f.message,
      affectedReplayId: f.replayId,
    })
  );

  const findings = Object.freeze(
    [...integrityFindings, ...consistencyFindings, ...replayFindings].sort((a, b) =>
      a.code.localeCompare(b.code)
    )
  );

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;
  const integrityScore = deriveIntegrityScore(metrics, criticalCount, warningCount);

  const responses = deriveGovernanceResponses(findings, replayIntegrity);
  const governanceStatus = deriveGovernanceStatus(integrityScore, findings, replayIntegrity);

  const warnings = findings
    .filter((f) => f.severity !== "info")
    .map((f) => f.message)
    .slice(0, 8);

  const reasoning = responses.map((r) => `${r.action}: ${r.reason}`);

  const state: SimulationGovernanceState = Object.freeze({
    governanceStatus,
    activeWarnings: Object.freeze(warnings),
    integrityScore,
    reasoning: Object.freeze(reasoning),
  });

  const narrative = buildExecutiveGovernanceNarrative({
    status: governanceStatus,
    metrics,
    findings,
    responses,
    replayIntegrity,
  });

  const fingerprint = stableStringify({
    content: buildGovernanceFingerprint(input),
    governanceId,
    status: governanceStatus,
    integrityScore,
    findingCount: findings.length,
  });

  const reportCore = {
    state,
    metrics,
    findings,
    responses,
    narrative: Object.freeze({
      ...narrative,
      bullets: Object.freeze([...narrative.bullets]),
    }),
    replayIntegrity,
    fingerprint,
  };

  const enterpriseContract = buildEnterpriseGovernanceContract({
    governanceId,
    report: reportCore as SimulationGovernanceReport,
  });

  const finalReport: SimulationGovernanceReport = Object.freeze({
    ...reportCore,
    enterpriseContract,
  });

  const allowed = isUniverseOperationAllowed(governanceStatus, responses);

  logGovernanceDev("AntiChaos", {
    governanceId,
    status: governanceStatus,
    allowed,
    integrityScore,
    findings: findings.length,
  });

  return Object.freeze({
    allowed,
    report: finalReport,
  });
}

export function freezeSimulationGovernanceReport(
  report: SimulationGovernanceReport
): SimulationGovernanceReport {
  return Object.freeze({
    ...report,
    state: Object.freeze({ ...report.state, activeWarnings: Object.freeze([...report.state.activeWarnings]) }),
    findings: Object.freeze(report.findings.map((f) => Object.freeze({ ...f }))),
    responses: Object.freeze(report.responses.map((r) => Object.freeze({ ...r }))),
    narrative: Object.freeze({ ...report.narrative, bullets: Object.freeze([...report.narrative.bullets]) }),
    replayIntegrity: Object.freeze({
      ...report.replayIntegrity,
      failures: Object.freeze(report.replayIntegrity.failures.map((f) => Object.freeze({ ...f }))),
    }),
  });
}
