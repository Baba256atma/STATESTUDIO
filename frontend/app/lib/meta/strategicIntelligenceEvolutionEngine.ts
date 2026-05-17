/**
 * D7:8:6 — Strategic intelligence evolution engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicIntelligenceEvolutionInput,
  EvaluateStrategicIntelligenceEvolutionResult,
  StrategicIntelligenceEvolutionSnapshot,
  StrategicIntelligenceEvolutionIntelligenceState,
  StrategicIntelligenceEvolutionPanelContract,
} from "./strategicIntelligenceEvolutionTypes.ts";
import {
  EVOLUTION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
  buildEvolutionContentFingerprint,
  guardEvaluateStrategicIntelligenceEvolution,
  guardStrategicIntelligenceEvolutionSemantics,
} from "./strategicIntelligenceEvolutionGuards.ts";
import {
  deriveStrategicIntelligenceEvolutionSignals,
  analyzeLongHorizonEvolution,
  calculateStrategicEvolutionCoherenceScore,
  calculateAdaptiveTransformationScore,
  identifyAdaptiveEvolutionZones,
  identifyUnstableTransformationZones,
  classifyExecutiveEvolutionLabel,
} from "./longHorizonEvolutionModeling.ts";
import {
  analyzeStrategicTransformation,
  calculateTransformationPressureScore,
} from "./strategicTransformationAnalysis.ts";
import { analyzeEnterpriseMetaStrategicEvolutionIntelligence } from "./enterpriseMetaStrategicEvolutionIntelligence.ts";
import { buildStrategicIntelligenceEvolutionSemantics } from "./strategicIntelligenceEvolutionSemantics.ts";
import { logStrategicIntelligenceEvolutionDev } from "./strategicIntelligenceEvolutionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function evolutionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicIntelligenceEvolutionPanelContract(input: {
  snapshot: StrategicIntelligenceEvolutionSnapshot;
}): StrategicIntelligenceEvolutionPanelContract {
  const viewHint =
    input.snapshot.state.strategicTransformationRecords.length > 3
      ? "long_horizon_evolution_heatmap"
      : input.snapshot.state.longHorizonEvolutionRecords.length > 4
        ? "strategic_maturity_timeline"
        : input.snapshot.state.executiveEvolutionLabel === "critical"
          ? "enterprise_evolution_panel"
          : input.snapshot.state.executiveEvolutionLabel === "transforming"
            ? "transformation_dashboard"
            : input.snapshot.state.activeEvolutionSignals.length > 3
              ? "strategic_evolution_overlay"
              : "strategic_evolution_overlay";

  return Object.freeze({
    evolutionStateId: input.snapshot.evolutionStateId,
    topologyId: input.snapshot.topologyId,
    strategicEvolutionCoherenceScore: input.snapshot.state.strategicEvolutionCoherenceScore,
    executiveEvolutionLabel: input.snapshot.state.executiveEvolutionLabel,
    evolutionAmbiguityDisclaimer: input.snapshot.state.evolutionAmbiguityDisclaimer,
    nonAutonomousEvolutionDisclaimer: input.snapshot.state.nonAutonomousEvolutionDisclaimer,
    evolutionSignals: Object.freeze(
      input.snapshot.state.activeEvolutionSignals.map((s) =>
        Object.freeze({
          evolutionId: s.evolutionId,
          evolutionState: s.evolutionState,
          evolutionStrength: s.evolutionStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonEvolutionRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic intelligence evolution (read-only; never fabricates evolution trajectories).
 */
