/**
 * D7:5:5 — Historical-outcome modeling for recommendation memory.
 */

import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { ExecutiveTradeoffState } from "./tradeoffAnalysisTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type {
  HistoricalOutcomeRecord,
  StrategicRecommendationMemorySignal,
  StrategicRecommendationMemoryState,
  StrategicRecommendationMemoryStateLabel,
} from "./recommendationMemoryTypes.ts";
import { logRecommendationMemoryDev } from "./learningDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function memoryStateFromProfile(
  validation: number,
  volatility: number,
  staleness: number
): StrategicRecommendationMemoryStateLabel {
  if (staleness >= 0.7) return "outdated";
  if (volatility >= 0.72) return "volatile";
  if (validation >= 0.62 && volatility < 0.4) return "validated";
  if (validation >= 0.45 && volatility < 0.55) return "improving";
  if (volatility >= 0.55 && validation < 0.35) return "critical";
  return validation > volatility ? "improving" : "volatile";
}

export function deriveRecommendationMemorySignals(input: {
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  comparisonState: ExecutiveMultiStrategyState;
  tradeoffState: ExecutiveTradeoffState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  memoryLeverageFactor?: number;
  historicalStressFactor?: number;
}): StrategicRecommendationMemorySignal[] {
  const leverage = clamp01(input.memoryLeverageFactor ?? 0);
  const stress = clamp01(input.historicalStressFactor ?? 0);

  const memories: StrategicRecommendationMemorySignal[] = [];

  for (const rec of input.recommendationState.activeRecommendations) {
    const validation = clamp01(
      input.confidenceState.overallConfidenceScore * 0.35 +
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.25 +
        input.preventionState.collapseInterruptionScore * 0.2 +
        leverage * 0.1
    );
    const volatility = clamp01(
      input.trajectoryState.trajectoryVolatilityScore * 0.3 +
        input.cascadeState.cascadeAmplificationScore * 0.25 +
        input.comparisonState.pathwayDivergenceScore * 0.2 +
        stress * 0.15
    );
    const staleness = clamp01(
      (1 - input.confidenceState.evidenceStabilityScore) * 0.4 +
        input.divergenceState.futureFragmentationScore * 0.3
    );

    const memoryState = memoryStateFromProfile(validation, volatility, staleness);
    const memoryStrength = clamp01(
      validation * 0.45 + (1 - volatility) * 0.35 + rec.recommendationStrength * 0.2
    );

    const drivers: string[] = [];
    if (memoryState === "validated") drivers.push("historical_validation", "recovery_success");
    if (memoryState === "improving") drivers.push("pattern_refinement", "confidence_gain");
    if (memoryState === "volatile") drivers.push("pathway_shift", "coordination_volatility");
    if (memoryState === "critical") drivers.push("repeated_failure", "fragility_amplification");
    if (memoryState === "outdated") drivers.push("stale_evidence", "trajectory_drift");

    memories.push(
      Object.freeze({
        memoryId: `memory::${rec.recommendationId}`,
        originatingRecommendationId: rec.recommendationId,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds].sort()),
        memoryState,
        memoryStrength,
        dominantLearningDrivers: Object.freeze(drivers.length > 0 ? drivers : ["operational_history"]),
        executiveLabel:
          memoryState === "validated"
            ? "Prior recommendation pattern may have validated under similar recovery conditions"
            : memoryState === "critical"
              ? "Repeated operational stress may require earlier intervention memory"
              : undefined,
      })
    );
  }

  if (memories.length === 0) {
    const fallbackRegions =
      input.recommendationState.stabilizationRecommendationZones.length > 0
        ? [...input.recommendationState.stabilizationRecommendationZones].sort().slice(0, 3)
        : ["logistics", "manufacturing"];
    memories.push(
      Object.freeze({
        memoryId: "memory::fallback-stabilization",
        originatingRecommendationId: "rec-fallback-stabilization",
        affectedRegionIds: Object.freeze(fallbackRegions),
        memoryState: "improving",
        memoryStrength: clamp01(
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.5 + leverage * 0.2
        ),
        dominantLearningDrivers: Object.freeze(["logistics_stabilization_history"]),
        executiveLabel: "Historical logistics stabilization patterns may inform current recovery posture",
      })
    );
  }

  logRecommendationMemoryDev("RecommendationMemory", { memoryCount: memories.length });
  return memories.sort((a, b) => a.memoryId.localeCompare(b.memoryId));
}

