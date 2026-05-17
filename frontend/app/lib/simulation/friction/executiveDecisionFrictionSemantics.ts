/**
 * D7:3:3 — Executive-readable decision friction semantics.
 */

import type {
  ExecutiveDecisionFrictionSemantics,
  OrganizationalDecisionFrictionState,
} from "./decisionFrictionTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveDecisionFrictionSemantics(input: {
  state: OrganizationalDecisionFrictionState;
}): ExecutiveDecisionFrictionSemantics {
  const topBottleneck = input.state.executionResistanceBottlenecks[0];
  const logisticsHotspot = input.state.frictionHotspots.includes("logistics");
  const approvalLatency = input.state.latencyRecords.find((r) =>
    r.explanation.includes("approval")
  );
  const logisticsLatency = input.state.latencyRecords.find((r) => r.regionId === "logistics");

  const headline =
    logisticsHotspot && approvalLatency
      ? "Decision friction is increasing across logistics recovery operations due to approval-chain overload and cross-domain coordination delays."
      : input.state.decisionFrictionLabel === "fluid"
        ? "Decision execution remains fluid with low organizational drag across operational regions."
        : topBottleneck
          ? topBottleneck.reason
          : logisticsLatency
            ? logisticsLatency.explanation
            : input.state.decisionFrictionLabel === "critical"
              ? "Critical decision friction is constraining enterprise execution and elevating systemic instability."
              : "Organizational decision friction is elevating execution resistance under current operational load.";

  const summaryParts: string[] = [];
  if (input.state.decisionFrictionLabel === "fluid") {
    summaryParts.push(
      "Strategic decisions are translating into operational execution with limited resistance."
    );
  } else if (input.state.decisionFrictionLabel === "moderate") {
    summaryParts.push(
      "Some regions resist change while overall execution remains manageable."
    );
  } else if (input.state.decisionFrictionLabel === "elevated") {
    summaryParts.push(
      "Decision latency and coordination slowdowns are degrading momentum and recovery velocity."
    );
  } else {
    summaryParts.push(
      "Execution friction is critical; approval bottlenecks and cross-domain delays require executive attention."
    );
  }
  summaryParts.push(
    `Execution latency is ${(input.state.executionLatencyScore * 100).toFixed(0)}% with organizational drag at ${(input.state.organizationalDragLevel * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeFrictionSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantFrictionDrivers ?? []).join(", ") || "operational_load";
    return `${regions}: ${s.frictionState} friction (${drivers}).`;
  });

  const latencySummaries = input.state.latencyRecords.slice(0, 4).map((r) => r.explanation);
  const bottleneckSummaries = input.state.executionResistanceBottlenecks.map((b) => b.reason);
  const dragSummaries = input.state.dragRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.frictionHotspots.length > 0) {
    bullets.push(
      `Friction hotspots: ${input.state.frictionHotspots.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    latencySummaries,
    bottleneckSummaries,
    dragSummaries,
    bullets,
  };
}
