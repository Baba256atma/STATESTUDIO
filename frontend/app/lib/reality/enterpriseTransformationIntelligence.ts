/**
 * D7:7:6 — Enterprise transformation intelligence for strategic reality evolution.
 */

import type {
  EnterpriseStrategicRealityEvolutionSignal,
  EnterpriseTransformationRecord,
  EvolutionaryTransitionRecord,
  LongHorizonTransformationRecord,
} from "./enterpriseStrategicRealityEvolutionTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseStrategicRealityEvolutionDev } from "./enterpriseStrategicRealityEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseTransformation(input: {
  evolutionSignals: readonly EnterpriseStrategicRealityEvolutionSignal[];
  longHorizonTransformationRecords: readonly LongHorizonTransformationRecord[];
  transitionRecords: readonly EvolutionaryTransitionRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseTransformationRecord[] {
  const records: EnterpriseTransformationRecord[] = [];
  const evolutionIds = input.evolutionSignals.map((s) => s.evolutionId);

  const organizationalTransform = input.longHorizonTransformationRecords.find((r) =>
    r.recordId.includes("organizational")
  );
  const recoveryTransform = input.longHorizonTransformationRecords.find((r) =>
    r.recordId.includes("recovery-to-transformation")
  );
  const unstableTransition = input.transitionRecords.find((r) =>
    r.recordId.includes("unstable-organizational")
  );

  const instabilityPenalty =
    input.transitionRecords.length === 0
      ? 0
      : input.transitionRecords.reduce((s, r) => s + r.transitionStrength, 0) /
        input.transitionRecords.length;

  records.push(
    Object.freeze({
      recordId: "enterprise-transform::operations",
      transformationDomain: "operations",
      transformationStrength: clamp01(
        (organizationalTransform?.transformationStrength ?? 0.35) * 0.5 +
          input.momentumState.organizationalMomentumScore * 0.35 -
          instabilityPenalty * 0.1
      ),
      explanation:
        "Operations transformation may evolve as production and coordination layers transition toward new operational realities.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-transform::logistics",
      transformationDomain: "logistics",
      transformationStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (recoveryTransform?.transformationStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Logistics transformation may strengthen as governance synchronization improves across coordination pathways.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-transform::finance",
      transformationDomain: "finance",
      transformationStrength: clamp01(
        input.divergenceState.futureConvergenceScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          instabilityPenalty * 0.08
      ),
      explanation:
        "Finance transformation may depend on governance evolution during extended strategic restructuring.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-transform::recovery",
      transformationDomain: "recovery",
      transformationStrength: clamp01(
        (recoveryTransform?.transformationStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery transformation may advance when enterprise systems gradually transition toward more resilient recovery structures.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-transform::strategic-momentum",
      transformationDomain: "strategic_momentum",
      transformationStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          (unstableTransition?.transitionStrength ?? 0) * 0.15
      ),
      explanation:
        "Strategic momentum transformation may reflect how enterprise realities reshape future operational universes.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-transform::systemic-equilibrium",
      transformationDomain: "systemic_equilibrium",
      transformationStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.5 +
          (organizationalTransform?.transformationStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Systemic equilibrium transformation may balance operational pressure as long-horizon structural change emerges.",
      contributingEvolutionIds: Object.freeze(evolutionIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicRealityEvolutionDev("AdaptiveEvolution", {
    transformationRecordCount: records.length,
    transitionRecordCount: input.transitionRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