export function analyzeHistoricalOutcomes(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  recommendationState: StrategicRecommendationState;
  comparisonState: ExecutiveMultiStrategyState;
  adaptationState: PredictiveStrategicAdaptationState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  preventionState: PredictiveCollapsePreventionState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly HistoricalOutcomeRecord[] {
  const records: HistoricalOutcomeRecord[] = [];
  const memoryIds = input.memories.map((m) => m.memoryId);

  const logisticsRegions = input.memories
    .flatMap((m) => m.affectedRegionIds)
    .filter((r) => r.includes("logistics") || r === "logistics")
    .slice(0, 2);
  const regionFallback =
    logisticsRegions.length > 0
      ? logisticsRegions
      : input.recommendationState.stabilizationRecommendationZones.slice(0, 2).length > 0
        ? input.recommendationState.stabilizationRecommendationZones.slice(0, 2)
        : ["logistics"];

  const recoverySuccess = clamp01(
    input.recoveryOpportunityState.stabilizationPotentialScore * 0.45 +
      input.preventionState.collapseInterruptionScore * 0.35
  );
  if (recoverySuccess >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "outcome::successful-recovery-pathway",
        outcomeType: "successful_recovery_pathway",
        outcomeStrength: recoverySuccess,
        explanation:
          "Repeated logistics recovery success may validate stabilization memory and support future recommendation confidence.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
        affectedRegionIds: Object.freeze([...regionFallback]),
      })
    );
  }

  const fragilityPattern = clamp01(
    input.cascadeState.cascadeAmplificationScore * 0.4 +
      input.trajectoryState.trajectoryVolatilityScore * 0.35 +
      input.comparisonState.resilienceRiskAsymmetryScore * 0.25
  );
  if (fragilityPattern >= 0.3) {
    records.push(
      Object.freeze({
        recordId: "outcome::repeated-fragility-pattern",
        outcomeType: "repeated_fragility_pattern",
        outcomeStrength: fragilityPattern,
        explanation:
          "Repeated dependency fragility patterns may warrant earlier intervention recommendations in similar trajectories.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(
          input.recommendationState.criticalInterventionZones.length > 0
            ? [...input.recommendationState.criticalInterventionZones].sort().slice(0, 3)
            : ["manufacturing", "logistics"]
        ),
      })
    );
  }

  const validatedStabilization = clamp01(
    input.comparisonState.comparisonStabilityScore * 0.4 +
      input.adaptationState.adaptiveResilienceScore * 0.35
  );
  if (validatedStabilization >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "outcome::validated-stabilization",
        outcomeType: "validated_stabilization",
        outcomeStrength: validatedStabilization,
        explanation:
          "Validated stabilization strategies from prior coordination cycles may be reusable across comparable operational conditions.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(
          input.comparisonState.balancedStrategyZones.length > 0
            ? [...input.comparisonState.balancedStrategyZones].sort().slice(0, 3)
            : regionFallback
        ),
      })
    );
  }

  const failedIntervention = clamp01(
    input.comparisonState.pathwayDivergenceScore * 0.45 +
      (1 - input.preventionState.collapseInterruptionScore) * 0.35
  );
  if (failedIntervention >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "outcome::failed-intervention",
        outcomeType: "failed_intervention",
        outcomeStrength: failedIntervention,
        explanation:
          "Prior intervention outcomes that underperformed may refine recommendation emphasis without autonomous policy changes.",
        contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(regionFallback),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "outcome::resilience-learning-evolution",
      outcomeType: "resilience_learning_evolution",
      outcomeStrength: clamp01(
        input.adaptationState.adaptiveResilienceScore * 0.5 +
          input.adaptationState.strategicFlexibilityScore * 0.35
      ),
      explanation:
        "Resilience-learning evolution may accumulate across recovery and adaptation cycles to improve future executive recommendation quality.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regionFallback),
    }),
    Object.freeze({
      recordId: "outcome::strategic-pattern-recurrence",
      outcomeType: "strategic_pattern_recurrence",
      outcomeStrength: clamp01(
        input.comparisonState.pathwayDivergenceScore * 0.3 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Strategic-pattern recurrence may link current trajectories to historically observed operational pathways.",
      contributingMemoryIds: Object.freeze(memoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regionFallback),
    })
  );

  logRecommendationMemoryDev("ValidatedPathway", { outcomeRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLearningStabilityScore(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  confidenceState: RecommendationConfidenceState;
}): number {
  if (input.memories.length === 0) return 0;
  const validated = input.memories.filter((m) => m.memoryState === "validated").length;
  const critical = input.memories.filter((m) => m.memoryState === "critical").length;
  const avgStrength =
    input.memories.reduce((sum, m) => sum + m.memoryStrength, 0) / input.memories.length;
  const score = clamp01(
    avgStrength * 0.35 +
      (validated / input.memories.length) * 0.3 +
      input.confidenceState.overallConfidenceScore * 0.25 -
      (critical / input.memories.length) * 0.15
  );
  logRecommendationMemoryDev("StrategicLearning", { learningStabilityScore: score });
  return score;
}

export function calculatePatternRecurrenceScore(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): number {
  const volatileCount = input.memories.filter((m) => m.memoryState === "volatile").length;
  const score = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.35 +
      input.divergenceState.futureFragmentationScore * 0.3 +
      (volatileCount / Math.max(1, input.memories.length)) * 0.25
  );
  logRecommendationMemoryDev("HistoricalPattern", { patternRecurrenceScore: score });
  return score;
}

