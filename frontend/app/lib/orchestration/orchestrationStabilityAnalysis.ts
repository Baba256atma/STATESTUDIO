/**
 * D7:5:10 — Orchestration-stability analysis.
 */

import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { ExecutiveMultiStrategyState } from "../recommendation/multiStrategyComparisonTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type {
  OrchestrationStabilityRecord,
  UnifiedExecutiveOrchestrationSignal,
} from "./unifiedExecutiveOrchestrationTypes.ts";
import { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeOrchestrationStability(input: {
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  comparisonState: ExecutiveMultiStrategyState;
  explainabilityState: ExecutiveExplainabilityState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly OrchestrationStabilityRecord[] {
  const records: OrchestrationStabilityRecord[] = [];
  const orchestrationIds = input.orchestrationSignals.map((o) => o.orchestrationId);

  const unstableSignals = input.orchestrationSignals.filter(
    (o) => o.orchestrationState === "volatile" || o.orchestrationState === "critical"
  ).length;
  if (unstableSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "stability::cross-system-instability",
        instabilityType: "cross_system_instability",
        instabilityStrength: clamp01(
          unstableSignals / Math.max(1, input.orchestrationSignals.length)
        ),
        explanation:
          "Cross-system instability may emerge when multiple intelligence layers signal volatile or critical orchestration states simultaneously.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  if (
    (input.recommendationState.strategicRecommendationLabel === "stabilizing" ||
      input.recommendationState.strategicRecommendationLabel === "adaptive") &&
    (input.consensusState.executiveConsensusLabel === "fragmented" ||
      input.consensusState.executiveConsensusLabel === "volatile")
  ) {
    records.push(
      Object.freeze({
        recordId: "stability::recommendation-governance-conflict",
        instabilityType: "recommendation_governance_conflict",
        instabilityStrength: clamp01(
          input.consensusState.fragmentationEscalationScore * 0.5 +
            (1 - input.governanceState.governanceStabilityScore) * 0.35
        ),
        explanation:
          "Strategic recommendations may appear stable while executive consensus remains fragmented, creating an orchestration instability warning.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  if (
    input.advisoryState.executiveAdvisoryLabel !== input.foresightState.predictiveForesightLabel &&
    input.divergenceState.futureFragmentationScore >= 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "stability::predictive-advisory-divergence",
        instabilityType: "predictive_advisory_divergence",
        instabilityStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.45 +
            input.trajectoryState.trajectoryVolatilityScore * 0.35
        ),
        explanation:
          "Predictive and advisory divergence may elevate orchestration caution when foresight and advisory labels diverge under future fragmentation.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  if (
    input.explainabilityState.explanationClarityScore < 0.4 &&
    input.confidenceState.overallConfidenceScore < 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "stability::executive-cognition-overload",
        instabilityType: "executive_cognition_overload",
        instabilityStrength: clamp01(
          (1 - input.explainabilityState.explanationClarityScore) * 0.45 +
            (1 - input.confidenceState.overallConfidenceScore) * 0.4
        ),
        explanation:
          "Executive cognition overload may arise from leadership strain combined with low explainability and recommendation confidence across the stack.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  if (input.comparisonState.pathwayDivergenceScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "stability::orchestration-fragmentation",
        instabilityType: "orchestration_fragmentation",
        instabilityStrength: input.comparisonState.pathwayDivergenceScore,
        explanation:
          "Orchestration fragmentation may persist when competing strategies diverge across restructuring and stabilization intelligence pathways.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  if (input.cascadeState.cascadeAmplificationScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "stability::coherence-degradation",
        instabilityType: "coherence_degradation",
        instabilityStrength: clamp01(
          input.cascadeState.cascadeAmplificationScore * 0.5 +
            input.consensusState.fragmentationEscalationScore * 0.35
        ),
        explanation:
          "Orchestration coherence degradation may accelerate when cascade amplification coincides with consensus fragmentation across operational domains.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      })
    );
  }

  logUnifiedExecutiveOrchestrationDev("CrossSystemCoherence", {
    stabilityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
