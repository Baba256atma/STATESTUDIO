/**
 * D7:5:8 — Executive advisory domain intelligence.
 */

import type {
  ExecutiveAdvisoryDomainRecord,
  ExecutiveGuidanceSynthesisRecord,
  StrategicContextRecord,
  ExecutiveStrategicAdvisorySignal,
} from "./executiveStrategicAdvisoryTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveAdvisoryIntelligence(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  synthesisRecords: readonly ExecutiveGuidanceSynthesisRecord[];
  contextRecords: readonly StrategicContextRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveAdvisoryDomainRecord[] {
  const records: ExecutiveAdvisoryDomainRecord[] = [];
  const advisoryIds = input.advisories.map((a) => a.advisoryId);

  const stabilizationGuidance = input.synthesisRecords.find((r) =>
    r.recordId.includes("stabilization-priority")
  );

  records.push(
    Object.freeze({
      recordId: "advisory-domain::operations",
      advisoryDomain: "operations",
      advisoryStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational advisory may support strategic stability when guidance aligns momentum signals with recovery priorities.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "advisory-domain::logistics",
      advisoryDomain: "logistics",
      advisoryStrength: clamp01(stabilizationGuidance?.synthesisStrength ?? 0.45),
      explanation:
        "Logistics advisory may suggest prioritizing dependency reduction across recovery systems before manufacturing expansion accelerates.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "advisory-domain::finance",
      advisoryDomain: "finance",
      advisoryStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial advisory may contextualize tradeoff balance and equilibrium constraints within executive guidance framing.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "advisory-domain::recovery",
      advisoryDomain: "recovery",
      advisoryStrength: clamp01(
        (stabilizationGuidance?.synthesisStrength ?? 0.4) * 0.6 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system advisory may emphasize cross-domain coordination when fragility and volatility remain elevated.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "advisory-domain::strategic-momentum",
      advisoryDomain: "strategic_momentum",
      advisoryStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.5),
      explanation:
        "Strategic momentum advisory may frame phased initiatives to reduce coordination volatility during pathway transitions.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "advisory-domain::systemic-equilibrium",
      advisoryDomain: "systemic_equilibrium",
      advisoryStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Systemic equilibrium advisory may help executives balance stabilization and restructuring across competing operational futures.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    })
  );

  logExecutiveStrategicAdvisoryDev("AdvisoryPriority", {
    domainRecordCount: records.length,
    contextCount: input.contextRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
