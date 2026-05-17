/**
 * D7:6:2 — Executive-readable attention routing semantics.
 */

import type {
  ExecutiveAttentionRoutingSemantics,
  ExecutiveAttentionRoutingState,
} from "./executiveAttentionRoutingTypes.ts";
import {
  ROUTING_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_ROUTING_DISCLAIMER,
} from "./attentionRoutingGuards.ts";

export function buildExecutiveAttentionRoutingSemantics(input: {
  state: ExecutiveAttentionRoutingState;
}): ExecutiveAttentionRoutingSemantics {
  const logisticsFlow = input.state.dynamicPriorityFlowRecords.find((r) =>
    r.recordId.includes("fragility-priority")
  );
  const competing = input.state.attentionFragmentationRecords.find((r) =>
    r.recordId.includes("competing-priorities")
  );
  const topFragmentation = input.state.attentionFragmentationRecords[0];

  const headline =
    input.state.executiveAttentionRoutingLabel === "elevated" ||
    input.state.executiveAttentionRoutingLabel === "critical"
      ? "Executive attention priority has shifted toward logistics recovery coordination because dependency fragility and future divergence continue to intensify across manufacturing stabilization systems."
      : input.state.executiveAttentionRoutingLabel === "focused"
        ? "Stable equilibrium recovery and governance confidence may support reduced cognitive urgency across synchronized attention routes."
        : competing
          ? competing.explanation
          : logisticsFlow
            ? logisticsFlow.explanation
            : topFragmentation
              ? topFragmentation.explanation
              : "Executive attention routing remains under active assessment across strategic operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveAttentionRoutingLabel === "focused") {
    summaryParts.push(
      "Focused attention routing may concentrate executive cognition on highest-priority stabilization pathways."
    );
  } else if (input.state.executiveAttentionRoutingLabel === "elevated") {
    summaryParts.push(
      "Elevated attention routing may prioritize fragility and predictive escalation without hidden steering."
    );
  } else if (input.state.executiveAttentionRoutingLabel === "distributed") {
    summaryParts.push(
      "Distributed attention routing may reflect moderate urgency across multiple operational domains."
    );
  } else if (input.state.executiveAttentionRoutingLabel === "fragmented") {
    summaryParts.push(
      "Fragmented attention routing may indicate competing priorities that warrant executive sequencing review."
    );
  } else {
    summaryParts.push(
      "Critical attention routing may require executive simplification before focus stability can improve."
    );
  }
  summaryParts.push(
    `Indicative focus stability is ${(input.state.focusStabilityScore * 100).toFixed(0)}% with strategic urgency at ${(input.state.strategicUrgencyScore * 100).toFixed(0)}% and fragmentation at ${(input.state.attentionFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.routingAmbiguityDisclaimer || ROUTING_AMBIGUITY_DISCLAIMER);
  summaryParts.push(
    input.state.nonManipulationRoutingDisclaimer || NON_MANIPULATION_ROUTING_DISCLAIMER
  );

  const routingSummaries = input.state.activeAttentionRoutes.map((r) => {
    const drivers = (r.dominantRoutingDrivers ?? []).join(", ") || "routing_drivers";
    return `${r.routingId}: ${r.routingState} (${drivers}, strength ${(r.routingStrength * 100).toFixed(0)}%).`;
  });

  const priorityFlowSummaries = input.state.dynamicPriorityFlowRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.attentionFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.highPriorityAttentionZones.length > 0) {
    bullets.push(
      `High-priority attention zones: ${input.state.highPriorityAttentionZones.join(", ")}.`
    );
  }
  if (input.state.fragmentedAttentionZones.length > 0) {
    bullets.push(`Fragmented attention zones: ${input.state.fragmentedAttentionZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora routes attention priority for executive support; focus decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    routingSummaries: Object.freeze(routingSummaries),
    priorityFlowSummaries: Object.freeze(priorityFlowSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
