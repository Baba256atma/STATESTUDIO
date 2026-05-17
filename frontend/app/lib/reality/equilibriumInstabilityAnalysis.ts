/**
 * D7:7:7 — Equilibrium-instability analysis for enterprise strategic equilibrium.
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
import type {
  DynamicBalanceRecord,
  EnterpriseStrategicEquilibriumSignal,
  EquilibriumInstabilityRecord,
} from "./enterpriseStrategicEquilibriumTypes.ts";
import { logEnterpriseStrategicEquilibriumDev } from "./enterpriseStrategicEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEquilibriumInstability(input: {
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  dynamicBalanceRecords: readonly DynamicBalanceRecord[];
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
}): readonly EquilibriumInstabilityRecord[] {
  const records: EquilibriumInstabilityRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);

  const destabilizingSignals = input.equilibriumSignals.filter(
    (s) =>
      s.equilibriumState === "destabilizing" ||
      s.equilibriumState === "critical" ||
      s.equilibriumState === "strained"
  ).length;

  records.push(
    Object.freeze({
      recordId: "instability::systemic-imbalance",
      instabilityType: "systemic_imbalance",
      instabilityStrength: clamp01(
        destabilizingSignals / Math.max(1, input.equilibriumSignals.length) * 0.5 +
          (input.operationalUniverseState.equilibriumState.equilibriumScore < 0.4 ? 0.35 : 0.15)
      ),
      explanation:
        "Systemic imbalance may emerge when operational pressure and recovery capacity diverge across enterprise domains.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::operational-destabilization",
      instabilityType: "operational_destabilization",
      instabilityStrength: clamp01(
        input.causalityState.causalPropagationScore * 0.45 +
          input.orchestrationState.orchestrationInstabilityScore * 0.35
      ),
      explanation:
        "Operational destabilization may threaten systemic coherence when coordination weakens under sustained pressure.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::resilience-mismatch",
      instabilityType: "resilience_capacity_mismatch",
      instabilityStrength: clamp01(
        Math.abs(
          input.resilienceState.resilienceCapacityScore -
            input.resilienceState.adaptiveRecoveryScore
        ) * 0.85
      ),
      explanation:
        "Resilience-capacity mismatch may strain equilibrium when recovery systems are overloaded relative to adaptive capacity.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::governance-degradation",
      instabilityType: "governance_equilibrium_degradation",
      instabilityStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance equilibrium degradation may elevate when governance fragmentation persists through balance cycles.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::pressure-accumulation",
      instabilityType: "pressure_accumulation_imbalance",
      instabilityStrength: clamp01(
        input.resilienceState.recoveryPressureScore * 0.45 +
          input.evolutionState.transitionInstabilityScore * 0.35
      ),
      explanation:
        "Pressure accumulation imbalance may signal equilibrium destabilization risk as recovery overload compounds.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::continuity-instability",
      instabilityType: "strategic_continuity_instability",
      instabilityStrength: clamp01(
        input.driftState.coherenceDegradationScore * 0.4 +
          input.strategicRealityState.realityInstabilityScore * 0.35 +
          destabilizingSignals / Math.max(1, input.equilibriumSignals.length) * 0.2
      ),
      explanation:
        "Strategic continuity instability may intensify when recovery systems are overloaded, coordination weakens, and predictive volatility rises.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicEquilibriumDev("BalancePressure", {
    instabilityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateDestabilizationPressureScore(input: {
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  instabilityRecords: readonly EquilibriumInstabilityRecord[];
  evolutionState: EnterpriseStrategicRealityEvolutionIntelligenceState;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const destabilizingCount = input.equilibriumSignals.filter(
    (s) =>
      s.equilibriumState === "destabilizing" ||
      s.equilibriumState === "critical" ||
      s.equilibriumState === "strained"
  ).length;
  const recordAvg =
    input.instabilityRecords.length === 0
      ? 0
      : input.instabilityRecords.reduce((s, r) => s + r.instabilityStrength, 0) /
        input.instabilityRecords.length;
  return clamp01(
    destabilizingCount / Math.max(1, input.equilibriumSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.evolutionState.transitionInstabilityScore * 0.15 +
      input.resilienceState.recoveryPressureScore * 0.1 +
      input.driftState.coherenceDegradationScore * 0.08 +
      input.causalityState.causalPropagationScore * 0.05 +
      input.orchestrationState.orchestrationInstabilityScore * 0.02
  );
}
