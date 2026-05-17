/**
 * D7:7:8 — Long-horizon continuity modeling for enterprise strategic continuity.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { EnterpriseStrategicRealityEvolutionIntelligenceState } from "./enterpriseStrategicRealityEvolutionTypes.ts";
import type { EnterpriseStrategicEquilibriumIntelligenceState } from "./enterpriseStrategicEquilibriumTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  EnterpriseStrategicContinuityIntelligenceState,
  EnterpriseStrategicContinuitySignal,
  EnterpriseStrategicContinuityStateLabel,
  LongHorizonContinuityRecord,
} from "./enterpriseStrategicContinuityTypes.ts";
import { logEnterpriseStrategicContinuityDev } from "./enterpriseStrategicContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function continuityStateFromProfile(
  preservation: number,
  adaptation: number,
  fragmentation: number
): EnterpriseStrategicContinuityStateLabel {
  if (fragmentation >= 0.72) return "critical";
  if (fragmentation >= 0.58) return "fragmenting";
  if (adaptation >= 0.55 && preservation >= 0.5) return "adaptive";
  if (preservation >= 0.55 && fragmentation < 0.4) return "stable";
  return fragmentation > preservation ? "strained" : "adaptive";
}

export function deriveEnterpriseStrategicContinuitySignals(input: {
  equilibriumState: EnterpriseStrategicEquilibriumIntelligenceState;
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
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
  continuityLeverageFactor?: number;
  survivalPressureFactor?: number;
}): EnterpriseStrategicContinuitySignal[] {
  const leverage = clamp01(input.continuityLeverageFactor ?? 0);
  const pressureFactor = clamp01(input.survivalPressureFactor ?? 0);
  const signals: EnterpriseStrategicContinuitySignal[] = [];

  const zoneSets = [
    input.equilibriumState.stabilizedEquilibriumZones,
    input.equilibriumState.destabilizedEquilibriumZones,
    input.evolutionState.adaptiveEvolutionZones,
    input.resilienceState.adaptiveRecoveryZones,
    input.resilienceState.resilienceFailureZones,
    input.synchronizationState.synchronizedOperationalZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.driftState.destabilizedRealityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const preservation = clamp01(
      input.equilibriumState.systemicBalanceScore * 0.3 +
        input.resilienceState.resilienceCapacityScore * 0.25 +
        input.synchronizationState.synchronizationCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.resilienceState.adaptiveRecoveryScore * 0.35 +
        input.evolutionState.longHorizonEvolutionScore * 0.25 +
        input.equilibriumState.dynamicBalanceScore * 0.2 +
        leverage * 0.08
    );
    const fragmentation = clamp01(
      input.equilibriumState.destabilizationPressureScore * 0.3 +
        input.resilienceState.recoveryPressureScore * 0.25 +
        input.driftState.coherenceDegradationScore * 0.2 +
        pressureFactor * 0.1
    );

    const continuityState = continuityStateFromProfile(preservation, adaptation, fragmentation);
    const continuityStrength = clamp01(
      preservation * 0.35 + adaptation * 0.35 + (1 - fragmentation) * 0.25
    );

    const drivers: string[] = [];
    if (continuityState === "stable") drivers.push("continuity_preservation", "operational_coherence");
    if (continuityState === "adaptive") drivers.push("adaptive_continuity", "survival_adaptation");
    if (continuityState === "strained") drivers.push("continuity_strain", "recovery_pressure");
    if (continuityState === "fragmenting") drivers.push("continuity_fragmentation", "coordination_weakening");
    if (continuityState === "critical") drivers.push("continuity_risk", "survival_threat");

    signals.push(
      Object.freeze({
        continuityId: `continuity::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        continuityState,
        continuityStrength,
        dominantContinuityDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["continuity_assessment"]
        ),
        executiveLabel:
          continuityState === "stable" || continuityState === "adaptive"
            ? "Enterprise operational continuity may persist across disruption while preserving strategic coherence"
            : continuityState === "strained"
              ? "Continuity pathways may weaken as recovery pressure accumulates across domains"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        continuityId: "continuity::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        continuityState: "adaptive",
        continuityStrength: clamp01(
          input.equilibriumState.systemicBalanceScore * 0.4 + leverage * 0.2
        ),
        dominantContinuityDrivers: Object.freeze(["baseline_continuity_assessment"]),
        executiveLabel:
          "Baseline enterprise strategic continuity assessment may apply across regions",
      })
    );
  }

  logEnterpriseStrategicContinuityDev("Continuity", {
    continuitySignalCount: signals.length,
  });
  return signals.sort((a, b) => a.continuityId.localeCompare(b.continuityId));
}

export function analyzeLongHorizonContinuity(input: {
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  equilibriumState: EnterpriseStrategicEquilibriumIntelligenceState;
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
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
}): readonly LongHorizonContinuityRecord[] {
  const records: LongHorizonContinuityRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);

  const regions =
    input.continuitySignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.continuitySignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "continuity::operational-preservation",
      continuityType: "operational_continuity_preservation",
      continuityStrength: clamp01(
        input.synchronizationState.synchronizationCoherenceScore * 0.45 +
          input.resilienceState.adaptiveRecoveryScore * 0.35
      ),
      explanation:
        "Operational continuity preservation may sustain core recovery coordination when disruption occurs but cross-domain pathways persist.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::organizational-survival",
      continuityType: "long_horizon_organizational_survival",
      continuityStrength: clamp01(
        input.evolutionState.longHorizonEvolutionScore * 0.45 +
          input.foresightState.futureReadinessScore * 0.35
      ),
      explanation:
        "Long-horizon organizational survival may reflect sustained enterprise existence through transformation and instability cycles.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::resilience-driven",
      continuityType: "resilience_driven_continuity",
      continuityStrength: clamp01(
        input.resilienceState.resilienceCapacityScore * 0.5 +
          input.resilienceState.adaptiveRecoveryScore * 0.35
      ),
      explanation:
        "Resilience-driven continuity may preserve strategic functionality when strong recovery adaptation meets stable governance synchronization.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::governance-stabilization",
      continuityType: "governance_continuity_stabilization",
      continuityStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          input.equilibriumState.dynamicBalanceScore * 0.35
      ),
      explanation:
        "Governance continuity stabilization may preserve policy coherence through disruption and long-horizon evolution.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::adaptive-pathway",
      continuityType: "adaptive_continuity_pathway",
      continuityStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Adaptive continuity pathways may sustain coordination quality as enterprise systems adapt through transformation.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "continuity::strategic-persistence",
      continuityType: "strategic_persistence_evolution",
      continuityStrength: clamp01(
        input.trajectoryState.futureStabilityScore * 0.4 +
          input.evolutionState.transformationCoherenceScore * 0.35 +
          input.divergenceState.futureConvergenceScore * 0.2
      ),
      explanation:
        "Strategic persistence evolution may shape long-horizon continuity as operational realities transform across time.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseStrategicContinuityDev("OperationalPersistence", {
    continuityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLongHorizonContinuityScore(input: {
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  equilibriumState: EnterpriseStrategicEquilibriumIntelligenceState;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
}): number {
  if (input.continuitySignals.length === 0) return 0;
  const signalAvg =
    input.continuitySignals.reduce((s, sig) => s + sig.continuityStrength, 0) /
    input.continuitySignals.length;
  const recordAvg =
    input.longHorizonContinuityRecords.length === 0
      ? 0
      : input.longHorizonContinuityRecords.reduce((s, r) => s + r.continuityStrength, 0) /
        input.longHorizonContinuityRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.3 +
      input.equilibriumState.systemicBalanceScore * 0.2 +
      input.resilienceState.resilienceCapacityScore * 0.1 +
      input.synchronizationState.synchronizationCoherenceScore * 0.05
  );
}

export function calculateContinuityPreservationScore(input: {
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
}): number {
  if (input.longHorizonContinuityRecords.length === 0) return 0;
  return clamp01(
    input.longHorizonContinuityRecords.reduce((s, r) => s + r.continuityStrength, 0) /
      input.longHorizonContinuityRecords.length
  );
}

export function identifyPreservedContinuityZones(
  signals: readonly EnterpriseStrategicContinuitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.continuityState === "stable" || signal.continuityState === "adaptive") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyContinuityFailureZones(
  signals: readonly EnterpriseStrategicContinuitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.continuityState === "strained" ||
      signal.continuityState === "fragmenting" ||
      signal.continuityState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveContinuityLabel(input: {
  longHorizonContinuityScore: number;
  continuityPreservationScore: number;
  continuityPressureScore: number;
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
}): EnterpriseStrategicContinuityIntelligenceState["executiveContinuityLabel"] {
  const critical = input.continuitySignals.filter((s) => s.continuityState === "critical").length;
  if (critical > 0 || input.continuityPressureScore >= 0.68) return "critical";
  const fragmenting = input.continuitySignals.filter(
    (s) => s.continuityState === "fragmenting"
  ).length;
  if (fragmenting > 0 || input.continuityPressureScore >= 0.55) return "fragmenting";
  const strained = input.continuitySignals.filter((s) => s.continuityState === "strained").length;
  if (strained > 0 && input.continuityPressureScore >= 0.45) return "strained";
  const adaptive = input.continuitySignals.filter((s) => s.continuityState === "adaptive").length;
  if (adaptive > 0 && input.longHorizonContinuityScore >= 0.5) return "adaptive";
  if (input.longHorizonContinuityScore >= 0.5 && input.continuityPressureScore < 0.45) {
    return "stable";
  }
  return input.continuityPressureScore > input.longHorizonContinuityScore ? "strained" : "adaptive";
}
