/**
 * D7:5:8 — Executive-readable strategic advisory semantics.
 */

import type {
  ExecutiveStrategicAdvisorySemantics,
  ExecutiveStrategicAdvisoryState,
} from "./executiveStrategicAdvisoryTypes.ts";
import {
  ADVISORY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_AUTHORITY_DISCLAIMER,
} from "./advisoryGuards.ts";

export function buildExecutiveStrategicAdvisorySemantics(input: {
  state: ExecutiveStrategicAdvisoryState;
}): ExecutiveStrategicAdvisorySemantics {
  const stabilizationGuidance = input.state.executiveGuidanceSynthesisRecords.find((r) =>
    r.recordId.includes("stabilization-priority")
  );
  const futurePreparedness = input.state.executiveGuidanceSynthesisRecords.find((r) =>
    r.recordId.includes("future-preparedness")
  );
  const phasedContext = input.state.strategicContextRecords.find((r) =>
    r.recordId.includes("stabilization-pathway")
  );
  const topSynthesis = input.state.executiveGuidanceSynthesisRecords[0];

  const headline =
    stabilizationGuidance ||
    input.state.executiveAdvisoryLabel === "preventive" ||
    input.state.executiveAdvisoryLabel === "stabilizing"
      ? "Current operational conditions suggest prioritizing cross-domain recovery coordination before accelerating restructuring initiatives, because dependency fragility and future volatility remain elevated."
      : futurePreparedness
        ? "Long-term recovery trajectories remain unstable. A phased stabilization strategy may reduce coordination volatility before restructuring efforts intensify."
        : phasedContext
          ? phasedContext.explanation
          : topSynthesis
            ? topSynthesis.explanation
            : input.state.executiveAdvisoryLabel === "critical"
              ? "Critical advisory conditions may require immediate executive attention across priority operational zones."
              : "Executive strategic advisory guidance remains under active synthesis across operational intelligence.";

  const summaryParts: string[] = [];
  if (input.state.executiveAdvisoryLabel === "preventive") {
    summaryParts.push(
      "Preventive advisory may emphasize dependency reduction and stabilization before high-volatility restructuring."
    );
  } else if (input.state.executiveAdvisoryLabel === "stabilizing") {
    summaryParts.push(
      "Stabilizing advisory may prioritize recovery coordination and phased operational alignment."
    );
  } else if (input.state.executiveAdvisoryLabel === "strategic") {
    summaryParts.push(
      "Strategic advisory may synthesize competing pathways into coherent guidance without mandating a single decision."
    );
  } else if (input.state.executiveAdvisoryLabel === "critical") {
    summaryParts.push(
      "Critical advisory may highlight zones requiring immediate executive review and governance-aware action."
    );
  } else {
    summaryParts.push(
      "Informational advisory may provide contextual framing for ongoing operational assessment."
    );
  }
  summaryParts.push(
    `Indicative advisory clarity is ${(input.state.advisoryClarityScore * 100).toFixed(0)}% with strategic coherence at ${(input.state.strategicCoherenceScore * 100).toFixed(0)}% and actionability at ${(input.state.actionabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.advisoryAmbiguityDisclaimer || ADVISORY_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonAutonomousAuthorityDisclaimer || NON_AUTONOMOUS_AUTHORITY_DISCLAIMER);

  const advisorySummaries = input.state.activeAdvisories.map((a) => {
    const drivers = (a.dominantAdvisoryDrivers ?? []).join(", ") || "advisory_drivers";
    return `${a.advisoryId}: ${a.advisoryState} guidance (${drivers}, strength ${(a.advisoryStrength * 100).toFixed(0)}%).`;
  });

  const guidanceSummaries = input.state.executiveGuidanceSynthesisRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const contextSummaries = input.state.strategicContextRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.executivePriorityZones.length > 0) {
    bullets.push(`Executive priority zones: ${input.state.executivePriorityZones.join(", ")}.`);
  }
  if (input.state.strategicAdvisoryZones.length > 0) {
    bullets.push(`Strategic advisory zones: ${input.state.strategicAdvisoryZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora synthesizes advisory intelligence for executive support; strategic decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    advisorySummaries: Object.freeze(advisorySummaries),
    guidanceSummaries: Object.freeze(guidanceSummaries),
    contextSummaries: Object.freeze(contextSummaries),
    bullets: Object.freeze(bullets),
  });
}
