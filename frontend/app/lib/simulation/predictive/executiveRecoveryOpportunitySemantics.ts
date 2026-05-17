/**
 * D7:4:5 — Executive-readable recovery opportunity semantics.
 */

import type {
  ExecutiveRecoveryOpportunitySemantics,
  PredictiveRecoveryOpportunityState,
} from "./recoveryOpportunityTypes.ts";
import { RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER } from "./recoveryOpportunityGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveRecoveryOpportunitySemantics(input: {
  state: PredictiveRecoveryOpportunityState;
}): ExecutiveRecoveryOpportunitySemantics {
  const logisticsLeverage = input.state.recoveryLeveragePointRecords.find((r) =>
    r.recordId.includes("logistics-manufacturing")
  );
  const coordinationLeverage = input.state.recoveryLeveragePointRecords.find((r) =>
    r.recordId.includes("coordination-resilience")
  );
  const topStabilization = input.state.predictiveStabilizationRecords[0];

  const headline =
    logisticsLeverage
      ? "Current operational conditions suggest that moderate improvements in logistics coordination could significantly accelerate recovery stabilization across manufacturing systems."
      : coordinationLeverage
        ? "Improved executive alignment may create disproportionate recovery acceleration where coordination and resilience opportunities align."
        : topStabilization
          ? topStabilization.explanation
          : input.state.recoveryOpportunityLabel === "accelerating"
            ? "Recovery acceleration opportunities may emerge across regions where momentum and resilience conditions align."
            : input.state.recoveryOpportunityLabel === "fragile"
              ? "Recovery pathways remain fragile; stabilization opportunities may require careful coordination before acceleration."
              : "Predictive recovery opportunity patterns remain mixed under current operational and human-system conditions.";

  const summaryParts: string[] = [];
  if (input.state.recoveryOpportunityLabel === "accelerating") {
    summaryParts.push(
      "Recovery acceleration opportunities may strengthen where small coordination gains unlock resilience amplification."
    );
  } else if (input.state.recoveryOpportunityLabel === "stabilizing") {
    summaryParts.push(
      "Stabilization potential may increase as recovery signals propagate through interconnected operational domains."
    );
  } else if (input.state.recoveryOpportunityLabel === "emerging") {
    summaryParts.push(
      "Emerging recovery opportunities may form where dependency pressure eases and trust stabilization begins."
    );
  } else if (input.state.recoveryOpportunityLabel === "fragile") {
    summaryParts.push(
      "Fragile recovery pathways suggest opportunities exist but may dissipate without sustained coordination support."
    );
  } else {
    summaryParts.push(
      "Limited recovery opportunity signals indicate stabilization gains may remain constrained in the near term."
    );
  }
  summaryParts.push(
    `Indicative recovery acceleration is ${(input.state.recoveryAccelerationScore * 100).toFixed(0)}% with stabilization potential at ${(input.state.stabilizationPotentialScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.uncertaintyDisclaimer || RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER
  );

  const signalSummaries = input.state.activeRecoverySignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantOpportunityDrivers ?? []).join(", ") || "recovery_emergence";
    return `${regions}: may show ${s.opportunityState} opportunity (${drivers}, strength ${(s.opportunityStrength * 100).toFixed(0)}%).`;
  });

  const leverageSummaries = input.state.recoveryLeveragePointRecords.map((r) => r.explanation);
  const stabilizationSummaries = input.state.predictiveStabilizationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.stabilizationOpportunityZones.length > 0) {
    bullets.push(
      `Stabilization opportunity zones: ${input.state.stabilizationOpportunityZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.resilienceAccelerationZones.length > 0) {
    bullets.push(
      `Resilience acceleration zones: ${input.state.resilienceAccelerationZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    leverageSummaries,
    stabilizationSummaries,
    bullets,
  };
}
