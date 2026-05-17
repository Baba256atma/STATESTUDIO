/**
 * D7:8:1 — Nexora meta-strategic intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateMetaStrategicIntelligenceInput,
  EvaluateMetaStrategicIntelligenceResult,
  MetaStrategicSnapshot,
  MetaStrategicIntelligenceState,
  MetaStrategicPanelContract,
} from "./metaStrategicTypes.ts";
import {
  META_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_DISCLAIMER,
  buildMetaContentFingerprint,
  guardEvaluateMetaStrategicIntelligence,
  guardMetaStrategicSemantics,
} from "./metaStrategicGuards.ts";
import {
  deriveMetaStrategicSignals,
  analyzeStrategicEvolution,
  calculateStrategicEvolutionScore,
  identifyAdaptiveStrategyZones,
  identifyUnstableMetaZones,
  classifyExecutiveMetaLabel,
} from "./strategicEvolutionModeling.ts";
import {
  analyzeMetaCoherence,
  calculateStrategicMetaCoherenceScore,
  calculateMetaInstabilityScore,
} from "./metaCoherenceAnalysis.ts";
import { analyzeEnterpriseStrategyIntelligence } from "./enterpriseStrategyIntelligence.ts";
import { buildMetaStrategicSemantics } from "./metaStrategicSemantics.ts";
import { logMetaStrategicDev } from "./metaStrategicDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function metaBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildMetaStrategicPanelContract(input: {
  snapshot: MetaStrategicSnapshot;
}): MetaStrategicPanelContract {
  const viewHint =
    input.snapshot.state.metaCoherenceRecords.length > 3
      ? "strategy_coherence_heatmap"
      : input.snapshot.state.strategicEvolutionRecords.length > 4
        ? "long_horizon_strategy_timeline"
        : input.snapshot.state.executiveMetaLabel === "critical"
          ? "enterprise_meta_panel"
          : input.snapshot.state.executiveMetaLabel === "transforming"
            ? "strategic_evolution_dashboard"
            : input.snapshot.state.activeMetaSignals.length > 3
              ? "meta_strategy_overlay"
              : "meta_strategy_overlay";

  return Object.freeze({
    metaStateId: input.snapshot.metaStateId,
    topologyId: input.snapshot.topologyId,
    strategicMetaCoherenceScore: input.snapshot.state.strategicMetaCoherenceScore,
    executiveMetaLabel: input.snapshot.state.executiveMetaLabel,
    metaAmbiguityDisclaimer: input.snapshot.state.metaAmbiguityDisclaimer,
    nonAutonomousMetaDisclaimer: input.snapshot.state.nonAutonomousMetaDisclaimer,
    metaSignals: Object.freeze(
      input.snapshot.state.activeMetaSignals.map((s) =>
        Object.freeze({
          metaId: s.metaId,
          metaState: s.metaState,
          metaStrength: s.metaStrength,
        })
      )
    ),
    evolutionSummaries: Object.freeze(
      input.snapshot.state.strategicEvolutionRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate meta-strategic intelligence (read-only; never creates autonomous strategic authority).
 */
