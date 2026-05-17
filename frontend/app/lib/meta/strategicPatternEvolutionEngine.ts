/**
 * D7:8:2 — Strategic pattern evolution intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateStrategicPatternEvolutionInput,
  EvaluateStrategicPatternEvolutionResult,
  StrategicPatternEvolutionSnapshot,
  StrategicPatternEvolutionIntelligenceState,
  StrategicPatternEvolutionPanelContract,
} from "./strategicPatternEvolutionTypes.ts";
import {
  PATTERN_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_PATTERN_DISCLAIMER,
  buildPatternContentFingerprint,
  guardEvaluateStrategicPatternEvolution,
  guardStrategicPatternEvolutionSemantics,
} from "./strategicPatternEvolutionGuards.ts";
import {
  deriveStrategicPatternEvolutionSignals,
  analyzeLongHorizonPatterns,
  calculateLongHorizonPatternScore,
  identifyAdaptivePatternZones,
  identifyUnstablePatternZones,
  classifyExecutivePatternLabel,
} from "./longHorizonPatternModeling.ts";
import {
  analyzeStrategicPatternInstability,
  calculatePatternCoherenceScore,
  calculatePatternInstabilityScore,
} from "./strategicPatternInstabilityAnalysis.ts";
import { analyzeEnterprisePatternIntelligence } from "./enterprisePatternIntelligence.ts";
import { buildStrategicPatternEvolutionSemantics } from "./strategicPatternEvolutionSemantics.ts";
import { logStrategicPatternEvolutionDev } from "./strategicPatternEvolutionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function patternBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicPatternEvolutionPanelContract(input: {
  snapshot: StrategicPatternEvolutionSnapshot;
}): StrategicPatternEvolutionPanelContract {
  const viewHint =
    input.snapshot.state.patternInstabilityRecords.length > 3
      ? "recurring_behavior_heatmap"
      : input.snapshot.state.longHorizonPatternRecords.length > 4
        ? "strategic_evolution_timeline"
        : input.snapshot.state.executivePatternLabel === "critical"
          ? "enterprise_pattern_panel"
          : input.snapshot.state.executivePatternLabel === "degrading"
            ? "long_horizon_pattern_dashboard"
            : input.snapshot.state.activePatternSignals.length > 3
              ? "strategic_pattern_overlay"
              : "strategic_pattern_overlay";

  return Object.freeze({
    patternStateId: input.snapshot.patternStateId,
    topologyId: input.snapshot.topologyId,
    patternCoherenceScore: input.snapshot.state.patternCoherenceScore,
    executivePatternLabel: input.snapshot.state.executivePatternLabel,
    patternAmbiguityDisclaimer: input.snapshot.state.patternAmbiguityDisclaimer,
    nonAutonomousPatternDisclaimer: input.snapshot.state.nonAutonomousPatternDisclaimer,
    patternSignals: Object.freeze(
      input.snapshot.state.activePatternSignals.map((s) =>
        Object.freeze({
          patternId: s.patternId,
          patternState: s.patternState,
          patternStrength: s.patternStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonPatternRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic pattern evolution (read-only; never fabricates strategic patterns).
 */
