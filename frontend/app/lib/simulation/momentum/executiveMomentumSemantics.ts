/**
 * D7:2:6 — Executive-readable operational momentum semantics.
 */

import type {
  EnterpriseMomentumState,
  ExecutiveMomentumSemantics,
} from "./operationalMomentumTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveMomentumSemantics(input: {
  state: EnterpriseMomentumState;
}): ExecutiveMomentumSemantics {
  const stabilizing = input.state.activeMomentumSignals.filter(
    (s) => s.momentumDirection === "stabilizing" || s.momentumDirection === "recovering"
  );
  const degrading = input.state.activeMomentumSignals.filter(
    (s) => s.momentumDirection === "degrading" || s.momentumDirection === "accelerating"
  );
  const topDegrading = degrading.sort((a, b) => b.intensity - a.intensity)[0];
  const topStabilizing = stabilizing.sort((a, b) => b.intensity - a.intensity)[0];

  const stabilizingRegions = input.state.accelerationZones.length
    ? []
    : topStabilizing
      ? topStabilizing.affectedRegionIds.map(regionLabel)
      : [];

  const headline =
    topDegrading && topStabilizing
      ? `Operational momentum is stabilizing across ${stabilizingRegions.join(" and ") || "key regions"}, but degradation acceleration continues in ${topDegrading.affectedRegionIds.map(regionLabel).join(" and ")}.`
      : input.state.momentumTrendLabel === "recovering"
        ? "Enterprise operational momentum is recovering with improving stabilization velocity."
        : input.state.momentumTrendLabel === "accelerating_failure"
          ? "Operational momentum is accelerating toward systemic instability across multiple regions."
          : input.state.momentumTrendLabel === "stabilizing"
            ? "Operational momentum is stabilizing across the enterprise operational universe."
            : "Operational momentum remains stagnant with elevated organizational inertia.";

  const summaryParts: string[] = [];
  if (input.state.momentumTrendLabel === "stabilizing") {
    summaryParts.push("Coordination and recovery throughput are supporting positive momentum.");
  } else if (input.state.momentumTrendLabel === "recovering") {
    summaryParts.push("Recovery momentum is building relative to current fragility exposure.");
  } else if (input.state.momentumTrendLabel === "accelerating_failure") {
    summaryParts.push("Degradation velocity is outpacing stabilization in interconnected regions.");
  } else {
    summaryParts.push("Organizational inertia is slowing adaptation and recovery coordination.");
  }
  summaryParts.push(
    `Organizational momentum score is ${(input.state.organizationalMomentumScore * 100).toFixed(0)}% with inertia at ${(input.state.organizationalInertiaScore * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeMomentumSignals.slice(0, 6).map((signal) => {
    const regions = signal.affectedRegionIds.map(regionLabel).join(" and ");
    return `${regions} shows ${signal.momentumDirection} momentum (intensity ${(signal.intensity * 100).toFixed(0)}%).`;
  });

  const propagationSummaries = input.state.propagationRecords.slice(0, 4).map((r) => r.explanation);

  const zoneSummaries: string[] = [];
  if (input.state.degradationZones.length > 0) {
    zoneSummaries.push(
      `Degradation zones: ${input.state.degradationZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.accelerationZones.length > 0) {
    zoneSummaries.push(
      `Acceleration zones: ${input.state.accelerationZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.stagnationZones.length > 0) {
    zoneSummaries.push(
      `Stagnation zones: ${input.state.stagnationZones.map(regionLabel).join(", ")}.`
    );
  }

  const bullets: string[] = [];
  if (topDegrading) {
    bullets.push(
      `${topDegrading.affectedRegionIds.map(regionLabel).join(" and ")} shows ${topDegrading.momentumDirection} operational momentum.`
    );
  }
  if (input.state.organizationalInertiaScore > 0.5) {
    bullets.push("Organizational inertia is delaying stabilization adaptation.");
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    propagationSummaries,
    zoneSummaries,
    bullets,
  };
}
