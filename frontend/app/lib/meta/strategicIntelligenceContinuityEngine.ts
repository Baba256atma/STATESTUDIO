/**
 * D7:8:8 — Strategic intelligence continuity engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicIntelligenceContinuityInput,
  EvaluateStrategicIntelligenceContinuityResult,
  StrategicIntelligenceContinuitySnapshot,
  StrategicIntelligenceContinuityIntelligenceState,
  StrategicIntelligenceContinuityPanelContract,
} from "./strategicIntelligenceContinuityTypes.ts";
import {
  CONTINUITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CONTINUITY_DISCLAIMER,
  buildContinuityContentFingerprint,
  guardEvaluateStrategicIntelligenceContinuity,
  guardStrategicIntelligenceContinuitySemantics,
} from "./strategicIntelligenceContinuityGuards.ts";
import {
  deriveStrategicIntelligenceContinuitySignals,
  analyzeLongHorizonContinuity,
  calculateLongHorizonStrategicContinuityScore,
  calculateAdaptiveContinuityScore,
  identifyPreservedContinuityZones,
  identifyContinuityFailureZones,
  classifyExecutiveContinuityLabel,
} from "./longHorizonContinuityModeling.ts";
import {
  analyzeContinuityFragmentation,
  calculateFragmentationPressureScore,
} from "./continuityFragmentationAnalysis.ts";
import { analyzeEnterpriseMetaStrategicContinuityIntelligence } from "./enterpriseMetaStrategicContinuityIntelligence.ts";
import { buildStrategicIntelligenceContinuitySemantics } from "./strategicIntelligenceContinuitySemantics.ts";
import { logStrategicIntelligenceContinuityDev } from "./strategicIntelligenceContinuityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function continuityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicIntelligenceContinuityPanelContract(input: {
  snapshot: StrategicIntelligenceContinuitySnapshot;
}): StrategicIntelligenceContinuityPanelContract {
  const viewHint =
    input.snapshot.state.continuityFragmentationRecords.length > 3
      ? "continuity_heatmap"
      : input.snapshot.state.longHorizonContinuityRecords.length > 4
        ? "strategic_persistence_timeline"
        : input.snapshot.state.executiveContinuityLabel === "critical"
          ? "enterprise_continuity_panel"
          : input.snapshot.state.executiveContinuityLabel === "fragmenting"
            ? "long_horizon_continuity_dashboard"
            : "strategic_continuity_overlay";

  return Object.freeze({
    continuityStateId: input.snapshot.continuityStateId,
    topologyId: input.snapshot.topologyId,
    longHorizonStrategicContinuityScore: input.snapshot.state.longHorizonStrategicContinuityScore,
    executiveContinuityLabel: input.snapshot.state.executiveContinuityLabel,
    continuityAmbiguityDisclaimer: input.snapshot.state.continuityAmbiguityDisclaimer,
    nonAutonomousContinuityDisclaimer: input.snapshot.state.nonAutonomousContinuityDisclaimer,
    continuitySignals: Object.freeze(
      input.snapshot.state.activeContinuitySignals.map((s) =>
        Object.freeze({
          continuityId: s.continuityId,
          continuityState: s.continuityState,
          continuityStrength: s.continuityStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonContinuityRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic intelligence continuity (read-only; never fabricates continuity conclusions).
 */
