/**
 * D7:5:7 — Recommendation-trace modeling.
 */

import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveExplainabilitySignal,
  ExecutiveExplainabilityState,
  ExecutiveExplainabilityStateLabel,
  RecommendationTraceRecord,
} from "./executiveExplainabilityTypes.ts";
import { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function explainabilityStateFromProfile(
  clarity: number,
  ambiguity: number,
  volatility: number
): ExecutiveExplainabilityStateLabel {
  if (ambiguity >= 0.72) return "restricted";
  if (volatility >= 0.68) return "volatile";
  if (ambiguity >= 0.55 && clarity < 0.45) return "uncertain";
  if (clarity >= 0.62 && volatility < 0.4) return "clear";
  if (clarity >= 0.45) return "supported";
  return volatility > clarity ? "volatile" : "uncertain";
}

export function deriveExecutiveExplainabilitySignals(input: {
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  cascadeState: PredictiveCascadeState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  explainabilityLeverageFactor?: number;
  traceStressFactor?: number;
}): ExecutiveExplainabilitySignal[] {
  const leverage = clamp01(input.explainabilityLeverageFactor ?? 0);
  const stress = clamp01(input.traceStressFactor ?? 0);

  const signals: ExecutiveExplainabilitySignal[] = [];

  for (const rec of input.recommendationState.activeRecommendations) {
    const clarity = clamp01(
      input.confidenceState.evidenceStabilityScore * 0.3 +
        input.governanceState.governanceStabilityScore * 0.25 +
        input.memoryState.learningStabilityScore * 0.2 +
        leverage * 0.1
    );
    const ambiguity = clamp01(
      input.confidenceState.uncertaintyAmplificationScore * 0.35 +
        input.governanceState.oversightRequirementScore * 0.25 +
        stress * 0.15
    );
    const volatility = clamp01(
      input.trajectoryState.trajectoryVolatilityScore * 0.35 +
        input.divergenceState.futureFragmentationScore * 0.3 +
        input.comparisonState.pathwayDivergenceScore * 0.2
    );

    const explainabilityState = explainabilityStateFromProfile(clarity, ambiguity, volatility);
    const explanationStrength = clamp01(
      clarity * 0.45 + rec.recommendationStrength * 0.25 + (1 - ambiguity) * 0.3
    );

    const drivers: string[] = [];
    if (explainabilityState === "clear") drivers.push("strong_evidence", "traceable_signals");
    if (explainabilityState === "supported") drivers.push("operational_causality", "predictive_alignment");
    if (explainabilityState === "uncertain") drivers.push("ambiguous_evidence", "pathway_volatility");
    if (explainabilityState === "volatile") drivers.push("divergence_stress", "unstable_trajectory");
    if (explainabilityState === "restricted") drivers.push("low_confidence", "governance_caution");

    signals.push(
      Object.freeze({
        explanationId: `explanation::${rec.recommendationId}`,
        relatedRecommendationId: rec.recommendationId,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds].sort()),
        explainabilityState,
        explanationStrength,
        dominantExplanationDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["signal_trace"]
        ),
        executiveLabel:
          explainabilityState === "clear"
            ? "Recommendation rationale may be clearly traceable to operational signals"
            : explainabilityState === "restricted"
              ? "Explanation may be limited by ambiguous evidence or governance caution"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallbackRegions =
      input.recommendationState.criticalInterventionZones.length > 0
        ? [...input.recommendationState.criticalInterventionZones].sort().slice(0, 3)
        : ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        explanationId: "explanation::fallback-trace",
        relatedRecommendationId: "rec-fallback-trace",
        affectedRegionIds: Object.freeze(fallbackRegions),
        explainabilityState: "supported",
        explanationStrength: clamp01(input.confidenceState.overallConfidenceScore * 0.5 + leverage * 0.2),
        dominantExplanationDrivers: Object.freeze(["baseline_signal_trace"]),
        executiveLabel: "Baseline explainability trace may apply across strategic recommendations",
      })
    );
  }

  logExecutiveDecisionExplainabilityDev("Explainability", { explanationCount: signals.length });
  return signals.sort((a, b) => a.explanationId.localeCompare(b.explanationId));
}

