/**
 * D7:6:7 — Multi-layer scenario modeling for executive immersion.
 */

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
  ExecutiveScenarioImmersionIntelligenceState,
  ExecutiveScenarioImmersionSignal,
  ExecutiveScenarioImmersionStateLabel,
  ScenarioEvolutionLayerRecord,
} from "./executiveScenarioImmersionTypes.ts";
import { logExecutiveScenarioImmersionDev } from "./scenarioImmersionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function immersionStateFromProfile(
  exploration: number,
  complexity: number,
  overload: number
): ExecutiveScenarioImmersionStateLabel {
  if (overload >= 0.72) return "critical";
  if (overload >= 0.58) return "overloaded";
  if (complexity >= 0.62 && exploration >= 0.5) return "immersed";
  if (exploration >= 0.48) return "engaged";
  if (exploration >= 0.35 && overload < 0.4) return "observational";
  return complexity > exploration ? "engaged" : "observational";
}

export function deriveExecutiveScenarioImmersionSignals(input: {
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
  immersionLeverageFactor?: number;
  explorationStressFactor?: number;
}): ExecutiveScenarioImmersionSignal[] {
  const leverage = clamp01(input.immersionLeverageFactor ?? 0);
  const stress = clamp01(input.explorationStressFactor ?? 0);

  const signals: ExecutiveScenarioImmersionSignal[] = [];

  const zoneSets = [
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

    const exploration = clamp01(
      input.narrativeState.narrativeClarityScore * 0.25 +
        input.timelineState.timelineClarityScore * 0.25 +
        input.foresightState.futureReadinessScore * 0.2 +
        leverage * 0.1
    );
    const complexity = clamp01(
      input.divergenceState.futureFragmentationScore * 0.3 +
        input.cascadeState.cascadePropagationScore * 0.25 +
        input.narrativeState.strategicContextScore * 0.2 +
        stress * 0.12
    );
    const overload = clamp01(
      input.cognitiveLoadState.overloadEscalationScore * 0.35 +
        input.timelineState.timelineFragmentationScore * 0.3 +
        input.insightPrioritizationState.urgencyEscalationScore * 0.2
    );

    const immersionState = immersionStateFromProfile(exploration, complexity, overload);
    const immersionStrength = clamp01(
      exploration * 0.35 + complexity * 0.35 + (1 - overload) * 0.25
    );

    const drivers: string[] = [];
    if (immersionState === "observational") drivers.push("passive_observation", "baseline_exploration");
    if (immersionState === "engaged") drivers.push("active_engagement", "scenario_curiosity");
    if (immersionState === "immersed") drivers.push("deep_understanding", "multi_layer_context");
    if (immersionState === "overloaded") drivers.push("branch_saturation", "volatility_pressure");
    if (immersionState === "critical") drivers.push("immersion_overload", "exploration_risk");

    signals.push(
      Object.freeze({
        immersionId: `immersion::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        immersionState,
        immersionStrength,
        dominantImmersionDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["immersion_assessment"]
        ),
        executiveLabel:
          immersionState === "immersed" || immersionState === "engaged"
            ? "Scenario immersion may deepen operational understanding across evolving strategic pathways"
            : immersionState === "overloaded" || immersionState === "critical"
              ? "Scenario immersion may require simplification when future branches exceed executive exploration capacity"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        immersionId: "immersion::fallback-exploration",
        affectedRegionIds: Object.freeze(fallback),
        immersionState: "observational",
        immersionStrength: clamp01(
          input.timelineState.timelineClarityScore * 0.4 + leverage * 0.2
        ),
        dominantImmersionDrivers: Object.freeze(["baseline_immersion_assessment"]),
        executiveLabel:
          "Baseline executive scenario immersion assessment may apply across strategic operational regions",
      })
    );
  }

  logExecutiveScenarioImmersionDev("ScenarioImmersion", {
    immersionSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.immersionId.localeCompare(b.immersionId));
}

export function analyzeMultiLayerScenarios(input: {
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
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
}): readonly ScenarioEvolutionLayerRecord[] {
  const records: ScenarioEvolutionLayerRecord[] = [];
  const immersionIds = input.immersionSignals.map((s) => s.immersionId);

  const regions =
    input.immersionSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.immersionSignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "layer::operational-evolution",
      layerType: "operational_evolution",
      layerStrength: clamp01(
        input.cognitiveLoadState.signalDensityScore * 0.4 +
          input.cascadeState.cascadePropagationScore * 0.35
      ),
      explanation:
        "Operational evolution layers may show how dependency fragility spreads through future operational timelines during immersive exploration.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::predictive-progression",
      layerType: "predictive_future_progression",
      layerStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.45 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Predictive future progression may contextualize how branching pathways evolve under strategic volatility.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::resilience-pathway",
      layerType: "resilience_transformation_pathway",
      layerStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Resilience transformation pathways may illustrate how stabilization decisions reshape future resilience structures.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::governance-evolution",
      layerType: "governance_pressure_evolution",
      layerStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.45 +
          input.governanceState.oversightRequirementScore * 0.35
      ),
      explanation:
        "Governance-pressure evolution may trace how policy sensitivity accumulates across immersive scenario horizons.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::consequence-propagation",
      layerType: "strategic_consequence_propagation",
      layerStrength: clamp01(
        input.orchestrationState.orchestrationInstabilityScore * 0.4 +
          input.narrativeState.narrativeFragmentationScore * 0.35
      ),
      explanation:
        "Strategic consequence propagation may connect executive decisions to future equilibrium and systemic volatility shifts.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "layer::recovery-sequencing",
      layerType: "recovery_sequencing_immersion",
      layerStrength: clamp01(
        input.recoveryOpportunityState.recoveryAccelerationScore * 0.55 +
          input.timelineState.multiHorizonScore * 0.25
      ),
      explanation:
        "Recovery sequencing immersion may explore how stabilization progression reshapes coordination across operational horizons.",
      contributingImmersionIds: Object.freeze(immersionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveScenarioImmersionDev("OperationalEvolution", {
    layerRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateImmersionClarityScore(input: {
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
  narrativeState: ExecutiveNarrativeIntelligenceState;
  timelineState: ExecutiveCognitiveTimelineIntelligenceState;
}): number {
  if (input.immersionSignals.length === 0) return 0;
  const avgStrength =
    input.immersionSignals.reduce((s, i) => s + i.immersionStrength, 0) /
    input.immersionSignals.length;
  return clamp01(
    avgStrength * 0.4 +
      input.narrativeState.narrativeClarityScore * 0.3 +
      input.timelineState.timelineClarityScore * 0.25
  );
}

export function calculateMultiLayerScenarioScore(input: {
  layerRecords: readonly ScenarioEvolutionLayerRecord[];
}): number {
  if (input.layerRecords.length === 0) return 0;
  return clamp01(
    input.layerRecords.reduce((s, r) => s + r.layerStrength, 0) / input.layerRecords.length
  );
}

export function identifyDeepExplorationZones(
  signals: readonly ExecutiveScenarioImmersionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.immersionState === "engaged" ||
      signal.immersionState === "immersed" ||
      signal.immersionState === "observational"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyCognitiveImmersionRiskZones(
  signals: readonly ExecutiveScenarioImmersionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.immersionState === "overloaded" || signal.immersionState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveImmersionLabel(input: {
  immersionClarityScore: number;
  multiLayerScenarioScore: number;
  immersionOverloadScore: number;
  immersionSignals: readonly ExecutiveScenarioImmersionSignal[];
}): ExecutiveScenarioImmersionIntelligenceState["executiveImmersionLabel"] {
  const critical = input.immersionSignals.filter((s) => s.immersionState === "critical").length;
  if (critical > 0 || input.immersionOverloadScore >= 0.68) return "critical";
  if (input.immersionOverloadScore >= 0.55) return "overloaded";
  const immersed = input.immersionSignals.filter((s) => s.immersionState === "immersed").length;
  if (immersed > 0 && input.multiLayerScenarioScore >= 0.55) return "immersed";
  if (input.multiLayerScenarioScore >= 0.58) return "engaged";
  if (input.immersionClarityScore >= 0.55 && input.immersionOverloadScore < 0.4) {
    return "observational";
  }
  return input.immersionOverloadScore > input.immersionClarityScore ? "overloaded" : "engaged";
}
