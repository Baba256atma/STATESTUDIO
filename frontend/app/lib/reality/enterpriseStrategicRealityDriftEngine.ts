/**
 * D7:7:4 — Enterprise strategic reality drift intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicRealityDriftInput,
  EvaluateStrategicRealityDriftResult,
  EnterpriseStrategicRealityDriftSnapshot,
  EnterpriseStrategicRealityDriftIntelligenceState,
  EnterpriseStrategicRealityDriftPanelContract,
} from "./enterpriseStrategicRealityDriftTypes.ts";
import {
  DRIFT_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_DRIFT_DISCLAIMER,
  buildDriftContentFingerprint,
  guardEvaluateStrategicRealityDrift,
  guardEnterpriseStrategicRealityDriftSemantics,
} from "./enterpriseStrategicRealityDriftGuards.ts";
import {
  analyzeDriftEvolution,
  calculateDriftEvolutionScore,
  calculateStrategicCoherenceScore,
  classifyExecutiveDriftLabel,
  deriveEnterpriseStrategicRealityDriftSignals,
  identifyDestabilizedRealityZones,
  identifyEmergingDriftZones,
} from "./driftEvolutionModeling.ts";
import {
  analyzeStrategicCoherenceDegradation,
  calculateCoherenceDegradationScore,
} from "./strategicCoherenceDegradationAnalysis.ts";
import { analyzeEnterpriseStrategicDrift } from "./enterpriseStrategicDriftIntelligence.ts";
import { buildEnterpriseStrategicRealityDriftSemantics } from "./enterpriseStrategicRealityDriftSemantics.ts";
import { logEnterpriseStrategicRealityDriftDev } from "./enterpriseStrategicRealityDriftDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function driftBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildEnterpriseStrategicRealityDriftPanelContract(input: {
  snapshot: EnterpriseStrategicRealityDriftSnapshot;
}): EnterpriseStrategicRealityDriftPanelContract {
  const viewHint =
    input.snapshot.state.strategicCoherenceDegradationRecords.length > 3
      ? "degradation_timeline"
      : input.snapshot.state.enterpriseDriftDomainRecords.length > 4
        ? "long_horizon_drift_heatmap"
        : input.snapshot.state.executiveDriftLabel === "critical"
          ? "strategic_stability_panel"
          : input.snapshot.state.executiveDriftLabel === "stable"
            ? "enterprise_coherence_dashboard"
            : input.snapshot.state.activeDriftSignals.length > 3
              ? "strategic_drift_overlay"
              : "strategic_drift_overlay";

  return Object.freeze({
    driftStateId: input.snapshot.driftStateId,
    topologyId: input.snapshot.topologyId,
    strategicCoherenceScore: input.snapshot.state.strategicCoherenceScore,
    executiveDriftLabel: input.snapshot.state.executiveDriftLabel,
    driftAmbiguityDisclaimer: input.snapshot.state.driftAmbiguityDisclaimer,
    nonAutonomousDriftDisclaimer: input.snapshot.state.nonAutonomousDriftDisclaimer,
    driftSignals: Object.freeze(
      input.snapshot.state.activeDriftSignals.map((s) =>
        Object.freeze({
          driftId: s.driftId,
          driftState: s.driftState,
          driftStrength: s.driftStrength,
        })
      )
    ),
    evolutionSummaries: Object.freeze(
      input.snapshot.state.driftEvolutionRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise strategic reality drift (read-only; never fabricates unsupported drift analysis).
 */
