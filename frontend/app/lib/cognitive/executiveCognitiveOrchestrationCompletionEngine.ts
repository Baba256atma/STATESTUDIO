/**
 * D7:6:10 — Executive cognitive orchestration completion engine (immutable, evidence-grounded).
 */

import type {
  EvaluateExecutiveCognitiveCompletionInput,
  EvaluateExecutiveCognitiveCompletionResult,
  ExecutiveCognitiveCompletionSnapshot,
  ExecutiveCognitiveCompletionIntelligenceState,
  ExecutiveCognitiveCompletionPanelContract,
} from "./executiveCognitiveCompletionTypes.ts";
import {
  COMPLETION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  buildCompletionContentFingerprint,
  guardEvaluateExecutiveCognitiveCompletion,
  guardExecutiveCognitiveCompletionSemantics,
} from "./cognitiveCompletionGuards.ts";
import {
  analyzeFullCognitiveSynchronization,
  calculateOverallCognitiveCoherenceScore,
  calculateFullCognitiveSyncScore,
  classifyExecutiveCompletionLabel,
  deriveExecutiveCognitiveCompletionSignals,
  identifyOrchestrationInstabilityZones,
  identifySynchronizedExecutiveZones,
} from "./fullCognitiveSynchronizationModel.ts";
import {
  analyzePlatformCoherence,
  calculatePlatformCoherenceDegradationScore,
} from "./platformCoherenceAnalysis.ts";
import { analyzeExecutiveCognitionCompletion } from "./executiveCognitionCompletionIntelligence.ts";
import { buildExecutiveCognitiveCompletionSemantics } from "./executiveCognitiveCompletionSemantics.ts";
import { logExecutiveCognitiveCompletionDev } from "./cognitiveCompletionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function completionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveCognitiveCompletionPanelContract(input: {
  snapshot: ExecutiveCognitiveCompletionSnapshot;
}): ExecutiveCognitiveCompletionPanelContract {
  const viewHint =
    input.snapshot.state.platformCoherenceRecords.length > 3
      ? "synchronized_cognition_timeline"
      : input.snapshot.state.fullCognitiveSynchronizationRecords.length > 4
        ? "platform_coherence_heatmap"
        : input.snapshot.state.executiveCompletionLabel === "critical"
          ? "complete_strategic_environment_panel"
          : input.snapshot.state.executiveCompletionLabel === "synchronized"
            ? "executive_orchestration_dashboard"
            : input.snapshot.state.activeCompletionSignals.length > 3
              ? "unified_cognition_overlay"
              : "unified_cognition_overlay";

  return Object.freeze({
    completionStateId: input.snapshot.completionStateId,
    topologyId: input.snapshot.topologyId,
    overallCognitiveCoherenceScore: input.snapshot.state.overallCognitiveCoherenceScore,
    executiveCompletionLabel: input.snapshot.state.executiveCompletionLabel,
    completionAmbiguityDisclaimer: input.snapshot.state.completionAmbiguityDisclaimer,
    nonAutonomousCompletionDisclaimer: input.snapshot.state.nonAutonomousCompletionDisclaimer,
    completionSignals: Object.freeze(
      input.snapshot.state.activeCompletionSignals.map((s) =>
        Object.freeze({
          completionId: s.completionId,
          completionState: s.completionState,
          completionStrength: s.completionStrength,
        })
      )
    ),
    syncSummaries: Object.freeze(
      input.snapshot.state.fullCognitiveSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive cognitive orchestration completion (read-only; never creates autonomous authority).
 */
export function evaluateExecutiveCognitiveCompletion(
  input: EvaluateExecutiveCognitiveCompletionInput
): EvaluateExecutiveCognitiveCompletionResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.completionContext?.tick) || 0);
  const completionStateId = String(
    input.completionStateId ??
      `executive-cognitive-completion::${topology.topologyId}::${tick}`
  ).trim();

  const completionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.completionContext?.completionLeverageFactor ?? 0)
  );
  const orchestrationStressFactor = clamp01Stress(
    input.completionContext?.orchestrationStressFactor ?? 0
  );

  logExecutiveCognitiveCompletionDev("CognitiveCompletion", {
    completionStateId,
    topologyId: topology.topologyId,
    tick,
    environmentLabel: input.environmentState.executiveEnvironmentLabel,
    presenceLabel: input.presenceState.executivePresenceLabel,
    orchestrationLabel: input.orchestrationState.executiveOrchestrationLabel,
  });

  const activeCompletionSignals = deriveExecutiveCognitiveCompletionSignals({
    environmentState: input.environmentState,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    insightPrioritizationState: input.insightPrioritizationState,
    attentionRoutingState: input.attentionRoutingState,
    cognitiveLoadState: input.cognitiveLoadState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    completionLeverageFactor,
    orchestrationStressFactor,
  });

  const fullCognitiveSynchronizationRecords = analyzeFullCognitiveSynchronization({
    completionSignals: activeCompletionSignals,
    environmentState: input.environmentState,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    attentionRoutingState: input.attentionRoutingState,
    cognitiveLoadState: input.cognitiveLoadState,
    cognitiveUxState: input.cognitiveUxState,
    foresightState: input.foresightState,
    governanceState: input.governanceState,
    orchestrationState: input.orchestrationState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const overallCognitiveCoherenceScore = calculateOverallCognitiveCoherenceScore({
    completionSignals: activeCompletionSignals,
    environmentState: input.environmentState,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    cognitiveUxState: input.cognitiveUxState,
  });

  const fullCognitiveSyncScore = calculateFullCognitiveSyncScore({
    syncRecords: fullCognitiveSynchronizationRecords,
  });

  const platformCoherenceRecords = analyzePlatformCoherence({
    completionSignals: activeCompletionSignals,
    environmentState: input.environmentState,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    insightPrioritizationState: input.insightPrioritizationState,
    cognitiveLoadState: input.cognitiveLoadState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
  });

  const platformCoherenceDegradationScore = calculatePlatformCoherenceDegradationScore({
    completionSignals: activeCompletionSignals,
    coherenceRecords: platformCoherenceRecords,
    environmentState: input.environmentState,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    cognitiveLoadState: input.cognitiveLoadState,
    orchestrationState: input.orchestrationState,
  });

  const executiveCognitionCompletionRecords = analyzeExecutiveCognitionCompletion({
    completionSignals: activeCompletionSignals,
    syncRecords: fullCognitiveSynchronizationRecords,
    coherenceRecords: platformCoherenceRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const environmentFingerprint = stableStringify({
    label: input.environmentState.executiveEnvironmentLabel,
    coherence: input.environmentState.environmentCoherenceScore,
  });
  const presenceFingerprint = stableStringify({
    label: input.presenceState.executivePresenceLabel,
    continuity: input.presenceState.situationalContinuityScore,
  });
  const immersionFingerprint = stableStringify({
    label: input.immersionState.executiveImmersionLabel,
    clarity: input.immersionState.immersionClarityScore,
  });
  const timelineFingerprint = stableStringify({
    label: input.timelineState.executiveTimelineLabel,
    clarity: input.timelineState.timelineClarityScore,
  });
  const narrativeFingerprint = stableStringify({
    label: input.narrativeState.executiveNarrativeLabel,
    clarity: input.narrativeState.narrativeClarityScore,
  });
  const insightPrioritizationFingerprint = stableStringify({
    label: input.insightPrioritizationState.executiveInsightPrioritizationLabel,
    insight: input.insightPrioritizationState.strategicInsightScore,
  });
  const attentionFingerprint = stableStringify({
    label: input.attentionRoutingState.executiveAttentionRoutingLabel,
    focus: input.attentionRoutingState.focusStabilityScore,
  });
  const cognitiveLoadFingerprint = stableStringify({
    label: input.cognitiveLoadState.executiveCognitiveLoadLabel,
    balance: input.cognitiveLoadState.cognitiveBalanceScore,
  });
  const cognitiveUxFingerprint = stableStringify({
    label: input.cognitiveUxState.executiveCognitiveLabel,
    clarity: input.cognitiveUxState.cognitiveClarityScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });

  const pendingFingerprint = buildCompletionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    environmentFingerprint,
    presenceFingerprint,
    immersionFingerprint,
    timelineFingerprint,
    narrativeFingerprint,
    insightPrioritizationFingerprint,
    attentionFingerprint,
    cognitiveLoadFingerprint,
    cognitiveUxFingerprint,
    foresightFingerprint,
    orchestrationFingerprint,
    governanceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveCognitiveCompletion({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    completionSignals: activeCompletionSignals,
    priorCompletionFingerprints: input.priorCompletionFingerprints,
    pendingFingerprint,
    overallCognitiveCoherenceScore,
    platformCoherenceDegradationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveCompletionLabel = classifyExecutiveCompletionLabel({
    overallCognitiveCoherenceScore,
    fullCognitiveSyncScore,
    platformCoherenceDegradationScore,
    completionSignals: activeCompletionSignals,
  });

  const state: ExecutiveCognitiveCompletionIntelligenceState = Object.freeze({
    activeCompletionSignals: Object.freeze(activeCompletionSignals),
    fullCognitiveSynchronizationRecords,
    platformCoherenceRecords,
    executiveCognitionCompletionRecords,
    synchronizedExecutiveZones: identifySynchronizedExecutiveZones(activeCompletionSignals),
    orchestrationInstabilityZones: identifyOrchestrationInstabilityZones(activeCompletionSignals),
    overallCognitiveCoherenceScore,
    fullCognitiveSyncScore,
    platformCoherenceDegradationScore,
    executiveCompletionLabel,
    completionAmbiguityDisclaimer: COMPLETION_AMBIGUITY_DISCLAIMER,
    nonAutonomousCompletionDisclaimer: NON_AUTONOMOUS_COMPLETION_DISCLAIMER,
  });

  const semantics = buildExecutiveCognitiveCompletionSemantics({ state });
  const semanticsGuard = guardExecutiveCognitiveCompletionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    completionStateId,
    executiveCompletionLabel,
    overallCognitiveCoherenceScore,
    fullCognitiveSyncScore,
  });

  const snapshot: ExecutiveCognitiveCompletionSnapshot = Object.freeze({
    completionStateId,
    topologyId: topology.topologyId,
    environmentStateId: `unified-executive-cognitive-environment::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      completionSummaries: Object.freeze([...semantics.completionSummaries]),
      syncSummaries: Object.freeze([...semantics.syncSummaries]),
      coherenceSummaries: Object.freeze([...semantics.coherenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: completionBuiltAt(tick),
  });

  const panelContract = buildExecutiveCognitiveCompletionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveCognitiveCompletionSnapshot(
  snapshot: ExecutiveCognitiveCompletionSnapshot
): ExecutiveCognitiveCompletionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCompletionSignals: Object.freeze(
        snapshot.state.activeCompletionSignals.map((s) => Object.freeze({ ...s }))
      ),
      fullCognitiveSynchronizationRecords: Object.freeze(
        snapshot.state.fullCognitiveSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      platformCoherenceRecords: Object.freeze(
        snapshot.state.platformCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveCognitionCompletionRecords: Object.freeze(
        snapshot.state.executiveCognitionCompletionRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedExecutiveZones: Object.freeze([...snapshot.state.synchronizedExecutiveZones]),
      orchestrationInstabilityZones: Object.freeze([
        ...snapshot.state.orchestrationInstabilityZones,
      ]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
