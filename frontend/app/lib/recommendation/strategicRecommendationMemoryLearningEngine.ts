/**
 * D7:5:5 — Strategic recommendation memory + learning engine (immutable, non-autonomous).
 */

import type {
  EvaluateRecommendationLearningInput,
  EvaluateRecommendationLearningResult,
  RecommendationMemoryPanelContract,
  StrategicRecommendationMemorySnapshot,
  StrategicRecommendationMemoryState,
} from "./recommendationMemoryTypes.ts";
import {
  LEARNING_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_LEARNING_DISCLAIMER,
  buildMemoryContentFingerprint,
  guardEvaluateRecommendationLearning,
  guardLearningExecutiveSemantics,
} from "./learningGuards.ts";
import {
  analyzeHistoricalOutcomes,
  calculateLearningStabilityScore,
  calculatePatternRecurrenceScore,
  calculateValidationConfidenceScore,
  classifyExecutiveLearningLabel,
  deriveRecommendationMemorySignals,
  identifyRepeatedFailureZones,
  identifyValidatedRecommendationZones,
} from "./historicalOutcomeModel.ts";
import { analyzePatternLearning } from "./patternLearningAnalysis.ts";
import { analyzeExecutiveStrategicMemory } from "./executiveStrategicMemoryIntelligence.ts";
import { buildExecutiveRecommendationLearningSemantics } from "./executiveRecommendationLearningSemantics.ts";
import { logRecommendationMemoryDev } from "./learningDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function memoryBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildRecommendationMemoryPanelContract(input: {
  snapshot: StrategicRecommendationMemorySnapshot;
}): RecommendationMemoryPanelContract {
  const viewHint =
    input.snapshot.state.patternLearningRecords.length > 3
      ? "resilience_learning_heatmap"
      : input.snapshot.state.historicalOutcomeRecords.length > 3
        ? "historical_pattern_panel"
        : input.snapshot.state.executiveLearningLabel === "volatile"
          ? "executive_learning_timeline"
          : input.snapshot.state.activeMemorySignals.length > 3
            ? "recommendation_history_dashboard"
            : "strategic_memory_overlay";

  return Object.freeze({
    memoryStateId: input.snapshot.memoryStateId,
    topologyId: input.snapshot.topologyId,
    learningStabilityScore: input.snapshot.state.learningStabilityScore,
    executiveLearningLabel: input.snapshot.state.executiveLearningLabel,
    learningAmbiguityDisclaimer: input.snapshot.state.learningAmbiguityDisclaimer,
    nonAutonomousLearningDisclaimer: input.snapshot.state.nonAutonomousLearningDisclaimer,
    memories: Object.freeze(
      input.snapshot.state.activeMemorySignals.map((m) =>
        Object.freeze({
          memoryId: m.memoryId,
          originatingRecommendationId: m.originatingRecommendationId,
          memoryState: m.memoryState,
          memoryStrength: m.memoryStrength,
        })
      )
    ),
    outcomeSummaries: Object.freeze(
      input.snapshot.state.historicalOutcomeRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate recommendation memory + learning (read-only; never autonomously rewrites policies).
 */
export function evaluateRecommendationLearning(
  input: EvaluateRecommendationLearningInput
): EvaluateRecommendationLearningResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.learningContext?.tick) || 0);
  const memoryStateId = String(
    input.memoryStateId ?? `recommendation-memory::${topology.topologyId}::${tick}`
  ).trim();

  const memoryLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.learningContext?.memoryLeverageFactor ?? 0)
  );
  const historicalStressFactor = clamp01Stress(
    input.learningContext?.historicalStressFactor ?? 0
  );

  logRecommendationMemoryDev("RecommendationMemory", {
    memoryStateId,
    topologyId: topology.topologyId,
    tick,
    comparisonLabel: input.comparisonState.executiveComparisonLabel,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
  });

  const activeMemorySignals = deriveRecommendationMemorySignals({
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    comparisonState: input.comparisonState,
    tradeoffState: input.tradeoffState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    memoryLeverageFactor,
    historicalStressFactor,
  });

  const historicalOutcomeRecords = analyzeHistoricalOutcomes({
    memories: activeMemorySignals,
    recommendationState: input.recommendationState,
    comparisonState: input.comparisonState,
    adaptationState: input.adaptationState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    preventionState: input.preventionState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
  });

  const learningStabilityScore = calculateLearningStabilityScore({
    memories: activeMemorySignals,
    confidenceState: input.confidenceState,
  });

  const patternRecurrenceScore = calculatePatternRecurrenceScore({
    memories: activeMemorySignals,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
  });

  const validationConfidenceScore = calculateValidationConfidenceScore({
    memories: activeMemorySignals,
    confidenceState: input.confidenceState,
    comparisonState: input.comparisonState,
  });

  const patternLearningRecords = analyzePatternLearning({
    memories: activeMemorySignals,
    comparisonState: input.comparisonState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    adaptationState: input.adaptationState,
    cascadeState: input.cascadeState,
  });

  const executiveStrategicMemoryRecords = analyzeExecutiveStrategicMemory({
    memories: activeMemorySignals,
    outcomeRecords: historicalOutcomeRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const comparisonFingerprint = stableStringify({
    label: input.comparisonState.executiveComparisonLabel,
    stability: input.comparisonState.comparisonStabilityScore,
  });
  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    count: input.recommendationState.activeRecommendations.length,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });

  const pendingFingerprint = buildMemoryContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateRecommendationLearning({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    memories: activeMemorySignals,
    priorMemoryFingerprints: input.priorMemoryFingerprints,
    pendingFingerprint,
    learningStabilityScore,
    patternRecurrenceScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveLearningLabel = classifyExecutiveLearningLabel({
    learningStabilityScore,
    patternRecurrenceScore,
    validationConfidenceScore,
  });

  const state: StrategicRecommendationMemoryState = Object.freeze({
    activeMemorySignals: Object.freeze(activeMemorySignals),
    historicalOutcomeRecords,
    patternLearningRecords,
    executiveStrategicMemoryRecords,
    validatedRecommendationZones: identifyValidatedRecommendationZones(activeMemorySignals),
    repeatedFailureZones: identifyRepeatedFailureZones(activeMemorySignals),
    learningStabilityScore,
    patternRecurrenceScore,
    validationConfidenceScore,
    executiveLearningLabel,
    learningAmbiguityDisclaimer: LEARNING_AMBIGUITY_DISCLAIMER,
    nonAutonomousLearningDisclaimer: NON_AUTONOMOUS_LEARNING_DISCLAIMER,
  });

  const semantics = buildExecutiveRecommendationLearningSemantics({ state });
  const semanticsGuard = guardLearningExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    memoryStateId,
    executiveLearningLabel,
    learningStabilityScore,
    patternRecurrenceScore,
  });

  const snapshot: StrategicRecommendationMemorySnapshot = Object.freeze({
    memoryStateId,
    topologyId: topology.topologyId,
    comparisonStateId: `multi-strategy-comparison::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      memorySummaries: Object.freeze([...semantics.memorySummaries]),
      outcomeSummaries: Object.freeze([...semantics.outcomeSummaries]),
      patternSummaries: Object.freeze([...semantics.patternSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: memoryBuiltAt(tick),
  });

  const panelContract = buildRecommendationMemoryPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicRecommendationMemorySnapshot(
  snapshot: StrategicRecommendationMemorySnapshot
): StrategicRecommendationMemorySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeMemorySignals: Object.freeze(
        snapshot.state.activeMemorySignals.map((m) => Object.freeze({ ...m }))
      ),
      historicalOutcomeRecords: Object.freeze(
        snapshot.state.historicalOutcomeRecords.map((r) => Object.freeze({ ...r }))
      ),
      patternLearningRecords: Object.freeze(
        snapshot.state.patternLearningRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveStrategicMemoryRecords: Object.freeze(
        snapshot.state.executiveStrategicMemoryRecords.map((r) => Object.freeze({ ...r }))
      ),
      validatedRecommendationZones: Object.freeze([
        ...snapshot.state.validatedRecommendationZones,
      ]),
      repeatedFailureZones: Object.freeze([...snapshot.state.repeatedFailureZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
