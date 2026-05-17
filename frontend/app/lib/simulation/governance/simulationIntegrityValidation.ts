/**
 * D7:1:10 — Simulation integrity + deterministic consistency validation.
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import { validateOperationalTimeline } from "../timeline/timelineGuards.ts";
import type { GovernanceFinding, SimulationUniverseInput } from "./simulationGovernanceTypes.ts";
import { GOVERNANCE_POLICY } from "./governancePolicies.ts";
import { logGovernanceDev } from "./governanceDevLog.ts";

function finding(
  partial: Omit<GovernanceFinding, "severity"> & { severity?: GovernanceFinding["severity"] }
): GovernanceFinding {
  return Object.freeze({
    severity: partial.severity ?? "warning",
    ...partial,
  });
}

function validateCausalityOrdering(timeline: OperationalTimeline): GovernanceFinding | null {
  const links = [...timeline.causality].sort((a, b) => a.linkId.localeCompare(b.linkId));
  for (const link of links) {
    if (link.generatedTick > timeline.currentTick) {
      return finding({
        code: "causality_order_violation",
        severity: "critical",
        message: `Causal link ${link.linkId} references future tick ${link.generatedTick}`,
        affectedTimelineId: timeline.timelineId,
      });
    }
  }
  return null;
}

function detectBranchLineageCycle(forest: ScenarioBranchForestState): GovernanceFinding | null {
  for (const timelineId of Object.keys(forest.timelinesById)) {
    const seen = new Set<string>();
    let current = forest.timelinesById[timelineId];
    while (current?.parentTimelineId) {
      if (seen.has(current.parentTimelineId)) {
        return finding({
          code: "branch_lineage_cycle",
          severity: "critical",
          message: `Branch lineage cycle detected near timeline ${timelineId}`,
          affectedTimelineId: timelineId,
        });
      }
      seen.add(current.parentTimelineId);
      current = forest.timelinesById[current.parentTimelineId];
    }
  }
  return null;
}

function validateSnapshotFingerprints(timeline: OperationalTimeline): GovernanceFinding | null {
  for (const snap of timeline.snapshots) {
    if (!snap.fingerprint || String(snap.fingerprint).length < 8) {
      return finding({
        code: "snapshot_fingerprint_drift",
        severity: "critical",
        message: `Snapshot at tick ${snap.timestamp.tick} missing stable fingerprint`,
        affectedTimelineId: timeline.timelineId,
      });
    }
  }
  return null;
}

export function validateSimulationIntegrity(
  input: SimulationUniverseInput
): readonly GovernanceFinding[] {
  const findings: GovernanceFinding[] = [];

  if (input.activeTimelines.length > GOVERNANCE_POLICY.maxUniverseTimelines) {
    findings.push(
      finding({
        code: "universe_complexity_high",
        severity: "warning",
        message: `Active timeline count ${input.activeTimelines.length} exceeds recommended universe size ${GOVERNANCE_POLICY.maxUniverseTimelines}`,
      })
    );
  }

  for (const timeline of input.activeTimelines) {
    const validation = validateOperationalTimeline(timeline);
    if (!validation.ok) {
      findings.push(
        finding({
          code: "timeline_corruption",
          severity: "critical",
          message: validation.message,
          affectedTimelineId: timeline.timelineId,
        })
      );
    }

    const causality = validateCausalityOrdering(timeline);
    if (causality) findings.push(causality);

    const fingerprint = validateSnapshotFingerprints(timeline);
    if (fingerprint) findings.push(fingerprint);
  }

  for (const forest of input.branchForests ?? []) {
    if (forest.branches.length > GOVERNANCE_POLICY.maxActiveBranches) {
      findings.push(
        finding({
          code: "branch_explosion_risk",
          severity: "critical",
          message: `Branch count ${forest.branches.length} exceeds safe threshold ${GOVERNANCE_POLICY.maxActiveBranches}`,
        })
      );
    } else if (
      forest.branches.length >=
      GOVERNANCE_POLICY.maxActiveBranches * GOVERNANCE_POLICY.branchExplosionWarningRatio
    ) {
      findings.push(
        finding({
          code: "branch_explosion_risk",
          severity: "warning",
          message: `Branch count ${forest.branches.length} is approaching safe limits`,
        })
      );
    }

    const cycle = detectBranchLineageCycle(forest);
    if (cycle) findings.push(cycle);

    for (const branch of forest.branches) {
      if (branch.branchDepth > GOVERNANCE_POLICY.maxBranchDepth) {
        findings.push(
          finding({
            code: "branch_explosion_risk",
            severity: "critical",
            message: `Branch ${branch.branchId} depth ${branch.branchDepth} exceeds max ${GOVERNANCE_POLICY.maxBranchDepth}`,
          })
        );
      }
    }
  }

  const depthAvg =
    (input.propagationDepthSamples ?? []).reduce((a, b) => a + b, 0) /
    Math.max(1, (input.propagationDepthSamples ?? []).length);
  if (depthAvg > GOVERNANCE_POLICY.maxPropagationDepthAverage) {
    findings.push(
      finding({
        code: "propagation_instability",
        severity: "warning",
        message: `Average propagation depth ${depthAvg.toFixed(2)} exceeds stable range`,
      })
    );
  }

  for (const warRoom of input.warRoomSnapshots ?? []) {
    if (warRoom.scenarioSlots.length > GOVERNANCE_POLICY.maxWarRoomScenarios) {
      findings.push(
        finding({
          code: "orchestration_overload",
          severity: "critical",
          message: `War-room session ${warRoom.session.sessionId} exceeds scenario capacity`,
        })
      );
    }
    if ((warRoom.state.lastSyncTick ?? 0) > Math.max(...warRoom.scenarioSlots.map(() => 0))) {
      const maxTick = Math.max(
        ...Object.values(warRoom.workingTimelinesByScenarioId).map((t) => t.currentTick)
      );
      if ((warRoom.state.lastSyncTick ?? 0) > maxTick) {
        findings.push(
          finding({
            code: "sync_pressure",
            severity: "warning",
            message: `War-room sync tick ${warRoom.state.lastSyncTick} exceeds scenario horizon ${maxTick}`,
          })
        );
      }
    }
  }

  logGovernanceDev("SimulationIntegrity", {
    timelineCount: input.activeTimelines.length,
    findingCount: findings.length,
  });

  return Object.freeze(findings.sort((a, b) => a.code.localeCompare(b.code)));
}

export function validateDeterministicConsistency(
  timelines: readonly OperationalTimeline[]
): readonly GovernanceFinding[] {
  const findings: GovernanceFinding[] = [];
  const fingerprintByTick = new Map<string, Set<string>>();

  for (const timeline of timelines) {
    for (const snap of timeline.snapshots) {
      const key = `${timeline.timelineId}::${snap.timestamp.tick}`;
      const set = fingerprintByTick.get(key) ?? new Set();
      set.add(snap.fingerprint);
      fingerprintByTick.set(key, set);
      if (set.size > 1) {
        findings.push(
          finding({
            code: "snapshot_fingerprint_drift",
            severity: "critical",
            message: `Duplicate tick ${snap.timestamp.tick} has inconsistent fingerprints on ${timeline.timelineId}`,
            affectedTimelineId: timeline.timelineId,
          })
        );
      }
    }

    const linkIds = timeline.causality.map((l) => l.linkId);
    const sortedIds = [...linkIds].sort((a, b) => a.localeCompare(b));
    if (linkIds.length > 1 && linkIds.join("|") !== sortedIds.join("|")) {
      const canonical = [...timeline.causality].sort((a, b) => a.linkId.localeCompare(b.linkId));
      if (canonical.map((l) => l.linkId).join("|") !== sortedIds.join("|")) {
        findings.push(
          finding({
            code: "causality_order_violation",
            severity: "warning",
            message: `Causality link registry ordering is non-canonical on ${timeline.timelineId}`,
            affectedTimelineId: timeline.timelineId,
          })
        );
      }
    }
  }

  return Object.freeze(findings);
}
