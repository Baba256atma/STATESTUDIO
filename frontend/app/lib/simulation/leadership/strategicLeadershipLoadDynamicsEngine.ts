/**
 * D7:3:6 — Strategic leadership load dynamics engine (immutable, non-mutating).
 */

import type {
  EvaluateLeadershipDynamicsInput,
  EvaluateLeadershipDynamicsResult,
  LeadershipDynamicsSnapshot,
  LeadershipDynamicsState,
  LeadershipPanelContract,
} from "./leadershipLoadTypes.ts";
import {
  buildExecutiveBurdenRecords,
  calculateCoordinationCapacityLevel,
  calculateExecutiveLoadBalanceScore,
  calculateLeadershipBurdenScore,
  classifyLeadershipDynamicsLabel,
  deriveLeadershipLoadSignals,
  identifyLeadershipSaturationZones,
} from "./executiveBurdenDistributionModel.ts";
import { detectLeadershipSaturationBottlenecks } from "./leadershipSaturationAnalysis.ts";
import { analyzeCoordinationCapacity } from "./coordinationCapacityIntelligence.ts";
import {
  buildLeadershipContentFingerprint,
  guardEvaluateLeadershipDynamics,
} from "./leadershipGuards.ts";
import { buildExecutiveLeadershipSemantics } from "./executiveLeadershipSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logLeadershipDev } from "./leadershipDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function leadershipBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildLeadershipPanelContract(input: {
  snapshot: LeadershipDynamicsSnapshot;
}): LeadershipPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.leadershipSaturationBottlenecks.length > 0
      ? "strategic_oversight_panel"
      : input.snapshot.state.leadershipDynamicsLabel === "balanced"
        ? "executive_burden_dashboard"
        : input.snapshot.state.leadershipSaturationZones.length > 2
          ? "coordination_capacity_heatmap"
          : input.snapshot.state.coordinationCapacityRecords.length > 4
            ? "leadership_stability_timeline"
            : "leadership_load_overlay";

  return Object.freeze({
    leadershipStateId: input.snapshot.leadershipStateId,
    topologyId: input.snapshot.topologyId,
    executiveLoadBalanceScore: input.snapshot.state.executiveLoadBalanceScore,
    coordinationCapacityLevel: input.snapshot.state.coordinationCapacityLevel,
    leadershipDynamicsLabel: input.snapshot.state.leadershipDynamicsLabel,
    signals: Object.freeze(
      input.snapshot.state.activeLeadershipSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          leadershipLoadState: signal.leadershipLoadState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.leadershipSaturationBottlenecks.map((b) =>
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
 * Evaluate strategic leadership load dynamics (read-only; never infers mental/emotional conditions).
 */
export function evaluateLeadershipDynamics(
  input: EvaluateLeadershipDynamicsInput
): EvaluateLeadershipDynamicsResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const decisionFrictionState = input.decisionFrictionState;
  const influenceState = input.influenceState;
  const trustState = input.trustState;
  const tick = Math.floor(Number(input.tick ?? input.leadershipContext?.tick) || 0);
  const leadershipStateId = String(
    input.leadershipStateId ?? `leadership-dynamics::${topology.topologyId}::${tick}`
  ).trim();

  const strategicBurdenFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.01 +
      (input.leadershipContext?.strategicBurdenFactor ?? 0)
  );
  const oversightConcentrationFactor = clamp01Stress(
    input.leadershipContext?.oversightConcentrationFactor ?? 0
  );

  logLeadershipDev("LeadershipLoad", {
    leadershipStateId,
    topologyId: topology.topologyId,
    tick,
    trustLabel: trustState.trustStabilityLabel,
    frictionLabel: decisionFrictionState.decisionFrictionLabel,
  });

  const activeLeadershipSignals = deriveLeadershipLoadSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    trustState,
    strategicBurdenFactor,
    oversightConcentrationFactor,
  });

  const burdenRecords = buildExecutiveBurdenRecords({ actorState, signals: activeLeadershipSignals });
  const executiveLoadBalanceScore = calculateExecutiveLoadBalanceScore({
    actorState,
    signals: activeLeadershipSignals,
  });
  const leadershipBurdenScore = calculateLeadershipBurdenScore({
    signals: activeLeadershipSignals,
    coordinationState,
    decisionFrictionState,
  });
  const coordinationCapacityLevel = calculateCoordinationCapacityLevel({
    coordinationState,
    trustState,
    influenceState,
    executiveLoadBalanceScore,
  });

  const leadershipSaturationBottlenecks = detectLeadershipSaturationBottlenecks({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    trustState,
    signals: activeLeadershipSignals,
    leadershipBurdenScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
  });

  const coordinationCapacityRecords = analyzeCoordinationCapacity({
    topology,
    signals: activeLeadershipSignals,
    coordinationCapacityLevel,
    leadershipBurdenScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const leadershipSaturationZones = identifyLeadershipSaturationZones(activeLeadershipSignals);

  const actorFingerprint = stableStringify({
    alignment: actorState.organizationalAlignmentScore,
    pressure: actorState.coordinationPressure,
    label: actorState.coordinationQualityLabel,
  });
  const coordinationFingerprint = stableStringify({
    sync: coordinationState.organizationalSynchronizationScore,
    label: coordinationState.coordinationDynamicsLabel,
  });
  const frictionFingerprint = stableStringify({
    drag: decisionFrictionState.organizationalDragLevel,
    label: decisionFrictionState.decisionFrictionLabel,
  });
  const influenceFingerprint = stableStringify({
    propagation: influenceState.influencePropagationScore,
    label: influenceState.influenceStabilityLabel,
  });
  const trustFingerprint = stableStringify({
    trust: trustState.organizationalTrustScore,
    label: trustState.trustStabilityLabel,
  });

  const pendingFingerprint = buildLeadershipContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    frictionFingerprint,
    influenceFingerprint,
    trustFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateLeadershipDynamics({
    topologyId: topology.topologyId,
    actorIds: actorState.activeActors.map((a) => a.actorId),
    signals: activeLeadershipSignals,
    priorLeadershipFingerprints: input.priorLeadershipFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const leadershipDynamicsLabel = classifyLeadershipDynamicsLabel({
    executiveLoadBalanceScore,
    leadershipBurdenScore,
    coordinationCapacityLevel,
  });

  const state: LeadershipDynamicsState = Object.freeze({
    activeLeadershipSignals: Object.freeze(activeLeadershipSignals),
    burdenRecords: Object.freeze(burdenRecords),
    leadershipSaturationBottlenecks,
    coordinationCapacityRecords,
    leadershipSaturationZones,
    executiveLoadBalanceScore,
    coordinationCapacityLevel,
    leadershipBurdenScore,
    leadershipDynamicsLabel,
  });

  const semantics = buildExecutiveLeadershipSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    leadershipStateId,
    leadershipDynamicsLabel,
    executiveLoadBalanceScore,
    leadershipBurdenScore,
  });

  const snapshot: LeadershipDynamicsSnapshot = Object.freeze({
    leadershipStateId,
    topologyId: topology.topologyId,
    trustStateId: `organizational-trust::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      burdenSummaries: Object.freeze([...semantics.burdenSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      capacitySummaries: Object.freeze([...semantics.capacitySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: leadershipBuiltAt(tick),
  });

  const panelContract = buildLeadershipPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeLeadershipDynamicsSnapshot(
  snapshot: LeadershipDynamicsSnapshot
): LeadershipDynamicsSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeLeadershipSignals: Object.freeze(
        snapshot.state.activeLeadershipSignals.map((s) => Object.freeze({ ...s }))
      ),
      burdenRecords: Object.freeze(snapshot.state.burdenRecords.map((r) => Object.freeze({ ...r }))),
      leadershipSaturationBottlenecks: Object.freeze(
        snapshot.state.leadershipSaturationBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      coordinationCapacityRecords: Object.freeze(
        snapshot.state.coordinationCapacityRecords.map((r) => Object.freeze({ ...r }))
      ),
      leadershipSaturationZones: Object.freeze([...snapshot.state.leadershipSaturationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