export function evaluateStrategicIntelligenceEvolution(
  input: EvaluateStrategicIntelligenceEvolutionInput
): EvaluateStrategicIntelligenceEvolutionResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.evolutionContext?.tick) || 0);
  const evolutionStateId = String(
    input.evolutionStateId ??
      `strategic-intelligence-evolution::${topology.topologyId}::${tick}`
  ).trim();

  const evolutionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.evolutionContext?.evolutionLeverageFactor ?? 0)
  );
  const transformationStressFactor = clamp01Stress(
    input.evolutionContext?.transformationStressFactor ?? 0
  );

  logStrategicIntelligenceEvolutionDev("StrategicEvolution", {
    evolutionStateId,
    topologyId: topology.topologyId,
    tick,
    resilienceLabel: input.strategicResilienceState.executiveResilienceLabel,
    driftLabel: input.strategicDriftState.executiveDriftLabel,
    metaCausalityLabel: input.metaCausalityState.executiveMetaCausalityLabel,
    patternLabel: input.strategicPatternState.executivePatternLabel,
  });

  const activeEvolutionSignals = deriveStrategicIntelligenceEvolutionSignals({
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
    evolutionLeverageFactor,
    transformationStressFactor,
  });

  const longHorizonEvolutionRecords = analyzeLongHorizonEvolution({
    evolutionSignals: activeEvolutionSignals,
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

  const strategicEvolutionCoherenceScore = calculateStrategicEvolutionCoherenceScore({
    evolutionSignals: activeEvolutionSignals,
    longHorizonEvolutionRecords,
    strategicResilienceState: input.strategicResilienceState,
    metaStrategicState: input.metaStrategicState,
  });

  const adaptiveTransformationScore = calculateAdaptiveTransformationScore({
    evolutionSignals: activeEvolutionSignals,
    longHorizonEvolutionRecords,
    strategicResilienceState: input.strategicResilienceState,
  });

  const strategicTransformationRecords = analyzeStrategicTransformation({
    evolutionSignals: activeEvolutionSignals,
    longHorizonEvolutionRecords,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const transformationPressureScore = calculateTransformationPressureScore({
    evolutionSignals: activeEvolutionSignals,
    strategicTransformationRecords,
    strategicDriftState: input.strategicDriftState,
    strategicResilienceState: input.strategicResilienceState,
  });

  const enterpriseMetaStrategicEvolutionRecords =
    analyzeEnterpriseMetaStrategicEvolutionIntelligence({
      evolutionSignals: activeEvolutionSignals,
      longHorizonEvolutionRecords,
      strategicTransformationRecords,
      strategicResilienceState: input.strategicResilienceState,
      strategicDriftState: input.strategicDriftState,
      metaStrategicState: input.metaStrategicState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
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

  const pendingFingerprint = buildEvolutionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateStrategicIntelligenceEvolution({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    evolutionSignals: activeEvolutionSignals,
    priorEvolutionFingerprints: input.priorEvolutionFingerprints,
    pendingFingerprint,
    strategicEvolutionCoherenceScore,
    transformationPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveEvolutionLabel = classifyExecutiveEvolutionLabel({
    strategicEvolutionCoherenceScore,
    adaptiveTransformationScore,
    transformationPressureScore,
    evolutionSignals: activeEvolutionSignals,
  });

  const state: StrategicIntelligenceEvolutionIntelligenceState = Object.freeze({
    activeEvolutionSignals: Object.freeze(activeEvolutionSignals),
    longHorizonEvolutionRecords,
    strategicTransformationRecords,
    enterpriseMetaStrategicEvolutionRecords,
    adaptiveEvolutionZones: identifyAdaptiveEvolutionZones(activeEvolutionSignals),
    unstableTransformationZones: identifyUnstableTransformationZones(activeEvolutionSignals),
    strategicEvolutionCoherenceScore,
    adaptiveTransformationScore,
    transformationPressureScore,
    executiveEvolutionLabel,
    evolutionAmbiguityDisclaimer: EVOLUTION_AMBIGUITY_DISCLAIMER,
    nonAutonomousEvolutionDisclaimer: NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
  });

  const semantics = buildStrategicIntelligenceEvolutionSemantics({ state });
  const semanticsGuard = guardStrategicIntelligenceEvolutionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    evolutionStateId,
    executiveEvolutionLabel,
    strategicEvolutionCoherenceScore,
    transformationPressureScore,
  });

  const snapshot: StrategicIntelligenceEvolutionSnapshot = Object.freeze({
    evolutionStateId,
    topologyId: topology.topologyId,
    resilienceStateId:
      input.resilienceStateId ??
      `strategic-intelligence-resilience::${topology.topologyId}::${tick}`,
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
      evolutionSummaries: Object.freeze([...semantics.evolutionSummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      transformationSummaries: Object.freeze([...semantics.transformationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: evolutionBuiltAt(tick),
  });

  const panelContract = buildStrategicIntelligenceEvolutionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicIntelligenceEvolutionSnapshot(
  snapshot: StrategicIntelligenceEvolutionSnapshot
): StrategicIntelligenceEvolutionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEvolutionSignals: Object.freeze(
        snapshot.state.activeEvolutionSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonEvolutionRecords: Object.freeze(
        snapshot.state.longHorizonEvolutionRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicTransformationRecords: Object.freeze(
        snapshot.state.strategicTransformationRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaStrategicEvolutionRecords: Object.freeze(
        snapshot.state.enterpriseMetaStrategicEvolutionRecords.map((r) =>
          Object.freeze({ ...r })
        )
      ),
      adaptiveEvolutionZones: Object.freeze([...snapshot.state.adaptiveEvolutionZones]),
      unstableTransformationZones: Object.freeze([...snapshot.state.unstableTransformationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
