/**
 * D7:6:8 — Situational-awareness modeling for executive strategic presence.
 */

import type { ExecutiveScenarioImmersionIntelligenceState } from "./executiveScenarioImmersionTypes.ts";
import type { ExecutiveCognitiveTimelineIntelligenceState } from "./executiveCognitiveTimelineTypes.ts";
import type { ExecutiveNarrativeIntelligenceState } from "./executiveNarrativeTypes.ts";
import type { ExecutiveInsightPrioritizationState } from "./executiveInsightPrioritizationTypes.ts";
import type { ExecutiveCognitiveLoadBalancingState } from "./executiveCognitiveLoadTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type {
  ExecutiveStrategicPresenceIntelligenceState,
  ExecutiveStrategicPresenceSignal,
  ExecutiveStrategicPresenceStateLabel,
  SituationalAwarenessLayerRecord,
} from "./executiveStrategicPresenceTypes.ts";
import { logExecutiveStrategicPresenceDev } from "./strategicPresenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function presenceStateFromProfile(
  continuity: number,
  volatility: number,
  fragmentation: number
): ExecutiveStrategicPresenceStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmented";
  if (continuity >= 0.62 && volatility < 0.5) return "sustained";
  if (continuity >= 0.48) return "focused";
  if (continuity >= 0.35 && fragmentation < 0.4) return "aware";
  return volatility > continuity ? "fragmented" : "focused";
}

