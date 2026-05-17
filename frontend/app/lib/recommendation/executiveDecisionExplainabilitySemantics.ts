/**
 * D7:5:7 — Executive-readable decision explainability semantics.
 */

import type {
  ExecutiveDecisionExplainabilitySemantics,
  ExecutiveExplainabilityState,
} from "./executiveExplainabilityTypes.ts";
import {
  EXPLAINABILITY_AMBIGUITY_DISCLAIMER,
  NON_OPAQUE_REASONING_DISCLAIMER,
} from "./explainabilityGuards.ts";

export function buildExecutiveDecisionExplainabilitySemantics(input: {
  state: ExecutiveExplainabilityState;
}): ExecutiveDecisionExplainabilitySemantics {
  const signalTrace = input.state.recommendationTraceRecords.find((r) =>
    r.recordId.includes("signal-to-decision")
  );
  const coordinationTrace = input.state.recommendationTraceRecords.find((r) =>
    r.recordId.includes("operational-causality")
  );
  const weakSupport = input.state.signalToDecisionRecords.find((r) =>
    r.recordId.includes("weakly-supported")
  );
  const topTrace = input.state.recommendationTraceRecords[0];

  const headline =
    input.state.executiveExplainabilityLabel === "clear" ||
    input.state.executiveExplainabilityLabel === "supported"
      ? "This recommendation was generated because dependency pressure increased across logistics systems while recovery coordination stability weakened and future instability divergence expanded."
      : coordinationTrace
        ? coordinationTrace.explanation
        : signalTrace
          ? signalTrace.explanation
          : weakSupport
            ? weakSupport.explanation
            : topTrace
              ? topTrace.explanation
              : input.state.executiveExplainabilityLabel === "restricted"
                ? "Explainability may be restricted where evidence remains ambiguous although recommendations remain auditable."
                : "Strategic recommendation explainability remains under active trace assessment across operational signals.";

  const summaryParts: string[] = [];
  if (input.state.executiveExplainabilityLabel === "clear") {
    summaryParts.push(
      "Clear explainability suggests recommendation drivers are traceable to operational and predictive signals."
    );
  } else if (input.state.executiveExplainabilityLabel === "supported") {
    summaryParts.push(
      "Supported explainability may provide sufficient audit trails for executive review without implying certainty."
    );
  } else if (input.state.executiveExplainabilityLabel === "ambiguous") {
    summaryParts.push(
      "Ambiguous explainability may reflect incomplete evidence although signal pathways remain partially traceable."
    );
  } else if (input.state.executiveExplainabilityLabel === "volatile") {
    summaryParts.push(
      "Volatile explainability may shift as trajectory and divergence signals evolve across operational futures."
    );
  } else {
    summaryParts.push(
      "Restricted explainability may highlight zones where executives should audit reasoning before acting on recommendations."
    );
  }
  summaryParts.push(
    `Indicative explanation clarity is ${(input.state.explanationClarityScore * 100).toFixed(0)}% with traceability at ${(input.state.traceabilityScore * 100).toFixed(0)}% and reasoning transparency at ${(input.state.reasoningTransparencyScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.explainabilityAmbiguityDisclaimer || EXPLAINABILITY_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonOpaqueReasoningDisclaimer || NON_OPAQUE_REASONING_DISCLAIMER);

  const explanationSummaries = input.state.activeExplainabilitySignals.map((e) => {
    const drivers = (e.dominantExplanationDrivers ?? []).join(", ") || "explanation_drivers";
    return `${e.explanationId}: ${e.explainabilityState} trace (${drivers}, strength ${(e.explanationStrength * 100).toFixed(0)}%).`;
  });

  const traceSummaries = input.state.recommendationTraceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const signalSummaries = input.state.signalToDecisionRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.traceabilityZones.length > 0) {
    bullets.push(`Traceability zones: ${input.state.traceabilityZones.join(", ")}.`);
  }
  if (input.state.ambiguityExplanationZones.length > 0) {
    bullets.push(`Ambiguity explanation zones: ${input.state.ambiguityExplanationZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora traces signal-to-decision pathways for executive audit; reasoning remains transparent and non-opaque."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    explanationSummaries: Object.freeze(explanationSummaries),
    traceSummaries: Object.freeze(traceSummaries),
    signalSummaries: Object.freeze(signalSummaries),
    bullets: Object.freeze(bullets),
  });
}
