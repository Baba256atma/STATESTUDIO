/**
 * D7:6:1 — Executive cognitive UX orchestration engine (immutable, non-manipulative).
 */

import type {
  EvaluateExecutiveCognitiveUxInput,
  EvaluateExecutiveCognitiveUxResult,
  ExecutiveCognitiveUxPanelContract,
  ExecutiveCognitiveUxSnapshot,
  ExecutiveCognitiveUxState,
} from "./executiveCognitiveUxTypes.ts";
import {
  COGNITIVE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_UX_DISCLAIMER,
  buildCognitiveUxContentFingerprint,
  guardEvaluateExecutiveCognitiveUx,
  guardCognitiveUxExecutiveSemantics,
} from "./cognitiveUxGuards.ts";
import {
  analyzeAttentionPriority,
  calculateAttentionPriorityScore,
  calculateCognitiveClarityScore,
  classifyExecutiveCognitiveLabel,
  deriveExecutiveCognitiveSignals,
  identifyAttentionPriorityZones,
  identifyCognitiveOverloadZones,
} from "./attentionPriorityModel.ts";
import { analyzeCognitiveLoad, calculateCognitiveLoadScore } from "./cognitiveLoadAnalysis.ts";
import { analyzeExecutiveInteraction } from "./executiveInteractionIntelligence.ts";
import { buildExecutiveCognitiveUxSemantics } from "./executiveCognitiveUxSemantics.ts";
import { logExecutiveCognitiveUxDev } from "./cognitiveUxDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function cognitiveUxBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveCognitiveUxPanelContract(input: {
  snapshot: ExecutiveCognitiveUxSnapshot;
}): ExecutiveCognitiveUxPanelContract {
  const viewHint =
    input.snapshot.state.cognitiveLoadRecords.length > 3
      ? "cognitive_load_heatmap"
      : input.snapshot.state.attentionPriorityRecords.length > 4
        ? "attention_priority_dashboard"
        : input.snapshot.state.executiveCognitiveLabel === "critical"
          ? "operational_clarity_panel"
          : input.snapshot.state.executiveCognitiveLabel === "overloaded"
            ? "strategic_focus_timeline"
            : input.snapshot.state.activeCognitiveSignals.length > 3
              ? "executive_cognition_overlay"
              : "executive_cognition_overlay";

  return Object.freeze({
    cognitiveUxStateId: input.snapshot.cognitiveUxStateId,
    topologyId: input.snapshot.topologyId,
    cognitiveClarityScore: input.snapshot.state.cognitiveClarityScore,
    executiveCognitiveLabel: input.snapshot.state.executiveCognitiveLabel,
    cognitiveAmbiguityDisclaimer: input.snapshot.state.cognitiveAmbiguityDisclaimer,
    nonManipulationDisclaimer: input.snapshot.state.nonManipulationDisclaimer,
    cognitiveSignals: Object.freeze(
      input.snapshot.state.activeCognitiveSignals.map((s) =>
        Object.freeze({
          signalId: s.signalId,
          cognitiveState: s.cognitiveState,
          cognitiveStrength: s.cognitiveStrength,
        })
      )
    ),
    attentionSummaries: Object.freeze(
      input.snapshot.state.attentionPriorityRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive cognitive UX (read-only; never manipulates executive behavior).
 */
export function evaluateExecutiveCognitiveUx(
  input: EvaluateExecutiveCognitiveUxInput
): EvaluateExecutiveCognitiveUxResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.cognitiveUxContext?.tick) || 0);
  const cognitiveUxStateId = String(
    input.cognitiveUxStateId ?? `executive-cognitive-ux::${topology.topologyId}::${tick}`
  ).trim();

  const cognitiveLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.cognitiveUxContext?.cognitiveLeverageFactor ?? 0)
  );
  const overloadStressFactor = clamp01Stress(input.cognitiveUxContext?.overloadStressFactor ?? 0);

  logExecutiveCognitiveUxDev("CognitiveUX", {
    cognitiveUxStateId,
    topologyId: topology.topologyId,
    tick,
    orchestrationLabel: input.orchestrationState.executiveOrchestrationLabel,
    advisoryLabel: input.advisoryState.executiveAdvisoryLabel,
  });

  const activeCognitiveSignals = deriveExecutiveCognitiveSignals({
    orchestrationState: input.orchestrationState,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    cognitiveLeverageFactor,
    overloadStressFactor,
  });

  const attentionPriorityRecords = analyzeAttentionPriority({
    cognitiveSignals: activeCognitiveSignals,
    orchestrationState: input.orchestrationState,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    cascadeState: input.cascadeState,
  });

  const cognitiveClarityScore = calculateCognitiveClarityScore({
    cognitiveSignals: activeCognitiveSignals,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    explainabilityState: input.explainabilityState,
  });

  const attentionPriorityScore = calculateAttentionPriorityScore({
    attentionRecords: attentionPriorityRecords,
  });

  const cognitiveLoadRecords = analyzeCognitiveLoad({
    cognitiveSignals: activeCognitiveSignals,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    explainabilityState: input.explainabilityState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const cognitiveLoadScore = calculateCognitiveLoadScore({
    cognitiveSignals: activeCognitiveSignals,
    loadRecords: cognitiveLoadRecords,
    orchestrationState: input.orchestrationState,
  });

  const executiveInteractionRecords = analyzeExecutiveInteraction({
    cognitiveSignals: activeCognitiveSignals,
    attentionRecords: attentionPriorityRecords,
    loadRecords: cognitiveLoadRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildCognitiveUxContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    orchestrationFingerprint,
    consensusFingerprint,
    advisoryFingerprint,
    explainabilityFingerprint,
    governanceFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveCognitiveUx({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    cognitiveSignals: activeCognitiveSignals,
    priorCognitiveUxFingerprints: input.priorCognitiveUxFingerprints,
    pendingFingerprint,
    cognitiveClarityScore,
    cognitiveLoadScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveCognitiveLabel = classifyExecutiveCognitiveLabel({
    cognitiveClarityScore,
    cognitiveLoadScore,
    attentionPriorityScore,
    cognitiveSignals: activeCognitiveSignals,
  });

  const state: ExecutiveCognitiveUxState = Object.freeze({
    activeCognitiveSignals: Object.freeze(activeCognitiveSignals),
    attentionPriorityRecords,
    cognitiveLoadRecords,
    executiveInteractionRecords,
    attentionPriorityZones: identifyAttentionPriorityZones(activeCognitiveSignals),
    cognitiveOverloadZones: identifyCognitiveOverloadZones(activeCognitiveSignals),
    cognitiveClarityScore,
    attentionPriorityScore,
    cognitiveLoadScore,
    executiveCognitiveLabel,
    cognitiveAmbiguityDisclaimer: COGNITIVE_AMBIGUITY_DISCLAIMER,
    nonManipulationDisclaimer: NON_MANIPULATION_UX_DISCLAIMER,
  });

  const semantics = buildExecutiveCognitiveUxSemantics({ state });
  const semanticsGuard = guardCognitiveUxExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    cognitiveUxStateId,
    executiveCognitiveLabel,
    cognitiveClarityScore,
    cognitiveLoadScore,
  });

  const snapshot: ExecutiveCognitiveUxSnapshot = Object.freeze({
    cognitiveUxStateId,
    topologyId: topology.topologyId,
    orchestrationStateId: `unified-orchestration::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      cognitiveSummaries: Object.freeze([...semantics.cognitiveSummaries]),
      attentionSummaries: Object.freeze([...semantics.attentionSummaries]),
      loadSummaries: Object.freeze([...semantics.loadSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: cognitiveUxBuiltAt(tick),
  });

  const panelContract = buildExecutiveCognitiveUxPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveCognitiveUxSnapshot(
  snapshot: ExecutiveCognitiveUxSnapshot
): ExecutiveCognitiveUxSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCognitiveSignals: Object.freeze(
        snapshot.state.activeCognitiveSignals.map((s) => Object.freeze({ ...s }))
      ),
      attentionPriorityRecords: Object.freeze(
        snapshot.state.attentionPriorityRecords.map((r) => Object.freeze({ ...r }))
      ),
      cognitiveLoadRecords: Object.freeze(
        snapshot.state.cognitiveLoadRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveInteractionRecords: Object.freeze(
        snapshot.state.executiveInteractionRecords.map((r) => Object.freeze({ ...r }))
      ),
      attentionPriorityZones: Object.freeze([...snapshot.state.attentionPriorityZones]),
      cognitiveOverloadZones: Object.freeze([...snapshot.state.cognitiveOverloadZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