export function calculateValidationConfidenceScore(input: {
  memories: readonly StrategicRecommendationMemorySignal[];
  confidenceState: RecommendationConfidenceState;
  comparisonState: ExecutiveMultiStrategyState;
}): number {
  const validated = input.memories.filter((m) => m.memoryState === "validated").length;
  return clamp01(
    (validated / Math.max(1, input.memories.length)) * 0.35 +
      input.confidenceState.evidenceStabilityScore * 0.35 +
      input.comparisonState.comparisonStabilityScore * 0.3
  );
}

export function identifyValidatedRecommendationZones(
  memories: readonly StrategicRecommendationMemorySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const m of memories) {
    if (m.memoryState === "validated" || m.memoryState === "improving") {
      for (const r of m.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyRepeatedFailureZones(
  memories: readonly StrategicRecommendationMemorySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const m of memories) {
    if (m.memoryState === "critical" || m.memoryState === "volatile") {
      for (const r of m.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveLearningLabel(input: {
  learningStabilityScore: number;
  patternRecurrenceScore: number;
  validationConfidenceScore: number;
}): StrategicRecommendationMemoryState["executiveLearningLabel"] {
  if (input.validationConfidenceScore >= 0.62 && input.learningStabilityScore >= 0.55) {
    return "validated";
  }
  if (input.patternRecurrenceScore >= 0.65) return "volatile";
  if (input.learningStabilityScore >= 0.55 && input.patternRecurrenceScore < 0.5) {
    return "stable";
  }
  if (input.learningStabilityScore >= 0.4 && input.validationConfidenceScore >= 0.4) {
    return "emerging";
  }
  if (input.patternRecurrenceScore >= 0.5 && input.learningStabilityScore < 0.4) {
    return "degraded";
  }
  return input.learningStabilityScore >= input.patternRecurrenceScore ? "emerging" : "volatile";
}
