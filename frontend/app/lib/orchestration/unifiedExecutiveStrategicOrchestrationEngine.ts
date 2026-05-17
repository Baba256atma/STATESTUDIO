/**
 * D7:5:10 — Unified executive strategic orchestration engine (immutable, non-autonomous).
 */

import type {
  EvaluateUnifiedExecutiveOrchestrationInput,
  EvaluateUnifiedExecutiveOrchestrationResult,
  UnifiedExecutiveOrchestrationSnapshot,
  UnifiedExecutiveOrchestrationState,
  UnifiedOrchestrationPanelContract,
} from "./unifiedExecutiveOrchestrationTypes.ts";
import {
  ORCHESTRATION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER,
  buildOrchestrationContentFingerprint,
  guardEvaluateUnifiedExecutiveOrchestration,
  guardOrchestrationExecutiveSemantics,
} from "./orchestrationGuards.ts";
import {
  analyzeCrossIntelligenceSynchronization,
  calculateCrossSystemSynchronizationScore,
  calculateOrchestrationCoherenceScore,
  calculateOrchestrationInstabilityScore,
  classifyExecutiveOrchestrationLabel,
  deriveUnifiedExecutiveOrchestrationSignals,
  identifyOrchestrationFragilityZones,
  identifySynchronizedIntelligenceZones,
} from "./crossIntelligenceSynchronizationModel.ts";
import { analyzeOrchestrationStability } from "./orchestrationStabilityAnalysis.ts";
import { analyzeUnifiedExecutiveCognition } from "./unifiedExecutiveCognitionIntelligence.ts";
import { buildUnifiedExecutiveOrchestrationSemantics } from "./unifiedExecutiveOrchestrationSemantics.ts";
import { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function orchestrationBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildUnifiedOrchestrationPanelContract(input: {
  snapshot: UnifiedExecutiveOrchestrationSnapshot;
}): UnifiedOrchestrationPanelContract {
  const viewHint =
    input.snapshot.state.orchestrationStabilityRecords.length > 3
      ? "orchestration_stability_timeline"
      : input.snapshot.state.crossIntelligenceSynchronizationRecords.length > 4
        ? "cross_intelligence_sync_map"
        : input.snapshot.state.executiveOrchestrationLabel === "critical"
          ? "unified_strategic_panel"
          : input.snapshot.state.executiveOrchestrationLabel === "volatile"
            ? "executive_cognition_dashboard"
            : input.snapshot.state.activeOrchestrationSignals.length > 3
              ? "orchestration_overlay"
              : "orchestration_overlay";

  return Object.freeze({
    orchestrationStateId: input.snapshot.orchestrationStateId,
    topologyId: input.snapshot.topologyId,
    orchestrationCoherenceScore: input.snapshot.state.orchestrationCoherenceScore,
    executiveOrchestrationLabel: input.snapshot.state.executiveOrchestrationLabel,
    orchestrationAmbiguityDisclaimer: input.snapshot.state.orchestrationAmbiguityDisclaimer,
    nonAutonomousAuthorityDisclaimer: input.snapshot.state.nonAutonomousAuthorityDisclaimer,
    orchestrationSignals: Object.freeze(
      input.snapshot.state.activeOrchestrationSignals.map((o) =>
        Object.freeze({
          orchestrationId: o.orchestrationId,
          orchestrationState: o.orchestrationState,
          orchestrationStrength: o.orchestrationStrength,
        })
      )
    ),
    synchronizationSummaries: Object.freeze(
      input.snapshot.state.crossIntelligenceSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate unified executive orchestration (read-only; never autonomously executes strategic actions).
 */
export function evaluateUnifiedExecutiveOrchestration(
  input: EvaluateUnifiedExecutiveOrchestrationInput
): EvaluateUnifiedExecutiveOrchestrationResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.orchestrationContext?.tick) || 0);
  const orchestrationStateId = String(
    input.orchestrationStateId ?? `unified-orchestration::${topology.topologyId}::${tick}`
  ).trim();

  const orchestrationLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.orchestrationContext?.orchestrationLeverageFactor ?? 0)
  );
  const instabilityStressFactor = clamp01Stress(
    input.orchestrationContext?.instabilityStressFactor ?? 0
  );

  logUnifiedExecutiveOrchestrationDev("Orchestration", {
    orchestrationStateId,
    topologyId: topology.topologyId,
    tick,
    consensusLabel: input.consensusState.executiveConsensusLabel,
    advisoryLabel: input.advisoryState.executiveAdvisoryLabel,
  });

  const activeOrchestrationSignals = deriveUnifiedExecutiveOrchestrationSignals({
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    orchestrationLeverageFactor,
    instabilityStressFactor,
  });

  const crossIntelligenceSynchronizationRecords = analyzeCrossIntelligenceSynchronization({
    orchestrationSignals: activeOrchestrationSignals,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    foresightState: input.foresightState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    explainabilityState: input.explainabilityState,
    divergenceState: input.divergenceState,
  });

  const orchestrationCoherenceScore = calculateOrchestrationCoherenceScore({
    orchestrationSignals: activeOrchestrationSignals,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
  });

  const crossSystemSynchronizationScore = calculateCrossSystemSynchronizationScore({
    synchronizationRecords: crossIntelligenceSynchronizationRecords,
  });

  const orchestrationInstabilityScore = calculateOrchestrationInstabilityScore({
    orchestrationSignals: activeOrchestrationSignals,
    consensusState: input.consensusState,
    comparisonState: input.comparisonState,
    memoryState: input.memoryState,
    explainabilityState: input.explainabilityState,
  });

  const orchestrationStabilityRecords = analyzeOrchestrationStability({
    orchestrationSignals: activeOrchestrationSignals,
    consensusState: input.consensusState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    comparisonState: input.comparisonState,
    explainabilityState: input.explainabilityState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const unifiedExecutiveCognitionRecords = analyzeUnifiedExecutiveCognition({
    orchestrationSignals: activeOrchestrationSignals,
    synchronizationRecords: crossIntelligenceSynchronizationRecords,
    stabilityRecords: orchestrationStabilityRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildOrchestrationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    consensusFingerprint,
    advisoryFingerprint,
    explainabilityFingerprint,
    governanceFingerprint,
    memoryFingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateUnifiedExecutiveOrchestration({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    orchestrationSignals: activeOrchestrationSignals,
    priorOrchestrationFingerprints: input.priorOrchestrationFingerprints,
    pendingFingerprint,
    orchestrationCoherenceScore,
    orchestrationInstabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveOrchestrationLabel = classifyExecutiveOrchestrationLabel({
    orchestrationCoherenceScore,
    crossSystemSynchronizationScore,
    orchestrationInstabilityScore,
    orchestrationSignals: activeOrchestrationSignals,
  });

  const state: UnifiedExecutiveOrchestrationState = Object.freeze({
    activeOrchestrationSignals: Object.freeze(activeOrchestrationSignals),
    crossIntelligenceSynchronizationRecords,
    orchestrationStabilityRecords,
    unifiedExecutiveCognitionRecords,
    synchronizedIntelligenceZones: identifySynchronizedIntelligenceZones(activeOrchestrationSignals),
    orchestrationFragilityZones: identifyOrchestrationFragilityZones(activeOrchestrationSignals),
    orchestrationCoherenceScore,
    crossSystemSynchronizationScore,
    orchestrationInstabilityScore,
    executiveOrchestrationLabel,
    orchestrationAmbiguityDisclaimer: ORCHESTRATION_AMBIGUITY_DISCLAIMER,
    nonAutonomousAuthorityDisclaimer: NON_AUTONOMOUS_ORCHESTRATION_DISCLAIMER,
  });

  const semantics = buildUnifiedExecutiveOrchestrationSemantics({ state });
  const semanticsGuard = guardOrchestrationExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    orchestrationStateId,
    executiveOrchestrationLabel,
    orchestrationCoherenceScore,
    crossSystemSynchronizationScore,
  });

  const snapshot: UnifiedExecutiveOrchestrationSnapshot = Object.freeze({
    orchestrationStateId,
    topologyId: topology.topologyId,
    consensusStateId: `strategic-consensus::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      orchestrationSummaries: Object.freeze([...semantics.orchestrationSummaries]),
      synchronizationSummaries: Object.freeze([...semantics.synchronizationSummaries]),
      instabilitySummaries: Object.freeze([...semantics.instabilitySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: orchestrationBuiltAt(tick),
  });

  const panelContract = buildUnifiedOrchestrationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeUnifiedExecutiveOrchestrationSnapshot(
  snapshot: UnifiedExecutiveOrchestrationSnapshot
): UnifiedExecutiveOrchestrationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeOrchestrationSignals: Object.freeze(
        snapshot.state.activeOrchestrationSignals.map((o) => Object.freeze({ ...o }))
      ),
      crossIntelligenceSynchronizationRecords: Object.freeze(
        snapshot.state.crossIntelligenceSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      orchestrationStabilityRecords: Object.freeze(
        snapshot.state.orchestrationStabilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      unifiedExecutiveCognitionRecords: Object.freeze(
        snapshot.state.unifiedExecutiveCognitionRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedIntelligenceZones: Object.freeze([...snapshot.state.synchronizedIntelligenceZones]),
      orchestrationFragilityZones: Object.freeze([...snapshot.state.orchestrationFragilityZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
