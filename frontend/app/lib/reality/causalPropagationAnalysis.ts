/**
 * D7:7:3 — Causal-propagation analysis for enterprise operational causality.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  CausalPropagationRecord,
  EnterpriseOperationalCausalitySignal,
  RootCauseRecord,
} from "./enterpriseOperationalCausalityTypes.ts";
import { logEnterpriseOperationalCausalityDev } from "./enterpriseOperationalCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeCausalPropagation(input: {
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  rootCauseRecords: readonly RootCauseRecord[];
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly CausalPropagationRecord[] {
  const records: CausalPropagationRecord[] = [];
  const causalityIds = input.causalitySignals.map((s) => s.causalityId);

  const propagatingSignals = input.causalitySignals.filter(
    (s) =>
      s.causalityState === "propagating" ||
      s.causalityState === "systemic" ||
      s.causalityState === "unstable" ||
      s.causalityState === "critical"
  ).length;

  if (propagatingSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "propagation::cascading-consequence",
        propagationType: "cascading_operational_consequence",
        propagationStrength: clamp01(
          propagatingSignals / Math.max(1, input.causalitySignals.length)
        ),
        explanation:
          "Cascading operational consequences may link supplier delays to production slowdown and recovery fragility escalation.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  if (input.cascadeState.cascadePropagationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "propagation::systemic-amplification",
        propagationType: "systemic_causal_amplification",
        propagationStrength: clamp01(input.cascadeState.cascadePropagationScore * 0.85),
        explanation:
          "Systemic causal amplification may intensify when dependency pressure propagates across operational layers.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  const dependencyRoot = input.rootCauseRecords.find((r) =>
    r.recordId.includes("dependency-propagation")
  );
  if (dependencyRoot) {
    records.push(
      Object.freeze({
        recordId: "propagation::hidden-pathway",
        propagationType: "hidden_propagation_pathway",
        propagationStrength: clamp01(dependencyRoot.causeStrength * 0.9),
        explanation:
          "Hidden propagation pathways may connect finance stabilization failure to supplier instability and manufacturing slowdown.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  if (
    (input.operationalUniverseState.pressureState?.cascadeRiskScore ?? 0) >= 0.4 ||
    (input.operationalUniverseState.fragilityMap?.systemicExposureScore ?? 0) >= 0.5
  ) {
    records.push(
      Object.freeze({
        recordId: "propagation::dependency-escalation",
        propagationType: "dependency_escalation",
        propagationStrength: clamp01(
          (input.operationalUniverseState.pressureState?.cascadeRiskScore ?? 0.35) * 0.5 +
            (input.operationalUniverseState.fragilityMap?.systemicExposureScore ?? 0.35) * 0.4
        ),
        explanation:
          "Operational dependency escalation may trace concentrated fragility into logistics and recovery divergence.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  if ((1 - input.governanceState.governanceStabilityScore) >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "propagation::governance-consequence",
        propagationType: "governance_consequence_instability",
        propagationStrength: clamp01(
          (1 - input.governanceState.governanceStabilityScore) * 0.55 +
            input.orchestrationState.orchestrationInstabilityScore * 0.3
        ),
        explanation:
          "Governance-consequence instability may propagate when coordination degradation affects operational alignment.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  if (input.operationalUniverseState.resilienceState.resilienceDegradationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "propagation::resilience-collapse",
        propagationType: "resilience_collapse_chain",
        propagationStrength: clamp01(
          input.operationalUniverseState.resilienceState.resilienceDegradationScore
        ),
        explanation:
          "Resilience-collapse chains may signal recovery divergence escalation across manufacturing pathways.",
        contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      })
    );
  }

  logEnterpriseOperationalCausalityDev("PropagationChain", {
    propagationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCausalPropagationScore(input: {
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  propagationRecords: readonly CausalPropagationRecord[];
  cascadeState: PredictiveCascadeState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  const propagatingCount = input.causalitySignals.filter(
    (s) =>
      s.causalityState === "propagating" ||
      s.causalityState === "systemic" ||
      s.causalityState === "unstable" ||
      s.causalityState === "critical"
  ).length;
  const recordAvg =
    input.propagationRecords.length === 0
      ? 0
      : input.propagationRecords.reduce((s, r) => s + r.propagationStrength, 0) /
        input.propagationRecords.length;
  return clamp01(
    propagatingCount / Math.max(1, input.causalitySignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.cascadeState.cascadePropagationScore * 0.15 +
      input.synchronizationState.operationalDriftScore * 0.1 +
      input.strategicRealityState.realityInstabilityScore * 0.08
  );
}
