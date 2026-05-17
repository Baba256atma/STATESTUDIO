/**
 * D7:3:4 — Stakeholder influence propagation engine (immutable, non-mutating).
 */

import type {
  EvaluateStakeholderInfluenceInput,
  EvaluateStakeholderInfluenceResult,
  InfluencePanelContract,
  StakeholderInfluenceSnapshot,
  StakeholderInfluenceState,
} from "./stakeholderInfluenceTypes.ts";
import {
  calculateInfluencePropagationScore,
  calculateOrganizationalAlignmentLevel,
  calculateResistanceConcentrationScore,
  classifyInfluenceStabilityLabel,
  deriveStakeholderInfluenceSignals,
  identifyInfluenceAlignmentZones,
  identifyInfluenceHotspots,
  identifyInfluenceResistanceZones,
} from "./alignmentResistancePropagationModel.ts";
import { detectInfluenceBottlenecks } from "./influenceBottleneckAnalysis.ts";
import { analyzeCrossDomainInfluencePropagation } from "./crossDomainInfluenceIntelligence.ts";
import {
  buildInfluenceContentFingerprint,
  guardEvaluateStakeholderInfluence,
} from "./influenceGuards.ts";
import { buildExecutiveInfluenceSemantics } from "./executiveInfluenceSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logInfluenceDev } from "./influenceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function influenceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildInfluencePanelContract(input: {
  snapshot: StakeholderInfluenceSnapshot;
}): InfluencePanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.influenceBottlenecks.length > 0
      ? "resistance_heatmap"
      : input.snapshot.state.influenceStabilityLabel === "stable"
        ? "stakeholder_alignment_dashboard"
        : input.snapshot.state.resistanceZones.length > 2
          ? "executive_influence_timeline"
          : input.snapshot.state.propagationRecords.length > 4
            ? "influence_propagation_overlay"
            : "organizational_trust_panel";

  return Object.freeze({
    influenceStateId: input.snapshot.influenceStateId,
    topologyId: input.snapshot.topologyId,
    organizationalAlignmentLevel: input.snapshot.state.organizationalAlignmentLevel,
    influencePropagationScore: input.snapshot.state.influencePropagationScore,
    influenceStabilityLabel: input.snapshot.state.influenceStabilityLabel,
    signals: Object.freeze(
      input.snapshot.state.activeInfluenceSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          influenceState: signal.influenceState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.influenceBottlenecks.map((b) =>
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
 * Evaluate stakeholder influence propagation (read-only; never infers private beliefs or emotions).
 */
export function evaluateStakeholderInfluence(
  input: EvaluateStakeholderInfluenceInput
): EvaluateStakeholderInfluenceResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const decisionFrictionState = input.decisionFrictionState;
  const tick = Math.floor(Number(input.tick ?? input.influenceContext?.tick) || 0);
  const influenceStateId = String(
    input.influenceStateId ?? `stakeholder-influence::${topology.topologyId}::${tick}`
  ).trim();

  const propagationDelayFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.012 +
      (input.influenceContext?.propagationDelayFactor ?? 0)
  );

  logInfluenceDev("StakeholderInfluence", {
    influenceStateId,
    topologyId: topology.topologyId,
    tick,
    coordinationLabel: coordinationState.coordinationDynamicsLabel,
    frictionLabel: decisionFrictionState.decisionFrictionLabel,
  });

  const activeInfluenceSignals = deriveStakeholderInfluenceSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    propagationDelayFactor,
  });

  const organizationalAlignmentLevel = calculateOrganizationalAlignmentLevel({
    actorState,
    coordinationState,
    signals: activeInfluenceSignals,
  });

  const influencePropagationScore = calculateInfluencePropagationScore({
    signals: activeInfluenceSignals,
    coordinationState,
    decisionFrictionState,
    propagationDelayFactor,
  });

  const resistanceConcentrationScore = calculateResistanceConcentrationScore({
    signals: activeInfluenceSignals,
    decisionFrictionState,
    coordinationState,
  });

  const propagationRecords = analyzeCrossDomainInfluencePropagation({
    topology,
    actorState,
    signals: activeInfluenceSignals,
    influencePropagationScore,
    resistanceConcentrationScore,
    propagationDelayFactor,
    momentumState: input.momentumState,
    recoveryState: input.recoveryState,
    equilibriumState: input.equilibriumState,
  });

  const influenceBottlenecks = detectInfluenceBottlenecks({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    signals: activeInfluenceSignals,
    momentumState: input.momentumState,
    propagationDelayFactor,
  });

  const influenceHotspots = identifyInfluenceHotspots(activeInfluenceSignals);
  const resistanceZones = identifyInfluenceResistanceZones(activeInfluenceSignals);
  const alignmentZones = identifyInfluenceAlignmentZones(activeInfluenceSignals);

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

  const pendingFingerprint = buildInfluenceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    frictionFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateStakeholderInfluence({
    topologyId: topology.topologyId,
    actorIds: actorState.activeActors.map((a) => a.actorId),
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeInfluenceSignals,
    priorInfluenceFingerprints: input.priorInfluenceFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const influenceStabilityLabel = classifyInfluenceStabilityLabel({
    organizationalAlignmentLevel,
    influencePropagationScore,
    resistanceConcentrationScore,
  });

  const state: StakeholderInfluenceState = Object.freeze({
    activeInfluenceSignals: Object.freeze(activeInfluenceSignals),
    propagationRecords,
    influenceBottlenecks,
    influenceHotspots,
    resistanceZones,
    alignmentZones,
    organizationalAlignmentLevel,
    influencePropagationScore,
    resistanceConcentrationScore,
    influenceStabilityLabel,
  });

  const semantics = buildExecutiveInfluenceSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    influenceStateId,
    influenceStabilityLabel,
    organizationalAlignmentLevel,
    influencePropagationScore,
  });

  const snapshot: StakeholderInfluenceSnapshot = Object.freeze({
    influenceStateId,
    topologyId: topology.topologyId,
    frictionStateId: `decision-friction::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      propagationSummaries: Object.freeze([...semantics.propagationSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: influenceBuiltAt(tick),
  });

  const panelContract = buildInfluencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeStakeholderInfluenceSnapshot(
  snapshot: StakeholderInfluenceSnapshot
): StakeholderInfluenceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeInfluenceSignals: Object.freeze(
        snapshot.state.activeInfluenceSignals.map((s) => Object.freeze({ ...s }))
      ),
      propagationRecords: Object.freeze(
        snapshot.state.propagationRecords.map((r) => Object.freeze({ ...r }))
      ),
      influenceBottlenecks: Object.freeze(
        snapshot.state.influenceBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      influenceHotspots: Object.freeze([...snapshot.state.influenceHotspots]),
      resistanceZones: Object.freeze([...snapshot.state.resistanceZones]),
      alignmentZones: Object.freeze([...snapshot.state.alignmentZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
