/**
 * D7:7:1 — Nexora strategic reality engine foundation (immutable, operationally grounded).
 */

import type {
  EvaluateStrategicRealityInput,
  EvaluateStrategicRealityResult,
  StrategicRealitySnapshot,
  StrategicRealityIntelligenceState,
  StrategicRealityPanelContract,
} from "./strategicRealityTypes.ts";
import {
  REALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_REALITY_DISCLAIMER,
  buildRealityContentFingerprint,
  guardEvaluateStrategicReality,
  guardStrategicRealitySemantics,
} from "./strategicRealityGuards.ts";
import {
  analyzeUnifiedOperationalStates,
  calculateOperationalRealityCoherenceScore,
  calculateUnifiedOperationalStateScore,
  classifyExecutiveRealityLabel,
  deriveStrategicRealitySignals,
  identifyEvolvingRealityZones,
  identifyUnstableRealityZones,
} from "./unifiedOperationalStateModel.ts";
import {
  analyzeRealityEvolution,
  calculateRealityInstabilityScore,
} from "./realityEvolutionAnalysis.ts";
import { analyzeEnterpriseWorldOrchestration } from "./enterpriseWorldOrchestrationIntelligence.ts";
import { buildStrategicRealitySemantics } from "./strategicRealitySemantics.ts";
import { logStrategicRealityDev } from "./strategicRealityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function realityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicRealityPanelContract(input: {
  snapshot: StrategicRealitySnapshot;
}): StrategicRealityPanelContract {
  const viewHint =
    input.snapshot.state.realityEvolutionRecords.length > 3
      ? "enterprise_state_timeline"
      : input.snapshot.state.unifiedOperationalStateRecords.length > 4
        ? "reality_evolution_heatmap"
        : input.snapshot.state.executiveRealityLabel === "critical"
          ? "strategic_world_panel"
          : input.snapshot.state.executiveRealityLabel === "adaptive"
            ? "operational_world_dashboard"
            : input.snapshot.state.activeRealitySignals.length > 3
              ? "strategic_reality_overlay"
              : "strategic_reality_overlay";

  return Object.freeze({
    realityStateId: input.snapshot.realityStateId,
    topologyId: input.snapshot.topologyId,
    operationalRealityCoherenceScore: input.snapshot.state.operationalRealityCoherenceScore,
    executiveRealityLabel: input.snapshot.state.executiveRealityLabel,
    realityAmbiguityDisclaimer: input.snapshot.state.realityAmbiguityDisclaimer,
    nonAutonomousRealityDisclaimer: input.snapshot.state.nonAutonomousRealityDisclaimer,
    realitySignals: Object.freeze(
      input.snapshot.state.activeRealitySignals.map((s) =>
        Object.freeze({
          realityId: s.realityId,
          realityState: s.realityState,
          realityStrength: s.realityStrength,
        })
      )
    ),
    operationalStateSummaries: Object.freeze(
      input.snapshot.state.unifiedOperationalStateRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic operational reality (read-only; never creates autonomous enterprise authority).
 */
export function evaluateStrategicReality(
  input: EvaluateStrategicRealityInput
): EvaluateStrategicRealityResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.realityContext?.tick) || 0);
  const realityStateId = String(
    input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`
  ).trim();

  const realityLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.realityContext?.realityLeverageFactor ?? 0)
  );
  const evolutionStressFactor = clamp01Stress(input.realityContext?.evolutionStressFactor ?? 0);

  logStrategicRealityDev("StrategicReality", {
    realityStateId,
    topologyId: topology.topologyId,
    tick,
    completionLabel: input.cognitiveCompletionState.executiveCompletionLabel,
    orchestrationLabel: input.orchestrationState.executiveOrchestrationLabel,
  });

  const activeRealitySignals = deriveStrategicRealitySignals({
    cognitiveCompletionState: input.cognitiveCompletionState,
    orchestrationState: input.orchestrationState,
    operationalUniverseState: operational,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    realityLeverageFactor,
    evolutionStressFactor,
  });

  const unifiedOperationalStateRecords = analyzeUnifiedOperationalStates({
    realitySignals: activeRealitySignals,
    cognitiveCompletionState: input.cognitiveCompletionState,
    orchestrationState: input.orchestrationState,
    operationalUniverseState: operational,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const operationalRealityCoherenceScore = calculateOperationalRealityCoherenceScore({
    realitySignals: activeRealitySignals,
    cognitiveCompletionState: input.cognitiveCompletionState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
  });

  const unifiedOperationalStateScore = calculateUnifiedOperationalStateScore({
    stateRecords: unifiedOperationalStateRecords,
  });

  const realityEvolutionRecords = analyzeRealityEvolution({
    realitySignals: activeRealitySignals,
    cognitiveCompletionState: input.cognitiveCompletionState,
    orchestrationState: input.orchestrationState,
    operationalUniverseState: operational,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const realityInstabilityScore = calculateRealityInstabilityScore({
    realitySignals: activeRealitySignals,
    evolutionRecords: realityEvolutionRecords,
    operationalUniverseState: operational,
    divergenceState: input.divergenceState,
    orchestrationState: input.orchestrationState,
  });

  const enterpriseWorldOrchestrationRecords = analyzeEnterpriseWorldOrchestration({
    realitySignals: activeRealitySignals,
    stateRecords: unifiedOperationalStateRecords,
    evolutionRecords: realityEvolutionRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const completionFingerprint = stableStringify({
    label: input.cognitiveCompletionState.executiveCompletionLabel,
    coherence: input.cognitiveCompletionState.overallCognitiveCoherenceScore,
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
  const resilienceFingerprint = stableStringify({
    score: operational.resilienceState.enterpriseResilienceScore,
  });
  const governanceFingerprint = stableStringify({
    label: operational.governanceState.executiveGovernanceLabel,
    stability: operational.governanceState.governanceStabilityScore,
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

  const pendingFingerprint = buildRealityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateStrategicReality({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    realitySignals: activeRealitySignals,
    priorRealityFingerprints: input.priorRealityFingerprints,
    pendingFingerprint,
    operationalRealityCoherenceScore,
    realityInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveRealityLabel = classifyExecutiveRealityLabel({
    operationalRealityCoherenceScore,
    unifiedOperationalStateScore,
    realityInstabilityScore,
    realitySignals: activeRealitySignals,
  });

  const state: StrategicRealityIntelligenceState = Object.freeze({
    activeRealitySignals: Object.freeze(activeRealitySignals),
    unifiedOperationalStateRecords,
    realityEvolutionRecords,
    enterpriseWorldOrchestrationRecords,
    evolvingRealityZones: identifyEvolvingRealityZones(activeRealitySignals),
    unstableRealityZones: identifyUnstableRealityZones(activeRealitySignals),
    operationalRealityCoherenceScore,
    unifiedOperationalStateScore,
    realityInstabilityScore,
    executiveRealityLabel,
    realityAmbiguityDisclaimer: REALITY_AMBIGUITY_DISCLAIMER,
    nonAutonomousRealityDisclaimer: NON_AUTONOMOUS_REALITY_DISCLAIMER,
  });

  const semantics = buildStrategicRealitySemantics({ state });
  const semanticsGuard = guardStrategicRealitySemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    realityStateId,
    executiveRealityLabel,
    operationalRealityCoherenceScore,
    unifiedOperationalStateScore,
  });

  const snapshot: StrategicRealitySnapshot = Object.freeze({
    realityStateId,
    topologyId: topology.topologyId,
    completionStateId: `executive-cognitive-completion::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      realitySummaries: Object.freeze([...semantics.realitySummaries]),
      operationalStateSummaries: Object.freeze([...semantics.operationalStateSummaries]),
      evolutionSummaries: Object.freeze([...semantics.evolutionSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: realityBuiltAt(tick),
  });

  const panelContract = buildStrategicRealityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicRealitySnapshot(
  snapshot: StrategicRealitySnapshot
): StrategicRealitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeRealitySignals: Object.freeze(
        snapshot.state.activeRealitySignals.map((s) => Object.freeze({ ...s }))
      ),
      unifiedOperationalStateRecords: Object.freeze(
        snapshot.state.unifiedOperationalStateRecords.map((r) => Object.freeze({ ...r }))
      ),
      realityEvolutionRecords: Object.freeze(
        snapshot.state.realityEvolutionRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseWorldOrchestrationRecords: Object.freeze(
        snapshot.state.enterpriseWorldOrchestrationRecords.map((r) => Object.freeze({ ...r }))
      ),
      evolvingRealityZones: Object.freeze([...snapshot.state.evolvingRealityZones]),
      unstableRealityZones: Object.freeze([...snapshot.state.unstableRealityZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
