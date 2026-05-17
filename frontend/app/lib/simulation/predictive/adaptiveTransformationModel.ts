/**
 * D7:4:7 — Adaptive transformation modeling.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { LeadershipDynamicsState } from "../leadership/leadershipLoadTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type {
  PredictiveStrategicAdaptationState,
  StrategicAdaptationSignal,
  StrategicAdaptationSignalState,
} from "./strategicAdaptationTypes.ts";
import { logAdaptationDev } from "./adaptationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function adaptationStateFromScores(
  flexibility: number,
  rigidity: number,
  resilience: number
): StrategicAdaptationSignalState {
  if (rigidity >= 0.72) return "critical";
  if (rigidity >= 0.58 && flexibility < 0.45) return "strained";
  if (flexibility >= 0.62 && resilience >= 0.5) return "flexible";
  if (resilience >= 0.55 && flexibility >= 0.5) return "adaptive";
  return "emerging";
}

export function deriveStrategicAdaptationSignals(input: {
  topology: OperationalUniverseTopology;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  leadershipState?: LeadershipDynamicsState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  adaptationLeverageFactor?: number;
  rigidityStressFactor?: number;
}): StrategicAdaptationSignal[] {
  const signals: StrategicAdaptationSignal[] = [];
  const leverage = clamp01(input.adaptationLeverageFactor ?? 0);
  const rigidityStress = clamp01(input.rigidityStressFactor ?? 0);

  const leadershipCoordinated =
    (input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.45 &&
    (input.leadershipState?.leadershipDynamicsLabel !== "saturated" ||
      (input.leadershipState?.leadershipBurdenScore ?? 1) < 0.8);

  for (const region of input.topology.operationalRegions) {
    const inFlexibilityZone = input.recoveryOpportunityState.resilienceAccelerationZones.includes(
      region.regionId
    );
    const inPreventionZone = input.preventionState.stabilizationInterventionZones.includes(
      region.regionId
    );
    const inFragile = input.preventionState.criticalCollapseZones.includes(region.regionId);
    const saturated = input.pressureState?.saturationRegions.includes(region.regionId) ?? false;

    const flexibilityBase = clamp01(
      input.resilienceState.humanSystemAdaptationLevel * 0.25 +
        (inFlexibilityZone ? 0.2 : 0) +
        (inPreventionZone ? 0.15 : 0) +
        (input.coordinationState?.organizationalSynchronizationScore ?? 0.45) * 0.2 +
        leverage * 0.1
    );
    const rigidityBase = clamp01(
      (saturated ? 0.25 : 0) +
        (inFragile ? 0.2 : 0) +
        (input.alignmentState?.alignmentDriftScore ?? 0) * 0.25 +
        rigidityStress * 0.15 +
        (input.leadershipState?.leadershipDynamicsLabel === "saturated" ? 0.15 : 0)
    );
    const resilienceBase = clamp01(
      input.resilienceState.enterpriseResilienceScore * 0.35 +
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.25 +
        input.preventionState.resiliencePreservationScore * 0.2
    );

    const drivers: string[] = [];
    if (inFlexibilityZone) drivers.push("recovery_adaptation");
    if (leadershipCoordinated) drivers.push("leadership_coordination");
    if (input.resilienceState.resilienceStabilityLabel === "adaptive") {
      drivers.push("resilience_restructuring");
    }
    if (saturated) drivers.push("dependency_pressure");
    if (input.equilibriumState.equilibriumLabel === "recovering") {
      drivers.push("equilibrium_restoration");
    }

    const adaptationState = adaptationStateFromScores(
      flexibilityBase,
      rigidityBase,
      resilienceBase
    );
    const adaptationStrength = clamp01(
      flexibilityBase * 0.4 + resilienceBase * 0.35 + (1 - rigidityBase) * 0.25
    );

    if (adaptationStrength < 0.28 && adaptationState === "emerging") continue;

    signals.push(
      Object.freeze({
        signalId: `adaptation::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        adaptationState,
        adaptationStrength,
        dominantAdaptationDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Strategic adaptation may emerge in ${region.label} under current operational pressure and recovery conditions`,
      })
    );
  }

  if (leadershipCoordinated && input.resilienceState.resilienceStabilityLabel === "adaptive") {
    signals.push(
      Object.freeze({
        signalId: "adaptation::leadership-recovery",
        affectedRegionIds: Object.freeze(
          [...input.resilienceState.adaptiveRecoveryZones].sort().slice(0, 4)
        ),
        adaptationState: "adaptive",
        adaptationStrength: clamp01(
          (input.coordinationState?.organizationalSynchronizationScore ?? 0) * 0.45 +
            input.resilienceState.humanSystemAdaptationLevel * 0.4
        ),
        dominantAdaptationDrivers: Object.freeze([
          "leadership_coordination",
          "adaptive_recovery_acceleration",
        ]),
        executiveLabel:
          "Improved leadership coordination may support adaptive recovery acceleration across coordinated domains",
      })
    );
  }

  if (
    input.pressureState &&
    input.pressureState.saturationRegions.length >= 2 &&
    (input.coordinationState?.organizationalSynchronizationScore ?? 1) < 0.45
  ) {
    signals.push(
      Object.freeze({
        signalId: "adaptation::rigidity-pressure",
        affectedRegionIds: Object.freeze(
          [...input.pressureState.saturationRegions].sort().slice(0, 3)
        ),
        adaptationState: "strained",
        adaptationStrength: clamp01(
          0.45 + input.pressureState.saturationRegions.length * 0.08 + rigidityStress * 0.15
        ),
        dominantAdaptationDrivers: Object.freeze([
          "operational_rigidity",
          "dependency_pressure",
          "adaptation_fragility",
        ]),
        executiveLabel:
          "Operational rigidity combined with dependency pressure may escalate adaptation fragility",
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryLeveragePointRecords.some((r) =>
      r.recordId.includes("logistics")
    )
  ) {
    signals.push(
      Object.freeze({
        signalId: "adaptation::cross-domain-flexibility",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        adaptationState: "flexible",
        adaptationStrength: clamp01(
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.5 + leverage * 0.25
        ),
        dominantAdaptationDrivers: Object.freeze([
          "coordination_flexibility",
          "cross_domain_adaptation",
        ]),
        executiveLabel:
          "Cross-domain coordination flexibility may strengthen long-term recovery adaptation across logistics and manufacturing",
      })
    );
  }

  if (signals.length === 0) {
    signals.push(
      Object.freeze({
        signalId: "adaptation::enterprise-emerging",
        affectedRegionIds: Object.freeze(["logistics"]),
        adaptationState: "emerging",
        adaptationStrength: 0.35,
        dominantAdaptationDrivers: Object.freeze(["limited_adaptation_capacity"]),
        executiveLabel:
          "Limited strategic adaptation signals may emerge under current constrained organizational conditions",
      })
    );
  }

  logAdaptationDev("Adaptation", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateAdaptiveResilienceScore(input: {
  signals: readonly StrategicAdaptationSignal[];
  resilienceState: HumanSystemResilienceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): number {
  const adaptive = input.signals.filter(
    (s) => s.adaptationState === "adaptive" || s.adaptationState === "flexible"
  );
  const score = clamp01(
    (adaptive.length / Math.max(1, input.signals.length)) * 0.4 +
      input.resilienceState.enterpriseResilienceScore * 0.3 +
      input.recoveryOpportunityState.recoveryAccelerationScore * 0.3
  );
  logAdaptationDev("AdaptiveRecovery", { adaptiveResilienceScore: score });
  return score;
}

export function calculateStrategicFlexibilityScore(input: {
  signals: readonly StrategicAdaptationSignal[];
  preventionState: PredictiveCollapsePreventionState;
  coordinationState?: ExecutiveCoordinationState;
}): number {
  const flexible = input.signals.filter(
    (s) => s.adaptationState === "flexible" || s.adaptationState === "adaptive"
  );
  const score = clamp01(
    (flexible.length / Math.max(1, input.signals.length)) * 0.4 +
      input.preventionState.collapseInterruptionScore * 0.3 +
      (input.coordinationState?.organizationalSynchronizationScore ?? 0.45) * 0.3
  );
  logAdaptationDev("StrategicFlexibility", { strategicFlexibilityScore: score });
  return score;
}

export function calculateAdaptationFragilityScore(input: {
  signals: readonly StrategicAdaptationSignal[];
  divergenceState: MultiFutureDivergenceState;
}): number {
  const fragile = input.signals.filter(
    (s) => s.adaptationState === "strained" || s.adaptationState === "critical"
  );
  const score = clamp01(
    (fragile.length / Math.max(1, input.signals.length)) * 0.4 +
      input.divergenceState.futureFragmentationScore * 0.35 +
      fragile.reduce((s, sig) => s + sig.adaptationStrength, 0) /
        Math.max(1, fragile.length) *
        0.25
  );
  logAdaptationDev("Transformation", { adaptationFragilityScore: score });
  return score;
}

export function identifyStrategicFlexibilityZones(
  signals: readonly StrategicAdaptationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.adaptationState === "flexible" ||
      signal.adaptationState === "adaptive" ||
      signal.adaptationState === "emerging"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyAdaptationFragilityZones(
  signals: readonly StrategicAdaptationSignal[],
  preventionState: PredictiveCollapsePreventionState
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.adaptationState === "strained" || signal.adaptationState === "critical") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  for (const r of preventionState.criticalCollapseZones) zones.add(r);
  return Object.freeze([...zones].sort());
}

export function identifyTransformationBottleneckZones(input: {
  signals: readonly StrategicAdaptationSignal[];
  leadershipState?: LeadershipDynamicsState;
  alignmentState?: OrganizationalAlignmentDriftState;
}): readonly string[] {
  const zones = new Set<string>();
  if (input.leadershipState?.leadershipDynamicsLabel === "saturated") {
    for (const signal of input.signals) {
      if (signal.adaptationState === "strained") {
        for (const r of signal.affectedRegionIds) zones.add(r);
      }
    }
  }
  if ((input.alignmentState?.alignmentDriftScore ?? 0) >= 0.6) {
    for (const r of input.alignmentState?.alignmentDriftZones ?? []) zones.add(r);
  }
  return Object.freeze([...zones].sort());
}

export function classifyPredictiveAdaptationLabel(input: {
  adaptiveResilienceScore: number;
  strategicFlexibilityScore: number;
  adaptationFragilityScore: number;
}): PredictiveStrategicAdaptationState["predictiveAdaptationLabel"] {
  if (input.adaptationFragilityScore >= 0.7) return "critical";
  if (input.adaptationFragilityScore >= 0.55) return "strained";
  if (
    input.strategicFlexibilityScore >= 0.58 &&
    input.adaptiveResilienceScore >= 0.5
  ) {
    return "flexible";
  }
  if (input.adaptiveResilienceScore >= 0.55) return "adaptive";
  return "emerging";
}
