/**
 * D7:4:6 — Predictive resilience preservation intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type {
  CollapsePreventionSignal,
  ResiliencePreservationRecord,
} from "./collapsePreventionTypes.ts";
import { logPreventionDev } from "./preventionDevLog.ts";

export function analyzeResiliencePreservation(input: {
  topology: OperationalUniverseTopology;
  signals: readonly CollapsePreventionSignal[];
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resiliencePreservationScore: number;
}): readonly ResiliencePreservationRecord[] {
  const records: ResiliencePreservationRecord[] = [];

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const intervenable = regionSignals.some(
      (s) => s.preventionState === "intervenable" || s.preventionState === "stabilizing"
    );
    if (!intervenable) continue;

    const strength = Number(
      Math.min(
        1,
        regionSignals.reduce((s, sig) => s + sig.preventionStrength, 0) /
          regionSignals.length
      ).toFixed(4)
    );

    records.push(
      Object.freeze({
        recordId: `preservation::${region.regionId}`,
        regionId: region.regionId,
        preservationType: "fragility_reduction",
        preservationStrength: strength,
        explanation: `Resilience preservation opportunities in ${region.label} may reshape future enterprise survivability under stabilization.`,
      })
    );
  }

  if (input.cascadeState.cascadeStabilizationScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "preservation::cascade-interruption",
        regionId: input.cascadeState.stabilizationZones[0] ?? "logistics",
        preservationType: "cascade_interruption",
        preservationStrength: Number(input.cascadeState.cascadeStabilizationScore.toFixed(4)),
        explanation:
          "Cascade interruption pathways may preserve operational resilience before systemic escalation.",
      })
    );
  }

  if (input.equilibriumState.equilibriumLabel === "recovering" || input.equilibriumState.equilibriumScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "preservation::equilibrium-restoration",
        regionId: input.equilibriumState.stabilityZones[0] ?? "finance",
        preservationType: "equilibrium_restoration",
        preservationStrength: Number(input.equilibriumState.equilibriumScore.toFixed(4)),
        explanation:
          "Equilibrium restoration opportunities may preserve enterprise balance as prevention windows remain open.",
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel === "recovering" &&
    input.recoveryOpportunityState.recoveryAccelerationScore >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "preservation::recovery-window",
        regionId: input.recoveryOpportunityState.resilienceAccelerationZones[0] ?? "logistics",
        preservationType: "recovery_window",
        preservationStrength: Number(
          (
            input.momentumState.recoveryMomentumScore * 0.5 +
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.4
          ).toFixed(4)
        ),
        explanation:
          "Intervention-sensitive recovery windows may preserve momentum-driven stabilization across operational domains.",
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "preservation::divergence-reduction",
        regionId: input.divergenceState.convergingFutureZones[0] ?? "logistics",
        preservationType: "cascade_interruption",
        preservationStrength: Number(
          Math.min(1, input.resiliencePreservationScore * 0.7 + 0.15).toFixed(4)
        ),
        explanation:
          "Future divergence reduction may emerge as prevention opportunities interrupt fragmented operational futures.",
      })
    );
  }

  const trustSignal = input.signals.find((s) => s.signalId.includes("trust-coordination"));
  if (trustSignal) {
    records.push(
      Object.freeze({
        recordId: "preservation::trust-stabilization",
        regionId: trustSignal.affectedRegionIds[0] ?? "manufacturing",
        preservationType: "trust_stabilization",
        preservationStrength: Number(trustSignal.preventionStrength.toFixed(4)),
        explanation:
          "Trust stabilization combined with leadership coordination may preserve human-system resilience under strain.",
      })
    );
  }

  if (records.length === 0 && input.signals.length > 0) {
    records.push(
      Object.freeze({
        recordId: "preservation::enterprise-limited",
        regionId: input.topology.operationalRegions[0]?.regionId ?? "logistics",
        preservationType: "recovery_window",
        preservationStrength: Number(input.resiliencePreservationScore.toFixed(4)),
        explanation:
          "Limited resilience preservation signals may remain observable under constrained prevention conditions.",
      })
    );
  }

  logPreventionDev("ResiliencePreservation", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
