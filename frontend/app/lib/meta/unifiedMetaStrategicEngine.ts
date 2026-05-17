/**
 * D7:8:9 — Unified meta-strategic intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateUnifiedMetaStrategicIntelligenceInput,
  EvaluateUnifiedMetaStrategicIntelligenceResult,
  UnifiedMetaStrategicSnapshot,
  UnifiedMetaStrategicIntelligenceState,
  UnifiedMetaStrategicPanelContract,
} from "./unifiedMetaStrategicTypes.ts";
import {
  UNIFIED_META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER,
  buildUnifiedMetaContentFingerprint,
  guardEvaluateUnifiedMetaStrategicIntelligence,
  guardUnifiedMetaStrategicSemantics,
} from "./unifiedMetaStrategicGuards.ts";
import {
  deriveUnifiedMetaStrategicSignals,
  analyzeCrossIntelligenceSynchronization,
  calculateUnifiedStrategicCoherenceScore,
  calculateMetaSynchronizationScore,
  identifySynchronizedMetaZones,
  identifyFragmentedMetaZones,
  classifyExecutiveUnifiedMetaLabel,
} from "./crossIntelligenceSynchronizationModeling.ts";
import {
  analyzeUnifiedMetaCoherence,
  calculateEcosystemFragmentationScore,
} from "./unifiedMetaCoherenceAnalysis.ts";
import { analyzeEnterpriseUnifiedMetaStrategicIntelligence } from "./enterpriseUnifiedMetaStrategicIntelligence.ts";
import { buildUnifiedMetaStrategicSemantics } from "./unifiedMetaStrategicSemantics.ts";
import { logUnifiedMetaStrategicDev } from "./unifiedMetaStrategicDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function unifiedMetaBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildUnifiedMetaStrategicPanelContract(input: {
  snapshot: UnifiedMetaStrategicSnapshot;
}): UnifiedMetaStrategicPanelContract {
  const viewHint =
    input.snapshot.state.unifiedMetaCoherenceRecords.length > 3
      ? "strategic_coherence_heatmap"
      : input.snapshot.state.crossIntelligenceSynchronizationRecords.length > 4
        ? "long_horizon_intelligence_timeline"
        : input.snapshot.state.executiveUnifiedMetaLabel === "critical"
          ? "unified_meta_panel"
          : input.snapshot.state.executiveUnifiedMetaLabel === "fragmented"
            ? "enterprise_cognition_dashboard"
            : "unified_meta_overlay";

  return Object.freeze({
    unifiedMetaStateId: input.snapshot.unifiedMetaStateId,
    topologyId: input.snapshot.topologyId,
    unifiedStrategicCoherenceScore: input.snapshot.state.unifiedStrategicCoherenceScore,
    executiveUnifiedMetaLabel: input.snapshot.state.executiveUnifiedMetaLabel,
    unifiedMetaAmbiguityDisclaimer: input.snapshot.state.unifiedMetaAmbiguityDisclaimer,
    nonAutonomousUnifiedMetaDisclaimer: input.snapshot.state.nonAutonomousUnifiedMetaDisclaimer,
    unifiedMetaSignals: Object.freeze(
      input.snapshot.state.activeUnifiedMetaSignals.map((s) =>
        Object.freeze({
          unifiedMetaId: s.unifiedMetaId,
          unifiedMetaState: s.unifiedMetaState,
          unifiedMetaStrength: s.unifiedMetaStrength,
        })
      )
    ),
    synchronizationSummaries: Object.freeze(
      input.snapshot.state.crossIntelligenceSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate unified meta-strategic intelligence (read-only; never assigns strategic authority).
 */
