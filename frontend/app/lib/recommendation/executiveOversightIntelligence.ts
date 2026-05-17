/**
 * D7:5:6 — Executive oversight intelligence.
 */

import type {
  ExecutiveOversightRecord,
  GovernanceAlignmentRecord,
  RecommendationSafetyRecord,
  StrategicGovernanceSignal,
} from "./strategicGovernanceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveOversight(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  alignmentRecords: readonly GovernanceAlignmentRecord[];
  safetyRecords: readonly RecommendationSafetyRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveOversightRecord[] {
  const records: ExecutiveOversightRecord[] = [];
  const governanceIds = input.governanceSignals.map((g) => g.governanceId);

  const logisticsSafety = input.safetyRecords.find((r) =>
    r.recordId.includes("oversight-sensitive")
  );

  records.push(
    Object.freeze({
      recordId: "oversight::operations",
      oversightDomain: "operations",
      oversightStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational oversight may preserve strategic trust when recommendation behavior aligns with momentum safeguards.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "oversight::logistics",
      oversightDomain: "logistics",
      oversightStrength: clamp01(logisticsSafety?.safetyStrength ?? 0.4),
      explanation:
        "Logistics recovery oversight may be advisable when divergence rises across distribution and warehouse recovery systems.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "oversight::finance",
      oversightDomain: "finance",
      oversightStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial governance oversight may stabilize executive trust when cost-benefit tradeoffs remain within equilibrium bounds.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "oversight::recovery",
      oversightDomain: "recovery",
      oversightStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Recovery-system oversight may protect strategic coherence when adaptive recommendations interact with fragile recovery capacity.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "oversight::strategic-momentum",
      oversightDomain: "strategic_momentum",
      oversightStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.5),
      explanation:
        "Strategic momentum oversight may help executives calibrate recommendation intensity without autonomous governance action.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "oversight::systemic-equilibrium",
      oversightDomain: "systemic_equilibrium",
      oversightStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Systemic equilibrium oversight may preserve operational stability when governance alignment and divergence signals diverge.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  logStrategicGovernanceDev("ExecutiveOversight", { oversightRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
