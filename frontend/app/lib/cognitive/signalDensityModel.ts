/**
 * D7:6:3 — Signal-density modeling.
 */

import type { ExecutiveAttentionRoutingState } from "./executiveAttentionRoutingTypes.ts";
import type { ExecutiveCognitiveUxState } from "./executiveCognitiveUxTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  ExecutiveCognitiveLoadBalancingState,
  ExecutiveCognitiveLoadSignal,
  ExecutiveCognitiveLoadStateLabel,
  SignalDensityRecord,
} from "./executiveCognitiveLoadTypes.ts";
import { logExecutiveCognitiveLoadBalancingDev } from "./cognitiveLoadBalancingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function loadStateFromProfile(
  balance: number,
  density: number,
  overload: number
): ExecutiveCognitiveLoadStateLabel {
  if (overload >= 0.72) return "critical";
  if (overload >= 0.58) return "overloaded";
  if (density >= 0.62) return "dense";
  if (density >= 0.48 && balance < 0.42) return "elevated";
  if (balance >= 0.55 && overload < 0.4) return "balanced";
  return density > balance ? "dense" : "elevated";
}

export function deriveExecutiveCognitiveLoadSignals(input: {
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  loadLeverageFactor?: number;
  overloadStressFactor?: number;
}): ExecutiveCognitiveLoadSignal[] {
  const leverage = clamp01(input.loadLeverageFactor ?? 0);
  const stress = clamp01(input.overloadStressFactor ?? 0);

  const signals: ExecutiveCognitiveLoadSignal[] = [];

  const zoneSets = [
    input.attentionRoutingState.highPriorityAttentionZones,
    input.attentionRoutingState.fragmentedAttentionZones,
    input.cognitiveUxState.cognitiveOverloadZones,
    input.cognitiveUxState.attentionPriorityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const balance = clamp01(
      input.attentionRoutingState.focusStabilityScore * 0.25 +
        input.cognitiveUxState.cognitiveClarityScore * 0.25 +
        (1 - input.cognitiveUxState.cognitiveLoadScore) * 0.2 +
        leverage * 0.1
    );
    const density = clamp01(
      input.cognitiveUxState.cognitiveLoadScore * 0.28 +
        input.attentionRoutingState.attentionFragmentationScore * 0.25 +
        input.orchestrationState.orchestrationInstabilityScore * 0.2 +
        stress * 0.12
    );
    const overload = clamp01(
      input.cascadeState.cascadePropagationScore * 0.3 +
        input.divergenceState.futureFragmentationScore * 0.28 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2
    );

    const loadState = loadStateFromProfile(balance, density, overload);
    const loadStrength = clamp01(balance * 0.35 + (1 - density) * 0.3 + (1 - overload) * 0.25);

    const drivers: string[] = [];
    if (loadState === "balanced") drivers.push("stable_equilibrium", "low_density");
    if (loadState === "elevated") drivers.push("moderate_density", "rising_urgency");
    if (loadState === "dense") drivers.push("signal_density", "complexity_concentration");
    if (loadState === "overloaded") drivers.push("competing_crises", "alert_saturation");
    if (loadState === "critical") drivers.push("overload_escalation", "fatigue_risk");

    signals.push(
      Object.freeze({
        loadId: `load::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        loadState,
        loadStrength,
        dominantLoadDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["load_assessment"]
        ),
        executiveLabel:
          loadState === "overloaded" || loadState === "critical"
            ? "Cognitive load balancing may be required for operational intelligence in this zone cluster"
            : loadState === "balanced"
              ? "Lower cognitive intensity may apply where recovery and equilibrium remain stable"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        loadId: "load::fallback-balance",
        affectedRegionIds: Object.freeze(fallback),
        loadState: "elevated",
        loadStrength: clamp01(
          input.cognitiveUxState.cognitiveLoadScore * 0.4 + leverage * 0.2
        ),
        dominantLoadDrivers: Object.freeze(["baseline_load_assessment"]),
        executiveLabel: "Baseline executive cognitive load assessment may apply across operational regions",
      })
    );
  }

  logExecutiveCognitiveLoadBalancingDev("CognitiveLoad", { loadSignalCount: signals.length });
  return signals.sort((a, b) => a.loadId.localeCompare(b.loadId));
}

export function analyzeSignalDensity(input: {
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  attentionRoutingState: ExecutiveAttentionRoutingState;
  cognitiveUxState: ExecutiveCognitiveUxState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly SignalDensityRecord[] {
  const records: SignalDensityRecord[] = [];
  const loadIds = input.loadSignals.map((l) => l.loadId);

  const regions =
    input.loadSignals.flatMap((l) => l.affectedRegionIds).length > 0
      ? [...new Set(input.loadSignals.flatMap((l) => l.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const signalCount =
    input.loadSignals.length +
    input.cognitiveUxState.activeCognitiveSignals.length +
    input.attentionRoutingState.activeAttentionRoutes.length;

  records.push(
    Object.freeze({
      recordId: "density::operational-signal-density",
      densityType: "operational_signal_density",
      densityStrength: clamp01(signalCount / 14),
      explanation:
        "Operational signal density may elevate cognitive load when multiple intelligence layers emit concurrent indicators.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "density::predictive-complexity",
      densityType: "predictive_complexity",
      densityStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.45 +
          input.trajectoryState.trajectoryVolatilityScore * 0.4
      ),
      explanation:
        "Predictive complexity concentration may intensify when future divergence and trajectory volatility rise together.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "density::advisory-overload",
      densityType: "advisory_overload",
      densityStrength: clamp01(
        (1 - input.advisoryState.advisoryClarityScore) * 0.45 +
          (input.advisoryState.executiveAdvisoryLabel === "critical" ? 0.35 : 0.15)
      ),
      explanation:
        "Advisory overload conditions may form when advisory escalation coincides with reduced clarity across pathways.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "density::urgency-saturation",
      densityType: "urgency_saturation",
      densityStrength: clamp01(
        input.cascadeState.cascadePropagationScore * 0.45 +
          input.orchestrationState.orchestrationInstabilityScore * 0.35
      ),
      explanation:
        "Urgency saturation may require cognitive balancing when cascade and orchestration instability escalate simultaneously.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "density::strategic-focus-balancing",
      densityType: "strategic_focus_balancing",
      densityStrength: clamp01(
        input.cognitiveUxState.attentionPriorityScore * 0.4 +
          (1 - input.cognitiveUxState.cognitiveLoadScore) * 0.35
      ),
      explanation:
        "Strategic focus balancing may distribute cognitive workload when attention priority remains high under contained load.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "density::governance-alert-accumulation",
      densityType: "governance_alert_accumulation",
      densityStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.5 +
          input.governanceState.oversightRequirementScore * 0.35
      ),
      explanation:
        "Governance-alert accumulation may elevate cognitive load when oversight requirements rise without autonomous enforcement.",
      contributingLoadIds: Object.freeze(loadIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logExecutiveCognitiveLoadBalancingDev("SignalDensity", { densityRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCognitiveBalanceScore(input: {
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
  cognitiveUxState: ExecutiveCognitiveUxState;
  attentionRoutingState: ExecutiveAttentionRoutingState;
}): number {
  if (input.loadSignals.length === 0) return 0;
  const avg =
    input.loadSignals.reduce((s, l) => s + l.loadStrength, 0) / input.loadSignals.length;
  return clamp01(
    avg * 0.35 +
      input.cognitiveUxState.cognitiveClarityScore * 0.3 +
      input.attentionRoutingState.focusStabilityScore * 0.25
  );
}

export function calculateSignalDensityScore(input: {
  densityRecords: readonly SignalDensityRecord[];
}): number {
  if (input.densityRecords.length === 0) return 0;
  return clamp01(
    input.densityRecords.reduce((s, r) => s + r.densityStrength, 0) /
      input.densityRecords.length
  );
}

export function identifyOverloadZones(
  signals: readonly ExecutiveCognitiveLoadSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.loadState === "overloaded" ||
      signal.loadState === "critical" ||
      signal.loadState === "dense"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyStabilizedAttentionZones(
  signals: readonly ExecutiveCognitiveLoadSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.loadState === "balanced" || signal.loadState === "elevated") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveCognitiveLoadLabel(input: {
  cognitiveBalanceScore: number;
  signalDensityScore: number;
  overloadEscalationScore: number;
  loadSignals: readonly ExecutiveCognitiveLoadSignal[];
}): ExecutiveCognitiveLoadBalancingState["executiveCognitiveLoadLabel"] {
  const critical = input.loadSignals.filter((l) => l.loadState === "critical").length;
  if (critical > 0 || input.overloadEscalationScore >= 0.68) return "critical";
  if (input.overloadEscalationScore >= 0.55) return "overloaded";
  if (input.signalDensityScore >= 0.58) return "dense";
  if (input.signalDensityScore >= 0.45 && input.cognitiveBalanceScore < 0.45) {
    return "elevated";
  }
  if (input.cognitiveBalanceScore >= 0.55 && input.overloadEscalationScore < 0.4) {
    return "balanced";
  }
  return input.overloadEscalationScore > input.cognitiveBalanceScore ? "overloaded" : "elevated";
}