export function evaluateStrategicRealityDrift(
  input: EvaluateStrategicRealityDriftInput
): EvaluateStrategicRealityDriftResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.driftContext?.tick) || 0);
  const driftStateId = String(
    input.driftStateId ?? `strategic-reality-drift::${topology.topologyId}::${tick}`
  ).trim();

  const driftLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.driftContext?.driftLeverageFactor ?? 0)
  );
  const degradationStressFactor = clamp01Stress(
    input.driftContext?.degradationStressFactor ?? 0
  );

  logEnterpriseStrategicRealityDriftDev("RealityDrift", {
    driftStateId,
    topologyId: topology.topologyId,
    tick,
    causalityLabel: input.causalityState.executiveCausalityLabel,
    syncLabel: input.synchronizationState.executiveSynchronizationLabel,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
  });

  const activeDriftSignals = deriveEnterpriseStrategicRealityDriftSignals({
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
    driftLeverageFactor,
    degradationStressFactor,
  });

  const driftEvolutionRecords = analyzeDriftEvolution({
    driftSignals: activeDriftSignals,
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

  const strategicCoherenceScore = calculateStrategicCoherenceScore({
    driftSignals: activeDriftSignals,
    driftEvolutionRecords,
    strategicRealityState: input.strategicRealityState,
    synchronizationState: input.synchronizationState,
    causalityState: input.causalityState,
  });

  const driftEvolutionScore = calculateDriftEvolutionScore({ driftEvolutionRecords });

  const strategicCoherenceDegradationRecords = analyzeStrategicCoherenceDegradation({
    driftSignals: activeDriftSignals,
    driftEvolutionRecords,
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

  const coherenceDegradationScore = calculateCoherenceDegradationScore({
    driftSignals: activeDriftSignals,
    degradationRecords: strategicCoherenceDegradationRecords,
    driftEvolutionRecords,
    strategicRealityState: input.strategicRealityState,
    synchronizationState: input.synchronizationState,
  });

  const enterpriseDriftDomainRecords = analyzeEnterpriseStrategicDrift({
    driftSignals: activeDriftSignals,
    driftEvolutionRecords,
    degradationRecords: strategicCoherenceDegradationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildDriftContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateStrategicRealityDrift({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    driftSignals: activeDriftSignals,
    priorDriftFingerprints: input.priorDriftFingerprints,
    pendingFingerprint,
    strategicCoherenceScore,
    coherenceDegradationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveDriftLabel = classifyExecutiveDriftLabel({
    strategicCoherenceScore,
    driftEvolutionScore,
    coherenceDegradationScore,
    driftSignals: activeDriftSignals,
  });

  const state: EnterpriseStrategicRealityDriftIntelligenceState = Object.freeze({
    activeDriftSignals: Object.freeze(activeDriftSignals),
    driftEvolutionRecords,
    strategicCoherenceDegradationRecords,
    enterpriseDriftDomainRecords,
    emergingDriftZones: identifyEmergingDriftZones(activeDriftSignals),
    destabilizedRealityZones: identifyDestabilizedRealityZones(activeDriftSignals),
    strategicCoherenceScore,
    driftEvolutionScore,
    coherenceDegradationScore,
    executiveDriftLabel,
    driftAmbiguityDisclaimer: DRIFT_AMBIGUITY_DISCLAIMER,
    nonAutonomousDriftDisclaimer: NON_AUTONOMOUS_DRIFT_DISCLAIMER,
  });

  const semantics = buildEnterpriseStrategicRealityDriftSemantics({ state });
  const semanticsGuard = guardEnterpriseStrategicRealityDriftSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    driftStateId,
    executiveDriftLabel,
    strategicCoherenceScore,
    coherenceDegradationScore,
  });

  const snapshot: EnterpriseStrategicRealityDriftSnapshot = Object.freeze({
    driftStateId,
    topologyId: topology.topologyId,
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
      driftSummaries: Object.freeze([...semantics.driftSummaries]),
      evolutionSummaries: Object.freeze([...semantics.evolutionSummaries]),
      degradationSummaries: Object.freeze([...semantics.degradationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: driftBuiltAt(tick),
  });

  const panelContract = buildEnterpriseStrategicRealityDriftPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseStrategicRealityDriftSnapshot(
  snapshot: EnterpriseStrategicRealityDriftSnapshot
): EnterpriseStrategicRealityDriftSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeDriftSignals: Object.freeze(
        snapshot.state.activeDriftSignals.map((s) => Object.freeze({ ...s }))
      ),
      driftEvolutionRecords: Object.freeze(
        snapshot.state.driftEvolutionRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicCoherenceDegradationRecords: Object.freeze(
        snapshot.state.strategicCoherenceDegradationRecords.map((r) =>
          Object.freeze({ ...r })
        )
      ),
      enterpriseDriftDomainRecords: Object.freeze(
        snapshot.state.enterpriseDriftDomainRecords.map((r) => Object.freeze({ ...r }))
      ),
      emergingDriftZones: Object.freeze([...snapshot.state.emergingDriftZones]),
      destabilizedRealityZones: Object.freeze([...snapshot.state.destabilizedRealityZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
