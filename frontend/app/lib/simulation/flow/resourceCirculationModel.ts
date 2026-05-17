/**
 * D7:2:2 — Resource circulation modeling (deterministic).
 */

import type { OperationalRelationship, OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  OrganizationalFlow,
  OrganizationalFlowType,
  RegionFlowMetrics,
} from "./flowDynamicsTypes.ts";
import { logFlowDev } from "./flowDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function mapRelationshipToFlowType(
  relationshipType: OperationalRelationship["relationshipType"]
): OrganizationalFlowType {
  switch (relationshipType) {
    case "financial_flow":
      return "financial";
    case "resource_flow":
      return "resource";
    case "operational_support":
      return "strategic";
    case "risk_exposure":
      return "operational";
    default:
      return "operational";
  }
}

function flowLabel(type: OrganizationalFlowType): string {
  switch (type) {
    case "financial":
      return "financial circulation";
    case "resource":
      return "resource movement";
    case "information":
      return "information flow";
    case "strategic":
      return "strategic pressure";
    default:
      return "operational throughput";
  }
}

export function deriveFlowsFromTopology(input: {
  topology: OperationalUniverseTopology;
  regionMetrics?: Readonly<Record<string, RegionFlowMetrics>>;
}): OrganizationalFlow[] {
  const flows: OrganizationalFlow[] = [];

  for (const rel of input.topology.crossDomainRelationships) {
    const flowType = mapRelationshipToFlowType(rel.relationshipType);
    const sourceMetrics = input.regionMetrics?.[rel.sourceRegionId];
    const targetMetrics = input.regionMetrics?.[rel.targetRegionId];
    const loadTransfer = clamp01(
      ((sourceMetrics?.operationalLoad ?? 0.35) + (targetMetrics?.fragility ?? 0.25)) / 2
    );
    const throughput = clamp01(
      ((sourceMetrics?.throughput ?? 0.55) + (targetMetrics?.throughput ?? 0.5)) / 2
    );
    const intensity = clamp01(rel.intensity * 0.65 + loadTransfer * 0.35);

    flows.push(
      Object.freeze({
        flowId: `flow::${rel.relationshipId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        flowType,
        intensity,
        throughput,
        pressureContribution: clamp01(intensity * (targetMetrics?.fragility ?? 0.3)),
        executiveLabel: `${rel.sourceRegionId} ${flowLabel(flowType)} into ${rel.targetRegionId}`,
      })
    );
  }

  for (const channel of input.topology.dependencyChannels) {
    if (flows.some((f) => f.flowId === `flow::${channel.channelId}`)) continue;
    flows.push(
      Object.freeze({
        flowId: `flow::${channel.channelId}`,
        sourceRegionId: channel.fromRegionId,
        targetRegionId: channel.toRegionId,
        flowType: "operational",
        intensity: clamp01(channel.averageIntensity),
        throughput: clamp01(1 - channel.fragilityTransmissionScore * 0.5),
        pressureContribution: channel.fragilityTransmissionScore,
        executiveLabel: `Operational dependency pressure from ${channel.fromRegionId} to ${channel.toRegionId}`,
      })
    );
  }

  const sorted = flows.sort((a, b) => a.flowId.localeCompare(b.flowId));
  logFlowDev("OperationalFlow", {
    flowCount: sorted.length,
    topologyId: input.topology.topologyId,
  });
  return sorted;
}

export function applySimulationEventFlowAdjustments(
  flows: readonly OrganizationalFlow[],
  regionMetrics: Readonly<Record<string, RegionFlowMetrics>> | undefined,
  simulationEvents: readonly import("../simulationEventTypes.ts").SimulationEvent[] | undefined
): OrganizationalFlow[] {
  if (!simulationEvents?.length) return [...flows];

  const pressureBoost = clamp01(simulationEvents.length * 0.04);
  return flows.map((flow) => {
    const target = regionMetrics?.[flow.targetRegionId];
    const boost = (target?.operationalLoad ?? 0.3) * pressureBoost;
    return Object.freeze({
      ...flow,
      intensity: clamp01(flow.intensity + boost),
      pressureContribution: clamp01((flow.pressureContribution ?? 0) + boost * 0.5),
    });
  });
}
