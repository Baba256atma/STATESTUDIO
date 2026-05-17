/**
 * D7:5:9 — Strategic coherence intelligence.
 */

import type {
  ExecutiveAlignmentRecord,
  ConsensusFragmentationRecord,
  ExecutiveConsensusSignal,
  StrategicCoherenceRecord,
} from "./executiveConsensusTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicCoherence(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  alignmentRecords: readonly ExecutiveAlignmentRecord[];
  fragmentationRecords: readonly ConsensusFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly StrategicCoherenceRecord[] {
  const records: StrategicCoherenceRecord[] = [];
  const consensusIds = input.consensusSignals.map((c) => c.consensusId);

  const stabilizationAlignment = input.alignmentRecords.find((r) =>
    r.recordId.includes("consensus-stabilization")
  );

  records.push(
    Object.freeze({
      recordId: "coherence::operations",
      coherenceDomain: "operations",
      coherenceStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational coherence may improve when executive alignment strengthens coordination across enterprise systems.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::logistics",
      coherenceDomain: "logistics",
      coherenceStrength: clamp01(stabilizationAlignment?.alignmentStrength ?? 0.4),
      explanation:
        "Logistics coherence may benefit from agreement on dependency-reduction and recovery sequencing across distribution networks.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::finance",
      coherenceDomain: "finance",
      coherenceStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial coherence may stabilize when executive tradeoff alignment reduces competing investment priorities.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::recovery",
      coherenceDomain: "recovery",
      coherenceStrength: clamp01(
        (stabilizationAlignment?.alignmentStrength ?? 0.35) * 0.6 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system coherence may accelerate when consensus supports coordinated stabilization before restructuring intensifies.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::strategic-momentum",
      coherenceDomain: "strategic_momentum",
      coherenceStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.5),
      explanation:
        "Strategic momentum coherence may reflect how aligned executive priorities shape enterprise evolution without forced agreement.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "coherence::systemic-equilibrium",
      coherenceDomain: "systemic_equilibrium",
      coherenceStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.35
      ),
      explanation:
        "Systemic equilibrium coherence may preserve resilience when fragmentation remains contained within governance bounds.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    })
  );

  logExecutiveStrategicConsensusDev("StrategicCoherence", {
    coherenceRecordCount: records.length,
    fragmentationCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
