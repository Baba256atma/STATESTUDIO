/**
 * D7:7:6 — Evolutionary-transition analysis for strategic reality evolution.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { EnterpriseStrategicRealityDriftIntelligenceState } from "./enterpriseStrategicRealityDriftTypes.ts";
import type { EnterpriseStrategicResilienceIntelligenceState } from "./enterpriseStrategicResilienceTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type {
  EnterpriseStrategicRealityEvolutionSignal,
  EvolutionaryTransitionRecord,
  LongHorizonTransformationRecord,
} from "./enterpriseStrategicRealityEvolutionTypes.ts";
import { logEnterpriseStrategicRealityEvolutionDev } from "./enterpriseStrategicRealityEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEvolutionaryTransitions(input: {
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  longHorizonTransformationRecords: readonly LongHorizonTransformationRecord[];
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
}): readonly EvolutionaryTransitionRecord[] {
  const records: EvolutionaryTransitionRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  const acceleratingSignals = input.evolutionSignals.filter(
    (s) => s.evolutionState === "accelerating" || s.evolutionState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "transition::unstable-organizational",
      transitionType: "unstable_organizational_transition",
      transitionStrength: clamp01(
        acceleratingSignals / Math.max(1, input.evolutionSignals.length) * 0.5 +
          input.orchestrationState.orchestrationInstabilityScore * 0.35
      ),
      explanation:
        "Unstable organizational transitions may elevate when recovery stabilization is incomplete across leadership coordination restructuring.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transition::fragmented-pathway",
      transitionType: "fragmented_transformation_pathway",
      transitionStrength: clamp01(
        input.driftState.coherenceDegradationScore * 0.5 +
          input.synchronizationState.operationalDriftScore * 0.35
      ),
      explanation:
        "Fragmented transformation pathways may emerge when cross-domain evolution lacks coherent synchronization.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transition::resilience-driven",
      transitionType: "resilience_driven_evolution",
      transitionStrength: clamp01(
        input.resilienceState.adaptiveRecoveryScore * 0.55 +
          input.resilienceState.resilienceCapacityScore * 0.3
      ),
      explanation:
        "Resilience-driven evolution may advance when adaptive recovery capacity reshapes long-horizon operational structure.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transition::governance-instability",
      transitionType: "governance_transition_instability",
      transitionStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance-transition instability may signal policy fragmentation during enterprise reality transformation.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transition::adaptation-acceleration",
      transitionType: "operational_adaptation_acceleration",
      transitionStrength: clamp01(
        input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.5 +
          input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.35
      ),
      explanation:
        "Operational adaptation acceleration may indicate structural change emerging under strategic pressure.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "transition::structural-change",
      transitionType: "structural_strategic_change",
      transitionStrength: clamp01(
        acceleratingSignals / Math.max(1, input.evolutionSignals.length) * 0.4 +
          input.causalityState.causalPropagationScore * 0.35 +
          input.driftState.driftEvolutionScore * 0.15
      ),
      explanation:
        "Structural strategic change may intensify when dependency concentration and transition pressure compound across domains.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicRealityEvolutionDev("StrategicTransition", {
    transitionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateTransitionInstabilityScore(input: {
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  transitionRecords: readonly EvolutionaryTransitionRecord[];
  driftState: EnterpriseStrategicRealityDriftIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  resilienceState: EnterpriseStrategicResilienceIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const acceleratingCount = input.evolutionSignals.filter(
    (s) => s.evolutionState === "accelerating" || s.evolutionState === "critical"
  ).length;
  const recordAvg =
    input.transitionRecords.length === 0
      ? 0
      : input.transitionRecords.reduce((s, r) => s + r.transitionStrength, 0) /
        input.transitionRecords.length;
  return clamp01(
    acceleratingCount / Math.max(1, input.evolutionSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.driftState.coherenceDegradationScore * 0.15 +
      input.causalityState.causalPropagationScore * 0.1 +
      input.resilienceState.recoveryPressureScore * 0.08 +
      input.orchestrationState.orchestrationInstabilityScore * 0.05
  );
}
