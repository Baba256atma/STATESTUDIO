/**
 * D7:3:8 — Adaptive coordination and human-system resilience modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  HumanSystemResilienceSignal,
  HumanSystemResilienceSignalState,
  HumanSystemResilienceState,
} from "./humanSystemResilienceTypes.ts";
import { logHumanSystemResilienceDev } from "./humanSystemResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function resilienceStateFromScores(
  adaptation: number,
  degradation: number
): HumanSystemResilienceSignalState {
  if (adaptation >= 0.62 && degradation < 0.35) return "adaptive";
  if (adaptation >= 0.55 && degradation < 0.45) return "stable";
  if (degradation >= 0.72) return "fragile";
  if (adaptation >= 0.5 && degradation < 0.55) return "recovering";
  return "strained";
}

export function deriveHumanSystemResilienceSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  alignmentState: OrganizationalAlignmentDriftState;
  recoveryState?: OrganizationalRecoveryState;
  resilienceFatigueFactor?: number;
  adaptationStressFactor?: number;
}): HumanSystemResilienceSignal[] {
  const signals: HumanSystemResilienceSignal[] = [];
  const fatigue = clamp01(input.resilienceFatigueFactor ?? 0);
  const stress = clamp01(input.adaptationStressFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const inTrustFragility = input.trustState.trustFragilityZones.includes(region.regionId);
    const inAlignmentDrift = input.alignmentState.alignmentDriftZones.includes(region.regionId);
    const inLeadershipSaturation = input.leadershipState.leadershipSaturationZones.includes(
      region.regionId
    );
    const inFriction = input.decisionFrictionState.frictionHotspots.includes(region.regionId);

    const adaptationBase = clamp01(
      input.coordinationState.organizationalSynchronizationScore * 0.2 +
        input.trustState.organizationalTrustScore * 0.2 +
        input.leadershipState.coordinationCapacityLevel * 0.15 +
        (input.recoveryState?.stabilizationPotential ?? 0.5) * 0.2 +
        input.alignmentState.strategicCoherenceLevel * 0.15 -
        fatigue * 0.1
    );
    const degradationBase = clamp01(
      input.coordinationState.coordinationFrictionScore * 0.2 +
        input.trustState.trustDegradationScore * 0.2 +
        input.leadershipState.leadershipBurdenScore * 0.15 +
        input.alignmentState.alignmentDriftScore * 0.15 +
        (inFriction ? 0.15 : 0) +
        stress * 0.1
    );

    const drivers: string[] = [];
    if (inTrustFragility) drivers.push("trust_instability");
    if (inAlignmentDrift) drivers.push("alignment_drift");
    if (inLeadershipSaturation) drivers.push("leadership_overload");
    if (inFriction) drivers.push("operational_fragility");
    if ((input.recoveryState?.stabilizationPotential ?? 0) >= 0.5) {
      drivers.push("recovery_synchronization");
    }
    if (input.coordinationState.coordinationDynamicsLabel === "synchronized") {
      drivers.push("adaptive_coordination");
    }

    const resilienceState = resilienceStateFromScores(adaptationBase, degradationBase);

    signals.push(
      Object.freeze({
        signalId: `resilience::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        resilienceState,
        intensity: clamp01(Math.abs(adaptationBase - degradationBase) + 0.2),
        dominantResilienceDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Human-system resilience is ${resilienceState} in ${region.label}`,
      })
    );
  }

  if (
    input.coordinationState.coordinationDynamicsLabel === "recovering" ||
    input.trustState.trustStabilityLabel === "recovering"
  ) {
    signals.push(
      Object.freeze({
        signalId: "resilience::executive-recovery-adaptation",
        affectedRegionIds: Object.freeze(
          [...input.alignmentState.coherenceRecoveryZones].sort().slice(0, 4)
        ),
        resilienceState: "adaptive",
        intensity: clamp01(
          input.trustState.trustRecoveryMomentum * 0.4 +
            input.leadershipState.coordinationCapacityLevel * 0.35
        ),
        dominantResilienceDrivers: Object.freeze([
          "adaptive_coordination",
          "recovery_synchronization",
        ]),
        executiveLabel:
          "Human-system resilience remains adaptive across executive recovery coordination",
      })
    );
  }

  if (
    input.decisionFrictionState.frictionHotspots.includes("logistics") &&
    (stress > 0.2 || fatigue > 0.2)
  ) {
    signals.push(
      Object.freeze({
        signalId: "resilience::logistics-stabilization-fragility",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        resilienceState: "fragile",
        intensity: clamp01(
          input.decisionFrictionState.organizationalDragLevel * 0.45 +
            input.trustState.trustDegradationScore * 0.35 +
            fatigue * 0.2
        ),
        dominantResilienceDrivers: Object.freeze([
          "operational_fragility",
          "dependency_pressure",
          "sustained_operational_load",
        ]),
        executiveLabel:
          "Resilience fragility is increasing within logistics stabilization systems under sustained dependency pressure",
      })
    );
  }

  logHumanSystemResilienceDev("Resilience", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateEnterpriseResilienceScore(input: {
  coordinationState: ExecutiveCoordinationState;
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  alignmentState: OrganizationalAlignmentDriftState;
  recoveryState?: OrganizationalRecoveryState;
  signals: readonly HumanSystemResilienceSignal[];
}): number {
  const adaptiveRatio =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter(
          (s) =>
            s.resilienceState === "adaptive" ||
            s.resilienceState === "stable" ||
            s.resilienceState === "recovering"
        ).length / input.signals.length;

  const score = clamp01(
    input.coordinationState.organizationalSynchronizationScore * 0.2 +
      input.trustState.organizationalTrustScore * 0.2 +
      input.leadershipState.coordinationCapacityLevel * 0.15 +
      input.alignmentState.strategicCoherenceLevel * 0.15 +
      (input.recoveryState?.stabilizationPotential ?? 0.5) * 0.15 +
      adaptiveRatio * 0.15
  );

  logHumanSystemResilienceDev("Resilience", { enterpriseResilienceScore: score });
  return score;
}

export function calculateResilienceDegradationScore(input: {
  signals: readonly HumanSystemResilienceSignal[];
  trustState: OrganizationalTrustState;
  leadershipState: LeadershipDynamicsState;
  alignmentState: OrganizationalAlignmentDriftState;
  resilienceFatigueFactor?: number;
}): number {
  const fragileRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter(
          (s) => s.resilienceState === "fragile" || s.resilienceState === "strained"
        ).length / input.signals.length;

  const score = clamp01(
    fragileRatio * 0.35 +
      input.trustState.trustDegradationScore * 0.25 +
      input.leadershipState.leadershipBurdenScore * 0.2 +
      input.alignmentState.alignmentDriftScore * 0.1 +
      (input.resilienceFatigueFactor ?? 0) * 0.1
  );

  logHumanSystemResilienceDev("ResilienceFragility", { resilienceDegradationScore: score });
  return score;
}

export function calculateHumanSystemAdaptationLevel(input: {
  enterpriseResilienceScore: number;
  resilienceDegradationScore: number;
  coordinationState: ExecutiveCoordinationState;
  influenceState: StakeholderInfluenceState;
}): number {
  const score = clamp01(
    input.enterpriseResilienceScore * 0.45 +
      (1 - input.resilienceDegradationScore) * 0.35 +
      input.coordinationState.executiveAlignmentScore * 0.1 +
      input.influenceState.influencePropagationScore * 0.1
  );

  logHumanSystemResilienceDev("HumanSystem", { humanSystemAdaptationLevel: score });
  return score;
}

export function identifyHumanSystemResilienceFragilityZones(
  signals: readonly HumanSystemResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.resilienceState === "fragile" || signal.resilienceState === "strained") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  if (zones.size > 0) {
    logHumanSystemResilienceDev("ResilienceFragility", { regions: [...zones].sort() });
  }
  return Object.freeze([...zones].sort());
}

export function identifyAdaptiveRecoveryZones(
  signals: readonly HumanSystemResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.resilienceState === "adaptive" ||
      signal.resilienceState === "recovering" ||
      signal.resilienceState === "stable"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyResilienceStabilityLabel(input: {
  enterpriseResilienceScore: number;
  resilienceDegradationScore: number;
  humanSystemAdaptationLevel: number;
}): HumanSystemResilienceState["resilienceStabilityLabel"] {
  if (
    input.enterpriseResilienceScore >= 0.58 &&
    input.resilienceDegradationScore < 0.45 &&
    input.humanSystemAdaptationLevel >= 0.55
  ) {
    return "adaptive";
  }
  if (input.resilienceDegradationScore >= 0.72) {
    return "fragile";
  }
  if (
    input.humanSystemAdaptationLevel >= 0.5 &&
    input.resilienceDegradationScore < 0.55
  ) {
    return "recovering";
  }
  if (
    input.enterpriseResilienceScore >= 0.5 &&
    input.resilienceDegradationScore < 0.5
  ) {
    return "stable";
  }
  return "strained";
}
