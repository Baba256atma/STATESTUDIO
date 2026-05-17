/**
 * D7:6:6 — Multi-horizon timeline modeling for executive cognitive timelines.
 */

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
  CognitiveHorizonRecord,
  ExecutiveCognitiveTimelineIntelligenceState,
  ExecutiveTimelineSignal,
  ExecutiveTimelineStateLabel,
} from "./executiveCognitiveTimelineTypes.ts";
import { logExecutiveCognitiveTimelineDev } from "./cognitiveTimelineDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function timelineStateFromProfile(
  immediate: number,
  midTerm: number,
  longHorizon: number
): ExecutiveTimelineStateLabel {
  if (longHorizon >= 0.72 && immediate >= 0.55) return "critical";
  if (immediate >= 0.68) return "immediate";
  if (longHorizon >= 0.58) return "long_horizon";
  if (midTerm >= 0.55 && immediate >= 0.45) return "transitional";
  if (midTerm >= 0.48) return "developing";
  return immediate > midTerm ? "immediate" : "developing";
}

export function deriveExecutiveTimelineSignals(input: {
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
  timelineLeverageFactor?: number;
  horizonStressFactor?: number;
}): ExecutiveTimelineSignal[] {
  const leverage = clamp01(input.timelineLeverageFactor ?? 0);
  const stress = clamp01(input.horizonStressFactor ?? 0);

  const signals: ExecutiveTimelineSignal[] = [];

  const zoneSets = [
    input.narrativeState.fragmentedNarrativeZones,
    input.narrativeState.strategicNarrativeZones,
    input.insightPrioritizationState.elevatedInsightZones,
    input.foresightState.longHorizonRiskZones,
    input.foresightState.foresightOpportunityZones,
    input.cognitiveLoadState.overloadZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const immediate = clamp01(
      input.cognitiveLoadState.overloadEscalationScore * 0.3 +
        input.cascadeState.cascadePropagationScore * 0.25 +
        input.insightPrioritizationState.urgencyEscalationScore * 0.2 +
        leverage * 0.1
    );
    const midTerm = clamp01(
      input.recoveryOpportunityState.recoveryAccelerationScore * 0.35 +
        input.narrativeState.strategicContextScore * 0.25 +
        input.orchestrationState.orchestrationCoherenceScore * 0.2
    );
    const longHorizon = clamp01(
      input.foresightState.longHorizonRiskScore * 0.35 +
        input.foresightState.strategicPreparednessScore * 0.3 +
        input.resilienceState.enterpriseResilienceScore * 0.2 +
        stress * 0.1
    );

    const timelineState = timelineStateFromProfile(immediate, midTerm, longHorizon);
    const timelineStrength = clamp01(
      immediate * 0.35 + midTerm * 0.35 + longHorizon * 0.25
    );

    const drivers: string[] = [];
    if (timelineState === "immediate") drivers.push("operational_instability", "short_horizon_pressure");
    if (timelineState === "developing") drivers.push("emerging_evolution", "mid_term_signals");
    if (timelineState === "transitional") drivers.push("horizon_transition", "recovery_sequencing");
    if (timelineState === "long_horizon") drivers.push("resilience_transformation", "structural_evolution");
    if (timelineState === "critical") drivers.push("timeline_tension", "multi_horizon_conflict");

    signals.push(
      Object.freeze({
        timelineId: `timeline::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        timelineState,
        timelineStrength,
        dominantTimelineDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["timeline_assessment"]
        ),
        executiveLabel:
          timelineState === "critical" || timelineState === "immediate"
            ? "Executive timeline cognition may require attention across competing operational horizons"
            : timelineState === "long_horizon"
              ? "Long-horizon resilience framing may apply where structural transformation remains actionable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        timelineId: "timeline::fallback-horizon",
        affectedRegionIds: Object.freeze(fallback),
        timelineState: "developing",
        timelineStrength: clamp01(
          input.narrativeState.narrativeClarityScore * 0.4 + leverage * 0.2
        ),
        dominantTimelineDrivers: Object.freeze(["baseline_timeline_assessment"]),
        executiveLabel:
          "Baseline executive cognitive timeline assessment may apply across strategic operational regions",
      })
    );
  }

  logExecutiveCognitiveTimelineDev("Timeline", { timelineSignalCount: signals.length });
  return signals.sort((a, b) => a.timelineId.localeCompare(b.timelineId));
}

export function analyzeMultiHorizonTimelines(input: {
  timelineSignals: readonly ExecutiveTimelineSignal[];
  narrativeState: ExecutiveNarrativeIntelligenceState;
  insightPrioritizationState: ExecutiveInsightPrioritizationState;
  foresightState: PredictiveExecutiveForesightState;
  cognitiveLoadState: ExecutiveCognitiveLoadBalancingState;
  governanceState: ExecutiveStrategicGovernanceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
}): readonly CognitiveHorizonRecord[] {
  const records: CognitiveHorizonRecord[] = [];
  const timelineIds = input.timelineSignals.map((t) => t.timelineId);

  const regions =
    input.timelineSignals.flatMap((t) => t.affectedRegionIds).length > 0
      ? [...new Set(input.timelineSignals.flatMap((t) => t.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "horizon::immediate-operational",
      horizonType: "immediate_operational_timeline",
      horizonStrength: clamp01(
        input.cognitiveLoadState.overloadEscalationScore * 0.45 +
          input.cascadeState.cascadePropagationScore * 0.35
      ),
      explanation:
        "Immediate operational timelines may elevate short-horizon fragility risk when instability escalates across enterprise intelligence surfaces.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "horizon::mid-term-recovery",
      horizonType: "mid_term_recovery_evolution",
      horizonStrength: clamp01(
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.5 +
          input.recoveryOpportunityState.stabilizationPotentialScore * 0.3
      ),
      explanation:
        "Mid-term recovery evolution may frame how coordination improvements gradually stabilize operational synchronization.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "horizon::long-resilience",
      horizonType: "long_horizon_resilience_transformation",
      horizonStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.45 +
          input.resilienceState.enterpriseResilienceScore * 0.35
      ),
      explanation:
        "Long-horizon resilience transformation may contextualize structural evolution without unsupported future claims.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "horizon::predictive-divergence",
      horizonType: "predictive_divergence_sequencing",
      horizonStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.45 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Predictive divergence sequencing may connect future pathway fragmentation to executive timeline cognition.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "horizon::stabilization-progression",
      horizonType: "stabilization_progression",
      horizonStrength: clamp01(
        input.narrativeState.narrativeClarityScore * 0.4 +
          input.orchestrationState.orchestrationCoherenceScore * 0.35
      ),
      explanation:
        "Stabilization progression may indicate how narrative clarity supports temporal coherence across horizons.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "horizon::governance-timeline",
      horizonType: "governance_timeline_relationship",
      horizonStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.45 +
          input.governanceState.oversightRequirementScore * 0.35
      ),
      explanation:
        "Governance-timeline relationships may integrate policy sensitivity across immediate and long-horizon cognition.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveCognitiveTimelineDev("HorizonModel", { horizonRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateTimelineClarityScore(input: {
  timelineSignals: readonly ExecutiveTimelineSignal[];
  narrativeState: ExecutiveNarrativeIntelligenceState;
  foresightState: PredictiveExecutiveForesightState;
}): number {
  if (input.timelineSignals.length === 0) return 0;
  const avgStrength =
    input.timelineSignals.reduce((s, t) => s + t.timelineStrength, 0) /
    input.timelineSignals.length;
  return clamp01(
    avgStrength * 0.4 +
      input.narrativeState.narrativeClarityScore * 0.3 +
      input.foresightState.futureReadinessScore * 0.25
  );
}

export function calculateMultiHorizonScore(input: {
  horizonRecords: readonly CognitiveHorizonRecord[];
}): number {
  if (input.horizonRecords.length === 0) return 0;
  return clamp01(
    input.horizonRecords.reduce((s, r) => s + r.horizonStrength, 0) /
      input.horizonRecords.length
  );
}

export function identifyImmediatePriorityZones(
  signals: readonly ExecutiveTimelineSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.timelineState === "immediate" || signal.timelineState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyFragmentedTimelineZones(
  signals: readonly ExecutiveTimelineSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.timelineState === "transitional" ||
      signal.timelineState === "critical" ||
      signal.timelineState === "developing"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveTimelineLabel(input: {
  timelineClarityScore: number;
  multiHorizonScore: number;
  timelineFragmentationScore: number;
  timelineSignals: readonly ExecutiveTimelineSignal[];
}): ExecutiveCognitiveTimelineIntelligenceState["executiveTimelineLabel"] {
  const critical = input.timelineSignals.filter((t) => t.timelineState === "critical").length;
  if (critical > 0 || input.timelineFragmentationScore >= 0.68) return "critical";
  if (input.timelineFragmentationScore >= 0.55) return "immediate";
  const longHorizon = input.timelineSignals.filter((t) => t.timelineState === "long_horizon").length;
  if (longHorizon > 0 && input.multiHorizonScore >= 0.55) return "long_horizon";
  if (input.multiHorizonScore >= 0.58) return "transitional";
  if (input.multiHorizonScore >= 0.45 && input.timelineClarityScore < 0.45) {
    return "developing";
  }
  if (input.timelineClarityScore >= 0.55 && input.timelineFragmentationScore < 0.4) {
    return "immediate";
  }
  return input.timelineFragmentationScore > input.timelineClarityScore
    ? "transitional"
    : "developing";
}
