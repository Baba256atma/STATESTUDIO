/**
 * D7:7:7 — Dynamic-balance modeling for enterprise strategic equilibrium.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { EnterpriseStrategicRealityEvolutionIntelligenceState } from "./enterpriseStrategicRealityEvolutionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  DynamicBalanceRecord,
  EnterpriseStrategicEquilibriumIntelligenceState,
  EnterpriseStrategicEquilibriumSignal,
  EnterpriseStrategicEquilibriumStateLabel,
} from "./enterpriseStrategicEquilibriumTypes.ts";
import { logEnterpriseStrategicEquilibriumDev } from "./enterpriseStrategicEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function equilibriumStateFromProfile(
  balance: number,
  adaptation: number,
  destabilization: number
): EnterpriseStrategicEquilibriumStateLabel {
  if (destabilization >= 0.72) return "critical";
  if (destabilization >= 0.58) return "destabilizing";
  if (adaptation >= 0.55 && balance >= 0.5) return "adaptive";
  if (balance >= 0.55 && destabilization < 0.4) return "balanced";
  return destabilization > balance ? "strained" : "adaptive";
}

export function deriveEnterpriseStrategicEquilibriumSignals(input: {
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
  equilibriumLeverageFactor?: number;
  balancePressureFactor?: number;
}): EnterpriseStrategicEquilibriumSignal[] {
  const leverage = clamp01(input.equilibriumLeverageFactor ?? 0);
  const pressureFactor = clamp01(input.balancePressureFactor ?? 0);
  const signals: EnterpriseStrategicEquilibriumSignal[] = [];

  const zoneSets = [
    input.evolutionState.adaptiveEvolutionZones,
    input.evolutionState.unstableTransitionZones,
    input.resilienceState.adaptiveRecoveryZones,
    input.resilienceState.resilienceFailureZones,
    input.synchronizationState.synchronizedOperationalZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
    input.driftState.destabilizedRealityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const balance = clamp01(
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.3 +
        input.evolutionState.transformationCoherenceScore * 0.25 +
        input.resilienceState.resilienceCapacityScore * 0.2 +
        leverage * 0.08
    );
    const adaptation = clamp01(
      input.resilienceState.adaptiveRecoveryScore * 0.35 +
        input.evolutionState.longHorizonEvolutionScore * 0.25 +
        input.synchronizationState.synchronizationCoherenceScore * 0.2 +
        leverage * 0.08
    );
    const destabilization = clamp01(
      input.evolutionState.transitionInstabilityScore * 0.3 +
        input.resilienceState.recoveryPressureScore * 0.25 +
        input.driftState.coherenceDegradationScore * 0.2 +
        pressureFactor * 0.1
    );

    const equilibriumState = equilibriumStateFromProfile(balance, adaptation, destabilization);
    const equilibriumStrength = clamp01(
      balance * 0.35 + adaptation * 0.35 + (1 - destabilization) * 0.25
    );

    const drivers: string[] = [];
    if (equilibriumState === "balanced") drivers.push("systemic_balance", "pressure_recovery_harmony");
    if (equilibriumState === "adaptive") drivers.push("adaptive_balance", "dynamic_stabilization");
    if (equilibriumState === "strained") drivers.push("balance_strain", "pressure_accumulation");
    if (equilibriumState === "destabilizing") drivers.push("destabilization_pressure", "coordination_weakening");
    if (equilibriumState === "critical") drivers.push("equilibrium_risk", "continuity_instability");

    signals.push(
      Object.freeze({
        equilibriumId: `equilibrium::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        equilibriumState,
        equilibriumStrength,
        dominantEquilibriumDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["equilibrium_assessment"]
        ),
        executiveLabel:
          equilibriumState === "balanced" || equilibriumState === "adaptive"
            ? "Enterprise operational equilibrium may preserve dynamic balance under changing conditions"
            : equilibriumState === "strained"
              ? "Strategic equilibrium may be strained as destabilization pressure accumulates"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        equilibriumId: "equilibrium::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        equilibriumState: "adaptive",
        equilibriumStrength: clamp01(
          input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 + leverage * 0.2
        ),
        dominantEquilibriumDrivers: Object.freeze(["baseline_equilibrium_assessment"]),
        executiveLabel:
          "Baseline enterprise strategic equilibrium assessment may apply across regions",
      })
    );
  }

  logEnterpriseStrategicEquilibriumDev("Equilibrium", {
    equilibriumSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.equilibriumId.localeCompare(b.equilibriumId));
}

export function analyzeDynamicBalance(input: {
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
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
}): readonly DynamicBalanceRecord[] {
  const records: DynamicBalanceRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);

  const regions =
    input.equilibriumSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.equilibriumSignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "balance::pressure-recovery",
      balanceType: "pressure_recovery_balance",
      balanceStrength: clamp01(
        input.resilienceState.resilienceCapacityScore * 0.45 +
          (1 - input.resilienceState.recoveryPressureScore) * 0.35
      ),
      explanation:
        "Pressure-recovery balance may preserve equilibrium when operational disruption is met with strong cross-domain recovery adaptation.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "balance::governance-stabilization",
      balanceType: "governance_stabilization",
      balanceStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          input.synchronizationState.synchronizationCoherenceScore * 0.3
      ),
      explanation:
        "Governance stabilization may sustain systemic harmony when policy coherence aligns with operational synchronization.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "balance::resilience-adaptation",
      balanceType: "resilience_equilibrium_adaptation",
      balanceStrength: clamp01(
        input.resilienceState.adaptiveRecoveryScore * 0.5 +
          input.evolutionState.longHorizonEvolutionScore * 0.35
      ),
      explanation:
        "Resilience equilibrium adaptation may rebalance enterprise systems after disruption through coordinated recovery pathways.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "balance::operational-load",
      balanceType: "operational_load_balancing",
      balanceStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.orchestrationState.orchestrationCoherenceScore * 0.35
      ),
      explanation:
        "Operational load balancing may distribute pressure across domains while maintaining strategic operational continuity.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "balance::momentum-stabilization",
      balanceType: "strategic_momentum_stabilization",
      balanceStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum stabilization may preserve forward movement when equilibrium shifts under strategic pressure.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "balance::continuity-horizon",
      balanceType: "long_horizon_continuity_balance",
      balanceStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          input.evolutionState.transformationCoherenceScore * 0.2
      ),
      explanation:
        "Long-horizon continuity balance may shape sustainable strategic equilibrium across extended operational cycles.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseStrategicEquilibriumDev("SystemicBalance", {
    balanceRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateSystemicBalanceScore(input: {
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  dynamicBalanceRecords: readonly DynamicBalanceRecord[];
  operationalUniverseState: OperationalUniverseState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
}): number {
  if (input.equilibriumSignals.length === 0) return 0;
  const signalAvg =
    input.equilibriumSignals.reduce((s, sig) => s + sig.equilibriumStrength, 0) /
    input.equilibriumSignals.length;
  const balanceAvg =
    input.dynamicBalanceRecords.length === 0
      ? 0
      : input.dynamicBalanceRecords.reduce((s, r) => s + r.balanceStrength, 0) /
        input.dynamicBalanceRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      balanceAvg * 0.3 +
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
      input.synchronizationState.synchronizationCoherenceScore * 0.1 -
      input.evolutionState.transitionInstabilityScore * 0.05
  );
}

export function calculateDynamicBalanceScore(input: {
  dynamicBalanceRecords: readonly DynamicBalanceRecord[];
}): number {
  if (input.dynamicBalanceRecords.length === 0) return 0;
  return clamp01(
    input.dynamicBalanceRecords.reduce((s, r) => s + r.balanceStrength, 0) /
      input.dynamicBalanceRecords.length
  );
}

export function identifyStabilizedEquilibriumZones(
  signals: readonly EnterpriseStrategicEquilibriumSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.equilibriumState === "balanced" ||
      signal.equilibriumState === "adaptive"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyDestabilizedEquilibriumZones(
  signals: readonly EnterpriseStrategicEquilibriumSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.equilibriumState === "strained" ||
      signal.equilibriumState === "destabilizing" ||
      signal.equilibriumState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveEquilibriumLabel(input: {
  systemicBalanceScore: number;
  dynamicBalanceScore: number;
  destabilizationPressureScore: number;
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
}): EnterpriseStrategicEquilibriumIntelligenceState["executiveEquilibriumLabel"] {
  const critical = input.equilibriumSignals.filter((s) => s.equilibriumState === "critical").length;
  if (critical > 0 || input.destabilizationPressureScore >= 0.68) return "critical";
  const destabilizing = input.equilibriumSignals.filter(
    (s) => s.equilibriumState === "destabilizing"
  ).length;
  if (destabilizing > 0 || input.destabilizationPressureScore >= 0.55) return "destabilizing";
  const strained = input.equilibriumSignals.filter((s) => s.equilibriumState === "strained").length;
  if (strained > 0 && input.destabilizationPressureScore >= 0.45) return "strained";
  const adaptive = input.equilibriumSignals.filter((s) => s.equilibriumState === "adaptive").length;
  if (adaptive > 0 && input.systemicBalanceScore >= 0.5) return "adaptive";
  if (input.systemicBalanceScore >= 0.5 && input.destabilizationPressureScore < 0.45) {
    return "balanced";
  }
  return input.destabilizationPressureScore > input.systemicBalanceScore ? "strained" : "adaptive";
}
