/**
 * D7:8:5 — Strategic intelligence resilience engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicIntelligenceResilienceInput,
  EvaluateStrategicIntelligenceResilienceResult,
  StrategicIntelligenceResilienceSnapshot,
  StrategicIntelligenceResilienceIntelligenceState,
  StrategicIntelligenceResiliencePanelContract,
} from "./strategicIntelligenceResilienceTypes.ts";
import {
  RESILIENCE_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
  buildResilienceContentFingerprint,
  guardEvaluateStrategicIntelligenceResilience,
  guardStrategicIntelligenceResilienceSemantics,
} from "./strategicIntelligenceResilienceGuards.ts";
import {
  deriveStrategicIntelligenceResilienceSignals,
  analyzeLongHorizonResilience,
  calculateStrategicResilienceCapacityScore,
  calculateAdaptiveRecoveryScore,
  identifyAdaptiveRecoveryZones,
  identifyResilienceFailureZones,
  classifyExecutiveResilienceLabel,
} from "./longHorizonResilienceModeling.ts";
import {
  analyzeStrategicRecovery,
  calculateRecoveryPressureScore,
} from "./strategicRecoveryAnalysis.ts";
import { analyzeEnterpriseMetaStrategicResilienceIntelligence } from "./enterpriseMetaStrategicResilienceIntelligence.ts";
import { buildStrategicIntelligenceResilienceSemantics } from "./strategicIntelligenceResilienceSemantics.ts";
import { logStrategicIntelligenceResilienceDev } from "./strategicIntelligenceResilienceDevLog.ts";

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

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicIntelligenceResiliencePanelContract(input: {
  snapshot: StrategicIntelligenceResilienceSnapshot;
}): StrategicIntelligenceResiliencePanelContract {
  const viewHint =
    input.snapshot.state.strategicRecoveryRecords.length > 3
      ? "recovery_capacity_heatmap"
      : input.snapshot.state.longHorizonResilienceRecords.length > 4
        ? "resilience_evolution_timeline"
        : input.snapshot.state.executiveResilienceLabel === "critical"
          ? "enterprise_resilience_panel"
          : input.snapshot.state.executiveResilienceLabel === "strained"
            ? "long_horizon_resilience_dashboard"
            : input.snapshot.state.activeResilienceSignals.length > 3
              ? "strategic_resilience_overlay"
              : "strategic_resilience_overlay";

  return Object.freeze({
    resilienceStateId: input.snapshot.resilienceStateId,
    topologyId: input.snapshot.topologyId,
    strategicResilienceCapacityScore: input.snapshot.state.strategicResilienceCapacityScore,
    executiveResilienceLabel: input.snapshot.state.executiveResilienceLabel,
    resilienceAmbiguityDisclaimer: input.snapshot.state.resilienceAmbiguityDisclaimer,
    nonAutonomousResilienceDisclaimer: input.snapshot.state.nonAutonomousResilienceDisclaimer,
    resilienceSignals: Object.freeze(
      input.snapshot.state.activeResilienceSignals.map((s) =>
        Object.freeze({
          resilienceId: s.resilienceId,
          resilienceState: s.resilienceState,
          resilienceStrength: s.resilienceStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonResilienceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic intelligence resilience (read-only; never fabricates resilience capacity).
 */
