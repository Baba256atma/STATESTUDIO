/**
 * D7:8:10 — Meta-strategic intelligence completion engine (immutable, evidence-grounded).
 */

import type {
  EvaluateMetaStrategicCompletionInput,
  EvaluateMetaStrategicCompletionResult,
  MetaStrategicCompletionSnapshot,
  MetaStrategicCompletionIntelligenceState,
  MetaStrategicCompletionPanelContract,
} from "./metaStrategicCompletionTypes.ts";
import {
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  buildCompletionContentFingerprint,
  guardEvaluateMetaStrategicCompletion,
  guardMetaStrategicCompletionSemantics,
} from "./metaStrategicCompletionGuards.ts";
import {
  deriveMetaStrategicCompletionSignals,
  analyzeEnterpriseCognitionSynchronization,
  calculateEnterpriseMetaCoherenceScore,
  calculateCognitionSynchronizationScore,
  identifySynchronizedMetaWorldZones,
  identifyFragmentedMetaWorldZones,
  classifyExecutiveCompletionLabel,
} from "./enterpriseCognitionSynchronizationModeling.ts";
import {
  analyzeStrategicWorldCoherence,
  calculateWorldFragmentationScore,
} from "./strategicWorldCoherenceAnalysis.ts";
import { analyzeEnterpriseMetaStrategicCompletionIntelligence } from "./enterpriseMetaStrategicCompletionIntelligence.ts";
import { buildMetaStrategicCompletionSemantics } from "./metaStrategicCompletionSemantics.ts";
import { logMetaStrategicCompletionDev } from "./metaStrategicCompletionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function completionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildMetaStrategicCompletionPanelContract(input: {
  snapshot: MetaStrategicCompletionSnapshot;
}): MetaStrategicCompletionPanelContract {
  const viewHint =
    input.snapshot.state.strategicWorldCoherenceRecords.length > 3
      ? "strategic_coherence_heatmap"
      : input.snapshot.state.enterpriseCognitionSynchronizationRecords.length > 4
        ? "long_horizon_cognition_timeline"
        : input.snapshot.state.executiveCompletionLabel === "critical"
          ? "enterprise_cognition_panel"
          : input.snapshot.state.executiveCompletionLabel === "fragmented"
            ? "enterprise_meta_dashboard"
            : "unified_cognition_overlay";

  return Object.freeze({
    completionStateId: input.snapshot.completionStateId,
    topologyId: input.snapshot.topologyId,
    enterpriseMetaCoherenceScore: input.snapshot.state.enterpriseMetaCoherenceScore,
    executiveCompletionLabel: input.snapshot.state.executiveCompletionLabel,
    completionAmbiguityDisclaimer: input.snapshot.state.completionAmbiguityDisclaimer,
    nonAutonomousCompletionDisclaimer: input.snapshot.state.nonAutonomousCompletionDisclaimer,
    completionSignals: Object.freeze(
      input.snapshot.state.activeCompletionSignals.map((s) =>
        Object.freeze({
          completionId: s.completionId,
          completionState: s.completionState,
          completionStrength: s.completionStrength,
        })
      )
    ),
    synchronizationSummaries: Object.freeze(
      input.snapshot.state.enterpriseCognitionSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Finalize meta-strategic intelligence (read-only; never assigns strategic governance authority).
 */
export function evaluateMetaStrategicCompletion(
  input: EvaluateMetaStrategicCompletionInput
): EvaluateMetaStrategicCompletionResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.completionContext?.tick) || 0);
  const completionStateId = String(
    input.completionStateId ?? `meta-strategic-completion::${topology.topologyId}::${tick}`
  ).trim();

  const completionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.completionContext?.completionLeverageFactor ?? 0)
  );
  const worldStressFactor = clamp01Stress(input.completionContext?.worldStressFactor ?? 0);

  logMetaStrategicCompletionDev("MetaCompletion", {
    completionStateId,
    topologyId: topology.topologyId,
    tick,
    unifiedLabel: input.unifiedMetaStrategicState.executiveUnifiedMetaLabel,
    continuityLabel: input.strategicContinuityState.executiveContinuityLabel,
    equilibriumLabel: input.strategicEquilibriumState.executiveEquilibriumLabel,
    evolutionLabel: input.strategicEvolutionState.executiveEvolutionLabel,
    resilienceLabel: input.strategicResilienceState.executiveResilienceLabel,
    driftLabel: input.strategicDriftState.executiveDriftLabel,
  });

  const activeCompletionSignals = deriveMetaStrategicCompletionSignals({
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
    strategicContinuityState: input.strategicContinuityState,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    completionLeverageFactor,
    worldStressFactor,
  });

  const enterpriseCognitionSynchronizationRecords = analyzeEnterpriseCognitionSynchronization({
    completionSignals: activeCompletionSignals,
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
    strategicContinuityState: input.strategicContinuityState,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
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

  const enterpriseMetaCoherenceScore = calculateEnterpriseMetaCoherenceScore({
    completionSignals: activeCompletionSignals,
    enterpriseCognitionSynchronizationRecords,
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
    strategicContinuityState: input.strategicContinuityState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
  });

  const cognitionSynchronizationScore = calculateCognitionSynchronizationScore({
    completionSignals: activeCompletionSignals,
    enterpriseCognitionSynchronizationRecords,
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
  });

  const strategicWorldCoherenceRecords = analyzeStrategicWorldCoherence({
    completionSignals: activeCompletionSignals,
    enterpriseCognitionSynchronizationRecords,
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
    strategicContinuityState: input.strategicContinuityState,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const worldFragmentationScore = calculateWorldFragmentationScore({
    completionSignals: activeCompletionSignals,
    strategicWorldCoherenceRecords,
    unifiedMetaStrategicState: input.unifiedMetaStrategicState,
    strategicContinuityState: input.strategicContinuityState,
    strategicDriftState: input.strategicDriftState,
  });

  const enterpriseMetaStrategicCompletionRecords =
    analyzeEnterpriseMetaStrategicCompletionIntelligence({
      completionSignals: activeCompletionSignals,
      enterpriseCognitionSynchronizationRecords,
      strategicWorldCoherenceRecords,
      strategicDriftState: input.strategicDriftState,
      metaStrategicState: input.metaStrategicState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
    });

  const unifiedMetaFingerprint = stableStringify({
    label: input.unifiedMetaStrategicState.executiveUnifiedMetaLabel,
    coherence: input.unifiedMetaStrategicState.unifiedStrategicCoherenceScore,
    fragmentation: input.unifiedMetaStrategicState.ecosystemFragmentationScore,
  });
  const continuityFingerprint = stableStringify({
    label: input.strategicContinuityState.executiveContinuityLabel,
    continuity: input.strategicContinuityState.longHorizonStrategicContinuityScore,
    fragmentation: input.strategicContinuityState.fragmentationPressureScore,
  });
  const equilibriumFingerprint = stableStringify({
    label: input.strategicEquilibriumState.executiveEquilibriumLabel,
    coherence: input.strategicEquilibriumState.strategicEquilibriumCoherenceScore,
    pressure: input.strategicEquilibriumState.equilibriumPressureScore,
  });
  const evolutionFingerprint = stableStringify({
    label: input.strategicEvolutionState.executiveEvolutionLabel,
    coherence: input.strategicEvolutionState.strategicEvolutionCoherenceScore,
    pressure: input.strategicEvolutionState.transformationPressureScore,
  });
  const resilienceFingerprint = stableStringify({
    label: input.strategicResilienceState.executiveResilienceLabel,
    capacity: input.strategicResilienceState.strategicResilienceCapacityScore,
    recovery: input.strategicResilienceState.recoveryPressureScore,
  });
  const driftFingerprint = stableStringify({
    label: input.strategicDriftState.executiveDriftLabel,
    coherence: input.strategicDriftState.strategicIntelligenceCoherenceScore,
    instability: input.strategicDriftState.strategicDriftInstabilityScore,
  });
  const metaCausalityFingerprint = stableStringify({
    label: input.metaCausalityState.executiveMetaCausalityLabel,
    coherence: input.metaCausalityState.metaCausalityCoherenceScore,
  });
  const patternFingerprint = stableStringify({
    label: input.strategicPatternState.executivePatternLabel,
    coherence: input.strategicPatternState.patternCoherenceScore,
  });
  const metaFingerprint = stableStringify({
    label: input.metaStrategicState.executiveMetaLabel,
    coherence: input.metaStrategicState.strategicMetaCoherenceScore,
  });
  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
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

  const pendingFingerprint = buildCompletionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    unifiedMetaFingerprint,
    continuityFingerprint,
    equilibriumFingerprint,
    evolutionFingerprint,
    resilienceFingerprint,
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

  const guard = guardEvaluateMetaStrategicCompletion({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    completionSignals: activeCompletionSignals,
    priorCompletionFingerprints: input.priorCompletionFingerprints,
    pendingFingerprint,
    enterpriseMetaCoherenceScore,
    worldFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveCompletionLabel = classifyExecutiveCompletionLabel({
    enterpriseMetaCoherenceScore,
    cognitionSynchronizationScore,
    worldFragmentationScore,
    completionSignals: activeCompletionSignals,
  });

  const state: MetaStrategicCompletionIntelligenceState = Object.freeze({
    activeCompletionSignals: Object.freeze(activeCompletionSignals),
    enterpriseCognitionSynchronizationRecords,
    strategicWorldCoherenceRecords,
    enterpriseMetaStrategicCompletionRecords,
    synchronizedMetaWorldZones: identifySynchronizedMetaWorldZones(activeCompletionSignals),
    fragmentedMetaWorldZones: identifyFragmentedMetaWorldZones(activeCompletionSignals),
    enterpriseMetaCoherenceScore,
    cognitionSynchronizationScore,
    worldFragmentationScore,
    executiveCompletionLabel,
    completionAmbiguityDisclaimer: COMPLETION_AMBIGUITY_DISCLAIMER,
    nonAutonomousCompletionDisclaimer: NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  });

  const semantics = buildMetaStrategicCompletionSemantics({ state });
  const semanticsGuard = guardMetaStrategicCompletionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    completionStateId,
    executiveCompletionLabel,
    enterpriseMetaCoherenceScore,
    worldFragmentationScore,
  });

  const snapshot: MetaStrategicCompletionSnapshot = Object.freeze({
    completionStateId,
    topologyId: topology.topologyId,
    unifiedMetaStateId:
      input.unifiedMetaStateId ?? `unified-meta-strategic::${topology.topologyId}::${tick}`,
    continuityStateId:
      input.continuityStateId ??
      `strategic-intelligence-continuity::${topology.topologyId}::${tick}`,
    equilibriumStateId:
      input.equilibriumStateId ??
      `strategic-intelligence-equilibrium::${topology.topologyId}::${tick}`,
    evolutionStateId:
      input.evolutionStateId ??
      `strategic-intelligence-evolution::${topology.topologyId}::${tick}`,
    resilienceStateId:
      input.resilienceStateId ??
      `strategic-intelligence-resilience::${topology.topologyId}::${tick}`,
    driftStateId:
      input.driftStateId ?? `strategic-intelligence-drift::${topology.topologyId}::${tick}`,
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
    semantics: Object.freeze({ ...semantics }),
    fingerprint,
    builtAt: completionBuiltAt(tick),
  });

  return {
    ok: true,
    snapshot,
    panelContract: buildMetaStrategicCompletionPanelContract({ snapshot }),
  };
}

export function freezeMetaStrategicCompletionSnapshot(
  snapshot: MetaStrategicCompletionSnapshot
): MetaStrategicCompletionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCompletionSignals: Object.freeze(
        snapshot.state.activeCompletionSignals.map((s) => Object.freeze({ ...s }))
      ),
      enterpriseCognitionSynchronizationRecords: Object.freeze(
        snapshot.state.enterpriseCognitionSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicWorldCoherenceRecords: Object.freeze(
        snapshot.state.strategicWorldCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaStrategicCompletionRecords: Object.freeze(
        snapshot.state.enterpriseMetaStrategicCompletionRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedMetaWorldZones: Object.freeze([...snapshot.state.synchronizedMetaWorldZones]),
      fragmentedMetaWorldZones: Object.freeze([...snapshot.state.fragmentedMetaWorldZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
