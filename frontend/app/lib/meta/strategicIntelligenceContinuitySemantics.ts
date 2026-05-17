/**
 * D7:8:8 — Executive-readable strategic intelligence continuity semantics.
 */

import type {
  StrategicIntelligenceContinuitySemantics,
  StrategicIntelligenceContinuityIntelligenceState,
} from "./strategicIntelligenceContinuityTypes.ts";
import {
  CONTINUITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CONTINUITY_DISCLAIMER,
} from "./strategicIntelligenceContinuityGuards.ts";

export function buildStrategicIntelligenceContinuitySemantics(input: {
  state: StrategicIntelligenceContinuityIntelligenceState;
}): StrategicIntelligenceContinuitySemantics {
  const governanceAdaptation = input.state.longHorizonContinuityRecords.find((r) =>
    r.recordId.includes("governance-adaptation")
  );
  const collapsePathway = input.state.continuityFragmentationRecords.find((r) =>
    r.recordId.includes("collapse-pathway")
  );
  const continuityDegradation = input.state.continuityFragmentationRecords.find((r) =>
    r.recordId.includes("continuity-degradation")
  );

  const headline =
    input.state.executiveContinuityLabel === "stable" ||
    input.state.executiveContinuityLabel === "adaptive" ||
    input.state.executiveContinuityLabel === "recovering"
      ? governanceAdaptation && input.state.fragmentationPressureScore >= 0.35
        ? "Enterprise strategic intelligence remains broadly continuous as resilience adaptation and governance coordination continue stabilizing long-horizon operational coherence, although predictive volatility and optimization pressure are beginning to strain continuity preservation capacity."
        : "Enterprise strategic intelligence may remain continuous as resilience adaptation and governance coordination preserve long-horizon direction under executive oversight."
      : input.state.executiveContinuityLabel === "fragmenting"
        ? collapsePathway
          ? collapsePathway.explanation
          : continuityDegradation
            ? continuityDegradation.explanation
            : "Strategic intelligence continuity may be fragmenting as optimization overload and leadership fragmentation strain preservation capacity."
        : input.state.executiveContinuityLabel === "critical"
          ? "Critical continuity conditions may elevate when strategic continuity collapse risk compounds across governance, resilience, and equilibrium systems."
          : governanceAdaptation
            ? governanceAdaptation.explanation
            : "Strategic intelligence continuity remains under active assessment across enterprise cognition systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveContinuityLabel === "stable") {
    summaryParts.push(
      "Stable continuity may indicate strategic intelligence preserves long-horizon direction across evolving enterprise realities."
    );
  } else if (input.state.executiveContinuityLabel === "adaptive") {
    summaryParts.push(
      "Adaptive continuity may reflect strategic intelligence absorbing disruption without losing operational meaning across time."
    );
  } else if (input.state.executiveContinuityLabel === "recovering") {
    summaryParts.push(
      "Recovering continuity may signal restoration pathways rebuilding coherence after sustained fragmentation pressure."
    );
  } else if (input.state.executiveContinuityLabel === "fragmenting") {
    summaryParts.push(
      "Fragmenting continuity may elevate when declining redundancy and leadership overload weaken long-horizon preservation."
    );
  } else {
    summaryParts.push(
      "Critical continuity conditions may threaten strategic survival until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative long-horizon continuity is ${(input.state.longHorizonStrategicContinuityScore * 100).toFixed(0)}% with adaptive continuity at ${(input.state.adaptiveContinuityScore * 100).toFixed(0)}% and fragmentation pressure at ${(input.state.fragmentationPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.continuityAmbiguityDisclaimer || CONTINUITY_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousContinuityDisclaimer || NON_AUTONOMOUS_CONTINUITY_DISCLAIMER
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    continuitySummaries: Object.freeze(
      input.state.activeContinuitySignals.map((s) => {
        const drivers = (s.dominantContinuityDrivers ?? []).join(", ") || "continuity_drivers";
        return `${s.continuityId}: ${s.continuityState} (${drivers}, strength ${(s.continuityStrength * 100).toFixed(0)}%).`;
      })
    ),
    longHorizonSummaries: Object.freeze(
      input.state.longHorizonContinuityRecords.slice(0, 4).map((r) => r.explanation)
    ),
    fragmentationSummaries: Object.freeze(
      input.state.continuityFragmentationRecords.slice(0, 4).map((r) => r.explanation)
    ),
    bullets: Object.freeze([
      ...(input.state.preservedContinuityZones.length > 0
        ? [`Preserved continuity zones: ${input.state.preservedContinuityZones.join(", ")}.`]
        : []),
      ...(input.state.continuityFailureZones.length > 0
        ? [`Continuity failure zones: ${input.state.continuityFailureZones.join(", ")}.`]
        : []),
      "Nexora models disruption, adaptation, continuity, and long-horizon strategic survival; strategic authority remains fully under executive control.",
    ]),
  });
}
