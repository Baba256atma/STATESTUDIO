/**
 * D7:3:7 — Strategic coherence and alignment signal modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  OrganizationalAlignmentDriftState,
  OrganizationalAlignmentSignal,
  OrganizationalAlignmentSignalState,
} from "./alignmentDriftTypes.ts";
import { logAlignmentDev } from "./alignmentDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function alignmentStateFromScores(
  coherence: number,
  drift: number
): OrganizationalAlignmentSignalState {
  if (coherence >= 0.62 && drift < 0.35) return "aligned";
  if (drift >= 0.65) return "fragmented";
  if (coherence >= 0.52 && drift < 0.55) return "recovering";
  return "drifting";
}

export function deriveOrganizationalAlignmentSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  priorityFragmentationFactor?: number;
  coordinationDivergenceFactor?: number;
}): OrganizationalAlignmentSignal[] {
  const signals: OrganizationalAlignmentSignal[] = [];
  const fragmentationFactor = clamp01(input.priorityFragmentationFactor ?? 0);
  const divergenceFactor = clamp01(input.coordinationDivergenceFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const inCoordinationFriction = input.coordinationState.frictionZones.includes(region.regionId);
    const inInfluenceResistance = input.influenceState.resistanceZones.includes(region.regionId);
    const inTrustFragility = input.trustState.trustFragilityZones.includes(region.regionId);
    const inLeadershipSaturation = input.leadershipState.leadershipSaturationZones.includes(
      region.regionId
    );

    const coherenceBase = clamp01(
      input.coordinationState.organizationalSynchronizationScore * 0.25 +
        input.influenceState.organizationalAlignmentLevel * 0.2 +
        input.trustState.organizationalTrustScore * 0.2 +
        input.actorState.organizationalAlignmentScore * 0.15 +
        (input.leadershipState.coordinationCapacityLevel >= 0.5 ? 0.1 : 0)
    );
    const driftBase = clamp01(
      input.coordinationState.coordinationFrictionScore * 0.2 +
        input.decisionFrictionState.organizationalDragLevel * 0.2 +
        input.leadershipState.leadershipBurdenScore * 0.15 +
        (inCoordinationFriction ? 0.15 : 0) +
        (inInfluenceResistance ? 0.1 : 0) +
        fragmentationFactor * 0.1 +
        divergenceFactor * 0.1
    );

    const drivers: string[] = [];
    if (inCoordinationFriction) drivers.push("coordination_divergence");
    if (inInfluenceResistance) drivers.push("stakeholder_misalignment");
    if (inTrustFragility) drivers.push("trust_instability");
    if (inLeadershipSaturation) drivers.push("leadership_communication_strain");
    if (input.decisionFrictionState.decisionFrictionLabel !== "fluid") {
      drivers.push("decision_friction_drag");
    }
    if (input.coordinationState.coordinationDynamicsLabel === "synchronized") {
      drivers.push("executive_synchronization");
    }

    const alignmentState = alignmentStateFromScores(coherenceBase, driftBase);

    signals.push(
      Object.freeze({
        signalId: `alignment::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        alignmentState,
        intensity: clamp01(Math.abs(coherenceBase - driftBase) + 0.2),
        dominantAlignmentDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Strategic alignment is ${alignmentState} in ${region.label}`,
      })
    );
  }

  if (
    input.coordinationState.coordinationDynamicsLabel === "recovering" ||
    input.trustState.trustStabilityLabel === "recovering"
  ) {
    signals.push(
      Object.freeze({
        signalId: "alignment::executive-recovery-coherence",
        affectedRegionIds: Object.freeze(
          [...input.trustState.trustRecoveryZones].sort().slice(0, 4)
        ),
        alignmentState: "recovering",
        intensity: clamp01(
          input.trustState.trustRecoveryMomentum * 0.5 +
            input.coordinationState.executiveAlignmentScore * 0.3
        ),
        dominantAlignmentDrivers: Object.freeze([
          "recovery_alignment",
          "executive_synchronization",
        ]),
        executiveLabel:
          "Strategic alignment remains stable across executive recovery systems",
      })
    );
  }

  if (
    input.decisionFrictionState.frictionHotspots.includes("logistics") &&
    fragmentationFactor > 0.2
  ) {
    signals.push(
      Object.freeze({
        signalId: "alignment::logistics-priority-drift",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        alignmentState: "drifting",
        intensity: clamp01(
          input.decisionFrictionState.organizationalDragLevel * 0.5 + fragmentationFactor * 0.3
        ),
        dominantAlignmentDrivers: Object.freeze([
          "operational_priority_fragmentation",
          "coordination_divergence",
        ]),
        executiveLabel:
          "Operational drift is increasing within logistics coordination priorities",
      })
    );
  }

  logAlignmentDev("Alignment", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateEnterpriseAlignmentScore(input: {
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  signals: readonly OrganizationalAlignmentSignal[];
}): number {
  const alignedRatio =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter(
          (s) => s.alignmentState === "aligned" || s.alignmentState === "recovering"
        ).length / input.signals.length;

  const score = clamp01(
    input.actorState.organizationalAlignmentScore * 0.25 +
      input.coordinationState.organizationalSynchronizationScore * 0.25 +
      input.influenceState.organizationalAlignmentLevel * 0.2 +
      input.trustState.organizationalTrustScore * 0.15 +
      alignedRatio * 0.15
  );

  logAlignmentDev("Alignment", { enterpriseAlignmentScore: score });
  return score;
}

export function calculateAlignmentDriftScore(input: {
  signals: readonly OrganizationalAlignmentSignal[];
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  leadershipState: LeadershipDynamicsState;
  coordinationDivergenceFactor?: number;
}): number {
  const driftingRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter(
          (s) => s.alignmentState === "drifting" || s.alignmentState === "fragmented"
        ).length / input.signals.length;

  const score = clamp01(
    driftingRatio * 0.35 +
      input.coordinationState.coordinationFrictionScore * 0.25 +
      input.decisionFrictionState.organizationalDragLevel * 0.2 +
      input.leadershipState.leadershipBurdenScore * 0.1 +
      (input.coordinationDivergenceFactor ?? 0) * 0.1
  );

  logAlignmentDev("AlignmentDrift", { alignmentDriftScore: score });
  return score;
}

export function calculateStrategicCoherenceLevel(input: {
  enterpriseAlignmentScore: number;
  alignmentDriftScore: number;
  leadershipState: LeadershipDynamicsState;
  trustState: OrganizationalTrustState;
}): number {
  const score = clamp01(
    input.enterpriseAlignmentScore * 0.4 +
      (1 - input.alignmentDriftScore) * 0.3 +
      input.leadershipState.coordinationCapacityLevel * 0.15 +
      input.trustState.organizationalTrustScore * 0.15
  );

  logAlignmentDev("StrategicCoherence", { strategicCoherenceLevel: score });
  return score;
}

export function identifyAlignmentDriftZones(
  signals: readonly OrganizationalAlignmentSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.alignmentState === "drifting" || signal.alignmentState === "fragmented") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  if (zones.size > 0) {
    logAlignmentDev("AlignmentDrift", { regions: [...zones].sort() });
  }
  return Object.freeze([...zones].sort());
}

export function identifyCoherenceRecoveryZones(
  signals: readonly OrganizationalAlignmentSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.alignmentState === "aligned" || signal.alignmentState === "recovering") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyAlignmentDriftLabel(input: {
  enterpriseAlignmentScore: number;
  alignmentDriftScore: number;
  strategicCoherenceLevel: number;
}): OrganizationalAlignmentDriftState["alignmentDriftLabel"] {
  if (
    input.enterpriseAlignmentScore >= 0.58 &&
    input.alignmentDriftScore < 0.45 &&
    input.strategicCoherenceLevel >= 0.55
  ) {
    return "coherent";
  }
  if (input.alignmentDriftScore >= 0.7 || input.strategicCoherenceLevel < 0.35) {
    return "fragmented";
  }
  if (
    input.alignmentDriftScore >= 0.5 &&
    input.enterpriseAlignmentScore < 0.5
  ) {
    return "drifting";
  }
  if (
    input.enterpriseAlignmentScore >= 0.48 &&
    input.strategicCoherenceLevel >= 0.5
  ) {
    return "recovering";
  }
  return "drifting";
}
