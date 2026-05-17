/**
 * D7:3:5 — Trust degradation and recovery modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  OrganizationalTrustSignal,
  OrganizationalTrustStateLabel,
  OrganizationalTrustState,
} from "./trustStabilityTypes.ts";
import { logTrustDev } from "./trustDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function trustStateFromScores(
  stability: number,
  degradation: number
): OrganizationalTrustStateLabel {
  if (stability >= 0.62 && degradation < 0.35) return "stable";
  if (degradation >= 0.72) return "critical";
  if (degradation >= 0.58) return "degrading";
  if (stability >= 0.52 && degradation < 0.5) return "recovering";
  return "strained";
}

export function deriveOrganizationalTrustSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationFailureFactor?: number;
  trustErosionFactor?: number;
}): OrganizationalTrustSignal[] {
  const signals: OrganizationalTrustSignal[] = [];
  const failureFactor = clamp01(input.coordinationFailureFactor ?? 0);
  const erosionFactor = clamp01(input.trustErosionFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const inFragility = input.decisionFrictionState.frictionHotspots.includes(region.regionId);
    const inResistance = input.influenceState.resistanceZones.includes(region.regionId);
    const inAlignment =
      input.coordinationState.alignmentZones.includes(region.regionId) ||
      input.influenceState.alignmentZones.includes(region.regionId);
    const coordinationBottleneck = input.coordinationState.coordinationBottlenecks.some(
      (b) => b.regionId === region.regionId
    );

    const stabilityBase = clamp01(
      input.coordinationState.organizationalSynchronizationScore * 0.3 +
        input.influenceState.organizationalAlignmentLevel * 0.25 +
        input.actorState.organizationalAlignmentScore * 0.2 +
        (inAlignment ? 0.15 : 0) -
        failureFactor * 0.1
    );
    const degradationBase = clamp01(
      input.coordinationState.coordinationFrictionScore * 0.25 +
        input.decisionFrictionState.organizationalDragLevel * 0.25 +
        input.influenceState.resistanceConcentrationScore * 0.2 +
        (inFragility ? 0.15 : 0) +
        (inResistance ? 0.1 : 0) +
        erosionFactor * 0.1
    );

    const drivers: string[] = [];
    if (coordinationBottleneck) drivers.push("coordination_instability");
    if (inFragility) drivers.push("operational_trust_fragility");
    if (inResistance) drivers.push("stakeholder_resistance");
    if (inAlignment) drivers.push("cross_domain_alignment");
    if ((input.recoveryState?.stabilizationPotential ?? 0) >= 0.5) {
      drivers.push("recovery_leadership");
    }
    if (input.coordinationState.coordinationDynamicsLabel === "synchronized") {
      drivers.push("executive_coordination_confidence");
    }

    const trustState = trustStateFromScores(stabilityBase, degradationBase);
    if (trustState === "stable" && drivers.length <= 1) {
      signals.push(
        Object.freeze({
          signalId: `trust::${region.regionId}`,
          affectedRegionIds: Object.freeze([region.regionId]),
          trustState,
          intensity: clamp01(stabilityBase),
          dominantTrustDrivers: Object.freeze(
            drivers.length > 0 ? [...drivers].sort() : ["operational_confidence"]
          ),
          executiveLabel: `Organizational trust is stable in ${region.label}`,
        })
      );
      continue;
    }

    signals.push(
      Object.freeze({
        signalId: `trust::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        trustState,
        intensity: clamp01(Math.abs(stabilityBase - degradationBase) + 0.2),
        dominantTrustDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Organizational trust is ${trustState} in ${region.label}`,
      })
    );
  }

  if (
    input.coordinationState.coordinationDynamicsLabel === "recovering" ||
    input.influenceState.influenceStabilityLabel === "stable"
  ) {
    const recoveryStability = clamp01(
      (input.recoveryState?.stabilizationPotential ?? 0.5) * 0.5 +
        input.influenceState.influencePropagationScore * 0.3 -
        input.decisionFrictionState.executionLatencyScore * 0.2
    );
    signals.push(
      Object.freeze({
        signalId: "trust::executive-recovery-coordination",
        affectedRegionIds: Object.freeze(
          [...input.influenceState.alignmentZones].sort().slice(0, 4)
        ),
        trustState: trustStateFromScores(recoveryStability, 1 - recoveryStability),
        intensity: recoveryStability,
        dominantTrustDrivers: Object.freeze([
          "recovery_leadership",
          "executive_coordination_confidence",
        ]),
        executiveLabel:
          "Trust stability remains strong across executive recovery coordination",
      })
    );
  }

  if (
    regionHasLogisticsDegradation(input) &&
    input.decisionFrictionState.frictionHotspots.includes("logistics")
  ) {
    signals.push(
      Object.freeze({
        signalId: "trust::logistics-dependency-degradation",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        trustState: "degrading",
        intensity: clamp01(
          input.decisionFrictionState.organizationalDragLevel * 0.6 +
            input.coordinationState.coordinationFrictionScore * 0.3
        ),
        dominantTrustDrivers: Object.freeze([
          "operational_trust_fragility",
          "dependency_pressure",
          "coordination_instability",
        ]),
        executiveLabel:
          "Operational trust degradation is increasing within logistics dependency systems",
      })
    );
  }

  logTrustDev("Trust", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

function regionHasLogisticsDegradation(input: {
  decisionFrictionState: OrganizationalDecisionFrictionState;
  coordinationState: ExecutiveCoordinationState;
}): boolean {
  return (
    input.decisionFrictionState.decisionFrictionLabel !== "fluid" ||
    input.coordinationState.coordinationFrictionScore > 0.45
  );
}

export function calculateOrganizationalTrustScore(input: {
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  signals: readonly OrganizationalTrustSignal[];
}): number {
  const stableRatio =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter(
          (s) => s.trustState === "stable" || s.trustState === "recovering"
        ).length / input.signals.length;

  const score = clamp01(
    input.coordinationState.organizationalSynchronizationScore * 0.3 +
      input.influenceState.organizationalAlignmentLevel * 0.25 +
      input.actorState.organizationalAlignmentScore * 0.2 +
      stableRatio * 0.25
  );

  logTrustDev("TrustStability", { organizationalTrustScore: score });
  return score;
}

export function calculateTrustDegradationScore(input: {
  signals: readonly OrganizationalTrustSignal[];
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  coordinationFailureFactor?: number;
}): number {
  const degradingRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter(
          (s) => s.trustState === "degrading" || s.trustState === "critical"
        ).length / input.signals.length;

  const score = clamp01(
    degradingRatio * 0.35 +
      input.coordinationState.coordinationFrictionScore * 0.25 +
      input.decisionFrictionState.organizationalDragLevel * 0.25 +
      (input.coordinationFailureFactor ?? 0) * 0.15
  );

  logTrustDev("TrustFragility", { trustDegradationScore: score });
  return score;
}

export function calculateTrustRecoveryMomentum(input: {
  recoveryState?: OrganizationalRecoveryState;
  influenceState: StakeholderInfluenceState;
  coordinationState: ExecutiveCoordinationState;
  signals: readonly OrganizationalTrustSignal[];
}): number {
  const recoveringRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter((s) => s.trustState === "recovering").length / input.signals.length;

  const score = clamp01(
    (input.recoveryState?.stabilizationPotential ?? 0.5) * 0.35 +
      input.influenceState.influencePropagationScore * 0.3 +
      input.coordinationState.executiveAlignmentScore * 0.2 +
      recoveringRatio * 0.15
  );

  logTrustDev("TrustRecovery", { trustRecoveryMomentum: score });
  return score;
}

export function identifyTrustFragilityZones(
  signals: readonly OrganizationalTrustSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.trustState === "degrading" || signal.trustState === "critical") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyTrustRecoveryZones(
  signals: readonly OrganizationalTrustSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.trustState === "stable" || signal.trustState === "recovering") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyTrustStabilityLabel(input: {
  organizationalTrustScore: number;
  trustDegradationScore: number;
  trustRecoveryMomentum: number;
}): OrganizationalTrustState["trustStabilityLabel"] {
  if (
    input.organizationalTrustScore >= 0.58 &&
    input.trustDegradationScore < 0.45
  ) {
    return "stable";
  }
  if (input.trustDegradationScore >= 0.72) {
    return "critical";
  }
  if (
    input.trustDegradationScore >= 0.55 &&
    input.trustRecoveryMomentum < 0.5
  ) {
    return "degrading";
  }
  if (
    input.trustRecoveryMomentum >= 0.5 &&
    input.organizationalTrustScore >= 0.48
  ) {
    return "recovering";
  }
  return "strained";
}
