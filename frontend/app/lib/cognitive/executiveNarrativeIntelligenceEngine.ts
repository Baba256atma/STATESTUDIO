/**
 * D7:6:5 — Executive narrative intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateExecutiveNarrativesInput,
  EvaluateExecutiveNarrativesResult,
  ExecutiveNarrativeSnapshot,
  ExecutiveNarrativeIntelligenceState,
  ExecutiveNarrativePanelContract,
} from "./executiveNarrativeTypes.ts";
import {
  NARRATIVE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_NARRATIVE_DISCLAIMER,
  buildNarrativeContentFingerprint,
  guardEvaluateExecutiveNarratives,
  guardExecutiveNarrativeSemantics,
} from "./narrativeIntelligenceGuards.ts";
import {
  analyzeStrategicContext,
  calculateNarrativeClarityScore,
  calculateStrategicContextScore,
  classifyExecutiveNarrativeLabel,
  deriveExecutiveNarrativeSignals,
  identifyFragmentedNarrativeZones,
  identifyStrategicNarrativeZones,
} from "./strategicContextSynthesisModel.ts";
import {
  analyzeNarrativeCoherence,
  calculateNarrativeFragmentationScore,
} from "./narrativeCoherenceAnalysis.ts";
import { analyzeExecutiveUnderstanding } from "./executiveUnderstandingIntelligence.ts";
import { buildExecutiveNarrativeSemantics } from "./executiveNarrativeSemantics.ts";
import { logExecutiveNarrativeDev } from "./narrativeIntelligenceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function narrativeBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveNarrativePanelContract(input: {
  snapshot: ExecutiveNarrativeSnapshot;
}): ExecutiveNarrativePanelContract {
  const viewHint =
    input.snapshot.state.narrativeCoherenceRecords.length > 3
      ? "narrative_continuity_map"
      : input.snapshot.state.strategicContextRecords.length > 4
        ? "strategic_context_timeline"
        : input.snapshot.state.executiveNarrativeLabel === "critical"
          ? "operational_interpretation_panel"
          : input.snapshot.state.executiveNarrativeLabel === "fragmented"
            ? "executive_story_dashboard"
            : input.snapshot.state.activeNarratives.length > 3
              ? "narrative_overlay"
              : "narrative_overlay";

  return Object.freeze({
    narrativeStateId: input.snapshot.narrativeStateId,
    topologyId: input.snapshot.topologyId,
    narrativeClarityScore: input.snapshot.state.narrativeClarityScore,
    executiveNarrativeLabel: input.snapshot.state.executiveNarrativeLabel,
    narrativeAmbiguityDisclaimer: input.snapshot.state.narrativeAmbiguityDisclaimer,
    nonManipulationNarrativeDisclaimer: input.snapshot.state.nonManipulationNarrativeDisclaimer,
    narrativeSignals: Object.freeze(
      input.snapshot.state.activeNarratives.map((n) =>
        Object.freeze({
          narrativeId: n.narrativeId,
          narrativeState: n.narrativeState,
          narrativeStrength: n.narrativeStrength,
        })
      )
    ),
    contextSummaries: Object.freeze(
      input.snapshot.state.strategicContextRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive narratives (read-only; never fabricates unsupported narratives).
 */
