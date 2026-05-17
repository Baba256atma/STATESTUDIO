/**
 * D7:8:7 — Strategic balance analysis for intelligence equilibrium.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type {
  LongHorizonEquilibriumRecord,
  StrategicBalanceRecord,
  StrategicIntelligenceEquilibriumSignal,
} from "./strategicIntelligenceEquilibriumTypes.ts";
import { logStrategicIntelligenceEquilibriumDev } from "./strategicIntelligenceEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicBalance(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  longHorizonEquilibriumRecords: readonly LongHorizonEquilibriumRecord[];
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicBalanceRecord[] {
  const records: StrategicBalanceRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);
  const unstableSignals = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "destabilizing" || s.equilibriumState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "balance::equilibrium-degradation",
      balanceType: "equilibrium_degradation",
      balanceStrength: clamp01(
        unstableSignals / Math.max(1, input.equilibriumSignals.length) * 0.5 +
          input.strategicEvolutionState.transformationPressureScore * 0.35
      ),
      explanation:
        "Equilibrium degradation may signal declining capacity to balance optimization pressure with long-horizon coherence.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "balance::balance-fatigue",
      balanceType: "balance_fatigue",
      balanceStrength: clamp01(
        input.strategicResilienceState.recoveryPressureScore * 0.45 +
          input.strategicEvolutionState.transformationPressureScore * 0.35
      ),
      explanation:
        "Balance fatigue may emerge when repeated pressure cycles exhaust stabilization without restoration.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "balance::governance-instability",
      balanceType: "governance_equilibrium_instability",
      balanceStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.metaStrategicState.metaInstabilityScore * 0.3
      ),
      explanation:
        "Governance equilibrium instability may weaken balance when predictive volatility rises.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "balance::systemic-imbalance",
      balanceType: "systemic_imbalance_risk",
      balanceStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicDriftState.strategicDriftInstabilityScore * 0.35
      ),
      explanation:
        "Systemic imbalance risk may elevate when evolution and resilience pressures diverge across domains.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "balance::destabilization-risk",
      balanceType: "strategic_destabilization_risk",
      balanceStrength: clamp01(
        input.strategicDriftState.longHorizonDriftScore * 0.4 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Optimization-driven fragility with leadership overload may signal strategic destabilization risk.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "balance::equilibrium-fragmentation",
      balanceType: "long_horizon_equilibrium_fragmentation",
      balanceStrength: clamp01(
        input.strategicPatternState.patternInstabilityScore * 0.4 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Long-horizon equilibrium fragmentation may appear when balance pathways diverge without shared coherence.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceEquilibriumDev("MetaBalance", {
    balanceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateEquilibriumPressureScore(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  strategicBalanceRecords: readonly StrategicBalanceRecord[];
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  const unstableSignals = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "destabilizing" || s.equilibriumState === "critical"
  ).length;
  const balancePressure =
    input.strategicBalanceRecords.length === 0
      ? 0
      : input.strategicBalanceRecords.reduce((s, r) => s + r.balanceStrength, 0) /
        input.strategicBalanceRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.equilibriumSignals.length)) * 0.35 +
      balancePressure * 0.35 +
      input.strategicEvolutionState.transformationPressureScore * 0.15 +
      input.strategicResilienceState.recoveryPressureScore * 0.1
  );
}
