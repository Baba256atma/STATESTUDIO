/**
 * D7:6:4 — Executive insight prioritization engine (immutable, non-manipulative).
 */

import type {
  EvaluateExecutiveInsightPrioritizationInput,
  EvaluateExecutiveInsightPrioritizationResult,
  ExecutiveInsightPrioritizationSnapshot,
  ExecutiveInsightPrioritizationState,
  ExecutiveInsightPrioritizationPanelContract,
} from "./executiveInsightPrioritizationTypes.ts";
import {
  PRIORITIZATION_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_PRIORITIZATION_DISCLAIMER,
  buildInsightPrioritizationContentFingerprint,
  guardEvaluateExecutiveInsightPrioritization,
  guardInsightPrioritizationExecutiveSemantics,
} from "./insightPrioritizationGuards.ts";
import {
  analyzeStrategicValue,
  calculateStrategicInsightScore,
  calculateStrategicValueScore,
  classifyExecutiveInsightPrioritizationLabel,
  deriveExecutiveInsightPrioritySignals,
  identifyElevatedInsightZones,
  identifyLowSignalNoiseZones,
} from "./strategicValueModel.ts";
import {
  analyzeInsightUrgency,
  calculateUrgencyEscalationScore,
} from "./insightUrgencyAnalysis.ts";
import { analyzeExecutiveInsightIntelligence } from "./executiveInsightIntelligence.ts";
import { buildExecutiveInsightPrioritizationSemantics } from "./executiveInsightPrioritizationSemantics.ts";
import { logExecutiveInsightPrioritizationDev } from "./insightPrioritizationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function prioritizationBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveInsightPrioritizationPanelContract(input: {
  snapshot: ExecutiveInsightPrioritizationSnapshot;
}): ExecutiveInsightPrioritizationPanelContract {
  const viewHint =
    input.snapshot.state.insightUrgencyRecords.length > 3
      ? "urgency_heatmap"
      : input.snapshot.state.strategicValueRecords.length > 4
        ? "signal_importance_timeline"
        : input.snapshot.state.executiveInsightPrioritizationLabel === "critical"
          ? "strategic_value_panel"
          : input.snapshot.state.executiveInsightPrioritizationLabel === "urgent"
            ? "executive_value_dashboard"
            : input.snapshot.state.activeInsightPriorities.length > 3
              ? "insight_priority_overlay"
              : "insight_priority_overlay";

  return Object.freeze({
    insightPrioritizationStateId: input.snapshot.insightPrioritizationStateId,
    topologyId: input.snapshot.topologyId,
    strategicInsightScore: input.snapshot.state.strategicInsightScore,
    executiveInsightPrioritizationLabel:
      input.snapshot.state.executiveInsightPrioritizationLabel,
    prioritizationAmbiguityDisclaimer: input.snapshot.state.prioritizationAmbiguityDisclaimer,
    nonManipulationPrioritizationDisclaimer:
      input.snapshot.state.nonManipulationPrioritizationDisclaimer,
    insightSignals: Object.freeze(
      input.snapshot.state.activeInsightPriorities.map((s) =>
        Object.freeze({
          insightId: s.insightId,
          priorityState: s.priorityState,
          priorityStrength: s.priorityStrength,
        })
      )
    ),
    valueSummaries: Object.freeze(
      input.snapshot.state.strategicValueRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive insight prioritization (read-only; never manipulates executive perception).
 */
export function evaluateExecutiveInsightPrioritization(
  input: EvaluateExecutiveInsightPrioritizationInput
): EvaluateExecutiveInsightPrioritizationResult {
  const topology = input.topology;
  const tick = Math.floor(
    Number(input.tick ?? input.insightPrioritizationContext?.tick) || 0
  );
  const insightPrioritizationStateId = String(
    input.insightPrioritizationStateId ??
      `executive-insight-prioritization::${topology.topologyId}::${tick}`
  ).trim();

  const insightLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.insightPrioritizationContext?.insightLeverageFactor ?? 0)
  );
  const urgencyStressFactor = clamp01Stress(
    input.insightPrioritizationContext?.urgencyStressFactor ?? 0
  );

  logExecutiveInsightPrioritizationDev("InsightPriority", {
    insightPrioritizationStateId,
    topologyId: topology.topologyId,
    tick,
    loadLabel: input.cognitiveLoadState.executiveCognitiveLoadLabel,
    routingLabel: input.attentionRoutingState.executiveAttentionRoutingLabel,
  });

  const activeInsightPriorities = deriveExecutiveInsightPrioritySignals({
    cognitiveLoadState: input.cognitiveLoadState,
    attentionRoutingState: input.attentionRoutingState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    insightLeverageFactor,
    urgencyStressFactor,
  });

  const strategicValueRecords = analyzeStrategicValue({
    insightSignals: activeInsightPriorities,
    cognitiveLoadState: input.cognitiveLoadState,
    attentionRoutingState: input.attentionRoutingState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const strategicInsightScore = calculateStrategicInsightScore({
    insightSignals: activeInsightPriorities,
    cognitiveLoadState: input.cognitiveLoadState,
    confidenceState: input.confidenceState,
  });

  const strategicValueScore = calculateStrategicValueScore({
    valueRecords: strategicValueRecords,
  });

  const insightUrgencyRecords = analyzeInsightUrgency({
    insightSignals: activeInsightPriorities,
    cognitiveLoadState: input.cognitiveLoadState,
    cognitiveUxState: input.cognitiveUxState,
    attentionRoutingState: input.attentionRoutingState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    explainabilityState: input.explainabilityState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const urgencyEscalationScore = calculateUrgencyEscalationScore({
    insightSignals: activeInsightPriorities,
    urgencyRecords: insightUrgencyRecords,
    cognitiveLoadState: input.cognitiveLoadState,
  });

  const executiveInsightRecords = analyzeExecutiveInsightIntelligence({
    insightSignals: activeInsightPriorities,
    valueRecords: strategicValueRecords,
    urgencyRecords: insightUrgencyRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const cognitiveLoadFingerprint = stableStringify({
    label: input.cognitiveLoadState.executiveCognitiveLoadLabel,
    balance: input.cognitiveLoadState.cognitiveBalanceScore,
  });
  const attentionRoutingFingerprint = stableStringify({
    label: input.attentionRoutingState.executiveAttentionRoutingLabel,
    focus: input.attentionRoutingState.focusStabilityScore,
  });
  const cognitiveUxFingerprint = stableStringify({
    label: input.cognitiveUxState.executiveCognitiveLabel,
    clarity: input.cognitiveUxState.cognitiveClarityScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const consensusFingerprint = stableStringify({
    label: input.consensusState.executiveConsensusLabel,
    alignment: input.consensusState.strategicAlignmentScore,
  });
  const advisoryFingerprint = stableStringify({
    label: input.advisoryState.executiveAdvisoryLabel,
    clarity: input.advisoryState.advisoryClarityScore,
  });
  const explainabilityFingerprint = stableStringify({
    label: input.explainabilityState.executiveExplainabilityLabel,
    clarity: input.explainabilityState.explanationClarityScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    count: input.recommendationState.activeRecommendations.length,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });

  const pendingFingerprint = buildInsightPrioritizationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    cognitiveLoadFingerprint,
    attentionRoutingFingerprint,
    cognitiveUxFingerprint,
    orchestrationFingerprint,
    consensusFingerprint,
    advisoryFingerprint,
    explainabilityFingerprint,
    governanceFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveInsightPrioritization({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    insightSignals: activeInsightPriorities,
    priorInsightPrioritizationFingerprints: input.priorInsightPrioritizationFingerprints,
    pendingFingerprint,
    strategicInsightScore,
    urgencyEscalationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveInsightPrioritizationLabel = classifyExecutiveInsightPrioritizationLabel({
    strategicInsightScore,
    strategicValueScore,
    urgencyEscalationScore,
    insightSignals: activeInsightPriorities,
  });

  const state: ExecutiveInsightPrioritizationState = Object.freeze({
    activeInsightPriorities: Object.freeze(activeInsightPriorities),
    strategicValueRecords,
    insightUrgencyRecords,
    executiveInsightRecords,
    elevatedInsightZones: identifyElevatedInsightZones(activeInsightPriorities),
    lowSignalNoiseZones: identifyLowSignalNoiseZones(activeInsightPriorities),
    strategicInsightScore,
    strategicValueScore,
    urgencyEscalationScore,
    executiveInsightPrioritizationLabel,
    prioritizationAmbiguityDisclaimer: PRIORITIZATION_AMBIGUITY_DISCLAIMER,
    nonManipulationPrioritizationDisclaimer: NON_MANIPULATION_PRIORITIZATION_DISCLAIMER,
  });

  const semantics = buildExecutiveInsightPrioritizationSemantics({ state });
  const semanticsGuard = guardInsightPrioritizationExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    insightPrioritizationStateId,
    executiveInsightPrioritizationLabel,
    strategicInsightScore,
    strategicValueScore,
  });

  const snapshot: ExecutiveInsightPrioritizationSnapshot = Object.freeze({
    insightPrioritizationStateId,
    topologyId: topology.topologyId,
    cognitiveLoadStateId: `executive-cognitive-load::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      insightSummaries: Object.freeze([...semantics.insightSummaries]),
      valueSummaries: Object.freeze([...semantics.valueSummaries]),
      urgencySummaries: Object.freeze([...semantics.urgencySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: prioritizationBuiltAt(tick),
  });

  const panelContract = buildExecutiveInsightPrioritizationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveInsightPrioritizationSnapshot(
  snapshot: ExecutiveInsightPrioritizationSnapshot
): ExecutiveInsightPrioritizationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeInsightPriorities: Object.freeze(
        snapshot.state.activeInsightPriorities.map((s) => Object.freeze({ ...s }))
      ),
      strategicValueRecords: Object.freeze(
        snapshot.state.strategicValueRecords.map((r) => Object.freeze({ ...r }))
      ),
      insightUrgencyRecords: Object.freeze(
        snapshot.state.insightUrgencyRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveInsightRecords: Object.freeze(
        snapshot.state.executiveInsightRecords.map((r) => Object.freeze({ ...r }))
      ),
      elevatedInsightZones: Object.freeze([...snapshot.state.elevatedInsightZones]),
      lowSignalNoiseZones: Object.freeze([...snapshot.state.lowSignalNoiseZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
