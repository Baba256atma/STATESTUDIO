/**
 * D7:4:2 — Future branch evolution modeling.
 */

import type { OrganizationalAlignmentDriftState } from "../alignment/alignmentDriftTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  FutureBranchRecord,
  FutureDivergenceSignal,
  FutureDivergenceSignalState,
  MultiFutureDivergenceState,
} from "./multiFutureDivergenceTypes.ts";
import { logDivergenceDev } from "./divergenceDevLog.ts";

const BRANCH_STABILIZATION = "future-branch::stabilization";
const BRANCH_DEGRADATION = "future-branch::degradation";
const BRANCH_VOLATILE_HYBRID = "future-branch::volatile-hybrid";
const BRANCH_RECOVERY = "future-branch::recovery";
const BRANCH_EQUILIBRIUM_DRIFT = "future-branch::equilibrium-drift";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function divergenceStateFromScores(
  convergence: number,
  fragmentation: number,
  volatility: number
): FutureDivergenceSignalState {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmenting";
  if (volatility >= 0.6 && convergence < 0.5) return "volatile_split";
  if (convergence >= 0.58 && fragmentation < 0.45) return "converging";
  return "stable_split";
}

export function deriveFutureBranches(input: {
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  coordinationState?: ExecutiveCoordinationState;
  alignmentState?: OrganizationalAlignmentDriftState;
  pressureState?: EnterprisePressureState;
  trustState?: OrganizationalTrustState;
  branchAmplificationFactor?: number;
}): FutureBranchRecord[] {
  const amplification = clamp01(input.branchAmplificationFactor ?? 0);
  const branches: FutureBranchRecord[] = [];

  const stabilizationRegions = [
    ...new Set([
      ...input.trajectoryState.recoveryTrajectories,
      ...input.trajectoryState.activeTrajectorySignals
        .filter((s) => s.trajectoryState === "stabilizing" || s.trajectoryState === "recovering")
        .flatMap((s) => [...s.affectedRegionIds]),
    ]),
  ].sort();

  const degradationRegions = [
    ...new Set([
      ...input.trajectoryState.degradationTrajectories,
      ...input.trajectoryState.volatilityHotspots,
      ...(input.pressureState?.saturationRegions ?? []),
    ]),
  ].sort();

  const stabilizationStrength = clamp01(
    input.trajectoryState.futureStabilityScore * 0.35 +
      (input.coordinationState?.organizationalSynchronizationScore ?? 0.45) * 0.25 +
      input.momentumState.recoveryMomentumScore * 0.25 +
      input.resilienceState.humanSystemAdaptationLevel * 0.15 -
      amplification * 0.1
  );

  branches.push(
    Object.freeze({
      branchId: BRANCH_STABILIZATION,
      branchLabel: "stabilization",
      affectedRegionIds: Object.freeze(
        stabilizationRegions.length > 0 ? stabilizationRegions : ["logistics"]
      ),
      branchStrength: stabilizationStrength,
      explanation:
        "Strong recovery coordination may support a stabilization future across coordinated operational regions.",
    })
  );

  const degradationStrength = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.3 +
      input.resilienceState.resilienceDegradationScore * 0.25 +
      (input.pressureState?.saturationRegions.length ?? 0) * 0.08 +
      (input.trustState?.trustDegradationScore ?? 0.4) * 0.25 +
      amplification * 0.12
  );

  branches.push(
    Object.freeze({
      branchId: BRANCH_DEGRADATION,
      branchLabel: "degradation",
      affectedRegionIds: Object.freeze(
        degradationRegions.length > 0 ? degradationRegions : ["manufacturing", "logistics"]
      ),
      branchStrength: degradationStrength,
      explanation:
        "Dependency pressure escalation may open a degradation future across saturated operational regions.",
    })
  );

  const hybridStrength = clamp01(
    input.trajectoryState.trajectoryDivergenceScore * 0.35 +
      (input.alignmentState?.alignmentDriftScore ?? 0) * 0.25 +
      input.trajectoryState.trajectoryVolatilityScore * 0.25 +
      (input.trustState?.trustDegradationScore ?? 0.35) * 0.15
  );

  branches.push(
    Object.freeze({
      branchId: BRANCH_VOLATILE_HYBRID,
      branchLabel: "volatile_hybrid",
      affectedRegionIds: Object.freeze(
        [...new Set([...stabilizationRegions, ...degradationRegions])].sort().slice(0, 4)
      ),
      branchStrength: hybridStrength,
      explanation:
        "Partial stabilization combined with trust instability may produce a volatile hybrid future across mixed regions.",
    })
  );

  if (input.momentumState.momentumTrendLabel === "recovering") {
    branches.push(
      Object.freeze({
        branchId: BRANCH_RECOVERY,
        branchLabel: "recovery",
        affectedRegionIds: Object.freeze(input.trajectoryState.recoveryTrajectories),
        branchStrength: clamp01(
          input.momentumState.recoveryMomentumScore * 0.5 +
            input.resilienceState.enterpriseResilienceScore * 0.3
        ),
        explanation:
          "Recovery branching may separate from degradation futures where operational momentum and resilience align.",
      })
    );
  }

  if (
    input.equilibriumState.equilibriumLabel === "critical_imbalance" ||
    input.equilibriumState.driftRecords.some((r) => r.driftDirection === "erosion")
  ) {
    branches.push(
      Object.freeze({
        branchId: BRANCH_EQUILIBRIUM_DRIFT,
        branchLabel: "equilibrium_drift",
        affectedRegionIds: Object.freeze(
          [...input.equilibriumState.imbalanceZones].sort().slice(0, 4)
        ),
        branchStrength: clamp01(input.equilibriumState.instabilityDriftScore * 0.65 + 0.2),
        explanation:
          "Systemic equilibrium drift may widen separation between stabilization and degradation futures.",
      })
    );
  }

  logDivergenceDev("FutureBranch", { branchCount: branches.length });
  return branches.sort((a, b) => a.branchId.localeCompare(b.branchId));
}

