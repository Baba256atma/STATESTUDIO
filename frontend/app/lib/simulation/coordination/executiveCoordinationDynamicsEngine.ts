/**
 * D7:3:2 — Executive coordination dynamics engine (immutable, non-mutating).
 */

import type {
  CoordinationPanelContract,
  EvaluateExecutiveCoordinationInput,
  EvaluateExecutiveCoordinationResult,
  ExecutiveCoordinationSnapshot,
  ExecutiveCoordinationState,
} from "./coordinationDynamicsTypes.ts";
import {
  calculateCoordinationFrictionScore,
  calculateExecutiveAlignmentScore,
  calculateOrganizationalSynchronizationScore,
  classifyCoordinationDynamicsLabel,
  deriveExecutiveCoordinationSignals,
  identifyAlignmentZones,
  identifyFrictionZones,
} from "./alignmentFrictionModel.ts";
import { detectCoordinationBottlenecks } from "./coordinationBottleneckAnalysis.ts";
import { analyzeCrossDomainSynchronization } from "./crossDomainSynchronization.ts";
import {
  buildCoordinationContentFingerprint,
  guardEvaluateExecutiveCoordination,
} from "./coordinationGuards.ts";
import { buildExecutiveCoordinationSemantics } from "./executiveCoordinationSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logCoordinationDev } from "./coordinationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function coordinationBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildCoordinationPanelContract(input: {
  snapshot: ExecutiveCoordinationSnapshot;
}): CoordinationPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.coordinationBottlenecks.length > 0
      ? "alignment_heatmap"
      : input.snapshot.state.coordinationDynamicsLabel === "synchronized"
        ? "synchronization_dashboard"
        : input.snapshot.state.activeCoordinationSignals.length > 4
          ? "coordination_timeline"
          : "executive_coordination_overlay";

  return Object.freeze({
    coordinationStateId: input.snapshot.coordinationStateId,
    topologyId: input.snapshot.topologyId,
    organizationalSynchronizationScore: input.snapshot.state.organizationalSynchronizationScore,
    executiveAlignmentScore: input.snapshot.state.executiveAlignmentScore,
    coordinationDynamicsLabel: input.snapshot.state.coordinationDynamicsLabel,
    signals: Object.freeze(
      input.snapshot.state.activeCoordinationSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          coordinationState: signal.coordinationState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.coordinationBottlenecks.map((b) =>
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
 * Evaluate executive coordination dynamics (read-only; never infers private psychological states).
 */
export function evaluateExecutiveCoordination(
  input: EvaluateExecutiveCoordinationInput
): EvaluateExecutiveCoordinationResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const tick = Math.floor(Number(input.tick ?? input.coordinationContext?.tick) || 0);
  const coordinationStateId = String(
    input.coordinationStateId ?? `coordination::${topology.topologyId}::${tick}`
  ).trim();

  const communicationDelayFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.02 +
      (input.coordinationContext?.communicationDelayFactor ?? 0)
  );

  logCoordinationDev("Coordination", {
    coordinationStateId,
    topologyId: topology.topologyId,
    tick,
    actorCoordinationLabel: actorState.coordinationQualityLabel,
  });

  const activeCoordinationSignals = deriveExecutiveCoordinationSignals({
    actorState,
    communicationDelayFactor,
  });
  const synchronizationRecords = analyzeCrossDomainSynchronization({
    topology,
    actorState,
    communicationDelayFactor,
  });
  const coordinationBottlenecks = detectCoordinationBottlenecks({
    topology,
    actorState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    communicationDelayFactor,
  });

  const executiveAlignmentScore = calculateExecutiveAlignmentScore({
    actorState,
    signals: activeCoordinationSignals,
  });
  const coordinationFrictionScore = calculateCoordinationFrictionScore({
    actorState,
    signals: activeCoordinationSignals,
    communicationDelayFactor,
  });
  const organizationalSynchronizationScore = calculateOrganizationalSynchronizationScore({
    executiveAlignmentScore,
    coordinationFrictionScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });
  const alignmentZones = identifyAlignmentZones(activeCoordinationSignals);
  const frictionZones = identifyFrictionZones(activeCoordinationSignals);

  const actorFingerprint = stableStringify({
    alignment: actorState.organizationalAlignmentScore,
    pressure: actorState.coordinationPressure,
    label: actorState.coordinationQualityLabel,
  });
  const momentumFingerprint = input.momentumState
    ? stableStringify({ trend: input.momentumState.momentumTrendLabel })
    : undefined;

  const pendingFingerprint = buildCoordinationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    actorFingerprint,
    momentumFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveCoordination({
    topologyId: topology.topologyId,
    actorIds: actorState.activeActors.map((a) => a.actorId),
    signals: activeCoordinationSignals,
    priorCoordinationFingerprints: input.priorCoordinationFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const coordinationDynamicsLabel = classifyCoordinationDynamicsLabel({
    organizationalSynchronizationScore,
    coordinationFrictionScore,
    actorCoordinationLabel: actorState.coordinationQualityLabel,
    recoveryState: input.recoveryState,
    signals: activeCoordinationSignals,
  });

  const state: ExecutiveCoordinationState = Object.freeze({
    activeCoordinationSignals: Object.freeze(activeCoordinationSignals),
    synchronizationRecords,
    coordinationBottlenecks,
    alignmentZones,
    frictionZones,
    organizationalSynchronizationScore,
    coordinationFrictionScore,
    executiveAlignmentScore,
    coordinationDynamicsLabel,
  });

  const semantics = buildExecutiveCoordinationSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    coordinationStateId,
    coordinationDynamicsLabel,
    organizationalSynchronizationScore,
    executiveAlignmentScore,
  });

  const snapshot: ExecutiveCoordinationSnapshot = Object.freeze({
    coordinationStateId,
    topologyId: topology.topologyId,
    actorStateId: `actors::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      synchronizationSummaries: Object.freeze([...semantics.synchronizationSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: coordinationBuiltAt(tick),
  });

  const panelContract = buildCoordinationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeExecutiveCoordinationSnapshot(
  snapshot: ExecutiveCoordinationSnapshot
): ExecutiveCoordinationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCoordinationSignals: Object.freeze(
        snapshot.state.activeCoordinationSignals.map((s) => Object.freeze({ ...s }))
      ),
      synchronizationRecords: Object.freeze(
        snapshot.state.synchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      coordinationBottlenecks: Object.freeze(
        snapshot.state.coordinationBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      alignmentZones: Object.freeze([...snapshot.state.alignmentZones]),
      frictionZones: Object.freeze([...snapshot.state.frictionZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
