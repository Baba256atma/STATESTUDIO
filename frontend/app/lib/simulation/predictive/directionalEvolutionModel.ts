/**
 * D7:4:1 — Directional future evolution modeling.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  FutureTrajectorySignal,
  FutureTrajectorySignalState,
  PredictiveTrajectoryState,
} from "./futureTrajectoryTypes.ts";
import { logTrajectoryDev } from "./trajectoryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function trajectoryStateFromScores(
  stabilization: number,
  degradation: number,
  volatility: number
): FutureTrajectorySignalState {
  if (degradation >= 0.72) return "critical";
  if (degradation >= 0.58) return "degrading";
  if (volatility >= 0.6 && stabilization < 0.55) return "volatile";
  if (stabilization >= 0.58 && degradation < 0.45) return "stabilizing";
  if (stabilization >= 0.5 && degradation < 0.55) return "recovering";
  return "volatile";
}

export function deriveFutureTrajectorySignals(input: {
  topology: OperationalUniverseTopology;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  recoveryState?: OrganizationalRecoveryState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  pressureState?: EnterprisePressureState;
  instabilityAccelerationFactor?: number;
  horizonStressFactor?: number;
}): FutureTrajectorySignal[] {
  const signals: FutureTrajectorySignal[] = [];
  const acceleration = clamp01(input.instabilityAccelerationFactor ?? 0);
  const horizonStress = clamp01(input.horizonStressFactor ?? 0);

  for (const region of input.topology.operationalRegions) {
    const regionPressure = input.pressureState?.regionAccumulations.find(
      (r) => r.regionId === region.regionId
    );
    const inResilienceFragility = input.resilienceState.resilienceFragilityZones.includes(
      region.regionId
    );
    const inAlignmentDrift = input.alignmentState?.alignmentDriftZones.includes(region.regionId);

    const stabilizationBase = clamp01(
      input.momentumState.organizationalMomentumScore * 0.2 +
        input.equilibriumState.equilibriumScore * 0.2 +
        input.resilienceState.enterpriseResilienceScore * 0.2 +
        (input.recoveryState?.stabilizationPotential ?? 0.5) * 0.2 +
        (input.coordinationState?.organizationalSynchronizationScore ?? 0.5) * 0.1 -
        horizonStress * 0.1
    );
    const degradationBase = clamp01(
      input.resilienceState.resilienceDegradationScore * 0.25 +
        (input.alignmentState?.alignmentDriftScore ?? 0) * 0.2 +
        (regionPressure?.accumulatedPressure ?? 0.4) * 0.2 +
        (inResilienceFragility ? 0.15 : 0) +
        acceleration * 0.1
    );
    const volatilityBase = clamp01(
      input.momentumState.organizationalInertiaScore * 0.35 +
        input.equilibriumState.instabilityDriftScore * 0.35 +
        (inAlignmentDrift ? 0.15 : 0) +
        horizonStress * 0.15
    );

    const drivers: string[] = [];
    if (input.momentumState.momentumTrendLabel === "recovering") drivers.push("momentum_recovery");
    if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
      drivers.push("momentum_degradation");
    }
    if (input.resilienceState.resilienceStabilityLabel === "adaptive") {
      drivers.push("resilience_strengthening");
    }
    if (inResilienceFragility) drivers.push("fragility_concentration");
    if (inAlignmentDrift) drivers.push("alignment_drift");
    if (
      input.equilibriumState.equilibriumLabel === "critical_imbalance" ||
      input.equilibriumState.driftRecords.some((r) => r.driftDirection === "erosion")
    ) {
      drivers.push("equilibrium_erosion");
    }

    const trajectoryState = trajectoryStateFromScores(
      stabilizationBase,
      degradationBase,
      volatilityBase
    );
    const directionalConfidence = clamp01(
      Math.abs(stabilizationBase - degradationBase) * 0.5 + 0.35 - volatilityBase * 0.15
    );

    signals.push(
      Object.freeze({
        signalId: `trajectory::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        trajectoryState,
        directionalConfidence,
        dominantTrajectoryDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Directional movement in ${region.label} may trend toward ${trajectoryState} conditions`,
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel === "recovering" &&
    input.resilienceState.resilienceStabilityLabel !== "fragile"
  ) {
    signals.push(
      Object.freeze({
        signalId: "trajectory::stabilization-strengthening",
        affectedRegionIds: Object.freeze(
          [...input.resilienceState.adaptiveRecoveryZones].sort().slice(0, 4)
        ),
        trajectoryState: "stabilizing",
        directionalConfidence: clamp01(
          input.momentumState.organizationalMomentumScore * 0.45 +
            input.resilienceState.humanSystemAdaptationLevel * 0.35
        ),
        dominantTrajectoryDrivers: Object.freeze([
          "momentum_recovery",
          "resilience_strengthening",
        ]),
        executiveLabel:
          "Sustained recovery momentum may strengthen stabilization trajectories across coordinated regions",
      })
    );
  }

  if (
    regionHasManufacturingFragility(input) &&
    input.alignmentState &&
    input.alignmentState.alignmentDriftScore > 0.45
  ) {
    signals.push(
      Object.freeze({
        signalId: "trajectory::manufacturing-volatility",
        affectedRegionIds: Object.freeze(["manufacturing", "logistics"].sort()),
        trajectoryState: "volatile",
        directionalConfidence: clamp01(
          0.55 + input.alignmentState.alignmentDriftScore * 0.25
        ),
        dominantTrajectoryDrivers: Object.freeze([
          "fragility_concentration",
          "trust_degradation",
          "alignment_drift",
        ]),
        executiveLabel:
          "Manufacturing fragility may increase future volatility risk despite partial operational recovery movement",
      })
    );
  }

  logTrajectoryDev("Trajectory", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

function regionHasManufacturingFragility(input: {
  resilienceState: HumanSystemResilienceState;
  alignmentState?: OrganizationalAlignmentDriftState;
}): boolean {
  return (
    input.resilienceState.resilienceFragilityZones.includes("manufacturing") ||
    input.alignmentState?.alignmentDriftZones.includes("manufacturing") === true
  );
}

export function calculateFutureStabilityScore(input: {
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  signals: readonly FutureTrajectorySignal[];
}): number {
  const stableRatio =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter(
          (s) => s.trajectoryState === "stabilizing" || s.trajectoryState === "recovering"
        ).length / input.signals.length;

  const score = clamp01(
    input.momentumState.organizationalMomentumScore * 0.25 +
      input.equilibriumState.equilibriumScore * 0.25 +
      input.resilienceState.enterpriseResilienceScore * 0.25 +
      stableRatio * 0.25
  );

  logTrajectoryDev("PredictiveFuture", { futureStabilityScore: score });
  return score;
}

export function calculateTrajectoryVolatilityScore(input: {
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  signals: readonly FutureTrajectorySignal[];
  horizonStressFactor?: number;
}): number {
  const volatileRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter(
          (s) => s.trajectoryState === "volatile" || s.trajectoryState === "critical"
        ).length / input.signals.length;

  const score = clamp01(
    volatileRatio * 0.35 +
      input.momentumState.organizationalInertiaScore * 0.3 +
      input.equilibriumState.instabilityDriftScore * 0.25 +
      (input.horizonStressFactor ?? 0) * 0.1
  );

  logTrajectoryDev("FutureVolatility", { trajectoryVolatilityScore: score });
  return score;
}

export function calculateTrajectoryDivergenceScore(input: {
  signals: readonly FutureTrajectorySignal[];
  momentumState: EnterpriseMomentumState;
  resilienceState: HumanSystemResilienceState;
}): number {
  const momentumRecovering = input.momentumState.momentumTrendLabel === "recovering";
  const resilienceFragile =
    input.resilienceState.resilienceStabilityLabel === "fragile" ||
    input.resilienceState.resilienceStabilityLabel === "strained";

  let divergence = 0;
  if (momentumRecovering && resilienceFragile) divergence += 0.35;

  const mixedSignals =
    input.signals.filter((s) => s.trajectoryState === "recovering").length > 0 &&
    input.signals.filter((s) => s.trajectoryState === "degrading" || s.trajectoryState === "critical")
      .length > 0;
  if (mixedSignals) divergence += 0.25;

  const score = clamp01(divergence + (mixedSignals ? 0.2 : 0));

  logTrajectoryDev("TrajectoryDrift", { trajectoryDivergenceScore: score });
  return score;
}

export function identifyPredictiveDegradationTrajectories(
  signals: readonly FutureTrajectorySignal[]
): readonly string[] {
  const regions = new Set<string>();
  for (const signal of signals) {
    if (signal.trajectoryState === "degrading" || signal.trajectoryState === "critical") {
      for (const r of signal.affectedRegionIds) regions.add(r);
    }
  }
  return Object.freeze([...regions].sort());
}

export function identifyPredictiveRecoveryTrajectories(
  signals: readonly FutureTrajectorySignal[]
): readonly string[] {
  const regions = new Set<string>();
  for (const signal of signals) {
    if (signal.trajectoryState === "stabilizing" || signal.trajectoryState === "recovering") {
      for (const r of signal.affectedRegionIds) regions.add(r);
    }
  }
  return Object.freeze([...regions].sort());
}

export function identifyPredictiveVolatilityHotspots(
  signals: readonly FutureTrajectorySignal[]
): readonly string[] {
  const hotspots = new Set<string>();
  for (const signal of signals) {
    if (signal.trajectoryState === "volatile" || signal.trajectoryState === "critical") {
      for (const r of signal.affectedRegionIds) hotspots.add(r);
    }
  }
  return Object.freeze([...hotspots].sort());
}

export function classifyPredictiveTrajectoryLabel(input: {
  futureStabilityScore: number;
  trajectoryVolatilityScore: number;
  trajectoryDivergenceScore: number;
}): PredictiveTrajectoryState["predictiveTrajectoryLabel"] {
  if (
    input.futureStabilityScore >= 0.58 &&
    input.trajectoryVolatilityScore < 0.45 &&
    input.trajectoryDivergenceScore < 0.45
  ) {
    return "stabilizing";
  }
  if (input.trajectoryVolatilityScore >= 0.7 || input.trajectoryDivergenceScore >= 0.65) {
    return "critical";
  }
  if (input.trajectoryVolatilityScore >= 0.55) {
    return "volatile";
  }
  if (
    input.futureStabilityScore >= 0.5 &&
    input.trajectoryVolatilityScore < 0.55
  ) {
    return "recovering";
  }
  return "degrading";
}
