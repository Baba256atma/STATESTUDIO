/**
 * D7:6:10 — Executive-readable cognitive orchestration completion semantics.
 */

import type {
  ExecutiveCognitiveCompletionSemantics,
  ExecutiveCognitiveCompletionIntelligenceState,
} from "./executiveCognitiveCompletionTypes.ts";
import {
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
} from "./cognitiveCompletionGuards.ts";

export function buildExecutiveCognitiveCompletionSemantics(input: {
  state: ExecutiveCognitiveCompletionIntelligenceState;
}): ExecutiveCognitiveCompletionSemantics {
  const strategicContinuity = input.state.fullCognitiveSynchronizationRecords.find((r) =>
    r.recordId.includes("strategic-continuity")
  );
  const orchestrationDegradation = input.state.platformCoherenceRecords.find((r) =>
    r.recordId.includes("orchestration-degradation")
  );
  const fullSync = input.state.fullCognitiveSynchronizationRecords.find((r) =>
    r.recordId.includes("full-cognition")
  );

  const headline =
    input.state.executiveCompletionLabel === "synchronized" ||
    input.state.executiveCompletionLabel === "stable" ||
    input.state.executiveCompletionLabel === "coherent"
      ? "Executive cognition systems remain strongly synchronized around recovery stabilization priorities, although predictive volatility across manufacturing governance pathways continues to introduce moderate orchestration instability."
      : input.state.executiveCompletionLabel === "fragmented" ||
          input.state.executiveCompletionLabel === "critical"
        ? orchestrationDegradation
          ? orchestrationDegradation.explanation
          : "Executive cognitive orchestration may require consolidation when platform layers diverge across timelines, narratives, and immersion systems."
        : strategicContinuity
          ? strategicContinuity.explanation
          : fullSync
            ? fullSync.explanation
            : "Executive cognitive orchestration completion remains under active assessment across the strategic platform.";

  const summaryParts: string[] = [];
  if (input.state.executiveCompletionLabel === "stable") {
    summaryParts.push(
      "Stable completion may indicate finalized orchestration with manageable platform coherence."
    );
  } else if (input.state.executiveCompletionLabel === "coherent") {
    summaryParts.push(
      "Coherent completion may reflect aligned cognition layers across the executive platform."
    );
  } else if (input.state.executiveCompletionLabel === "synchronized") {
    summaryParts.push(
      "Synchronized completion may indicate full integration of attention, insight, timelines, immersion, and governance."
    );
  } else if (input.state.executiveCompletionLabel === "fragmented") {
    summaryParts.push(
      "Fragmented completion may suggest disconnected systems are weakening unified executive cognition."
    );
  } else {
    summaryParts.push(
      "Critical completion conditions may elevate orchestration risk until platform coherence stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative overall cognitive coherence is ${(input.state.overallCognitiveCoherenceScore * 100).toFixed(0)}% with full sync at ${(input.state.fullCognitiveSyncScore * 100).toFixed(0)}% and platform degradation at ${(input.state.platformCoherenceDegradationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.completionAmbiguityDisclaimer || COMPLETION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousCompletionDisclaimer || NON_AUTONOMOUS_COMPLETION_DISCLAIMER
  );

  const completionSummaries = input.state.activeCompletionSignals.map((s) => {
    const drivers = (s.dominantCompletionDrivers ?? []).join(", ") || "completion_drivers";
    return `${s.completionId}: ${s.completionState} (${drivers}, strength ${(s.completionStrength * 100).toFixed(0)}%).`;
  });

  const syncSummaries = input.state.fullCognitiveSynchronizationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const coherenceSummaries = input.state.platformCoherenceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.synchronizedExecutiveZones.length > 0) {
    bullets.push(
      `Synchronized executive zones: ${input.state.synchronizedExecutiveZones.join(", ")}.`
    );
  }
  if (input.state.orchestrationInstabilityZones.length > 0) {
    bullets.push(
      `Orchestration instability zones: ${input.state.orchestrationInstabilityZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora finalizes executive cognitive orchestration; platform integration decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    completionSummaries: Object.freeze(completionSummaries),
    syncSummaries: Object.freeze(syncSummaries),
    coherenceSummaries: Object.freeze(coherenceSummaries),
    bullets: Object.freeze(bullets),
  });
}
