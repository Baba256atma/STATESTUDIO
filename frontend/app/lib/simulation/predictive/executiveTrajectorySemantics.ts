/**
 * D7:4:1 — Executive-readable predictive trajectory semantics.
 */

import type {
  ExecutiveTrajectorySemantics,
  PredictiveTrajectoryState,
} from "./futureTrajectoryTypes.ts";
import { UNCERTAINTY_DISCLAIMER } from "./trajectoryGuards.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveTrajectorySemantics(input: {
  state: PredictiveTrajectoryState;
}): ExecutiveTrajectorySemantics {
  const stabilizationSignal = input.state.activeTrajectorySignals.find(
    (s) => s.signalId === "trajectory::stabilization-strengthening"
  );
  const manufacturingVolatility = input.state.activeTrajectorySignals.find(
    (s) => s.signalId === "trajectory::manufacturing-volatility"
  );
  const topDivergence = input.state.trajectoryDivergenceRecords[0];
  const logisticsRecovery = input.state.recoveryTrajectories.includes("logistics");

  const headline =
    stabilizationSignal && manufacturingVolatility
      ? "Current operational conditions suggest a gradual stabilization trajectory across logistics recovery systems, although manufacturing fragility may continue to increase future volatility risk."
      : logisticsRecovery && input.state.predictiveTrajectoryLabel === "stabilizing"
        ? "Current conditions suggest a gradual stabilization trajectory across logistics recovery systems under coordinated operational movement."
        : topDivergence
          ? topDivergence.explanation
          : input.state.predictiveTrajectoryLabel === "critical"
            ? "Directional analysis indicates elevated critical trajectory risk across multiple operational domains."
            : input.state.predictiveTrajectoryLabel === "recovering"
              ? "Directional movement may trend toward recovery as momentum and resilience conditions align."
              : "Predictive trajectory patterns remain mixed under current operational and human-system conditions.";

  const summaryParts: string[] = [];
  if (input.state.predictiveTrajectoryLabel === "stabilizing") {
    summaryParts.push(
      "Stabilization trajectories may strengthen where recovery momentum and resilience adaptation align."
    );
  } else if (input.state.predictiveTrajectoryLabel === "recovering") {
    summaryParts.push(
      "Recovery evolution trends may gain strength, though regional volatility remains possible."
    );
  } else if (input.state.predictiveTrajectoryLabel === "volatile") {
    summaryParts.push(
      "Future volatility may increase where fragility, alignment drift, and pressure interact."
    );
  } else if (input.state.predictiveTrajectoryLabel === "degrading") {
    summaryParts.push(
      "Degradation trajectories may develop as dependency pressure and trust strain accumulate."
    );
  } else {
    summaryParts.push(
      "Critical trajectory patterns may emerge if instability acceleration continues."
    );
  }
  summaryParts.push(
    `Indicative future stability is ${(input.state.futureStabilityScore * 100).toFixed(0)}% with trajectory divergence at ${(input.state.trajectoryDivergenceScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || UNCERTAINTY_DISCLAIMER);

  const signalSummaries = input.state.activeTrajectorySignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantTrajectoryDrivers ?? []).join(", ") || "operational_movement";
    return `${regions}: may trend ${s.trajectoryState} (${drivers}, confidence ${(s.directionalConfidence * 100).toFixed(0)}%).`;
  });

  const divergenceSummaries = input.state.trajectoryDivergenceRecords.map((r) => r.explanation);
  const trendSummaries = input.state.recoveryDegradationTrendRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (topDivergence) bullets.push(topDivergence.explanation);
  if (input.state.degradationTrajectories.length > 0) {
    bullets.push(
      `Degradation trajectory regions: ${input.state.degradationTrajectories.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    divergenceSummaries,
    trendSummaries,
    bullets,
  };
}
