/**
 * D7:7:2 — Operational-drift analysis for enterprise reality synchronization.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  EnterpriseRealitySynchronizationSignal,
  OperationalDriftRecord,
} from "./enterpriseRealitySynchronizationTypes.ts";
import { logEnterpriseRealitySynchronizationDev } from "./enterpriseRealitySynchronizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeOperationalDrift(input: {
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly OperationalDriftRecord[] {
  const records: OperationalDriftRecord[] = [];
  const syncIds = input.synchronizationSignals.map((s) => s.synchronizationId);

  const driftingSignals = input.synchronizationSignals.filter(
    (s) =>
      s.synchronizationState === "drifting" ||
      s.synchronizationState === "fragmented" ||
      s.synchronizationState === "critical"
  ).length;

  if (driftingSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "drift::cross-domain",
        driftType: "cross_domain_operational_drift",
        driftStrength: clamp01(
          driftingSignals / Math.max(1, input.synchronizationSignals.length)
        ),
        explanation:
          "Cross-domain operational drift may emerge when finance stabilization diverges from logistics instability escalation.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  if (input.strategicRealityState.realityInstabilityScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "drift::sync-degradation",
        driftType: "synchronization_degradation",
        driftStrength: clamp01(input.strategicRealityState.realityInstabilityScore * 0.85),
        explanation:
          "Synchronization degradation may occur when strategic reality instability intersects with operational-state divergence.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  if (
    input.strategicRealityState.executiveRealityLabel === "volatile" ||
    input.strategicRealityState.executiveRealityLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "drift::fragmented-continuity",
        driftType: "fragmented_enterprise_continuity",
        driftStrength: clamp01(input.strategicRealityState.realityInstabilityScore * 0.7),
        explanation:
          "Fragmented enterprise continuity may weaken synchronization when strategic reality layers diverge across domains.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  if ((1 - input.governanceState.governanceStabilityScore) >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "drift::governance-alignment",
        driftType: "governance_alignment_instability",
        driftStrength: clamp01(
          (1 - input.governanceState.governanceStabilityScore) * 0.55 +
            input.governanceState.oversightRequirementScore * 0.35
        ),
        explanation:
          "Governance-alignment instability may introduce moderate operational drift within financial coordination pathways.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.5 &&
    input.trajectoryState.trajectoryVolatilityScore >= 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "drift::predictive-conflict",
        driftType: "predictive_synchronization_conflict",
        driftStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.4
        ),
        explanation:
          "Predictive synchronization conflicts may reduce forecast alignment when futures diverge across operational domains.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.orchestrationInstabilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "drift::state-divergence",
        driftType: "operational_state_divergence",
        driftStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Operational-state divergence may appear when orchestration instability persists across synchronization cycles.",
        contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      })
    );
  }

  logEnterpriseRealitySynchronizationDev("SynchronizationDrift", {
    driftRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateOperationalDriftScore(input: {
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  driftRecords: readonly OperationalDriftRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  divergenceState: MultiFutureDivergenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const driftingCount = input.synchronizationSignals.filter(
    (s) =>
      s.synchronizationState === "drifting" ||
      s.synchronizationState === "fragmented" ||
      s.synchronizationState === "critical"
  ).length;
  const recordAvg =
    input.driftRecords.length === 0
      ? 0
      : input.driftRecords.reduce((s, r) => s + r.driftStrength, 0) /
        input.driftRecords.length;
  return clamp01(
    driftingCount / Math.max(1, input.synchronizationSignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.strategicRealityState.realityInstabilityScore * 0.15 +
      input.divergenceState.futureFragmentationScore * 0.1 +
      input.orchestrationState.orchestrationInstabilityScore * 0.08
  );
}
