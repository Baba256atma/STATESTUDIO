/**
 * D7:7:5 — Enterprise strategic resilience intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateEnterpriseResilienceInput,
  EvaluateEnterpriseResilienceResult,
  EnterpriseStrategicResilienceSnapshot,
  EnterpriseStrategicResilienceIntelligenceState,
  EnterpriseStrategicResiliencePanelContract,
} from "./enterpriseStrategicResilienceTypes.ts";
import {
  RESILIENCE_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
  buildResilienceContentFingerprint,
  guardEvaluateEnterpriseResilience,
  guardEnterpriseStrategicResilienceSemantics,
} from "./enterpriseStrategicResilienceGuards.ts";
import {
  analyzeAdaptiveRecovery,
  calculateAdaptiveRecoveryScore,
  calculateResilienceCapacityScore,
  classifyExecutiveResilienceLabel,
  deriveEnterpriseStrategicResilienceSignals,
  identifyAdaptiveRecoveryZones,
  identifyResilienceFailureZones,
} from "./adaptiveRecoveryModeling.ts";
import {
  analyzeResilienceCapacity,
  calculateRecoveryPressureScore,
} from "./resilienceCapacityAnalysis.ts";
import { analyzeEnterpriseResilienceContinuity } from "./enterpriseResilienceContinuityIntelligence.ts";
import { buildEnterpriseStrategicResilienceSemantics } from "./enterpriseStrategicResilienceSemantics.ts";
import { logEnterpriseStrategicResilienceDev } from "./enterpriseStrategicResilienceDevLog.ts";

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

export function buildEnterpriseStrategicResiliencePanelContract(input: {
  snapshot: EnterpriseStrategicResilienceSnapshot;
}): EnterpriseStrategicResiliencePanelContract {
  const viewHint =
    input.snapshot.state.resilienceCapacityRecords.length > 3
      ? "resilience_capacity_heatmap"
      : input.snapshot.state.enterpriseResilienceContinuityRecords.length > 4
        ? "continuity_timeline"
        : input.snapshot.state.executiveResilienceLabel === "critical"
          ? "strategic_recovery_panel"
          : input.snapshot.state.executiveResilienceLabel === "stable"
            ? "adaptive_recovery_dashboard"
            : input.snapshot.state.activeResilienceSignals.length > 3
              ? "resilience_overlay"
              : "resilience_overlay";

  return Object.freeze({
    resilienceStateId: input.snapshot.resilienceStateId,
    topologyId: input.snapshot.topologyId,
    resilienceCapacityScore: input.snapshot.state.resilienceCapacityScore,
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
    recoverySummaries: Object.freeze(
      input.snapshot.state.adaptiveRecoveryRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise strategic resilience (read-only; never fabricates resilience conditions).
 */
