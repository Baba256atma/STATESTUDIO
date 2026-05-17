/**
 * D7:4:6 — Executive-readable collapse prevention semantics.
 */

import type {
  ExecutiveCollapsePreventionSemantics,
  PredictiveCollapsePreventionState,
} from "./collapsePreventionTypes.ts";
import { PREVENTION_UNCERTAINTY_DISCLAIMER } from "./preventionGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveCollapsePreventionSemantics(input: {
  state: PredictiveCollapsePreventionState;
}): ExecutiveCollapsePreventionSemantics {
  const logisticsPrevention = input.state.activePreventionSignals.find((s) =>
    s.signalId.includes("logistics-stabilization")
  );
  const trustPrevention = input.state.activePreventionSignals.find((s) =>
    s.signalId.includes("trust-coordination")
  );
  const topInterruption = input.state.stabilizationInterruptionRecords[0];

  const headline =
    logisticsPrevention
      ? "Current operational conditions suggest that moderate stabilization improvements in logistics coordination may significantly reduce future systemic fragility escalation across manufacturing recovery systems."
      : trustPrevention
        ? "Trust stabilization combined with coordination recovery may interrupt fragility amplification before systemic collapse pathways escalate."
        : topInterruption
          ? topInterruption.explanation
          : input.state.predictivePreventionLabel === "critical"
            ? "Critical collapse proximity may limit prevention windows; targeted stabilization may still reduce escalation risk in key operational domains."
            : input.state.predictivePreventionLabel === "intervenable"
              ? "Intervention-sensitive prevention windows may exist where recovery and cascade interruption align."
              : "Predictive collapse prevention patterns remain under active monitoring across interconnected enterprise systems.";

  const summaryParts: string[] = [];
  if (input.state.predictivePreventionLabel === "intervenable") {
    summaryParts.push(
      "Collapse interruption opportunities may strengthen where stabilization leverage and recovery coordination align."
    );
  } else if (input.state.predictivePreventionLabel === "stabilizing") {
    summaryParts.push(
      "Stabilization pathways may dampen cascading instability before critical thresholds are reached."
    );
  } else if (input.state.predictivePreventionLabel === "fragile") {
    summaryParts.push(
      "Fragile prevention windows suggest timely intervention may be needed to preserve operational equilibrium."
    );
  } else if (input.state.predictivePreventionLabel === "critical") {
    summaryParts.push(
      "Critical threshold proximity indicates elevated collapse risk with limited but meaningful prevention potential."
    );
  } else {
    summaryParts.push(
      "Monitoring conditions may reveal emerging prevention windows as operational stress evolves."
    );
  }
  summaryParts.push(
    `Indicative collapse interruption is ${(input.state.collapseInterruptionScore * 100).toFixed(0)}% with critical threshold proximity at ${(input.state.criticalThresholdProximityScore * 100).toFixed(0)}% and resilience preservation at ${(input.state.resiliencePreservationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || PREVENTION_UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activePreventionSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantPreventionDrivers ?? []).join(", ") || "prevention_window";
    return `${regions}: may be ${s.preventionState} (${drivers}, strength ${(s.preventionStrength * 100).toFixed(0)}%).`;
  });

  const interruptionSummaries = input.state.stabilizationInterruptionRecords.map(
    (r) => r.explanation
  );
  const preservationSummaries = input.state.resiliencePreservationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.stabilizationInterventionZones.length > 0) {
    bullets.push(
      `Stabilization intervention zones: ${input.state.stabilizationInterventionZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.criticalCollapseZones.length > 0) {
    bullets.push(
      `Critical collapse zones under watch: ${input.state.criticalCollapseZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    interruptionSummaries,
    preservationSummaries,
    bullets,
  };
}
