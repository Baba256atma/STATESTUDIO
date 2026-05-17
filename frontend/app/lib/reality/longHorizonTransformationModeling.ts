/**
 * D7:7:6 — Long-horizon transformation modeling for strategic reality evolution.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  EnterpriseStrategicRealityEvolutionIntelligenceState,
  EnterpriseStrategicRealityEvolutionSignal,
  EnterpriseStrategicRealityEvolutionStateLabel,
  LongHorizonTransformationRecord,
} from "./enterpriseStrategicRealityEvolutionTypes.ts";
import { logEnterpriseStrategicRealityEvolutionDev } from "./enterpriseStrategicRealityEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function evolutionStateFromProfile(
  coherence: number,
  adaptation: number,
  instability: number
): EnterpriseStrategicRealityEvolutionStateLabel {
  if (instability >= 0.72) return "critical";
  if (instability >= 0.58) return "accelerating";
  if (adaptation >= 0.55 && coherence >= 0.5) return "transforming";
  if (adaptation >= 0.5 && instability < 0.45) return "adaptive";
  if (coherence >= 0.55 && instability < 0.4) return "stable";
  return instability > coherence ? "accelerating" : "adaptive";
}

export function deriveEnterpriseStrategicRealityEvolutionSignals(input: {
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  evolutionLeverageFactor?: number;
  transitionPressureFactor?: number;
}): EnterpriseStrategicRealityEvolutionSignal[] {
  const leverage = clamp01(input.evolutionLeverageFactor ?? 0);
  const pressureFactor = clamp01(input.transitionPressureFactor ?? 0);
  const signals: EnterpriseStrategicRealityEvolutionSignal[] = [];

  const zoneSets = [
    input.resilienceState.adaptiveRecoveryZones,
    input.resilienceState.resilienceFailureZones,
    input.driftState.emergingDriftZones,
    input.driftState.destabilizedRealityZones,
    input.synchronizationState.synchronizedOperationalZones,
    input.causalityState.rootCauseZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.resilienceState.resilienceCapacityScore * 0.3 +
        input.driftState.strategicCoherenceScore * 0.25 +
        input.synchronizationState.synchronizationCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.resilienceState.adaptiveRecoveryScore * 0.35 +
        input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.25 +
        input.foresightState.strategicPreparednessScore * 0.2 +
        leverage * 0.08
    );
    const instability = clamp01(
      input.driftState.coherenceDegradationScore * 0.3 +
        input.resilienceState.recoveryPressureScore * 0.25 +
        input.causalityState.causalPropagationScore * 0.2 +
        pressureFactor * 0.1
    );

    const evolutionState = evolutionStateFromProfile(coherence, adaptation, instability);
    const evolutionStrength = clamp01(
      coherence * 0.35 + adaptation * 0.35 + (1 - instability) * 0.25
    );

    const drivers: string[] = [];
    if (evolutionState === "stable") drivers.push("structural_stability", "coherent_evolution");
    if (evolutionState === "adaptive") drivers.push("adaptive_evolution", "coordination_shift");
    if (evolutionState === "transforming") drivers.push("transformation_pathway", "recovery_evolution");
    if (evolutionState === "accelerating") drivers.push("accelerated_change", "transition_pressure");
    if (evolutionState === "critical") drivers.push("evolution_risk", "unstable_transition");

    signals.push(
      Object.freeze({
        evolutionId: `evolution::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        evolutionState,
        evolutionStrength,
        dominantEvolutionDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["evolution_assessment"]
        ),
        executiveLabel:
          evolutionState === "stable" || evolutionState === "adaptive"
            ? "Enterprise operational reality may evolve gradually while preserving strategic coherence"
            : evolutionState === "transforming"
              ? "Long-horizon transformation pathways may be emerging across interconnected domains"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        evolutionId: "evolution::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        evolutionState: "adaptive",
        evolutionStrength: clamp01(
          input.resilienceState.resilienceCapacityScore * 0.4 + leverage * 0.2
        ),
        dominantEvolutionDrivers: Object.freeze(["baseline_evolution_assessment"]),
        executiveLabel:
          "Baseline enterprise strategic reality evolution assessment may apply across regions",
      })
    );
  }

  logEnterpriseStrategicRealityEvolutionDev("RealityEvolution", {
    evolutionSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.evolutionId.localeCompare(b.evolutionId));
}

export function analyzeLongHorizonTransformation(input: {
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly LongHorizonTransformationRecord[] {
  const records: LongHorizonTransformationRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  const regions =
    input.evolutionSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.evolutionSignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "transformation::organizational",
      transformationType: "organizational_transformation",
      transformationStrength: clamp01(
        input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.45 +
          input.orchestrationState.orchestrationCoherenceScore * 0.35
      ),
      explanation:
        "Organizational transformation may emerge when repeated recovery adaptation improves cross-domain coordination across operational ecosystems.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "transformation::governance-evolution",
      transformationType: "governance_evolution",
      transformationStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          (1 - input.governanceState.oversightRequirementScore) * 0.25
      ),
      explanation:
        "Governance evolution may reshape policy coherence as enterprise systems transition toward new operational realities.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "transformation::resilience-adaptation",
      transformationType: "resilience_adaptation",
      transformationStrength: clamp01(
        input.resilienceState.adaptiveRecoveryScore * 0.5 +
          input.resilienceState.resilienceCapacityScore * 0.35
      ),
      explanation:
        "Resilience adaptation may drive long-horizon evolution when recovery systems strengthen under sustained strategic pressure.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "transformation::operational-restructuring",
      transformationType: "operational_restructuring",
      transformationStrength: clamp01(
        input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.45 +
          input.synchronizationState.crossDomainSyncScore * 0.35
      ),
      explanation:
        "Operational restructuring may signal structural change as dependency concentration weakens across coordination pathways.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "transformation::equilibrium-shift",
      transformationType: "strategic_equilibrium_shift",
      transformationStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.driftState.strategicCoherenceScore * 0.35
      ),
      explanation:
        "Strategic equilibrium shifts may reflect how enterprise states transition between instability and coordinated recovery.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "transformation::recovery-to-transformation",
      transformationType: "recovery_to_transformation_pathway",
      transformationStrength: clamp01(
        input.resilienceState.adaptiveRecoveryScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          input.foresightState.futureReadinessScore * 0.2
      ),
      explanation:
        "Recovery-to-transformation pathways may advance when stabilization achieved but leadership coordination restructuring remains incomplete.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseStrategicRealityEvolutionDev("Transformation", {
    transformationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateTransformationCoherenceScore(input: {
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  longHorizonTransformationRecords: readonly LongHorizonTransformationRecord[];
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
}): number {
  if (input.evolutionSignals.length === 0) return 0;
  const signalAvg =
    input.evolutionSignals.reduce((s, sig) => s + sig.evolutionStrength, 0) /
    input.evolutionSignals.length;
  const transformAvg =
    input.longHorizonTransformationRecords.length === 0
      ? 0
      : input.longHorizonTransformationRecords.reduce((s, r) => s + r.transformationStrength, 0) /
        input.longHorizonTransformationRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      transformAvg * 0.3 +
      input.resilienceState.resilienceCapacityScore * 0.2 +
      input.synchronizationState.synchronizationCoherenceScore * 0.1 -
      input.driftState.coherenceDegradationScore * 0.05
  );
}

export function calculateLongHorizonEvolutionScore(input: {
  longHorizonTransformationRecords: readonly LongHorizonTransformationRecord[];
}): number {
  if (input.longHorizonTransformationRecords.length === 0) return 0;
  return clamp01(
    input.longHorizonTransformationRecords.reduce((s, r) => s + r.transformationStrength, 0) /
      input.longHorizonTransformationRecords.length
  );
}

export function identifyAdaptiveEvolutionZones(
  signals: readonly EnterpriseStrategicRealityEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.evolutionState === "stable" ||
      signal.evolutionState === "adaptive" ||
      signal.evolutionState === "transforming"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyUnstableTransitionZones(
  signals: readonly EnterpriseStrategicRealityEvolutionSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.evolutionState === "accelerating" || signal.evolutionState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveEvolutionLabel(input: {
  transformationCoherenceScore: number;
  longHorizonEvolutionScore: number;
  transitionInstabilityScore: number;
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
}): EnterpriseStrategicRealityEvolutionIntelligenceState["executiveEvolutionLabel"] {
  const critical = input.evolutionSignals.filter((s) => s.evolutionState === "critical").length;
  if (critical > 0 || input.transitionInstabilityScore >= 0.68) return "critical";
  if (input.transitionInstabilityScore >= 0.55) return "accelerating";
  const transforming = input.evolutionSignals.filter(
    (s) => s.evolutionState === "transforming"
  ).length;
  if (transforming > 0 && input.longHorizonEvolutionScore >= 0.5) return "transforming";
  const adaptive = input.evolutionSignals.filter((s) => s.evolutionState === "adaptive").length;
  if (adaptive > 0 && input.transformationCoherenceScore >= 0.5) return "adaptive";
  if (input.transformationCoherenceScore >= 0.5 && input.transitionInstabilityScore < 0.45) {
    return "stable";
  }
  return input.transitionInstabilityScore > input.transformationCoherenceScore
    ? "accelerating"
    : "adaptive";
}