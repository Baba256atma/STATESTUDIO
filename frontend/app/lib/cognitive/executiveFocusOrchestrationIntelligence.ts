/**
 * D7:6:2 — Executive focus orchestration intelligence.
 */

import type {
  AttentionFragmentationRecord,
  DynamicPriorityFlowRecord,
  ExecutiveAttentionRoutingSignal,
  ExecutiveFocusOrchestrationRecord,
} from "./executiveAttentionRoutingTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveAttentionRoutingDev } from "./attentionRoutingDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveFocusOrchestration(input: {
  routingSignals: readonly ExecutiveAttentionRoutingSignal[];
  flowRecords: readonly DynamicPriorityFlowRecord[];
  fragmentationRecords: readonly AttentionFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveFocusOrchestrationRecord[] {
  const records: ExecutiveFocusOrchestrationRecord[] = [];
  const routingIds = input.routingSignals.map((r) => r.routingId);

  const fragilityFlow = input.flowRecords.find((r) => r.recordId.includes("fragility-priority"));
  const recoveryFlow = input.flowRecords.find((r) => r.recordId.includes("recovery-focus"));

  records.push(
    Object.freeze({
      recordId: "focus::operations",
      focusDomain: "operations",
      focusStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational focus orchestration may improve decision cognition when attention routes toward highest-impact instability zones.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "focus::logistics",
      focusDomain: "logistics",
      focusStrength: clamp01(fragilityFlow?.flowStrength ?? 0.42),
      explanation:
        "Logistics focus may concentrate on recovery coordination when dependency fragility and divergence intensify.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "focus::finance",
      focusDomain: "finance",
      focusStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial focus may stabilize when equilibrium recovery reduces urgency across investment pathways.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "focus::recovery",
      focusDomain: "recovery",
      focusStrength: clamp01(
        (recoveryFlow?.flowStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system focus may sequence attention toward stabilization leverage before restructuring expansion.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "focus::strategic-momentum",
      focusDomain: "strategic_momentum",
      focusStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum focus may align attention sequencing with enterprise evolution under executive control.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "focus::systemic-equilibrium",
      focusDomain: "systemic_equilibrium",
      focusStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.fragmentationRecords[0]?.fragmentationStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium focus may preserve decision quality when attention fragmentation remains bounded.",
      contributingRoutingIds: Object.freeze(routingIds.slice(0, 4)),
    })
  );

  logExecutiveAttentionRoutingDev("ExecutiveFocus", {
    focusRecordCount: records.length,
    fragmentationCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