export function deriveFutureDivergenceSignals(input: {
  branches: readonly FutureBranchRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  resilienceState: HumanSystemResilienceState;
  fragmentationStressFactor?: number;
}): FutureDivergenceSignal[] {
  const signals: FutureDivergenceSignal[] = [];
  const stress = clamp01(input.fragmentationStressFactor ?? 0);

  const stabilization = input.branches.find((b) => b.branchId === BRANCH_STABILIZATION);
  const degradation = input.branches.find((b) => b.branchId === BRANCH_DEGRADATION);
  const hybrid = input.branches.find((b) => b.branchId === BRANCH_VOLATILE_HYBRID);

  if (stabilization && degradation) {
    const convergence = clamp01(
      stabilization.branchStrength * 0.4 + (1 - degradation.branchStrength) * 0.3
    );
    const fragmentation = clamp01(
      degradation.branchStrength * 0.4 +
        input.trajectoryState.trajectoryDivergenceScore * 0.3 +
        stress * 0.2
    );
    const volatility = clamp01(
      (hybrid?.branchStrength ?? 0) * 0.5 + input.trajectoryState.trajectoryVolatilityScore * 0.4
    );

    const drivers: string[] = [];
    if (stabilization.branchStrength > degradation.branchStrength) {
      drivers.push("recovery_coordination");
    } else {
      drivers.push("dependency_pressure");
    }
    if (input.trajectoryState.trajectoryDivergenceScore > 0.4) {
      drivers.push("uneven_recovery");
    }
    if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
      drivers.push("instability_fragmentation");
    }

    signals.push(
      Object.freeze({
        signalId: "divergence::stabilization-degradation-split",
        futureBranchIds: Object.freeze([BRANCH_STABILIZATION, BRANCH_DEGRADATION].sort()),
        divergenceState: divergenceStateFromScores(convergence, fragmentation, volatility),
        divergenceIntensity: clamp01(
          Math.abs(stabilization.branchStrength - degradation.branchStrength) * 0.5 + 0.35
        ),
        dominantDivergenceDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel:
          "Operational futures may diverge between stabilization and degradation paths under current conditions",
      })
    );
  }

  if (hybrid && hybrid.branchStrength >= 0.45) {
    signals.push(
      Object.freeze({
        signalId: "divergence::volatile-hybrid-expansion",
        futureBranchIds: Object.freeze(
          [BRANCH_VOLATILE_HYBRID, BRANCH_STABILIZATION, BRANCH_DEGRADATION].sort()
        ),
        divergenceState: "volatile_split",
        divergenceIntensity: clamp01(hybrid.branchStrength * 0.55 + 0.3),
        dominantDivergenceDrivers: Object.freeze([
          "partial_stabilization",
          "trust_instability",
          "alignment_drift",
        ]),
        executiveLabel:
          "A volatile hybrid future may emerge where stabilization and degradation futures coexist unevenly",
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel === "recovering" &&
    input.resilienceState.resilienceStabilityLabel === "strained"
  ) {
    signals.push(
      Object.freeze({
        signalId: "divergence::recovery-resilience-tension",
        futureBranchIds: Object.freeze([BRANCH_RECOVERY, BRANCH_DEGRADATION].sort()),
        divergenceState: "stable_split",
        divergenceIntensity: clamp01(0.5 + input.trajectoryState.trajectoryDivergenceScore * 0.25),
        dominantDivergenceDrivers: Object.freeze([
          "recovery_branching",
          "resilience_fragmentation",
        ]),
        executiveLabel:
          "Recovery futures may separate from degradation futures while human-system resilience remains strained",
      })
    );
  }

  logDivergenceDev("FutureDivergence", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateFutureVolatilityScore(input: {
  trajectoryState: PredictiveTrajectoryState;
  branches: readonly FutureBranchRecord[];
  fragmentationStressFactor?: number;
}): number {
  const hybrid = input.branches.find((b) => b.branchId === BRANCH_VOLATILE_HYBRID);
  const score = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.4 +
      (hybrid?.branchStrength ?? 0) * 0.35 +
      (input.fragmentationStressFactor ?? 0) * 0.15 +
      input.trajectoryState.trajectoryDivergenceScore * 0.1
  );
  logDivergenceDev("FutureFragmentation", { futureVolatilityScore: score });
  return score;
}

export function calculateFutureFragmentationScore(input: {
  branches: readonly FutureBranchRecord[];
  trajectoryState: PredictiveTrajectoryState;
}): number {
  const degradation = input.branches.find((b) => b.branchId === BRANCH_DEGRADATION);
  const stabilization = input.branches.find((b) => b.branchId === BRANCH_STABILIZATION);
  const spread = Math.abs(
    (degradation?.branchStrength ?? 0) - (stabilization?.branchStrength ?? 0)
  );
  const score = clamp01(
    spread * 0.35 +
      input.trajectoryState.trajectoryDivergenceScore * 0.35 +
      input.trajectoryState.degradationTrajectories.length * 0.08
  );
  logDivergenceDev("FutureFragmentation", { futureFragmentationScore: score });
  return score;
}

export function calculateFutureConvergenceScore(input: {
  branches: readonly FutureBranchRecord[];
  signals: readonly FutureDivergenceSignal[];
}): number {
  const convergingSignals = input.signals.filter((s) => s.divergenceState === "converging");
  const stabilization = input.branches.find((b) => b.branchId === BRANCH_STABILIZATION);
  const score = clamp01(
    (stabilization?.branchStrength ?? 0) * 0.45 +
      convergingSignals.length * 0.1 +
      (1 - Math.min(1, input.signals.filter((s) => s.divergenceState === "fragmenting").length * 0.2)) *
        0.25
  );
  logDivergenceDev("Convergence", { futureConvergenceScore: score });
  return score;
}

export function identifyConvergingFutureZones(
  branches: readonly FutureBranchRecord[]
): readonly string[] {
  const stabilization = branches.find((b) => b.branchId === BRANCH_STABILIZATION);
  if (!stabilization || stabilization.branchStrength < 0.5) return Object.freeze([]);
  return Object.freeze([...stabilization.affectedRegionIds].sort());
}

export function identifyFragmentedFutureZones(
  branches: readonly FutureBranchRecord[],
  trajectoryState: PredictiveTrajectoryState
): readonly string[] {
  const zones = new Set<string>();
  const degradation = branches.find((b) => b.branchId === BRANCH_DEGRADATION);
  if (degradation && degradation.branchStrength >= 0.45) {
    for (const r of degradation.affectedRegionIds) zones.add(r);
  }
  for (const r of trajectoryState.volatilityHotspots) zones.add(r);
  return Object.freeze([...zones].sort());
}

export function identifyStabilizationFutureBranches(
  branches: readonly FutureBranchRecord[]
): readonly string[] {
  return Object.freeze(
    branches
      .filter((b) => b.branchLabel === "stabilization" || b.branchLabel === "recovery")
      .map((b) => b.branchId)
      .sort()
  );
}

export function identifyDegradationFutureBranches(
  branches: readonly FutureBranchRecord[]
): readonly string[] {
  return Object.freeze(
    branches
      .filter((b) => b.branchLabel === "degradation" || b.branchLabel === "equilibrium_drift")
      .map((b) => b.branchId)
      .sort()
  );
}

export function classifyMultiFutureDivergenceLabel(input: {
  futureConvergenceScore: number;
  futureFragmentationScore: number;
  futureVolatilityScore: number;
}): MultiFutureDivergenceState["multiFutureDivergenceLabel"] {
  if (input.futureFragmentationScore >= 0.7 || input.futureVolatilityScore >= 0.72) {
    return "critical";
  }
  if (input.futureFragmentationScore >= 0.55) return "fragmenting";
  if (input.futureVolatilityScore >= 0.55) return "volatile_split";
  if (input.futureConvergenceScore >= 0.58 && input.futureFragmentationScore < 0.45) {
    return "converging";
  }
  return "stable_split";
}

export const CANONICAL_FUTURE_BRANCH_IDS = {
  stabilization: BRANCH_STABILIZATION,
  degradation: BRANCH_DEGRADATION,
  volatileHybrid: BRANCH_VOLATILE_HYBRID,
  recovery: BRANCH_RECOVERY,
  equilibriumDrift: BRANCH_EQUILIBRIUM_DRIFT,
} as const;
