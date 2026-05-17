/**
 * D7:3:3 — Execution resistance and decision friction signal modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  DecisionFrictionSignal,
  DecisionFrictionStateLabel,
  OrganizationalDecisionFrictionState,
} from "./decisionFrictionTypes.ts";
import { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function frictionStateFromScore(score: number): DecisionFrictionStateLabel {
  if (score < 0.35) return "low";
  if (score < 0.55) return "moderate";
  if (score < 0.75) return "high";
  return "critical";
}

export function deriveDecisionFrictionSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  approvalChainDelayFactor?: number;
  implementationDragFactor?: number;
}): DecisionFrictionSignal[] {
  const signals: DecisionFrictionSignal[] = [];
  const delay = clamp01(input.approvalChainDelayFactor ?? 0);
  const drag = clamp01(input.implementationDragFactor ?? 0);
  const coordinationFriction = input.coordinationState.coordinationFrictionScore;

  for (const region of input.topology.operationalRegions) {
    const regionPressure = input.pressureState?.regionAccumulations.find(
      (r) => r.regionId === region.regionId
    );
    const inFrictionZone = input.coordinationState.frictionZones.includes(region.regionId);
    const inAlignmentZone = input.coordinationState.alignmentZones.includes(region.regionId);

    const pressureFactor = clamp01(regionPressure?.accumulatedPressure ?? 0.4);
    const resistanceBase = clamp01(
      pressureFactor * 0.35 +
        coordinationFriction * 0.3 +
        input.actorState.coordinationPressure * 0.2 +
        delay * 0.1 +
        drag * 0.05
    );

    const drivers: string[] = [];
    if (pressureFactor >= 0.6) drivers.push("dependency_pressure");
    if (inFrictionZone) drivers.push("coordination_slowdown");
    if (delay >= 0.35) drivers.push("approval_chain_delay");
    if (drag >= 0.3) drivers.push("implementation_drag");
    if (input.coordinationState.coordinationDynamicsLabel === "fragmented") {
      drivers.push("strategic_misalignment");
    }
    if (inAlignmentZone && resistanceBase < 0.45) {
      drivers.push("aligned_execution_path");
    }

    const adjustedResistance =
      inAlignmentZone && !inFrictionZone
        ? clamp01(resistanceBase * 0.75)
        : inFrictionZone
          ? clamp01(resistanceBase + 0.12)
          : resistanceBase;

    const frictionState = frictionStateFromScore(adjustedResistance);
    if (frictionState === "low" && drivers.length <= 1) continue;

    signals.push(
      Object.freeze({
        signalId: `decision-friction::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        frictionState,
        intensity: adjustedResistance,
        dominantFrictionDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Decision execution friction is ${frictionState} in ${region.label}`,
      })
    );
  }

  if (
    input.coordinationState.coordinationDynamicsLabel !== "synchronized" &&
    input.actorState.coordinationQualityLabel === "aligned"
  ) {
    const misalignmentFriction = clamp01(
      coordinationFriction * 0.5 + delay * 0.25 + drag * 0.25
    );
    signals.push(
      Object.freeze({
        signalId: "decision-friction::alignment-execution-gap",
        affectedRegionIds: Object.freeze(
          [...input.coordinationState.frictionZones].sort().slice(0, 4)
        ),
        frictionState: frictionStateFromScore(misalignmentFriction),
        intensity: misalignmentFriction,
        dominantFrictionDrivers: Object.freeze([
          "executive_alignment",
          "execution_slowdown",
          "cross_domain_delay",
        ]),
        executiveLabel:
          "Executive alignment exists but operational execution is slowing across affected regions",
      })
    );
  }

  logDecisionFrictionDev("DecisionFriction", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateStrategicResistanceScore(input: {
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  signals: readonly DecisionFrictionSignal[];
}): number {
  const highFrictionRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter((s) => s.frictionState === "high" || s.frictionState === "critical")
          .length / input.signals.length;

  const score = clamp01(
    input.actorState.coordinationPressure * 0.3 +
      input.coordinationState.coordinationFrictionScore * 0.35 +
      highFrictionRatio * 0.25 +
      (1 - input.actorState.organizationalAlignmentScore) * 0.1
  );

  logDecisionFrictionDev("DecisionFriction", { strategicResistanceScore: score });
  return score;
}

export function calculateExecutionLatencyScore(input: {
  signals: readonly DecisionFrictionSignal[];
  coordinationState: ExecutiveCoordinationState;
  approvalChainDelayFactor?: number;
  momentumState?: EnterpriseMomentumState;
}): number {
  const criticalRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter((s) => s.frictionState === "critical" || s.frictionState === "high")
          .length / input.signals.length;

  const momentumDrag =
    input.momentumState?.momentumTrendLabel === "accelerating_failure" ? 0.15 : 0;
  const syncPenalty =
    input.coordinationState.organizationalSynchronizationScore < 0.5 ? 0.12 : 0;

  const score = clamp01(
    criticalRatio * 0.4 +
      (input.approvalChainDelayFactor ?? 0) * 0.3 +
      input.coordinationState.coordinationFrictionScore * 0.2 +
      momentumDrag +
      syncPenalty
  );

  logDecisionFrictionDev("ExecutionLatency", { executionLatencyScore: score });
  return score;
}

export function calculateOrganizationalDragLevel(input: {
  executionLatencyScore: number;
  strategicResistanceScore: number;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
  pressureState?: EnterprisePressureState;
}): number {
  const recoveryDrag = clamp01(1 - (input.recoveryState?.stabilizationPotential ?? 0.5));
  const equilibriumDrag =
    input.equilibriumState?.equilibriumScore !== undefined
      ? clamp01(1 - input.equilibriumState.equilibriumScore)
      : 0.25;
  const pressureSaturation =
    input.pressureState?.saturationRegions.length !== undefined
      ? clamp01((input.pressureState.saturationRegions.length ?? 0) * 0.12)
      : 0;

  const drag = clamp01(
    input.executionLatencyScore * 0.35 +
      input.strategicResistanceScore * 0.3 +
      recoveryDrag * 0.15 +
      equilibriumDrag * 0.1 +
      pressureSaturation * 0.1
  );

  logDecisionFrictionDev("OrganizationalDrag", { organizationalDragLevel: drag });
  return drag;
}

export function identifyFrictionHotspots(
  signals: readonly DecisionFrictionSignal[]
): readonly string[] {
  const hotspots = new Set<string>();
  for (const signal of signals) {
    if (signal.frictionState === "high" || signal.frictionState === "critical") {
      for (const r of signal.affectedRegionIds) hotspots.add(r);
    }
  }
  const sorted = [...hotspots].sort();
  if (sorted.length > 0) {
    logDecisionFrictionDev("FrictionHotspot", { regions: sorted });
  }
  return Object.freeze(sorted);
}

export function identifyResistanceZones(
  signals: readonly DecisionFrictionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.frictionState === "moderate" || signal.frictionState === "high") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyDecisionFrictionLabel(input: {
  executionLatencyScore: number;
  organizationalDragLevel: number;
  strategicResistanceScore: number;
}): OrganizationalDecisionFrictionState["decisionFrictionLabel"] {
  if (
    input.executionLatencyScore < 0.35 &&
    input.organizationalDragLevel < 0.4 &&
    input.strategicResistanceScore < 0.45
  ) {
    return "fluid";
  }
  if (
    input.executionLatencyScore >= 0.7 ||
    input.organizationalDragLevel >= 0.7 ||
    input.strategicResistanceScore >= 0.75
  ) {
    return "critical";
  }
  if (
    input.executionLatencyScore >= 0.5 ||
    input.organizationalDragLevel >= 0.5
  ) {
    return "elevated";
  }
  return "moderate";
}
