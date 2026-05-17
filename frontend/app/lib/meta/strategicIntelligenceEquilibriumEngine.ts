/**
 * D7:8:7 — Strategic intelligence equilibrium engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicIntelligenceEquilibriumInput,
  EvaluateStrategicIntelligenceEquilibriumResult,
  StrategicIntelligenceEquilibriumSnapshot,
  StrategicIntelligenceEquilibriumIntelligenceState,
  StrategicIntelligenceEquilibriumPanelContract,
} from "./strategicIntelligenceEquilibriumTypes.ts";
import {
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
  buildEquilibriumContentFingerprint,
  guardEvaluateStrategicIntelligenceEquilibrium,
  guardStrategicIntelligenceEquilibriumSemantics,
} from "./strategicIntelligenceEquilibriumGuards.ts";
import {
  deriveStrategicIntelligenceEquilibriumSignals,
  analyzeLongHorizonEquilibrium,
  calculateStrategicEquilibriumCoherenceScore,
  calculateSystemicBalanceScore,
  identifyBalancedEquilibriumZones,
  identifyDestabilizingEquilibriumZones,
  classifyExecutiveEquilibriumLabel,
} from "./longHorizonEquilibriumModeling.ts";
import {
  analyzeStrategicBalance,
  calculateEquilibriumPressureScore,
} from "./strategicBalanceAnalysis.ts";
import { analyzeEnterpriseMetaStrategicEquilibriumIntelligence } from "./enterpriseMetaStrategicEquilibriumIntelligence.ts";
import { buildStrategicIntelligenceEquilibriumSemantics } from "./strategicIntelligenceEquilibriumSemantics.ts";
import { logStrategicIntelligenceEquilibriumDev } from "./strategicIntelligenceEquilibriumDevLog.ts";

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

export function buildStrategicIntelligenceEquilibriumPanelContract(input: {
  snapshot: StrategicIntelligenceEquilibriumSnapshot;
}): StrategicIntelligenceEquilibriumPanelContract {
  const viewHint =
    input.snapshot.state.strategicBalanceRecords.length > 3
      ? "long_horizon_equilibrium_heatmap"
      : input.snapshot.state.longHorizonEquilibriumRecords.length > 4
        ? "systemic_balance_timeline"
        : input.snapshot.state.executiveEquilibriumLabel === "critical"
          ? "enterprise_equilibrium_panel"
          : input.snapshot.state.executiveEquilibriumLabel === "destabilizing"
            ? "balance_dashboard"
            : "strategic_equilibrium_overlay";

  return Object.freeze({
    equilibriumStateId: input.snapshot.equilibriumStateId,
    topologyId: input.snapshot.topologyId,
    strategicEquilibriumCoherenceScore: input.snapshot.state.strategicEquilibriumCoherenceScore,
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
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonEquilibriumRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

export function evaluateStrategicIntelligenceEquilibrium(
  input: EvaluateStrategicIntelligenceEquilibriumInput
): EvaluateStrategicIntelligenceEquilibriumResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.equilibriumContext?.tick) || 0);
  const equilibriumStateId = String(
    input.equilibriumStateId ??
      `strategic-intelligence-equilibrium::${topology.topologyId}::${tick}`
  ).trim();

  const equilibriumLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.equilibriumContext?.equilibriumLeverageFactor ?? 0)
  );
  const balanceStressFactor = clamp01Stress(input.equilibriumContext?.balanceStressFactor ?? 0);

  logStrategicIntelligenceEquilibriumDev("StrategicEquilibrium", {
    equilibriumStateId,
    topologyId: topology.topologyId,
    tick,
    evolutionLabel: input.strategicEvolutionState.executiveEvolutionLabel,
    resilienceLabel: input.strategicResilienceState.executiveResilienceLabel,
  });

  const activeEquilibriumSignals = deriveStrategicIntelligenceEquilibriumSignals({
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
    equilibriumLeverageFactor,
    balanceStressFactor,
  });

  const longHorizonEquilibriumRecords = analyzeLongHorizonEquilibrium({
    equilibriumSignals: activeEquilibriumSignals,
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

  const strategicEquilibriumCoherenceScore = calculateStrategicEquilibriumCoherenceScore({
    equilibriumSignals: activeEquilibriumSignals,
    longHorizonEquilibriumRecords,
    strategicEvolutionState: input.strategicEvolutionState,
    operationalUniverseState: operational,
  });

  const systemicBalanceScore = calculateSystemicBalanceScore({
    equilibriumSignals: activeEquilibriumSignals,
    longHorizonEquilibriumRecords,
    operationalUniverseState: operational,
  });

  const strategicBalanceRecords = analyzeStrategicBalance({
    equilibriumSignals: activeEquilibriumSignals,
    longHorizonEquilibriumRecords,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
    strategicDriftState: input.strategicDriftState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const equilibriumPressureScore = calculateEquilibriumPressureScore({
    equilibriumSignals: activeEquilibriumSignals,
    strategicBalanceRecords,
    strategicEvolutionState: input.strategicEvolutionState,
    strategicResilienceState: input.strategicResilienceState,
  });

  const enterpriseMetaStrategicEquilibriumRecords =
    analyzeEnterpriseMetaStrategicEquilibriumIntelligence({
      equilibriumSignals: activeEquilibriumSignals,
      longHorizonEquilibriumRecords,
      strategicBalanceRecords,
      strategicDriftState: input.strategicDriftState,
      metaStrategicState: input.metaStrategicState,
      strategicRealityState: input.strategicRealityState,
      operationalUniverseState: operational,
      foresightState: predictive.foresightState,
      trajectoryState: predictive.trajectoryState,
      divergenceState: predictive.divergenceState,
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

  const pendingFingerprint = buildEquilibriumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateStrategicIntelligenceEquilibrium({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    equilibriumSignals: activeEquilibriumSignals,
    priorEquilibriumFingerprints: input.priorEquilibriumFingerprints,
    pendingFingerprint,
    strategicEquilibriumCoherenceScore,
    equilibriumPressureScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveEquilibriumLabel = classifyExecutiveEquilibriumLabel({
    strategicEquilibriumCoherenceScore,
    systemicBalanceScore,
    equilibriumPressureScore,
    equilibriumSignals: activeEquilibriumSignals,
  });

  const state: StrategicIntelligenceEquilibriumIntelligenceState = Object.freeze({
    activeEquilibriumSignals: Object.freeze(activeEquilibriumSignals),
    longHorizonEquilibriumRecords,
    strategicBalanceRecords,
    enterpriseMetaStrategicEquilibriumRecords,
    balancedEquilibriumZones: identifyBalancedEquilibriumZones(activeEquilibriumSignals),
    destabilizingEquilibriumZones: identifyDestabilizingEquilibriumZones(activeEquilibriumSignals),
    strategicEquilibriumCoherenceScore,
    systemicBalanceScore,
    equilibriumPressureScore,
    executiveEquilibriumLabel,
    equilibriumAmbiguityDisclaimer: EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
    nonAutonomousEquilibriumDisclaimer: NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
  });

  const semantics = buildStrategicIntelligenceEquilibriumSemantics({ state });
  const semanticsGuard = guardStrategicIntelligenceEquilibriumSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    equilibriumStateId,
    executiveEquilibriumLabel,
    strategicEquilibriumCoherenceScore,
    equilibriumPressureScore,
  });

  const snapshot: StrategicIntelligenceEquilibriumSnapshot = Object.freeze({
    equilibriumStateId,
    topologyId: topology.topologyId,
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
    builtAt: equilibriumBuiltAt(tick),
  });

  return {
    ok: true,
    snapshot,
    panelContract: buildStrategicIntelligenceEquilibriumPanelContract({ snapshot }),
  };
}

export function freezeStrategicIntelligenceEquilibriumSnapshot(
  snapshot: StrategicIntelligenceEquilibriumSnapshot
): StrategicIntelligenceEquilibriumSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEquilibriumSignals: Object.freeze(
        snapshot.state.activeEquilibriumSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonEquilibriumRecords: Object.freeze(
        snapshot.state.longHorizonEquilibriumRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicBalanceRecords: Object.freeze(
        snapshot.state.strategicBalanceRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaStrategicEquilibriumRecords: Object.freeze(
        snapshot.state.enterpriseMetaStrategicEquilibriumRecords.map((r) => Object.freeze({ ...r }))
      ),
      balancedEquilibriumZones: Object.freeze([...snapshot.state.balancedEquilibriumZones]),
      destabilizingEquilibriumZones: Object.freeze([
        ...snapshot.state.destabilizingEquilibriumZones,
      ]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
