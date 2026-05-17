/**
 * D7:5:7 — Signal-to-decision analysis.
 */

import type { ExecutiveExplainabilitySignal } from "./executiveExplainabilityTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { SignalToDecisionRecord } from "./executiveExplainabilityTypes.ts";
import { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeSignalToDecision(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  confidenceState: RecommendationConfidenceState;
  comparisonState: ExecutiveMultiStrategyState;
  governanceState: ExecutiveStrategicGovernanceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly SignalToDecisionRecord[] {
  const records: SignalToDecisionRecord[] = [];
  const explanationIds = input.explanations.map((e) => e.explanationId);

  if (input.confidenceState.overallConfidenceScore < 0.5) {
    records.push(
      Object.freeze({
        recordId: "signal::weakly-supported",
        analysisType: "weakly_supported",
        analysisStrength: clamp01(1 - input.confidenceState.overallConfidenceScore),
        explanation:
          "Recommendation confidence may be moderate because future trajectories remain volatile under current predictive evidence.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  if (input.trajectoryState.trajectoryVolatilityScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "signal::unclear-pathway",
        analysisType: "unclear_pathway",
        analysisStrength: input.trajectoryState.trajectoryVolatilityScore,
        explanation:
          "Unclear predictive pathways may reduce explainability when trajectory volatility obscures causal signal chains.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  if (
    input.confidenceState.recommendationConfidenceLabel === "volatile" &&
    input.governanceState.executiveGovernanceLabel === "volatile"
  ) {
    records.push(
      Object.freeze({
        recordId: "signal::conflicting-evidence",
        analysisType: "conflicting_evidence",
        analysisStrength: clamp01(
          input.confidenceState.uncertaintyAmplificationScore * 0.5 +
            input.governanceState.oversightRequirementScore * 0.4
        ),
        explanation:
          "Conflicting operational evidence may appear when confidence volatility aligns with governance volatility signals.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  const unstableReasoning = clamp01(
    input.comparisonState.pathwayDivergenceScore * 0.45 +
      input.divergenceState.futureFragmentationScore * 0.35
  );
  if (unstableReasoning >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "signal::unstable-reasoning",
        analysisType: "unstable_reasoning",
        analysisStrength: unstableReasoning,
        explanation:
          "Unstable reasoning chains may emerge when pathway divergence and future fragmentation intensify simultaneously.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  const lowTransparency = input.explanations.filter(
    (e) => e.explainabilityState === "restricted" || e.explainabilityState === "volatile"
  ).length;
  if (lowTransparency > 0) {
    records.push(
      Object.freeze({
        recordId: "signal::low-transparency",
        analysisType: "low_transparency",
        analysisStrength: clamp01(lowTransparency / Math.max(1, input.explanations.length)),
        explanation:
          "Low-transparency conditions may warrant executive audit when multiple recommendations lack clear signal traceability.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  if (input.governanceState.governanceAlignmentRecords.length > 0 &&
    input.confidenceState.overallConfidenceScore < 0.55) {
    records.push(
      Object.freeze({
        recordId: "signal::governance-explainability-gap",
        analysisType: "governance_explainability_gap",
        analysisStrength: clamp01(input.governanceState.oversightRequirementScore * 0.5),
        explanation:
          "Governance explainability gaps may appear when oversight requirements rise although confidence remains moderate.",
        contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      })
    );
  }

  logExecutiveDecisionExplainabilityDev("SignalReasoning", { signalRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