export function evaluateStrategicIntelligenceResilience(
  input: EvaluateStrategicIntelligenceResilienceInput
): EvaluateStrategicIntelligenceResilienceResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.resilienceContext?.tick) || 0);
  const resilienceStateId = String(
    input.resilienceStateId ??
      `strategic-intelligence-resilience::${topology.topologyId}::${tick}`
  ).trim();

  const resilienceLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.resilienceContext?.resilienceLeverageFactor ?? 0)
  );
  const recoveryStressFactor = clamp01Stress(input.resilienceContext?.recoveryStressFactor ?? 0);

  logStrategicIntelligenceResilienceDev("StrategicResilience", {
    resilienceStateId,
    topologyId: topology.topologyId,
    tick,
    driftLabel: input.strategicDriftState.executiveDriftLabel,
    metaCausalityLabel: input.metaCausalityState.executiveMetaCausalityLabel,
    patternLabel: input.strategicPatternState.executivePatternLabel,
  });

  const activeResilienceSignals = deriveStrategicIntelligenceResilienceSignals({
    strategicDriftState: input.strategicDriftState,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    resilienceLeverageFactor,
    recoveryStressFactor,
  });

  const longHorizonResilienceRecords = analyzeLongHorizonResilience({
    resilienceSignals: activeResilienceSignals,
    strategicDriftState: input.strategicDriftState,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
  });

  const strategicResilienceCapacityScore = calculateStrategicResilienceCapacityScore({
    resilienceSignals: activeResilienceSignals,
    longHorizonResilienceRecords,
    strategicDriftState: input.strategicDriftState,
    operationalUniverseState: operational,
  });

  const adaptiveRecoveryScore = calculateAdaptiveRecoveryScore({
    resilienceSignals: activeResilienceSignals,
    longHorizonResilienceRecords,
    operationalUniverseState: operational,
  });

  const strategicRecoveryRecords = analyzeStrategicRecovery({
    resilienceSignals: activeResilienceSignals,
    longHorizonResilienceRecords,
    strategicDriftState: input.strategicDriftState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const recoveryPressureScore = calculateRecoveryPressureScore({
    resilienceSignals: activeResilienceSignals,
    strategicRecoveryRecords,
    strategicDriftState: input.strategicDriftState,
  });

  const enterpriseMetaStrategicResilienceRecords =
    analyzeEnterpriseMetaStrategicResilienceIntelligence({
      resilienceSignals: activeResilienceSignals,
      longHorizonResilienceRecords,
      strategicRecoveryRecords,
      strategicDriftState: input.strategicDriftState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
    });

  const driftFingerprint = stableStringify({
    label: input.strategicDriftState.executiveDriftLabel,
    coherence: input.strategicDriftState.strategicIntelligenceCoherenceScore,
    instability: input.strategicDriftState.strategicDriftInstabilityScore,
    drift: input.strategicDriftState.longHorizonDriftScore,
  });
  const metaCausalityFingerprint = stableStringify({
    label: input.metaCausalityState.executiveMetaCausalityLabel,
    coherence: input.metaCausalityState.metaCausalityCoherenceScore,
    instability: input.metaCausalityState.metaCausalityInstabilityScore,
  });
  const patternFingerprint = stableStringify({
    label: input.strategicPatternState.executivePatternLabel,
    coherence: input.strategicPatternState.patternCoherenceScore,
    instability: input.strategicPatternState.patternInstabilityScore,
  });
  const metaFingerprint = stableStringify({
    label: input.metaStrategicState.executiveMetaLabel,
    coherence: input.metaStrategicState.strategicMetaCoherenceScore,
    instability: input.metaStrategicState.metaInstabilityScore,
  });
  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
    instability: input.strategicRealityState.realityInstabilityScore,
  });
  const foresightFingerprint = stableStringify({
    label: predictive.foresightState.predictiveForesightLabel,
    preparedness: predictive.foresightState.strategicPreparednessScore,
  });
  const trajectoryFingerprint = stableStringify({
    stability: predictive.trajectoryState.futureStabilityScore,
    volatility: predictive.trajectoryState.trajectoryVolatilityScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: predictive.divergenceState.futureFragmentationScore,
  });

  const pendingFingerprint = buildResilienceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    driftFingerprint,
    metaCausalityFingerprint,
    patternFingerprint,
    metaFingerprint,
    realityFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicIntelligenceResilience({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    resilienceSignals: activeResilienceSignals,
    priorResilienceFingerprints: input.priorResilienceFingerprints,
    pendingFingerprint,
    strategicResilienceCapacityScore,
    recoveryPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveResilienceLabel = classifyExecutiveResilienceLabel({
    strategicResilienceCapacityScore,
    adaptiveRecoveryScore,
    recoveryPressureScore,
    resilienceSignals: activeResilienceSignals,
  });

  const state: StrategicIntelligenceResilienceIntelligenceState = Object.freeze({
    activeResilienceSignals: Object.freeze(activeResilienceSignals),
    longHorizonResilienceRecords,
    strategicRecoveryRecords,
    enterpriseMetaStrategicResilienceRecords,
    adaptiveRecoveryZones: identifyAdaptiveRecoveryZones(activeResilienceSignals),
    resilienceFailureZones: identifyResilienceFailureZones(activeResilienceSignals),
    strategicResilienceCapacityScore,
    adaptiveRecoveryScore,
    recoveryPressureScore,
    executiveResilienceLabel,
    resilienceAmbiguityDisclaimer: RESILIENCE_AMBIGUITY_DISCLAIMER,
    nonAutonomousResilienceDisclaimer: NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
  });

  const semantics = buildStrategicIntelligenceResilienceSemantics({ state });
  const semanticsGuard = guardStrategicIntelligenceResilienceSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    resilienceStateId,
    executiveResilienceLabel,
    strategicResilienceCapacityScore,
    recoveryPressureScore,
  });

  const snapshot: StrategicIntelligenceResilienceSnapshot = Object.freeze({
    resilienceStateId,
    topologyId: topology.topologyId,
    driftStateId:
      input.driftStateId ??
      `strategic-intelligence-drift::${topology.topologyId}::${tick}`,
    metaCausalityStateId:
      input.metaCausalityStateId ??
      `strategic-meta-causality::${topology.topologyId}::${tick}`,
    patternStateId:
      input.patternStateId ?? `strategic-pattern::${topology.topologyId}::${tick}`,
    metaStateId: input.metaStateId ?? `meta-strategic::${topology.topologyId}::${tick}`,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      resilienceSummaries: Object.freeze([...semantics.resilienceSummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      recoverySummaries: Object.freeze([...semantics.recoverySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: resilienceBuiltAt(tick),
  });

  const panelContract = buildStrategicIntelligenceResiliencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicIntelligenceResilienceSnapshot(
  snapshot: StrategicIntelligenceResilienceSnapshot
): StrategicIntelligenceResilienceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeResilienceSignals: Object.freeze(
        snapshot.state.activeResilienceSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonResilienceRecords: Object.freeze(
        snapshot.state.longHorizonResilienceRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicRecoveryRecords: Object.freeze(
        snapshot.state.strategicRecoveryRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaStrategicResilienceRecords: Object.freeze(
        snapshot.state.enterpriseMetaStrategicResilienceRecords.map((r) =>
          Object.freeze({ ...r })
        )
      ),
      adaptiveRecoveryZones: Object.freeze([...snapshot.state.adaptiveRecoveryZones]),
      resilienceFailureZones: Object.freeze([...snapshot.state.resilienceFailureZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
