/**
 * D7:3:8 — Enterprise human-system resilience engine (immutable, non-mutating).
 */

import type {
  EvaluateHumanSystemResilienceInput,
  EvaluateHumanSystemResilienceResult,
  HumanSystemResilienceSnapshot,
  HumanSystemResilienceState,
  ResiliencePanelContract,
} from "./humanSystemResilienceTypes.ts";
import {
  calculateEnterpriseResilienceScore,
  calculateHumanSystemAdaptationLevel,
  calculateResilienceDegradationScore,
  classifyResilienceStabilityLabel,
  deriveHumanSystemResilienceSignals,
  identifyAdaptiveRecoveryZones,
  identifyHumanSystemResilienceFragilityZones,
} from "./adaptiveCoordinationModel.ts";
import {
  analyzeAdaptiveCoordination,
  detectResilienceBottlenecks,
} from "./resilienceDegradationRecoveryAnalysis.ts";
import { analyzeCrossDomainResilience } from "./crossDomainResilienceIntelligence.ts";
import {
  buildHumanSystemResilienceContentFingerprint,
  guardEvaluateHumanSystemResilience,
} from "./humanSystemResilienceGuards.ts";
import { buildExecutiveResilienceSemantics } from "./executiveResilienceSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logHumanSystemResilienceDev } from "./humanSystemResilienceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function resilienceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildResiliencePanelContract(input: {
  snapshot: HumanSystemResilienceSnapshot;
}): ResiliencePanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.resilienceBottlenecks.length > 0
      ? "resilience_fragility_heatmap"
      : input.snapshot.state.resilienceStabilityLabel === "adaptive"
        ? "adaptive_recovery_dashboard"
        : input.snapshot.state.resilienceFragilityZones.length > 2
          ? "resilience_overlay"
          : input.snapshot.state.crossDomainResilienceRecords.length > 4
            ? "executive_resilience_timeline"
            : "human_system_recovery_panel";

  return Object.freeze({
    resilienceStateId: input.snapshot.resilienceStateId,
    topologyId: input.snapshot.topologyId,
    enterpriseResilienceScore: input.snapshot.state.enterpriseResilienceScore,
    humanSystemAdaptationLevel: input.snapshot.state.humanSystemAdaptationLevel,
    resilienceStabilityLabel: input.snapshot.state.resilienceStabilityLabel,
    signals: Object.freeze(
      input.snapshot.state.activeResilienceSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          resilienceState: signal.resilienceState,
          intensity: signal.intensity,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.resilienceBottlenecks.map((b) =>
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
 * Evaluate enterprise human-system resilience (read-only; never infers emotional/mental health conditions).
 */
export function evaluateHumanSystemResilience(
  input: EvaluateHumanSystemResilienceInput
): EvaluateHumanSystemResilienceResult {
  const topology = input.topology;
  const actorState = input.actorState;
  const coordinationState = input.coordinationState;
  const decisionFrictionState = input.decisionFrictionState;
  const influenceState = input.influenceState;
  const trustState = input.trustState;
  const leadershipState = input.leadershipState;
  const alignmentState = input.alignmentState;
  const tick = Math.floor(Number(input.tick ?? input.resilienceContext?.tick) || 0);
  const resilienceStateId = String(
    input.resilienceStateId ?? `human-system-resilience::${topology.topologyId}::${tick}`
  ).trim();

  const resilienceFatigueFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.01 +
      (input.resilienceContext?.resilienceFatigueFactor ?? 0)
  );
  const adaptationStressFactor = clamp01Stress(
    input.resilienceContext?.adaptationStressFactor ?? 0
  );

  logHumanSystemResilienceDev("Resilience", {
    resilienceStateId,
    topologyId: topology.topologyId,
    tick,
    alignmentLabel: alignmentState.alignmentDriftLabel,
    trustLabel: trustState.trustStabilityLabel,
  });

  const activeResilienceSignals = deriveHumanSystemResilienceSignals({
    topology,
    actorState,
    coordinationState,
    decisionFrictionState,
    influenceState,
    trustState,
    leadershipState,
    alignmentState,
    recoveryState: input.recoveryState,
    resilienceFatigueFactor,
    adaptationStressFactor,
  });

  const enterpriseResilienceScore = calculateEnterpriseResilienceScore({
    coordinationState,
    trustState,
    leadershipState,
    alignmentState,
    recoveryState: input.recoveryState,
    signals: activeResilienceSignals,
  });

  const resilienceDegradationScore = calculateResilienceDegradationScore({
    signals: activeResilienceSignals,
    trustState,
    leadershipState,
    alignmentState,
    resilienceFatigueFactor,
  });

  const humanSystemAdaptationLevel = calculateHumanSystemAdaptationLevel({
    enterpriseResilienceScore,
    resilienceDegradationScore,
    coordinationState,
    influenceState,
  });

  const adaptiveCoordinationRecords = analyzeAdaptiveCoordination({
    topology,
    signals: activeResilienceSignals,
    coordinationState,
    humanSystemAdaptationLevel,
  });

  const resilienceBottlenecks = detectResilienceBottlenecks({
    topology,
    signals: activeResilienceSignals,
    coordinationState,
    trustState,
    leadershipState,
    decisionFrictionState,
    resilienceDegradationScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
  });

  const crossDomainResilienceRecords = analyzeCrossDomainResilience({
    topology,
    signals: activeResilienceSignals,
    enterpriseResilienceScore,
    resilienceDegradationScore,
    recoveryState: input.recoveryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const resilienceFragilityZones = identifyHumanSystemResilienceFragilityZones(
    activeResilienceSignals
  );
  const adaptiveRecoveryZones = identifyAdaptiveRecoveryZones(activeResilienceSignals);

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
  const alignmentFingerprint = stableStringify({
    coherence: alignmentState.strategicCoherenceLevel,
    label: alignmentState.alignmentDriftLabel,
  });

  const pendingFingerprint = buildHumanSystemResilienceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    coordinationFingerprint,
    frictionFingerprint,
    influenceFingerprint,
    trustFingerprint,
    leadershipFingerprint,
    alignmentFingerprint,
    actorFingerprint,
    tick,
  });

  const guard = guardEvaluateHumanSystemResilience({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeResilienceSignals,
    priorResilienceFingerprints: input.priorResilienceFingerprints,
    pendingFingerprint,
  });
  if (!guard.ok) return { ok: false, guard };

  const resilienceStabilityLabel = classifyResilienceStabilityLabel({
    enterpriseResilienceScore,
    resilienceDegradationScore,
    humanSystemAdaptationLevel,
  });

  const state: HumanSystemResilienceState = Object.freeze({
    activeResilienceSignals: Object.freeze(activeResilienceSignals),
    adaptiveCoordinationRecords,
    resilienceBottlenecks,
    crossDomainResilienceRecords,
    resilienceFragilityZones,
    adaptiveRecoveryZones,
    enterpriseResilienceScore,
    resilienceDegradationScore,
    humanSystemAdaptationLevel,
    resilienceStabilityLabel,
  });

  const semantics = buildExecutiveResilienceSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    resilienceStateId,
    resilienceStabilityLabel,
    enterpriseResilienceScore,
    humanSystemAdaptationLevel,
  });

  const snapshot: HumanSystemResilienceSnapshot = Object.freeze({
    resilienceStateId,
    topologyId: topology.topologyId,
    alignmentStateId: `organizational-alignment::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      adaptationSummaries: Object.freeze([...semantics.adaptationSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      crossDomainSummaries: Object.freeze([...semantics.crossDomainSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: resilienceBuiltAt(tick),
  });

  const panelContract = buildResiliencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeHumanSystemResilienceSnapshot(
  snapshot: HumanSystemResilienceSnapshot
): HumanSystemResilienceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeResilienceSignals: Object.freeze(
        snapshot.state.activeResilienceSignals.map((s) => Object.freeze({ ...s }))
      ),
      adaptiveCoordinationRecords: Object.freeze(
        snapshot.state.adaptiveCoordinationRecords.map((r) => Object.freeze({ ...r }))
      ),
      resilienceBottlenecks: Object.freeze(
        snapshot.state.resilienceBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      crossDomainResilienceRecords: Object.freeze(
        snapshot.state.crossDomainResilienceRecords.map((r) => Object.freeze({ ...r }))
      ),
      resilienceFragilityZones: Object.freeze([...snapshot.state.resilienceFragilityZones]),
      adaptiveRecoveryZones: Object.freeze([...snapshot.state.adaptiveRecoveryZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
