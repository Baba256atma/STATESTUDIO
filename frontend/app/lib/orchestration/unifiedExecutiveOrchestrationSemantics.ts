/**
 * D7:5:10 — Executive-readable unified orchestration semantics.
 */

import type {
  UnifiedExecutiveOrchestrationSemantics,
  UnifiedExecutiveOrchestrationState,
} from "./unifiedExecutiveOrchestrationTypes.ts";
import {
  ORCHESTRATION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER,
} from "./orchestrationGuards.ts";

export function buildUnifiedExecutiveOrchestrationSemantics(input: {
  state: UnifiedExecutiveOrchestrationState;
}): UnifiedExecutiveOrchestrationSemantics {
  const recommendationConflict = input.state.orchestrationStabilityRecords.find((r) =>
    r.recordId.includes("recommendation-governance")
  );
  const cognitionSync = input.state.crossIntelligenceSynchronizationRecords.find((r) =>
    r.recordId.includes("executive-cognition")
  );
  const topInstability = input.state.orchestrationStabilityRecords[0];

  const headline =
    input.state.executiveOrchestrationLabel === "stable" ||
    input.state.executiveOrchestrationLabel === "synchronized"
      ? "Strategic intelligence systems remain broadly synchronized around recovery stabilization priorities, although future divergence and fragmented restructuring consensus continue to introduce moderate orchestration volatility."
      : recommendationConflict
        ? recommendationConflict.explanation
        : cognitionSync
          ? cognitionSync.explanation
          : topInstability
            ? topInstability.explanation
            : input.state.executiveOrchestrationLabel === "critical"
              ? "Critical orchestration conditions may require executive reconciliation before unified strategic cognition can stabilize across intelligence layers."
              : "Unified executive orchestration remains under active assessment across strategic intelligence pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveOrchestrationLabel === "stable") {
    summaryParts.push(
      "Stable orchestration suggests intelligence layers may coordinate effectively around shared recovery and governance priorities."
    );
  } else if (input.state.executiveOrchestrationLabel === "synchronized") {
    summaryParts.push(
      "Synchronized orchestration may indicate strong cross-intelligence alignment although residual volatility risks remain present."
    );
  } else if (input.state.executiveOrchestrationLabel === "strained") {
    summaryParts.push(
      "Strained orchestration may reflect partial synchronization with emerging caution across predictive and advisory pathways."
    );
  } else if (input.state.executiveOrchestrationLabel === "volatile") {
    summaryParts.push(
      "Volatile orchestration may shift as future divergence, consensus fragmentation, and cascade signals evolve together."
    );
  } else {
    summaryParts.push(
      "Critical orchestration conditions may elevate executive caution until cross-system coherence improves."
    );
  }
  summaryParts.push(
    `Indicative orchestration coherence is ${(input.state.orchestrationCoherenceScore * 100).toFixed(0)}% with cross-system synchronization at ${(input.state.crossSystemSynchronizationScore * 100).toFixed(0)}% and instability at ${(input.state.orchestrationInstabilityScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.orchestrationAmbiguityDisclaimer || ORCHESTRATION_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousAuthorityDisclaimer || NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER
  );

  const orchestrationSummaries = input.state.activeOrchestrationSignals.map((o) => {
    const drivers = (o.dominantOrchestrationDrivers ?? []).join(", ") || "orchestration_drivers";
    return `${o.orchestrationId}: ${o.orchestrationState} (${drivers}, strength ${(o.orchestrationStrength * 100).toFixed(0)}%).`;
  });

  const synchronizationSummaries = input.state.crossIntelligenceSynchronizationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const instabilitySummaries = input.state.orchestrationStabilityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.synchronizedIntelligenceZones.length > 0) {
    bullets.push(
      `Synchronized intelligence zones: ${input.state.synchronizedIntelligenceZones.join(", ")}.`
    );
  }
  if (input.state.orchestrationFragilityZones.length > 0) {
    bullets.push(
      `Orchestration fragility zones: ${input.state.orchestrationFragilityZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora orchestrates strategic intelligence for executive support; strategic decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    orchestrationSummaries: Object.freeze(orchestrationSummaries),
    synchronizationSummaries: Object.freeze(synchronizationSummaries),
    instabilitySummaries: Object.freeze(instabilitySummaries),
    bullets: Object.freeze(bullets),
  });
}
