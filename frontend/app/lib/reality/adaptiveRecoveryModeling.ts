/**
 * D7:7:5 — Adaptive-recovery modeling for enterprise strategic resilience.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  AdaptiveRecoveryRecord,
  EnterpriseStrategicResilienceIntelligenceState,
  EnterpriseStrategicResilienceSignal,
  EnterpriseStrategicResilienceStateLabel,
} from "./enterpriseStrategicResilienceTypes.ts";
import { logEnterpriseStrategicResilienceDev } from "./enterpriseStrategicResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function resilienceStateFromProfile(
  capacity: number,
  adaptation: number,
  pressure: number
): EnterpriseStrategicResilienceStateLabel {
  if (pressure >= 0.72) return "critical";
  if (pressure >= 0.58) return "strained";
  if (adaptation >= 0.55 && capacity >= 0.5) return "recovering";
  if (adaptation >= 0.5 && pressure < 0.45) return "adaptive";
  if (capacity >= 0.55 && pressure < 0.4) return "stable";
  return pressure > capacity ? "strained" : "adaptive";
}

export function deriveEnterpriseStrategicResilienceSignals(input: {
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
  resilienceLeverageFactor?: number;
  recoveryPressureFactor?: number;
}): EnterpriseStrategicResilienceSignal[] {
  const leverage = clamp01(input.resilienceLeverageFactor ?? 0);
  const pressureFactor = clamp01(input.recoveryPressureFactor ?? 0);
  const signals: EnterpriseStrategicResilienceSignal[] = [];

  const zoneSets = [
    input.operationalUniverseState.resilienceState.adaptiveRecoveryZones,
    input.synchronizationState.synchronizedOperationalZones,
    input.driftState.emergingDriftZones,
    input.driftState.destabilizedRealityZones,
    input.causalityState.rootCauseZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
    input.operationalUniverseState.resilienceState.resilienceFragilityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const capacity = clamp01(
      input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.35 +
        input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore *
          0.25 +
        input.synchronizationState.synchronizationCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.35 +
        input.foresightState.strategicPreparednessScore * 0.25 +
        input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.2 +
        leverage * 0.08
    );
    const pressure = clamp01(
      input.driftState.coherenceDegradationScore * 0.3 +
        input.causalityState.causalPropagationScore * 0.25 +
        input.driftState.driftEvolutionScore * 0.2 +
        pressureFactor * 0.1
    );

    const resilienceState = resilienceStateFromProfile(capacity, adaptation, pressure);
    const resilienceStrength = clamp01(
      capacity * 0.35 + adaptation * 0.35 + (1 - pressure) * 0.25
    );

    const drivers: string[] = [];
    if (resilienceState === "stable") drivers.push("continuity_preservation", "absorbed_pressure");
    if (resilienceState === "adaptive") drivers.push("adaptive_capacity", "stress_absorption");
    if (resilienceState === "recovering") drivers.push("recovery_adaptation", "coordination_recovery");
    if (resilienceState === "strained") drivers.push("recovery_strain", "pressure_accumulation");
    if (resilienceState === "critical") drivers.push("resilience_risk", "collapse_pressure");

    signals.push(
      Object.freeze({
        resilienceId: `resilience::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        resilienceState,
        resilienceStrength,
        dominantResilienceDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["resilience_assessment"]
        ),
        executiveLabel:
          resilienceState === "stable" || resilienceState === "adaptive"
            ? "Enterprise resilience may absorb operational pressure while preserving continuity"
            : resilienceState === "recovering"
              ? "Adaptive recovery pathways may be strengthening under coordinated pressure response"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        resilienceId: "resilience::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        resilienceState: "adaptive",
        resilienceStrength: clamp01(
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.4 +
            leverage * 0.2
        ),
        dominantResilienceDrivers: Object.freeze(["baseline_resilience_assessment"]),
        executiveLabel:
          "Baseline enterprise strategic resilience assessment may apply across regions",
      })
    );
  }

  logEnterpriseStrategicResilienceDev("Resilience", {
    resilienceSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.resilienceId.localeCompare(b.resilienceId));
}

export function analyzeAdaptiveRecovery(input: {
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
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
}): readonly AdaptiveRecoveryRecord[] {
  const records: AdaptiveRecoveryRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  const regions =
    input.resilienceSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.resilienceSignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "recovery::operational-adaptation",
      recoveryType: "operational_recovery_adaptation",
      recoveryStrength: clamp01(
        input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore * 0.45 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Operational recovery adaptation may strengthen when instability occurs but cross-domain coordination stabilizes recovery pathways.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "recovery::governance-stabilization",
      recoveryType: "governance_stabilization_capacity",
      recoveryStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          (1 - input.governanceState.oversightRequirementScore) * 0.25
      ),
      explanation:
        "Governance stabilization capacity may preserve policy coherence during operational disruption.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "recovery::under-pressure",
      recoveryType: "resilience_under_pressure",
      recoveryStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.45 +
          (1 - input.driftState.coherenceDegradationScore) * 0.3
      ),
      explanation:
        "Resilience-under-pressure behavior may reflect how organizations absorb instability while maintaining operational coherence.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "recovery::continuity-preservation",
      recoveryType: "continuity_preservation_pathway",
      recoveryStrength: clamp01(
        input.synchronizationState.synchronizationCoherenceScore * 0.45 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.35
      ),
      explanation:
        "Continuity preservation pathways may sustain strategic operational movement during coordinated recovery.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "recovery::organizational-coordination",
      recoveryType: "organizational_recovery_coordination",
      recoveryStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.synchronizationState.crossDomainSyncScore * 0.35
      ),
      explanation:
        "Organizational recovery coordination may improve when operational instability is met with strong recovery synchronization and leadership alignment.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "recovery::long-horizon-evolution",
      recoveryType: "long_horizon_resilience_evolution",
      recoveryStrength: clamp01(
        input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.45 +
          input.foresightState.futureReadinessScore * 0.35
      ),
      explanation:
        "Long-horizon resilience evolution may track how adaptive capacity develops across sustained pressure cycles.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseStrategicResilienceDev("AdaptiveRecovery", {
    recoveryRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateResilienceCapacityScore(input: {
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  adaptiveRecoveryRecords: readonly AdaptiveRecoveryRecord[];
  operationalUniverseState: OperationalUniverseState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
}): number {
  if (input.resilienceSignals.length === 0) return 0;
  const signalAvg =
    input.resilienceSignals.reduce((s, sig) => s + sig.resilienceStrength, 0) /
    input.resilienceSignals.length;
  const recoveryAvg =
    input.adaptiveRecoveryRecords.length === 0
      ? 0
      : input.adaptiveRecoveryRecords.reduce((s, r) => s + r.recoveryStrength, 0) /
        input.adaptiveRecoveryRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recoveryAvg * 0.3 +
      input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.2 +
      input.synchronizationState.synchronizationCoherenceScore * 0.1 -
      input.driftState.coherenceDegradationScore * 0.05
  );
}

export function calculateAdaptiveRecoveryScore(input: {
  adaptiveRecoveryRecords: readonly AdaptiveRecoveryRecord[];
}): number {
  if (input.adaptiveRecoveryRecords.length === 0) return 0;
  return clamp01(
    input.adaptiveRecoveryRecords.reduce((s, r) => s + r.recoveryStrength, 0) /
      input.adaptiveRecoveryRecords.length
  );
}

export function identifyAdaptiveRecoveryZones(
  signals: readonly EnterpriseStrategicResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.resilienceState === "stable" ||
      signal.resilienceState === "adaptive" ||
      signal.resilienceState === "recovering"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyResilienceFailureZones(
  signals: readonly EnterpriseStrategicResilienceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.resilienceState === "strained" || signal.resilienceState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveResilienceLabel(input: {
  resilienceCapacityScore: number;
  adaptiveRecoveryScore: number;
  recoveryPressureScore: number;
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
}): EnterpriseStrategicResilienceIntelligenceState["executiveResilienceLabel"] {
  const critical = input.resilienceSignals.filter((s) => s.resilienceState === "critical").length;
  if (critical > 0 || input.recoveryPressureScore >= 0.68) return "critical";
  if (input.recoveryPressureScore >= 0.55) return "strained";
  const recovering = input.resilienceSignals.filter(
    (s) => s.resilienceState === "recovering"
  ).length;
  if (recovering > 0 && input.adaptiveRecoveryScore >= 0.5) return "recovering";
  const adaptive = input.resilienceSignals.filter((s) => s.resilienceState === "adaptive").length;
  if (adaptive > 0 && input.resilienceCapacityScore >= 0.5) return "adaptive";
  if (input.resilienceCapacityScore >= 0.5 && input.recoveryPressureScore < 0.45) {
    return "stable";
  }
  return input.recoveryPressureScore > input.resilienceCapacityScore ? "strained" : "adaptive";
}
