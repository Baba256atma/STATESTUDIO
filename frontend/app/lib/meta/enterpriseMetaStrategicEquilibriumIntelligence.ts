/**
 * D7:8:7 — Enterprise meta-strategic equilibrium intelligence.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterpriseMetaStrategicEquilibriumRecord,
  LongHorizonEquilibriumRecord,
  StrategicBalanceRecord,
  StrategicIntelligenceEquilibriumSignal,
} from "./strategicIntelligenceEquilibriumTypes.ts";
import { logStrategicIntelligenceEquilibriumDev } from "./strategicIntelligenceEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseMetaStrategicEquilibriumIntelligence(input: {
  equilibriumSignals: readonly StrategicIntelligenceEquilibriumSignal[];
  longHorizonEquilibriumRecords: readonly LongHorizonEquilibriumRecord[];
  strategicBalanceRecords: readonly StrategicBalanceRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseMetaStrategicEquilibriumRecord[] {
  const records: EnterpriseMetaStrategicEquilibriumRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);

  records.push(
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::operations",
      equilibriumDomain: "operations",
      equilibriumStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          input.operationalUniverseState.equilibriumState.equilibriumScore * 0.35
      ),
      explanation:
        "Operations equilibrium may reflect how strategic intelligence balances manufacturing and service continuity under pressure.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::logistics",
      equilibriumDomain: "logistics",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonEquilibriumRecords.find((r) =>
            r.recordId.includes("balance-preservation")
          )?.equilibriumStrength ?? 0.35)
      ),
      explanation:
        "Logistics equilibrium may stabilize flow networks when dependency pressure threatens systemic balance.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::finance",
      equilibriumDomain: "finance",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance equilibrium may track capital allocation balance that sustains strategic intelligence during volatility.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::recovery",
      equilibriumDomain: "recovery",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.longHorizonEquilibriumRecords.find((r) =>
            r.recordId.includes("resilience-balance")
          )?.equilibriumStrength ?? 0.35)
      ),
      explanation:
        "Recovery equilibrium may indicate whether stabilization pathways rebuild balance capacity over time.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::momentum",
      equilibriumDomain: "strategic_momentum",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum equilibrium may show how forward progress persists amid optimization and predictive volatility.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-meta-equilibrium::systemic",
      equilibriumDomain: "systemic_equilibrium",
      equilibriumStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.strategicDriftState.strategicDriftInstabilityScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium may preserve organizational balance as enterprise strategic intelligence evolves without collapse.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceEquilibriumDev("SystemicBalance", {
    enterpriseMetaEquilibriumRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
