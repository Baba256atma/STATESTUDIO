/**
 * D7:3:5 — Organizational trust stability engine (immutable, non-mutating).
 */

import type {
  EvaluateOrganizationalTrustInput,
  EvaluateOrganizationalTrustResult,
  OrganizationalTrustSnapshot,
  OrganizationalTrustState,
  TrustPanelContract,
} from "./trustStabilityTypes.ts";
import {
  calculateOrganizationalTrustScore,
  calculateTrustDegradationScore,
  calculateTrustRecoveryMomentum,
  classifyTrustStabilityLabel,
  deriveOrganizationalTrustSignals,
  identifyTrustFragilityZones,
  identifyTrustRecoveryZones,
} from "./trustDegradationRecoveryModel.ts";
import {
  analyzeCoordinationTrust,
  detectTrustStabilityBottlenecks,
} from "./coordinationTrustAnalysis.ts";
import { analyzeCrossDomainTrustStability } from "./crossDomainTrustStability.ts";
import { buildTrustContentFingerprint, guardEvaluateOrganizationalTrust } from "./trustGuards.ts";
import { buildExecutiveTrustSemantics } from "./executiveTrustSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logTrustDev } from "./trustDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function trustBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildTrustPanelContract(input: {
  snapshot: OrganizationalTrustSnapshot;
}): TrustPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.trustBottlenecks.length > 0
      ? "coordination_resilience_panel"
      : input.snapshot.state.trustStabilityLabel === "stable"
        ? "organizational_confidence_dashboard"
        : input.snapshot.state.trustFragilityZones.length > 2
          ? "trust_fragility_heatmap"
          : input.snapshot.state.crossDomainTrustRecords.length > 4
            ? "executive_trust_timeline"
            : "trust_stability_overlay";

  return Object.freeze({
    trustStateId: input.snapshot.trustStateId,
    topologyId: input.snapshot.topologyId,
    organizationalTrustScore: input.snapshot.state.organizationalTrustScore,
    trustStabilityLabel: input.snapshot.state.trustStabilityLabel,
    signals: Object.freeze(
      input.snapshot.state.activeTrustSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          trustState: signal.trustState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.trustBottlenecks.map((b) =>
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
 * Evaluate organizational trust stability (read-only; never infers private emotional states).
 */
export function evaluateOrganizationalTrust(
  input: EvaluateOrganizationalTrustInput
): EvaluateOrganizationalTrustResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const influenceState = input.influenceState;
  const decisionFrictionState = input.decisionFrictionState;
  const tick = Math.floor(Number(input.tick ?? input.trustContext?.tick) || 0);
  const trustStateId = String(
    input.trustStateId ?? `organizational-trust::${topology.topologyId}::${tick}`
  ).trim();

  const coordinationFailureFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.01 +
      (input.trustContext?.coordinationFailureFactor ?? 0)
  );
  const trustErosionFactor = clamp01Stress(input.trustContext?.trustErosionFactor ?? 0);

  logTrustDev("Trust", {
    trustStateId,
    topologyId: topology.topologyId,
    tick,
    coordinationLabel: coordinationState.coordinationDynamicsLabel,
    influenceLabel: influenceState.influenceStabilityLabel,
  });

  const activeTrustSignals = deriveOrganizationalTrustSignals({
    topology,
    actorState,
    coordinationState,
    influenceState,
    decisionFrictionState,
    recoveryState: input.recoveryState,
    coordinationFailureFactor,
    trustErosionFactor,
  });

  const organizationalTrustScore = calculateOrganizationalTrustScore({
    actorState,
    coordinationState,
    influenceState,
    signals: activeTrustSignals,
  });

  const trustDegradationScore = calculateTrustDegradationScore({
    signals: activeTrustSignals,
    coordinationState,
    decisionFrictionState,
    coordinationFailureFactor,
  });

  const trustRecoveryMomentum = calculateTrustRecoveryMomentum({
    recoveryState: input.recoveryState,
    influenceState,
    coordinationState,
    signals: activeTrustSignals,
  });

  const coordinationTrustRecords = analyzeCoordinationTrust({
    topology,
    coordinationState,
    influenceState,
    decisionFrictionState,
    signals: activeTrustSignals,
  });

  const trustBottlenecks = detectTrustStabilityBottlenecks({
    topology,
    coordinationState,
    influenceState,
    decisionFrictionState,
    signals: activeTrustSignals,
    organizationalTrustScore,
    momentumState: input.momentumState,
  });

  const crossDomainTrustRecords = analyzeCrossDomainTrustStability({
    topology,
    signals: activeTrustSignals,
    organizationalTrustScore,
    trustDegradationScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const trustFragilityZones = identifyTrustFragilityZones(activeTrustSignals);
  const trustRecoveryZones = identifyTrustRecoveryZones(activeTrustSignals);

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

  const pendingFingerprint = buildTrustContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    frictionFingerprint,
    influenceFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateOrganizationalTrust({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeTrustSignals,
    priorTrustFingerprints: input.priorTrustFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const trustStabilityLabel = classifyTrustStabilityLabel({
    organizationalTrustScore,
    trustDegradationScore,
    trustRecoveryMomentum,
  });

  const state: OrganizationalTrustState = Object.freeze({
    activeTrustSignals: Object.freeze(activeTrustSignals),
    coordinationTrustRecords,
    trustBottlenecks,
    crossDomainTrustRecords,
    trustFragilityZones,
    trustRecoveryZones,
    organizationalTrustScore,
    trustDegradationScore,
    trustRecoveryMomentum,
    trustStabilityLabel,
  });

  const semantics = buildExecutiveTrustSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    trustStateId,
    trustStabilityLabel,
    organizationalTrustScore,
    trustDegradationScore,
  });

  const snapshot: OrganizationalTrustSnapshot = Object.freeze({
    trustStateId,
    topologyId: topology.topologyId,
    influenceStateId: `stakeholder-influence::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      coordinationTrustSummaries: Object.freeze([...semantics.coordinationTrustSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      crossDomainSummaries: Object.freeze([...semantics.crossDomainSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: trustBuiltAt(tick),
  });

  const panelContract = buildTrustPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeOrganizationalTrustSnapshot(
  snapshot: OrganizationalTrustSnapshot
): OrganizationalTrustSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeTrustSignals: Object.freeze(
        snapshot.state.activeTrustSignals.map((s) => Object.freeze({ ...s }))
      ),
      coordinationTrustRecords: Object.freeze(
        snapshot.state.coordinationTrustRecords.map((r) => Object.freeze({ ...r }))
      ),
      trustBottlenecks: Object.freeze(
        snapshot.state.trustBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      crossDomainTrustRecords: Object.freeze(
        snapshot.state.crossDomainTrustRecords.map((r) => Object.freeze({ ...r }))
      ),
      trustFragilityZones: Object.freeze([...snapshot.state.trustFragilityZones]),
      trustRecoveryZones: Object.freeze([...snapshot.state.trustRecoveryZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
