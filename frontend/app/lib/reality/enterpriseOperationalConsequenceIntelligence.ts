/**
 * D7:7:3 — Enterprise consequence intelligence (operational causality).
 */

import type {
  CausalPropagationRecord,
  EnterpriseConsequenceRecord,
  EnterpriseOperationalCausalitySignal,
  RootCauseRecord,
} from "./enterpriseOperationalCausalityTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseOperationalCausalityDev } from "./enterpriseOperationalCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseOperationalConsequences(input: {
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  rootCauseRecords: readonly RootCauseRecord[];
  propagationRecords: readonly CausalPropagationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseConsequenceRecord[] {
  const records: EnterpriseConsequenceRecord[] = [];
  const causalityIds = input.causalitySignals.map((s) => s.causalityId);

  const operationalRoot = input.rootCauseRecords.find((r) =>
    r.recordId.includes("operational-cause")
  );
  const cascading = input.propagationRecords.find((r) =>
    r.recordId.includes("cascading-consequence")
  );
  const resilienceCollapse = input.propagationRecords.find((r) =>
    r.recordId.includes("resilience-collapse")
  );

  const propagationPenalty =
    input.propagationRecords.length === 0
      ? 0
      : input.propagationRecords.reduce((s, r) => s + r.propagationStrength, 0) /
        input.propagationRecords.length;

  records.push(
    Object.freeze({
      recordId: "consequence::operations",
      consequenceDomain: "operations",
      consequenceStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          (operationalRoot?.causeStrength ?? 0.3) * 0.35 -
          propagationPenalty * 0.1
      ),
      explanation:
        "Operations consequences may emerge when causal chains slow production and elevate operational pressure.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "consequence::logistics",
      consequenceDomain: "logistics",
      consequenceStrength: clamp01(
        (cascading?.propagationStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.25
      ),
      explanation:
        "Logistics consequences may follow supplier delays and dependency concentration into recovery fragility escalation.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "consequence::finance",
      consequenceDomain: "finance",
      consequenceStrength: clamp01(
        (1 - input.divergenceState.futureConvergenceScore) * 0.35 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35 -
          propagationPenalty * 0.08
      ),
      explanation:
        "Finance consequences may appear when stabilization failure propagates into supplier and manufacturing pathways.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "consequence::recovery",
      consequenceDomain: "recovery",
      consequenceStrength: clamp01(
        (resilienceCollapse?.propagationStrength ?? 0.35) * 0.5 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery consequences may intensify when manufacturing slowdown and recovery divergence escalate together.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "consequence::strategic-momentum",
      consequenceDomain: "strategic_momentum",
      consequenceStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          propagationPenalty * 0.08
      ),
      explanation:
        "Strategic momentum consequences may reflect how operational causes reshape long-horizon enterprise movement.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "consequence::systemic-equilibrium",
      consequenceDomain: "systemic_equilibrium",
      consequenceStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          (1 - propagationPenalty) * 0.35
      ),
      explanation:
        "Systemic equilibrium consequences may shift when causal propagation disturbs balanced operational pressure.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
    })
  );

  logEnterpriseOperationalCausalityDev("OperationalConsequence", {
    consequenceRecordCount: records.length,
    propagationRecordCount: input.propagationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
