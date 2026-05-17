/**
 * D7:8:7 — Long-horizon strategic intelligence equilibrium modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicMetaCausalityIntelligenceState } from "./strategicMetaCausalityTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  LongHorizonEquilibriumRecord,
  StrategicIntelligenceEquilibriumSignal,
  StrategicIntelligenceEquilibriumStateLabel,
} from "./strategicIntelligenceEquilibriumTypes.ts";
import { logStrategicIntelligenceEquilibriumDev } from "./strategicIntelligenceEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function equilibriumStateFromProfile(
  coherence: number,
  balance: number,
  pressure: number
): StrategicIntelligenceEquilibriumStateLabel {
  if (pressure >= 0.72) return "critical";
  if (pressure >= 0.58) return "destabilizing";
  if (balance >= 0.55 && coherence >= 0.5) return "stabilizing";
  if (balance >= 0.5 && pressure < 0.45) return "strained";
  if (coherence >= 0.55 && pressure < 0.4) return "balanced";
  return pressure > coherence ? "destabilizing" : "strained";
}

export function deriveStrategicIntelligenceEquilibriumSignals(input: {
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  equilibriumLeverageFactor?: number;
  balanceStressFactor?: number;
}): StrategicIntelligenceEquilibriumSignal[] {
  const leverage = clamp01(input.equilibriumLeverageFactor ?? 0);
  const stress = clamp01(input.balanceStressFactor ?? 0);
  const signals: StrategicIntelligenceEquilibriumSignal[] = [];

  const zoneSets = [
    input.strategicEvolutionState.adaptiveEvolutionZones,
    input.strategicResilienceState.adaptiveRecoveryZones,
    input.strategicDriftState.emergingDriftZones,
    input.metaCausalityState.strategicForceZones,
    input.strategicPatternState.adaptivePatternZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.strategicEvolutionState.strategicEvolutionCoherenceScore * 0.25 +
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.25 +
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
        leverage * 0.08
    );
    const balance = clamp01(
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.35 +
        input.strategicEvolutionState.adaptiveTransformationScore * 0.25 +
        (1 - input.strategicResilienceState.recoveryPressureScore) * 0.2 +
        leverage * 0.08
    );
    const pressure = clamp01(
      input.strategicEvolutionState.transformationPressureScore * 0.3 +
        input.strategicResilienceState.recoveryPressureScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.1
    );

    const equilibriumState = equilibriumStateFromProfile(coherence, balance, pressure);
    const equilibriumStrength = clamp01(
      coherence * 0.35 + balance * 0.35 + (1 - pressure) * 0.25
    );

    const drivers: string[] = [];
    if (equilibriumState === "balanced") drivers.push("equilibrium_balanced", "coherence_preserved");
    if (equilibriumState === "stabilizing") drivers.push("stabilizing_balance", "recovery_coordination");
    if (equilibriumState === "strained") drivers.push("balance_strain", "pressure_tolerance");
    if (equilibriumState === "destabilizing") drivers.push("destabilization_risk", "imbalance_tension");
    if (equilibriumState === "critical") drivers.push("critical_imbalance", "collapse_risk");

    signals.push(
      Object.freeze({
        equilibriumId: `equilibrium::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        equilibriumState,
        equilibriumStrength,
        dominantEquilibriumDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["equilibrium_assessment"]
        ),
        executiveLabel:
          equilibriumState === "balanced" || equilibriumState === "stabilizing"
            ? "Strategic intelligence may preserve systemic balance across evolving enterprise realities"
            : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        equilibriumId: "equilibrium::fallback-balance",
        affectedRegionIds: Object.freeze(fallback),
        equilibriumState: "strained",
        equilibriumStrength: clamp01(
          input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 + leverage * 0.2
        ),
        dominantEquilibriumDrivers: Object.freeze(["baseline_equilibrium_assessment"]),
        executiveLabel:
          "Baseline strategic intelligence equilibrium assessment may apply across enterprise cognition systems",
      })
    );
  }

  logStrategicIntelligenceEquilibriumDev("StrategicEquilibrium", {
    equilibriumSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.equilibriumId.localeCompare(b.equilibriumId));
}

export function analyzeLongHorizonEquilibrium(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaCausalityState: StrategicMetaCausalityIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly LongHorizonEquilibriumRecord[] {
  const records: LongHorizonEquilibriumRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);
  const regions =
    input.equilibriumSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.equilibriumSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "equilibrium::balance-preservation",
      equilibriumType: "strategic_balance_preservation",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.strategicEvolutionState.strategicEvolutionCoherenceScore * 0.35
      ),
      explanation:
        "Strategic balance preservation may sustain enterprise intelligence coherence across disruption and transformation.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "equilibrium::governance-stability",
      equilibriumType: "governance_equilibrium_stability",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaCausalityState.metaCausalityCoherenceScore * 0.35
      ),
      explanation:
        "Governance equilibrium stability may anchor decision systems when predictive volatility and optimization pressure rise.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "equilibrium::resilience-balance",
      equilibriumType: "resilience_balance_capacity",
      equilibriumStrength: clamp01(
        input.strategicResilienceState.strategicResilienceCapacityScore * 0.45 +
          input.strategicResilienceState.adaptiveRecoveryScore * 0.35
      ),
      explanation:
        "Resilience balance capacity may mediate recovery pressure without destabilizing long-horizon strategic coherence.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "equilibrium::predictive-coherence",
      equilibriumType: "predictive_equilibrium_coherence",
      equilibriumStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.45 +
          (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.35
      ),
      explanation:
        "Predictive equilibrium coherence may align foresight with operational adaptation across evolving realities.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "equilibrium::evolutionary-balance",
      equilibriumType: "evolutionary_balance_structures",
      equilibriumStrength: clamp01(
        input.strategicEvolutionState.adaptiveTransformationScore * 0.45 +
          input.metaStrategicState.strategicEvolutionScore * 0.35
      ),
      explanation:
        "Evolutionary balance structures may harmonize transformation pathways with resilience preservation.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "equilibrium::systemic-long-horizon",
      equilibriumType: "long_horizon_systemic_equilibrium",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.2
      ),
      explanation:
        "Long-horizon systemic equilibrium may preserve organizational balance as intelligence evolves without fragmentation collapse.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicIntelligenceEquilibriumDev("LongHorizonEquilibrium", {
    longHorizonEquilibriumRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicEquilibriumCoherenceScore(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  longHorizonEquilibriumRecords: readonly LongHorizonEquilibriumRecord[];
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): number {
  if (input.equilibriumSignals.length === 0) return 0;
  const signalAvg =
    input.equilibriumSignals.reduce((s, sig) => s + sig.equilibriumStrength, 0) /
    input.equilibriumSignals.length;
  const recordAvg =
    input.longHorizonEquilibriumRecords.length === 0
      ? 0
      : input.longHorizonEquilibriumRecords.reduce((s, r) => s + r.equilibriumStrength, 0) /
        input.longHorizonEquilibriumRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
      input.strategicEvolutionState.strategicEvolutionCoherenceScore * 0.05
  );
}

export function calculateSystemicBalanceScore(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  longHorizonEquilibriumRecords: readonly LongHorizonEquilibriumRecord[];
  operationalUniverseState: OperationalUniverseState;
}): number {
  if (input.equilibriumSignals.length === 0) return 0;
  const balanced = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "balanced" || s.equilibriumState === "stabilizing"
  ).length;
  const balanceRecord = input.longHorizonEquilibriumRecords.find((r) =>
    r.recordId.includes("balance-preservation")
  );
  return clamp01(
    (balanced / Math.max(1, input.equilibriumSignals.length)) * 0.4 +
      (balanceRecord?.equilibriumStrength ?? 0) * 0.35 +
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2
  );
}

export function identifyBalancedEquilibriumZones(
  signals: readonly StrategicIntelligenceEquilibriumSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.equilibriumState === "balanced" || signal.equilibriumState === "stabilizing") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyDestabilizingEquilibriumZones(
  signals: readonly StrategicIntelligenceEquilibriumSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.equilibriumState === "destabilizing" || signal.equilibriumState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveEquilibriumLabel(input: {
  strategicEquilibriumCoherenceScore: number;
  systemicBalanceScore: number;
  equilibriumPressureScore: number;
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
}): StrategicIntelligenceEquilibriumStateLabel {
  const critical = input.equilibriumSignals.filter((s) => s.equilibriumState === "critical").length;
  if (critical > 0 || input.equilibriumPressureScore >= 0.68) return "critical";
  const destabilizing = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "destabilizing"
  ).length;
  if (destabilizing > 0 || input.equilibriumPressureScore >= 0.55) return "destabilizing";
  const stabilizing = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "stabilizing"
  ).length;
  if (stabilizing > 0 && input.systemicBalanceScore >= 0.5) return "stabilizing";
  if (input.strategicEquilibriumCoherenceScore >= 0.5 && input.equilibriumPressureScore < 0.45) {
    return "balanced";
  }
  return input.equilibriumPressureScore > input.strategicEquilibriumCoherenceScore
    ? "destabilizing"
    : "strained";
}
