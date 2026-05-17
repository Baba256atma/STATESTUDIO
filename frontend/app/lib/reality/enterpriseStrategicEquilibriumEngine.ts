/**
 * D7:7:7 — Enterprise strategic equilibrium intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicEquilibriumInput,
  EvaluateStrategicEquilibriumResult,
  EnterpriseStrategicEquilibriumSnapshot,
  EnterpriseStrategicEquilibriumIntelligenceState,
  EnterpriseStrategicEquilibriumPanelContract,
} from "./enterpriseStrategicEquilibriumTypes.ts";
import {
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
  buildEquilibriumContentFingerprint,
  guardEvaluateStrategicEquilibrium,
  guardEnterpriseStrategicEquilibriumSemantics,
} from "./enterpriseStrategicEquilibriumGuards.ts";
import {
  analyzeDynamicBalance,
  calculateSystemicBalanceScore,
  calculateDynamicBalanceScore,
  classifyExecutiveEquilibriumLabel,
  deriveEnterpriseStrategicEquilibriumSignals,
  identifyStabilizedEquilibriumZones,
  identifyDestabilizedEquilibriumZones,
} from "./dynamicBalanceModeling.ts";
import {
  analyzeEquilibriumInstability,
  calculateDestabilizationPressureScore,
} from "./equilibriumInstabilityAnalysis.ts";
import { analyzeEnterpriseStability } from "./enterpriseStabilityIntelligence.ts";
import { buildEnterpriseStrategicEquilibriumSemantics } from "./enterpriseStrategicEquilibriumSemantics.ts";
import { logEnterpriseStrategicEquilibriumDev } from "./enterpriseStrategicEquilibriumDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function equilibriumBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildEnterpriseStrategicEquilibriumPanelContract(input: {
  snapshot: EnterpriseStrategicEquilibriumSnapshot;
}): EnterpriseStrategicEquilibriumPanelContract {
  const viewHint =
    input.snapshot.state.equilibriumInstabilityRecords.length > 3
      ? "stability_heatmap"
      : input.snapshot.state.enterpriseStabilityRecords.length > 4
        ? "equilibrium_timeline"
        : input.snapshot.state.executiveEquilibriumLabel === "critical"
          ? "operational_balance_panel"
          : input.snapshot.state.executiveEquilibriumLabel === "balanced"
            ? "systemic_balance_dashboard"
            : input.snapshot.state.activeEquilibriumSignals.length > 3
              ? "equilibrium_overlay"
              : "equilibrium_overlay";

  return Object.freeze({
    equilibriumStateId: input.snapshot.equilibriumStateId,
    topologyId: input.snapshot.topologyId,
    systemicBalanceScore: input.snapshot.state.systemicBalanceScore,
    executiveEquilibriumLabel: input.snapshot.state.executiveEquilibriumLabel,
    equilibriumAmbiguityDisclaimer: input.snapshot.state.equilibriumAmbiguityDisclaimer,
    nonAutonomousEquilibriumDisclaimer: input.snapshot.state.nonAutonomousEquilibriumDisclaimer,
    equilibriumSignals: Object.freeze(
      input.snapshot.state.activeEquilibriumSignals.map((s) =>
        Object.freeze({
          equilibriumId: s.equilibriumId,
          equilibriumState: s.equilibriumState,
          equilibriumStrength: s.equilibriumStrength,
        })
      )
    ),
    balanceSummaries: Object.freeze(
      input.snapshot.state.dynamicBalanceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise strategic equilibrium (read-only; never fabricates equilibrium conditions).
 */
