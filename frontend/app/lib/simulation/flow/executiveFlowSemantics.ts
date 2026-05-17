/**
 * D7:2:2 — Executive-readable flow semantics.
 */

import type {
  ExecutiveFlowSemantics,
  OperationalBottleneck,
  OrganizationalFlow,
  OrganizationalFlowState,
  RegionFlowPressure,
} from "./flowDynamicsTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveFlowSemantics(input: {
  state: OrganizationalFlowState;
  flows: readonly OrganizationalFlow[];
}): ExecutiveFlowSemantics {
  const topBottleneck = input.state.bottlenecks[0];
  const topFlow = [...input.flows].sort((a, b) => b.intensity - a.intensity)[0];

  const headline = topBottleneck
    ? `${regionLabel(topBottleneck.regionId)} is under operational flow pressure: ${topBottleneck.reason}`
    : topFlow
      ? `Operational circulation is strongest from ${regionLabel(topFlow.sourceRegionId)} toward ${regionLabel(topFlow.targetRegionId)}.`
      : "Organizational flow circulation is within normal operating bounds.";

  const summaryParts: string[] = [];
  if (input.state.momentumLabel === "healthy") {
    summaryParts.push("Throughput, recovery, and flow pressure remain balanced across the enterprise.");
  } else if (input.state.momentumLabel === "strained") {
    summaryParts.push("Flow pressure is elevated in parts of the operational universe.");
  } else {
    summaryParts.push("Overloaded flow paths and congestion are elevating enterprise-wide pressure.");
  }
  summaryParts.push(
    `Overall flow pressure score is ${(input.state.flowPressureScore * 100).toFixed(0)}% with momentum classified as ${input.state.momentumLabel}.`
  );

  const bottleneckSummaries = input.state.bottlenecks.map((b) => b.reason);
  const flowSummaries = input.flows.slice(0, 5).map((flow) => {
    const source = regionLabel(flow.sourceRegionId);
    const target = regionLabel(flow.targetRegionId);
    return `${source} transfers ${flow.flowType} flow into ${target} (intensity ${(flow.intensity * 100).toFixed(0)}%).`;
  });

  const bullets: string[] = [];
  if (topBottleneck) {
    bullets.push(topBottleneck.reason);
  }
  for (const pressure of [...input.state.regionPressures]
    .sort((a, b) => b.congestionScore - a.congestionScore)
    .slice(0, 2)) {
    if (pressure.congestionScore > 0.55) {
      bullets.push(
        `${regionLabel(pressure.regionId)} shows congestion with net inbound pressure.`
      );
    }
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    bottleneckSummaries,
    flowSummaries,
    bullets,
  };
}
