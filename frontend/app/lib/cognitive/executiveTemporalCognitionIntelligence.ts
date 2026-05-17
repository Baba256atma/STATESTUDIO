/**
 * D7:6:6 — Executive temporal cognition intelligence.
 */

import type {
  CognitiveHorizonRecord,
  ExecutiveTemporalCognitionRecord,
  ExecutiveTimelineSignal,
  TimelineFragmentationRecord,
} from "./executiveCognitiveTimelineTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logExecutiveCognitiveTimelineDev } from "./cognitiveTimelineDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveTemporalCognition(input: {
  timelineSignals: readonly ExecutiveTimelineSignal[];
  horizonRecords: readonly CognitiveHorizonRecord[];
  fragmentationRecords: readonly TimelineFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveTemporalCognitionRecord[] {
  const records: ExecutiveTemporalCognitionRecord[] = [];
  const timelineIds = input.timelineSignals.map((t) => t.timelineId);

  const immediateHorizon = input.horizonRecords.find((r) =>
    r.recordId.includes("immediate-operational")
  );
  const midTermHorizon = input.horizonRecords.find((r) =>
    r.recordId.includes("mid-term-recovery")
  );
  const longHorizon = input.horizonRecords.find((r) =>
    r.recordId.includes("long-resilience")
  );

  records.push(
    Object.freeze({
      recordId: "temporal::operations",
      cognitionDomain: "operations",
      cognitionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (immediateHorizon?.horizonStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational temporal cognition may improve when timeline intelligence organizes short-horizon signals into coherent executive understanding.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "temporal::logistics",
      cognitionDomain: "logistics",
      cognitionStrength: clamp01(
        (immediateHorizon?.horizonStrength ?? 0.4) * 0.55 +
          (midTermHorizon?.horizonStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics temporal cognition may connect immediate instability with mid-term recovery coordination across distribution networks.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "temporal::finance",
      cognitionDomain: "finance",
      cognitionStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial temporal cognition may benefit when equilibrium narratives span immediate pressure and long-horizon stability.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "temporal::recovery",
      cognitionDomain: "recovery",
      cognitionStrength: clamp01(
        (midTermHorizon?.horizonStrength ?? 0.35) * 0.55 +
          (longHorizon?.horizonStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Recovery-system temporal cognition may strengthen when mid-term sequencing aligns with long-horizon resilience transformation.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "temporal::strategic-momentum",
      cognitionDomain: "strategic_momentum",
      cognitionStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum temporal cognition may reflect how multi-horizon framing supports enterprise evolution under executive control.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "temporal::systemic-equilibrium",
      cognitionDomain: "systemic_equilibrium",
      cognitionStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - (input.fragmentationRecords[0]?.fragmentationStrength ?? 0)) * 0.15
      ),
      explanation:
        "Systemic equilibrium temporal cognition may preserve foresight when timeline fragmentation remains within evidence-grounded bounds.",
      contributingTimelineIds: Object.freeze(timelineIds.slice(0, 4)),
    })
  );

  logExecutiveCognitiveTimelineDev("TemporalCognition", {
    temporalRecordCount: records.length,
    fragmentationCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
