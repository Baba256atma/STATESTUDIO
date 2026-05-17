/**
 * D7:5:5 — Executive strategic-memory intelligence.
 */

import type {
  ExecutiveStrategicMemoryRecord,
  HistoricalOutcomeRecord,
  StrategicRecommendationMemorySignal,
} from "./recommendationMemoryTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logRecommendationMemoryDev } from "./learningDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveStrategicMemory(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  outcomeRecords: readonly HistoricalOutcomeRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveStrategicMemoryRecord[] {
  const records: ExecutiveStrategicMemoryRecord[] = [];
  const memoryIds = input.memories.map((m) => m.memoryId);

  const opsStrength = clamp01(
    input.momentumState.organizationalMomentumScore * 0.45 +
      input.trajectoryState.trajectoryVolatilityScore * 0.25
  );
  records.push(
    Object.freeze({
      recordId: "exec-memory::operations",
      memoryDomain: "operations",
      memoryInfluenceStrength: opsStrength,
      explanation:
        "Operational memory may improve future recommendation quality when prior stabilization cycles reduced throughput volatility.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    })
  );

  const logisticsOutcome = input.outcomeRecords.find((r) =>
    r.recordId.includes("successful-recovery")
  );
  records.push(
    Object.freeze({
      recordId: "exec-memory::logistics",
      memoryDomain: "logistics",
      memoryInfluenceStrength: clamp01(logisticsOutcome?.outcomeStrength ?? 0.4),
      explanation:
        "Logistics recovery memory may link current conditions to prior stabilization patterns across warehouse and distribution systems.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    })
  );

  records.push(
    Object.freeze({
      recordId: "exec-memory::finance",
      memoryDomain: "finance",
      memoryInfluenceStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial equilibrium memory may inform recommendation emphasis when prior cost-benefit tradeoffs validated under strain.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exec-memory::recovery",
      memoryDomain: "recovery",
      memoryInfluenceStrength: clamp01(
        (logisticsOutcome?.outcomeStrength ?? 0.35) * 0.6 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system memory may accelerate validated intervention timing when historical pathways improved resilience coordination.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exec-memory::strategic-momentum",
      memoryDomain: "strategic_momentum",
      memoryInfluenceStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.5),
      explanation:
        "Strategic momentum memory may reflect how prior recommendations influenced enterprise evolution without autonomous rewriting.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "exec-memory::systemic-equilibrium",
      memoryDomain: "systemic_equilibrium",
      memoryInfluenceStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Systemic equilibrium memory may connect validated coordination patterns to improved future recommendation calibration.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    })
  );

  logRecommendationMemoryDev("StrategicLearning", { executiveMemoryRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
