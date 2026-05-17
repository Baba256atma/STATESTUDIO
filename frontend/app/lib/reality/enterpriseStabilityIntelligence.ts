/**
 * D7:7:7 — Enterprise stability intelligence for strategic equilibrium.
 */

import type {
  DynamicBalanceRecord,
  EnterpriseStabilityRecord,
  EnterpriseStrategicEquilibriumSignal,
  EquilibriumInstabilityRecord,
} from "./enterpriseStrategicEquilibriumTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseStrategicEquilibriumDev } from "./enterpriseStrategicEquilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseStability(input: {
  equilibriumSignals: readonly EnterpriseStrategicEquilibriumSignal[];
  dynamicBalanceRecords: readonly DynamicBalanceRecord[];
  instabilityRecords: readonly EquilibriumInstabilityRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseStabilityRecord[] {
  const records: EnterpriseStabilityRecord[] = [];
  const equilibriumIds = input.equilibriumSignals.map((s) => s.equilibriumId);

  const pressureRecovery = input.dynamicBalanceRecords.find((r) =>
    r.recordId.includes("pressure-recovery")
  );
  const governanceStabilization = input.dynamicBalanceRecords.find((r) =>
    r.recordId.includes("governance-stabilization")
  );
  const continuityInstability = input.instabilityRecords.find((r) =>
    r.recordId.includes("continuity-instability")
  );

  const instabilityPenalty =
    input.instabilityRecords.length === 0
      ? 0
      : input.instabilityRecords.reduce((s, r) => s + r.instabilityStrength, 0) /
        input.instabilityRecords.length;

  records.push(
    Object.freeze({
      recordId: "stability::operations",
      stabilityDomain: "operations",
      stabilityStrength: clamp01(
        (pressureRecovery?.balanceStrength ?? 0.35) * 0.5 +
          input.momentumState.organizationalMomentumScore * 0.35 -
          instabilityPenalty * 0.1
      ),
      explanation:
        "Operations stability may persist when balanced enterprise realities maintain production and coordination equilibrium.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::logistics",
      stabilityDomain: "logistics",
      stabilityStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (governanceStabilization?.balanceStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Logistics stability may remain broadly stable across recovery coordination systems under adaptive equilibrium.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::finance",
      stabilityDomain: "finance",
      stabilityStrength: clamp01(
        input.divergenceState.futureConvergenceScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          instabilityPenalty * 0.08
      ),
      explanation:
        "Finance stability may depend on governance coherence during long-horizon equilibrium shifts.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::recovery",
      stabilityDomain: "recovery",
      stabilityStrength: clamp01(
        (pressureRecovery?.balanceStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery stability may advance when enterprise systems rebalance after disruption through coordinated pathways.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::strategic-momentum",
      stabilityDomain: "strategic_momentum",
      stabilityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          (continuityInstability?.instabilityStrength ?? 0) * 0.15
      ),
      explanation:
        "Strategic momentum stability may reflect how equilibrium shapes sustainable strategic continuity over time.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "stability::systemic-equilibrium",
      stabilityDomain: "systemic_equilibrium",
      stabilityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.5 +
          (governanceStabilization?.balanceStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Systemic equilibrium stability may balance operational pressure when dynamic adaptation preserves strategic harmony.",
      contributingEquilibriumIds: Object.freeze(equilibriumIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicEquilibriumDev("OperationalStability", {
    stabilityRecordCount: records.length,
    instabilityRecordCount: input.instabilityRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
