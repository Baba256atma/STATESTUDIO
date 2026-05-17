/**
 * D7:4:5 — Recovery opportunity emergence modeling.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  PredictiveRecoveryOpportunityState,
  RecoveryOpportunitySignal,
  RecoveryOpportunitySignalState,
} from "./recoveryOpportunityTypes.ts";
import { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function opportunityStateFromScores(
  emergence: number,
  fragility: number,
  acceleration: number
): RecoveryOpportunitySignalState {
  if (fragility >= 0.72) return "critical";
  if (fragility >= 0.55 && emergence < 0.5) return "fragile";
  if (acceleration >= 0.62) return "accelerating";
  if (emergence >= 0.55 && fragility < 0.45) return "stabilizing";
  return "emerging";
}

export function deriveRecoveryOpportunitySignals(input: {
  topology: OperationalUniverseTopology;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  interventionLeverageFactor?: number;
}): RecoveryOpportunitySignal[] {
  const signals: RecoveryOpportunitySignal[] = [];
  const leverage = clamp01(input.interventionLeverageFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const inStabilizationCascade = input.cascadeState.stabilizationZones.includes(region.regionId);
    const inRecoveryTrajectory = input.trajectoryState.recoveryTrajectories.includes(region.regionId);
    const inAdaptiveZone = input.resilienceState.adaptiveRecoveryZones.includes(region.regionId);
    const saturated = input.pressureState?.saturationRegions.includes(region.regionId) ?? false;

    const emergenceBase = clamp01(
      (inStabilizationCascade ? 0.2 : 0) +
        (inRecoveryTrajectory ? 0.25 : 0) +
        (inAdaptiveZone ? 0.2 : 0) +
        input.resilienceState.enterpriseResilienceScore * 0.15 +
        (input.coordinationState?.organizationalSynchronizationScore ?? 0.45) * 0.1 +
        leverage * 0.1
    );
    const fragilityBase = clamp01(
      (saturated ? 0.25 : 0) +
        (input.trajectoryState.degradationTrajectories.includes(region.regionId) ? 0.2 : 0) +
        (input.divergenceState.fragmentedFutureZones.includes(region.regionId) ? 0.15 : 0)
    );
    const accelerationBase = clamp01(
      input.momentumState.recoveryMomentumScore * 0.3 +
        (input.recoveryState?.stabilizationPotential ?? 0.45) * 0.25 +
        (input.trustState?.trustRecoveryMomentum ?? 0.35) * 0.2
    );

    const drivers: string[] = [];
    if (inRecoveryTrajectory) drivers.push("recovery_momentum");
    if (inAdaptiveZone) drivers.push("resilience_adaptation");
    if (inStabilizationCascade) drivers.push("cascade_stabilization");
    if ((input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.5) {
      drivers.push("coordination_improvement");
    }
    if (!saturated) drivers.push("pressure_relief");

    const opportunityState = opportunityStateFromScores(
      emergenceBase,
      fragilityBase,
      accelerationBase
    );
    const opportunityStrength = clamp01(
      emergenceBase * 0.4 + accelerationBase * 0.35 + (1 - fragilityBase) * 0.25
    );

    if (opportunityStrength < 0.28 && opportunityState === "emerging") continue;

    signals.push(
      Object.freeze({
        signalId: `recovery-opportunity::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        opportunityState,
        opportunityStrength,
        dominantOpportunityDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Recovery opportunity may emerge in ${region.label} under current stabilization conditions`,
      })
    );
  }

  if (
    (input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.45 &&
    input.resilienceState.resilienceStabilityLabel === "adaptive"
  ) {
    signals.push(
      Object.freeze({
        signalId: "recovery-opportunity::coordination-resilience",
        affectedRegionIds: Object.freeze(
          [...input.resilienceState.adaptiveRecoveryZones].sort().slice(0, 4)
        ),
        opportunityState: "accelerating",
        opportunityStrength: clamp01(
          (input.coordinationState?.organizationalSynchronizationScore ?? 0) * 0.45 +
            input.resilienceState.humanSystemAdaptationLevel * 0.4
        ),
        dominantOpportunityDrivers: Object.freeze([
          "executive_alignment",
          "coordination_improvement",
          "resilience_amplification",
        ]),
        executiveLabel:
          "Improved executive alignment may strengthen coordination and create recovery acceleration opportunities",
      })
    );
  }

  if (
    input.pressureState &&
    input.pressureState.saturationRegions.length > 0 &&
    input.trajectoryState.recoveryTrajectories.includes("logistics")
  ) {
    signals.push(
      Object.freeze({
        signalId: "recovery-opportunity::logistics-leverage",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        opportunityState: "stabilizing",
        opportunityStrength: clamp01(
          0.5 + (input.recoveryState?.stabilizationPotential ?? 0.4) * 0.25
        ),
        dominantOpportunityDrivers: Object.freeze([
          "logistics_stabilization",
          "pressure_relief",
          "manufacturing_recovery",
        ]),
        executiveLabel:
          "Moderate logistics coordination improvements may accelerate recovery stabilization across manufacturing systems",
      })
    );
  }

  if (signals.length === 0) {
    signals.push(
      Object.freeze({
        signalId: "recovery-opportunity::enterprise-emerging",
        affectedRegionIds: Object.freeze(
          input.topology.operationalRegions[0]
            ? [input.topology.operationalRegions[0].regionId]
            : ["logistics"]
        ),
        opportunityState: "emerging",
        opportunityStrength: 0.35,
        dominantOpportunityDrivers: Object.freeze(["limited_stabilization_potential"]),
        executiveLabel:
          "Limited recovery opportunity signals may emerge under current constrained operational conditions",
      })
    );
  }

  logRecoveryOpportunityDev("RecoveryOpportunity", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateRecoveryAccelerationScore(input: {
  signals: readonly RecoveryOpportunitySignal[];
  momentumState: EnterpriseMomentumState;
  resilienceState: HumanSystemResilienceState;
}): number {
  const accelerating = input.signals.filter(
    (s) => s.opportunityState === "accelerating" || s.opportunityState === "stabilizing"
  );
  const score = clamp01(
    (accelerating.length / Math.max(1, input.signals.length)) * 0.4 +
      input.momentumState.recoveryMomentumScore * 0.3 +
      input.resilienceState.enterpriseResilienceScore * 0.3
  );
  logRecoveryOpportunityDev("ResilienceOpportunity", { recoveryAccelerationScore: score });
  return score;
}

export function calculateStabilizationPotentialScore(input: {
  signals: readonly RecoveryOpportunitySignal[];
  cascadeState: PredictiveCascadeState;
  equilibriumState: EnterpriseEquilibriumState;
}): number {
  const stabilizing = input.signals.filter((s) => s.opportunityState === "stabilizing");
  const score = clamp01(
    (stabilizing.length / Math.max(1, input.signals.length)) * 0.35 +
      input.cascadeState.cascadeStabilizationScore * 0.35 +
      input.equilibriumState.equilibriumScore * 0.3
  );
  logRecoveryOpportunityDev("StabilizationPotential", { stabilizationPotentialScore: score });
  return score;
}

export function identifyStabilizationOpportunityZones(
  signals: readonly RecoveryOpportunitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.opportunityState === "stabilizing" ||
      signal.opportunityState === "accelerating" ||
      signal.opportunityState === "emerging"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragileRecoveryZones(
  signals: readonly RecoveryOpportunitySignal[],
  trajectoryState: PredictiveTrajectoryState
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.opportunityState === "fragile" || signal.opportunityState === "critical") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  for (const r of trajectoryState.degradationTrajectories) zones.add(r);
  return Object.freeze([...zones].sort());
}

export function identifyResilienceAccelerationZones(
  signals: readonly RecoveryOpportunitySignal[],
  resilienceState: HumanSystemResilienceState
): readonly string[] {
  const zones = new Set<string>(resilienceState.adaptiveRecoveryZones);
  for (const signal of signals) {
    if (signal.opportunityState === "accelerating") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyRecoveryOpportunityLabel(input: {
  recoveryAccelerationScore: number;
  stabilizationPotentialScore: number;
  fragileZoneCount: number;
}): PredictiveRecoveryOpportunityState["recoveryOpportunityLabel"] {
  if (input.fragileZoneCount >= 3 && input.recoveryAccelerationScore < 0.45) {
    return "fragile";
  }
  if (input.recoveryAccelerationScore >= 0.62 && input.stabilizationPotentialScore >= 0.5) {
    return "accelerating";
  }
  if (input.stabilizationPotentialScore >= 0.55) {
    return "stabilizing";
  }
  if (input.recoveryAccelerationScore >= 0.45 || input.stabilizationPotentialScore >= 0.4) {
    return "emerging";
  }
  return "limited";
}
