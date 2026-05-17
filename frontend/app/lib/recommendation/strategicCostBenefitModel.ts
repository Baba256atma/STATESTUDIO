/**
 * D7:5:3 — Strategic cost/benefit tradeoff modeling.
 */

import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type {
  StrategicTradeoffSignal,
  StrategicTradeoffStateLabel,
  ExecutiveTradeoffState,
  StrategicCostBenefitRecord,
} from "./tradeoffAnalysisTypes.ts";
import { logTradeoffDev } from "./tradeoffDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function tradeoffStateFromScores(
  benefit: number,
  cost: number,
  volatility: number
): StrategicTradeoffStateLabel {
  if (volatility >= 0.72) return "critical";
  if (volatility >= 0.58 && benefit < cost) return "volatile";
  if (benefit >= 0.62 && cost < 0.45) return "favorable";
  if (cost >= 0.58 && benefit < 0.5) return "strained";
  if (Math.abs(benefit - cost) < 0.15) return "balanced";
  return benefit > cost ? "favorable" : "strained";
}

export function deriveStrategicTradeoffSignals(input: {
  topology: OperationalUniverseTopology;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  tradeoffLeverageFactor?: number;
  sacrificeStressFactor?: number;
}): StrategicTradeoffSignal[] {
  const tradeoffs: StrategicTradeoffSignal[] = [];
  const leverage = clamp01(input.tradeoffLeverageFactor ?? 0);
  const sacrifice = clamp01(input.sacrificeStressFactor ?? 0);

  for (const rec of input.recommendationState.activeRecommendations) {
    const inBenefit = input.recommendationState.stabilizationRecommendationZones.some((z) =>
      rec.affectedRegionIds.includes(z)
    );
    const inCost = input.recommendationState.criticalInterventionZones.some((z) =>
      rec.affectedRegionIds.includes(z)
    );

    const benefitBase = clamp01(
      rec.recommendationStrength * 0.35 +
        (inBenefit ? 0.2 : 0) +
        input.confidenceState.overallConfidenceScore * 0.2 +
        leverage * 0.1
    );
    const costBase = clamp01(
      (inCost ? 0.25 : 0) +
        input.preventionState.criticalThresholdProximityScore * 0.25 +
        sacrifice * 0.2 +
        (1 - input.adaptationState.strategicFlexibilityScore) * 0.15
    );
    const volatilityBase = clamp01(
      input.divergenceState.futureFragmentationScore * 0.35 +
        input.confidenceState.uncertaintyAmplificationScore * 0.3 +
        (input.momentumState.momentumTrendLabel === "accelerating_failure" ? 0.2 : 0)
    );

    const drivers: string[] = [];
    if (inBenefit) drivers.push("stabilization_benefit");
    if (inCost) drivers.push("operational_cost");
    if (rec.recommendationId.includes("recovery")) drivers.push("recovery_acceleration");
    if (rec.recommendationId.includes("dependency")) drivers.push("flexibility_sacrifice");

    const tradeoffState = tradeoffStateFromScores(benefitBase, costBase, volatilityBase);
    const tradeoffStrength = clamp01(
      benefitBase * 0.4 + (1 - costBase) * 0.35 + (1 - volatilityBase) * 0.25
    );

    if (tradeoffStrength < 0.28 && tradeoffState === "balanced") continue;

    tradeoffs.push(
      Object.freeze({
        tradeoffId: `tradeoff::${rec.recommendationId}`,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds]),
        tradeoffState,
        tradeoffStrength,
        dominantTradeoffDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Strategic tradeoffs may accompany ${rec.recommendationState} actions in affected regions`,
      })
    );
  }

  const recoveryRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("recovery-synchronization")
  );
  if (recoveryRec) {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff::recovery-coordination",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        tradeoffState: "strained",
        tradeoffStrength: clamp01(
          recoveryRec.recommendationStrength * 0.5 +
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.3
        ),
        dominantTradeoffDrivers: Object.freeze([
          "recovery_stabilization",
          "leadership_load",
        ]),
        executiveLabel:
          "Accelerating recovery coordination may improve stabilization although leadership load may increase",
      })
    );
  }

  const dependencyRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("dependency-concentration")
  );
  if (dependencyRec) {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff::dependency-flexibility",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        tradeoffState: "balanced",
        tradeoffStrength: clamp01(dependencyRec.recommendationStrength * 0.75),
        dominantTradeoffDrivers: Object.freeze([
          "fragility_reduction",
          "flexibility_sacrifice",
        ]),
        executiveLabel:
          "Reducing dependency concentration may lower fragility although operational flexibility may decrease",
      })
    );
  }

  const logisticsRec = input.recommendationState.activeRecommendations.find((r) =>
    r.recommendationId.includes("logistics-coordination")
  );
  if (logisticsRec) {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff::logistics-recovery",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        tradeoffState: "favorable",
        tradeoffStrength: clamp01(logisticsRec.recommendationStrength * 0.8),
        dominantTradeoffDrivers: Object.freeze([
          "dependency_fragility_reduction",
          "coordination_overhead",
        ]),
        executiveLabel:
          "Accelerating logistics recovery coordination may reduce future dependency fragility although short-term leadership load and operational rigidity are likely to increase",
      })
    );
  }

  if (input.adaptationState.predictiveAdaptationLabel === "flexible") {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff::restructuring-resilience",
        affectedRegionIds: Object.freeze(["manufacturing"]),
        tradeoffState: "volatile",
        tradeoffStrength: clamp01(input.adaptationState.adaptiveResilienceScore * 0.7),
        dominantTradeoffDrivers: Object.freeze([
          "long_term_resilience",
          "short_term_instability",
        ]),
        executiveLabel:
          "Aggressive restructuring may improve long-term resilience although short-term instability risk may rise",
      })
    );
  }

  if (tradeoffs.length === 0) {
    tradeoffs.push(
      Object.freeze({
        tradeoffId: "tradeoff::enterprise-balanced",
        affectedRegionIds: Object.freeze(["logistics"]),
        tradeoffState: "balanced",
        tradeoffStrength: 0.35,
        dominantTradeoffDrivers: Object.freeze(["limited_tradeoff_signal"]),
        executiveLabel:
          "Limited strategic tradeoff signals may emerge under current competing objective conditions",
      })
    );
  }

  logTradeoffDev("Tradeoff", { tradeoffCount: tradeoffs.length });
  return tradeoffs.sort((a, b) => a.tradeoffId.localeCompare(b.tradeoffId));
}

export function analyzeStrategicCostBenefit(input: {
  topology: OperationalUniverseTopology;
  tradeoffs: readonly StrategicTradeoffSignal[];
  recommendationState: StrategicRecommendationState;
  adaptationState: PredictiveStrategicAdaptationState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  preventionState: PredictiveCollapsePreventionState;
}): readonly StrategicCostBenefitRecord[] {
  const records: StrategicCostBenefitRecord[] = [];

  const logisticsTradeoff = input.tradeoffs.find((t) =>
    t.tradeoffId.includes("logistics-recovery")
  );
  if (logisticsTradeoff) {
    records.push(
      Object.freeze({
        recordId: "cost-benefit::logistics-recovery",
        regionId: "logistics",
        benefitType: "stabilization",
        costType: "leadership_load",
        benefitStrength: Number(Math.min(0.92, logisticsTradeoff.tradeoffStrength * 0.85).toFixed(4)),
        costStrength: Number(Math.min(0.92, 0.45 + sacrificeFromTradeoff(logisticsTradeoff)).toFixed(4)),
        explanation:
          "Increased coordination oversight may strengthen recovery stability although leadership load may increase.",
        contributingTradeoffIds: Object.freeze([logisticsTradeoff.tradeoffId]),
      })
    );
  }

  const dependencyTradeoff = input.tradeoffs.find((t) =>
    t.tradeoffId.includes("dependency-flexibility")
  );
  if (dependencyTradeoff) {
    records.push(
      Object.freeze({
        recordId: "cost-benefit::dependency-simplification",
        regionId: "manufacturing",
        benefitType: "fragility_reduction",
        costType: "flexibility_sacrifice",
        benefitStrength: Number(Math.min(0.92, dependencyTradeoff.tradeoffStrength * 0.8).toFixed(4)),
        costStrength: Number(Math.min(0.92, 0.5).toFixed(4)),
        explanation:
          "Operational simplification may reduce fragility although adaptability flexibility may decrease.",
        contributingTradeoffIds: Object.freeze([dependencyTradeoff.tradeoffId]),
      })
    );
  }

  const restructuring = input.tradeoffs.find((t) =>
    t.tradeoffId.includes("restructuring")
  );
  if (restructuring) {
    records.push(
      Object.freeze({
        recordId: "cost-benefit::restructuring",
        regionId: "manufacturing",
        benefitType: "resilience_gain",
        costType: "short_term_fragility",
        benefitStrength: Number(Math.min(0.92, restructuring.tradeoffStrength * 0.75).toFixed(4)),
        costStrength: Number(Math.min(0.92, 0.55).toFixed(4)),
        explanation:
          "Aggressive restructuring may improve long-term resilience although short-term operational fragility may increase.",
        contributingTradeoffIds: Object.freeze([restructuring.tradeoffId]),
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionTradeoffs = input.tradeoffs.filter((t) =>
      t.affectedRegionIds.includes(region.regionId)
    );
    if (regionTradeoffs.length === 0) continue;

    const favorable = regionTradeoffs.filter((t) => t.tradeoffState === "favorable");
    const strained = regionTradeoffs.filter((t) => t.tradeoffState === "strained");
    if (favorable.length === 0 && strained.length === 0) continue;

    records.push(
      Object.freeze({
        recordId: `cost-benefit::region::${region.regionId}`,
        regionId: region.regionId,
        benefitType: strained.length > favorable.length ? "equilibrium_restoration" : "recovery_acceleration",
        costType: strained.length > favorable.length ? "coordination_overhead" : "operational_rigidity",
        benefitStrength: Number(
          Math.min(
            0.92,
            favorable.reduce((s, t) => s + t.tradeoffStrength, 0) /
              Math.max(1, favorable.length) || 0
          ).toFixed(4)
        ),
        costStrength: Number(
          Math.min(
            0.92,
            strained.reduce((s, t) => s + t.tradeoffStrength, 0) /
              Math.max(1, strained.length) || 0
          ).toFixed(4)
        ),
        explanation: `Competing benefits and costs in ${region.label} may reshape how executives weigh stabilization actions.`,
        contributingTradeoffIds: Object.freeze(regionTradeoffs.map((t) => t.tradeoffId)),
      })
    );
  }

  logTradeoffDev("OperationalCost", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

function sacrificeFromTradeoff(tradeoff: StrategicTradeoffSignal): number {
  if (tradeoff.tradeoffState === "strained" || tradeoff.tradeoffState === "critical") {
    return tradeoff.tradeoffStrength * 0.6;
  }
  return tradeoff.tradeoffStrength * 0.35;
}

export function calculateStrategicBalanceScore(input: {
  tradeoffs: readonly StrategicTradeoffSignal[];
  costBenefitRecords: readonly StrategicCostBenefitRecord[];
}): number {
  const favorable = input.tradeoffs.filter(
    (t) => t.tradeoffState === "favorable" || t.tradeoffState === "balanced"
  );
  const netBenefit = input.costBenefitRecords.reduce(
    (s, r) => s + (r.benefitStrength - r.costStrength),
    0
  );
  const score = clamp01(
    (favorable.length / Math.max(1, input.tradeoffs.length)) * 0.4 +
      Math.max(0, netBenefit / Math.max(1, input.costBenefitRecords.length)) * 0.35 +
      0.25
  );
  logTradeoffDev("StrategicBalance", { strategicBalanceScore: score });
  return score;
}

export function calculateOperationalCostScore(input: {
  costBenefitRecords: readonly StrategicCostBenefitRecord[];
  preventionState: PredictiveCollapsePreventionState;
}): number {
  const score = clamp01(
    input.costBenefitRecords.reduce((s, r) => s + r.costStrength, 0) /
      Math.max(1, input.costBenefitRecords.length) *
      0.6 +
      input.preventionState.criticalThresholdProximityScore * 0.4
  );
  logTradeoffDev("OperationalCost", { operationalCostScore: score });
  return score;
}

export function calculateBenefitAsymmetryScore(input: {
  costBenefitRecords: readonly StrategicCostBenefitRecord[];
}): number {
  if (input.costBenefitRecords.length === 0) return 0;
  const asymmetry = input.costBenefitRecords.reduce(
    (s, r) => s + Math.abs(r.benefitStrength - r.costStrength),
    0
  );
  const score = clamp01(asymmetry / input.costBenefitRecords.length);
  logTradeoffDev("StrategicBalance", { benefitAsymmetryScore: score });
  return score;
}

export function identifyBenefitZones(
  tradeoffs: readonly StrategicTradeoffSignal[],
  recommendationState: StrategicRecommendationState
): readonly string[] {
  const zones = new Set<string>(recommendationState.resilienceSupportZones);
  for (const t of tradeoffs) {
    if (t.tradeoffState === "favorable" || t.tradeoffState === "balanced") {
      for (const r of t.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyOperationalCostZones(
  tradeoffs: readonly StrategicTradeoffSignal[],
  recommendationState: StrategicRecommendationState
): readonly string[] {
  const zones = new Set<string>(recommendationState.criticalInterventionZones);
  for (const t of tradeoffs) {
    if (t.tradeoffState === "strained" || t.tradeoffState === "volatile" || t.tradeoffState === "critical") {
      for (const r of t.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveTradeoffLabel(input: {
  strategicBalanceScore: number;
  operationalCostScore: number;
  benefitAsymmetryScore: number;
}): ExecutiveTradeoffState["executiveTradeoffLabel"] {
  if (input.operationalCostScore >= 0.7) return "critical";
  if (input.operationalCostScore >= 0.55) return "volatile";
  if (input.strategicBalanceScore >= 0.58 && input.benefitAsymmetryScore >= 0.35) {
    return "favorable";
  }
  if (input.strategicBalanceScore >= 0.45) return "balanced";
  if (input.operationalCostScore >= 0.45) return "strained";
  return "strained";
}
