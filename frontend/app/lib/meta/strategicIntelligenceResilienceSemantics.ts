/**
 * D7:8:5 — Executive-readable strategic intelligence resilience semantics.
 */

import type {
  StrategicIntelligenceResilienceSemantics,
  StrategicIntelligenceResilienceIntelligenceState,
} from "./strategicIntelligenceResilienceTypes.ts";
import {
  RESILIENCE_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
} from "./strategicIntelligenceResilienceGuards.ts";

export function buildStrategicIntelligenceResilienceSemantics(input: {
  state: StrategicIntelligenceResilienceIntelligenceState;
}): StrategicIntelligenceResilienceSemantics {
  const governanceStabilization = input.state.longHorizonResilienceRecords.find((r) =>
    r.recordId.includes("governance-stabilization")
  );
  const exhaustionRisk = input.state.strategicRecoveryRecords.find((r) =>
    r.recordId.includes("exhaustion-risk")
  );
  const recoveryFatigue = input.state.strategicRecoveryRecords.find((r) =>
    r.recordId.includes("recovery-fatigue")
  );

  const headline =
    input.state.executiveResilienceLabel === "stable" ||
    input.state.executiveResilienceLabel === "adaptive" ||
    input.state.executiveResilienceLabel === "recovering"
      ? governanceStabilization && input.state.recoveryPressureScore >= 0.35
        ? "Enterprise strategic intelligence remains broadly resilient as governance coordination and continuity preservation continue stabilizing long-horizon decision coherence, although optimization pressure and predictive volatility are increasing resilience fatigue risks."
        : "Enterprise strategic intelligence may remain resilient as adaptive recovery and continuity preservation stabilize long-horizon coherence under executive oversight."
      : input.state.executiveResilienceLabel === "strained"
        ? recoveryFatigue
          ? recoveryFatigue.explanation
          : exhaustionRisk
            ? exhaustionRisk.explanation
            : "Strategic intelligence resilience may be strained as recovery fatigue and optimization pressure accumulate across domains."
        : input.state.executiveResilienceLabel === "critical"
          ? "Critical resilience conditions may elevate when strategic exhaustion risk compounds across governance, recovery, and continuity systems."
          : governanceStabilization
            ? governanceStabilization.explanation
            : "Strategic intelligence resilience remains under active assessment across enterprise cognition systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveResilienceLabel === "stable") {
    summaryParts.push(
      "Stable resilience may indicate strategic intelligence absorbs pressure while preserving long-horizon coherence."
    );
  } else if (input.state.executiveResilienceLabel === "adaptive") {
    summaryParts.push(
      "Adaptive resilience may reflect effective absorption of instability without fragmentation collapse."
    );
  } else if (input.state.executiveResilienceLabel === "recovering") {
    summaryParts.push(
      "Recovering resilience may signal restoration pathways rebuilding coherence after sustained pressure."
    );
  } else if (input.state.executiveResilienceLabel === "strained") {
    summaryParts.push(
      "Strained resilience may elevate when recovery fatigue and declining redundancy weaken continuity preservation."
    );
  } else {
    summaryParts.push(
      "Critical resilience conditions may threaten strategic continuity until stabilization pathways strengthen under executive control."
    );
  }
  summaryParts.push(
    `Indicative resilience capacity is ${(input.state.strategicResilienceCapacityScore * 100).toFixed(0)}% with adaptive recovery at ${(input.state.adaptiveRecoveryScore * 100).toFixed(0)}% and recovery pressure at ${(input.state.recoveryPressureScore * 100).toFixed(0)}%.`
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

  const longHorizonSummaries = input.state.longHorizonResilienceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const recoverySummaries = input.state.strategicRecoveryRecords
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
    "Nexora models pressure, adaptation, recovery, and strategic continuity; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    resilienceSummaries: Object.freeze(resilienceSummaries),
    longHorizonSummaries: Object.freeze(longHorizonSummaries),
    recoverySummaries: Object.freeze(recoverySummaries),
    bullets: Object.freeze(bullets),
  });
}
