/**
 * D7:5:10 — Cross-intelligence synchronization modeling.
 */

import type { ExecutiveStrategicConsensusState } from "../recommendation/executiveConsensusTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "../recommendation/executiveStrategicAdvisoryTypes.ts";
import type { ExecutiveExplainabilityState } from "../recommendation/executiveExplainabilityTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { StrategicRecommendationMemoryState } from "../recommendation/recommendationMemoryTypes.ts";
import type { ExecutiveMultiStrategyState } from "../recommendation/multiStrategyComparisonTypes.ts";
import type { StrategicRecommendationState } from "../recommendation/strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "../recommendation/recommendationConfidenceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  CrossIntelligenceSynchronizationRecord,
  UnifiedExecutiveOrchestrationSignal,
  UnifiedExecutiveOrchestrationState,
  UnifiedOrchestrationStateLabel,
} from "./unifiedExecutiveOrchestrationTypes.ts";
import { logUnifiedExecutiveOrchestrationDev } from "./orchestrationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function orchestrationStateFromProfile(
  coherence: number,
  instability: number,
  sync: number
): UnifiedOrchestrationStateLabel {
  if (instability >= 0.72) return "critical";
  if (instability >= 0.58) return "volatile";
  if (instability >= 0.48 && coherence < 0.42) return "strained";
  if (sync >= 0.62 && coherence >= 0.55) return "synchronized";
  if (coherence >= 0.5 && instability < 0.45) return "stable";
  return instability > coherence ? "strained" : "volatile";
}

