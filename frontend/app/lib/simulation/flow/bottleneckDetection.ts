/**
 * D7:2:2 — Deterministic bottleneck detection foundations.
 */

import type {
  OperationalBottleneck,
  OrganizationalFlow,
  RegionFlowMetrics,
  RegionFlowPressure,
} from "./flowDynamicsTypes.ts";
import type { OperationalRegion } from "../topology/topologyTypes.ts";
import { logFlowDev } from "./flowDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function computeRegionFlowPressures(
  flows: readonly OrganizationalFlow[]
): RegionFlowPressure[] {
  const inbound = new Map<string, number[]>();
  const outbound = new Map<string, number[]>();

  for (const flow of flows) {
    const outList = outbound.get(flow.sourceRegionId) ?? [];
    outList.push(flow.intensity);
    outbound.set(flow.sourceRegionId, outList);

    const inList = inbound.get(flow.targetRegionId) ?? [];
    inList.push(flow.intensity);
    inbound.set(flow.targetRegionId, inList);
  }

  const regionIds = new Set([...inbound.keys(), ...outbound.keys()]);
  const pressures: RegionFlowPressure[] = [];

  for (const regionId of [...regionIds].sort()) {
    const inVals = inbound.get(regionId) ?? [];
    const outVals = outbound.get(regionId) ?? [];
    const inboundIntensity = inVals.length
      ? clamp01(inVals.reduce((s, v) => s + v, 0) / inVals.length)
      : 0;
    const outboundIntensity = outVals.length
      ? clamp01(outVals.reduce((s, v) => s + v, 0) / outVals.length)
      : 0;
    const netPressure = clamp01(inboundIntensity - outboundIntensity * 0.65);
    const congestionScore = clamp01(inboundIntensity * 0.7 + Math.max(0, netPressure) * 0.3);

    pressures.push(
      Object.freeze({
        regionId,
        inboundIntensity,
        outboundIntensity,
        netPressure,
        congestionScore,
      })
    );
  }

  return pressures.sort((a, b) => a.regionId.localeCompare(b.regionId));
}

export function detectOperationalBottlenecks(input: {
  regions: readonly OperationalRegion[];
  flows: readonly OrganizationalFlow[];
  regionPressures: readonly RegionFlowPressure[];
  regionMetrics?: Readonly<Record<string, RegionFlowMetrics>>;
}): readonly OperationalBottleneck[] {
  const bottlenecks: OperationalBottleneck[] = [];
  const pressureByRegion = new Map(input.regionPressures.map((p) => [p.regionId, p]));

  for (const region of input.regions) {
    const pressure = pressureByRegion.get(region.regionId);
    const metrics = input.regionMetrics?.[region.regionId];
    const fragility = clamp01(metrics?.fragility ?? region.fragilityScore ?? 0.25);
    const throughput = clamp01(metrics?.throughput ?? 0.55);
    const load = clamp01(metrics?.operationalLoad ?? 0.35);
    const recovery = clamp01(metrics?.recoveryCapacity ?? 1 - fragility);

    const inboundFlows = input.flows
      .filter((f) => f.targetRegionId === region.regionId)
      .map((f) => f.flowId);

    let severity: OperationalBottleneck["severity"] | null = null;
    let reason = "";

    if (pressure && pressure.congestionScore >= 0.75 && throughput < 0.45) {
      severity = "critical";
      reason = `${region.label} is congested with constrained throughput.`;
    } else if (load > 0.65 && recovery < 0.4) {
      severity = "high";
      reason = `${region.label} faces overload with limited recovery capacity.`;
    } else if (pressure && pressure.netPressure > 0.55 && fragility > 0.5) {
      severity = "high";
      reason = `${region.label} absorbs elevated inbound flow under fragility stress.`;
    } else if (throughput < 0.35 && inboundFlows.length >= 2) {
      severity = "moderate";
      reason = `${region.label} shows approval or processing delay under multi-source demand.`;
    } else if (region.regionId === "logistics" && load > 0.55 && throughput < 0.5) {
      severity = "moderate";
      reason = "Logistics throughput is strained by upstream manufacturing demand.";
    }

    if (severity) {
      bottlenecks.push(
        Object.freeze({
          bottleneckId: `bottleneck::${region.regionId}`,
          regionId: region.regionId,
          severity,
          reason,
          contributingFlowIds: Object.freeze([...inboundFlows].sort()),
        })
      );
    }
  }

  logFlowDev("Bottleneck", {
    count: bottlenecks.length,
    regions: bottlenecks.map((b) => b.regionId),
  });

  return Object.freeze(bottlenecks.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