export function evaluateStrategicEquilibrium(
  input: EvaluateStrategicEquilibriumInput
): EvaluateStrategicEquilibriumResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.equilibriumContext?.tick) || 0);
  const equilibriumStateId = String(
    input.equilibriumStateId ?? `strategic-equilibrium::${topology.topologyId}::${tick}`
  ).trim();

  const equilibriumLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.equilibriumContext?.equilibriumLeverageFactor ?? 0)
  );
  const balancePressureFactor = clamp01Stress(
    input.equilibriumContext?.balancePressureFactor ?? 0
  );

  logEnterpriseStrategicEquilibriumDev("Equilibrium", {
    equilibriumStateId,
    topologyId: topology.topologyId,
    tick,
    evolutionLabel: input.evolutionState.executiveEvolutionLabel,
    resilienceLabel: input.resilienceState.executiveResilienceLabel,
    driftLabel: input.driftState.executiveDriftLabel,
  });

  const activeEquilibriumSignals = deriveEnterpriseStrategicEquilibriumSignals({
    evolutionState: input.evolutionState,
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
    equilibriumLeverageFactor,
    balancePressureFactor,
  });

  const dynamicBalanceRecords = analyzeDynamicBalance({
    equilibriumSignals: activeEquilibriumSignals,
    evolutionState: input.evolutionState,
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

  const systemicBalanceScore = calculateSystemicBalanceScore({
    equilibriumSignals: activeEquilibriumSignals,
    dynamicBalanceRecords,
    operationalUniverseState: operational,
    synchronizationState: input.synchronizationState,
    evolutionState: input.evolutionState,
  });

  const dynamicBalanceScore = calculateDynamicBalanceScore({ dynamicBalanceRecords });

  const equilibriumInstabilityRecords = analyzeEquilibriumInstability({
    equilibriumSignals: activeEquilibriumSignals,
    dynamicBalanceRecords,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
  });

  const destabilizationPressureScore = calculateDestabilizationPressureScore({
    equilibriumSignals: activeEquilibriumSignals,
    instabilityRecords: equilibriumInstabilityRecords,
    evolutionState: input.evolutionState,
    resilienceState: input.resilienceState,
    driftState: input.driftState,
    causalityState: input.causalityState,
    orchestrationState: input.orchestrationState,
  });

  const enterpriseStabilityRecords = analyzeEnterpriseStability({
    equilibriumSignals: activeEquilibriumSignals,
    dynamicBalanceRecords,
    instabilityRecords: equilibriumInstabilityRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const evolutionFingerprint = stableStringify({
    label: input.evolutionState.executiveEvolutionLabel,
    coherence: input.evolutionState.transformationCoherenceScore,
    instability: input.evolutionState.transitionInstabilityScore,
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
  const operationalEquilibriumFingerprint = stableStringify({
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

  const pendingFingerprint = buildEquilibriumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    evolutionFingerprint,
    resilienceFingerprint,
    driftFingerprint,
    causalityFingerprint,
    syncFingerprint,
    realityFingerprint,
    orchestrationFingerprint,
    momentumFingerprint,
    equilibriumFingerprint: operationalEquilibriumFingerprint,
    governanceFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicEquilibrium({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    equilibriumSignals: activeEquilibriumSignals,
    priorEquilibriumFingerprints: input.priorEquilibriumFingerprints,
    pendingFingerprint,
    systemicBalanceScore,
    destabilizationPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveEquilibriumLabel = classifyExecutiveEquilibriumLabel({
    systemicBalanceScore,
    dynamicBalanceScore,
    destabilizationPressureScore,
    equilibriumSignals: activeEquilibriumSignals,
  });

  const state: EnterpriseStrategicEquilibriumIntelligenceState = Object.freeze({
    activeEquilibriumSignals: Object.freeze(activeEquilibriumSignals),
    dynamicBalanceRecords,
    equilibriumInstabilityRecords,
    enterpriseStabilityRecords,
    stabilizedEquilibriumZones: identifyStabilizedEquilibriumZones(activeEquilibriumSignals),
    destabilizedEquilibriumZones: identifyDestabilizedEquilibriumZones(activeEquilibriumSignals),
    systemicBalanceScore,
    dynamicBalanceScore,
    destabilizationPressureScore,
    executiveEquilibriumLabel,
    equilibriumAmbiguityDisclaimer: EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
    nonAutonomousEquilibriumDisclaimer: NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
  });

  const semantics = buildEnterpriseStrategicEquilibriumSemantics({ state });
  const semanticsGuard = guardEnterpriseStrategicEquilibriumSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    equilibriumStateId,
    executiveEquilibriumLabel,
    systemicBalanceScore,
    destabilizationPressureScore,
  });

  const snapshot: EnterpriseStrategicEquilibriumSnapshot = Object.freeze({
    equilibriumStateId,
    topologyId: topology.topologyId,
    evolutionStateId:
      input.evolutionStateId ?? `strategic-reality-evolution::${topology.topologyId}::${tick}`,
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
      equilibriumSummaries: Object.freeze([...semantics.equilibriumSummaries]),
      balanceSummaries: Object.freeze([...semantics.balanceSummaries]),
      instabilitySummaries: Object.freeze([...semantics.instabilitySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: equilibriumBuiltAt(tick),
  });

  const panelContract = buildEnterpriseStrategicEquilibriumPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseStrategicEquilibriumSnapshot(
  snapshot: EnterpriseStrategicEquilibriumSnapshot
): EnterpriseStrategicEquilibriumSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEquilibriumSignals: Object.freeze(
        snapshot.state.activeEquilibriumSignals.map((s) => Object.freeze({ ...s }))
      ),
      dynamicBalanceRecords: Object.freeze(
        snapshot.state.dynamicBalanceRecords.map((r) => Object.freeze({ ...r }))
      ),
      equilibriumInstabilityRecords: Object.freeze(
        snapshot.state.equilibriumInstabilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseStabilityRecords: Object.freeze(
        snapshot.state.enterpriseStabilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      stabilizedEquilibriumZones: Object.freeze([...snapshot.state.stabilizedEquilibriumZones]),
      destabilizedEquilibriumZones: Object.freeze([...snapshot.state.destabilizedEquilibriumZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
