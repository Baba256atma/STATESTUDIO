/**
 * D7:5:8 — Executive guidance synthesis modeling.
 */

import type { ExecutiveExplainabilityState } from "./executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  ExecutiveGuidanceSynthesisRecord,
  ExecutiveStrategicAdvisorySignal,
  ExecutiveStrategicAdvisoryState,
  ExecutiveStrategicAdvisoryStateLabel,
} from "./executiveStrategicAdvisoryTypes.ts";
import { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function advisoryStateFromProfile(
  urgency: number,
  stability: number,
  volatility: number
): ExecutiveStrategicAdvisoryStateLabel {
  if (urgency >= 0.72) return "critical";
  if (volatility >= 0.65 && stability < 0.45) return "preventive";
  if (stability >= 0.58 && volatility < 0.45) return "stabilizing";
  if (urgency >= 0.5 || volatility >= 0.55) return "strategic";
  return "informational";
}

export function deriveExecutiveStrategicAdvisories(input: {
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  memoryState: StrategicRecommendationMemoryState;
  comparisonState: ExecutiveMultiStrategyState;
  cascadeState: PredictiveCascadeState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  advisoryLeverageFactor?: number;
  priorityStressFactor?: number;
}): ExecutiveStrategicAdvisorySignal[] {
  const leverage = clamp01(input.advisoryLeverageFactor ?? 0);
  const stress = clamp01(input.priorityStressFactor ?? 0);

  const advisories: ExecutiveStrategicAdvisorySignal[] = [];

  for (const rec of input.recommendationState.activeRecommendations) {
    const urgency = clamp01(
      rec.recommendationStrength * 0.3 +
        input.cascadeState.cascadeAmplificationScore * 0.25 +
        input.governanceState.oversightRequirementScore * 0.2 +
        stress * 0.15
    );
    const stability = clamp01(
      input.explainabilityState.explanationClarityScore * 0.3 +
        input.memoryState.learningStabilityScore * 0.25 +
        input.confidenceState.evidenceStabilityScore * 0.2 +
        leverage * 0.1
    );
    const volatility = clamp01(
      input.trajectoryState.trajectoryVolatilityScore * 0.35 +
        input.divergenceState.futureFragmentationScore * 0.3 +
        input.comparisonState.pathwayDivergenceScore * 0.2
    );

    const advisoryState = advisoryStateFromProfile(urgency, stability, volatility);
    const advisoryStrength = clamp01(
      stability * 0.4 + (1 - volatility) * 0.35 + rec.recommendationStrength * 0.25
    );

    const drivers: string[] = [];
    if (advisoryState === "preventive") drivers.push("dependency_fragility", "future_volatility");
    if (advisoryState === "stabilizing") drivers.push("recovery_coordination", "stabilization_priority");
    if (advisoryState === "strategic") drivers.push("pathway_comparison", "tradeoff_balance");
    if (advisoryState === "critical") drivers.push("cascade_risk", "governance_caution");
    if (advisoryState === "informational") drivers.push("baseline_context", "monitoring");

    advisories.push(
      Object.freeze({
        advisoryId: `advisory::${rec.recommendationId}`,
        relatedRecommendationId: rec.recommendationId,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds].sort()),
        advisoryState,
        advisoryStrength,
        dominantAdvisoryDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["advisory_synthesis"]
        ),
        executiveLabel:
          advisoryState === "preventive"
            ? "Preventive advisory may prioritize dependency reduction before expansion"
            : advisoryState === "stabilizing"
              ? "Stabilizing advisory may emphasize phased recovery coordination"
              : undefined,
      })
    );
  }

  if (advisories.length === 0) {
    const fallbackRegions =
      input.recommendationState.stabilizationRecommendationZones.length > 0
        ? [...input.recommendationState.stabilizationRecommendationZones].sort().slice(0, 3)
        : ["logistics", "manufacturing"];
    advisories.push(
      Object.freeze({
        advisoryId: "advisory::fallback-guidance",
        affectedRegionIds: Object.freeze(fallbackRegions),
        advisoryState: "informational",
        advisoryStrength: clamp01(input.confidenceState.overallConfidenceScore * 0.5 + leverage * 0.2),
        dominantAdvisoryDrivers: Object.freeze(["executive_context_baseline"]),
        executiveLabel: "Baseline executive advisory context may apply across operational systems",
      })
    );
  }

  logExecutiveStrategicAdvisoryDev("Advisory", { advisoryCount: advisories.length });
  return advisories.sort((a, b) => a.advisoryId.localeCompare(b.advisoryId));
}

