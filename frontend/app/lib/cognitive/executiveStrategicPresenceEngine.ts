/**
 * D7:6:8 — Executive strategic presence intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateExecutiveStrategicPresenceInput,
  EvaluateExecutiveStrategicPresenceResult,
  ExecutiveStrategicPresenceSnapshot,
  ExecutiveStrategicPresenceIntelligenceState,
  ExecutiveStrategicPresencePanelContract,
} from "./executiveStrategicPresenceTypes.ts";
import {
  PRESENCE_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_PRESENCE_DISCLAIMER,
  buildPresenceContentFingerprint,
  guardEvaluateExecutiveStrategicPresence,
  guardExecutiveStrategicPresenceSemantics,
} from "./strategicPresenceGuards.ts";
import {
  analyzeSituationalAwarenessLayers,
  calculateSituationalContinuityScore,
  calculateMultiLayerAwarenessScore,
  classifyExecutivePresenceLabel,
  deriveExecutiveStrategicPresenceSignals,
  identifyFragmentedPresenceZones,
  identifySustainedAwarenessZones,
} from "./situationalAwarenessModel.ts";
import {
  analyzePresenceFragmentation,
  calculatePresenceFragmentationScore,
} from "./presenceFragmentationAnalysis.ts";
import { analyzeExecutiveContinuity } from "./executiveContinuityIntelligence.ts";
import { buildExecutiveStrategicPresenceSemantics } from "./executiveStrategicPresenceSemantics.ts";
import { logExecutiveStrategicPresenceDev } from "./strategicPresenceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function presenceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveStrategicPresencePanelContract(input: {
  snapshot: ExecutiveStrategicPresenceSnapshot;
}): ExecutiveStrategicPresencePanelContract {
  const viewHint =
    input.snapshot.state.presenceFragmentationRecords.length > 3
      ? "executive_awareness_timeline"
      : input.snapshot.state.situationalAwarenessLayerRecords.length > 4
        ? "continuity_heatmap"
        : input.snapshot.state.executivePresenceLabel === "critical"
          ? "operational_context_panel"
          : input.snapshot.state.executivePresenceLabel === "sustained"
            ? "situational_awareness_dashboard"
            : input.snapshot.state.activePresenceSignals.length > 3
              ? "strategic_presence_overlay"
              : "strategic_presence_overlay";

  return Object.freeze({
    presenceStateId: input.snapshot.presenceStateId,
    topologyId: input.snapshot.topologyId,
    situationalContinuityScore: input.snapshot.state.situationalContinuityScore,
    executivePresenceLabel: input.snapshot.state.executivePresenceLabel,
    presenceAmbiguityDisclaimer: input.snapshot.state.presenceAmbiguityDisclaimer,
    nonManipulationPresenceDisclaimer: input.snapshot.state.nonManipulationPresenceDisclaimer,
    presenceSignals: Object.freeze(
      input.snapshot.state.activePresenceSignals.map((s) =>
        Object.freeze({
          presenceId: s.presenceId,
          presenceState: s.presenceState,
          presenceStrength: s.presenceStrength,
        })
      )
    ),
    layerSummaries: Object.freeze(
      input.snapshot.state.situationalAwarenessLayerRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive strategic presence (read-only; never manipulates executive engagement).
 */
