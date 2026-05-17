/**
 * D7:5:10 — Unified executive cognition intelligence.
 */

import type {
  CrossIntelligenceSynchronizationRecord,
  OrchestrationStabilityRecord,
  UnifiedExecutiveCognitionRecord,
  UnifiedExecutiveOrchestrationSignal,
} from "./unifiedExecutiveOrchestrationTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeUnifiedExecutiveCognition(input: {
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  synchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
  stabilityRecords: readonly OrchestrationStabilityRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly UnifiedExecutiveCognitionRecord[] {
  const records: UnifiedExecutiveCognitionRecord[] = [];
  const orchestrationIds = input.orchestrationSignals.map((o) => o.orchestrationId);

  const resilienceSync = input.synchronizationRecords.find((r) =>
    r.recordId.includes("resilience-harmonization")
  );
  const cognitionStability = input.synchronizationRecords.find((r) =>
    r.recordId.includes("executive-cognition")
  );

  records.push(
    Object.freeze({
      recordId: "cognition::operations",
      cognitionDomain: "operations",
      cognitionStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational cognition may unify when orchestration layers synchronize fragility, recovery, and momentum intelligence across enterprise systems.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition::logistics",
      cognitionDomain: "logistics",
      cognitionStrength: clamp01(resilienceSync?.synchronizationStrength ?? 0.4),
      explanation:
        "Logistics cognition may benefit from harmonized recovery and advisory signals across distribution and dependency networks.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition::finance",
      cognitionDomain: "finance",
      cognitionStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial cognition may stabilize when tradeoff, governance, and equilibrium intelligence remain aligned without autonomous execution.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition::recovery",
      cognitionDomain: "recovery",
      cognitionStrength: clamp01(
        (resilienceSync?.synchronizationStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system cognition may accelerate when unified orchestration supports coordinated stabilization before restructuring intensifies.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition::strategic-momentum",
      cognitionDomain: "strategic_momentum",
      cognitionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (cognitionStability?.synchronizationStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Strategic momentum cognition may reflect how synchronized intelligence layers shape enterprise evolution under executive control.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition::systemic-equilibrium",
      cognitionDomain: "systemic_equilibrium",
      cognitionStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - (input.stabilityRecords[0]?.instabilityStrength ?? 0)) * 0.2
      ),
      explanation:
        "Systemic equilibrium cognition may preserve resilience when orchestration instability remains contained within governance bounds.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
    })
  );

  logUnifiedExecutiveOrchestrationDev("ExecutiveCognition", {
    cognitionRecordCount: records.length,
    stabilityRecordCount: input.stabilityRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