export function evaluateEnterpriseResilience(
  input: EvaluateEnterpriseResilienceInput
): EvaluateEnterpriseResilienceResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.resilienceContext?.tick) || 0);
  const resilienceStateId = String(
    input.resilienceStateId ?? `strategic-resilience::${topology.topologyId}::${tick}`
  ).trim();

  const resilienceLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.resilienceContext?.resilienceLeverageFactor ?? 0)
  );
  const recoveryPressureFactor = clamp01Stress(
    input.resilienceContext?.recoveryPressureFactor ?? 0
  );

  logEnterpriseStrategicResilienceDev("Resilience", {
    resilienceStateId,
    topologyId: topology.topologyId,
    tick,
    driftLabel: input.driftState.executiveDriftLabel,
    causalityLabel: input.causalityState.executiveCausalityLabel,
    syncLabel: input.synchronizationState.executiveSynchronizationLabel,
  });

  const activeResilienceSignals = deriveEnterpriseStrategicResilienceSignals({
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
    resilienceLeverageFactor,
    recoveryPressureFactor,
  });

  const adaptiveRecoveryRecords = analyzeAdaptiveRecovery({
    resilienceSignals: activeResilienceSignals,
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

  const resilienceCapacityScore = calculateResilienceCapacityScore({
    resilienceSignals: activeResilienceSignals,
    adaptiveRecoveryRecords,
    operationalUniverseState: operational,
    synchronizationState: input.synchronizationState,
    driftState: input.driftState,
  });

  const adaptiveRecoveryScore = calculateAdaptiveRecoveryScore({ adaptiveRecoveryRecords });

  const resilienceCapacityRecords = analyzeResilienceCapacity({
    resilienceSignals: activeResilienceSignals,
    adaptiveRecoveryRecords,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
  });

  const recoveryPressureScore = calculateRecoveryPressureScore({
    resilienceSignals: activeResilienceSignals,
    capacityRecords: resilienceCapacityRecords,
    driftState: input.driftState,
    causalityState: input.causalityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
  });

  const enterpriseResilienceContinuityRecords = analyzeEnterpriseResilienceContinuity({
    resilienceSignals: activeResilienceSignals,
    adaptiveRecoveryRecords,
    capacityRecords: resilienceCapacityRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
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
  const resilienceFingerprint = stableStringify({
    score: operational.resilienceState.enterpriseResilienceScore,
    adaptation: operational.resilienceState.humanSystemAdaptationLevel,
    degradation: operational.resilienceState.resilienceDegradationScore,
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

  const pendingFingerprint = buildResilienceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    driftFingerprint,
    causalityFingerprint,
    syncFingerprint,
    realityFingerprint,
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

  const guard = guardEvaluateEnterpriseResilience({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    resilienceSignals: activeResilienceSignals,
    priorResilienceFingerprints: input.priorResilienceFingerprints,
    pendingFingerprint,
    resilienceCapacityScore,
    recoveryPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveResilienceLabel = classifyExecutiveResilienceLabel({
    resilienceCapacityScore,
    adaptiveRecoveryScore,
    recoveryPressureScore,
    resilienceSignals: activeResilienceSignals,
  });

  const state: EnterpriseStrategicResilienceIntelligenceState = Object.freeze({
    activeResilienceSignals: Object.freeze(activeResilienceSignals),
    adaptiveRecoveryRecords,
    resilienceCapacityRecords,
    enterpriseResilienceContinuityRecords,
    adaptiveRecoveryZones: identifyAdaptiveRecoveryZones(activeResilienceSignals),
    resilienceFailureZones: identifyResilienceFailureZones(activeResilienceSignals),
    resilienceCapacityScore,
    adaptiveRecoveryScore,
    recoveryPressureScore,
    executiveResilienceLabel,
    resilienceAmbiguityDisclaimer: RESILIENCE_AMBIGUITY_DISCLAIMER,
    nonAutonomousResilienceDisclaimer: NON_AUTONOMOUS_RESILIENCE_DISCLAIMER,
  });

  const semantics = buildEnterpriseStrategicResilienceSemantics({ state });
  const semanticsGuard = guardEnterpriseStrategicResilienceSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    resilienceStateId,
    executiveResilienceLabel,
    resilienceCapacityScore,
    recoveryPressureScore,
  });

  const snapshot: EnterpriseStrategicResilienceSnapshot = Object.freeze({
    resilienceStateId,
    topologyId: topology.topologyId,
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
      resilienceSummaries: Object.freeze([...semantics.resilienceSummaries]),
      recoverySummaries: Object.freeze([...semantics.recoverySummaries]),
      capacitySummaries: Object.freeze([...semantics.capacitySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: resilienceBuiltAt(tick),
  });

  const panelContract = buildEnterpriseStrategicResiliencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseStrategicResilienceSnapshot(
  snapshot: EnterpriseStrategicResilienceSnapshot
): EnterpriseStrategicResilienceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeResilienceSignals: Object.freeze(
        snapshot.state.activeResilienceSignals.map((s) => Object.freeze({ ...s }))
      ),
      adaptiveRecoveryRecords: Object.freeze(
        snapshot.state.adaptiveRecoveryRecords.map((r) => Object.freeze({ ...r }))
      ),
      resilienceCapacityRecords: Object.freeze(
        snapshot.state.resilienceCapacityRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseResilienceContinuityRecords: Object.freeze(
        snapshot.state.enterpriseResilienceContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      adaptiveRecoveryZones: Object.freeze([...snapshot.state.adaptiveRecoveryZones]),
      resilienceFailureZones: Object.freeze([...snapshot.state.resilienceFailureZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
