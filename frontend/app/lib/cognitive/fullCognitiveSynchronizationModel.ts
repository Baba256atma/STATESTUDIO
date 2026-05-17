/**
 * D7:6:10 — Full cognitive synchronization modeling for orchestration completion.
 */

import type { UnifiedExecutiveCognitiveEnvironmentIntelligenceState } from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
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
  ExecutiveCognitiveCompletionIntelligenceState,
  ExecutiveCognitiveCompletionSignal,
  ExecutiveCognitiveCompletionStateLabel,
  FullCognitiveSynchronizationRecord,
} from "./executiveCognitiveCompletionTypes.ts";
import { logExecutiveCognitiveCompletionDev } from "./cognitiveCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function completionStateFromProfile(
  coherence: number,
  sync: number,
  degradation: number
): ExecutiveCognitiveCompletionStateLabel {
  if (degradation >= 0.72) return "critical";
  if (degradation >= 0.58) return "fragmented";
  if (sync >= 0.62 && coherence >= 0.55) return "synchronized";
  if (coherence >= 0.58 && degradation < 0.4) return "coherent";
  if (coherence >= 0.5 && degradation < 0.5) return "stable";
  return degradation > coherence ? "fragmented" : "coherent";
}

export function deriveExecutiveCognitiveCompletionSignals(input: {
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
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
  completionLeverageFactor?: number;
  orchestrationStressFactor?: number;
}): ExecutiveCognitiveCompletionSignal[] {
  const leverage = clamp01(input.completionLeverageFactor ?? 0);
  const stress = clamp01(input.orchestrationStressFactor ?? 0);

  const signals: ExecutiveCognitiveCompletionSignal[] = [];

  const zoneSets = [
    input.environmentState.synchronizedCognitionZones,
    input.environmentState.fragmentedEnvironmentZones,
    input.presenceState.sustainedAwarenessZones,
    input.presenceState.fragmentedPresenceZones,
    input.immersionState.deepExplorationZones,
    input.immersionState.cognitiveImmersionRiskZones,
    input.timelineState.immediatePriorityZones,
    input.timelineState.fragmentedTimelineZones,
    input.narrativeState.strategicNarrativeZones,
    input.narrativeState.fragmentedNarrativeZones,
    input.attentionRoutingState.highPriorityAttentionZones,
    input.insightPrioritizationState.elevatedInsightZones,
    input.cognitiveLoadState.overloadZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.environmentState.environmentCoherenceScore * 0.25 +
        input.presenceState.situationalContinuityScore * 0.2 +
        input.immersionState.immersionClarityScore * 0.15 +
        input.timelineState.timelineClarityScore * 0.15 +
        input.narrativeState.narrativeClarityScore * 0.1 +
        leverage * 0.08
    );
    const sync = clamp01(
      input.environmentState.crossCognitiveSyncScore * 0.3 +
        input.orchestrationState.orchestrationCoherenceScore * 0.25 +
        input.attentionRoutingState.focusStabilityScore * 0.2 +
        input.cognitiveLoadState.cognitiveBalanceScore * 0.15
    );
    const degradation = clamp01(
      input.environmentState.environmentFragmentationScore * 0.25 +
        input.presenceState.presenceFragmentationScore * 0.2 +
        input.immersionState.immersionOverloadScore * 0.2 +
        input.timelineState.timelineFragmentationScore * 0.15 +
        stress * 0.12
    );

    const completionState = completionStateFromProfile(coherence, sync, degradation);
    const completionStrength = clamp01(
      coherence * 0.35 + sync * 0.35 + (1 - degradation) * 0.25
    );

    const drivers: string[] = [];
    if (completionState === "stable") drivers.push("platform_stability", "layer_finalization");
    if (completionState === "coherent") drivers.push("cognitive_coherence", "unified_context");
    if (completionState === "synchronized") drivers.push("full_sync", "orchestration_complete");
    if (completionState === "fragmented") drivers.push("layer_divergence", "sync_degradation");
    if (completionState === "critical") drivers.push("completion_risk", "orchestration_instability");

    signals.push(
      Object.freeze({
        completionId: `completion::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        completionState,
        completionStrength,
        dominantCompletionDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["completion_assessment"]
        ),
        executiveLabel:
          completionState === "synchronized" || completionState === "stable"
            ? "Executive cognitive orchestration may finalize as a unified strategic cognition platform"
            : completionState === "fragmented" || completionState === "critical"
              ? "Executive cognitive completion may require consolidation when platform layers diverge"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        completionId: "completion::fallback-platform",
        affectedRegionIds: Object.freeze(fallback),
        completionState: "stable",
        completionStrength: clamp01(
          input.environmentState.environmentCoherenceScore * 0.35 +
            input.cognitiveUxState.cognitiveClarityScore * 0.25 +
            leverage * 0.2
        ),
        dominantCompletionDrivers: Object.freeze(["baseline_completion_assessment"]),
        executiveLabel:
          "Baseline executive cognitive completion assessment may apply across the strategic platform",
      })
    );
  }

  logExecutiveCognitiveCompletionDev("CognitiveCompletion", {
    completionSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.completionId.localeCompare(b.completionId));
}

export function analyzeFullCognitiveSynchronization(input: {
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
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
}): readonly FullCognitiveSynchronizationRecord[] {
  const records: FullCognitiveSynchronizationRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);

  const regions =
    input.completionSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.completionSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "sync::full-cognition",
      syncType: "full_executive_cognition_synchronization",
      syncStrength: clamp01(
        input.environmentState.crossCognitiveSyncScore * 0.4 +
          input.orchestrationState.orchestrationCoherenceScore * 0.35
      ),
      explanation:
        "Full executive cognition synchronization may unify narratives, timelines, immersion, and recommendations into one platform.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::strategic-continuity",
      syncType: "strategic_continuity_orchestration",
      syncStrength: clamp01(
        input.presenceState.situationalContinuityScore * 0.45 +
          input.environmentState.environmentCoherenceScore * 0.35
      ),
      explanation:
        "Strategic continuity orchestration may preserve leadership coherence across the complete cognition environment.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::predictive-awareness",
      syncType: "predictive_awareness_coherence",
      syncStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Predictive-awareness coherence may align foresight with immersive simulations and operational timelines.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::narrative-timeline",
      syncType: "narrative_timeline_alignment",
      syncStrength: clamp01(
        input.narrativeState.narrativeClarityScore * 0.45 +
          input.timelineState.timelineClarityScore * 0.4
      ),
      explanation:
        "Narrative and timeline alignment may finalize unified executive understanding across recovery stabilization pathways.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::governance-presence",
      syncType: "governance_presence_continuity",
      syncStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.45 +
          input.presenceState.situationalContinuityScore * 0.35
      ),
      explanation:
        "Governance-presence continuity may sustain policy awareness within the completed executive environment.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::operational-stability",
      syncType: "operational_cognition_stability",
      syncStrength: clamp01(
        input.cognitiveUxState.cognitiveClarityScore * 0.4 +
          input.cognitiveLoadState.cognitiveBalanceScore * 0.35 +
          input.resilienceState.enterpriseResilienceScore * 0.2
      ),
      explanation:
        "Operational cognition stability may preserve enterprise-scale coherence across attention, load, and recovery systems.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveCognitiveCompletionDev("UnifiedCognition", {
    syncRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateOverallCognitiveCoherenceScore(input: {
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  environmentState: UnifiedExecutiveCognitiveEnvironmentIntelligenceState;
  presenceState: ExecutiveStrategicPresenceIntelligenceState;
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  cognitiveUxState: ExecutiveCognitiveUxState;
}): number {
  if (input.completionSignals.length === 0) return 0;
  const avgStrength =
    input.completionSignals.reduce((s, c) => s + c.completionStrength, 0) /
    input.completionSignals.length;
  return clamp01(
    avgStrength * 0.3 +
      input.environmentState.environmentCoherenceScore * 0.25 +
      input.presenceState.situationalContinuityScore * 0.15 +
      input.immersionState.immersionClarityScore * 0.1 +
      input.timelineState.timelineClarityScore * 0.1 +
      input.narrativeState.narrativeClarityScore * 0.08
  );
}

export function calculateFullCognitiveSyncScore(input: {
  syncRecords: readonly FullCognitiveSynchronizationRecord[];
}): number {
  if (input.syncRecords.length === 0) return 0;
  return clamp01(
    input.syncRecords.reduce((s, r) => s + r.syncStrength, 0) / input.syncRecords.length
  );
}

export function identifySynchronizedExecutiveZones(
  signals: readonly ExecutiveCognitiveCompletionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.completionState === "stable" ||
      signal.completionState === "coherent" ||
      signal.completionState === "synchronized"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyOrchestrationInstabilityZones(
  signals: readonly ExecutiveCognitiveCompletionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.completionState === "fragmented" || signal.completionState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveCompletionLabel(input: {
  overallCognitiveCoherenceScore: number;
  fullCognitiveSyncScore: number;
  platformCoherenceDegradationScore: number;
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
}): ExecutiveCognitiveCompletionIntelligenceState["executiveCompletionLabel"] {
  const critical = input.completionSignals.filter((s) => s.completionState === "critical").length;
  if (critical > 0 || input.platformCoherenceDegradationScore >= 0.68) return "critical";
  if (input.platformCoherenceDegradationScore >= 0.55) return "fragmented";
  const synchronized = input.completionSignals.filter(
    (s) => s.completionState === "synchronized"
  ).length;
  if (synchronized > 0 && input.fullCognitiveSyncScore >= 0.55) return "synchronized";
  if (input.fullCognitiveSyncScore >= 0.58 && input.overallCognitiveCoherenceScore >= 0.5) {
    return "coherent";
  }
  if (input.overallCognitiveCoherenceScore >= 0.55 && input.platformCoherenceDegradationScore < 0.4) {
    return "stable";
  }
  return input.platformCoherenceDegradationScore > input.overallCognitiveCoherenceScore
    ? "fragmented"
    : "coherent";
}
