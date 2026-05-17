/**
 * D7:5:7 — Executive reasoning transparency intelligence.
 */

import type {
  ExecutiveReasoningTransparencyRecord,
  RecommendationTraceRecord,
  SignalToDecisionRecord,
  ExecutiveExplainabilitySignal,
} from "./executiveExplainabilityTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveReasoningTransparency(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  traceRecords: readonly RecommendationTraceRecord[];
  signalRecords: readonly SignalToDecisionRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveReasoningTransparencyRecord[] {
  const records: ExecutiveReasoningTransparencyRecord[] = [];
  const explanationIds = input.explanations.map((e) => e.explanationId);

  const logisticsTrace = input.traceRecords.find((r) => r.recordId.includes("signal-to-decision"));

  records.push(
    Object.freeze({
      recordId: "transparency::operations",
      transparencyDomain: "operations",
      transparencyStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational transparency may improve executive trust when recommendation drivers trace to observable momentum and flow signals.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transparency::logistics",
      transparencyDomain: "logistics",
      transparencyStrength: clamp01(logisticsTrace?.traceStrength ?? 0.4),
      explanation:
        "Logistics explainability may clarify dependency pressure and recovery coordination effects across distribution systems.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transparency::finance",
      transparencyDomain: "finance",
      transparencyStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial reasoning transparency may link recommendations to equilibrium and cost-benefit tradeoff evidence.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transparency::recovery",
      transparencyDomain: "recovery",
      transparencyStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Recovery-system transparency may explain why stabilization recommendations reference weakened coordination stability.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transparency::strategic-momentum",
      transparencyDomain: "strategic_momentum",
      transparencyStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.5),
      explanation:
        "Strategic momentum transparency may help executives audit how predictive signals influenced recommendation timing.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transparency::systemic-equilibrium",
      transparencyDomain: "systemic_equilibrium",
      transparencyStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Systemic equilibrium transparency may preserve governance stability when reasoning chains remain auditable end to end.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
    })
  );

  logExecutiveDecisionExplainabilityDev("ExecutiveTransparency", {
    transparencyRecordCount: records.length,
    signalGapCount: input.signalRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