export function deriveExecutiveStrategicPresenceSignals(input: {
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  foresightState: PredictiveExecutiveForesightState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  presenceLeverageFactor?: number;
  continuityStressFactor?: number;
}): ExecutiveStrategicPresenceSignal[] {
  const leverage = clamp01(input.presenceLeverageFactor ?? 0);
  const stress = clamp01(input.continuityStressFactor ?? 0);

  const signals: ExecutiveStrategicPresenceSignal[] = [];

  const zoneSets = [
    input.immersionState.deepExplorationZones,
    input.immersionState.cognitiveImmersionRiskZones,
    input.timelineState.immediatePriorityZones,
    input.timelineState.fragmentedTimelineZones,
    input.narrativeState.strategicNarrativeZones,
    input.narrativeState.fragmentedNarrativeZones,
    input.insightPrioritizationState.elevatedInsightZones,
    input.foresightState.foresightOpportunityZones,
    input.foresightState.longHorizonRiskZones,
    input.cognitiveLoadState.overloadZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const continuity = clamp01(
      input.immersionState.immersionClarityScore * 0.2 +
        input.timelineState.timelineClarityScore * 0.25 +
        input.narrativeState.narrativeClarityScore * 0.25 +
        input.orchestrationState.orchestrationCoherenceScore * 0.15 +
        leverage * 0.1
    );
    const volatility = clamp01(
      input.divergenceState.futureFragmentationScore * 0.3 +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        input.immersionState.immersionOverloadScore * 0.2 +
        stress * 0.12
    );
    const fragmentation = clamp01(
      input.timelineState.timelineFragmentationScore * 0.3 +
        input.narrativeState.narrativeFragmentationScore * 0.25 +
        input.cognitiveLoadState.overloadEscalationScore * 0.25 +
        input.immersionState.immersionOverloadScore * 0.15
    );

    const presenceState = presenceStateFromProfile(continuity, volatility, fragmentation);
    const presenceStrength = clamp01(
      continuity * 0.4 + (1 - fragmentation) * 0.35 + (1 - volatility) * 0.2
    );

    const drivers: string[] = [];
    if (presenceState === "aware") drivers.push("baseline_awareness", "situational_scan");
    if (presenceState === "focused") drivers.push("strategic_focus", "context_retention");
    if (presenceState === "sustained") drivers.push("continuity_maintenance", "cross_domain_clarity");
    if (presenceState === "fragmented") drivers.push("branch_divergence", "volatility_pressure");
    if (presenceState === "critical") drivers.push("presence_fragmentation", "continuity_risk");

    signals.push(
      Object.freeze({
        presenceId: `presence::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        presenceState,
        presenceStrength,
        dominantPresenceDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["presence_assessment"]
        ),
        executiveLabel:
          presenceState === "sustained" || presenceState === "focused"
            ? "Strategic presence may sustain operational awareness across evolving recovery and fragility conditions"
            : presenceState === "fragmented" || presenceState === "critical"
              ? "Strategic presence may require consolidation when disconnected future branches reduce situational continuity"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        presenceId: "presence::fallback-awareness",
        affectedRegionIds: Object.freeze(fallback),
        presenceState: "aware",
        presenceStrength: clamp01(
          input.timelineState.timelineClarityScore * 0.35 +
            input.immersionState.immersionClarityScore * 0.25 +
            leverage * 0.2
        ),
        dominantPresenceDrivers: Object.freeze(["baseline_presence_assessment"]),
        executiveLabel:
          "Baseline executive strategic presence assessment may apply across operational regions",
      })
    );
  }

  logExecutiveStrategicPresenceDev("StrategicPresence", {
    presenceSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.presenceId.localeCompare(b.presenceId));
}

export function analyzeSituationalAwarenessLayers(input: {
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
  foresightState: PredictiveExecutiveForesightState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly SituationalAwarenessLayerRecord[] {
  const records: SituationalAwarenessLayerRecord[] = [];
  const presenceIds = input.presenceSignals.map((s) => s.presenceId);

  const regions =
    input.presenceSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.presenceSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "layer::operational-awareness",
      layerType: "operational_awareness_continuity",
      layerStrength: clamp01(
        input.cognitiveLoadState.signalDensityScore * 0.35 +
          input.cascadeState.cascadePropagationScore * 0.35 +
          input.immersionState.multiLayerScenarioScore * 0.2
      ),
      explanation:
        "Operational awareness continuity may preserve understanding of recovery progression and fragility escalation across decision cycles.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::strategic-context",
      layerType: "strategic_context_retention",
      layerStrength: clamp01(
        input.narrativeState.narrativeClarityScore * 0.45 +
          input.narrativeState.strategicContextScore * 0.35
      ),
      explanation:
        "Strategic context retention may help executives maintain coherent narratives during high-volatility scenarios.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::resilience-sync",
      layerType: "resilience_awareness_synchronization",
      layerStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Resilience-awareness synchronization may align executive cognition with evolving recovery trajectories and stabilization pathways.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::governance-awareness",
      layerType: "governance_pressure_awareness",
      layerStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.45 +
          input.governanceState.oversightRequirementScore * 0.35
      ),
      explanation:
        "Governance-pressure awareness may track how policy sensitivity evolves without losing executive situational clarity.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::predictive-evolution",
      layerType: "predictive_evolution_understanding",
      layerStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Predictive evolution understanding may contextualize strategic divergence without overstating future outcomes.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::cross-domain",
      layerType: "cross_domain_situational_cognition",
      layerStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.immersionState.immersionClarityScore * 0.3
      ),
      explanation:
        "Cross-domain situational cognition may sustain awareness across logistics, finance, and recovery systems during complex cycles.",
      contributingPresenceIds: Object.freeze(presenceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveStrategicPresenceDev("SituationalAwareness", {
    layerRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateSituationalContinuityScore(input: {
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
  immersionState: ExecutiveScenarioImmersionIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
  narrativeState: ExecutiveNarrativeIntelligenceState;
}): number {
  if (input.presenceSignals.length === 0) return 0;
  const avgStrength =
    input.presenceSignals.reduce((s, p) => s + p.presenceStrength, 0) /
    input.presenceSignals.length;
  return clamp01(
    avgStrength * 0.35 +
      input.immersionState.immersionClarityScore * 0.25 +
      input.timelineState.timelineClarityScore * 0.2 +
      input.narrativeState.narrativeClarityScore * 0.15
  );
}

export function calculateMultiLayerAwarenessScore(input: {
  layerRecords: readonly SituationalAwarenessLayerRecord[];
}): number {
  if (input.layerRecords.length === 0) return 0;
  return clamp01(
    input.layerRecords.reduce((s, r) => s + r.layerStrength, 0) / input.layerRecords.length
  );
}

export function identifySustainedAwarenessZones(
  signals: readonly ExecutiveStrategicPresenceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.presenceState === "aware" ||
      signal.presenceState === "focused" ||
      signal.presenceState === "sustained"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedPresenceZones(
  signals: readonly ExecutiveStrategicPresenceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.presenceState === "fragmented" || signal.presenceState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutivePresenceLabel(input: {
  situationalContinuityScore: number;
  multiLayerAwarenessScore: number;
  presenceFragmentationScore: number;
  presenceSignals: readonly ExecutiveStrategicPresenceSignal[];
}): ExecutiveStrategicPresenceIntelligenceState["executivePresenceLabel"] {
  const critical = input.presenceSignals.filter((s) => s.presenceState === "critical").length;
  if (critical > 0 || input.presenceFragmentationScore >= 0.68) return "critical";
  if (input.presenceFragmentationScore >= 0.55) return "fragmented";
  const sustained = input.presenceSignals.filter((s) => s.presenceState === "sustained").length;
  if (sustained > 0 && input.multiLayerAwarenessScore >= 0.55) return "sustained";
  if (input.multiLayerAwarenessScore >= 0.58) return "focused";
  if (input.situationalContinuityScore >= 0.55 && input.presenceFragmentationScore < 0.4) {
    return "aware";
  }
  return input.presenceFragmentationScore > input.situationalContinuityScore
    ? "fragmented"
    : "focused";
}
