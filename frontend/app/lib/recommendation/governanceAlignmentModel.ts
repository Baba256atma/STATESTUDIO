/**
 * D7:5:6 — Governance-alignment modeling.
 */

import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveStrategicGovernanceState,
  GovernanceAlignmentRecord,
  StrategicGovernanceSignal,
  StrategicGovernanceStateLabel,
} from "./strategicGovernanceTypes.ts";
import { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function governanceStateFromProfile(
  stability: number,
  risk: number,
  volatility: number
): StrategicGovernanceStateLabel {
  if (risk >= 0.72) return "critical";
  if (volatility >= 0.68) return "volatile";
  if (risk >= 0.55 && stability < 0.45) return "restricted";
  if (volatility >= 0.5 || risk >= 0.45) return "monitoring";
  if (stability >= 0.55) return "stable";
  return "monitoring";
}

export function deriveStrategicGovernanceSignals(input: {
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  resilienceState: HumanSystemResilienceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  governanceLeverageFactor?: number;
  oversightStressFactor?: number;
}): StrategicGovernanceSignal[] {
  const leverage = clamp01(input.governanceLeverageFactor ?? 0);
  const stress = clamp01(input.oversightStressFactor ?? 0);

  const signals: StrategicGovernanceSignal[] = [];

  for (const rec of input.recommendationState.activeRecommendations) {
    const stability = clamp01(
      input.confidenceState.overallConfidenceScore * 0.3 +
        input.memoryState.learningStabilityScore * 0.25 +
        input.preventionState.collapseInterruptionScore * 0.2 +
        leverage * 0.1
    );
    const risk = clamp01(
      rec.recommendationStrength * 0.25 +
        input.comparisonState.pathwayDivergenceScore * 0.25 +
        input.memoryState.patternRecurrenceScore * 0.2 +
        stress * 0.15
    );
    const volatility = clamp01(
      input.trajectoryState.trajectoryVolatilityScore * 0.3 +
        input.divergenceState.futureFragmentationScore * 0.3 +
        input.confidenceState.uncertaintyAmplificationScore * 0.2
    );

    const governanceState = governanceStateFromProfile(stability, risk, volatility);
    const governanceStrength = clamp01(stability * 0.45 + (1 - risk) * 0.35 + (1 - volatility) * 0.2);

    const drivers: string[] = [];
    if (governanceState === "stable") drivers.push("safeguard_alignment", "confidence_coherence");
    if (governanceState === "monitoring") drivers.push("governance_caution", "oversight_watch");
    if (governanceState === "restricted") drivers.push("low_confidence", "pathway_constraint");
    if (governanceState === "volatile") drivers.push("recommendation_volatility", "divergence_stress");
    if (governanceState === "critical") drivers.push("safeguard_risk", "intervention_review");

    signals.push(
      Object.freeze({
        governanceId: `governance::${rec.recommendationId}`,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds].sort()),
        governanceState,
        governanceStrength,
        dominantGovernanceDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["governance_alignment"]
        ),
        executiveLabel:
          governanceState === "stable"
            ? "Recommendation may remain governance-aligned under current safeguards"
            : governanceState === "critical"
              ? "Executive oversight may be required before acting on this recommendation pathway"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallbackRegions =
      input.recommendationState.stabilizationRecommendationZones.length > 0
        ? [...input.recommendationState.stabilizationRecommendationZones].sort().slice(0, 3)
        : ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        governanceId: "governance::fallback-oversight",
        affectedRegionIds: Object.freeze(fallbackRegions),
        governanceState: "monitoring",
        governanceStrength: clamp01(
          input.confidenceState.overallConfidenceScore * 0.5 + leverage * 0.2
        ),
        dominantGovernanceDrivers: Object.freeze(["executive_oversight_baseline"]),
        executiveLabel: "Baseline governance monitoring may apply across strategic recommendation pathways",
      })
    );
  }

  logStrategicGovernanceDev("Governance", { governanceSignalCount: signals.length });
  return signals.sort((a, b) => a.governanceId.localeCompare(b.governanceId));
}