export function evaluateExecutiveStrategicPresence(
  input: EvaluateExecutiveStrategicPresenceInput
): EvaluateExecutiveStrategicPresenceResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.presenceContext?.tick) || 0);
  const presenceStateId = String(
    input.presenceStateId ?? `executive-strategic-presence::${topology.topologyId}::${tick}`
  ).trim();

  const presenceLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.presenceContext?.presenceLeverageFactor ?? 0)
  );
  const continuityStressFactor = clamp01Stress(
    input.presenceContext?.continuityStressFactor ?? 0
  );

  logExecutiveStrategicPresenceDev("StrategicPresence", {
    presenceStateId,
    topologyId: topology.topologyId,
    tick,
    immersionLabel: input.immersionState.executiveImmersionLabel,
    timelineLabel: input.timelineState.executiveTimelineLabel,
  });

  const activePresenceSignals = deriveExecutiveStrategicPresenceSignals({
    immersionState: input.immersionState,
    timelineState: input.timelineState,
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
    presenceLeverageFactor,
    continuityStressFactor,
  });

  const situationalAwarenessLayerRecords = analyzeSituationalAwarenessLayers({
    presenceSignals: activePresenceSignals,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
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

  const situationalContinuityScore = calculateSituationalContinuityScore({
    presenceSignals: activePresenceSignals,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
  });

  const multiLayerAwarenessScore = calculateMultiLayerAwarenessScore({
    layerRecords: situationalAwarenessLayerRecords,
  });

  const presenceFragmentationRecords = analyzePresenceFragmentation({
    presenceSignals: activePresenceSignals,
    immersionState: input.immersionState,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    cognitiveLoadState: input.cognitiveLoadState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const presenceFragmentationScore = calculatePresenceFragmentationScore({
    presenceSignals: activePresenceSignals,
    fragmentationRecords: presenceFragmentationRecords,
    cognitiveLoadState: input.cognitiveLoadState,
    immersionState: input.immersionState,
  });

  const executiveContinuityRecords = analyzeExecutiveContinuity({
    presenceSignals: activePresenceSignals,
    layerRecords: situationalAwarenessLayerRecords,
    fragmentationRecords: presenceFragmentationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildPresenceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    immersionFingerprint,
    timelineFingerprint,
    narrativeFingerprint,
    insightPrioritizationFingerprint,
    foresightFingerprint,
    cognitiveLoadFingerprint,
    orchestrationFingerprint,
    governanceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveStrategicPresence({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    presenceSignals: activePresenceSignals,
    priorPresenceFingerprints: input.priorPresenceFingerprints,
    pendingFingerprint,
    situationalContinuityScore,
    presenceFragmentationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executivePresenceLabel = classifyExecutivePresenceLabel({
    situationalContinuityScore,
    multiLayerAwarenessScore,
    presenceFragmentationScore,
    presenceSignals: activePresenceSignals,
  });

  const state: ExecutiveStrategicPresenceIntelligenceState = Object.freeze({
    activePresenceSignals: Object.freeze(activePresenceSignals),
    situationalAwarenessLayerRecords,
    presenceFragmentationRecords,
    executiveContinuityRecords,
    sustainedAwarenessZones: identifySustainedAwarenessZones(activePresenceSignals),
    fragmentedPresenceZones: identifyFragmentedPresenceZones(activePresenceSignals),
    situationalContinuityScore,
    multiLayerAwarenessScore,
    presenceFragmentationScore,
    executivePresenceLabel,
    presenceAmbiguityDisclaimer: PRESENCE_AMBIGUITY_DISCLAIMER,
    nonManipulationPresenceDisclaimer: NON_MANIPULATION_PRESENCE_DISCLAIMER,
  });

  const semantics = buildExecutiveStrategicPresenceSemantics({ state });
  const semanticsGuard = guardExecutiveStrategicPresenceSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    presenceStateId,
    executivePresenceLabel,
    situationalContinuityScore,
    multiLayerAwarenessScore,
  });

  const snapshot: ExecutiveStrategicPresenceSnapshot = Object.freeze({
    presenceStateId,
    topologyId: topology.topologyId,
    immersionStateId: `executive-scenario-immersion::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      presenceSummaries: Object.freeze([...semantics.presenceSummaries]),
      layerSummaries: Object.freeze([...semantics.layerSummaries]),
      fragmentationSummaries: Object.freeze([...semantics.fragmentationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: presenceBuiltAt(tick),
  });

  const panelContract = buildExecutiveStrategicPresencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveStrategicPresenceSnapshot(
  snapshot: ExecutiveStrategicPresenceSnapshot
): ExecutiveStrategicPresenceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activePresenceSignals: Object.freeze(
        snapshot.state.activePresenceSignals.map((s) => Object.freeze({ ...s }))
      ),
      situationalAwarenessLayerRecords: Object.freeze(
        snapshot.state.situationalAwarenessLayerRecords.map((r) => Object.freeze({ ...r }))
      ),
      presenceFragmentationRecords: Object.freeze(
        snapshot.state.presenceFragmentationRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveContinuityRecords: Object.freeze(
        snapshot.state.executiveContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      sustainedAwarenessZones: Object.freeze([...snapshot.state.sustainedAwarenessZones]),
      fragmentedPresenceZones: Object.freeze([...snapshot.state.fragmentedPresenceZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
