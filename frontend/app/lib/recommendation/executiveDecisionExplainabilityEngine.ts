/**
 * D7:5:7 — Executive decision explainability engine (immutable, trace-only).
 */

import type {
  EvaluateDecisionExplainabilityInput,
  EvaluateDecisionExplainabilityResult,
  DecisionExplainabilityPanelContract,
  ExecutiveDecisionExplainabilitySnapshot,
  ExecutiveExplainabilityState,
} from "./executiveExplainabilityTypes.ts";
import {
  EXPLAINABILITY_AMBIGUITY_DISCLAIMER,
  NON_OPAQUE_REASONING_DISCLAIMER,
  buildExplainabilityContentFingerprint,
  guardEvaluateDecisionExplainability,
  guardExplainabilityExecutiveSemantics,
} from "./explainabilityGuards.ts";
import {
  analyzeRecommendationTraces,
  calculateExplanationClarityScore,
  calculateReasoningTransparencyScore,
  calculateTraceabilityScore,
  classifyExecutiveExplainabilityLabel,
  deriveExecutiveExplainabilitySignals,
  identifyAmbiguityExplanationZones,
  identifyTraceabilityZones,
} from "./recommendationTraceModel.ts";
import { analyzeSignalToDecision } from "./signalToDecisionAnalysis.ts";
import { analyzeExecutiveReasoningTransparency } from "./executiveReasoningTransparencyIntelligence.ts";
import { buildExecutiveDecisionExplainabilitySemantics } from "./executiveDecisionExplainabilitySemantics.ts";
import { logExecutiveDecisionExplainabilityDev } from "./explainabilityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function explainabilityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildDecisionExplainabilityPanelContract(input: {
  snapshot: ExecutiveDecisionExplainabilitySnapshot;
}): DecisionExplainabilityPanelContract {
  const viewHint =
    input.snapshot.state.signalToDecisionRecords.length > 3
      ? "signal_to_decision_map"
      : input.snapshot.state.recommendationTraceRecords.length > 3
        ? "recommendation_trace_dashboard"
        : input.snapshot.state.executiveExplainabilityLabel === "restricted"
          ? "evidence_trace_panel"
          : input.snapshot.state.executiveExplainabilityLabel === "volatile"
            ? "executive_reasoning_timeline"
            : input.snapshot.state.activeExplainabilitySignals.length > 3
              ? "explainability_overlay"
              : "explainability_overlay";

  return Object.freeze({
    explainabilityStateId: input.snapshot.explainabilityStateId,
    topologyId: input.snapshot.topologyId,
    explanationClarityScore: input.snapshot.state.explanationClarityScore,
    executiveExplainabilityLabel: input.snapshot.state.executiveExplainabilityLabel,
    explainabilityAmbiguityDisclaimer: input.snapshot.state.explainabilityAmbiguityDisclaimer,
    nonOpaqueReasoningDisclaimer: input.snapshot.state.nonOpaqueReasoningDisclaimer,
    explanations: Object.freeze(
      input.snapshot.state.activeExplainabilitySignals.map((e) =>
        Object.freeze({
          explanationId: e.explanationId,
          relatedRecommendationId: e.relatedRecommendationId,
          explainabilityState: e.explainabilityState,
          explanationStrength: e.explanationStrength,
        })
      )
    ),
    traceSummaries: Object.freeze(
      input.snapshot.state.recommendationTraceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate decision explainability (read-only; never fabricates unsupported reasoning).
 */
export function evaluateDecisionExplainability(
  input: EvaluateDecisionExplainabilityInput
): EvaluateDecisionExplainabilityResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.explainabilityContext?.tick) || 0);
  const explainabilityStateId = String(
    input.explainabilityStateId ?? `decision-explainability::${topology.topologyId}::${tick}`
  ).trim();

  const explainabilityLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.explainabilityContext?.explainabilityLeverageFactor ?? 0)
  );
  const traceStressFactor = clamp01Stress(input.explainabilityContext?.traceStressFactor ?? 0);

  logExecutiveDecisionExplainabilityDev("Explainability", {
    explainabilityStateId,
    topologyId: topology.topologyId,
    tick,
    governanceLabel: input.governanceState.executiveGovernanceLabel,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
  });

  const activeExplainabilitySignals = deriveExecutiveExplainabilitySignals({
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    governanceState: input.governanceState,
    memoryState: input.memoryState,
    comparisonState: input.comparisonState,
    cascadeState: input.cascadeState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    explainabilityLeverageFactor,
    traceStressFactor,
  });

  const recommendationTraceRecords = analyzeRecommendationTraces({
    explanations: activeExplainabilitySignals,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    governanceState: input.governanceState,
    memoryState: input.memoryState,
    comparisonState: input.comparisonState,
    cascadeState: input.cascadeState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    preventionState: input.preventionState,
    adaptationState: input.adaptationState,
  });

  const explanationClarityScore = calculateExplanationClarityScore({
    explanations: activeExplainabilitySignals,
    confidenceState: input.confidenceState,
    governanceState: input.governanceState,
  });

  const traceabilityScore = calculateTraceabilityScore({
    explanations: activeExplainabilitySignals,
    recommendationState: input.recommendationState,
    memoryState: input.memoryState,
  });

  const reasoningTransparencyScore = calculateReasoningTransparencyScore({
    explanations: activeExplainabilitySignals,
    governanceState: input.governanceState,
    comparisonState: input.comparisonState,
  });

  const signalToDecisionRecords = analyzeSignalToDecision({
    explanations: activeExplainabilitySignals,
    confidenceState: input.confidenceState,
    comparisonState: input.comparisonState,
    governanceState: input.governanceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const executiveReasoningTransparencyRecords = analyzeExecutiveReasoningTransparency({
    explanations: activeExplainabilitySignals,
    traceRecords: recommendationTraceRecords,
    signalRecords: signalToDecisionRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const memoryFingerprint = stableStringify({
    label: input.memoryState.executiveLearningLabel,
    clarity: input.memoryState.learningStabilityScore,
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

  const pendingFingerprint = buildExplainabilityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    governanceFingerprint,
    memoryFingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateDecisionExplainability({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    explanations: activeExplainabilitySignals,
    priorExplainabilityFingerprints: input.priorExplainabilityFingerprints,
    pendingFingerprint,
    explanationClarityScore,
    reasoningTransparencyScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveExplainabilityLabel = classifyExecutiveExplainabilityLabel({
    explanationClarityScore,
    traceabilityScore,
    reasoningTransparencyScore,
  });

  const state: ExecutiveExplainabilityState = Object.freeze({
    activeExplainabilitySignals: Object.freeze(activeExplainabilitySignals),
    recommendationTraceRecords,
    signalToDecisionRecords,
    executiveReasoningTransparencyRecords,
    traceabilityZones: identifyTraceabilityZones(activeExplainabilitySignals),
    ambiguityExplanationZones: identifyAmbiguityExplanationZones(activeExplainabilitySignals),
    explanationClarityScore,
    traceabilityScore,
    reasoningTransparencyScore,
    executiveExplainabilityLabel,
    explainabilityAmbiguityDisclaimer: EXPLAINABILITY_AMBIGUITY_DISCLAIMER,
    nonOpaqueReasoningDisclaimer: NON_OPAQUE_REASONING_DISCLAIMER,
  });

  const semantics = buildExecutiveDecisionExplainabilitySemantics({ state });
  const semanticsGuard = guardExplainabilityExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    explainabilityStateId,
    executiveExplainabilityLabel,
    explanationClarityScore,
    traceabilityScore,
  });

  const snapshot: ExecutiveDecisionExplainabilitySnapshot = Object.freeze({
    explainabilityStateId,
    topologyId: topology.topologyId,
    governanceStateId: `strategic-governance::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      explanationSummaries: Object.freeze([...semantics.explanationSummaries]),
      traceSummaries: Object.freeze([...semantics.traceSummaries]),
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: explainabilityBuiltAt(tick),
  });

  const panelContract = buildDecisionExplainabilityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveDecisionExplainabilitySnapshot(
  snapshot: ExecutiveDecisionExplainabilitySnapshot
): ExecutiveDecisionExplainabilitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeExplainabilitySignals: Object.freeze(
        snapshot.state.activeExplainabilitySignals.map((e) => Object.freeze({ ...e }))
      ),
      recommendationTraceRecords: Object.freeze(
        snapshot.state.recommendationTraceRecords.map((r) => Object.freeze({ ...r }))
      ),
      signalToDecisionRecords: Object.freeze(
        snapshot.state.signalToDecisionRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveReasoningTransparencyRecords: Object.freeze(
        snapshot.state.executiveReasoningTransparencyRecords.map((r) => Object.freeze({ ...r }))
      ),
      traceabilityZones: Object.freeze([...snapshot.state.traceabilityZones]),
      ambiguityExplanationZones: Object.freeze([...snapshot.state.ambiguityExplanationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
