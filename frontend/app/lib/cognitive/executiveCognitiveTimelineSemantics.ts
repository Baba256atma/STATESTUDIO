/**
 * D7:6:6 — Executive-readable cognitive timeline semantics.
 */

import type {
  ExecutiveCognitiveTimelineSemantics,
  ExecutiveCognitiveTimelineIntelligenceState,
} from "./executiveCognitiveTimelineTypes.ts";
import {
  TIMELINE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_TIMELINE_DISCLAIMER,
} from "./cognitiveTimelineGuards.ts";

export function buildExecutiveCognitiveTimelineSemantics(input: {
  state: ExecutiveCognitiveTimelineIntelligenceState;
}): ExecutiveCognitiveTimelineSemantics {
  const urgencyMismatch = input.state.timelineFragmentationRecords.find((r) =>
    r.recordId.includes("urgency-mismatch")
  );
  const midTermHorizon = input.state.cognitiveHorizonRecords.find((r) =>
    r.recordId.includes("mid-term-recovery")
  );
  const topFragmentation = input.state.timelineFragmentationRecords[0];

  const headline =
    input.state.executiveTimelineLabel === "critical" ||
    input.state.executiveTimelineLabel === "immediate" ||
    input.state.executiveTimelineLabel === "transitional"
      ? "Immediate logistics instability continues to elevate operational fragility risk, although mid-term recovery coordination improvements may gradually stabilize long-term resilience trajectories."
      : input.state.executiveTimelineLabel === "long_horizon"
        ? "Long-horizon resilience transformation may remain actionable while immediate operational pressure moderates across synchronized enterprise pathways."
        : urgencyMismatch
          ? urgencyMismatch.explanation
          : midTermHorizon
            ? midTermHorizon.explanation
            : topFragmentation
              ? topFragmentation.explanation
              : "Executive cognitive timeline assessment remains under active evaluation across strategic operational horizons.";

  const summaryParts: string[] = [];
  if (input.state.executiveTimelineLabel === "immediate") {
    summaryParts.push(
      "Immediate timeline cognition may indicate short-horizon operational pressure requiring executive attention sequencing."
    );
  } else if (input.state.executiveTimelineLabel === "developing") {
    summaryParts.push(
      "Developing timeline cognition may reflect emerging temporal context across operational evolution pathways."
    );
  } else if (input.state.executiveTimelineLabel === "transitional") {
    summaryParts.push(
      "Transitional timeline cognition may indicate horizon shifts between immediate pressure and mid-term recovery sequencing."
    );
  } else if (input.state.executiveTimelineLabel === "long_horizon") {
    summaryParts.push(
      "Long-horizon timeline cognition may frame structural resilience transformation without deterministic future prophecy."
    );
  } else {
    summaryParts.push(
      "Critical timeline conditions may elevate multi-horizon tension until temporal cognition stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative timeline clarity is ${(input.state.timelineClarityScore * 100).toFixed(0)}% with multi-horizon score at ${(input.state.multiHorizonScore * 100).toFixed(0)}% and fragmentation at ${(input.state.timelineFragmentationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.timelineAmbiguityDisclaimer || TIMELINE_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonManipulationTimelineDisclaimer || NON_MANIPULATION_TIMELINE_DISCLAIMER
  );

  const timelineSummaries = input.state.activeTimelineSignals.map((t) => {
    const drivers = (t.dominantTimelineDrivers ?? []).join(", ") || "timeline_drivers";
    return `${t.timelineId}: ${t.timelineState} (${drivers}, strength ${(t.timelineStrength * 100).toFixed(0)}%).`;
  });

  const horizonSummaries = input.state.cognitiveHorizonRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.timelineFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.immediatePriorityZones.length > 0) {
    bullets.push(`Immediate priority zones: ${input.state.immediatePriorityZones.join(", ")}.`);
  }
  if (input.state.fragmentedTimelineZones.length > 0) {
    bullets.push(`Fragmented timeline zones: ${input.state.fragmentedTimelineZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora organizes timelines for executive support; temporal interpretation remains fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    timelineSummaries: Object.freeze(timelineSummaries),
    horizonSummaries: Object.freeze(horizonSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
