/**
 * D7:2:3 — Pressure accumulation modeling (deterministic).
 */

import type {
  OperationalRelationship,
  OperationalUniverseTopology,
} from "../topology/topologyTypes.ts";
import type { OrganizationalFlowState } from "../flow/flowDynamicsTypes.ts";
import type {
  DependencyPressureSignal,
  DependencyPressureType,
  RegionPressureAccumulation,
  RegionPressureMetrics,
} from "./dependencyPressureTypes.ts";
import { logPressureDev } from "./pressureDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function mapRelationshipToPressureType(
  relationshipType: OperationalRelationship["relationshipType"]
): DependencyPressureType {
  switch (relationshipType) {
    case "financial_flow":
      return "financial";
    case "resource_flow":
      return "resource";
    case "operational_support":
      return "operational";
    case "risk_exposure":
      return "recovery";
    default:
      return "operational";
  }
}

function mapFlowTypeToPressureType(
  flowType: import("../flow/flowDynamicsTypes.ts").OrganizationalFlowType
): DependencyPressureType {
  switch (flowType) {
    case "financial":
      return "financial";
    case "resource":
      return "resource";
    case "information":
      return "operational";
    case "strategic":
      return "approval";
    default:
      return "logistical";
  }
}

export function derivePressureSignalsFromDependencies(input: {
  topology: OperationalUniverseTopology;
  flowState?: OrganizationalFlowState;
  regionMetrics?: Readonly<Record<string, RegionPressureMetrics>>;
}): DependencyPressureSignal[] {
  const signals: DependencyPressureSignal[] = [];
  const signalKeys = new Set<string>();

  const pushSignal = (signal: DependencyPressureSignal) => {
    const key = `${signal.sourceRegionId}|${signal.targetRegionId}|${signal.pressureType}`;
    if (signalKeys.has(key)) return;
    signalKeys.add(key);
    signals.push(Object.freeze(signal));
  };

  for (const rel of input.topology.crossDomainRelationships) {
    const pressureType = mapRelationshipToPressureType(rel.relationshipType);
    const sourceMetrics = input.regionMetrics?.[rel.sourceRegionId];
    const targetMetrics = input.regionMetrics?.[rel.targetRegionId];
    const overload = clamp01(
      ((sourceMetrics?.operationalLoad ?? 0.35) + (targetMetrics?.fragility ?? 0.3)) / 2
    );
    const approvalStrain = clamp01(targetMetrics?.approvalDelay ?? 0.2);
    const intensity = clamp01(rel.intensity * 0.6 + overload * 0.25 + approvalStrain * 0.15);
    const cascadeRisk = clamp01(intensity * (targetMetrics?.fragility ?? 0.35));

    pushSignal(
      Object.freeze({
        signalId: `pressure::${rel.relationshipId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        pressureType,
        intensity,
        cascadeRisk,
        propagationDepth: 0,
        executiveLabel: `Dependency pressure from ${rel.sourceRegionId} into ${rel.targetRegionId}`,
      })
    );
  }

  for (const channel of input.topology.dependencyChannels) {
    pushSignal(
      Object.freeze({
        signalId: `pressure::${channel.channelId}`,
        sourceRegionId: channel.fromRegionId,
        targetRegionId: channel.toRegionId,
        pressureType: "logistical",
        intensity: clamp01(channel.averageIntensity * 0.7 + channel.fragilityTransmissionScore * 0.3),
        cascadeRisk: channel.fragilityTransmissionScore,
        propagationDepth: 0,
        executiveLabel: `Cross-domain dependency strain from ${channel.fromRegionId} to ${channel.toRegionId}`,
      })
    );
  }

  if (input.flowState) {
    for (const flow of input.flowState.activeFlows) {
      const boost = clamp01((flow.pressureContribution ?? flow.intensity * 0.4) * 0.85);
      if (boost < 0.15) continue;
      pushSignal(
        Object.freeze({
          signalId: `pressure::flow::${flow.flowId}`,
          sourceRegionId: flow.sourceRegionId,
          targetRegionId: flow.targetRegionId,
          pressureType: mapFlowTypeToPressureType(flow.flowType),
          intensity: boost,
          cascadeRisk: clamp01(boost * (input.flowState?.flowPressureScore ?? 0.4)),
          propagationDepth: 0,
          executiveLabel: `Flow-derived pressure along ${flow.sourceRegionId} to ${flow.targetRegionId}`,
        })
      );
    }

    for (const bottleneck of input.flowState.bottlenecks) {
      pushSignal(
        Object.freeze({
          signalId: `pressure::bottleneck::${bottleneck.regionId}`,
          sourceRegionId: bottleneck.regionId,
          targetRegionId: bottleneck.regionId,
          pressureType: "operational",
          intensity: clamp01(
            bottleneck.severity === "critical" ? 0.85 : bottleneck.severity === "high" ? 0.65 : 0.45
          ),
          cascadeRisk: clamp01(0.5 + (input.flowState?.flowPressureScore ?? 0) * 0.3),
          propagationDepth: 0,
          executiveLabel: bottleneck.reason,
        })
      );
    }
  }

  const sorted = signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
  logPressureDev("DependencyPressure", {
    signalCount: sorted.length,
    topologyId: input.topology.topologyId,
  });
  return sorted;
}

export function applySimulationEventPressureAdjustments(
  signals: readonly DependencyPressureSignal[],
  regionMetrics: Readonly<Record<string, RegionPressureMetrics>> | undefined,
  simulationEvents: readonly import("../simulationEventTypes.ts").SimulationEvent[] | undefined,
  simulationState?: import("./dependencyPressureTypes.ts").SimulationPressureContext
): DependencyPressureSignal[] {
  const eventBoost = clamp01(
    (simulationEvents?.length ?? 0) * 0.035 +
      (simulationState?.cumulativeStressFactor ?? 0) * 0.12 +
      (simulationState?.activeEventCount ?? 0) * 0.02
  );
  if (eventBoost <= 0) return [...signals];

  return signals.map((signal) => {
    const target = regionMetrics?.[signal.targetRegionId];
    const strain = (target?.recoveryStrain ?? target?.operationalLoad ?? 0.3) * eventBoost;
    return Object.freeze({
      ...signal,
      intensity: clamp01(signal.intensity + strain),
      cascadeRisk: clamp01((signal.cascadeRisk ?? 0) + strain * 0.45),
    });
  });
}

export function accumulateRegionalPressure(input: {
  signals: readonly DependencyPressureSignal[];
  regionIds: readonly string[];
  regionMetrics?: Readonly<Record<string, RegionPressureMetrics>>;
}): RegionPressureAccumulation[] {
  const inbound = new Map<string, number[]>();
  const outbound = new Map<string, number[]>();
  const concentration = new Map<string, number>();

  for (const signal of input.signals) {
    const inList = inbound.get(signal.targetRegionId) ?? [];
    inList.push(signal.intensity);
    inbound.set(signal.targetRegionId, inList);

    const outList = outbound.get(signal.sourceRegionId) ?? [];
    outList.push(signal.intensity);
    outbound.set(signal.sourceRegionId, outList);

    concentration.set(
      signal.targetRegionId,
      (concentration.get(signal.targetRegionId) ?? 0) + 1
    );
    concentration.set(
      signal.sourceRegionId,
      (concentration.get(signal.sourceRegionId) ?? 0) + 1
    );
  }

  const maxConcentration = Math.max(1, ...[...concentration.values()]);
  const accumulations: RegionPressureAccumulation[] = [];

  for (const regionId of [...input.regionIds].sort()) {
    const inVals = inbound.get(regionId) ?? [];
    const outVals = outbound.get(regionId) ?? [];
    const inboundPressure = inVals.length
      ? clamp01(inVals.reduce((s, v) => s + v, 0) / inVals.length)
      : 0;
    const outboundAvg = outVals.length
      ? clamp01(outVals.reduce((s, v) => s + v, 0) / outVals.length)
      : 0;
    const metrics = input.regionMetrics?.[regionId];
    const fragilityExposure = clamp01(metrics?.fragility ?? 0.28);
    const dependencyConcentration = clamp01((concentration.get(regionId) ?? 0) / maxConcentration);
    const accumulatedPressure = clamp01(
      inboundPressure * 0.55 +
        fragilityExposure * 0.25 +
        dependencyConcentration * 0.2 -
        outboundAvg * 0.1
    );

    accumulations.push(
      Object.freeze({
        regionId,
        accumulatedPressure,
        inboundPressure,
        dependencyConcentration,
        fragilityExposure,
      })
    );
  }

  return accumulations;
}