export function deriveUnifiedExecutiveOrchestrationSignals(input: {
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  orchestrationLeverageFactor?: number;
  instabilityStressFactor?: number;
}): UnifiedExecutiveOrchestrationSignal[] {
  const leverage = clamp01(input.orchestrationLeverageFactor ?? 0);
  const stress = clamp01(input.instabilityStressFactor ?? 0);

  const signals: UnifiedExecutiveOrchestrationSignal[] = [];

  const zoneSets = [
    input.consensusState.consensusStabilityZones,
    input.advisoryState.executivePriorityZones,
    input.governanceState.executiveOversightZones,
    input.recommendationState.stabilizationRecommendationZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.consensusState.strategicAlignmentScore * 0.22 +
        input.advisoryState.strategicCoherenceScore * 0.22 +
        input.governanceState.governanceStabilityScore * 0.2 +
        input.confidenceState.overallConfidenceScore * 0.15 +
        leverage * 0.1
    );
    const instability = clamp01(
      input.consensusState.fragmentationEscalationScore * 0.3 +
        input.divergenceState.futureFragmentationScore * 0.28 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.12
    );
    const sync = clamp01(
      input.foresightState.strategicPreparednessScore * 0.25 +
        input.consensusState.executiveCoherenceScore * 0.25 +
        (1 - input.confidenceState.uncertaintyAmplificationScore) * 0.2
    );

    const orchestrationState = orchestrationStateFromProfile(coherence, instability, sync);
    const orchestrationStrength = clamp01(coherence * 0.45 + sync * 0.35 + (1 - instability) * 0.15);

    const drivers: string[] = [];
    if (orchestrationState === "stable") drivers.push("recovery_stabilization_sync", "governance_confidence");
    if (orchestrationState === "synchronized") drivers.push("multi_layer_alignment", "predictive_advisory_harmony");
    if (orchestrationState === "strained") drivers.push("partial_sync", "caution_escalation");
    if (orchestrationState === "volatile") drivers.push("future_divergence", "consensus_fragmentation");
    if (orchestrationState === "critical") drivers.push("cross_system_instability", "orchestration_overload");

    signals.push(
      Object.freeze({
        orchestrationId: `orchestration::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        orchestrationState,
        orchestrationStrength,
        dominantOrchestrationDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["orchestration_assessment"]
        ),
        executiveLabel:
          orchestrationState === "synchronized" || orchestrationState === "stable"
            ? "Strategic intelligence layers may remain coordinated around recovery stabilization in this zone cluster"
            : orchestrationState === "critical" || orchestrationState === "volatile"
              ? "Cross-system orchestration volatility may require executive caution in this zone cluster"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        orchestrationId: "orchestration::fallback-sync",
        affectedRegionIds: Object.freeze(fallback),
        orchestrationState: "strained",
        orchestrationStrength: clamp01(
          input.consensusState.strategicAlignmentScore * 0.4 + leverage * 0.2
        ),
        dominantOrchestrationDrivers: Object.freeze(["baseline_orchestration_assessment"]),
        executiveLabel:
          "Baseline unified orchestration assessment may apply across operational intelligence pathways",
      })
    );
  }

  logUnifiedExecutiveOrchestrationDev("Orchestration", {
    orchestrationSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.orchestrationId.localeCompare(b.orchestrationId));
}

export function analyzeCrossIntelligenceSynchronization(input: {
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  explainabilityState: ExecutiveExplainabilityState;
  divergenceState: MultiFutureDivergenceState;
}): readonly CrossIntelligenceSynchronizationRecord[] {
  const records: CrossIntelligenceSynchronizationRecord[] = [];
  const orchestrationIds = input.orchestrationSignals.map((o) => o.orchestrationId);

  const regions =
    input.orchestrationSignals.flatMap((o) => o.affectedRegionIds).length > 0
      ? [...new Set(input.orchestrationSignals.flatMap((o) => o.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  records.push(
    Object.freeze({
      recordId: "sync::recommendation-sync",
      synchronizationType: "recommendation_sync",
      synchronizationStrength: clamp01(
        input.recommendationState.recommendationConfidenceScore * 0.4 +
          input.confidenceState.overallConfidenceScore * 0.35
      ),
      explanation:
        "Recommendation synchronization may remain stable when confidence and governance signals align across strategic pathways.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::governance-alignment",
      synchronizationType: "governance_alignment",
      synchronizationStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          input.consensusState.executiveCoherenceScore * 0.35
      ),
      explanation:
        "Governance-alignment coherence may strengthen when executive consensus and oversight zones remain coordinated.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::predictive-advisory",
      synchronizationType: "predictive_advisory_coordination",
      synchronizationStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.35 +
          input.advisoryState.advisoryClarityScore * 0.35 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.2
      ),
      explanation:
        "Predictive and advisory coordination may improve when foresight preparedness aligns with advisory clarity across futures.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::resilience-harmonization",
      synchronizationType: "resilience_harmonization",
      synchronizationStrength: clamp01(
        input.resilienceState.enterpriseResilienceScore * 0.4 +
          input.recoveryOpportunityState.recoveryAccelerationScore * 0.35
      ),
      explanation:
        "Resilience-intelligence harmonization may accelerate when recovery opportunity and human-system resilience signals converge.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  if (
    input.explainabilityState.explanationClarityScore < 0.35 &&
    input.divergenceState.futureFragmentationScore >= 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "sync::orchestration-conflict",
        synchronizationType: "orchestration_conflict",
        synchronizationStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            (1 - input.explainabilityState.explanationClarityScore) * 0.35
        ),
        explanation:
          "Low explainability combined with high future divergence may escalate orchestration caution across intelligence layers.",
        contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
        affectedRegionIds: Object.freeze(regions),
      })
    );
  }

  const recoveryConsensus =
    input.recoveryOpportunityState.recoveryAccelerationScore >= 0.4 &&
    input.consensusState.executiveConsensusLabel !== "fragmented" &&
    input.consensusState.executiveConsensusLabel !== "critical";

  records.push(
    Object.freeze({
      recordId: "sync::executive-cognition-stability",
      synchronizationType: "executive_cognition_stability",
      synchronizationStrength: clamp01(
        (recoveryConsensus ? 0.55 : 0.3) +
          input.consensusState.executiveCoherenceScore * 0.25 +
          input.advisoryState.strategicCoherenceScore * 0.15
      ),
      explanation: recoveryConsensus
        ? "High recovery opportunity with stable consensus and governance confidence may support strong orchestration coherence."
        : "Executive cognition stability may remain under strain when consensus fragmentation or leadership overload signals persist.",
      contributingOrchestrationIds: Object.freeze(orchestrationIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logUnifiedExecutiveOrchestrationDev("StrategicSynchronization", {
    synchronizationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateOrchestrationCoherenceScore(input: {
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  consensusState: ExecutiveStrategicConsensusState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  governanceState: ExecutiveStrategicGovernanceState;
}): number {
  if (input.orchestrationSignals.length === 0) return 0;
  const avgStrength =
    input.orchestrationSignals.reduce((s, o) => s + o.orchestrationStrength, 0) /
    input.orchestrationSignals.length;
  return clamp01(
    avgStrength * 0.35 +
      input.consensusState.strategicAlignmentScore * 0.25 +
      input.advisoryState.strategicCoherenceScore * 0.2 +
      input.governanceState.governanceStabilityScore * 0.15
  );
}

export function calculateCrossSystemSynchronizationScore(input: {
  synchronizationRecords: readonly CrossIntelligenceSynchronizationRecord[];
}): number {
  if (input.synchronizationRecords.length === 0) return 0;
  const conflict = input.synchronizationRecords.find(
    (r) => r.synchronizationType === "orchestration_conflict"
  );
  const avg =
    input.synchronizationRecords.reduce((s, r) => s + r.synchronizationStrength, 0) /
    input.synchronizationRecords.length;
  return clamp01(avg - (conflict?.synchronizationStrength ?? 0) * 0.25);
}

export function calculateOrchestrationInstabilityScore(input: {
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
  consensusState: ExecutiveStrategicConsensusState;
  comparisonState: ExecutiveMultiStrategyState;
  memoryState: StrategicRecommendationMemoryState;
  explainabilityState: ExecutiveExplainabilityState;
}): number {
  const volatileSignals = input.orchestrationSignals.filter(
    (o) => o.orchestrationState === "volatile" || o.orchestrationState === "critical"
  ).length;
  return clamp01(
    input.consensusState.fragmentationEscalationScore * 0.3 +
      input.comparisonState.pathwayDivergenceScore * 0.25 +
      (1 - input.memoryState.learningStabilityScore) * 0.15 +
      (1 - input.explainabilityState.explanationClarityScore) * 0.15 +
      volatileSignals / Math.max(1, input.orchestrationSignals.length) * 0.15
  );
}

export function identifySynchronizedIntelligenceZones(
  signals: readonly UnifiedExecutiveOrchestrationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.orchestrationState === "stable" ||
      signal.orchestrationState === "synchronized"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyOrchestrationFragilityZones(
  signals: readonly UnifiedExecutiveOrchestrationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.orchestrationState === "strained" ||
      signal.orchestrationState === "volatile" ||
      signal.orchestrationState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveOrchestrationLabel(input: {
  orchestrationCoherenceScore: number;
  crossSystemSynchronizationScore: number;
  orchestrationInstabilityScore: number;
  orchestrationSignals: readonly UnifiedExecutiveOrchestrationSignal[];
}): UnifiedExecutiveOrchestrationState["executiveOrchestrationLabel"] {
  const critical = input.orchestrationSignals.filter(
    (o) => o.orchestrationState === "critical"
  ).length;
  if (critical > 0 || input.orchestrationInstabilityScore >= 0.68) return "critical";
  if (input.orchestrationInstabilityScore >= 0.55) return "volatile";
  if (input.orchestrationInstabilityScore >= 0.45) return "strained";
  if (
    input.orchestrationCoherenceScore >= 0.55 &&
    input.crossSystemSynchronizationScore >= 0.5
  ) {
    return input.crossSystemSynchronizationScore >= 0.58 ? "synchronized" : "stable";
  }
  if (input.orchestrationCoherenceScore >= 0.4) return "strained";
  return "volatile";
}
