/**
 * D7:5:6 — Executive-readable strategic governance semantics.
 */

import type {
  ExecutiveStrategicGovernanceSemantics,
  ExecutiveStrategicGovernanceState,
} from "./strategicGovernanceTypes.ts";
import {
  GOVERNANCE_AMBIGUITY_DISCLAIMER,
  NON_ENFORCEMENT_DISCLAIMER,
} from "./strategicGovernanceGuards.ts";

export function buildExecutiveStrategicGovernanceSemantics(input: {
  state: ExecutiveStrategicGovernanceState;
}): ExecutiveStrategicGovernanceSemantics {
  const divergenceSafety = input.state.recommendationSafetyRecords.find((r) =>
    r.recordId.includes("oversight-sensitive")
  );
  const alignmentStable = input.state.governanceAlignmentRecords.find((r) =>
    r.recordId.includes("resilience-coherence")
  );
  const topSafety = input.state.recommendationSafetyRecords[0];

  const headline =
    input.state.executiveGovernanceLabel === "aligned" ||
    input.state.executiveGovernanceLabel === "cautious"
      ? "Current recommendation pathways remain governance-aligned, although rising future divergence across logistics recovery systems suggests increased executive oversight is advisable."
      : divergenceSafety
        ? divergenceSafety.explanation
        : alignmentStable
          ? alignmentStable.explanation
          : topSafety
            ? topSafety.explanation
            : input.state.executiveGovernanceLabel === "critical"
              ? "Critical governance indicators may require elevated executive oversight before strategic recommendations proceed."
              : "Strategic governance posture remains under active executive assessment across recommendation pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveGovernanceLabel === "aligned") {
    summaryParts.push(
      "Aligned governance suggests strategic intelligence remains within resilience and confidence safeguards."
    );
  } else if (input.state.executiveGovernanceLabel === "cautious") {
    summaryParts.push(
      "Cautious governance may reflect rising oversight needs without implying autonomous restriction of recommendations."
    );
  } else if (input.state.executiveGovernanceLabel === "volatile") {
    summaryParts.push(
      "Volatile governance conditions may shift as recommendation confidence and future divergence evolve."
    );
  } else if (input.state.executiveGovernanceLabel === "restricted") {
    summaryParts.push(
      "Restricted governance signals may highlight zones where executive review is advisable before intervention."
    );
  } else {
    summaryParts.push(
      "Critical governance signals may warrant immediate executive oversight of strategic recommendation pathways."
    );
  }
  summaryParts.push(
    `Indicative governance stability is ${(input.state.governanceStabilityScore * 100).toFixed(0)}% with recommendation safety at ${(input.state.recommendationSafetyScore * 100).toFixed(0)}% and oversight requirement at ${(input.state.oversightRequirementScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.governanceAmbiguityDisclaimer || GOVERNANCE_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonEnforcementDisclaimer || NON_ENFORCEMENT_DISCLAIMER);

  const governanceSummaries = input.state.activeGovernanceSignals.map((g) => {
    const drivers = (g.dominantGovernanceDrivers ?? []).join(", ") || "governance_drivers";
    return `${g.governanceId}: ${g.governanceState} posture (${drivers}, strength ${(g.governanceStrength * 100).toFixed(0)}%).`;
  });

  const alignmentSummaries = input.state.governanceAlignmentRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const safetySummaries = input.state.recommendationSafetyRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.restrictedRecommendationZones.length > 0) {
    bullets.push(
      `Restricted recommendation zones: ${input.state.restrictedRecommendationZones.join(", ")}.`
    );
  }
  if (input.state.executiveOversightZones.length > 0) {
    bullets.push(`Executive oversight zones: ${input.state.executiveOversightZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora surfaces governance alignment and safety indicators; executives retain full authority over strategic action."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    governanceSummaries: Object.freeze(governanceSummaries),
    alignmentSummaries: Object.freeze(alignmentSummaries),
    safetySummaries: Object.freeze(safetySummaries),
    bullets: Object.freeze(bullets),
  });
}
