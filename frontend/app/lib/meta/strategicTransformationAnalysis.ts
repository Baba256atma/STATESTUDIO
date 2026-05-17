/**
 * D7:8:6 — Strategic-transformation analysis for intelligence evolution.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type {
  LongHorizonEvolutionRecord,
  StrategicTransformationRecord,
  StrategicIntelligenceEvolutionSignal,
} from "./strategicIntelligenceEvolutionTypes.ts";
import { logStrategicIntelligenceEvolutionDev } from "./strategicIntelligenceEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicTransformation(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  longHorizonEvolutionRecords: readonly LongHorizonEvolutionRecord[];
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicTransformationRecord[] {
  const records: StrategicTransformationRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  const unstableSignals = input.evolutionSignals.filter(
    (s) => s.evolutionState === "transforming" || s.evolutionState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "transformation::unstable-transformation",
      transformationType: "unstable_strategic_transformation",
      transformationStrength: clamp01(
        unstableSignals / Math.max(1, input.evolutionSignals.length) * 0.5 +
          input.strategicDriftState.longHorizonDriftScore * 0.35
      ),
      explanation:
        "Operational adaptation improving while predictive coherence weakens may signal strategic transformation instability.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transformation::degrading-structures",
      transformationType: "degrading_intelligence_structures",
      transformationStrength: clamp01(
        input.strategicDriftState.strategicDriftInstabilityScore * 0.45 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Degrading intelligence structures may indicate negative strategic evolution when optimization fragility compounds continuity degradation.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transformation::resilience-adaptation",
      transformationType: "resilience_driven_adaptation",
      transformationStrength: clamp01(
        input.strategicResilienceState.adaptiveRecoveryScore * 0.45 +
          (input.longHorizonEvolutionRecords.find((r) =>
            r.recordId.includes("resilience-maturity")
          )?.evolutionStrength ?? 0.35)
      ),
      explanation:
        "Resilience-driven adaptation may mature strategic intelligence when repeated recovery strengthens governance coordination.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transformation::governance-instability",
      transformationType: "governance_evolution_instability",
      transformationStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.metaStrategicState.metaInstabilityScore * 0.3
      ),
      explanation:
        "Governance-evolution instability may weaken transformation pathways when leadership overload compounds continuity degradation.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transformation::continuity-fragmentation",
      transformationType: "continuity_fragmentation_risk",
      transformationStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicDriftState.strategicDriftInstabilityScore * 0.35
      ),
      explanation:
        "Continuity-fragmentation risk may elevate when long-horizon transformation pathways diverge without shared coherence.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transformation::strategic-contradiction",
      transformationType: "long_horizon_strategic_contradiction",
      transformationStrength: clamp01(
        input.strategicPatternState.patternInstabilityScore * 0.4 +
          input.strategicDriftState.longHorizonDriftScore * 0.35 +
          (input.longHorizonEvolutionRecords.find((r) =>
            r.recordId.includes("predictive-refinement")
          )?.evolutionStrength ?? 0.3)
      ),
      explanation:
        "Long-horizon strategic contradictions may emerge when predictive refinement and operational adaptation pull cognition in opposing directions.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceEvolutionDev("MetaTransformation", {
    transformationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateTransformationPressureScore(input: {
  evolutionSignals: readonly StrategicIntelligenceEvolutionSignal[];
  strategicTransformationRecords: readonly StrategicTransformationRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  const unstableSignals = input.evolutionSignals.filter(
    (s) => s.evolutionState === "transforming" || s.evolutionState === "critical"
  ).length;
  const transformationPressure =
    input.strategicTransformationRecords.length === 0
      ? 0
      : input.strategicTransformationRecords.reduce((s, r) => s + r.transformationStrength, 0) /
        input.strategicTransformationRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.evolutionSignals.length)) * 0.35 +
      transformationPressure * 0.35 +
      input.strategicDriftState.strategicDriftInstabilityScore * 0.15 +
      input.strategicResilienceState.recoveryPressureScore * 0.1
  );
}