export function analyzeGovernanceAlignment(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  resilienceState: HumanSystemResilienceState;
}): readonly GovernanceAlignmentRecord[] {
  const records: GovernanceAlignmentRecord[] = [];
  const governanceIds = input.governanceSignals.map((g) => g.governanceId);

  const safetyAlignment = clamp01(
    input.confidenceState.overallConfidenceScore * 0.35 +
      input.preventionState.collapseInterruptionScore * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "alignment::recommendation-safety",
      alignmentType: "recommendation_safety",
      alignmentStrength: safetyAlignment,
      explanation:
        "Recommendation safety alignment may improve when confidence and collapse-prevention safeguards remain coherent.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  const oversightStability = clamp01(
    input.memoryState.learningStabilityScore * 0.4 +
      input.comparisonState.comparisonStabilityScore * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "alignment::oversight-stability",
      alignmentType: "oversight_stability",
      alignmentStrength: oversightStability,
      explanation:
        "Executive oversight stability may strengthen when memory learning and multi-strategy comparison remain stable.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  const resilienceCoherence = clamp01(
    input.resilienceState.enterpriseResilienceScore * 0.45 +
      input.adaptationState.adaptiveResilienceScore * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "alignment::resilience-coherence",
      alignmentType: "resilience_coherence",
      alignmentStrength: resilienceCoherence,
      explanation:
        "Resilience-governance coherence may hold when adaptive recovery recommendations align with enterprise resilience safeguards.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  if (input.confidenceState.recommendationConfidenceLabel === "low" ||
    input.confidenceState.recommendationConfidenceLabel === "uncertain") {
    records.push(
      Object.freeze({
        recordId: "alignment::confidence-governance-caution",
        alignmentType: "confidence_governance",
        alignmentStrength: clamp01(1 - input.confidenceState.overallConfidenceScore),
        explanation:
          "Low-confidence recommendations may trigger governance caution escalation without autonomous restriction.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  if (input.comparisonState.pathwayDivergenceScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "alignment::volatility-governance",
        alignmentType: "volatility_governance",
        alignmentStrength: input.comparisonState.pathwayDivergenceScore,
        explanation:
          "Recommendation volatility governance may elevate when competing strategic pathways diverge materially.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "alignment::safeguard-alignment",
      alignmentType: "safeguard_alignment",
      alignmentStrength: clamp01(
        input.recommendationState.stabilizationLeverageScore * 0.4 +
          input.preventionState.collapseInterruptionScore * 0.35
      ),
      explanation:
        "Strategic safeguard alignment may preserve governance stability when stabilization leverage remains within resilience bounds.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  logStrategicGovernanceDev("GovernanceStability", { alignmentRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateGovernanceStabilityScore(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  confidenceState: RecommendationConfidenceState;
  memoryState: StrategicRecommendationMemoryState;
}): number {
  if (input.governanceSignals.length === 0) return 0;
  const stable = input.governanceSignals.filter((g) => g.governanceState === "stable").length;
  const critical = input.governanceSignals.filter((g) => g.governanceState === "critical").length;
  const avgStrength =
    input.governanceSignals.reduce((sum, g) => sum + g.governanceStrength, 0) /
    input.governanceSignals.length;
  return clamp01(
    avgStrength * 0.35 +
      (stable / input.governanceSignals.length) * 0.3 +
      input.confidenceState.evidenceStabilityScore * 0.2 +
      input.memoryState.learningStabilityScore * 0.15 -
      (critical / input.governanceSignals.length) * 0.12
  );
}

export function calculateRecommendationSafetyScore(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  recommendationState: StrategicRecommendationState;
  comparisonState: ExecutiveMultiStrategyState;
}): number {
  const restricted = input.governanceSignals.filter(
    (g) => g.governanceState === "restricted" || g.governanceState === "critical"
  ).length;
  return clamp01(
    input.recommendationState.recommendationConfidenceScore * 0.35 +
      (1 - input.comparisonState.resilienceRiskAsymmetryScore) * 0.3 -
      (restricted / Math.max(1, input.governanceSignals.length)) * 0.2
  );
}

export function calculateOversightRequirementScore(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  divergenceState: MultiFutureDivergenceState;
  confidenceState: RecommendationConfidenceState;
}): number {
  const oversightCount = input.governanceSignals.filter(
    (g) =>
      g.governanceState === "monitoring" ||
      g.governanceState === "volatile" ||
      g.governanceState === "critical"
  ).length;
  return clamp01(
    input.divergenceState.futureFragmentationScore * 0.35 +
      input.confidenceState.uncertaintyAmplificationScore * 0.3 +
      (oversightCount / Math.max(1, input.governanceSignals.length)) * 0.25
  );
}

export function identifyRestrictedRecommendationZones(
  governanceSignals: readonly StrategicGovernanceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const g of governanceSignals) {
    if (g.governanceState === "restricted" || g.governanceState === "critical") {
      for (const r of g.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyExecutiveOversightZones(
  governanceSignals: readonly StrategicGovernanceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const g of governanceSignals) {
    if (
      g.governanceState === "monitoring" ||
      g.governanceState === "volatile" ||
      g.governanceState === "critical"
    ) {
      for (const r of g.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveGovernanceLabel(input: {
  governanceStabilityScore: number;
  recommendationSafetyScore: number;
  oversightRequirementScore: number;
}): ExecutiveStrategicGovernanceState["executiveGovernanceLabel"] {
  if (input.oversightRequirementScore >= 0.68) return "critical";
  if (input.oversightRequirementScore >= 0.55) return "restricted";
  if (input.recommendationSafetyScore < 0.4 && input.oversightRequirementScore >= 0.4) {
    return "volatile";
  }
  if (input.governanceStabilityScore >= 0.55 && input.recommendationSafetyScore >= 0.45) {
    return "aligned";
  }
  if (input.oversightRequirementScore >= 0.35) return "cautious";
  return input.governanceStabilityScore >= input.oversightRequirementScore ? "aligned" : "cautious";
}
