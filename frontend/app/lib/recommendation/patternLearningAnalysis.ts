/**
 * D7:5:5 — Pattern-learning analysis for recommendation memory.
 */

import type { StrategicRecommendationMemorySignal } from "./recommendationMemoryTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { PatternLearningRecord } from "./recommendationMemoryTypes.ts";
import { logRecommendationMemoryDev } from "./learningDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzePatternLearning(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  comparisonState: ExecutiveMultiStrategyState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  adaptationState: PredictiveStrategicAdaptationState;
  cascadeState: PredictiveCascadeState;
}): readonly PatternLearningRecord[] {
  const records: PatternLearningRecord[] = [];
  const memoryIds = input.memories.map((m) => m.memoryId);

  const instability = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.4 +
      input.cascadeState.cascadeAmplificationScore * 0.35
  );
  if (instability >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "pattern::recurring-instability",
        patternType: "recurring_instability",
        patternStrength: instability,
        explanation:
          "Recurring instability pathways may resemble prior dependency stress cycles observed in operational history.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      })
    );
  }

  const success = clamp01(
    input.adaptationState.adaptiveResilienceScore * 0.45 +
      input.comparisonState.comparisonStabilityScore * 0.35
  );
  if (success >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "pattern::repeated-strategic-success",
        patternType: "repeated_strategic_success",
        patternStrength: success,
        explanation:
          "Repeated strategic successes in coordination stabilization may reinforce validated resilience pathways.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      })
    );
  }

  const resilienceOpportunity = clamp01(
    input.adaptationState.strategicFlexibilityScore * 0.4 +
      (1 - input.divergenceState.futureFragmentationScore) * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "pattern::resilience-learning-opportunity",
      patternType: "resilience_learning_opportunity",
      patternStrength: resilienceOpportunity,
      explanation:
        "Resilience-learning opportunities may emerge where historical recovery patterns align with current adaptive capacity.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    })
  );

  const validated = input.memories.filter((m) => m.memoryState === "validated").length;
  if (validated > 0 || input.comparisonState.executiveComparisonLabel === "convergent") {
    records.push(
      Object.freeze({
        recordId: "pattern::recommendation-validation",
        patternType: "recommendation_validation",
        patternStrength: clamp01(validated / Math.max(1, input.memories.length) + 0.25),
        explanation:
          "Recommendation validation patterns may increase confidence when prior pathways succeeded under comparable conditions.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      })
    );
  }

  const historySimilarity = clamp01(
    input.divergenceState.futureConvergenceScore * 0.4 +
      input.trajectoryState.trajectoryVolatilityScore * 0.3
  );
  records.push(
    Object.freeze({
      recordId: "pattern::operational-history-similarity",
      patternType: "operational_history_similarity",
      patternStrength: historySimilarity,
      explanation:
        "Past dependency instability patterns may resemble the current operational trajectory, supporting memory-informed foresight.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
    })
  );

  const fragilityAmp = clamp01(
    input.comparisonState.resilienceRiskAsymmetryScore * 0.45 +
      input.cascadeState.cascadeAmplificationScore * 0.35
  );
  if (fragilityAmp >= 0.3) {
    records.push(
      Object.freeze({
        recordId: "pattern::historical-fragility-amplification",
        patternType: "historical_fragility_amplification",
        patternStrength: fragilityAmp,
        explanation:
          "Historical fragility amplification may signal earlier intervention when similar cascade signatures reappear.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      })
    );
  }

  logRecommendationMemoryDev("HistoricalPattern", { patternRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
