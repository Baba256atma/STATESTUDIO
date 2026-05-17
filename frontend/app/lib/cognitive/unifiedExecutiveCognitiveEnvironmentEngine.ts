/**
 * D7:6:9 — Unified executive cognitive environment intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateUnifiedExecutiveEnvironmentInput,
  EvaluateUnifiedExecutiveEnvironmentResult,
  UnifiedExecutiveCognitiveEnvironmentSnapshot,
  UnifiedExecutiveCognitiveEnvironmentIntelligenceState,
  UnifiedExecutiveCognitiveEnvironmentPanelContract,
} from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import {
  ENVIRONMENT_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_ENVIRONMENT_DISCLAIMER,
  buildEnvironmentContentFingerprint,
  guardEvaluateUnifiedExecutiveEnvironment,
  guardUnifiedExecutiveCognitiveEnvironmentSemantics,
} from "./cognitiveEnvironmentGuards.ts";
import {
  analyzeCrossCognitiveSynchronization,
  calculateEnvironmentCoherenceScore,
  calculateCrossCognitiveSyncScore,
  classifyExecutiveEnvironmentLabel,
  deriveUnifiedExecutiveEnvironmentSignals,
  identifyFragmentedEnvironmentZones,
  identifySynchronizedCognitionZones,
} from "./crossCognitiveSynchronizationModel.ts";
import {
  analyzeCognitiveEnvironmentFragmentation,
  calculateEnvironmentFragmentationScore,
} from "./cognitiveEnvironmentFragmentationAnalysis.ts";
import { analyzeExecutiveEnvironmentContinuity } from "./executiveEnvironmentContinuityIntelligence.ts";
import { buildUnifiedExecutiveCognitiveEnvironmentSemantics } from "./unifiedExecutiveCognitiveEnvironmentSemantics.ts";
import { logUnifiedExecutiveCognitiveEnvironmentDev } from "./cognitiveEnvironmentDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function environmentBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildUnifiedExecutiveCognitiveEnvironmentPanelContract(input: {
  snapshot: UnifiedExecutiveCognitiveEnvironmentSnapshot;
}): UnifiedExecutiveCognitiveEnvironmentPanelContract {
  const viewHint =
    input.snapshot.state.cognitiveEnvironmentFragmentationRecords.length > 3
      ? "synchronized_cognition_timeline"
      : input.snapshot.state.crossCognitiveSynchronizationRecords.length > 4
        ? "continuity_heatmap"
        : input.snapshot.state.executiveEnvironmentLabel === "critical"
          ? "unified_strategic_panel"
          : input.snapshot.state.executiveEnvironmentLabel === "synchronized"
            ? "executive_environment_dashboard"
            : input.snapshot.state.activeEnvironmentSignals.length > 3
              ? "unified_cognition_overlay"
              : "unified_cognition_overlay";

  return Object.freeze({
    environmentStateId: input.snapshot.environmentStateId,
    topologyId: input.snapshot.topologyId,
    environmentCoherenceScore: input.snapshot.state.environmentCoherenceScore,
    executiveEnvironmentLabel: input.snapshot.state.executiveEnvironmentLabel,
    environmentAmbiguityDisclaimer: input.snapshot.state.environmentAmbiguityDisclaimer,
    nonManipulationEnvironmentDisclaimer:
      input.snapshot.state.nonManipulationEnvironmentDisclaimer,
    environmentSignals: Object.freeze(
      input.snapshot.state.activeEnvironmentSignals.map((s) =>
        Object.freeze({
          environmentId: s.environmentId,
          environmentState: s.environmentState,
          environmentStrength: s.environmentStrength,
        })
      )
    ),
    syncSummaries: Object.freeze(
      input.snapshot.state.crossCognitiveSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate unified executive cognitive environment (read-only; never manipulates executive psychology).
 */
