/**
 * D7:8:3 — Executive-readable strategic meta-causality semantics.
 */

import type {
  StrategicMetaCausalitySemantics,
  StrategicMetaCausalityIntelligenceState,
} from "./strategicMetaCausalityTypes.ts";
import {
  META_CAUSALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER,
} from "./strategicMetaCausalityGuards.ts";

export function buildStrategicMetaCausalitySemantics(input: {
  state: StrategicMetaCausalityIntelligenceState;
}): StrategicMetaCausalitySemantics {
  const optimizationChain = input.state.longHorizonCausalRecords.find((r) =>
    r.recordId.includes("optimization-risk")
  );
  const resilienceForce = input.state.strategicForcePropagationRecords.find((r) =>
    r.recordId.includes("resilience-degradation")
  );
  const causalAmplification = input.state.strategicForcePropagationRecords.find((r) =>
    r.recordId.includes("causal-amplification")
  );

  const headline =
    input.state.executiveMetaCausalityLabel === "destabilizing" ||
    input.state.executiveMetaCausalityLabel === "critical" ||
    (input.state.executiveMetaCausalityLabel === "systemic" &&
      input.state.metaCausalityInstabilityScore >= 0.45)
      ? optimizationChain && input.state.metaCausalityInstabilityScore >= 0.4
        ? "Current enterprise instability patterns appear increasingly driven by long-horizon optimization pressure that continues reducing resilience redundancy and amplifying dependency concentration across recovery coordination systems."
        : resilienceForce
          ? resilienceForce.explanation
          : causalAmplification
            ? causalAmplification.explanation
            : "Strategic meta-causal forces may be amplifying instability across interconnected enterprise systems under sustained optimization pressure."
      : input.state.executiveMetaCausalityLabel === "systemic" ||
          input.state.executiveMetaCausalityLabel === "propagating"
        ? "Strategic meta-causal structures may be propagating across domains, shaping how recurring patterns influence long-horizon enterprise evolution."
        : input.state.executiveMetaCausalityLabel === "localized"
          ? "Localized meta-causal drivers may be influencing specific domains while broader systemic forces remain contained under executive oversight."
          : optimizationChain
            ? optimizationChain.explanation
            : "Strategic meta-causality remains under active assessment across enterprise force structures.";

  const summaryParts: string[] = [];
  if (input.state.executiveMetaCausalityLabel === "localized") {
    summaryParts.push(
      "Localized meta-causality may indicate domain-specific strategic forces with limited systemic propagation."
    );
  } else if (input.state.executiveMetaCausalityLabel === "propagating") {
    summaryParts.push(
      "Propagating meta-causality may signal strategic forces spreading across interconnected operational systems."
    );
  } else if (input.state.executiveMetaCausalityLabel === "systemic") {
    summaryParts.push(
      "Systemic meta-causality may reflect enterprise-wide causal structures shaping long-horizon evolution."
    );
  } else if (input.state.executiveMetaCausalityLabel === "destabilizing") {
    summaryParts.push(
      "Destabilizing meta-causality may elevate when hidden forces amplify fragility and weaken continuity pathways."
    );
  } else {
    summaryParts.push(
      "Critical meta-causality conditions may threaten coherent strategic evolution until causal stabilization strengthens under executive control."
    );
  }
  summaryParts.push(
    `Indicative meta-causality coherence is ${(input.state.metaCausalityCoherenceScore * 100).toFixed(0)}% with long-horizon causal strength at ${(input.state.longHorizonCausalScore * 100).toFixed(0)}% and instability at ${(input.state.metaCausalityInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.metaCausalityAmbiguityDisclaimer || META_CAUSALITY_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousMetaCausalityDisclaimer || NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER
  );

  const metaCausalitySummaries = input.state.activeMetaCausalitySignals.map((s) => {
    const drivers = (s.dominantMetaCausalDrivers ?? []).join(", ") || "causal_drivers";
    return `${s.metaCausalityId}: ${s.metaCausalityState} (${drivers}, strength ${(s.metaCausalityStrength * 100).toFixed(0)}%).`;
  });

  const longHorizonSummaries = input.state.longHorizonCausalRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const forceSummaries = input.state.strategicForcePropagationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.strategicForceZones.length > 0) {
    bullets.push(`Strategic force zones: ${input.state.strategicForceZones.join(", ")}.`);
  }
  if (input.state.systemicMetaRiskZones.length > 0) {
    bullets.push(`Systemic meta-risk zones: ${input.state.systemicMetaRiskZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora models strategic forces, meta-causality, and long-horizon propagation; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    metaCausalitySummaries: Object.freeze(metaCausalitySummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    forceSummaries: Object.freeze(forceSummaries),
    bullets: Object.freeze(bullets),
  });
}
