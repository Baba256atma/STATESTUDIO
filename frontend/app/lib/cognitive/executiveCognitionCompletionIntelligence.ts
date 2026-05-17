/**
 * D7:6:10 — Executive cognition completion intelligence (orchestration completion).
 */

import type {
  ExecutiveCognitiveCompletionSignal,
  ExecutiveCognitionCompletionRecord,
  PlatformCoherenceRecord,
  FullCognitiveSynchronizationRecord,
} from "./executiveCognitiveCompletionTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveCognitiveCompletionDev } from "./cognitiveCompletionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveCognitionCompletion(input: {
  completionSignals: readonly ExecutiveCognitiveCompletionSignal[];
  syncRecords: readonly FullCognitiveSynchronizationRecord[];
  coherenceRecords: readonly PlatformCoherenceRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveCognitionCompletionRecord[] {
  const records: ExecutiveCognitionCompletionRecord[] = [];
  const completionIds = input.completionSignals.map((s) => s.completionId);

  const fullSync = input.syncRecords.find((r) => r.recordId.includes("full-cognition"));
  const narrativeTimeline = input.syncRecords.find((r) =>
    r.recordId.includes("narrative-timeline")
  );
  const strategicContinuity = input.syncRecords.find((r) =>
    r.recordId.includes("strategic-continuity")
  );

  records.push(
    Object.freeze({
      recordId: "cognition-completion::operations",
      completionDomain: "operations",
      completionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (fullSync?.syncStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational completion may improve when full cognitive orchestration connects intelligence to executive foresight.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition-completion::logistics",
      completionDomain: "logistics",
      completionStrength: clamp01(
        (narrativeTimeline?.syncStrength ?? 0.4) * 0.55 +
          (strategicContinuity?.syncStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics completion may trace recovery stabilization priorities across the finalized cognition platform.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition-completion::finance",
      completionDomain: "finance",
      completionStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial completion may benefit when platform coherence links immediate pressure to long-horizon equilibrium.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition-completion::recovery",
      completionDomain: "recovery",
      completionStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.45 +
          (narrativeTimeline?.syncStrength ?? 0.35) * 0.35
      ),
      explanation:
        "Recovery-system completion may strengthen when narratives, timelines, and simulations align on stabilization sequencing.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition-completion::strategic-momentum",
      completionDomain: "strategic_momentum",
      completionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum completion may reflect how unified cognition improves enterprise evolution under executive control.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "cognition-completion::systemic-equilibrium",
      completionDomain: "systemic_equilibrium",
      completionStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.coherenceRecords[0]?.coherenceStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium completion may preserve strategic intelligence quality when orchestration remains evidence-grounded.",
      contributingCompletionIds: Object.freeze(completionIds.slice(0, 4)),
    })
  );

  logExecutiveCognitiveCompletionDev("ExecutiveOrchestration", {
    completionRecordCount: records.length,
    coherenceCount: input.coherenceRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
