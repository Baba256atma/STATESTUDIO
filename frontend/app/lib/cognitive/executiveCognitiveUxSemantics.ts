/**
 * D7:6:1 — Executive-readable cognitive UX semantics.
 */

import type {
  ExecutiveCognitiveUxSemantics,
  ExecutiveCognitiveUxState,
} from "./executiveCognitiveUxTypes.ts";
import {
  COGNITIVE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_UX_DISCLAIMER,
} from "./cognitiveUxGuards.ts";

export function buildExecutiveCognitiveUxSemantics(input: {
  state: ExecutiveCognitiveUxState;
}): ExecutiveCognitiveUxSemantics {
  const fragilityAttention = input.state.attentionPriorityRecords.find((r) =>
    r.recordId.includes("fragility-visibility")
  );
  const overloadRecord = input.state.cognitiveLoadRecords.find((r) =>
    r.recordId.includes("executive-overload")
  );
  const topLoad = input.state.cognitiveLoadRecords[0];

  const headline =
    input.state.executiveCognitiveLabel === "elevated" ||
    input.state.executiveCognitiveLabel === "critical"
      ? fragilityAttention?.explanation ??
        "Operational fragility signals across logistics recovery systems have been elevated in executive attention priority because future divergence and dependency pressure continue to intensify."
      : input.state.executiveCognitiveLabel === "focused" ||
          input.state.executiveCognitiveLabel === "stable"
        ? "Stable recovery conditions and governance confidence may support reduced cognitive urgency across synchronized strategic intelligence surfaces."
        : overloadRecord
          ? overloadRecord.explanation
          : topLoad
            ? topLoad.explanation
            : "Executive cognitive UX orchestration remains under active assessment across strategic interaction pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveCognitiveLabel === "focused") {
    summaryParts.push(
      "Focused cognition may support rapid understanding with low friction across prioritized intelligence surfaces."
    );
  } else if (input.state.executiveCognitiveLabel === "stable") {
    summaryParts.push(
      "Stable cognitive UX may indicate balanced attention routing with contained overload risk."
    );
  } else if (input.state.executiveCognitiveLabel === "elevated") {
    summaryParts.push(
      "Elevated attention priority may surface when fragility and divergence signals warrant executive focus without hidden steering."
    );
  } else if (input.state.executiveCognitiveLabel === "overloaded") {
    summaryParts.push(
      "Cognitive overload may elevate when competing alerts and fragmented attention increase interaction friction."
    );
  } else {
    summaryParts.push(
      "Critical cognitive conditions may require executive simplification before interaction quality can stabilize."
    );
  }
  summaryParts.push(
    `Indicative cognitive clarity is ${(input.state.cognitiveClarityScore * 100).toFixed(0)}% with attention priority at ${(input.state.attentionPriorityScore * 100).toFixed(0)}% and cognitive load at ${(input.state.cognitiveLoadScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.cognitiveAmbiguityDisclaimer || COGNITIVE_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonManipulationDisclaimer || NON_MANIPULATION_UX_DISCLAIMER);

  const cognitiveSummaries = input.state.activeCognitiveSignals.map((s) => {
    const drivers = (s.dominantCognitiveDrivers ?? []).join(", ") || "cognitive_drivers";
    return `${s.signalId}: ${s.cognitiveState} (${drivers}, strength ${(s.cognitiveStrength * 100).toFixed(0)}%).`;
  });

  const attentionSummaries = input.state.attentionPriorityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const loadSummaries = input.state.cognitiveLoadRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.attentionPriorityZones.length > 0) {
    bullets.push(`Attention priority zones: ${input.state.attentionPriorityZones.join(", ")}.`);
  }
  if (input.state.cognitiveOverloadZones.length > 0) {
    bullets.push(`Cognitive overload zones: ${input.state.cognitiveOverloadZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora orchestrates cognitive UX for executive support; interaction decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    cognitiveSummaries: Object.freeze(cognitiveSummaries),
    attentionSummaries: Object.freeze(attentionSummaries),
    loadSummaries: Object.freeze(loadSummaries),
    bullets: Object.freeze(bullets),
  });
}
