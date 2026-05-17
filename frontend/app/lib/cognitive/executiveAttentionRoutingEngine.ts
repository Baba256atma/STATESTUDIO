/**
 * D7:6:2 — Executive attention routing engine (immutable, non-manipulative).
 */

import type {
  EvaluateExecutiveAttentionRoutingInput,
  EvaluateExecutiveAttentionRoutingResult,
  ExecutiveAttentionRoutingPanelContract,
  ExecutiveAttentionRoutingSnapshot,
  ExecutiveAttentionRoutingState,
} from "./executiveAttentionRoutingTypes.ts";
import {
  ROUTING_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_ROUTING_DISCLAIMER,
  buildAttentionRoutingContentFingerprint,
  guardEvaluateExecutiveAttentionRouting,
  guardAttentionRoutingExecutiveSemantics,
} from "./attentionRoutingGuards.ts";
import {
  analyzeDynamicPriorityFlow,
  calculateFocusStabilityScore,
  calculateStrategicUrgencyScore,
  classifyExecutiveAttentionRoutingLabel,
  deriveExecutiveAttentionRoutingSignals,
  identifyFragmentedAttentionZones,
  identifyHighPriorityAttentionZones,
} from "./dynamicPriorityFlowModel.ts";
import {
  analyzeAttentionFragmentation,
  calculateAttentionFragmentationScore,
} from "./attentionFragmentationAnalysis.ts";
import { analyzeExecutiveFocusOrchestration } from "./executiveFocusOrchestrationIntelligence.ts";
import { buildExecutiveAttentionRoutingSemantics } from "./executiveAttentionRoutingSemantics.ts";
import { logExecutiveAttentionRoutingDev } from "./attentionRoutingDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function routingBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveAttentionRoutingPanelContract(input: {
  snapshot: ExecutiveAttentionRoutingSnapshot;
}): ExecutiveAttentionRoutingPanelContract {
  const viewHint =
    input.snapshot.state.attentionFragmentationRecords.length > 3
      ? "urgency_heatmap"
      : input.snapshot.state.dynamicPriorityFlowRecords.length > 4
        ? "cognitive_priority_timeline"
        : input.snapshot.state.executiveAttentionRoutingLabel === "critical"
          ? "operational_focus_panel"
          : input.snapshot.state.executiveAttentionRoutingLabel === "fragmented"
            ? "executive_focus_dashboard"
            : input.snapshot.state.activeAttentionRoutes.length > 3
              ? "attention_routing_overlay"
              : "attention_routing_overlay";

  return Object.freeze({
    attentionRoutingStateId: input.snapshot.attentionRoutingStateId,
    topologyId: input.snapshot.topologyId,
    focusStabilityScore: input.snapshot.state.focusStabilityScore,
    executiveAttentionRoutingLabel: input.snapshot.state.executiveAttentionRoutingLabel,
    routingAmbiguityDisclaimer: input.snapshot.state.routingAmbiguityDisclaimer,
    nonManipulationRoutingDisclaimer: input.snapshot.state.nonManipulationRoutingDisclaimer,
    attentionRoutes: Object.freeze(
      input.snapshot.state.activeAttentionRoutes.map((r) =>
        Object.freeze({
          routingId: r.routingId,
          routingState: r.routingState,
          routingStrength: r.routingStrength,
        })
      )
    ),
    priorityFlowSummaries: Object.freeze(
      input.snapshot.state.dynamicPriorityFlowRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive attention routing (read-only; never manipulates executive behavior).
 */
export function evaluateExecutiveAttentionRouting(
  input: EvaluateExecutiveAttentionRoutingInput
): EvaluateExecutiveAttentionRoutingResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.attentionRoutingContext?.tick) || 0);
  const attentionRoutingStateId = String(
    input.attentionRoutingStateId ?? `executive-attention-routing::${topology.topologyId}::${tick}`
  ).trim();

  const routingLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.attentionRoutingContext?.routingLeverageFactor ?? 0)
  );
  const fragmentationStressFactor = clamp01Stress(
    input.attentionRoutingContext?.fragmentationStressFactor ?? 0
  );

  logExecutiveAttentionRoutingDev("AttentionRouting", {
    attentionRoutingStateId,
    topologyId: topology.topologyId,
    tick,
    cognitiveLabel: input.cognitiveUxState.executiveCognitiveLabel,
    orchestrationLabel: input.orchestrationState.executiveOrchestrationLabel,
  });

  const activeAttentionRoutes = deriveExecutiveAttentionRoutingSignals({
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    routingLeverageFactor,
    fragmentationStressFactor,
  });

  const dynamicPriorityFlowRecords = analyzeDynamicPriorityFlow({
    routingSignals: activeAttentionRoutes,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    consensusState: input.consensusState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const focusStabilityScore = calculateFocusStabilityScore({
    routingSignals: activeAttentionRoutes,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
  });

  const strategicUrgencyScore = calculateStrategicUrgencyScore({
    flowRecords: dynamicPriorityFlowRecords,
  });

  const attentionFragmentationRecords = analyzeAttentionFragmentation({
    routingSignals: activeAttentionRoutes,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    explainabilityState: input.explainabilityState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
  });

  const attentionFragmentationScore = calculateAttentionFragmentationScore({
    routingSignals: activeAttentionRoutes,
    fragmentationRecords: attentionFragmentationRecords,
    cognitiveUxState: input.cognitiveUxState,
  });

  const executiveFocusOrchestrationRecords = analyzeExecutiveFocusOrchestration({
    routingSignals: activeAttentionRoutes,
    flowRecords: dynamicPriorityFlowRecords,
    fragmentationRecords: attentionFragmentationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildAttentionRoutingContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateExecutiveAttentionRouting({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    routingSignals: activeAttentionRoutes,
    priorAttentionRoutingFingerprints: input.priorAttentionRoutingFingerprints,
    pendingFingerprint,
    focusStabilityScore,
    attentionFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveAttentionRoutingLabel = classifyExecutiveAttentionRoutingLabel({
    focusStabilityScore,
    strategicUrgencyScore,
    attentionFragmentationScore,
    routingSignals: activeAttentionRoutes,
  });

  const state: ExecutiveAttentionRoutingState = Object.freeze({
    activeAttentionRoutes: Object.freeze(activeAttentionRoutes),
    dynamicPriorityFlowRecords,
    attentionFragmentationRecords,
    executiveFocusOrchestrationRecords,
    highPriorityAttentionZones: identifyHighPriorityAttentionZones(activeAttentionRoutes),
    fragmentedAttentionZones: identifyFragmentedAttentionZones(activeAttentionRoutes),
    focusStabilityScore,
    strategicUrgencyScore,
    attentionFragmentationScore,
    executiveAttentionRoutingLabel,
    routingAmbiguityDisclaimer: ROUTING_AMBIGUITY_DISCLAIMER,
    nonManipulationRoutingDisclaimer: NON_MANIPULATION_ROUTING_DISCLAIMER,
  });

  const semantics = buildExecutiveAttentionRoutingSemantics({ state });
  const semanticsGuard = guardAttentionRoutingExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    attentionRoutingStateId,
    executiveAttentionRoutingLabel,
    focusStabilityScore,
    strategicUrgencyScore,
  });

  const snapshot: ExecutiveAttentionRoutingSnapshot = Object.freeze({
    attentionRoutingStateId,
    topologyId: topology.topologyId,
    cognitiveUxStateId: `executive-cognitive-ux::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      routingSummaries: Object.freeze([...semantics.routingSummaries]),
      priorityFlowSummaries: Object.freeze([...semantics.priorityFlowSummaries]),
      fragmentationSummaries: Object.freeze([...semantics.fragmentationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: routingBuiltAt(tick),
  });

  const panelContract = buildExecutiveAttentionRoutingPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveAttentionRoutingSnapshot(
  snapshot: ExecutiveAttentionRoutingSnapshot
): ExecutiveAttentionRoutingSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeAttentionRoutes: Object.freeze(
        snapshot.state.activeAttentionRoutes.map((r) => Object.freeze({ ...r }))
      ),
      dynamicPriorityFlowRecords: Object.freeze(
        snapshot.state.dynamicPriorityFlowRecords.map((r) => Object.freeze({ ...r }))
      ),
      attentionFragmentationRecords: Object.freeze(
        snapshot.state.attentionFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveFocusOrchestrationRecords: Object.freeze(
        snapshot.state.executiveFocusOrchestrationRecords.map((r) => Object.freeze({ ...r }))
      ),
      highPriorityAttentionZones: Object.freeze([...snapshot.state.highPriorityAttentionZones]),
      fragmentedAttentionZones: Object.freeze([...snapshot.state.fragmentedAttentionZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