export function evaluateStrategicPatternEvolution(
  input: EvaluateStrategicPatternEvolutionInput
): EvaluateStrategicPatternEvolutionResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const predictive = input.predictiveIntelligenceState;
  const tick = Math.floor(Number(input.tick ?? input.patternContext?.tick) || 0);
  const patternStateId = String(
    input.patternStateId ?? `strategic-pattern::${topology.topologyId}::${tick}`
  ).trim();

  const patternLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.patternContext?.patternLeverageFactor ?? 0)
  );
  const recurrenceStressFactor = clamp01Stress(
    input.patternContext?.recurrenceStressFactor ?? 0
  );

  logStrategicPatternEvolutionDev("StrategicPattern", {
    patternStateId,
    topologyId: topology.topologyId,
    tick,
    metaLabel: input.metaStrategicState.executiveMetaLabel,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
  });

  const activePatternSignals = deriveStrategicPatternEvolutionSignals({
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
    patternLeverageFactor,
    recurrenceStressFactor,
  });

  const longHorizonPatternRecords = analyzeLongHorizonPatterns({
    patternSignals: activePatternSignals,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    divergenceState: predictive.divergenceState,
    trajectoryState: predictive.trajectoryState,
    cascadeState: predictive.cascadeState,
  });

  const longHorizonPatternScore = calculateLongHorizonPatternScore({
    patternSignals: activePatternSignals,
    longHorizonPatternRecords,
    metaStrategicState: input.metaStrategicState,
  });

  const patternInstabilityRecords = analyzeStrategicPatternInstability({
    patternSignals: activePatternSignals,
    longHorizonPatternRecords,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
  });

  const patternCoherenceScore = calculatePatternCoherenceScore({
    patternSignals: activePatternSignals,
    patternInstabilityRecords,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
  });

  const patternInstabilityScore = calculatePatternInstabilityScore({
    patternSignals: activePatternSignals,
    patternInstabilityRecords,
    metaStrategicState: input.metaStrategicState,
  });

  const enterprisePatternRecords = analyzeEnterprisePatternIntelligence({
    patternSignals: activePatternSignals,
    longHorizonPatternRecords,
    patternInstabilityRecords,
    metaStrategicState: input.metaStrategicState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    foresightState: predictive.foresightState,
    trajectoryState: predictive.trajectoryState,
    divergenceState: predictive.divergenceState,
  });

  const metaFingerprint = stableStringify({
    label: input.metaStrategicState.executiveMetaLabel,
    coherence: input.metaStrategicState.strategicMetaCoherenceScore,
    instability: input.metaStrategicState.metaInstabilityScore,
    evolution: input.metaStrategicState.strategicEvolutionScore,
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

  const pendingFingerprint = buildPatternContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    metaFingerprint,
    realityFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicPatternEvolution({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    patternSignals: activePatternSignals,
    priorPatternFingerprints: input.priorPatternFingerprints,
    pendingFingerprint,
    patternCoherenceScore,
    patternInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executivePatternLabel = classifyExecutivePatternLabel({
    patternCoherenceScore,
    longHorizonPatternScore,
    patternInstabilityScore,
    patternSignals: activePatternSignals,
  });

  const state: StrategicPatternEvolutionIntelligenceState = Object.freeze({
    activePatternSignals: Object.freeze(activePatternSignals),
    longHorizonPatternRecords,
    patternInstabilityRecords,
    enterprisePatternRecords,
    adaptivePatternZones: identifyAdaptivePatternZones(activePatternSignals),
    unstablePatternZones: identifyUnstablePatternZones(activePatternSignals),
    patternCoherenceScore,
    longHorizonPatternScore,
    patternInstabilityScore,
    executivePatternLabel,
    patternAmbiguityDisclaimer: PATTERN_AMBIGUITY_DISCLAIMER,
    nonAutonomousPatternDisclaimer: NON_AUTONOMOUS_PATTERN_DISCLAIMER,
  });

  const semantics = buildStrategicPatternEvolutionSemantics({ state });
  const semanticsGuard = guardStrategicPatternEvolutionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    patternStateId,
    executivePatternLabel,
    patternCoherenceScore,
    patternInstabilityScore,
  });

  const snapshot: StrategicPatternEvolutionSnapshot = Object.freeze({
    patternStateId,
    topologyId: topology.topologyId,
    metaStateId: input.metaStateId ?? `meta-strategic::${topology.topologyId}::${tick}`,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      patternSummaries: Object.freeze([...semantics.patternSummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      instabilitySummaries: Object.freeze([...semantics.instabilitySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: patternBuiltAt(tick),
  });

  const panelContract = buildStrategicPatternEvolutionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicPatternEvolutionSnapshot(
  snapshot: StrategicPatternEvolutionSnapshot
): StrategicPatternEvolutionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activePatternSignals: Object.freeze(
        snapshot.state.activePatternSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonPatternRecords: Object.freeze(
        snapshot.state.longHorizonPatternRecords.map((r) => Object.freeze({ ...r }))
      ),
      patternInstabilityRecords: Object.freeze(
        snapshot.state.patternInstabilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterprisePatternRecords: Object.freeze(
        snapshot.state.enterprisePatternRecords.map((r) => Object.freeze({ ...r }))
      ),
      adaptivePatternZones: Object.freeze([...snapshot.state.adaptivePatternZones]),
      unstablePatternZones: Object.freeze([...snapshot.state.unstablePatternZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