export function evaluateUnifiedExecutiveEnvironment(
  input: EvaluateUnifiedExecutiveEnvironmentInput
): EvaluateUnifiedExecutiveEnvironmentResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.environmentContext?.tick) || 0);
  const environmentStateId = String(
    input.environmentStateId ??
      `unified-executive-cognitive-environment::${topology.topologyId}::${tick}`
  ).trim();

  const environmentLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.environmentContext?.environmentLeverageFactor ?? 0)
  );
  const syncStressFactor = clamp01Stress(input.environmentContext?.syncStressFactor ?? 0);

  logUnifiedExecutiveCognitiveEnvironmentDev("UnifiedEnvironment", {
    environmentStateId,
    topologyId: topology.topologyId,
    tick,
    presenceLabel: input.presenceState.executivePresenceLabel,
    immersionLabel: input.immersionState.executiveImmersionLabel,
    timelineLabel: input.timelineState.executiveTimelineLabel,
  });

  const activeEnvironmentSignals = deriveUnifiedExecutiveEnvironmentSignals({
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
    environmentLeverageFactor,
    syncStressFactor,
  });

  const crossCognitiveSynchronizationRecords = analyzeCrossCognitiveSynchronization({
    environmentSignals: activeEnvironmentSignals,
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

  const environmentCoherenceScore = calculateEnvironmentCoherenceScore({
    environmentSignals: activeEnvironmentSignals,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    cognitiveUxState: input.cognitiveUxState,
  });

  const crossCognitiveSyncScore = calculateCrossCognitiveSyncScore({
    syncRecords: crossCognitiveSynchronizationRecords,
  });

  const cognitiveEnvironmentFragmentationRecords = analyzeCognitiveEnvironmentFragmentation({
    environmentSignals: activeEnvironmentSignals,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    cognitiveLoadState: input.cognitiveLoadState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
  });

  const environmentFragmentationScore = calculateEnvironmentFragmentationScore({
    environmentSignals: activeEnvironmentSignals,
    fragmentationRecords: cognitiveEnvironmentFragmentationRecords,
    presenceState: input.presenceState,
    immersionState: input.immersionState,
    cognitiveLoadState: input.cognitiveLoadState,
  });

  const executiveEnvironmentContinuityRecords = analyzeExecutiveEnvironmentContinuity({
    environmentSignals: activeEnvironmentSignals,
    syncRecords: crossCognitiveSynchronizationRecords,
    fragmentationRecords: cognitiveEnvironmentFragmentationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildEnvironmentContentFingerprint({
    topologyFingerprint: topology.fingerprint,
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

  const guard = guardEvaluateUnifiedExecutiveEnvironment({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    environmentSignals: activeEnvironmentSignals,
    priorEnvironmentFingerprints: input.priorEnvironmentFingerprints,
    pendingFingerprint,
    environmentCoherenceScore,
    environmentFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveEnvironmentLabel = classifyExecutiveEnvironmentLabel({
    environmentCoherenceScore,
    crossCognitiveSyncScore,
    environmentFragmentationScore,
    environmentSignals: activeEnvironmentSignals,
  });

  const state: UnifiedExecutiveCognitiveEnvironmentIntelligenceState = Object.freeze({
    activeEnvironmentSignals: Object.freeze(activeEnvironmentSignals),
    crossCognitiveSynchronizationRecords,
    cognitiveEnvironmentFragmentationRecords,
    executiveEnvironmentContinuityRecords,
    synchronizedCognitionZones: identifySynchronizedCognitionZones(activeEnvironmentSignals),
    fragmentedEnvironmentZones: identifyFragmentedEnvironmentZones(activeEnvironmentSignals),
    environmentCoherenceScore,
    crossCognitiveSyncScore,
    environmentFragmentationScore,
    executiveEnvironmentLabel,
    environmentAmbiguityDisclaimer: ENVIRONMENT_AMBIGUITY_DISCLAIMER,
    nonManipulationEnvironmentDisclaimer: NON_MANIPULATION_ENVIRONMENT_DISCLAIMER,
  });

  const semantics = buildUnifiedExecutiveCognitiveEnvironmentSemantics({ state });
  const semanticsGuard = guardUnifiedExecutiveCognitiveEnvironmentSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    environmentStateId,
    executiveEnvironmentLabel,
    environmentCoherenceScore,
    crossCognitiveSyncScore,
  });

  const snapshot: UnifiedExecutiveCognitiveEnvironmentSnapshot = Object.freeze({
    environmentStateId,
    topologyId: topology.topologyId,
    presenceStateId: `executive-strategic-presence::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      environmentSummaries: Object.freeze([...semantics.environmentSummaries]),
      syncSummaries: Object.freeze([...semantics.syncSummaries]),
      fragmentationSummaries: Object.freeze([...semantics.fragmentationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: environmentBuiltAt(tick),
  });

  const panelContract = buildUnifiedExecutiveCognitiveEnvironmentPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeUnifiedExecutiveCognitiveEnvironmentSnapshot(
  snapshot: UnifiedExecutiveCognitiveEnvironmentSnapshot
): UnifiedExecutiveCognitiveEnvironmentSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEnvironmentSignals: Object.freeze(
        snapshot.state.activeEnvironmentSignals.map((s) => Object.freeze({ ...s }))
      ),
      crossCognitiveSynchronizationRecords: Object.freeze(
        snapshot.state.crossCognitiveSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      cognitiveEnvironmentFragmentationRecords: Object.freeze(
        snapshot.state.cognitiveEnvironmentFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveEnvironmentContinuityRecords: Object.freeze(
        snapshot.state.executiveEnvironmentContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedCognitionZones: Object.freeze([...snapshot.state.synchronizedCognitionZones]),
      fragmentedEnvironmentZones: Object.freeze([...snapshot.state.fragmentedEnvironmentZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
