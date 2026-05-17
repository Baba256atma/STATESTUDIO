/**
 * D7:8:4 — Strategic intelligence drift engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicIntelligenceDriftInput,
  EvaluateStrategicIntelligenceDriftResult,
  StrategicIntelligenceDriftSnapshot,
  StrategicIntelligenceDriftIntelligenceState,
  StrategicIntelligenceDriftPanelContract,
} from "./strategicIntelligenceDriftTypes.ts";
import {
  DRIFT_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_DRIFT_DISCLAIMER,
  buildDriftContentFingerprint,
  guardEvaluateStrategicIntelligenceDrift,
  guardStrategicIntelligenceDriftSemantics,
} from "./strategicIntelligenceDriftGuards.ts";
import {
  deriveStrategicIntelligenceDriftSignals,
  analyzeLongHorizonIntelligenceDrift,
  calculateLongHorizonDriftScore,
  identifyEmergingDriftZones,
  identifyDegradedStrategicZones,
  classifyExecutiveDriftLabel,
} from "./longHorizonIntelligenceDriftModeling.ts";
import {
  analyzeStrategicCoherenceDegradation,
  calculateStrategicIntelligenceCoherenceScore,
  calculateStrategicDriftInstabilityScore,
} from "./strategicCoherenceDegradationAnalysis.ts";
import { analyzeEnterpriseStrategicDriftIntelligence } from "./enterpriseStrategicDriftIntelligence.ts";
import { buildStrategicIntelligenceDriftSemantics } from "./strategicIntelligenceDriftSemantics.ts";
import { logStrategicIntelligenceDriftDev } from "./strategicIntelligenceDriftDevLog.ts";

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

export function buildStrategicIntelligenceDriftPanelContract(input: {
  snapshot: StrategicIntelligenceDriftSnapshot;
}): StrategicIntelligenceDriftPanelContract {
  const viewHint =
    input.snapshot.state.strategicCoherenceDegradationRecords.length > 3
      ? "long_horizon_drift_heatmap"
      : input.snapshot.state.longHorizonIntelligenceDriftRecords.length > 4
        ? "strategic_degradation_timeline"
        : input.snapshot.state.executiveDriftLabel === "critical"
          ? "meta_strategic_drift_panel"
          : input.snapshot.state.executiveDriftLabel === "destabilizing"
            ? "intelligence_coherence_dashboard"
            : input.snapshot.state.activeDriftSignals.length > 3
              ? "strategic_drift_overlay"
              : "strategic_drift_overlay";

  return Object.freeze({
    driftStateId: input.snapshot.driftStateId,
    topologyId: input.snapshot.topologyId,
    strategicIntelligenceCoherenceScore: input.snapshot.state.strategicIntelligenceCoherenceScore,
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
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonIntelligenceDriftRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic intelligence drift (read-only; never fabricates drift conditions).
 */
