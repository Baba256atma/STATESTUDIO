/**
 * D7:4:6 — Critical-threshold collapse prevention modeling.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { StrategicInflectionState } from "./cascadingConsequenceTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type {
  CollapsePreventionSignal,
  CollapsePreventionSignalState,
  PredictiveCollapsePreventionState,
} from "./collapsePreventionTypes.ts";
import { logPreventionDev } from "./preventionDevLog.ts";
import { resolveInflectionSurface } from "./predictivePropagationModel.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function preventionStateFromScores(
  interruption: number,
  thresholdProximity: number,
  fragile: number
): CollapsePreventionSignalState {
  if (thresholdProximity >= 0.75) return "critical";
  if (fragile >= 0.6 && interruption < 0.45) return "fragile";
  if (interruption >= 0.58) return "intervenable";
  if (interruption >= 0.45) return "stabilizing";
  return "monitoring";
}

export function deriveCollapsePreventionSignals(input: {
  topology: OperationalUniverseTopology;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  inflection: StrategicInflectionState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  preventionLeverageFactor?: number;
}): CollapsePreventionSignal[] {
  const signals: CollapsePreventionSignal[] = [];
  const leverage = clamp01(input.preventionLeverageFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const inAmplification = input.cascadeState.amplificationZones.includes(region.regionId);
    const inCriticalCollapse = input.cascadeState.predictiveCascadeLabel === "critical";
    const inRecoveryOpportunity = input.recoveryOpportunityState.stabilizationOpportunityZones.includes(
      region.regionId
    );
    const inFragileRecovery = input.recoveryOpportunityState.fragileRecoveryZones.includes(
      region.regionId
    );
    const saturated = input.pressureState?.saturationRegions.includes(region.regionId) ?? false;

    const interruptionBase = clamp01(
      input.cascadeState.cascadeStabilizationScore * 0.25 +
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.25 +
        (inRecoveryOpportunity ? 0.2 : 0) +
        leverage * 0.15 -
        (inAmplification ? 0.15 : 0)
    );
    const thresholdProximity = clamp01(
      (saturated ? 0.25 : 0) +
        (inAmplification ? 0.2 : 0) +
        input.inflection.inflectionPressureScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        (inCriticalCollapse ? 0.1 : 0)
    );
    const fragileBase = clamp01(
      (inFragileRecovery ? 0.3 : 0) +
        input.divergenceState.futureFragmentationScore * 0.25 +
        input.resilienceState.resilienceDegradationScore * 0.25
    );

    const drivers: string[] = [];
    if (inRecoveryOpportunity) drivers.push("recovery_stabilization");
    if (input.cascadeState.cascadeStabilizationScore >= 0.45) drivers.push("cascade_interruption");
    if ((input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.45) {
      drivers.push("coordination_recovery");
    }
    if ((input.trustState?.trustRecoveryMomentum ?? 0) >= 0.4) drivers.push("trust_stabilization");
    if (saturated) drivers.push("dependency_pressure");

    const preventionState = preventionStateFromScores(
      interruptionBase,
      thresholdProximity,
      fragileBase
    );
    const preventionStrength = clamp01(
      interruptionBase * 0.4 + (1 - thresholdProximity) * 0.35 + (1 - fragileBase) * 0.25
    );

    if (preventionStrength < 0.28 && preventionState === "monitoring") continue;

    signals.push(
      Object.freeze({
        signalId: `prevention::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        preventionState,
        preventionStrength,
        dominantPreventionDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Collapse prevention window may exist in ${region.label} under current stabilization conditions`,
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
        signalId: "prevention::logistics-stabilization",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        preventionState: "intervenable",
        preventionStrength: clamp01(
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.5 + leverage * 0.25
        ),
        dominantPreventionDrivers: Object.freeze([
          "logistics_stabilization",
          "cascade_interruption",
          "recovery_leverage",
        ]),
        executiveLabel:
          "Early logistics stabilization may interrupt recovery collapse propagation across manufacturing systems",
      })
    );
  }

  if (
    (input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.4 &&
    (input.trustState?.trustStabilityLabel === "strained" ||
      input.trustState?.trustStabilityLabel === "degrading")
  ) {
    signals.push(
      Object.freeze({
        signalId: "prevention::trust-coordination",
        affectedRegionIds: Object.freeze(
          [...input.resilienceState.adaptiveRecoveryZones].sort().slice(0, 4)
        ),
        preventionState: "stabilizing",
        preventionStrength: clamp01(
          (input.coordinationState?.organizationalSynchronizationScore ?? 0) * 0.45 +
            (input.trustState?.trustRecoveryMomentum ?? 0.35) * 0.35
        ),
        dominantPreventionDrivers: Object.freeze([
          "trust_stabilization",
          "leadership_coordination",
          "fragility_reduction",
        ]),
        executiveLabel:
          "Trust stabilization combined with coordination recovery may interrupt fragility amplification pathways",
      })
    );
  }

  if (signals.length === 0) {
    signals.push(
      Object.freeze({
        signalId: "prevention::enterprise-monitoring",
        affectedRegionIds: Object.freeze(["logistics"]),
        preventionState: "monitoring",
        preventionStrength: 0.35,
        dominantPreventionDrivers: Object.freeze(["limited_prevention_window"]),
        executiveLabel:
          "Limited collapse prevention windows may be monitored under current systemic stress conditions",
      })
    );
  }

  logPreventionDev("CollapsePrevention", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function resolvePreventionInflection(input: {
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  inflectionState?: StrategicInflectionState;
}): StrategicInflectionState {
  return resolveInflectionSurface({
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    inflectionState: input.inflectionState,
  });
}

export function calculateCollapseInterruptionScore(input: {
  signals: readonly CollapsePreventionSignal[];
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): number {
  const intervenable = input.signals.filter(
    (s) => s.preventionState === "intervenable" || s.preventionState === "stabilizing"
  );
  const score = clamp01(
    (intervenable.length / Math.max(1, input.signals.length)) * 0.4 +
      input.cascadeState.cascadeStabilizationScore * 0.3 +
      input.recoveryOpportunityState.recoveryAccelerationScore * 0.3
  );
  logPreventionDev("StabilizationWindow", { collapseInterruptionScore: score });
  return score;
}

export function calculateCriticalThresholdProximityScore(input: {
  signals: readonly CollapsePreventionSignal[];
  cascadeState: PredictiveCascadeState;
  inflection: StrategicInflectionState;
}): number {
  const critical = input.signals.filter(
    (s) => s.preventionState === "critical" || s.preventionState === "fragile"
  );
  const score = clamp01(
    (critical.length / Math.max(1, input.signals.length)) * 0.35 +
      input.cascadeState.cascadeAmplificationScore * 0.35 +
      input.inflection.inflectionPressureScore * 0.3
  );
  logPreventionDev("PreventionOpportunity", { criticalThresholdProximityScore: score });
  return score;
}

export function calculateResiliencePreservationScore(input: {
  signals: readonly CollapsePreventionSignal[];
  resilienceState: HumanSystemResilienceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): number {
  const preserving = input.signals.filter((s) => s.preventionState !== "critical");
  const score = clamp01(
    (preserving.length / Math.max(1, input.signals.length)) * 0.35 +
      input.resilienceState.enterpriseResilienceScore * 0.35 +
      input.recoveryOpportunityState.stabilizationPotentialScore * 0.3
  );
  logPreventionDev("ResiliencePreservation", { resiliencePreservationScore: score });
  return score;
}

export function identifyStabilizationInterventionZones(
  signals: readonly CollapsePreventionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.preventionState === "intervenable" ||
      signal.preventionState === "stabilizing"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyCriticalCollapseZones(
  signals: readonly CollapsePreventionSignal[],
  cascadeState: PredictiveCascadeState
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.preventionState === "critical" || signal.preventionState === "fragile") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  for (const r of cascadeState.amplificationZones) zones.add(r);
  return Object.freeze([...zones].sort());
}

export function classifyPredictivePreventionLabel(input: {
  collapseInterruptionScore: number;
  criticalThresholdProximityScore: number;
  resiliencePreservationScore: number;
}): PredictiveCollapsePreventionState["predictivePreventionLabel"] {
  if (input.criticalThresholdProximityScore >= 0.7) return "critical";
  if (input.criticalThresholdProximityScore >= 0.55) return "fragile";
  if (
    input.collapseInterruptionScore >= 0.58 &&
    input.resiliencePreservationScore >= 0.5
  ) {
    return "intervenable";
  }
  if (input.collapseInterruptionScore >= 0.5) return "stabilizing";
  return "monitoring";
}
