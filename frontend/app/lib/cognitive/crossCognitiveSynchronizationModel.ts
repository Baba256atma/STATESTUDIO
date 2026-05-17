/**
 * D7:6:9 — Cross-cognitive synchronization modeling for unified executive environment.
 */

import type { ExecutiveStrategicPresenceIntelligenceState } from "./executiveStrategicPresenceTypes.ts";
import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type {
  CrossCognitiveSynchronizationRecord,
  UnifiedExecutiveCognitiveEnvironmentIntelligenceState,
  UnifiedExecutiveEnvironmentSignal,
  UnifiedExecutiveEnvironmentStateLabel,
} from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import { logUnifiedExecutiveCognitiveEnvironmentDev } from "./cognitiveEnvironmentDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function environmentStateFromProfile(
  coherence: number,
  sync: number,
  fragmentation: number
): UnifiedExecutiveEnvironmentStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (sync >= 0.62 && coherence >= 0.5) return "synchronized";
  if (coherence >= 0.55 && fragmentation < 0.45) return "coherent";
  if (coherence >= 0.4 || sync >= 0.45) return "transitional";
  return fragmentation > coherence ? "fragmented" : "transitional";
}

export function deriveUnifiedExecutiveEnvironmentSignals(input: {
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  environmentLeverageFactor?: number;
  syncStressFactor?: number;
}): UnifiedExecutiveEnvironmentSignal[] {
  const leverage = clamp01(input.environmentLeverageFactor ?? 0);
  const stress = clamp01(input.syncStressFactor ?? 0);

  const signals: UnifiedExecutiveEnvironmentSignal[] = [];

  const zoneSets = [
    input.presenceState.sustainedAwarenessZones,
    input.presenceState.fragmentedPresenceZones,
    input.immersionState.deepExplorationZones,
    input.immersionState.cognitiveImmersionRiskZones,
    input.timelineState.immediatePriorityZones,
    input.timelineState.fragmentedTimelineZones,
    input.narrativeState.strategicNarrativeZones,
    input.narrativeState.fragmentedNarrativeZones,
    input.attentionRoutingState.highPriorityAttentionZones,
    input.attentionRoutingState.fragmentedAttentionZones,
    input.cognitiveUxState.attentionPriorityZones,
    input.cognitiveLoadState.overloadZones,
    input.insightPrioritizationState.elevatedInsightZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.presenceState.situationalContinuityScore * 0.2 +
        input.immersionState.immersionClarityScore * 0.2 +
        input.timelineState.timelineClarityScore * 0.2 +
        input.narrativeState.narrativeClarityScore * 0.15 +
        input.cognitiveUxState.cognitiveClarityScore * 0.15 +
        leverage * 0.08
    );
    const sync = clamp01(
      input.orchestrationState.orchestrationCoherenceScore * 0.3 +
        input.attentionRoutingState.focusStabilityScore * 0.25 +
        input.cognitiveLoadState.cognitiveBalanceScore * 0.2 +
        (1 - input.presenceState.presenceFragmentationScore) * 0.15
    );
    const fragmentation = clamp01(
      input.presenceState.presenceFragmentationScore * 0.25 +
        input.immersionState.immersionOverloadScore * 0.25 +
        input.timelineState.timelineFragmentationScore * 0.2 +
        input.narrativeState.narrativeFragmentationScore * 0.15 +
        stress * 0.1
    );

    const environmentState = environmentStateFromProfile(coherence, sync, fragmentation);
    const environmentStrength = clamp01(
      coherence * 0.35 + sync * 0.35 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (environmentState === "coherent") drivers.push("unified_context", "layer_alignment");
    if (environmentState === "synchronized") drivers.push("cross_layer_sync", "continuity_preservation");
    if (environmentState === "transitional") drivers.push("context_shift", "panel_transition");
    if (environmentState === "fragmented") drivers.push("layer_divergence", "experience_split");
    if (environmentState === "critical") drivers.push("environment_breakdown", "continuity_risk");

    signals.push(
      Object.freeze({
        environmentId: `environment::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        environmentState,
        environmentStrength,
        dominantEnvironmentDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["environment_assessment"]
        ),
        executiveLabel:
          environmentState === "synchronized" || environmentState === "coherent"
            ? "Unified executive environment may sustain coherent cognition across timelines, narratives, and immersion layers"
            : environmentState === "fragmented" || environmentState === "critical"
              ? "Unified executive environment may require consolidation when cognitive layers diverge across panels and scenarios"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        environmentId: "environment::fallback-unified",
        affectedRegionIds: Object.freeze(fallback),
        environmentState: "coherent",
        environmentStrength: clamp01(
          input.presenceState.situationalContinuityScore * 0.3 +
            input.cognitiveUxState.cognitiveClarityScore * 0.25 +
            leverage * 0.2
        ),
        dominantEnvironmentDrivers: Object.freeze(["baseline_environment_assessment"]),
        executiveLabel:
          "Baseline unified executive cognitive environment assessment may apply across operational regions",
      })
    );
  }

  logUnifiedExecutiveCognitiveEnvironmentDev("UnifiedEnvironment", {
    environmentSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.environmentId.localeCompare(b.environmentId));
}

export function analyzeCrossCognitiveSynchronization(input: {
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  foresightState: PredictiveExecutiveForesightState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly CrossCognitiveSynchronizationRecord[] {
  const records: CrossCognitiveSynchronizationRecord[] = [];
  const environmentIds = input.environmentSignals.map((s) => s.environmentId);

  const regions =
    input.environmentSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.environmentSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "sync::narrative-timeline",
      syncType: "narrative_timeline_synchronization",
      syncStrength: clamp01(
        input.narrativeState.narrativeClarityScore * 0.45 +
          input.timelineState.timelineClarityScore * 0.4
      ),
      explanation:
        "Narrative and timeline synchronization may unify recovery narratives with evolving operational horizons.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::immersion-presence",
      syncType: "immersion_presence_continuity",
      syncStrength: clamp01(
        input.immersionState.immersionClarityScore * 0.4 +
          input.presenceState.situationalContinuityScore * 0.4
      ),
      explanation:
        "Immersion and presence continuity may align scenario exploration with sustained situational awareness.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::attention-load",
      syncType: "attention_load_coherence",
      syncStrength: clamp01(
        input.attentionRoutingState.focusStabilityScore * 0.45 +
          input.cognitiveLoadState.cognitiveBalanceScore * 0.4
      ),
      explanation:
        "Attention and load coherence may prevent cognitive fragmentation across executive panels.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::governance-awareness",
      syncType: "governance_awareness_continuity",
      syncStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Governance-awareness continuity may preserve policy context across unified cognition layers.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::strategic-context",
      syncType: "strategic_context_persistence",
      syncStrength: clamp01(
        input.narrativeState.strategicContextScore * 0.45 +
          input.cognitiveUxState.cognitiveClarityScore * 0.35
      ),
      explanation:
        "Strategic context persistence may keep recommendations, simulations, and insights aligned in one environment.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::cognition-stability",
      syncType: "executive_cognition_stability",
      syncStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.cognitiveUxState.attentionPriorityScore * 0.35
      ),
      explanation:
        "Executive cognition stability may sustain unified understanding when volatility spans multiple domains.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logUnifiedExecutiveCognitiveEnvironmentDev("EnvironmentCoherence", {
    syncRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateEnvironmentCoherenceScore(input: {
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  cognitiveUxState: ExecutiveCognitiveUxState;
}): number {
  if (input.environmentSignals.length === 0) return 0;
  const avgStrength =
    input.environmentSignals.reduce((s, e) => s + e.environmentStrength, 0) /
    input.environmentSignals.length;
  return clamp01(
    avgStrength * 0.3 +
      input.presenceState.situationalContinuityScore * 0.2 +
      input.immersionState.immersionClarityScore * 0.15 +
      input.timelineState.timelineClarityScore * 0.15 +
      input.narrativeState.narrativeClarityScore * 0.1 +
      input.cognitiveUxState.cognitiveClarityScore * 0.08
  );
}

export function calculateCrossCognitiveSyncScore(input: {
  syncRecords: readonly CrossCognitiveSynchronizationRecord[];
}): number {
  if (input.syncRecords.length === 0) return 0;
  return clamp01(
    input.syncRecords.reduce((s, r) => s + r.syncStrength, 0) / input.syncRecords.length
  );
}

export function identifySynchronizedCognitionZones(
  signals: readonly UnifiedExecutiveEnvironmentSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.environmentState === "coherent" ||
      signal.environmentState === "synchronized" ||
      signal.environmentState === "transitional"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedEnvironmentZones(
  signals: readonly UnifiedExecutiveEnvironmentSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.environmentState === "fragmented" || signal.environmentState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveEnvironmentLabel(input: {
  environmentCoherenceScore: number;
  crossCognitiveSyncScore: number;
  environmentFragmentationScore: number;
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
}): UnifiedExecutiveCognitiveEnvironmentIntelligenceState["executiveEnvironmentLabel"] {
  const critical = input.environmentSignals.filter((s) => s.environmentState === "critical").length;
  if (critical > 0 || input.environmentFragmentationScore >= 0.68) return "critical";
  if (input.environmentFragmentationScore >= 0.55) return "fragmented";
  const synchronized = input.environmentSignals.filter(
    (s) => s.environmentState === "synchronized"
  ).length;
  if (synchronized > 0 && input.crossCognitiveSyncScore >= 0.55) return "synchronized";
  if (input.crossCognitiveSyncScore >= 0.58 && input.environmentCoherenceScore >= 0.5) {
    return "coherent";
  }
  if (input.environmentCoherenceScore >= 0.45 && input.environmentFragmentationScore < 0.45) {
    return "transitional";
  }
  return input.environmentFragmentationScore > input.environmentCoherenceScore
    ? "fragmented"
    : "transitional";
}
