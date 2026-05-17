/**
 * D7:6:6 — Executive cognitive timeline intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateExecutiveCognitiveTimelinesInput,
  EvaluateExecutiveCognitiveTimelinesResult,
  ExecutiveCognitiveTimelineSnapshot,
  ExecutiveCognitiveTimelineIntelligenceState,
  ExecutiveCognitiveTimelinePanelContract,
} from "./executiveCognitiveTimelineTypes.ts";
import {
  TIMELINE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_TIMELINE_DISCLAIMER,
  buildTimelineContentFingerprint,
  guardEvaluateExecutiveCognitiveTimelines,
  guardExecutiveCognitiveTimelineSemantics,
} from "./cognitiveTimelineGuards.ts";
import {
  analyzeMultiHorizonTimelines,
  calculateMultiHorizonScore,
  calculateTimelineClarityScore,
  classifyExecutiveTimelineLabel,
  deriveExecutiveTimelineSignals,
  identifyFragmentedTimelineZones,
  identifyImmediatePriorityZones,
} from "./multiHorizonTimelineModel.ts";
import {
  analyzeTimelineFragmentation,
  calculateTimelineFragmentationScore,
} from "./timelineFragmentationAnalysis.ts";
import { analyzeExecutiveTemporalCognition } from "./executiveTemporalCognitionIntelligence.ts";
import { buildExecutiveCognitiveTimelineSemantics } from "./executiveCognitiveTimelineSemantics.ts";
import { logExecutiveCognitiveTimelineDev } from "./cognitiveTimelineDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function timelineBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveCognitiveTimelinePanelContract(input: {
  snapshot: ExecutiveCognitiveTimelineSnapshot;
}): ExecutiveCognitiveTimelinePanelContract {
  const viewHint =
    input.snapshot.state.timelineFragmentationRecords.length > 3
      ? "temporal_heatmap"
      : input.snapshot.state.cognitiveHorizonRecords.length > 4
        ? "recovery_evolution_timeline"
        : input.snapshot.state.executiveTimelineLabel === "critical"
          ? "strategic_sequencing_panel"
          : input.snapshot.state.executiveTimelineLabel === "transitional"
            ? "executive_horizon_dashboard"
            : input.snapshot.state.activeTimelineSignals.length > 3
              ? "timeline_overlay"
              : "timeline_overlay";

  return Object.freeze({
    timelineStateId: input.snapshot.timelineStateId,
    topologyId: input.snapshot.topologyId,
    timelineClarityScore: input.snapshot.state.timelineClarityScore,
    executiveTimelineLabel: input.snapshot.state.executiveTimelineLabel,
    timelineAmbiguityDisclaimer: input.snapshot.state.timelineAmbiguityDisclaimer,
    nonManipulationTimelineDisclaimer: input.snapshot.state.nonManipulationTimelineDisclaimer,
    timelineSignals: Object.freeze(
      input.snapshot.state.activeTimelineSignals.map((t) =>
        Object.freeze({
          timelineId: t.timelineId,
          timelineState: t.timelineState,
          timelineStrength: t.timelineStrength,
        })
      )
    ),
    horizonSummaries: Object.freeze(
      input.snapshot.state.cognitiveHorizonRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive cognitive timelines (read-only; never fabricates unsupported timelines).
 */
