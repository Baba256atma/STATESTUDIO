/**
 * D7:6:4 — Executive-readable insight prioritization semantics.
 */

import type {
  ExecutiveInsightPrioritizationSemantics,
  ExecutiveInsightPrioritizationState,
} from "./executiveInsightPrioritizationTypes.ts";
import {
  PRIORITIZATION_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_PRIORITIZATION_DISCLAIMER,
} from "./insightPrioritizationGuards.ts";

export function buildExecutiveInsightPrioritizationSemantics(input: {
  state: ExecutiveInsightPrioritizationState;
}): ExecutiveInsightPrioritizationSemantics {
  const recoveryOpportunity = input.state.insightUrgencyRecords.find((r) =>
    r.recordId.includes("resilience-opportunity")
  );
  const predictiveHotspot = input.state.insightUrgencyRecords.find((r) =>
    r.recordId.includes("predictive-escalation")
  );
  const topUrgency = input.state.insightUrgencyRecords[0];

  const headline =
    input.state.executiveInsightPrioritizationLabel === "urgent" ||
    input.state.executiveInsightPrioritizationLabel === "critical" ||
    input.state.executiveInsightPrioritizationLabel === "elevated"
      ? "Recovery stabilization signals across logistics coordination systems have been elevated because predictive divergence pressure continues to intensify while resilience opportunities remain actionable."
      : input.state.executiveInsightPrioritizationLabel === "background"
        ? "Stable equilibrium and reduced predictive volatility may support lower-priority insight visibility across synchronized operational intelligence surfaces."
        : recoveryOpportunity
          ? recoveryOpportunity.explanation
          : predictiveHotspot
            ? predictiveHotspot.explanation
            : topUrgency
              ? topUrgency.explanation
              : "Executive insight prioritization remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveInsightPrioritizationLabel === "background") {
    summaryParts.push(
      "Background insight priority may indicate manageable strategic value with stable executive decision capacity."
    );
  } else if (input.state.executiveInsightPrioritizationLabel === "visible") {
    summaryParts.push(
      "Visible insight priority may reflect routine operational significance without artificial urgency inflation."
    );
  } else if (input.state.executiveInsightPrioritizationLabel === "elevated") {
    summaryParts.push(
      "Elevated insight priority may indicate concentrated strategic value across multiple intelligence layers."
    );
  } else if (input.state.executiveInsightPrioritizationLabel === "urgent") {
    summaryParts.push(
      "Urgent insight priority may warrant executive attention when predictive escalation and governance sensitivity align."
    );
  } else {
    summaryParts.push(
      "Critical insight priority conditions may elevate visibility for highest-value operational intelligence under executive control."
    );
  }
  summaryParts.push(
    `Indicative strategic insight score is ${(input.state.strategicInsightScore * 100).toFixed(0)}% with strategic value at ${(input.state.strategicValueScore * 100).toFixed(0)}% and urgency escalation at ${(input.state.urgencyEscalationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.prioritizationAmbiguityDisclaimer || PRIORITIZATION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationPrioritizationDisclaimer ||
      NON_MANIPULATION_PRIORITIZATION_DISCLAIMER
  );

  const insightSummaries = input.state.activeInsightPriorities.map((s) => {
    const drivers = (s.dominantPriorityDrivers ?? []).join(", ") || "priority_drivers";
    return `${s.insightId}: ${s.priorityState} (${drivers}, strength ${(s.priorityStrength * 100).toFixed(0)}%).`;
  });

  const valueSummaries = input.state.strategicValueRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const urgencySummaries = input.state.insightUrgencyRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.elevatedInsightZones.length > 0) {
    bullets.push(`Elevated insight zones: ${input.state.elevatedInsightZones.join(", ")}.`);
  }
  if (input.state.lowSignalNoiseZones.length > 0) {
    bullets.push(`Low-signal noise zones: ${input.state.lowSignalNoiseZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora prioritizes insights for executive support; strategic visibility decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    insightSummaries: Object.freeze(insightSummaries),
    valueSummaries: Object.freeze(valueSummaries),
    urgencySummaries: Object.freeze(urgencySummaries),
    bullets: Object.freeze(bullets),
  });
}
