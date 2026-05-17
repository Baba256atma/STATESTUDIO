/**
 * D7:6:4 — Executive insight intelligence (prioritization).
 */

import type {
  ExecutiveInsightPrioritySignal,
  ExecutiveInsightRecord,
  InsightUrgencyRecord,
  StrategicValueRecord,
} from "./executiveInsightPrioritizationTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveInsightPrioritizationDev } from "./insightPrioritizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveInsightIntelligence(input: {
  insightSignals: readonly ExecutiveInsightPrioritySignal[];
  valueRecords: readonly StrategicValueRecord[];
  urgencyRecords: readonly InsightUrgencyRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveInsightRecord[] {
  const records: ExecutiveInsightRecord[] = [];
  const insightIds = input.insightSignals.map((s) => s.insightId);

  const recoveryValue = input.valueRecords.find((r) =>
    r.recordId.includes("recovery-opportunity")
  );
  const predictiveValue = input.valueRecords.find((r) =>
    r.recordId.includes("predictive-urgency")
  );
  const resilienceOpportunity = input.urgencyRecords.find((r) =>
    r.recordId.includes("resilience-opportunity")
  );

  records.push(
    Object.freeze({
      recordId: "insight::operations",
      insightDomain: "operations",
      insightStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (recoveryValue?.valueStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational insight prioritization may improve when strategic value concentrates across enterprise intelligence surfaces under executive control.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "insight::logistics",
      insightDomain: "logistics",
      insightStrength: clamp01(predictiveValue?.valueStrength ?? 0.4),
      explanation:
        "Logistics insight priority may elevate when recovery stabilization signals intersect predictive divergence across coordination systems.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "insight::finance",
      insightDomain: "finance",
      insightStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial insight visibility may strengthen when equilibrium recovery reduces noise across investment decision pathways.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "insight::recovery",
      insightDomain: "recovery",
      insightStrength: clamp01(
        (recoveryValue?.valueStrength ?? 0.35) * 0.55 +
          (resilienceOpportunity?.urgencyStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Recovery-system insights may be elevated when stabilization leverage remains actionable while resilience opportunities persist.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "insight::strategic-momentum",
      insightDomain: "strategic_momentum",
      insightStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum insight may reflect how prioritized delivery supports enterprise evolution without hidden steering.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "insight::systemic-equilibrium",
      insightDomain: "systemic_equilibrium",
      insightStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.urgencyRecords[0]?.urgencyStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium insight may preserve strategic cognition when urgency remains within executive-controlled bounds.",
      contributingInsightIds: Object.freeze(insightIds.slice(0, 4)),
    })
  );

  logExecutiveInsightPrioritizationDev("ExecutiveInsight", {
    insightRecordCount: records.length,
    urgencyCount: input.urgencyRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
