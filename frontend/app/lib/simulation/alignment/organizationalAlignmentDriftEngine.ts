/**
 * D7:3:7 — Organizational alignment drift engine (immutable, non-mutating).
 */

import type {
  AlignmentPanelContract,
  EvaluateOrganizationalAlignmentInput,
  EvaluateOrganizationalAlignmentResult,
  OrganizationalAlignmentDriftState,
  OrganizationalAlignmentSnapshot,
} from "./alignmentDriftTypes.ts";
import {
  calculateAlignmentDriftScore,
  calculateEnterpriseAlignmentScore,
  calculateStrategicCoherenceLevel,
  classifyAlignmentDriftLabel,
  deriveOrganizationalAlignmentSignals,
  identifyAlignmentDriftZones,
  identifyCoherenceRecoveryZones,
} from "./strategicCoherenceModel.ts";
import {
  analyzeDriftAccumulation,
  detectAlignmentFragmentationBottlenecks,
} from "./driftAccumulationAnalysis.ts";
import { analyzeCrossDomainAlignment } from "./crossDomainAlignmentIntelligence.ts";
import {
  buildAlignmentContentFingerprint,
  guardEvaluateOrganizationalAlignment,
} from "./alignmentGuards.ts";
import { buildExecutiveAlignmentSemantics } from "./executiveAlignmentSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logAlignmentDev } from "./alignmentDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function alignmentBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildAlignmentPanelContract(input: {
  snapshot: OrganizationalAlignmentSnapshot;
}): AlignmentPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.alignmentFragmentationBottlenecks.length > 0
      ? "fragmentation_heatmap"
      : input.snapshot.state.alignmentDriftLabel === "coherent"
        ? "strategic_coherence_dashboard"
        : input.snapshot.state.alignmentDriftZones.length > 2
          ? "alignment_drift_overlay"
          : input.snapshot.state.crossDomainAlignmentRecords.length > 4
            ? "executive_alignment_timeline"
            : "organizational_coherence_panel";

  return Object.freeze({
    alignmentStateId: input.snapshot.alignmentStateId,
    topologyId: input.snapshot.topologyId,
    enterpriseAlignmentScore: input.snapshot.state.enterpriseAlignmentScore,
    strategicCoherenceLevel: input.snapshot.state.strategicCoherenceLevel,
    alignmentDriftLabel: input.snapshot.state.alignmentDriftLabel,
    signals: Object.freeze(
      input.snapshot.state.activeAlignmentSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          alignmentState: signal.alignmentState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.alignmentFragmentationBottlenecks.map((b) =>
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
 * Evaluate organizational alignment drift (read-only; never infers personal ideology or beliefs).
 */
export function evaluateOrganizationalAlignment(
  input: EvaluateOrganizationalAlignmentInput
): EvaluateOrganizationalAlignmentResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const decisionFrictionState = input.decisionFrictionState;
  const influenceState = input.influenceState;
  const trustState = input.trustState;
  const leadershipState = input.leadershipState;
  const tick = Math.floor(Number(input.tick ?? input.alignmentContext?.tick) || 0);
  const alignmentStateId = String(
    input.alignmentStateId ?? `organizational-alignment::${topology.topologyId}::${tick}`
  ).trim();

  const priorityFragmentationFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.01 +
      (input.alignmentContext?.priorityFragmentationFactor ?? 0)
  );
  const coordinationDivergenceFactor = clamp01Stress(
    input.alignmentContext?.coordinationDivergenceFactor ?? 0
  );

  logAlignmentDev("Alignment", {
    alignmentStateId,
    topologyId: topology.topologyId,
    tick,
    leadershipLabel: leadershipState.leadershipDynamicsLabel,
    trustLabel: trustState.trustStabilityLabel,
  });

  const activeAlignmentSignals = deriveOrganizationalAlignmentSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    trustState,
    leadershipState,
    priorityFragmentationFactor,
    coordinationDivergenceFactor,
  });

  const enterpriseAlignmentScore = calculateEnterpriseAlignmentScore({
    actorState,
    coordinationState,
    influenceState,
    trustState,
    signals: activeAlignmentSignals,
  });

  const alignmentDriftScore = calculateAlignmentDriftScore({
    signals: activeAlignmentSignals,
    coordinationState,
    decisionFrictionState,
    leadershipState,
    coordinationDivergenceFactor,
  });

  const strategicCoherenceLevel = calculateStrategicCoherenceLevel({
    enterpriseAlignmentScore,
    alignmentDriftScore,
    leadershipState,
    trustState,
  });

  const driftAccumulationRecords = analyzeDriftAccumulation({
    topology,
    signals: activeAlignmentSignals,
    alignmentDriftScore,
    coordinationState,
    coordinationDivergenceFactor,
  });

  const alignmentFragmentationBottlenecks = detectAlignmentFragmentationBottlenecks({
    topology,
    signals: activeAlignmentSignals,
    alignmentDriftScore,
    coordinationState,
    decisionFrictionState,
    leadershipState,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
  });

  const crossDomainAlignmentRecords = analyzeCrossDomainAlignment({
    topology,
    signals: activeAlignmentSignals,
    strategicCoherenceLevel,
    alignmentDriftScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const alignmentDriftZones = identifyAlignmentDriftZones(activeAlignmentSignals);
  const coherenceRecoveryZones = identifyCoherenceRecoveryZones(activeAlignmentSignals);

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
  const leadershipFingerprint = stableStringify({
    burden: leadershipState.leadershipBurdenScore,
    label: leadershipState.leadershipDynamicsLabel,
  });

  const pendingFingerprint = buildAlignmentContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    frictionFingerprint,
    influenceFingerprint,
    trustFingerprint,
    leadershipFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateOrganizationalAlignment({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeAlignmentSignals,
    priorAlignmentFingerprints: input.priorAlignmentFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const alignmentDriftLabel = classifyAlignmentDriftLabel({
    enterpriseAlignmentScore,
    alignmentDriftScore,
    strategicCoherenceLevel,
  });

  const state: OrganizationalAlignmentDriftState = Object.freeze({
    activeAlignmentSignals: Object.freeze(activeAlignmentSignals),
    driftAccumulationRecords,
    alignmentFragmentationBottlenecks,
    crossDomainAlignmentRecords,
    alignmentDriftZones,
    coherenceRecoveryZones,
    enterpriseAlignmentScore,
    alignmentDriftScore,
    strategicCoherenceLevel,
    alignmentDriftLabel,
  });

  const semantics = buildExecutiveAlignmentSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    alignmentStateId,
    alignmentDriftLabel,
    enterpriseAlignmentScore,
    alignmentDriftScore,
  });

  const snapshot: OrganizationalAlignmentSnapshot = Object.freeze({
    alignmentStateId,
    topologyId: topology.topologyId,
    leadershipStateId: `leadership-dynamics::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      driftSummaries: Object.freeze([...semantics.driftSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      crossDomainSummaries: Object.freeze([...semantics.crossDomainSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: alignmentBuiltAt(tick),
  });

  const panelContract = buildAlignmentPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeOrganizationalAlignmentSnapshot(
  snapshot: OrganizationalAlignmentSnapshot
): OrganizationalAlignmentSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeAlignmentSignals: Object.freeze(
        snapshot.state.activeAlignmentSignals.map((s) => Object.freeze({ ...s }))
      ),
      driftAccumulationRecords: Object.freeze(
        snapshot.state.driftAccumulationRecords.map((r) => Object.freeze({ ...r }))
      ),
      alignmentFragmentationBottlenecks: Object.freeze(
        snapshot.state.alignmentFragmentationBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      crossDomainAlignmentRecords: Object.freeze(
        snapshot.state.crossDomainAlignmentRecords.map((r) => Object.freeze({ ...r }))
      ),
      alignmentDriftZones: Object.freeze([...snapshot.state.alignmentDriftZones]),
      coherenceRecoveryZones: Object.freeze([...snapshot.state.coherenceRecoveryZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
