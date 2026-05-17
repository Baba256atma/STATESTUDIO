/**
 * D7:7:6 — Enterprise strategic reality evolution intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicRealityEvolutionInput,
  EvaluateStrategicRealityEvolutionResult,
  EnterpriseStrategicRealityEvolutionSnapshot,
  EnterpriseStrategicRealityEvolutionIntelligenceState,
  EnterpriseStrategicRealityEvolutionPanelContract,
} from "./enterpriseStrategicRealityEvolutionTypes.ts";
import {
  EVOLUTION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
  buildEvolutionContentFingerprint,
  guardEvaluateStrategicRealityEvolution,
  guardEnterpriseStrategicRealityEvolutionSemantics,
} from "./enterpriseStrategicRealityEvolutionGuards.ts";
import {
  analyzeLongHorizonTransformation,
  calculateTransformationCoherenceScore,
  calculateLongHorizonEvolutionScore,
  classifyExecutiveEvolutionLabel,
  deriveEnterpriseStrategicRealityEvolutionSignals,
  identifyAdaptiveEvolutionZones,
  identifyUnstableTransitionZones,
} from "./longHorizonTransformationModeling.ts";
import {
  analyzeEvolutionaryTransitions,
  calculateTransitionInstabilityScore,
} from "./evolutionaryTransitionAnalysis.ts";
import { analyzeEnterpriseTransformation } from "./enterpriseTransformationIntelligence.ts";
import { buildEnterpriseStrategicRealityEvolutionSemantics } from "./enterpriseStrategicRealityEvolutionSemantics.ts";
import { logEnterpriseStrategicRealityEvolutionDev } from "./enterpriseStrategicRealityEvolutionDevLog.ts";

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

export function buildEnterpriseStrategicRealityEvolutionPanelContract(input: {
  snapshot: EnterpriseStrategicRealityEvolutionSnapshot;
}): EnterpriseStrategicRealityEvolutionPanelContract {
  const viewHint =
    input.snapshot.state.evolutionaryTransitionRecords.length > 3
      ? "long_horizon_transition_heatmap"
      : input.snapshot.state.enterpriseTransformationRecords.length > 4
        ? "operational_evolution_timeline"
        : input.snapshot.state.executiveEvolutionLabel === "critical"
          ? "transformation_coherence_panel"
          : input.snapshot.state.executiveEvolutionLabel === "stable"
            ? "enterprise_transformation_dashboard"
            : input.snapshot.state.activeEvolutionSignals.length > 3
              ? "strategic_evolution_overlay"
              : "strategic_evolution_overlay";

  return Object.freeze({
    evolutionStateId: input.snapshot.evolutionStateId,
    topologyId: input.snapshot.topologyId,
    transformationCoherenceScore: input.snapshot.state.transformationCoherenceScore,
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
    transformationSummaries: Object.freeze(
      input.snapshot.state.longHorizonTransformationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise strategic reality evolution (read-only; never fabricates transformation trajectories).
 */
