/**
 * D7:7:4 — Enterprise strategic drift domain intelligence.
 */

import type {
  DriftEvolutionRecord,
  EnterpriseDriftDomainRecord,
  EnterpriseStrategicRealityDriftSignal,
  StrategicCoherenceDegradationRecord,
} from "./enterpriseStrategicRealityDriftTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseStrategicRealityDriftDev } from "./enterpriseStrategicRealityDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseStrategicDrift(input: {
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
  degradationRecords: readonly StrategicCoherenceDegradationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseDriftDomainRecord[] {
  const records: EnterpriseDriftDomainRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  const coordinationDecay = input.driftEvolutionRecords.find((r) =>
    r.recordId.includes("coordination-decay")
  );
  const dependencyAccum = input.driftEvolutionRecords.find((r) =>
    r.recordId.includes("dependency-accumulation")
  );
  const alignmentDrift = input.degradationRecords.find((r) =>
    r.recordId.includes("alignment-drift")
  );

  const degradationPenalty =
    input.degradationRecords.length === 0
      ? 0
      : input.degradationRecords.reduce((s, r) => s + r.degradationStrength, 0) /
        input.degradationRecords.length;

  records.push(
    Object.freeze({
      recordId: "drift-domain::operations",
      driftDomain: "operations",
      driftStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.35 +
          (coordinationDecay?.evolutionStrength ?? 0.3) * 0.4 -
          degradationPenalty * 0.1
      ),
      explanation:
        "Operations drift may reshape production movement as gradual degradation accumulates across enterprise layers.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "drift-domain::logistics",
      driftDomain: "logistics",
      driftStrength: clamp01(
        (dependencyAccum?.evolutionStrength ?? 0.35) * 0.55 +
          (alignmentDrift?.degradationStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics drift may intensify when dependency concentration and declining recovery synchronization converge.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "drift-domain::finance",
      driftDomain: "finance",
      driftStrength: clamp01(
        (1 - input.divergenceState.futureConvergenceScore) * 0.35 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35 -
          degradationPenalty * 0.08
      ),
      explanation:
        "Finance drift may emerge when governance pathways weaken and predictive alignment degrades over time.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "drift-domain::recovery",
      driftDomain: "recovery",
      driftStrength: clamp01(
        (alignmentDrift?.degradationStrength ?? 0.35) * 0.5 +
          input.momentumState.recoveryMomentumScore * 0.3
      ),
      explanation:
        "Recovery drift may signal long-horizon divergence when synchronization weakens across manufacturing pathways.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "drift-domain::strategic-momentum",
      driftDomain: "strategic_momentum",
      driftStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.3 -
          degradationPenalty * 0.1
      ),
      explanation:
        "Strategic momentum drift may reflect how gradual operational movement reshapes enterprise trajectories.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "drift-domain::systemic-equilibrium",
      driftDomain: "systemic_equilibrium",
      driftStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          (1 - degradationPenalty) * 0.35
      ),
      explanation:
        "Systemic equilibrium drift may shift as hidden instability accumulates across operational and governance domains.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
    })
  );

  logEnterpriseStrategicRealityDriftDev("DegradationPath", {
    domainRecordCount: records.length,
    degradationRecordCount: input.degradationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
