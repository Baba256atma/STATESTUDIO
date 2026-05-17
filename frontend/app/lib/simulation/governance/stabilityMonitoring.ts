/**
 * D7:1:10 — Stability metrics collection (deterministic, explainable).
 */

import type { ScenarioBranchForestState } from "../branching/branchingTypes.ts";
import type { ReplayOrchestrationSnapshot } from "../replay/replayTypes.ts";
import type { OperationalTimeline } from "../timeline/timelineTypes.ts";
import type { WarRoomOrchestrationSnapshot } from "../warroom/warRoomTypes.ts";
import type { SimulationStabilityMetrics, SimulationUniverseInput } from "./simulationGovernanceTypes.ts";
import { GOVERNANCE_POLICY } from "./governancePolicies.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);
  return Number((sum / values.length).toFixed(4));
}

export function collectSimulationStabilityMetrics(
  input: SimulationUniverseInput
): SimulationStabilityMetrics {
  const branchForests = input.branchForests ?? [];
  const activeBranchCount = branchForests.reduce((sum, f) => sum + f.branches.length, 0);
  const replaySnapshots = input.replaySnapshots ?? [];
  const warRoomSnapshots = input.warRoomSnapshots ?? [];

  const propagationDepthAverage = average(input.propagationDepthSamples ?? []);
  const comparisonLoad = Math.floor(Number(input.comparisonCount ?? 0));

  const orchestrationPressure = clamp01(
    warRoomSnapshots.length * GOVERNANCE_POLICY.orchestrationPressurePerScenario +
      warRoomSnapshots.reduce((sum, s) => sum + s.scenarioSlots.length, 0) *
        GOVERNANCE_POLICY.orchestrationPressurePerScenario +
      comparisonLoad * GOVERNANCE_POLICY.comparisonPressureWeight
  );

  const replayIntegrityScore =
    replaySnapshots.length === 0
      ? 1
      : clamp01(
          replaySnapshots.filter((r) => r.reconstruction.orderedSnapshots.length > 0).length /
            replaySnapshots.length
        );

  return Object.freeze({
    activeTimelineCount: input.activeTimelines.length,
    activeBranchCount,
    activeReplaySessionCount: replaySnapshots.length,
    activeWarRoomSessionCount: warRoomSnapshots.length,
    propagationDepthAverage,
    replayIntegrityScore,
    orchestrationPressure,
    comparisonLoad,
  });
}

export function deriveIntegrityScore(
  metrics: SimulationStabilityMetrics,
  findingsCritical: number,
  findingsWarning: number
): number {
  let score = 1;
  score -= findingsCritical * 0.18;
  score -= findingsWarning * 0.07;
  score -= Math.max(0, metrics.activeBranchCount / GOVERNANCE_POLICY.maxActiveBranches - 0.7) * 0.15;
  score -= Math.max(0, metrics.activeTimelineCount / GOVERNANCE_POLICY.maxUniverseTimelines - 0.7) * 0.12;
  score -= Math.max(0, metrics.propagationDepthAverage - GOVERNANCE_POLICY.maxPropagationDepthAverage) * 0.1;
  score -= metrics.orchestrationPressure * 0.12;
  score -= (1 - metrics.replayIntegrityScore) * 0.25;
  return clamp01(score);
}

export function countBranchesInForests(
  forests: readonly ScenarioBranchForestState[]
): number {
  return forests.reduce((sum, f) => sum + f.branches.length, 0);
}