export function evaluateMetaStrategicIntelligence(
  input: EvaluateMetaStrategicIntelligenceInput
): EvaluateMetaStrategicIntelligenceResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.metaContext?.tick) || 0);
  const metaStateId = String(
    input.metaStateId ?? `meta-strategic::${topology.topologyId}::${tick}`
  ).trim();

  const metaLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.metaContext?.metaLeverageFactor ?? 0)
  );
  const evolutionStressFactor = clamp01Stress(
    input.metaContext?.evolutionStressFactor ?? 0
  );

  logMetaStrategicDev("MetaStrategy", {
    metaStateId,
    topologyId: topology.topologyId,
    tick,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
    orchestrationLabel: input.executiveOrchestrationState.executiveOrchestrationLabel,
  });

  const activeMetaSignals = deriveMetaStrategicSignals({
    strategicRealityState: input.strategicRealityState,
    cognitiveCompletionState: input.cognitiveCompletionState,
    executiveOrchestrationState: input.executiveOrchestrationState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
    metaLeverageFactor,
    evolutionStressFactor,
  });

  const strategicEvolutionRecords = analyzeStrategicEvolution({
    metaSignals: activeMetaSignals,
    strategicRealityState: input.strategicRealityState,
    cognitiveCompletionState: input.cognitiveCompletionState,
    executiveOrchestrationState: input.executiveOrchestrationState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
  });

  const strategicEvolutionScore = calculateStrategicEvolutionScore({
    metaSignals: activeMetaSignals,
    strategicEvolutionRecords,
    strategicRealityState: input.strategicRealityState,
  });

  const metaCoherenceRecords = analyzeMetaCoherence({
    metaSignals: activeMetaSignals,
    strategicEvolutionRecords,
    strategicRealityState: input.strategicRealityState,
    cognitiveCompletionState: input.cognitiveCompletionState,
    executiveOrchestrationState: input.executiveOrchestrationState,
    operationalUniverseState: operational,
  });

  const strategicMetaCoherenceScore = calculateStrategicMetaCoherenceScore({
    metaSignals: activeMetaSignals,
    metaCoherenceRecords,
    strategicRealityState: input.strategicRealityState,
    executiveOrchestrationState: input.executiveOrchestrationState,
  });

  const metaInstabilityScore = calculateMetaInstabilityScore({
    metaSignals: activeMetaSignals,
    metaCoherenceRecords,
    strategicRealityState: input.strategicRealityState,
  });

  const enterpriseStrategyRecords = analyzeEnterpriseStrategyIntelligence({
    metaSignals: activeMetaSignals,
    strategicEvolutionRecords,
    metaCoherenceRecords,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    trajectoryState: predictive.trajectoryState,
    divergenceState: predictive.divergenceState,
  });

  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
    instability: input.strategicRealityState.realityInstabilityScore,
  });
  const completionFingerprint = stableStringify({
    label: input.cognitiveCompletionState.executiveCompletionLabel,
    coherence: input.cognitiveCompletionState.overallCognitiveCoherenceScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.executiveOrchestrationState.executiveOrchestrationLabel,
    coherence: input.executiveOrchestrationState.orchestrationCoherenceScore,
  });
  const momentumFingerprint = stableStringify({
    momentum: operational.momentumState.organizationalMomentumScore,
    recovery: operational.momentumState.recoveryMomentumScore,
  });
  const equilibriumFingerprint = stableStringify({
    score: operational.equilibriumState.equilibriumScore,
  });
  const resilienceFingerprint = stableStringify({
    score: operational.resilienceState.enterpriseResilienceScore,
  });
  const governanceFingerprint = stableStringify({
    label: operational.governanceState.executiveGovernanceLabel,
    stability: operational.governanceState.governanceStabilityScore,
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

  const pendingFingerprint = buildMetaContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    realityFingerprint,
    completionFingerprint,
    orchestrationFingerprint,
    momentumFingerprint,
    equilibriumFingerprint,
    resilienceFingerprint,
    governanceFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateMetaStrategicIntelligence({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    metaSignals: activeMetaSignals,
    priorMetaFingerprints: input.priorMetaFingerprints,
    pendingFingerprint,
    strategicMetaCoherenceScore,
    metaInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveMetaLabel = classifyExecutiveMetaLabel({
    strategicMetaCoherenceScore,
    strategicEvolutionScore,
    metaInstabilityScore,
    metaSignals: activeMetaSignals,
  });

  const state: MetaStrategicIntelligenceState = Object.freeze({
    activeMetaSignals: Object.freeze(activeMetaSignals),
    strategicEvolutionRecords,
    metaCoherenceRecords,
    enterpriseStrategyRecords,
    adaptiveStrategyZones: identifyAdaptiveStrategyZones(activeMetaSignals),
    unstableMetaZones: identifyUnstableMetaZones(activeMetaSignals),
    strategicMetaCoherenceScore,
    strategicEvolutionScore,
    metaInstabilityScore,
    executiveMetaLabel,
    metaAmbiguityDisclaimer: META_AMBIGUITY_DISCLAIMER,
    nonAutonomousMetaDisclaimer: NON_AUTONOMOUS_META_DISCLAIMER,
  });

  const semantics = buildMetaStrategicSemantics({ state });
  const semanticsGuard = guardMetaStrategicSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    metaStateId,
    executiveMetaLabel,
    strategicMetaCoherenceScore,
    metaInstabilityScore,
  });

  const snapshot: MetaStrategicSnapshot = Object.freeze({
    metaStateId,
    topologyId: topology.topologyId,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      metaSummaries: Object.freeze([...semantics.metaSummaries]),
      evolutionSummaries: Object.freeze([...semantics.evolutionSummaries]),
      coherenceSummaries: Object.freeze([...semantics.coherenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: metaBuiltAt(tick),
  });

  const panelContract = buildMetaStrategicPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeMetaStrategicSnapshot(
  snapshot: MetaStrategicSnapshot
): MetaStrategicSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeMetaSignals: Object.freeze(
        snapshot.state.activeMetaSignals.map((s) => Object.freeze({ ...s }))
      ),
      strategicEvolutionRecords: Object.freeze(
        snapshot.state.strategicEvolutionRecords.map((r) => Object.freeze({ ...r }))
      ),
      metaCoherenceRecords: Object.freeze(
        snapshot.state.metaCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseStrategyRecords: Object.freeze(
        snapshot.state.enterpriseStrategyRecords.map((r) => Object.freeze({ ...r }))
      ),
      adaptiveStrategyZones: Object.freeze([...snapshot.state.adaptiveStrategyZones]),
      unstableMetaZones: Object.freeze([...snapshot.state.unstableMetaZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
