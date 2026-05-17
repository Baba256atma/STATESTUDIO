/**
 * D7:3:3 — Organizational decision friction engine (immutable, non-mutating).
 */

import type {
  DecisionFrictionPanelContract,
  EvaluateDecisionFrictionInput,
  EvaluateDecisionFrictionResult,
  OrganizationalDecisionFrictionSnapshot,
  OrganizationalDecisionFrictionState,
} from "./decisionFrictionTypes.ts";
import {
  calculateExecutionLatencyScore,
  calculateOrganizationalDragLevel,
  calculateStrategicResistanceScore,
  classifyDecisionFrictionLabel,
  deriveDecisionFrictionSignals,
  identifyFrictionHotspots,
  identifyResistanceZones,
} from "./executionResistanceModel.ts";
import { analyzeDecisionLatency } from "./decisionLatencyAnalysis.ts";
import {
  analyzeOrganizationalDrag,
  detectExecutionResistanceBottlenecks,
} from "./organizationalDragIntelligence.ts";
import {
  buildFrictionContentFingerprint,
  guardEvaluateDecisionFriction,
} from "./decisionFrictionGuards.ts";
import { buildExecutiveDecisionFrictionSemantics } from "./executiveDecisionFrictionSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function frictionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildDecisionFrictionPanelContract(input: {
  snapshot: OrganizationalDecisionFrictionSnapshot;
}): DecisionFrictionPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.executionResistanceBottlenecks.length > 0
      ? "approval_bottleneck_panel"
      : input.snapshot.state.decisionFrictionLabel === "fluid"
        ? "execution_latency_overlay"
        : input.snapshot.state.frictionHotspots.length > 2
          ? "decision_friction_heatmap"
          : input.snapshot.state.latencyRecords.length > 3
            ? "executive_friction_timeline"
            : "organizational_drag_dashboard";

  return Object.freeze({
    frictionStateId: input.snapshot.frictionStateId,
    topologyId: input.snapshot.topologyId,
    executionLatencyScore: input.snapshot.state.executionLatencyScore,
    organizationalDragLevel: input.snapshot.state.organizationalDragLevel,
    decisionFrictionLabel: input.snapshot.state.decisionFrictionLabel,
    signals: Object.freeze(
      input.snapshot.state.activeFrictionSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          frictionState: signal.frictionState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.executionResistanceBottlenecks.map((b) =>
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
 * Evaluate organizational decision friction (read-only; never infers private psychology).
 */
export function evaluateDecisionFriction(
  input: EvaluateDecisionFrictionInput
): EvaluateDecisionFrictionResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const tick = Math.floor(Number(input.tick ?? input.frictionContext?.tick) || 0);
  const frictionStateId = String(
    input.frictionStateId ?? `decision-friction::${topology.topologyId}::${tick}`
  ).trim();

  const approvalChainDelayFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.015 +
      (input.frictionContext?.approvalChainDelayFactor ?? 0)
  );
  const implementationDragFactor = clamp01Stress(
    input.frictionContext?.implementationDragFactor ?? 0
  );

  logDecisionFrictionDev("DecisionFriction", {
    frictionStateId,
    topologyId: topology.topologyId,
    tick,
    coordinationLabel: coordinationState.coordinationDynamicsLabel,
  });

  const activeFrictionSignals = deriveDecisionFrictionSignals({
    topology,
    actorState,
    coordinationState,
    pressureState: input.pressureState,
    approvalChainDelayFactor,
    implementationDragFactor,
  });

  const strategicResistanceScore = calculateStrategicResistanceScore({
    actorState,
    coordinationState,
    signals: activeFrictionSignals,
  });

  const executionLatencyScore = calculateExecutionLatencyScore({
    signals: activeFrictionSignals,
    coordinationState,
    approvalChainDelayFactor,
    momentumState: input.momentumState,
  });

  const organizationalDragLevel = calculateOrganizationalDragLevel({
    executionLatencyScore,
    strategicResistanceScore,
    recoveryState: input.recoveryState,
    equilibriumState: input.equilibriumState,
    pressureState: input.pressureState,
  });

  const latencyRecords = analyzeDecisionLatency({
    topology,
    actorState,
    coordinationState,
    signals: activeFrictionSignals,
    momentumState: input.momentumState,
    approvalChainDelayFactor,
  });

  const executionResistanceBottlenecks = detectExecutionResistanceBottlenecks({
    topology,
    signals: activeFrictionSignals,
    organizationalDragLevel,
    momentumState: input.momentumState,
    recoveryState: input.recoveryState,
  });

  const dragRecords = analyzeOrganizationalDrag({
    topology,
    signals: activeFrictionSignals,
    organizationalDragLevel,
    momentumState: input.momentumState,
    recoveryState: input.recoveryState,
    equilibriumState: input.equilibriumState,
    pressureState: input.pressureState,
  });

  const frictionHotspots = identifyFrictionHotspots(activeFrictionSignals);
  const resistanceZones = identifyResistanceZones(activeFrictionSignals);

  const actorFingerprint = stableStringify({
    alignment: actorState.organizationalAlignmentScore,
    pressure: actorState.coordinationPressure,
    label: actorState.coordinationQualityLabel,
  });
  const coordinationFingerprint = stableStringify({
    sync: coordinationState.organizationalSynchronizationScore,
    friction: coordinationState.coordinationFrictionScore,
    label: coordinationState.coordinationDynamicsLabel,
  });

  const pendingFingerprint = buildFrictionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateDecisionFriction({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeFrictionSignals,
    priorFrictionFingerprints: input.priorFrictionFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const decisionFrictionLabel = classifyDecisionFrictionLabel({
    executionLatencyScore,
    organizationalDragLevel,
    strategicResistanceScore,
  });

  const state: OrganizationalDecisionFrictionState = Object.freeze({
    activeFrictionSignals: Object.freeze(activeFrictionSignals),
    latencyRecords,
    executionResistanceBottlenecks,
    dragRecords,
    frictionHotspots,
    resistanceZones,
    executionLatencyScore,
    organizationalDragLevel,
    strategicResistanceScore,
    decisionFrictionLabel,
  });

  const semantics = buildExecutiveDecisionFrictionSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    frictionStateId,
    decisionFrictionLabel,
    executionLatencyScore,
    organizationalDragLevel,
  });

  const snapshot: OrganizationalDecisionFrictionSnapshot = Object.freeze({
    frictionStateId,
    topologyId: topology.topologyId,
    coordinationStateId: `coordination::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      latencySummaries: Object.freeze([...semantics.latencySummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      dragSummaries: Object.freeze([...semantics.dragSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: frictionBuiltAt(tick),
  });

  const panelContract = buildDecisionFrictionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeOrganizationalDecisionFrictionSnapshot(
  snapshot: OrganizationalDecisionFrictionSnapshot
): OrganizationalDecisionFrictionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeFrictionSignals: Object.freeze(
        snapshot.state.activeFrictionSignals.map((s) => Object.freeze({ ...s }))
      ),
      latencyRecords: Object.freeze(
        snapshot.state.latencyRecords.map((r) => Object.freeze({ ...r }))
      ),
      executionResistanceBottlenecks: Object.freeze(
        snapshot.state.executionResistanceBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      dragRecords: Object.freeze(snapshot.state.dragRecords.map((r) => Object.freeze({ ...r }))),
      frictionHotspots: Object.freeze([...snapshot.state.frictionHotspots]),
      resistanceZones: Object.freeze([...snapshot.state.resistanceZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