export function analyzeRecommendationTraces(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  cascadeState: PredictiveCascadeState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  preventionState: PredictiveCollapsePreventionState;
  adaptationState: PredictiveStrategicAdaptationState;
}): readonly RecommendationTraceRecord[] {
  const records: RecommendationTraceRecord[] = [];
  const explanationIds = input.explanations.map((e) => e.explanationId);

  const regions =
    input.explanations.flatMap((e) => e.affectedRegionIds).slice(0, 3).length > 0
      ? [...new Set(input.explanations.flatMap((e) => e.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const signalCausality = clamp01(
    input.cascadeState.cascadeAmplificationScore * 0.35 +
      input.divergenceState.futureFragmentationScore * 0.3 +
      (1 - input.preventionState.collapseInterruptionScore) * 0.2
  );
  records.push(
    Object.freeze({
      recordId: "trace::signal-to-decision",
      traceType: "signal_to_decision",
      traceStrength: signalCausality,
      explanation:
        "Increasing dependency pressure, future divergence escalation, and fragility amplification may form the signal-to-decision chain behind concentration-reduction recommendations.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  const predictivePathway = clamp01(
    input.trajectoryState.trajectoryDivergenceScore * 0.4 +
      input.comparisonState.pathwayDivergenceScore * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "trace::predictive-pathway",
      traceType: "predictive_pathway",
      traceStrength: predictivePathway,
      explanation:
        "Predictive pathway contribution may explain recommendations when trajectory divergence and multi-strategy comparison signals align.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  const governanceAlignment = clamp01(input.governanceState.governanceStabilityScore * 0.5);
  records.push(
    Object.freeze({
      recordId: "trace::governance-alignment",
      traceType: "governance_alignment",
      traceStrength: governanceAlignment,
      explanation:
        "Governance reasoning alignment may clarify why recommendations remain within resilience safeguards under executive oversight.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(
        input.governanceState.executiveOversightZones.length > 0
          ? [...input.governanceState.executiveOversightZones].sort().slice(0, 3)
          : regions
      ),
    })
  );

  records.push(
    Object.freeze({
      recordId: "trace::evidence-mapping",
      traceType: "evidence_mapping",
      traceStrength: clamp01(input.confidenceState.evidenceStabilityScore * 0.5),
      explanation:
        "Operational evidence mapping may link recommendation strength to confidence signals and intervention impact records.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "trace::ambiguity-aware",
      traceType: "ambiguity_aware",
      traceStrength: clamp01(input.confidenceState.uncertaintyAmplificationScore * 0.45),
      explanation:
        "Ambiguity-aware explanations may note where evidence remains incomplete although recommendations remain advisory.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "trace::operational-causality-coordination",
      traceType: "operational_causality",
      traceStrength: clamp01(
        input.adaptationState.adaptiveResilienceScore * 0.4 +
          input.memoryState.validationConfidenceScore * 0.35
      ),
      explanation:
        "Trust stability improvement, resilience acceleration, and stabilization opportunities may explain coordination-synchronization recommendations.",
      contributingExplanationIds: Object.freeze(explanationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveDecisionExplainabilityDev("DecisionTrace", { traceRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateExplanationClarityScore(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  confidenceState: RecommendationConfidenceState;
  governanceState: ExecutiveStrategicGovernanceState;
}): number {
  if (input.explanations.length === 0) return 0;
  const clear = input.explanations.filter((e) => e.explainabilityState === "clear").length;
  const restricted = input.explanations.filter((e) => e.explainabilityState === "restricted").length;
  const avgStrength =
    input.explanations.reduce((sum, e) => sum + e.explanationStrength, 0) / input.explanations.length;
  return clamp01(
    avgStrength * 0.35 +
      (clear / input.explanations.length) * 0.3 +
      input.confidenceState.evidenceStabilityScore * 0.2 +
      input.governanceState.governanceStabilityScore * 0.15 -
      (restricted / input.explanations.length) * 0.12
  );
}

export function calculateTraceabilityScore(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  recommendationState: StrategicRecommendationState;
  memoryState: StrategicRecommendationMemoryState;
}): number {
  return clamp01(
    input.recommendationState.recommendationConfidenceScore * 0.35 +
      input.memoryState.validationConfidenceScore * 0.35 +
      (input.explanations.filter((e) => e.explainabilityState === "supported" || e.explainabilityState === "clear")
        .length /
        Math.max(1, input.explanations.length)) *
        0.3
  );
}

export function calculateReasoningTransparencyScore(input: {
  explanations: readonly ExecutiveExplainabilitySignal[];
  governanceState: ExecutiveStrategicGovernanceState;
  comparisonState: ExecutiveMultiStrategyState;
}): number {
  const transparent = input.explanations.filter(
    (e) => e.explainabilityState === "clear" || e.explainabilityState === "supported"
  ).length;
  return clamp01(
    (transparent / Math.max(1, input.explanations.length)) * 0.4 +
      input.governanceState.recommendationSafetyScore * 0.3 +
      (1 - input.comparisonState.pathwayDivergenceScore) * 0.3
  );
}

export function identifyTraceabilityZones(
  explanations: readonly ExecutiveExplainabilitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const e of explanations) {
    if (e.explainabilityState === "clear" || e.explainabilityState === "supported") {
      for (const r of e.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyAmbiguityExplanationZones(
  explanations: readonly ExecutiveExplainabilitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const e of explanations) {
    if (
      e.explainabilityState === "uncertain" ||
      e.explainabilityState === "volatile" ||
      e.explainabilityState === "restricted"
    ) {
      for (const r of e.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveExplainabilityLabel(input: {
  explanationClarityScore: number;
  traceabilityScore: number;
  reasoningTransparencyScore: number;
}): ExecutiveExplainabilityState["executiveExplainabilityLabel"] {
  if (input.explanationClarityScore >= 0.62 && input.reasoningTransparencyScore >= 0.55) {
    return "clear";
  }
  if (input.traceabilityScore >= 0.55 && input.explanationClarityScore >= 0.45) {
    return "supported";
  }
  if (input.reasoningTransparencyScore < 0.4 && input.explanationClarityScore < 0.4) {
    return "restricted";
  }
  if (input.explanationClarityScore < 0.45) return "ambiguous";
  if (input.traceabilityScore < 0.45) return "volatile";
  return "supported";
}
