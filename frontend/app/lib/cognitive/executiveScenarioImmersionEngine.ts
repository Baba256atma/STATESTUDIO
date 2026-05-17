/**
 * D7:6:7 — Executive scenario immersion intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateExecutiveScenarioImmersionInput,
  EvaluateExecutiveScenarioImmersionResult,
  ExecutiveScenarioImmersionSnapshot,
  ExecutiveScenarioImmersionIntelligenceState,
  ExecutiveScenarioImmersionPanelContract,
} from "./executiveScenarioImmersionTypes.ts";
import {
  IMMERSION_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_IMMERSION_DISCLAIMER,
  buildImmersionContentFingerprint,
  guardEvaluateExecutiveScenarioImmersion,
  guardExecutiveScenarioImmersionSemantics,
} from "./scenarioImmersionGuards.ts";
import {
  analyzeMultiLayerScenarios,
  calculateImmersionClarityScore,
  calculateMultiLayerScenarioScore,
  classifyExecutiveImmersionLabel,
  deriveExecutiveScenarioImmersionSignals,
  identifyCognitiveImmersionRiskZones,
  identifyDeepExplorationZones,
} from "./multiLayerScenarioModel.ts";
import {
  analyzeImmersiveCognition,
  calculateImmersionOverloadScore,
} from "./immersiveCognitionAnalysis.ts";
import { analyzeExecutiveScenarioExploration } from "./executiveExplorationIntelligence.ts";
import { buildExecutiveScenarioImmersionSemantics } from "./executiveScenarioImmersionSemantics.ts";
import { logExecutiveScenarioImmersionDev } from "./scenarioImmersionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function immersionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveScenarioImmersionPanelContract(input: {
  snapshot: ExecutiveScenarioImmersionSnapshot;
}): ExecutiveScenarioImmersionPanelContract {
  const viewHint =
    input.snapshot.state.immersiveCognitionRecords.length > 3
      ? "future_branch_timeline"
      : input.snapshot.state.scenarioEvolutionLayerRecords.length > 4
        ? "operational_evolution_map"
        : input.snapshot.state.executiveImmersionLabel === "critical"
          ? "strategic_immersion_panel"
          : input.snapshot.state.executiveImmersionLabel === "immersed"
            ? "executive_exploration_dashboard"
            : input.snapshot.state.activeImmersionSignals.length > 3
              ? "immersive_scenario_overlay"
              : "immersive_scenario_overlay";

  return Object.freeze({
    immersionStateId: input.snapshot.immersionStateId,
    topologyId: input.snapshot.topologyId,
    immersionClarityScore: input.snapshot.state.immersionClarityScore,
    executiveImmersionLabel: input.snapshot.state.executiveImmersionLabel,
    immersionAmbiguityDisclaimer: input.snapshot.state.immersionAmbiguityDisclaimer,
    nonManipulationImmersionDisclaimer: input.snapshot.state.nonManipulationImmersionDisclaimer,
    immersionSignals: Object.freeze(
      input.snapshot.state.activeImmersionSignals.map((s) =>
        Object.freeze({
          immersionId: s.immersionId,
          immersionState: s.immersionState,
          immersionStrength: s.immersionStrength,
        })
      )
    ),
    layerSummaries: Object.freeze(
      input.snapshot.state.scenarioEvolutionLayerRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive scenario immersion (read-only; never manipulates executive psychology).
 */