export function evaluateStrategicRealityEvolution(
  input: EvaluateStrategicRealityEvolutionInput
): EvaluateStrategicRealityEvolutionResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.evolutionContext?.tick) || 0);
  const evolutionStateId = String(
    input.evolutionStateId ?? `strategic-reality-evolution::${topology.topologyId}::${tick}`
  ).trim();

  const evolutionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.evolutionContext?.evolutionLeverageFactor ?? 0)
  );
  const transitionPressureFactor = clamp01Stress(
    input.evolutionContext?.transitionPressureFactor ?? 0
  );

  logEnterpriseStrategicRealityEvolutionDev("RealityEvolution", {
    evolutionStateId,
    topologyId: topology.topologyId,
    tick,
    resilienceLabel: input.resilienceState.executiveResilienceLabel,
    driftLabel: input.driftState.executiveDriftLabel,
    causalityLabel: input.causalityState.executiveCausalityLabel,
  });

  const activeEvolutionSignals = deriveEnterpriseStrategicRealityEvolutionSignals({
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    evolutionLeverageFactor,
    transitionPressureFactor,
  });

  const longHorizonTransformationRecords = analyzeLongHorizonTransformation({
    evolutionSignals: activeEvolutionSignals,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const transformationCoherenceScore = calculateTransformationCoherenceScore({
    evolutionSignals: activeEvolutionSignals,
    longHorizonTransformationRecords,
    resilienceState: input.resilienceState,
    synchronizationState: input.synchronizationState,
    driftState: input.driftState,
  });

  const longHorizonEvolutionScore = calculateLongHorizonEvolutionScore({
    longHorizonTransformationRecords,
  });

  const evolutionaryTransitionRecords = analyzeEvolutionaryTransitions({
    evolutionSignals: activeEvolutionSignals,
    longHorizonTransformationRecords,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
  });

  const transitionInstabilityScore = calculateTransitionInstabilityScore({
    evolutionSignals: activeEvolutionSignals,
    transitionRecords: evolutionaryTransitionRecords,
    driftState: input.driftState,
    causalityState: input.causalityState,
    resilienceState: input.resilienceState,
    orchestrationState: input.orchestrationState,
  });

  const enterpriseTransformationRecords = analyzeEnterpriseTransformation({
    evolutionSignals: activeEvolutionSignals,
    longHorizonTransformationRecords,
    transitionRecords: evolutionaryTransitionRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const resilienceFingerprint = stableStringify({
    label: input.resilienceState.executiveResilienceLabel,
    capacity: input.resilienceState.resilienceCapacityScore,
    recovery: input.resilienceState.adaptiveRecoveryScore,
    pressure: input.resilienceState.recoveryPressureScore,
  });
  const driftFingerprint = stableStringify({
    label: input.driftState.executiveDriftLabel,
    coherence: input.driftState.strategicCoherenceScore,
    degradation: input.driftState.coherenceDegradationScore,
  });
  const causalityFingerprint = stableStringify({
    label: input.causalityState.executiveCausalityLabel,
    clarity: input.causalityState.causalityClarityScore,
    propagation: input.causalityState.causalPropagationScore,
  });
  const syncFingerprint = stableStringify({
    label: input.synchronizationState.executiveSynchronizationLabel,
    coherence: input.synchronizationState.synchronizationCoherenceScore,
    drift: input.synchronizationState.operationalDriftScore,
  });
  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
    instability: input.strategicRealityState.realityInstabilityScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const momentumFingerprint = stableStringify({
    momentum: operational.momentumState.organizationalMomentumScore,
    recovery: operational.momentumState.recoveryMomentumScore,
  });
  const equilibriumFingerprint = stableStringify({
    score: operational.equilibriumState.equilibriumScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const trajectoryFingerprint = stableStringify({
    stability: input.trajectoryState.futureStabilityScore,
    volatility: input.trajectoryState.trajectoryVolatilityScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: input.divergenceState.futureFragmentationScore,
  });

  const pendingFingerprint = buildEvolutionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    resilienceFingerprint,
    driftFingerprint,
    causalityFingerprint,
    syncFingerprint,
    realityFingerprint,
    orchestrationFingerprint,
    momentumFingerprint,
    equilibriumFingerprint,
    governanceFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicRealityEvolution({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    evolutionSignals: activeEvolutionSignals,
    priorEvolutionFingerprints: input.priorEvolutionFingerprints,
    pendingFingerprint,
    transformationCoherenceScore,
    transitionInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveEvolutionLabel = classifyExecutiveEvolutionLabel({
    transformationCoherenceScore,
    longHorizonEvolutionScore,
    transitionInstabilityScore,
    evolutionSignals: activeEvolutionSignals,
  });

  const state: EnterpriseStrategicRealityEvolutionIntelligenceState = Object.freeze({
    activeEvolutionSignals: Object.freeze(activeEvolutionSignals),
    longHorizonTransformationRecords,
    evolutionaryTransitionRecords,
    enterpriseTransformationRecords,
    adaptiveEvolutionZones: identifyAdaptiveEvolutionZones(activeEvolutionSignals),
    unstableTransitionZones: identifyUnstableTransitionZones(activeEvolutionSignals),
    transformationCoherenceScore,
    longHorizonEvolutionScore,
    transitionInstabilityScore,
    executiveEvolutionLabel,
    evolutionAmbiguityDisclaimer: EVOLUTION_AMBIGUITY_DISCLAIMER,
    nonAutonomousEvolutionDisclaimer: NON_AUTONOMOUS_EVOLUTION_DISCLAIMER,
  });

  const semantics = buildEnterpriseStrategicRealityEvolutionSemantics({ state });
  const semanticsGuard = guardEnterpriseStrategicRealityEvolutionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    evolutionStateId,
    executiveEvolutionLabel,
    transformationCoherenceScore,
    transitionInstabilityScore,
  });

  const snapshot: EnterpriseStrategicRealityEvolutionSnapshot = Object.freeze({
    evolutionStateId,
    topologyId: topology.topologyId,
    resilienceStateId:
      input.resilienceStateId ?? `strategic-resilience::${topology.topologyId}::${tick}`,
    driftStateId:
      input.driftStateId ?? `strategic-reality-drift::${topology.topologyId}::${tick}`,
    causalityStateId:
      input.causalityStateId ?? `operational-causality::${topology.topologyId}::${tick}`,
    synchronizationStateId:
      input.synchronizationStateId ??
      `enterprise-reality-sync::${topology.topologyId}::${tick}`,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      evolutionSummaries: Object.freeze([...semantics.evolutionSummaries]),
      transformationSummaries: Object.freeze([...semantics.transformationSummaries]),
      transitionSummaries: Object.freeze([...semantics.transitionSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: evolutionBuiltAt(tick),
  });

  const panelContract = buildEnterpriseStrategicRealityEvolutionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseStrategicRealityEvolutionSnapshot(
  snapshot: EnterpriseStrategicRealityEvolutionSnapshot
): EnterpriseStrategicRealityEvolutionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEvolutionSignals: Object.freeze(
        snapshot.state.activeEvolutionSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonTransformationRecords: Object.freeze(
        snapshot.state.longHorizonTransformationRecords.map((r) => Object.freeze({ ...r }))
      ),
      evolutionaryTransitionRecords: Object.freeze(
        snapshot.state.evolutionaryTransitionRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseTransformationRecords: Object.freeze(
        snapshot.state.enterpriseTransformationRecords.map((r) => Object.freeze({ ...r }))
      ),
      adaptiveEvolutionZones: Object.freeze([...snapshot.state.adaptiveEvolutionZones]),
      unstableTransitionZones: Object.freeze([...snapshot.state.unstableTransitionZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
