/**
 * D7:7:8 — Continuity-fragmentation analysis for enterprise strategic continuity.
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
import type {
  ContinuityFragmentationRecord,
  EnterpriseStrategicContinuitySignal,
  LongHorizonContinuityRecord,
} from "./enterpriseStrategicContinuityTypes.ts";
import { logEnterpriseStrategicContinuityDev } from "./enterpriseStrategicContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeContinuityFragmentation(input: {
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
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
}): readonly ContinuityFragmentationRecord[] {
  const records: ContinuityFragmentationRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);

  const fragmentingSignals = input.continuitySignals.filter(
    (s) =>
      s.continuityState === "fragmenting" ||
      s.continuityState === "critical" ||
      s.continuityState === "strained"
  ).length;

  records.push(
    Object.freeze({
      recordId: "fragmentation::continuity-degradation",
      fragmentationType: "continuity_degradation",
      fragmentationStrength: clamp01(
        fragmentingSignals / Math.max(1, input.continuitySignals.length) * 0.5 +
          input.driftState.coherenceDegradationScore * 0.35
      ),
      explanation:
        "Continuity degradation may emerge when repeated instability weakens operational coherence across domains.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::survival-instability",
      fragmentationType: "organizational_survival_instability",
      fragmentationStrength: clamp01(
        input.evolutionState.transitionInstabilityScore * 0.45 +
          input.equilibriumState.destabilizationPressureScore * 0.35
      ),
      explanation:
        "Organizational survival instability may threaten long-horizon enterprise existence under sustained fragmentation pressure.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::resilience-exhaustion",
      fragmentationType: "resilience_exhaustion",
      fragmentationStrength: clamp01(
        input.resilienceState.recoveryPressureScore * 0.55 +
          (1 - input.resilienceState.adaptiveRecoveryScore) * 0.3
      ),
      explanation:
        "Resilience exhaustion may signal recovery overload with declining coordination quality and continuity pathway weakening.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::governance-fragmentation",
      fragmentationType: "governance_continuity_fragmentation",
      fragmentationStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance continuity fragmentation may elevate when governance collapse compounds coordination fragmentation.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::persistence-failure",
      fragmentationType: "operational_persistence_failure",
      fragmentationStrength: clamp01(
        input.causalityState.causalPropagationScore * 0.45 +
          input.orchestrationState.orchestrationInstabilityScore * 0.35
      ),
      explanation:
        "Operational persistence failure may threaten continuity when core recovery coordination cannot sustain under pressure.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::collapse-risk",
      fragmentationType: "strategic_continuity_collapse_risk",
      fragmentationStrength: clamp01(
        fragmentingSignals / Math.max(1, input.continuitySignals.length) * 0.4 +
          input.strategicRealityState.realityInstabilityScore * 0.35 +
          input.resilienceState.recoveryPressureScore * 0.15
      ),
      explanation:
        "Strategic continuity collapse risk may intensify when governance fatigue and recovery exhaustion compound across leadership overload.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicContinuityDev("ContinuityPressure", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateContinuityFragmentationScore(input: {
  fragmentationRecords: readonly ContinuityFragmentationRecord[];
}): number {
  if (input.fragmentationRecords.length === 0) return 0;
  return clamp01(
    input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
      input.fragmentationRecords.length
  );
}

export function calculateContinuityPressureScore(input: {
  continuitySignals: readonly EnterpriseStrategicContinuitySignal[];
  fragmentationRecords: readonly ContinuityFragmentationRecord[];
  equilibriumState: EnterpriseStrategicEquilibriumIntelligenceState;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const fragmentingCount = input.continuitySignals.filter(
    (s) =>
      s.continuityState === "fragmenting" ||
      s.continuityState === "critical" ||
      s.continuityState === "strained"
  ).length;
  const recordAvg =
    input.fragmentationRecords.length === 0
      ? 0
      : input.fragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.fragmentationRecords.length;
  return clamp01(
    fragmentingCount / Math.max(1, input.continuitySignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.equilibriumState.destabilizationPressureScore * 0.15 +
      input.resilienceState.recoveryPressureScore * 0.1 +
      input.driftState.coherenceDegradationScore * 0.08 +
      input.orchestrationState.orchestrationInstabilityScore * 0.05
  );
}
