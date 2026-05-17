/**
 * D7:6:5 — Executive understanding intelligence (narrative).
 */

import type {
  ExecutiveNarrativeSignal,
  ExecutiveUnderstandingRecord,
  NarrativeCoherenceRecord,
  ExecutiveNarrativeContextRecord,
} from "./executiveNarrativeTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveNarrativeDev } from "./narrativeIntelligenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveUnderstanding(input: {
  narrativeSignals: readonly ExecutiveNarrativeSignal[];
  contextRecords: readonly ExecutiveNarrativeContextRecord[];
  coherenceRecords: readonly NarrativeCoherenceRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveUnderstandingRecord[] {
  const records: ExecutiveUnderstandingRecord[] = [];
  const narrativeIds = input.narrativeSignals.map((n) => n.narrativeId);

  const operationalContext = input.contextRecords.find((r) =>
    r.recordId.includes("operational-synthesis")
  );
  const recoveryContext = input.contextRecords.find((r) =>
    r.recordId.includes("recovery-sequencing")
  );
  const predictiveContext = input.contextRecords.find((r) =>
    r.recordId.includes("predictive-trajectory")
  );

  records.push(
    Object.freeze({
      recordId: "understanding::operations",
      understandingDomain: "operations",
      understandingStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (operationalContext?.contextStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational understanding may improve when coherent narratives connect enterprise signals into executive-readable strategic stories.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "understanding::logistics",
      understandingDomain: "logistics",
      understandingStrength: clamp01(predictiveContext?.contextStrength ?? 0.4),
      explanation:
        "Logistics understanding may strengthen when dependency concentration is framed within recovery synchronization and volatility risk.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "understanding::finance",
      understandingDomain: "finance",
      understandingStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial understanding may benefit when equilibrium narratives reduce isolated-metric interpretation across investment pathways.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "understanding::recovery",
      understandingDomain: "recovery",
      understandingStrength: clamp01(
        (recoveryContext?.contextStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system understanding may improve when stabilization sequencing is explained as resilience leverage rather than isolated metrics.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "understanding::strategic-momentum",
      understandingDomain: "strategic_momentum",
      understandingStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum understanding may reflect how narrative continuity supports enterprise evolution under executive control.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "understanding::systemic-equilibrium",
      understandingDomain: "systemic_equilibrium",
      understandingStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.coherenceRecords[0]?.coherenceStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium understanding may preserve decision quality when narrative coherence remains within evidence-grounded bounds.",
      contributingNarrativeIds: Object.freeze(narrativeIds.slice(0, 4)),
    })
  );

  logExecutiveNarrativeDev("ExecutiveUnderstanding", {
    understandingRecordCount: records.length,
    coherenceCount: input.coherenceRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