export function evaluateStrategicIntelligenceContinuity(
  input: EvaluateStrategicIntelligenceContinuityInput
): EvaluateStrategicIntelligenceContinuityResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.continuityContext?.tick) || 0);
  const continuityStateId = String(
    input.continuityStateId ??
      `strategic-intelligence-continuity::${topology.topologyId}::${tick}`
  ).trim();

  const continuityLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.continuityContext?.continuityLeverageFactor ?? 0)
  );
  const disruptionStressFactor = clamp01Stress(
    input.continuityContext?.disruptionStressFactor ?? 0
  );

  logStrategicIntelligenceContinuityDev("StrategicContinuity", {
    continuityStateId,
    topologyId: topology.topologyId,
    tick,
    equilibriumLabel: input.strategicEquilibriumState.executiveEquilibriumLabel,
    evolutionLabel: input.strategicEvolutionState.executiveEvolutionLabel,
    resilienceLabel: input.strategicResilienceState.executiveResilienceLabel,
  });

  const activeContinuitySignals = deriveStrategicIntelligenceContinuitySignals({
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
    continuityLeverageFactor,
    disruptionStressFactor,
  });

  const longHorizonContinuityRecords = analyzeLongHorizonContinuity({
    continuitySignals: activeContinuitySignals,
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

  const longHorizonStrategicContinuityScore = calculateLongHorizonStrategicContinuityScore({
    continuitySignals: activeContinuitySignals,
    longHorizonContinuityRecords,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicResilienceState: input.strategicResilienceState,
  });

  const adaptiveContinuityScore = calculateAdaptiveContinuityScore({
    continuitySignals: activeContinuitySignals,
    longHorizonContinuityRecords,
    strategicResilienceState: input.strategicResilienceState,
  });

  const continuityFragmentationRecords = analyzeContinuityFragmentation({
    continuitySignals: activeContinuitySignals,
    longHorizonContinuityRecords,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const fragmentationPressureScore = calculateFragmentationPressureScore({
    continuitySignals: activeContinuitySignals,
    continuityFragmentationRecords,
    strategicEquilibriumState: input.strategicEquilibriumState,
    strategicResilienceState: input.strategicResilienceState,
  });

  const enterpriseMetaStrategicContinuityRecords =
    analyzeEnterpriseMetaStrategicContinuityIntelligence({
      continuitySignals: activeContinuitySignals,
      longHorizonContinuityRecords,
      continuityFragmentationRecords,
      strategicDriftState: input.strategicDriftState,
      metaStrategicState: input.metaStrategicState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
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

  const pendingFingerprint = buildContinuityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateStrategicIntelligenceContinuity({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    continuitySignals: activeContinuitySignals,
    priorContinuityFingerprints: input.priorContinuityFingerprints,
    pendingFingerprint,
    longHorizonStrategicContinuityScore,
    fragmentationPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveContinuityLabel = classifyExecutiveContinuityLabel({
    longHorizonStrategicContinuityScore,
    adaptiveContinuityScore,
    fragmentationPressureScore,
    continuitySignals: activeContinuitySignals,
  });

  const state: StrategicIntelligenceContinuityIntelligenceState = Object.freeze({
    activeContinuitySignals: Object.freeze(activeContinuitySignals),
    longHorizonContinuityRecords,
    continuityFragmentationRecords,
    enterpriseMetaStrategicContinuityRecords,
    preservedContinuityZones: identifyPreservedContinuityZones(activeContinuitySignals),
    continuityFailureZones: identifyContinuityFailureZones(activeContinuitySignals),
    longHorizonStrategicContinuityScore,
    adaptiveContinuityScore,
    fragmentationPressureScore,
    executiveContinuityLabel,
    continuityAmbiguityDisclaimer: CONTINUITY_AMBIGUITY_DISCLAIMER,
    nonAutonomousContinuityDisclaimer: NON_AUTONOMOUS_CONTINUITY_DISCLAIMER,
  });

  const semantics = buildStrategicIntelligenceContinuitySemantics({ state });
  const semanticsGuard = guardStrategicIntelligenceContinuitySemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    continuityStateId,
    executiveContinuityLabel,
    longHorizonStrategicContinuityScore,
    fragmentationPressureScore,
  });

  const snapshot: StrategicIntelligenceContinuitySnapshot = Object.freeze({
    continuityStateId,
    topologyId: topology.topologyId,
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
    builtAt: continuityBuiltAt(tick),
  });

  return {
    ok: true,
    snapshot,
    panelContract: buildStrategicIntelligenceContinuityPanelContract({ snapshot }),
  };
}

export function freezeStrategicIntelligenceContinuitySnapshot(
  snapshot: StrategicIntelligenceContinuitySnapshot
): StrategicIntelligenceContinuitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeContinuitySignals: Object.freeze(
        snapshot.state.activeContinuitySignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonContinuityRecords: Object.freeze(
        snapshot.state.longHorizonContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      continuityFragmentationRecords: Object.freeze(
        snapshot.state.continuityFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaStrategicContinuityRecords: Object.freeze(
        snapshot.state.enterpriseMetaStrategicContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      preservedContinuityZones: Object.freeze([...snapshot.state.preservedContinuityZones]),
      continuityFailureZones: Object.freeze([...snapshot.state.continuityFailureZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