export function evaluateUnifiedMetaStrategicIntelligence(
  input: EvaluateUnifiedMetaStrategicIntelligenceInput
): EvaluateUnifiedMetaStrategicIntelligenceResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.unifiedMetaContext?.tick) || 0);
  const unifiedMetaStateId = String(
    input.unifiedMetaStateId ??
      `unified-meta-strategic::${topology.topologyId}::${tick}`
  ).trim();

  const unifiedMetaLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.unifiedMetaContext?.unifiedMetaLeverageFactor ?? 0)
  );
  const ecosystemStressFactor = clamp01Stress(
    input.unifiedMetaContext?.ecosystemStressFactor ?? 0
  );

  logUnifiedMetaStrategicDev("UnifiedMeta", {
    unifiedMetaStateId,
    topologyId: topology.topologyId,
    tick,
    continuityLabel: input.strategicContinuityState.executiveContinuityLabel,
    equilibriumLabel: input.strategicEquilibriumState.executiveEquilibriumLabel,
    evolutionLabel: input.strategicEvolutionState.executiveEvolutionLabel,
    resilienceLabel: input.strategicResilienceState.executiveResilienceLabel,
    driftLabel: input.strategicDriftState.executiveDriftLabel,
  });

  const activeUnifiedMetaSignals = deriveUnifiedMetaStrategicSignals({
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
    unifiedMetaLeverageFactor,
    ecosystemStressFactor,
  });

  const crossIntelligenceSynchronizationRecords = analyzeCrossIntelligenceSynchronization({
    unifiedMetaSignals: activeUnifiedMetaSignals,
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

  const unifiedStrategicCoherenceScore = calculateUnifiedStrategicCoherenceScore({
    unifiedMetaSignals: activeUnifiedMetaSignals,
    crossIntelligenceSynchronizationRecords,
    strategicContinuityState: input.strategicContinuityState,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
  });

  const metaSynchronizationScore = calculateMetaSynchronizationScore({
    unifiedMetaSignals: activeUnifiedMetaSignals,
    crossIntelligenceSynchronizationRecords,
    strategicResilienceState: input.strategicResilienceState,
    strategicEquilibriumState: input.strategicEquilibriumState,
  });

  const unifiedMetaCoherenceRecords = analyzeUnifiedMetaCoherence({
    unifiedMetaSignals: activeUnifiedMetaSignals,
    crossIntelligenceSynchronizationRecords,
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

  const ecosystemFragmentationScore = calculateEcosystemFragmentationScore({
    unifiedMetaSignals: activeUnifiedMetaSignals,
    unifiedMetaCoherenceRecords,
    strategicContinuityState: input.strategicContinuityState,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicDriftState: input.strategicDriftState,
  });

  const enterpriseUnifiedMetaStrategicRecords =
    analyzeEnterpriseUnifiedMetaStrategicIntelligence({
      unifiedMetaSignals: activeUnifiedMetaSignals,
      crossIntelligenceSynchronizationRecords,
      unifiedMetaCoherenceRecords,
      strategicDriftState: input.strategicDriftState,
      metaStrategicState: input.metaStrategicState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
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

  const pendingFingerprint = buildUnifiedMetaContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateUnifiedMetaStrategicIntelligence({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    unifiedMetaSignals: activeUnifiedMetaSignals,
    priorUnifiedMetaFingerprints: input.priorUnifiedMetaFingerprints,
    pendingFingerprint,
    unifiedStrategicCoherenceScore,
    ecosystemFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveUnifiedMetaLabel = classifyExecutiveUnifiedMetaLabel({
    unifiedStrategicCoherenceScore,
    metaSynchronizationScore,
    ecosystemFragmentationScore,
    unifiedMetaSignals: activeUnifiedMetaSignals,
  });

  const state: UnifiedMetaStrategicIntelligenceState = Object.freeze({
    activeUnifiedMetaSignals: Object.freeze(activeUnifiedMetaSignals),
    crossIntelligenceSynchronizationRecords,
    unifiedMetaCoherenceRecords,
    enterpriseUnifiedMetaStrategicRecords,
    synchronizedMetaZones: identifySynchronizedMetaZones(activeUnifiedMetaSignals),
    fragmentedMetaZones: identifyFragmentedMetaZones(activeUnifiedMetaSignals),
    unifiedStrategicCoherenceScore,
    metaSynchronizationScore,
    ecosystemFragmentationScore,
    executiveUnifiedMetaLabel,
    unifiedMetaAmbiguityDisclaimer: UNIFIED_META_AMBIGUITY_DISCLAIMER,
    nonAutonomousUnifiedMetaDisclaimer: NON_AUTONOMOUS_UNIFIED_META_DISCLAIMER,
  });

  const semantics = buildUnifiedMetaStrategicSemantics({ state });
  const semanticsGuard = guardUnifiedMetaStrategicSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    unifiedMetaStateId,
    executiveUnifiedMetaLabel,
    unifiedStrategicCoherenceScore,
    ecosystemFragmentationScore,
  });

  const snapshot: UnifiedMetaStrategicSnapshot = Object.freeze({
    unifiedMetaStateId,
    topologyId: topology.topologyId,
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
    builtAt: unifiedMetaBuiltAt(tick),
  });

  return {
    ok: true,
    snapshot,
    panelContract: buildUnifiedMetaStrategicPanelContract({ snapshot }),
  };
}

export function freezeUnifiedMetaStrategicSnapshot(
  snapshot: UnifiedMetaStrategicSnapshot
): UnifiedMetaStrategicSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeUnifiedMetaSignals: Object.freeze(
        snapshot.state.activeUnifiedMetaSignals.map((s) => Object.freeze({ ...s }))
      ),
      crossIntelligenceSynchronizationRecords: Object.freeze(
        snapshot.state.crossIntelligenceSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      unifiedMetaCoherenceRecords: Object.freeze(
        snapshot.state.unifiedMetaCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseUnifiedMetaStrategicRecords: Object.freeze(
        snapshot.state.enterpriseUnifiedMetaStrategicRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedMetaZones: Object.freeze([...snapshot.state.synchronizedMetaZones]),
      fragmentedMetaZones: Object.freeze([...snapshot.state.fragmentedMetaZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
