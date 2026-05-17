/**
 * D7:5:9 — Executive strategic consensus engine (immutable, non-manipulative).
 */

import type {
  EvaluateStrategicConsensusInput,
  EvaluateStrategicConsensusResult,
  ExecutiveStrategicConsensusSnapshot,
  ExecutiveStrategicConsensusState,
  StrategicConsensusPanelContract,
} from "./executiveConsensusTypes.ts";
import {
  CONSENSUS_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_DISCLAIMER,
  buildConsensusContentFingerprint,
  guardEvaluateStrategicConsensus,
  guardConsensusExecutiveSemantics,
} from "./consensusGuards.ts";
import {
  analyzeExecutiveAlignment,
  calculateExecutiveCoherenceScore,
  calculateFragmentationEscalationScore,
  calculateStrategicAlignmentScore,
  classifyExecutiveConsensusLabel,
  deriveExecutiveConsensusSignals,
  identifyConsensusStabilityZones,
  identifyFragmentationZones,
} from "./executiveAlignmentModel.ts";
import { analyzeConsensusFragmentation } from "./consensusFragmentationAnalysis.ts";
import { analyzeStrategicCoherence } from "./strategicCoherenceIntelligence.ts";
import { buildExecutiveStrategicConsensusSemantics } from "./executiveStrategicConsensusSemantics.ts";
import { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function consensusBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicConsensusPanelContract(input: {
  snapshot: ExecutiveStrategicConsensusSnapshot;
}): StrategicConsensusPanelContract {
  const viewHint =
    input.snapshot.state.consensusFragmentationRecords.length > 3
      ? "fragmentation_heatmap"
      : input.snapshot.state.executiveAlignmentRecords.length > 3
        ? "executive_alignment_dashboard"
        : input.snapshot.state.executiveConsensusLabel === "critical"
          ? "recovery_alignment_panel"
          : input.snapshot.state.executiveConsensusLabel === "volatile"
            ? "strategic_coherence_timeline"
            : input.snapshot.state.activeConsensusSignals.length > 3
              ? "consensus_overlay"
              : "consensus_overlay";

  return Object.freeze({
    consensusStateId: input.snapshot.consensusStateId,
    topologyId: input.snapshot.topologyId,
    strategicAlignmentScore: input.snapshot.state.strategicAlignmentScore,
    executiveConsensusLabel: input.snapshot.state.executiveConsensusLabel,
    consensusAmbiguityDisclaimer: input.snapshot.state.consensusAmbiguityDisclaimer,
    nonManipulationDisclaimer: input.snapshot.state.nonManipulationDisclaimer,
    consensusSignals: Object.freeze(
      input.snapshot.state.activeConsensusSignals.map((c) =>
        Object.freeze({
          consensusId: c.consensusId,
          consensusState: c.consensusState,
          consensusStrength: c.consensusStrength,
        })
      )
    ),
    alignmentSummaries: Object.freeze(
      input.snapshot.state.executiveAlignmentRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic consensus (read-only; never manipulates executive agreement).
 */
export function evaluateStrategicConsensus(
  input: EvaluateStrategicConsensusInput
): EvaluateStrategicConsensusResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.consensusContext?.tick) || 0);
  const consensusStateId = String(
    input.consensusStateId ?? `strategic-consensus::${topology.topologyId}::${tick}`
  ).trim();

  const consensusLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.consensusContext?.consensusLeverageFactor ?? 0)
  );
  const fragmentationStressFactor = clamp01Stress(
    input.consensusContext?.fragmentationStressFactor ?? 0
  );

  logExecutiveStrategicConsensusDev("Consensus", {
    consensusStateId,
    topologyId: topology.topologyId,
    tick,
    advisoryLabel: input.advisoryState.executiveAdvisoryLabel,
    comparisonLabel: input.comparisonState.executiveComparisonLabel,
  });

  const activeConsensusSignals = deriveExecutiveConsensusSignals({
    advisoryState: input.advisoryState,
    comparisonState: input.comparisonState,
    governanceState: input.governanceState,
    memoryState: input.memoryState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    consensusLeverageFactor,
    fragmentationStressFactor,
  });

  const executiveAlignmentRecords = analyzeExecutiveAlignment({
    consensusSignals: activeConsensusSignals,
    advisoryState: input.advisoryState,
    comparisonState: input.comparisonState,
    governanceState: input.governanceState,
    adaptationState: input.adaptationState,
    resilienceState: input.resilienceState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const strategicAlignmentScore = calculateStrategicAlignmentScore({
    consensusSignals: activeConsensusSignals,
    advisoryState: input.advisoryState,
    comparisonState: input.comparisonState,
  });

  const executiveCoherenceScore = calculateExecutiveCoherenceScore({
    consensusSignals: activeConsensusSignals,
    governanceState: input.governanceState,
    explainabilityState: input.explainabilityState,
  });

  const fragmentationEscalationScore = calculateFragmentationEscalationScore({
    consensusSignals: activeConsensusSignals,
    comparisonState: input.comparisonState,
    divergenceState: input.divergenceState,
  });

  const consensusFragmentationRecords = analyzeConsensusFragmentation({
    consensusSignals: activeConsensusSignals,
    comparisonState: input.comparisonState,
    governanceState: input.governanceState,
    advisoryState: input.advisoryState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const strategicCoherenceRecords = analyzeStrategicCoherence({
    consensusSignals: activeConsensusSignals,
    alignmentRecords: executiveAlignmentRecords,
    fragmentationRecords: consensusFragmentationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildConsensusContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    advisoryFingerprint,
    explainabilityFingerprint,
    governanceFingerprint,
    memoryFingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicConsensus({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    consensusSignals: activeConsensusSignals,
    priorConsensusFingerprints: input.priorConsensusFingerprints,
    pendingFingerprint,
    strategicAlignmentScore,
    fragmentationEscalationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveConsensusLabel = classifyExecutiveConsensusLabel({
    strategicAlignmentScore,
    executiveCoherenceScore,
    fragmentationEscalationScore,
    consensusSignals: activeConsensusSignals,
  });

  const state: ExecutiveStrategicConsensusState = Object.freeze({
    activeConsensusSignals: Object.freeze(activeConsensusSignals),
    executiveAlignmentRecords,
    consensusFragmentationRecords,
    strategicCoherenceRecords,
    consensusStabilityZones: identifyConsensusStabilityZones(activeConsensusSignals),
    fragmentationZones: identifyFragmentationZones(activeConsensusSignals),
    strategicAlignmentScore,
    executiveCoherenceScore,
    fragmentationEscalationScore,
    executiveConsensusLabel,
    consensusAmbiguityDisclaimer: CONSENSUS_AMBIGUITY_DISCLAIMER,
    nonManipulationDisclaimer: NON_MANIPULATION_DISCLAIMER,
  });

  const semantics = buildExecutiveStrategicConsensusSemantics({ state });
  const semanticsGuard = guardConsensusExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    consensusStateId,
    executiveConsensusLabel,
    strategicAlignmentScore,
    executiveCoherenceScore,
  });

  const snapshot: ExecutiveStrategicConsensusSnapshot = Object.freeze({
    consensusStateId,
    topologyId: topology.topologyId,
    advisoryStateId: `executive-advisory::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      consensusSummaries: Object.freeze([...semantics.consensusSummaries]),
      alignmentSummaries: Object.freeze([...semantics.alignmentSummaries]),
      fragmentationSummaries: Object.freeze([...semantics.fragmentationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: consensusBuiltAt(tick),
  });

  const panelContract = buildStrategicConsensusPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveStrategicConsensusSnapshot(
  snapshot: ExecutiveStrategicConsensusSnapshot
): ExecutiveStrategicConsensusSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeConsensusSignals: Object.freeze(
        snapshot.state.activeConsensusSignals.map((c) => Object.freeze({ ...c }))
      ),
      executiveAlignmentRecords: Object.freeze(
        snapshot.state.executiveAlignmentRecords.map((r) => Object.freeze({ ...r }))
      ),
      consensusFragmentationRecords: Object.freeze(
        snapshot.state.consensusFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicCoherenceRecords: Object.freeze(
        snapshot.state.strategicCoherenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      consensusStabilityZones: Object.freeze([...snapshot.state.consensusStabilityZones]),
      fragmentationZones: Object.freeze([...snapshot.state.fragmentationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
