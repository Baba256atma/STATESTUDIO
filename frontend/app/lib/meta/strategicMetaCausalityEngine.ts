/**
 * D7:8:3 — Strategic meta-causality intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicMetaCausalityInput,
  EvaluateStrategicMetaCausalityResult,
  StrategicMetaCausalitySnapshot,
  StrategicMetaCausalityIntelligenceState,
  StrategicMetaCausalityPanelContract,
} from "./strategicMetaCausalityTypes.ts";
import {
  META_CAUSALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER,
  buildMetaCausalityContentFingerprint,
  guardEvaluateStrategicMetaCausality,
  guardStrategicMetaCausalitySemantics,
} from "./strategicMetaCausalityGuards.ts";
import {
  deriveStrategicMetaCausalitySignals,
  analyzeLongHorizonCausalStructures,
  calculateLongHorizonCausalScore,
  identifyStrategicForceZones,
  identifySystemicMetaRiskZones,
  classifyExecutiveMetaCausalityLabel,
} from "./longHorizonCausalModeling.ts";
import {
  analyzeStrategicForcePropagation,
  calculateMetaCausalityCoherenceScore,
  calculateMetaCausalityInstabilityScore,
} from "./strategicForcePropagationAnalysis.ts";
import { analyzeEnterpriseMetaCausalityIntelligence } from "./enterpriseMetaCausalityIntelligence.ts";
import { buildStrategicMetaCausalitySemantics } from "./strategicMetaCausalitySemantics.ts";
import { logStrategicMetaCausalityDev } from "./strategicMetaCausalityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function metaCausalityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicMetaCausalityPanelContract(input: {
  snapshot: StrategicMetaCausalitySnapshot;
}): StrategicMetaCausalityPanelContract {
  const viewHint =
    input.snapshot.state.strategicForcePropagationRecords.length > 3
      ? "long_horizon_causality_heatmap"
      : input.snapshot.state.longHorizonCausalRecords.length > 4
        ? "enterprise_force_timeline"
        : input.snapshot.state.executiveMetaCausalityLabel === "critical"
          ? "meta_strategic_causality_panel"
          : input.snapshot.state.executiveMetaCausalityLabel === "destabilizing"
            ? "strategic_force_dashboard"
            : input.snapshot.state.activeMetaCausalitySignals.length > 3
              ? "meta_causality_overlay"
              : "meta_causality_overlay";

  return Object.freeze({
    metaCausalityStateId: input.snapshot.metaCausalityStateId,
    topologyId: input.snapshot.topologyId,
    metaCausalityCoherenceScore: input.snapshot.state.metaCausalityCoherenceScore,
    executiveMetaCausalityLabel: input.snapshot.state.executiveMetaCausalityLabel,
    metaCausalityAmbiguityDisclaimer: input.snapshot.state.metaCausalityAmbiguityDisclaimer,
    nonAutonomousMetaCausalityDisclaimer:
      input.snapshot.state.nonAutonomousMetaCausalityDisclaimer,
    metaCausalitySignals: Object.freeze(
      input.snapshot.state.activeMetaCausalitySignals.map((s) =>
        Object.freeze({
          metaCausalityId: s.metaCausalityId,
          metaCausalityState: s.metaCausalityState,
          metaCausalityStrength: s.metaCausalityStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonCausalRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic meta-causality (read-only; never fabricates causal structures).
 */
