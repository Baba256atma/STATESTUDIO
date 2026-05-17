/**
 * D7:7:5 — Executive-readable enterprise strategic resilience semantics.
 */

import type {
  EnterpriseStrategicResilienceSemantics,
  EnterpriseStrategicResilienceIntelligenceState,
} from "./enterpriseStrategicResilienceTypes.ts";
import {
  RESILIENCE_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
} from "./enterpriseStrategicResilienceGuards.ts";

export function buildEnterpriseStrategicResilienceSemantics(input: {
  state: EnterpriseStrategicResilienceIntelligenceState;
}): EnterpriseStrategicResilienceSemantics {
  const operationalRecovery = input.state.adaptiveRecoveryRecords.find((r) =>
    r.recordId.includes("operational-adaptation")
  );
  const resilienceDegradation = input.state.resilienceCapacityRecords.find((r) =>
    r.recordId.includes("resilience-degradation")
  );
  const recoveryFatigue = input.state.resilienceCapacityRecords.find((r) =>
    r.recordId.includes("recovery-fatigue")
  );

  const headline =
    input.state.executiveResilienceLabel === "stable" ||
    input.state.executiveResilienceLabel === "adaptive" ||
    input.state.executiveResilienceLabel === "recovering"
      ? "Operational recovery systems across logistics and manufacturing domains continue adapting effectively under pressure, although governance fragmentation and repeated coordination overload are beginning to weaken long-horizon resilience capacity."
      : input.state.executiveResilienceLabel === "strained"
        ? recoveryFatigue
          ? recoveryFatigue.explanation
          : resilienceDegradation
            ? resilienceDegradation.explanation
            : "Enterprise resilience may be strained as recovery pressure accumulates across domains."
        : input.state.executiveResilienceLabel === "critical"
          ? resilienceDegradation
            ? resilienceDegradation.explanation
            : "Critical resilience conditions may threaten strategic operational continuity under sustained pressure."
          : operationalRecovery
            ? operationalRecovery.explanation
            : "Enterprise strategic resilience remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveResilienceLabel === "stable") {
    summaryParts.push(
      "Stable resilience may indicate strong capacity to absorb pressure while preserving continuity."
    );
  } else if (input.state.executiveResilienceLabel === "adaptive") {
    summaryParts.push(
      "Adaptive resilience may reflect effective stress absorption and recovery coordination under pressure."
    );
  } else if (input.state.executiveResilienceLabel === "recovering") {
    summaryParts.push(
      "Recovering resilience may signal strengthening adaptive pathways across operational domains."
    );
  } else if (input.state.executiveResilienceLabel === "strained") {
    summaryParts.push(
      "Strained resilience may indicate rising recovery pressure with declining coordination quality."
    );
  } else {
    summaryParts.push(
      "Critical resilience conditions may elevate continuity risk until capacity stabilizes under executive control."
    );
  }
  summaryParts.push(
    `Indicative resilience capacity is ${(input.state.resilienceCapacityScore * 100).toFixed(0)}% with adaptive recovery at ${(input.state.adaptiveRecoveryScore * 100).toFixed(0)}% and recovery pressure at ${(input.state.recoveryPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.resilienceAmbiguityDisclaimer || RESILIENCE_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousResilienceDisclaimer || NON_AUTONOMOUS_RESILIENCE_DISCLAIMER
  );

  const resilienceSummaries = input.state.activeResilienceSignals.map((s) => {
    const drivers = (s.dominantResilienceDrivers ?? []).join(", ") || "resilience_drivers";
    return `${s.resilienceId}: ${s.resilienceState} (${drivers}, strength ${(s.resilienceStrength * 100).toFixed(0)}%).`;
  });

  const recoverySummaries = input.state.adaptiveRecoveryRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const capacitySummaries = input.state.resilienceCapacityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.adaptiveRecoveryZones.length > 0) {
    bullets.push(
      `Adaptive recovery zones: ${input.state.adaptiveRecoveryZones.join(", ")}.`
    );
  }
  if (input.state.resilienceFailureZones.length > 0) {
    bullets.push(
      `Resilience failure zones: ${input.state.resilienceFailureZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models pressure, adaptation, recovery, and continuity; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    resilienceSummaries: Object.freeze(resilienceSummaries),
    recoverySummaries: Object.freeze(recoverySummaries),
    capacitySummaries: Object.freeze(capacitySummaries),
    bullets: Object.freeze(bullets),
  });
}
