/**
 * D7:5:6 — Recommendation-safety analysis.
 */

import type { StrategicGovernanceSignal } from "./strategicGovernanceTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationMemoryState } from "./recommendationMemoryTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { RecommendationSafetyRecord } from "./strategicGovernanceTypes.ts";
import { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeRecommendationSafety(input: {
  governanceSignals: readonly StrategicGovernanceSignal[];
  comparisonState: ExecutiveMultiStrategyState;
  memoryState: StrategicRecommendationMemoryState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly RecommendationSafetyRecord[] {
  const records: RecommendationSafetyRecord[] = [];
  const governanceIds = input.governanceSignals.map((g) => g.governanceId);

  const unstablePathway = clamp01(
    input.comparisonState.pathwayDivergenceScore * 0.4 +
      input.trajectoryState.trajectoryVolatilityScore * 0.35
  );
  if (unstablePathway >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "safety::unstable-pathway",
        safetyType: "unstable_pathway",
        safetyStrength: unstablePathway,
        explanation:
          "Unstable recommendation pathways may warrant executive review when future trajectories diverge across operational futures.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  const riskAmplification = clamp01(
    input.comparisonState.resilienceRiskAsymmetryScore * 0.4 +
      input.cascadeState.cascadeAmplificationScore * 0.35 +
      input.memoryState.patternRecurrenceScore * 0.2
  );
  if (riskAmplification >= 0.35) {
    records.push(
      Object.freeze({
        recordId: "safety::governance-risk-amplification",
        safetyType: "governance_risk_amplification",
        safetyStrength: riskAmplification,
        explanation:
          "Governance-risk amplification may rise when memory detects repeated instability patterns across recommendation history.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  if (
    input.confidenceState.overallConfidenceScore < 0.45 &&
    input.divergenceState.futureFragmentationScore >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "safety::confidence-governance-conflict",
        safetyType: "confidence_conflict",
        safetyStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            (1 - input.confidenceState.overallConfidenceScore) * 0.4
        ),
        explanation:
          "Confidence-governance conflicts may emerge when low recommendation confidence coincides with rising future divergence.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  const aggressiveStrategy = input.comparisonState.activeStrategyComparisons.find(
    (s) => s.strategyId === "strategy-b"
  );
  if (
    aggressiveStrategy &&
    input.divergenceState.futureFragmentationScore >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "safety::oversight-sensitive-restructuring",
        safetyType: "oversight_sensitive_action",
        safetyStrength: clamp01(
          aggressiveStrategy.comparisonStrength * 0.4 +
            input.divergenceState.futureFragmentationScore * 0.4
        ),
        explanation:
          "Aggressive restructuring recommendations combined with high future divergence may indicate a governance review requirement.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  const fragileIntervention = clamp01(
    input.memoryState.repeatedFailureZones.length * 0.15 +
      input.confidenceState.uncertaintyAmplificationScore * 0.4
  );
  if (fragileIntervention >= 0.3) {
    records.push(
      Object.freeze({
        recordId: "safety::fragile-intervention",
        safetyType: "fragile_intervention",
        safetyStrength: fragileIntervention,
        explanation:
          "Fragile intervention assumptions may appear when repeated failure zones overlap with elevated recommendation ambiguity.",
        contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
      })
    );
  }

  const volatilityEscalation = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.45 +
      input.confidenceState.uncertaintyAmplificationScore * 0.35
  );
  records.push(
    Object.freeze({
      recordId: "safety::volatility-escalation",
      safetyType: "volatility_escalation",
      safetyStrength: volatilityEscalation,
      explanation:
        "Recommendation volatility escalation may signal governance caution even when pathways remain technically permissible.",
      contributingGovernanceIds: Object.freeze(governanceIds.slice(0, 4)),
    })
  );

  logStrategicGovernanceDev("RecommendationSafety", { safetyRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