export function evaluateStrategicMetaCausality(
  input: EvaluateStrategicMetaCausalityInput
): EvaluateStrategicMetaCausalityResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.metaCausalityContext?.tick) || 0);
  const metaCausalityStateId = String(
    input.metaCausalityStateId ?? `strategic-meta-causality::${topology.topologyId}::${tick}`
  ).trim();

  const causalityLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.metaCausalityContext?.causalityLeverageFactor ?? 0)
  );
  const forcePropagationStressFactor = clamp01Stress(
    input.metaCausalityContext?.forcePropagationStressFactor ?? 0
  );

  logStrategicMetaCausalityDev("MetaCausality", {
    metaCausalityStateId,
    topologyId: topology.topologyId,
    tick,
    patternLabel: input.strategicPatternState.executivePatternLabel,
    metaLabel: input.metaStrategicState.executiveMetaLabel,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
  });

  const activeMetaCausalitySignals = deriveStrategicMetaCausalitySignals({
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
    causalityLeverageFactor,
    forcePropagationStressFactor,
  });

  const longHorizonCausalRecords = analyzeLongHorizonCausalStructures({
    metaCausalitySignals: activeMetaCausalitySignals,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
  });

  const longHorizonCausalScore = calculateLongHorizonCausalScore({
    metaCausalitySignals: activeMetaCausalitySignals,
    longHorizonCausalRecords,
    strategicPatternState: input.strategicPatternState,
  });

  const strategicForcePropagationRecords = analyzeStrategicForcePropagation({
    metaCausalitySignals: activeMetaCausalitySignals,
    longHorizonCausalRecords,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const metaCausalityCoherenceScore = calculateMetaCausalityCoherenceScore({
    metaCausalitySignals: activeMetaCausalitySignals,
    strategicForcePropagationRecords,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
  });

  const metaCausalityInstabilityScore = calculateMetaCausalityInstabilityScore({
    metaCausalitySignals: activeMetaCausalitySignals,
    strategicForcePropagationRecords,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
  });

  const enterpriseMetaCausalityRecords = analyzeEnterpriseMetaCausalityIntelligence({
    metaCausalitySignals: activeMetaCausalitySignals,
    longHorizonCausalRecords,
    strategicForcePropagationRecords,
    strategicPatternState: input.strategicPatternState,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    trajectoryState: predictive.trajectoryState,
    divergenceState: predictive.divergenceState,
  });

  const patternFingerprint = stableStringify({
    label: input.strategicPatternState.executivePatternLabel,
    coherence: input.strategicPatternState.patternCoherenceScore,
    instability: input.strategicPatternState.patternInstabilityScore,
    evolution: input.strategicPatternState.longHorizonPatternScore,
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

  const pendingFingerprint = buildMetaCausalityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    patternFingerprint,
    metaFingerprint,
    realityFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicMetaCausality({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    metaCausalitySignals: activeMetaCausalitySignals,
    priorMetaCausalityFingerprints: input.priorMetaCausalityFingerprints,
    pendingFingerprint,
    metaCausalityCoherenceScore,
    metaCausalityInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveMetaCausalityLabel = classifyExecutiveMetaCausalityLabel({
    metaCausalityCoherenceScore,
    longHorizonCausalScore,
    metaCausalityInstabilityScore,
    metaCausalitySignals: activeMetaCausalitySignals,
  });

  const state: StrategicMetaCausalityIntelligenceState = Object.freeze({
    activeMetaCausalitySignals: Object.freeze(activeMetaCausalitySignals),
    longHorizonCausalRecords,
    strategicForcePropagationRecords,
    enterpriseMetaCausalityRecords,
    strategicForceZones: identifyStrategicForceZones(activeMetaCausalitySignals),
    systemicMetaRiskZones: identifySystemicMetaRiskZones(activeMetaCausalitySignals),
    metaCausalityCoherenceScore,
    longHorizonCausalScore,
    metaCausalityInstabilityScore,
    executiveMetaCausalityLabel,
    metaCausalityAmbiguityDisclaimer: META_CAUSALITY_AMBIGUITY_DISCLAIMER,
    nonAutonomousMetaCausalityDisclaimer: NON_AUTONOMOUS_META_CAUSALITY_DISCLAIMER,
  });

  const semantics = buildStrategicMetaCausalitySemantics({ state });
  const semanticsGuard = guardStrategicMetaCausalitySemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    metaCausalityStateId,
    executiveMetaCausalityLabel,
    metaCausalityCoherenceScore,
    metaCausalityInstabilityScore,
  });

  const snapshot: StrategicMetaCausalitySnapshot = Object.freeze({
    metaCausalityStateId,
    topologyId: topology.topologyId,
    patternStateId:
      input.patternStateId ?? `strategic-pattern::${topology.topologyId}::${tick}`,
    metaStateId: input.metaStateId ?? `meta-strategic::${topology.topologyId}::${tick}`,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      metaCausalitySummaries: Object.freeze([...semantics.metaCausalitySummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      forceSummaries: Object.freeze([...semantics.forceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: metaCausalityBuiltAt(tick),
  });

  const panelContract = buildStrategicMetaCausalityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicMetaCausalitySnapshot(
  snapshot: StrategicMetaCausalitySnapshot
): StrategicMetaCausalitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeMetaCausalitySignals: Object.freeze(
        snapshot.state.activeMetaCausalitySignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonCausalRecords: Object.freeze(
        snapshot.state.longHorizonCausalRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicForcePropagationRecords: Object.freeze(
        snapshot.state.strategicForcePropagationRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseMetaCausalityRecords: Object.freeze(
        snapshot.state.enterpriseMetaCausalityRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicForceZones: Object.freeze([...snapshot.state.strategicForceZones]),
      systemicMetaRiskZones: Object.freeze([...snapshot.state.systemicMetaRiskZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
