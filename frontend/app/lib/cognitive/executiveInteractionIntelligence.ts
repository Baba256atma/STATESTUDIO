/**
 * D7:6:1 — Executive interaction intelligence.
 */

import type {
  AttentionPriorityRecord,
  CognitiveLoadRecord,
  ExecutiveCognitiveSignal,
  ExecutiveInteractionRecord,
} from "./executiveCognitiveUxTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveCognitiveUxDev } from "./cognitiveUxDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveInteraction(input: {
  cognitiveSignals: readonly ExecutiveCognitiveSignal[];
  attentionRecords: readonly AttentionPriorityRecord[];
  loadRecords: readonly CognitiveLoadRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveInteractionRecord[] {
  const records: ExecutiveInteractionRecord[] = [];
  const signalIds = input.cognitiveSignals.map((s) => s.signalId);

  const fragilityAttention = input.attentionRecords.find((r) =>
    r.recordId.includes("fragility-visibility")
  );
  const recoveryElevation = input.attentionRecords.find((r) =>
    r.recordId.includes("recovery-elevation")
  );

  records.push(
    Object.freeze({
      recordId: "interaction::operations",
      interactionDomain: "operations",
      interactionStrength: clamp01(input.momentumState.organizationalMomentumScore * 0.45),
      explanation:
        "Operational interaction clarity may improve when cognitive orchestration reduces friction across enterprise intelligence surfaces.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "interaction::logistics",
      interactionDomain: "logistics",
      interactionStrength: clamp01(fragilityAttention?.priorityStrength ?? 0.4),
      explanation:
        "Logistics interaction priority may elevate when recovery-system fragility and dependency pressure require executive attention routing.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "interaction::finance",
      interactionDomain: "finance",
      interactionStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial interaction surfaces may remain stable when equilibrium signals support reduced cognitive urgency.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "interaction::recovery",
      interactionDomain: "recovery",
      interactionStrength: clamp01(
        (recoveryElevation?.priorityStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system interaction may support rapid decision cognition when stabilization priorities align with governance confidence.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "interaction::strategic-momentum",
      interactionDomain: "strategic_momentum",
      interactionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum interaction may reflect how attention orchestration shapes enterprise evolution without behavioral manipulation.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "interaction::systemic-equilibrium",
      interactionDomain: "systemic_equilibrium",
      interactionStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.loadRecords[0]?.loadStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium interaction may preserve decision quality when cognitive load remains within executive-controlled bounds.",
      contributingSignalIds: Object.freeze(signalIds.slice(0, 4)),
    })
  );

  logExecutiveCognitiveUxDev("StrategicFocus", {
    interactionRecordCount: records.length,
    loadRecordCount: input.loadRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
