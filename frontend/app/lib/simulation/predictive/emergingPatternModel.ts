/**
 * D7:4:8 — Emerging-pattern executive foresight modeling.
 */

import type { PredictiveStrategicAdaptationState } from "./strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type {
  ExecutiveForesightSignal,
  ExecutiveForesightSignalState,
  PredictiveExecutiveForesightState,
} from "./executiveForesightTypes.ts";
import { logForesightDev } from "./foresightDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function foresightStateFromScores(
  emergence: number,
  volatility: number,
  stabilization: number
): ExecutiveForesightSignalState {
  if (volatility >= 0.72) return "critical";
  if (volatility >= 0.58 && stabilization < 0.45) return "volatile";
  if (stabilization >= 0.58) return "stabilizing";
  if (emergence >= 0.55) return "developing";
  return "emerging";
}

export function deriveExecutiveForesightSignals(input: {
  topology: OperationalUniverseTopology;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  foresightAmplificationFactor?: number;
  horizonStressFactor?: number;
}): ExecutiveForesightSignal[] {
  const signals: ExecutiveForesightSignal[] = [];
  const amplification = clamp01(input.foresightAmplificationFactor ?? 0);
  const horizonStress = clamp01(input.horizonStressFactor ?? 0);

  const instabilityCluster =
    input.preventionState.criticalThresholdProximityScore >= 0.5 ||
    input.cascadeState.predictiveCascadeLabel === "critical" ||
    input.cascadeState.predictiveCascadeLabel === "amplifying";

  for (const region of input.topology.operationalRegions) {
    const inRisk = input.preventionState.criticalCollapseZones.includes(region.regionId);
    const inOpportunity = input.recoveryOpportunityState.stabilizationOpportunityZones.includes(
      region.regionId
    );
    const inAdaptationFlex = input.adaptationState.strategicFlexibilityZones.includes(
      region.regionId
    );
    const inDivergence = input.divergenceState.fragmentedFutureZones.includes(region.regionId);

    const emergenceBase = clamp01(
      (inOpportunity ? 0.2 : 0) +
        (inAdaptationFlex ? 0.2 : 0) +
        input.adaptationState.adaptiveResilienceScore * 0.2 +
        amplification * 0.15
    );
    const volatilityBase = clamp01(
      (inRisk ? 0.25 : 0) +
        (inDivergence ? 0.2 : 0) +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        horizonStress * 0.15 +
        (instabilityCluster ? 0.1 : 0)
    );
    const stabilizationBase = clamp01(
      input.recoveryOpportunityState.stabilizationPotentialScore * 0.3 +
        input.preventionState.collapseInterruptionScore * 0.25 +
        input.equilibriumState.equilibriumScore * 0.25 +
        (inOpportunity ? 0.15 : 0)
    );

    const drivers: string[] = [];
    if (instabilityCluster) drivers.push("early_instability_pattern");
    if (inOpportunity) drivers.push("stabilization_foresight");
    if (input.adaptationState.predictiveAdaptationLabel === "flexible") {
      drivers.push("adaptation_resilience");
    }
    if (input.momentumState.momentumTrendLabel === "recovering") {
      drivers.push("recovery_momentum");
    }
    if (inDivergence) drivers.push("future_divergence");

    const foresightState = foresightStateFromScores(
      emergenceBase,
      volatilityBase,
      stabilizationBase
    );
    const foresightStrength = clamp01(
      emergenceBase * 0.35 + stabilizationBase * 0.35 + (1 - volatilityBase) * 0.3
    );

    if (foresightStrength < 0.28 && foresightState === "emerging") continue;

    signals.push(
      Object.freeze({
        signalId: `foresight::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        foresightState,
        foresightStrength,
        dominantForesightDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Emerging foresight patterns in ${region.label} may warrant executive attention`,
      })
    );
  }

  if (instabilityCluster) {
    signals.push(
      Object.freeze({
        signalId: "foresight::instability-cluster",
        affectedRegionIds: Object.freeze(
          [...input.preventionState.criticalCollapseZones].sort().slice(0, 4)
        ),
        foresightState: "developing",
        foresightStrength: clamp01(
          input.preventionState.criticalThresholdProximityScore * 0.5 +
            input.cascadeState.cascadeAmplificationScore * 0.35 +
            horizonStress * 0.1
        ),
        dominantForesightDrivers: Object.freeze([
          "dependency_pressure",
          "leadership_overload",
          "trust_degradation",
        ]),
        executiveLabel:
          "Growing dependency pressure combined with coordination strain may form an early instability foresight signal",
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryOpportunityLabel === "accelerating" ||
    input.recoveryOpportunityState.recoveryOpportunityLabel === "stabilizing"
  ) {
    signals.push(
      Object.freeze({
        signalId: "foresight::stabilization-opportunity",
        affectedRegionIds: Object.freeze(
          [...input.recoveryOpportunityState.resilienceAccelerationZones].sort().slice(0, 4)
        ),
        foresightState: "stabilizing",
        foresightStrength: clamp01(
          input.recoveryOpportunityState.recoveryAccelerationScore * 0.45 +
            input.adaptationState.strategicFlexibilityScore * 0.35
        ),
        dominantForesightDrivers: Object.freeze([
          "recovery_stabilization",
          "coordination_improvement",
          "resilience_strengthening",
        ]),
        executiveLabel:
          "Recovery stabilization combined with improving coordination may indicate a future stabilization opportunity foresight",
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.45 &&
    input.trajectoryState.trajectoryVolatilityScore >= 0.45
  ) {
    signals.push(
      Object.freeze({
        signalId: "foresight::logistics-dependency",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        foresightState: "volatile",
        foresightStrength: clamp01(
          0.5 + input.divergenceState.futureFragmentationScore * 0.25
        ),
        dominantForesightDrivers: Object.freeze([
          "logistics_dependency",
          "long_horizon_fragility",
        ]),
        executiveLabel:
          "Emerging long-term fragility pressure within logistics dependency systems may warrant executive preparation",
      })
    );
  }

  if (signals.length === 0) {
    signals.push(
      Object.freeze({
        signalId: "foresight::enterprise-emerging",
        affectedRegionIds: Object.freeze(["logistics"]),
        foresightState: "emerging",
        foresightStrength: 0.35,
        dominantForesightDrivers: Object.freeze(["limited_foresight_signal"]),
        executiveLabel:
          "Limited executive foresight signals may emerge under current operational evolution conditions",
      })
    );
  }

  logForesightDev("Foresight", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateStrategicPreparednessScore(input: {
  signals: readonly ExecutiveForesightSignal[];
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
}): number {
  const prepared = input.signals.filter(
    (s) => s.foresightState === "stabilizing" || s.foresightState === "developing"
  );
  const score = clamp01(
    (prepared.length / Math.max(1, input.signals.length)) * 0.4 +
      input.adaptationState.strategicFlexibilityScore * 0.3 +
      input.preventionState.collapseInterruptionScore * 0.3
  );
  logForesightDev("ExecutivePreparedness", { strategicPreparednessScore: score });
  return score;
}

export function calculateLongHorizonRiskScore(input: {
  signals: readonly ExecutiveForesightSignal[];
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
}): number {
  const risky = input.signals.filter(
    (s) => s.foresightState === "volatile" || s.foresightState === "critical"
  );
  const score = clamp01(
    (risky.length / Math.max(1, input.signals.length)) * 0.4 +
      input.divergenceState.futureFragmentationScore * 0.3 +
      input.cascadeState.cascadeAmplificationScore * 0.3
  );
  logForesightDev("LongHorizon", { longHorizonRiskScore: score });
  return score;
}

export function calculateFutureReadinessScore(input: {
  signals: readonly ExecutiveForesightSignal[];
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): number {
  const ready = input.signals.filter((s) => s.foresightState !== "critical");
  const score = clamp01(
    (ready.length / Math.max(1, input.signals.length)) * 0.35 +
      input.recoveryOpportunityState.recoveryAccelerationScore * 0.35 +
      input.resilienceState.enterpriseResilienceScore * 0.3
  );
  logForesightDev("FutureReadiness", { futureReadinessScore: score });
  return score;
}

export function identifyForesightOpportunityZones(
  signals: readonly ExecutiveForesightSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.foresightState === "stabilizing" ||
      signal.foresightState === "developing" ||
      signal.foresightState === "emerging"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyLongHorizonRiskZones(
  signals: readonly ExecutiveForesightSignal[],
  preventionState: PredictiveCollapsePreventionState
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.foresightState === "volatile" || signal.foresightState === "critical") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  for (const r of preventionState.criticalCollapseZones) zones.add(r);
  return Object.freeze([...zones].sort());
}

export function identifyFutureReadinessZones(
  signals: readonly ExecutiveForesightSignal[],
  recoveryOpportunityState: PredictiveRecoveryOpportunityState
): readonly string[] {
  const zones = new Set<string>(recoveryOpportunityState.resilienceAccelerationZones);
  for (const signal of signals) {
    if (signal.foresightState === "stabilizing") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyPredictiveForesightLabel(input: {
  strategicPreparednessScore: number;
  longHorizonRiskScore: number;
  futureReadinessScore: number;
}): PredictiveExecutiveForesightState["predictiveForesightLabel"] {
  if (input.longHorizonRiskScore >= 0.7) return "critical";
  if (input.longHorizonRiskScore >= 0.55) return "volatile";
  if (
    input.strategicPreparednessScore >= 0.58 &&
    input.futureReadinessScore >= 0.5
  ) {
    return "stabilizing";
  }
  if (input.strategicPreparednessScore >= 0.45 || input.futureReadinessScore >= 0.45) {
    return "developing";
  }
  return "emerging";
}
