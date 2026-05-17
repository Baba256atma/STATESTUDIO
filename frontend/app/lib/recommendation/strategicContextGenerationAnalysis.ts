/**
 * D7:5:8 — Strategic-context generation analysis.
 */

import type { ExecutiveStrategicAdvisorySignal } from "./executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { StrategicContextRecord } from "./executiveStrategicAdvisoryTypes.ts";
import { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicContextGeneration(input: {
  advisories: readonly ExecutiveStrategicAdvisorySignal[];
  governanceState: ExecutiveStrategicGovernanceState;
  comparisonState: ExecutiveMultiStrategyState;
  confidenceState: RecommendationConfidenceState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
}): readonly StrategicContextRecord[] {
  const records: StrategicContextRecord[] = [];
  const advisoryIds = input.advisories.map((a) => a.advisoryId);

  if (input.governanceState.oversightRequirementScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "context::executive-priority",
        contextType: "executive_priority",
        contextStrength: input.governanceState.oversightRequirementScore,
        explanation:
          "Executive-priority conditions may elevate cross-domain recovery coordination ahead of expansion initiatives.",
        contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      })
    );
  }

  if (input.recoveryOpportunityState.stabilizationPotentialScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "context::stabilization-pathway",
        contextType: "stabilization_pathway",
        contextStrength: input.recoveryOpportunityState.stabilizationPotentialScore,
        explanation:
          "Actionable stabilization pathways may exist although leadership load and governance sensitivity could require phased advisory guidance.",
        contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "context::resilience-opportunity",
      contextType: "resilience_opportunity",
      contextStrength: clamp01(
        input.comparisonState.comparisonStabilityScore * 0.45 +
          input.confidenceState.evidenceStabilityScore * 0.35
      ),
      explanation:
        "Long-term resilience opportunities may emerge when memory-validated patterns align with current stabilization potential.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    })
  );

  if (input.governanceState.executiveGovernanceLabel === "restricted" ||
    input.governanceState.executiveGovernanceLabel === "critical") {
    records.push(
      Object.freeze({
        recordId: "context::governance-sensitive",
        contextType: "governance_sensitive",
        contextStrength: input.governanceState.oversightRequirementScore,
        explanation:
          "Governance-sensitive interventions may require explicit executive review before operational changes intensify.",
        contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      })
    );
  }

  if (
    input.confidenceState.recommendationConfidenceLabel === "volatile" &&
    input.comparisonState.executiveComparisonLabel === "volatile"
  ) {
    records.push(
      Object.freeze({
        recordId: "context::advisory-conflict",
        contextType: "advisory_conflict",
        contextStrength: clamp01(
          input.confidenceState.uncertaintyAmplificationScore * 0.5 +
            input.comparisonState.pathwayDivergenceScore * 0.4
        ),
        explanation:
          "Operational advisory conflicts may appear when confidence volatility aligns with divergent strategic pathway comparison.",
        contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "context::future-readiness",
      contextType: "future_readiness",
      contextStrength: clamp01(
        (1 - input.comparisonState.pathwayDivergenceScore) * 0.4 +
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.35
      ),
      explanation:
        "Future-readiness preparation may benefit from phased stabilization before restructuring efforts intensify under elevated volatility.",
      contributingAdvisoryIds: Object.freeze(advisoryIds.slice(0, 4)),
    })
  );

  logExecutiveStrategicAdvisoryDev("StrategicContext", { contextRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
