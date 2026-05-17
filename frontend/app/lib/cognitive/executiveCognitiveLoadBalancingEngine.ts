/**
 * D7:6:3 — Executive cognitive load balancing engine (immutable, non-manipulative).
 */

import type {
  EvaluateExecutiveCognitiveLoadInput,
  EvaluateExecutiveCognitiveLoadResult,
  ExecutiveCognitiveLoadBalancingSnapshot,
  ExecutiveCognitiveLoadBalancingState,
  ExecutiveCognitiveLoadPanelContract,
} from "./executiveCognitiveLoadTypes.ts";
import {
  LOAD_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_LOAD_DISCLAIMER,
  buildCognitiveLoadContentFingerprint,
  guardEvaluateExecutiveCognitiveLoad,
  guardCognitiveLoadExecutiveSemantics,
} from "./cognitiveLoadBalancingGuards.ts";
import {
  analyzeSignalDensity,
  calculateCognitiveBalanceScore,
  calculateSignalDensityScore,
  classifyExecutiveCognitiveLoadLabel,
  deriveExecutiveCognitiveLoadSignals,
  identifyOverloadZones,
  identifyStabilizedAttentionZones,
} from "./signalDensityModel.ts";
import {
  analyzeOverloadDistribution,
  calculateOverloadEscalationScore,
} from "./overloadDistributionAnalysis.ts";
import { analyzeExecutiveStability } from "./executiveCognitiveStabilityIntelligence.ts";
import { buildExecutiveCognitiveLoadBalancingSemantics } from "./executiveCognitiveLoadBalancingSemantics.ts";
import { logExecutiveCognitiveLoadBalancingDev } from "./cognitiveLoadBalancingDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function loadBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildExecutiveCognitiveLoadPanelContract(input: {
  snapshot: ExecutiveCognitiveLoadBalancingSnapshot;
}): ExecutiveCognitiveLoadPanelContract {
  const viewHint =
    input.snapshot.state.overloadDistributionRecords.length > 3
      ? "overload_heatmap"
      : input.snapshot.state.signalDensityRecords.length > 4
        ? "signal_density_timeline"
        : input.snapshot.state.executiveCognitiveLoadLabel === "critical"
          ? "interaction_complexity_panel"
          : input.snapshot.state.executiveCognitiveLoadLabel === "overloaded"
            ? "executive_balance_dashboard"
            : input.snapshot.state.activeLoadSignals.length > 3
              ? "cognitive_load_overlay"
              : "cognitive_load_overlay";

  return Object.freeze({
    cognitiveLoadStateId: input.snapshot.cognitiveLoadStateId,
    topologyId: input.snapshot.topologyId,
    cognitiveBalanceScore: input.snapshot.state.cognitiveBalanceScore,
    executiveCognitiveLoadLabel: input.snapshot.state.executiveCognitiveLoadLabel,
    loadAmbiguityDisclaimer: input.snapshot.state.loadAmbiguityDisclaimer,
    nonManipulationLoadDisclaimer: input.snapshot.state.nonManipulationLoadDisclaimer,
    loadSignals: Object.freeze(
      input.snapshot.state.activeLoadSignals.map((l) =>
        Object.freeze({
          loadId: l.loadId,
          loadState: l.loadState,
          loadStrength: l.loadStrength,
        })
      )
    ),
    densitySummaries: Object.freeze(
      input.snapshot.state.signalDensityRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive cognitive load balancing (read-only; never manipulates executive psychology).
 */
export function evaluateExecutiveCognitiveLoad(
  input: EvaluateExecutiveCognitiveLoadInput
): EvaluateExecutiveCognitiveLoadResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.cognitiveLoadContext?.tick) || 0);
  const cognitiveLoadStateId = String(
    input.cognitiveLoadStateId ?? `executive-cognitive-load::${topology.topologyId}::${tick}`
  ).trim();

  const loadLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.cognitiveLoadContext?.loadLeverageFactor ?? 0)
  );
  const overloadStressFactor = clamp01Stress(input.cognitiveLoadContext?.overloadStressFactor ?? 0);

  logExecutiveCognitiveLoadBalancingDev("CognitiveLoad", {
    cognitiveLoadStateId,
    topologyId: topology.topologyId,
    tick,
    routingLabel: input.attentionRoutingState.executiveAttentionRoutingLabel,
    cognitiveLabel: input.cognitiveUxState.executiveCognitiveLabel,
  });

  const activeLoadSignals = deriveExecutiveCognitiveLoadSignals({
    attentionRoutingState: input.attentionRoutingState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    loadLeverageFactor,
    overloadStressFactor,
  });

  const signalDensityRecords = analyzeSignalDensity({
    loadSignals: activeLoadSignals,
    attentionRoutingState: input.attentionRoutingState,
    cognitiveUxState: input.cognitiveUxState,
    orchestrationState: input.orchestrationState,
    advisoryState: input.advisoryState,
    governanceState: input.governanceState,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const cognitiveBalanceScore = calculateCognitiveBalanceScore({
    loadSignals: activeLoadSignals,
    cognitiveUxState: input.cognitiveUxState,
    attentionRoutingState: input.attentionRoutingState,
  });

  const signalDensityScore = calculateSignalDensityScore({
    densityRecords: signalDensityRecords,
  });

  const overloadDistributionRecords = analyzeOverloadDistribution({
    loadSignals: activeLoadSignals,
    cognitiveUxState: input.cognitiveUxState,
    attentionRoutingState: input.attentionRoutingState,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    explainabilityState: input.explainabilityState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
  });

  const overloadEscalationScore = calculateOverloadEscalationScore({
    loadSignals: activeLoadSignals,
    distributionRecords: overloadDistributionRecords,
    cognitiveUxState: input.cognitiveUxState,
  });

  const executiveStabilityRecords = analyzeExecutiveStability({
    loadSignals: activeLoadSignals,
    densityRecords: signalDensityRecords,
    distributionRecords: overloadDistributionRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const attentionRoutingFingerprint = stableStringify({
    label: input.attentionRoutingState.executiveAttentionRoutingLabel,
    focus: input.attentionRoutingState.focusStabilityScore,
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

  const pendingFingerprint = buildCognitiveLoadContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    attentionRoutingFingerprint,
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

  const guard = guardEvaluateExecutiveCognitiveLoad({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    loadSignals: activeLoadSignals,
    priorCognitiveLoadFingerprints: input.priorCognitiveLoadFingerprints,
    pendingFingerprint,
    cognitiveBalanceScore,
    overloadEscalationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveCognitiveLoadLabel = classifyExecutiveCognitiveLoadLabel({
    cognitiveBalanceScore,
    signalDensityScore,
    overloadEscalationScore,
    loadSignals: activeLoadSignals,
  });

  const state: ExecutiveCognitiveLoadBalancingState = Object.freeze({
    activeLoadSignals: Object.freeze(activeLoadSignals),
    signalDensityRecords,
    overloadDistributionRecords,
    executiveStabilityRecords,
    overloadZones: identifyOverloadZones(activeLoadSignals),
    stabilizedAttentionZones: identifyStabilizedAttentionZones(activeLoadSignals),
    cognitiveBalanceScore,
    signalDensityScore,
    overloadEscalationScore,
    executiveCognitiveLoadLabel,
    loadAmbiguityDisclaimer: LOAD_AMBIGUITY_DISCLAIMER,
    nonManipulationLoadDisclaimer: NON_MANIPULATION_LOAD_DISCLAIMER,
  });

  const semantics = buildExecutiveCognitiveLoadBalancingSemantics({ state });
  const semanticsGuard = guardCognitiveLoadExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    cognitiveLoadStateId,
    executiveCognitiveLoadLabel,
    cognitiveBalanceScore,
    signalDensityScore,
  });

  const snapshot: ExecutiveCognitiveLoadBalancingSnapshot = Object.freeze({
    cognitiveLoadStateId,
    topologyId: topology.topologyId,
    attentionRoutingStateId: `executive-attention-routing::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      loadSummaries: Object.freeze([...semantics.loadSummaries]),
      densitySummaries: Object.freeze([...semantics.densitySummaries]),
      overloadSummaries: Object.freeze([...semantics.overloadSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: loadBuiltAt(tick),
  });

  const panelContract = buildExecutiveCognitiveLoadPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveCognitiveLoadBalancingSnapshot(
  snapshot: ExecutiveCognitiveLoadBalancingSnapshot
): ExecutiveCognitiveLoadBalancingSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeLoadSignals: Object.freeze(
        snapshot.state.activeLoadSignals.map((l) => Object.freeze({ ...l }))
      ),
      signalDensityRecords: Object.freeze(
        snapshot.state.signalDensityRecords.map((r) => Object.freeze({ ...r }))
      ),
      overloadDistributionRecords: Object.freeze(
        snapshot.state.overloadDistributionRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveStabilityRecords: Object.freeze(
        snapshot.state.executiveStabilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      overloadZones: Object.freeze([...snapshot.state.overloadZones]),
      stabilizedAttentionZones: Object.freeze([...snapshot.state.stabilizedAttentionZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