export function evaluateExecutiveScenarioImmersion(
  input: EvaluateExecutiveScenarioImmersionInput
): EvaluateExecutiveScenarioImmersionResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.immersionContext?.tick) || 0);
  const immersionStateId = String(
    input.immersionStateId ?? `executive-scenario-immersion::${topology.topologyId}::${tick}`
  ).trim();

  const immersionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.immersionContext?.immersionLeverageFactor ?? 0)
  );
  const explorationStressFactor = clamp01Stress(
    input.immersionContext?.explorationStressFactor ?? 0
  );

  logExecutiveScenarioImmersionDev("ScenarioImmersion", {
    immersionStateId,
    topologyId: topology.topologyId,
    tick,
    timelineLabel: input.timelineState.executiveTimelineLabel,
    narrativeLabel: input.narrativeState.executiveNarrativeLabel,
  });

  const activeImmersionSignals = deriveExecutiveScenarioImmersionSignals({
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
    immersionLeverageFactor,
    explorationStressFactor,
  });

  const scenarioEvolutionLayerRecords = analyzeMultiLayerScenarios({
    immersionSignals: activeImmersionSignals,
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

  const immersionClarityScore = calculateImmersionClarityScore({
    immersionSignals: activeImmersionSignals,
    narrativeState: input.narrativeState,
    timelineState: input.timelineState,
  });

  const multiLayerScenarioScore = calculateMultiLayerScenarioScore({
    layerRecords: scenarioEvolutionLayerRecords,
  });

  const immersiveCognitionRecords = analyzeImmersiveCognition({
    immersionSignals: activeImmersionSignals,
    timelineState: input.timelineState,
    narrativeState: input.narrativeState,
    cognitiveLoadState: input.cognitiveLoadState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const immersionOverloadScore = calculateImmersionOverloadScore({
    immersionSignals: activeImmersionSignals,
    cognitionRecords: immersiveCognitionRecords,
    cognitiveLoadState: input.cognitiveLoadState,
  });

  const executiveScenarioExplorationRecords = analyzeExecutiveScenarioExploration({
    immersionSignals: activeImmersionSignals,
    layerRecords: scenarioEvolutionLayerRecords,
    cognitionRecords: immersiveCognitionRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
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

  const pendingFingerprint = buildImmersionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    timelineFingerprint,
    narrativeFingerprint,
    insightPrioritizationFingerprint,
    foresightFingerprint,
    cognitiveLoadFingerprint,
    orchestrationFingerprint,
    governanceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveScenarioImmersion({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    immersionSignals: activeImmersionSignals,
    priorImmersionFingerprints: input.priorImmersionFingerprints,
    pendingFingerprint,
    immersionClarityScore,
    immersionOverloadScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveImmersionLabel = classifyExecutiveImmersionLabel({
    immersionClarityScore,
    multiLayerScenarioScore,
    immersionOverloadScore,
    immersionSignals: activeImmersionSignals,
  });

  const state: ExecutiveScenarioImmersionIntelligenceState = Object.freeze({
    activeImmersionSignals: Object.freeze(activeImmersionSignals),
    scenarioEvolutionLayerRecords,
    immersiveCognitionRecords,
    executiveScenarioExplorationRecords,
    deepExplorationZones: identifyDeepExplorationZones(activeImmersionSignals),
    cognitiveImmersionRiskZones: identifyCognitiveImmersionRiskZones(activeImmersionSignals),
    immersionClarityScore,
    multiLayerScenarioScore,
    immersionOverloadScore,
    executiveImmersionLabel,
    immersionAmbiguityDisclaimer: IMMERSION_AMBIGUITY_DISCLAIMER,
    nonManipulationImmersionDisclaimer: NON_MANIPULATION_IMMERSION_DISCLAIMER,
  });

  const semantics = buildExecutiveScenarioImmersionSemantics({ state });
  const semanticsGuard = guardExecutiveScenarioImmersionSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    immersionStateId,
    executiveImmersionLabel,
    immersionClarityScore,
    multiLayerScenarioScore,
  });

  const snapshot: ExecutiveScenarioImmersionSnapshot = Object.freeze({
    immersionStateId,
    topologyId: topology.topologyId,
    timelineStateId: `executive-cognitive-timeline::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      immersionSummaries: Object.freeze([...semantics.immersionSummaries]),
      layerSummaries: Object.freeze([...semantics.layerSummaries]),
      cognitionSummaries: Object.freeze([...semantics.cognitionSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: immersionBuiltAt(tick),
  });

  const panelContract = buildExecutiveScenarioImmersionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveScenarioImmersionSnapshot(
  snapshot: ExecutiveScenarioImmersionSnapshot
): ExecutiveScenarioImmersionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeImmersionSignals: Object.freeze(
        snapshot.state.activeImmersionSignals.map((s) => Object.freeze({ ...s }))
      ),
      scenarioEvolutionLayerRecords: Object.freeze(
        snapshot.state.scenarioEvolutionLayerRecords.map((r) => Object.freeze({ ...r }))
      ),
      immersiveCognitionRecords: Object.freeze(
        snapshot.state.immersiveCognitionRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveScenarioExplorationRecords: Object.freeze(
        snapshot.state.executiveScenarioExplorationRecords.map((r) => Object.freeze({ ...r }))
      ),
      deepExplorationZones: Object.freeze([...snapshot.state.deepExplorationZones]),
      cognitiveImmersionRiskZones: Object.freeze([...snapshot.state.cognitiveImmersionRiskZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
