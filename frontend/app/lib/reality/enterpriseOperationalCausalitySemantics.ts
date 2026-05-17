/**
 * D7:7:3 — Executive-readable enterprise operational causality semantics.
 */

import type {
  EnterpriseOperationalCausalitySemantics,
  EnterpriseOperationalCausalityIntelligenceState,
} from "./enterpriseOperationalCausalityTypes.ts";
import {
  CAUSALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CAUSALITY_DISCLAIMER,
} from "./enterpriseOperationalCausalityGuards.ts";

export function buildEnterpriseOperationalCausalitySemantics(input: {
  state: EnterpriseOperationalCausalityIntelligenceState;
}): EnterpriseOperationalCausalitySemantics {
  const operationalRoot = input.state.rootCauseRecords.find((r) =>
    r.recordId.includes("operational-cause")
  );
  const organizationalRoot = input.state.rootCauseRecords.find((r) =>
    r.recordId.includes("organizational-structure")
  );
  const cascading = input.state.causalPropagationRecords.find((r) =>
    r.recordId.includes("cascading-consequence")
  );

  const headline =
    input.state.executiveCausalityLabel === "localized" ||
    input.state.executiveCausalityLabel === "propagating"
      ? "Current logistics instability appears to originate from supplier dependency concentration and leadership coordination overload, which are now propagating into manufacturing recovery pathways and increasing long-term operational fragility."
      : input.state.executiveCausalityLabel === "systemic" ||
          input.state.executiveCausalityLabel === "unstable"
        ? cascading
          ? cascading.explanation
          : organizationalRoot
            ? organizationalRoot.explanation
            : "Systemic operational causality may require consolidation when propagation chains intensify across domains."
        : input.state.executiveCausalityLabel === "critical"
          ? cascading
            ? cascading.explanation
            : "Critical causality conditions may elevate strategic risk until root pressures stabilize under executive control."
          : operationalRoot
            ? operationalRoot.explanation
            : "Enterprise operational causality remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveCausalityLabel === "localized") {
    summaryParts.push(
      "Localized causality may indicate contained operational pressures with traceable root causes."
    );
  } else if (input.state.executiveCausalityLabel === "propagating") {
    summaryParts.push(
      "Propagating causality may reflect downstream effects moving across interconnected enterprise domains."
    );
  } else if (input.state.executiveCausalityLabel === "systemic") {
    summaryParts.push(
      "Systemic causality may suggest cross-domain cause-and-effect chains affecting strategic continuity."
    );
  } else if (input.state.executiveCausalityLabel === "unstable") {
    summaryParts.push(
      "Unstable causality may signal amplification risk when propagation pathways intensify."
    );
  } else {
    summaryParts.push(
      "Critical causality conditions may elevate enterprise risk until evidence-grounded root causes are addressed under executive control."
    );
  }
  summaryParts.push(
    `Indicative causality clarity is ${(input.state.causalityClarityScore * 100).toFixed(0)}% with root-cause clarity at ${(input.state.rootCauseClarityScore * 100).toFixed(0)}% and propagation at ${(input.state.causalPropagationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.causalityAmbiguityDisclaimer || CAUSALITY_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousCausalityDisclaimer || NON_AUTONOMOUS_CAUSALITY_DISCLAIMER
  );

  const causalitySummaries = input.state.activeCausalitySignals.map((s) => {
    const drivers = (s.dominantCausalDrivers ?? []).join(", ") || "causal_drivers";
    return `${s.causalityId}: ${s.causalityState} (${drivers}, strength ${(s.causalityStrength * 100).toFixed(0)}%).`;
  });

  const rootCauseSummaries = input.state.rootCauseRecords.slice(0, 4).map((r) => r.explanation);

  const propagationSummaries = input.state.causalPropagationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.rootCauseZones.length > 0) {
    bullets.push(`Root cause zones: ${input.state.rootCauseZones.join(", ")}.`);
  }
  if (input.state.propagationRiskZones.length > 0) {
    bullets.push(`Propagation risk zones: ${input.state.propagationRiskZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models operational causality as cause, propagation, and consequence; strategic decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    causalitySummaries: Object.freeze(causalitySummaries),
    rootCauseSummaries: Object.freeze(rootCauseSummaries),
    propagationSummaries: Object.freeze(propagationSummaries),
    bullets: Object.freeze(bullets),
  });
}