export function evaluateExecutiveCognitiveTimelines(
  input: EvaluateExecutiveCognitiveTimelinesInput
): EvaluateExecutiveCognitiveTimelinesResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.timelineContext?.tick) || 0);
  const timelineStateId = String(
    input.timelineStateId ?? `executive-cognitive-timeline::${topology.topologyId}::${tick}`
  ).trim();

  const timelineLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.timelineContext?.timelineLeverageFactor ?? 0)
  );
  const horizonStressFactor = clamp01Stress(input.timelineContext?.horizonStressFactor ?? 0);

  logExecutiveCognitiveTimelineDev("Timeline", {
    timelineStateId,
    topologyId: topology.topologyId,
    tick,
    narrativeLabel: input.narrativeState.executiveNarrativeLabel,
    foresightLabel: input.foresightState.predictiveForesightLabel,
  });

  const activeTimelineSignals = deriveExecutiveTimelineSignals({
    narrativeState: input.narrativeState,
    insightPrioritizationState: input.insightPrioritizationState,
    foresightState: input.foresightState,
    cognitiveLoadState: input.cognitiveLoadState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    timelineLeverageFactor,
    horizonStressFactor,
  });

  const cognitiveHorizonRecords = analyzeMultiHorizonTimelines({
    timelineSignals: activeTimelineSignals,
    narrativeState: input.narrativeState,
    insightPrioritizationState: input.insightPrioritizationState,
    foresightState: input.foresightState,
    cognitiveLoadState: input.cognitiveLoadState,
    governanceState: input.governanceState,
    orchestrationState: input.orchestrationState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const timelineClarityScore = calculateTimelineClarityScore({
    timelineSignals: activeTimelineSignals,
    narrativeState: input.narrativeState,
    foresightState: input.foresightState,
  });

  const multiHorizonScore = calculateMultiHorizonScore({
    horizonRecords: cognitiveHorizonRecords,
  });

  const timelineFragmentationRecords = analyzeTimelineFragmentation({
    timelineSignals: activeTimelineSignals,
    narrativeState: input.narrativeState,
    insightPrioritizationState: input.insightPrioritizationState,
    cognitiveLoadState: input.cognitiveLoadState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const timelineFragmentationScore = calculateTimelineFragmentationScore({
    timelineSignals: activeTimelineSignals,
    fragmentationRecords: timelineFragmentationRecords,
    narrativeState: input.narrativeState,
  });

  const executiveTemporalCognitionRecords = analyzeExecutiveTemporalCognition({
    timelineSignals: activeTimelineSignals,
    horizonRecords: cognitiveHorizonRecords,
    fragmentationRecords: timelineFragmentationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const narrativeFingerprint = stableStringify({
    label: input.narrativeState.executiveNarrativeLabel,
    clarity: input.narrativeState.narrativeClarityScore,
  });
  const insightPrioritizationFingerprint = stableStringify({
    label: input.insightPrioritizationState.executiveInsightPrioritizationLabel,
    insight: input.insightPrioritizationState.strategicInsightScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
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

  const pendingFingerprint = buildTimelineContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    narrativeFingerprint,
    insightPrioritizationFingerprint,
    foresightFingerprint,
    cognitiveLoadFingerprint,
    orchestrationFingerprint,
    governanceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveCognitiveTimelines({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    timelineSignals: activeTimelineSignals,
    priorTimelineFingerprints: input.priorTimelineFingerprints,
    pendingFingerprint,
    timelineClarityScore,
    timelineFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveTimelineLabel = classifyExecutiveTimelineLabel({
    timelineClarityScore,
    multiHorizonScore,
    timelineFragmentationScore,
    timelineSignals: activeTimelineSignals,
  });

  const state: ExecutiveCognitiveTimelineIntelligenceState = Object.freeze({
    activeTimelineSignals: Object.freeze(activeTimelineSignals),
    cognitiveHorizonRecords,
    timelineFragmentationRecords,
    executiveTemporalCognitionRecords,
    immediatePriorityZones: identifyImmediatePriorityZones(activeTimelineSignals),
    fragmentedTimelineZones: identifyFragmentedTimelineZones(activeTimelineSignals),
    timelineClarityScore,
    multiHorizonScore,
    timelineFragmentationScore,
    executiveTimelineLabel,
    timelineAmbiguityDisclaimer: TIMELINE_AMBIGUITY_DISCLAIMER,
    nonManipulationTimelineDisclaimer: NON_MANIPULATION_TIMELINE_DISCLAIMER,
  });

  const semantics = buildExecutiveCognitiveTimelineSemantics({ state });
  const semanticsGuard = guardExecutiveCognitiveTimelineSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    timelineStateId,
    executiveTimelineLabel,
    timelineClarityScore,
    multiHorizonScore,
  });

  const snapshot: ExecutiveCognitiveTimelineSnapshot = Object.freeze({
    timelineStateId,
    topologyId: topology.topologyId,
    narrativeStateId: `executive-narrative::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      timelineSummaries: Object.freeze([...semantics.timelineSummaries]),
      horizonSummaries: Object.freeze([...semantics.horizonSummaries]),
      fragmentationSummaries: Object.freeze([...semantics.fragmentationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: timelineBuiltAt(tick),
  });

  const panelContract = buildExecutiveCognitiveTimelinePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveCognitiveTimelineSnapshot(
  snapshot: ExecutiveCognitiveTimelineSnapshot
): ExecutiveCognitiveTimelineSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeTimelineSignals: Object.freeze(
        snapshot.state.activeTimelineSignals.map((t) => Object.freeze({ ...t }))
      ),
      cognitiveHorizonRecords: Object.freeze(
        snapshot.state.cognitiveHorizonRecords.map((r) => Object.freeze({ ...r }))
      ),
      timelineFragmentationRecords: Object.freeze(
        snapshot.state.timelineFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveTemporalCognitionRecords: Object.freeze(
        snapshot.state.executiveTemporalCognitionRecords.map((r) => Object.freeze({ ...r }))
      ),
      immediatePriorityZones: Object.freeze([...snapshot.state.immediatePriorityZones]),
      fragmentedTimelineZones: Object.freeze([...snapshot.state.fragmentedTimelineZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
