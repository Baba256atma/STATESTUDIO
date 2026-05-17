/**
 * D7:2:2 — Organizational flow dynamics engine (immutable, non-mutating).
 */

import type {
  CalculateOrganizationalFlowsInput,
  CalculateOrganizationalFlowsResult,
  FlowPanelContract,
  OrganizationalFlowSnapshot,
  OrganizationalFlowState,
} from "./flowDynamicsTypes.ts";
import {
  buildFlowContentFingerprint,
  guardCalculateOrganizationalFlows,
} from "./flowGuards.ts";
import {
  applySimulationEventFlowAdjustments,
  deriveFlowsFromTopology,
} from "./resourceCirculationModel.ts";
import {
  computeRegionFlowPressures,
  detectOperationalBottlenecks,
} from "./bottleneckDetection.ts";
import {
  calculateFlowPressureScore,
  calculateOperationalMomentum,
} from "./flowMomentumModel.ts";
import { buildExecutiveFlowSemantics } from "./executiveFlowSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logFlowDev } from "./flowDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function flowBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function detectThroughputSpike(
  regionMetrics?: Readonly<Record<string, import("./flowDynamicsTypes.ts").RegionFlowMetrics>>
): number {
  if (!regionMetrics) return 0;
  const throughputs = Object.values(regionMetrics).map((m) => Number(m.throughput ?? 0.55));
  if (throughputs.length === 0) return 0;
  const max = Math.max(...throughputs);
  const min = Math.min(...throughputs);
  return max - min;
}

export function buildFlowPanelContract(input: {
  snapshot: OrganizationalFlowSnapshot;
}): FlowPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.bottlenecks.length > 0
      ? "bottleneck_heatmap"
      : input.snapshot.state.flowPressureScore > 0.55
        ? "flow_pressure"
        : input.snapshot.state.activeFlows.length > 8
          ? "circulation_map"
          : "throughput_dashboard";

  return Object.freeze({
    flowStateId: input.snapshot.flowStateId,
    topologyId: input.snapshot.topologyId,
    flowPressureScore: input.snapshot.state.flowPressureScore,
    operationalMomentum: input.snapshot.state.operationalMomentum,
    momentumLabel: input.snapshot.state.momentumLabel,
    flows: Object.freeze(
      input.snapshot.state.activeFlows.map((flow) =>
        Object.freeze({
          flowId: flow.flowId,
          sourceLabel: regionLabel(flow.sourceRegionId),
          targetLabel: regionLabel(flow.targetRegionId),
          flowType: flow.flowType,
          intensity: flow.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.bottlenecks.map((b) =>
        Object.freeze({
          regionId: b.regionId,
          label: regionLabel(b.regionId),
          severity: b.severity,
          reason: b.reason,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Calculate organizational flows from topology (read-only; never mutates topology).
 */
export function calculateOrganizationalFlows(
  input: CalculateOrganizationalFlowsInput
): CalculateOrganizationalFlowsResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick) || 0);
  const flowStateId = String(input.flowStateId ?? `flow::${topology.topologyId}::${tick}`).trim();

  logFlowDev("FlowDynamics", {
    flowStateId,
    topologyId: topology.topologyId,
    tick,
  });

  let flows = deriveFlowsFromTopology({
    topology,
    regionMetrics: input.regionMetrics,
  });
  flows = applySimulationEventFlowAdjustments(flows, input.regionMetrics, input.simulationEvents);

  const regionIds = topology.operationalRegions.map((r) => r.regionId);
  const pendingFingerprint = buildFlowContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const guard = guardCalculateOrganizationalFlows({
    topologyId: topology.topologyId,
    topologyRegionIds: regionIds,
    flows,
    priorFlowFingerprints: input.priorFlowFingerprints,
    pendingFingerprint,
    throughputSpike: detectThroughputSpike(input.regionMetrics),
  });
  if (!guard.ok) return { ok: false, guard };

  const regionPressures = computeRegionFlowPressures(flows);
  const bottlenecks = detectOperationalBottlenecks({
    regions: topology.operationalRegions,
    flows,
    regionPressures,
    regionMetrics: input.regionMetrics,
  });
  const flowPressureScore = calculateFlowPressureScore(regionPressures);
  const { operationalMomentum, momentumLabel } = calculateOperationalMomentum({
    flows,
    bottlenecks,
    flowPressureScore,
  });

  const state: OrganizationalFlowState = Object.freeze({
    activeFlows: Object.freeze(flows),
    bottleneckRegions: Object.freeze(bottlenecks.map((b) => b.regionId)),
    bottlenecks: Object.freeze(bottlenecks),
    regionPressures: Object.freeze(regionPressures),
    flowPressureScore,
    operationalMomentum,
    momentumLabel,
  });

  const semantics = buildExecutiveFlowSemantics({ state, flows });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    flowStateId,
    flowIds: flows.map((f) => f.flowId),
    bottlenecks: bottlenecks.map((b) => b.bottleneckId),
    flowPressureScore,
    operationalMomentum,
  });

  const snapshot: OrganizationalFlowSnapshot = Object.freeze({
    flowStateId,
    topologyId: topology.topologyId,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      flowSummaries: Object.freeze([...semantics.flowSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: flowBuiltAt(tick),
  });

  const panelContract = buildFlowPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeOrganizationalFlowSnapshot(
  snapshot: OrganizationalFlowSnapshot
): OrganizationalFlowSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeFlows: Object.freeze(snapshot.state.activeFlows.map((f) => Object.freeze({ ...f }))),
      bottleneckRegions: Object.freeze([...snapshot.state.bottleneckRegions]),
      bottlenecks: Object.freeze(snapshot.state.bottlenecks.map((b) => Object.freeze({ ...b }))),
      regionPressures: Object.freeze(snapshot.state.regionPressures.map((p) => Object.freeze({ ...p }))),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