export function evaluateStrategicIntelligenceDrift(
  input: EvaluateStrategicIntelligenceDriftInput
): EvaluateStrategicIntelligenceDriftResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.driftContext?.tick) || 0);
  const driftStateId = String(
    input.driftStateId ?? `strategic-intelligence-drift::${topology.topologyId}::${tick}`
  ).trim();

  const driftLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.driftContext?.driftLeverageFactor ?? 0)
  );
  const coherenceStressFactor = clamp01Stress(input.driftContext?.coherenceStressFactor ?? 0);

  logStrategicIntelligenceDriftDev("StrategicDrift", {
    driftStateId,
    topologyId: topology.topologyId,
    tick,
    metaCausalityLabel: input.metaCausalityState.executiveMetaCausalityLabel,
    patternLabel: input.strategicPatternState.executivePatternLabel,
    metaLabel: input.metaStrategicState.executiveMetaLabel,
  });

  const activeDriftSignals = deriveStrategicIntelligenceDriftSignals({
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    driftLeverageFactor,
    coherenceStressFactor,
  });

  const longHorizonIntelligenceDriftRecords = analyzeLongHorizonIntelligenceDrift({
    driftSignals: activeDriftSignals,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
  });

  const longHorizonDriftScore = calculateLongHorizonDriftScore({
    driftSignals: activeDriftSignals,
    longHorizonIntelligenceDriftRecords,
    metaCausalityState: input.metaCausalityState,
  });

  const strategicCoherenceDegradationRecords = analyzeStrategicCoherenceDegradation({
    driftSignals: activeDriftSignals,
    longHorizonIntelligenceDriftRecords,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const strategicIntelligenceCoherenceScore = calculateStrategicIntelligenceCoherenceScore({
    driftSignals: activeDriftSignals,
    strategicCoherenceDegradationRecords,
    metaCausalityState: input.metaCausalityState,
    metaStrategicState: input.metaStrategicState,
    strategicPatternState: input.strategicPatternState,
    strategicRealityState: input.strategicRealityState,
  });

  const strategicDriftInstabilityScore = calculateStrategicDriftInstabilityScore({
    driftSignals: activeDriftSignals,
    strategicCoherenceDegradationRecords,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
  });

  const enterpriseStrategicDriftRecords = analyzeEnterpriseStrategicDriftIntelligence({
    driftSignals: activeDriftSignals,
    longHorizonIntelligenceDriftRecords,
    strategicCoherenceDegradationRecords,
    metaCausalityState: input.metaCausalityState,
    strategicPatternState: input.strategicPatternState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    trajectoryState: predictive.trajectoryState,
    divergenceState: predictive.divergenceState,
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

  const pendingFingerprint = buildDriftContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    metaCausalityFingerprint,
    patternFingerprint,
    metaFingerprint,
    realityFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicIntelligenceDrift({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    driftSignals: activeDriftSignals,
    priorDriftFingerprints: input.priorDriftFingerprints,
    pendingFingerprint,
    strategicIntelligenceCoherenceScore,
    strategicDriftInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveDriftLabel = classifyExecutiveDriftLabel({
    strategicIntelligenceCoherenceScore,
    longHorizonDriftScore,
    strategicDriftInstabilityScore,
    driftSignals: activeDriftSignals,
  });

  const state: StrategicIntelligenceDriftIntelligenceState = Object.freeze({
    activeDriftSignals: Object.freeze(activeDriftSignals),
    longHorizonIntelligenceDriftRecords,
    strategicCoherenceDegradationRecords,
    enterpriseStrategicDriftRecords,
    emergingDriftZones: identifyEmergingDriftZones(activeDriftSignals),
    degradedStrategicZones: identifyDegradedStrategicZones(activeDriftSignals),
    strategicIntelligenceCoherenceScore,
    longHorizonDriftScore,
    strategicDriftInstabilityScore,
    executiveDriftLabel,
    driftAmbiguityDisclaimer: DRIFT_AMBIGUITY_DISCLAIMER,
    nonAutonomousDriftDisclaimer: NON_AUTONOMOUS_DRIFT_DISCLAIMER,
  });

  const semantics = buildStrategicIntelligenceDriftSemantics({ state });
  const semanticsGuard = guardStrategicIntelligenceDriftSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    driftStateId,
    executiveDriftLabel,
    strategicIntelligenceCoherenceScore,
    strategicDriftInstabilityScore,
  });

  const snapshot: StrategicIntelligenceDriftSnapshot = Object.freeze({
    driftStateId,
    topologyId: topology.topologyId,
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
      driftSummaries: Object.freeze([...semantics.driftSummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      degradationSummaries: Object.freeze([...semantics.degradationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: driftBuiltAt(tick),
  });

  const panelContract = buildStrategicIntelligenceDriftPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicIntelligenceDriftSnapshot(
  snapshot: StrategicIntelligenceDriftSnapshot
): StrategicIntelligenceDriftSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeDriftSignals: Object.freeze(
        snapshot.state.activeDriftSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonIntelligenceDriftRecords: Object.freeze(
        snapshot.state.longHorizonIntelligenceDriftRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicCoherenceDegradationRecords: Object.freeze(
        snapshot.state.strategicCoherenceDegradationRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseStrategicDriftRecords: Object.freeze(
        snapshot.state.enterpriseStrategicDriftRecords.map((r) => Object.freeze({ ...r }))
      ),
      emergingDriftZones: Object.freeze([...snapshot.state.emergingDriftZones]),
      degradedStrategicZones: Object.freeze([...snapshot.state.degradedStrategicZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
