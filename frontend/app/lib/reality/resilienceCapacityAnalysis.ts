/**
 * D7:7:5 — Resilience-capacity analysis for enterprise strategic resilience.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type {
  EnterpriseStrategicResilienceSignal,
  ResilienceCapacityRecord,
  AdaptiveRecoveryRecord,
} from "./enterpriseStrategicResilienceTypes.ts";
import { logEnterpriseStrategicResilienceDev } from "./enterpriseStrategicResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeResilienceCapacity(input: {
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  adaptiveRecoveryRecords: readonly AdaptiveRecoveryRecord[];
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
}): readonly ResilienceCapacityRecord[] {
  const records: ResilienceCapacityRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  const strainedSignals = input.resilienceSignals.filter(
    (s) => s.resilienceState === "strained" || s.resilienceState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "capacity::resilience-degradation",
      capacityType: "resilience_degradation",
      capacityStrength: clamp01(
        input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.55 +
          input.driftState.coherenceDegradationScore * 0.35
      ),
      explanation:
        "Resilience degradation may emerge when governance fragmentation and coordination overload weaken long-horizon capacity.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "capacity::adaptive-potential",
      capacityType: "adaptive_recovery_potential",
      capacityStrength: clamp01(
        input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore * 0.85
      ),
      explanation:
        "Adaptive recovery potential may remain when operational systems continue adapting under pressure.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "capacity::continuity-stabilization",
      capacityType: "continuity_stabilization_opportunity",
      capacityStrength: clamp01(
        input.synchronizationState.synchronizationCoherenceScore * 0.5 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.35
      ),
      explanation:
        "Continuity stabilization opportunities may appear when cross-domain synchronization preserves recovery coherence.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "capacity::governance-recovery-instability",
      capacityType: "governance_recovery_instability",
      capacityStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance recovery instability may elevate when policy fragmentation persists through recovery cycles.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "capacity::recovery-fatigue",
      capacityType: "operational_recovery_fatigue",
      capacityStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
      explanation:
        "Operational recovery fatigue may signal repeated recovery overload with declining coordination quality.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "capacity::collapse-risk",
      capacityType: "resilience_collapse_risk",
      capacityStrength: clamp01(
        strainedSignals / Math.max(1, input.resilienceSignals.length) * 0.5 +
          input.causalityState.causalPropagationScore * 0.35
      ),
      explanation:
        "Resilience-collapse risk may intensify when dependency concentration and leadership overload compound under pressure.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicResilienceDev("ContinuityCapacity", {
    capacityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateRecoveryPressureScore(input: {
  resilienceSignals: readonly EnterpriseStrategicResilienceSignal[];
  capacityRecords: readonly ResilienceCapacityRecord[];
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const strainedCount = input.resilienceSignals.filter(
    (s) => s.resilienceState === "strained" || s.resilienceState === "critical"
  ).length;
  const recordAvg =
    input.capacityRecords.length === 0
      ? 0
      : input.capacityRecords.reduce((s, r) => s + r.capacityStrength, 0) /
        input.capacityRecords.length;
  return clamp01(
    strainedCount / Math.max(1, input.resilienceSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.driftState.coherenceDegradationScore * 0.15 +
      input.causalityState.causalPropagationScore * 0.1 +
      input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.08 +
      input.orchestrationState.orchestrationInstabilityScore * 0.05
  );
}