export function evaluateExecutiveNarratives(
  input: EvaluateExecutiveNarrativesInput
): EvaluateExecutiveNarrativesResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.narrativeContext?.tick) || 0);
  const narrativeStateId = String(
    input.narrativeStateId ?? `executive-narrative::${topology.topologyId}::${tick}`
  ).trim();

  const narrativeLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.narrativeContext?.narrativeLeverageFactor ?? 0)
  );
  const coherenceStressFactor = clamp01Stress(input.narrativeContext?.coherenceStressFactor ?? 0);

  logExecutiveNarrativeDev("Narrative", {
    narrativeStateId,
    topologyId: topology.topologyId,
    tick,
    insightLabel: input.insightPrioritizationState.executiveInsightPrioritizationLabel,
    explainabilityLabel: input.explainabilityState.executiveExplainabilityLabel,
  });

  const activeNarratives = deriveExecutiveNarrativeSignals({
    insightPrioritizationState: input.insightPrioritizationState,
    cognitiveLoadState: input.cognitiveLoadState,
    advisoryState: input.advisoryState,
    explainabilityState: input.explainabilityState,
    governanceState: input.governanceState,
    orchestrationState: input.orchestrationState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    narrativeLeverageFactor,
    coherenceStressFactor,
  });

  const strategicContextRecords = analyzeStrategicContext({
    narrativeSignals: activeNarratives,
    insightPrioritizationState: input.insightPrioritizationState,
    cognitiveLoadState: input.cognitiveLoadState,
    advisoryState: input.advisoryState,
    explainabilityState: input.explainabilityState,
    governanceState: input.governanceState,
    orchestrationState: input.orchestrationState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const narrativeClarityScore = calculateNarrativeClarityScore({
    narrativeSignals: activeNarratives,
    explainabilityState: input.explainabilityState,
    advisoryState: input.advisoryState,
  });

  const strategicContextScore = calculateStrategicContextScore({
    contextRecords: strategicContextRecords,
  });

  const narrativeCoherenceRecords = analyzeNarrativeCoherence({
    narrativeSignals: activeNarratives,
    insightPrioritizationState: input.insightPrioritizationState,
    cognitiveLoadState: input.cognitiveLoadState,
    explainabilityState: input.explainabilityState,
    governanceState: input.governanceState,
    orchestrationState: input.orchestrationState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const narrativeFragmentationScore = calculateNarrativeFragmentationScore({
    narrativeSignals: activeNarratives,
    coherenceRecords: narrativeCoherenceRecords,
    cognitiveLoadState: input.cognitiveLoadState,
  });

  const executiveUnderstandingRecords = analyzeExecutiveUnderstanding({
    narrativeSignals: activeNarratives,
    contextRecords: strategicContextRecords,
    coherenceRecords: narrativeCoherenceRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const insightPrioritizationFingerprint = stableStringify({
    label: input.insightPrioritizationState.executiveInsightPrioritizationLabel,
    insight: input.insightPrioritizationState.strategicInsightScore,
  });
  const explainabilityFingerprint = stableStringify({
    label: input.explainabilityState.executiveExplainabilityLabel,
    clarity: input.explainabilityState.explanationClarityScore,
  });
  const advisoryFingerprint = stableStringify({
    label: input.advisoryState.executiveAdvisoryLabel,
    clarity: input.advisoryState.advisoryClarityScore,
  });
  const cognitiveLoadFingerprint = stableStringify({
    label: input.cognitiveLoadState.executiveCognitiveLoadLabel,
    balance: input.cognitiveLoadState.cognitiveBalanceScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });

  const pendingFingerprint = buildNarrativeContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    insightPrioritizationFingerprint,
    explainabilityFingerprint,
    advisoryFingerprint,
    cognitiveLoadFingerprint,
    orchestrationFingerprint,
    governanceFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveNarratives({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    narrativeSignals: activeNarratives,
    priorNarrativeFingerprints: input.priorNarrativeFingerprints,
    pendingFingerprint,
    narrativeClarityScore,
    narrativeFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveNarrativeLabel = classifyExecutiveNarrativeLabel({
    narrativeClarityScore,
    strategicContextScore,
    narrativeFragmentationScore,
    narrativeSignals: activeNarratives,
  });

  const state: ExecutiveNarrativeIntelligenceState = Object.freeze({
    activeNarratives: Object.freeze(activeNarratives),
    strategicContextRecords,
    narrativeCoherenceRecords,
    executiveUnderstandingRecords,
    strategicNarrativeZones: identifyStrategicNarrativeZones(activeNarratives),
    fragmentedNarrativeZones: identifyFragmentedNarrativeZones(activeNarratives),
    narrativeClarityScore,
    strategicContextScore,
    narrativeFragmentationScore,
    executiveNarrativeLabel,
    narrativeAmbiguityDisclaimer: NARRATIVE_AMBIGUITY_DISCLAIMER,
    nonManipulationNarrativeDisclaimer: NON_MANIPULATION_NARRATIVE_DISCLAIMER,
  });

  const semantics = buildExecutiveNarrativeSemantics({ state });
  const semanticsGuard = guardExecutiveNarrativeSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    narrativeStateId,
    executiveNarrativeLabel,
    narrativeClarityScore,
    strategicContextScore,
  });

  const snapshot: ExecutiveNarrativeSnapshot = Object.freeze({
    narrativeStateId,
    topologyId: topology.topologyId,
    insightPrioritizationStateId: `executive-insight-prioritization::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      narrativeSummaries: Object.freeze([...semantics.narrativeSummaries]),
      contextSummaries: Object.freeze([...semantics.contextSummaries]),
      coherenceSummaries: Object.freeze([...semantics.coherenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: narrativeBuiltAt(tick),
  });

  const panelContract = buildExecutiveNarrativePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveNarrativeSnapshot(
  snapshot: ExecutiveNarrativeSnapshot
): ExecutiveNarrativeSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeNarratives: Object.freeze(
        snapshot.state.activeNarratives.map((n) => Object.freeze({ ...n }))
      ),
      strategicContextRecords: Object.freeze(
        snapshot.state.strategicContextRecords.map((r) => Object.freeze({ ...r }))
      ),
      narrativeCoherenceRecords: Object.freeze(
        snapshot.state.narrativeCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveUnderstandingRecords: Object.freeze(
        snapshot.state.executiveUnderstandingRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicNarrativeZones: Object.freeze([...snapshot.state.strategicNarrativeZones]),
      fragmentedNarrativeZones: Object.freeze([...snapshot.state.fragmentedNarrativeZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
