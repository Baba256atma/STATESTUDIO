/**
 * D7:7:8 — Executive-readable enterprise strategic continuity semantics.
 */

import type {
  EnterpriseStrategicContinuitySemantics,
  EnterpriseStrategicContinuityIntelligenceState,
} from "./enterpriseStrategicContinuityTypes.ts";
import {
  CONTINUITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CONTINUITY_DISCLAIMER,
} from "./enterpriseStrategicContinuityGuards.ts";

export function buildEnterpriseStrategicContinuitySemantics(input: {
  state: EnterpriseStrategicContinuityIntelligenceState;
}): EnterpriseStrategicContinuitySemantics {
  const operationalPreservation = input.state.longHorizonContinuityRecords.find((r) =>
    r.recordId.includes("operational-preservation")
  );
  const resilienceExhaustion = input.state.continuityFragmentationRecords.find((r) =>
    r.recordId.includes("resilience-exhaustion")
  );
  const collapseRisk = input.state.continuityFragmentationRecords.find((r) =>
    r.recordId.includes("collapse-risk")
  );

  const headline =
    input.state.executiveContinuityLabel === "stable" ||
    input.state.executiveContinuityLabel === "adaptive"
      ? "Enterprise operational continuity remains broadly preserved across logistics and recovery coordination systems, although governance fatigue and increasing recovery pressure are beginning to weaken long-horizon continuity resilience."
      : input.state.executiveContinuityLabel === "strained"
        ? resilienceExhaustion
          ? resilienceExhaustion.explanation
          : collapseRisk
            ? collapseRisk.explanation
            : "Enterprise strategic continuity may be strained as fragmentation pressure accumulates across domains."
        : input.state.executiveContinuityLabel === "fragmenting"
          ? collapseRisk
            ? collapseRisk.explanation
            : "Continuity fragmentation may threaten operational survival until preservation pathways strengthen under executive control."
          : input.state.executiveContinuityLabel === "critical"
            ? collapseRisk
              ? collapseRisk.explanation
              : "Critical continuity conditions may threaten long-horizon strategic existence under sustained disruption."
            : operationalPreservation
              ? operationalPreservation.explanation
              : "Enterprise strategic continuity remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveContinuityLabel === "stable") {
    summaryParts.push(
      "Stable continuity may indicate sustained operational coherence and strategic functionality across disruption."
    );
  } else if (input.state.executiveContinuityLabel === "adaptive") {
    summaryParts.push(
      "Adaptive continuity may reflect effective persistence through transformation and instability cycles."
    );
  } else if (input.state.executiveContinuityLabel === "strained") {
    summaryParts.push(
      "Strained continuity may signal weakening continuity pathways with rising recovery pressure."
    );
  } else if (input.state.executiveContinuityLabel === "fragmenting") {
    summaryParts.push(
      "Fragmenting continuity may elevate survival risk until coordination and governance pathways stabilize."
    );
  } else {
    summaryParts.push(
      "Critical continuity conditions may threaten long-horizon enterprise existence until preservation recovers under executive control."
    );
  }
  summaryParts.push(
    `Indicative long-horizon continuity is ${(input.state.longHorizonContinuityScore * 100).toFixed(0)}% with preservation at ${(input.state.continuityPreservationScore * 100).toFixed(0)}% and continuity pressure at ${(input.state.continuityPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.continuityAmbiguityDisclaimer || CONTINUITY_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousContinuityDisclaimer || NON_AUTONOMOUS_CONTINUITY_DISCLAIMER
  );

  const continuitySummaries = input.state.activeContinuitySignals.map((s) => {
    const drivers = (s.dominantContinuityDrivers ?? []).join(", ") || "continuity_drivers";
    return `${s.continuityId}: ${s.continuityState} (${drivers}, strength ${(s.continuityStrength * 100).toFixed(0)}%).`;
  });

  const persistenceSummaries = input.state.longHorizonContinuityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.continuityFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.preservedContinuityZones.length > 0) {
    bullets.push(
      `Preserved continuity zones: ${input.state.preservedContinuityZones.join(", ")}.`
    );
  }
  if (input.state.continuityFailureZones.length > 0) {
    bullets.push(
      `Continuity failure zones: ${input.state.continuityFailureZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models disruption, adaptation, continuity, and long-horizon survival; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    continuitySummaries: Object.freeze(continuitySummaries),
    persistenceSummaries: Object.freeze(persistenceSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