export function analyzeExecutiveGuidanceSynthesis(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  recommendationState: StrategicRecommendationState;
  explainabilityState: ExecutiveExplainabilityState;
  governanceState: ExecutiveStrategicGovernanceState;
  comparisonState: ExecutiveMultiStrategyState;
  adaptationState: PredictiveStrategicAdaptationState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  preventionState: PredictiveCollapsePreventionState;
  cascadeState: PredictiveCascadeState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly ExecutiveGuidanceSynthesisRecord[] {
  const records: ExecutiveGuidanceSynthesisRecord[] = [];
  const advisoryIds = input.advisories.map((a) => a.advisoryId);

  const regions =
    input.advisories.flatMap((a) => a.affectedRegionIds).length > 0
      ? [...new Set(input.advisories.flatMap((a) => a.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const preventiveStrength = clamp01(
    input.cascadeState.cascadeAmplificationScore * 0.35 +
      input.divergenceState.futureFragmentationScore * 0.35 +
      (1 - input.preventionState.collapseInterruptionScore) * 0.2
  );
  if (preventiveStrength >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "synthesis::preventive-guidance",
        synthesisType: "strategic_guidance",
        synthesisStrength: preventiveStrength,
        explanation:
          "High dependency fragility combined with future divergence and recovery instability may warrant preventive executive advisory focused on dependency reduction.",
        contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(regions),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "synthesis::executive-context",
      synthesisType: "executive_context",
      synthesisStrength: clamp01(input.explainabilityState.reasoningTransparencyScore * 0.5),
      explanation:
        "Executive-context generation may frame recommendations within governance alignment and explainability traceability for audit-ready review.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "synthesis::resilience-framing",
      synthesisType: "resilience_framing",
      synthesisStrength: clamp01(input.adaptationState.adaptiveResilienceScore * 0.5),
      explanation:
        "Resilience-oriented advisory framing may emphasize long-term adaptive capacity alongside short-term stabilization needs.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "synthesis::stabilization-priority",
      synthesisType: "stabilization_priority",
      synthesisStrength: clamp01(
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.45 +
          input.recommendationState.stabilizationLeverageScore * 0.35
      ),
      explanation:
        "Stabilization-priority guidance may suggest prioritizing cross-domain recovery coordination before accelerating restructuring initiatives.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(
        input.recommendationState.stabilizationRecommendationZones.length > 0
          ? [...input.recommendationState.stabilizationRecommendationZones].sort().slice(0, 3)
          : regions
      ),
    }),
    Object.freeze({
      recordId: "synthesis::operational-narrative",
      synthesisType: "operational_narrative",
      synthesisStrength: clamp01(input.comparisonState.comparisonStabilityScore * 0.45),
      explanation:
        "Operational advisory narratives may synthesize competing strategic pathways into coherent executive guidance without mandating a single path.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "synthesis::future-preparedness",
      synthesisType: "future_preparedness",
      synthesisStrength: clamp01(
        input.divergenceState.futureConvergenceScore * 0.4 +
          (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.3
      ),
      explanation:
        "Future-preparedness guidance may note that long-term recovery trajectories remain unstable and phased stabilization could reduce coordination volatility.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveStrategicAdvisoryDev("ExecutiveGuidance", { synthesisRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateAdvisoryClarityScore(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  explainabilityState: ExecutiveExplainabilityState;
  confidenceState: RecommendationConfidenceState;
}): number {
  if (input.advisories.length === 0) return 0;
  const avgStrength =
    input.advisories.reduce((sum, a) => sum + a.advisoryStrength, 0) / input.advisories.length;
  return clamp01(
    avgStrength * 0.35 +
      input.explainabilityState.explanationClarityScore * 0.35 +
      input.confidenceState.overallConfidenceScore * 0.3
  );
}

export function calculateStrategicCoherenceScore(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  comparisonState: ExecutiveMultiStrategyState;
  governanceState: ExecutiveStrategicGovernanceState;
}): number {
  return clamp01(
    input.comparisonState.comparisonStabilityScore * 0.4 +
      input.governanceState.governanceStabilityScore * 0.35 +
      (input.advisories.filter((a) => a.advisoryState === "stabilizing" || a.advisoryState === "strategic")
        .length /
        Math.max(1, input.advisories.length)) *
        0.25
  );
}

export function calculateActionabilityScore(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  recommendationState: StrategicRecommendationState;
  memoryState: StrategicRecommendationMemoryState;
}): number {
  const actionable = input.advisories.filter(
    (a) =>
      a.advisoryState === "preventive" ||
      a.advisoryState === "stabilizing" ||
      a.advisoryState === "critical"
  ).length;
  return clamp01(
    (actionable / Math.max(1, input.advisories.length)) * 0.4 +
      input.recommendationState.stabilizationLeverageScore * 0.3 +
      input.memoryState.validationConfidenceScore * 0.3
  );
}

export function identifyExecutivePriorityZones(
  advisories: readonly ExecutiveStrategicAdvisorySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const a of advisories) {
    if (a.advisoryState === "critical" || a.advisoryState === "preventive") {
      for (const r of a.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyStrategicAdvisoryZones(
  advisories: readonly ExecutiveStrategicAdvisorySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const a of advisories) {
    if (
      a.advisoryState === "strategic" ||
      a.advisoryState === "stabilizing" ||
      a.advisoryState === "informational"
    ) {
      for (const r of a.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveAdvisoryLabel(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  advisoryClarityScore: number;
  actionabilityScore: number;
}): ExecutiveStrategicAdvisoryState["executiveAdvisoryLabel"] {
  const critical = input.advisories.filter((a) => a.advisoryState === "critical").length;
  const preventive = input.advisories.filter((a) => a.advisoryState === "preventive").length;
  const stabilizing = input.advisories.filter((a) => a.advisoryState === "stabilizing").length;

  if (critical > 0) return "critical";
  if (preventive > 0 && input.actionabilityScore >= 0.4) return "preventive";
  if (stabilizing > 0) return "stabilizing";
  if (input.advisoryClarityScore >= 0.55) return "strategic";
  return "informational";
}
