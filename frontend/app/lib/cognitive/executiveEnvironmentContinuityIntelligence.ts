/**
 * D7:6:9 — Executive environment continuity intelligence (unified cognitive environment).
 */

import type {
  UnifiedExecutiveEnvironmentSignal,
  ExecutiveEnvironmentContinuityRecord,
  CognitiveEnvironmentFragmentationRecord,
  CrossCognitiveSynchronizationRecord,
} from "./unifiedExecutiveCognitiveEnvironmentTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logUnifiedExecutiveCognitiveEnvironmentDev } from "./cognitiveEnvironmentDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeExecutiveEnvironmentContinuity(input: {
  environmentSignals: readonly UnifiedExecutiveEnvironmentSignal[];
  syncRecords: readonly CrossCognitiveSynchronizationRecord[];
  fragmentationRecords: readonly CognitiveEnvironmentFragmentationRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly ExecutiveEnvironmentContinuityRecord[] {
  const records: ExecutiveEnvironmentContinuityRecord[] = [];
  const environmentIds = input.environmentSignals.map((s) => s.environmentId);

  const narrativeTimelineSync = input.syncRecords.find((r) =>
    r.recordId.includes("narrative-timeline")
  );
  const immersionPresenceSync = input.syncRecords.find((r) =>
    r.recordId.includes("immersion-presence")
  );
  const governanceSync = input.syncRecords.find((r) =>
    r.recordId.includes("governance-awareness")
  );

  records.push(
    Object.freeze({
      recordId: "env-continuity::operations",
      continuityDomain: "operations",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (narrativeTimelineSync?.syncStrength ?? 0.3) * 0.25
      ),
      explanation:
        "Operational continuity may improve when unified cognition connects timelines, narratives, and simulations in one environment.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "env-continuity::logistics",
      continuityDomain: "logistics",
      continuityStrength: clamp01(
        (narrativeTimelineSync?.syncStrength ?? 0.4) * 0.55 +
          (immersionPresenceSync?.syncStrength ?? 0.3) * 0.3
      ),
      explanation:
        "Logistics continuity may trace recovery stabilization pathways across synchronized cognition layers.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "env-continuity::finance",
      continuityDomain: "finance",
      continuityStrength: clamp01(input.equilibriumState.equilibriumScore * 0.5),
      explanation:
        "Financial continuity may benefit when the unified environment links immediate pressure to long-horizon equilibrium.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "env-continuity::recovery",
      continuityDomain: "recovery",
      continuityStrength: clamp01(
        (immersionPresenceSync?.syncStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery-system continuity may strengthen when narrative, timeline, and immersion layers align on stabilization sequencing.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "env-continuity::strategic-momentum",
      continuityDomain: "strategic_momentum",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          input.divergenceState.futureConvergenceScore * 0.25
      ),
      explanation:
        "Strategic momentum continuity may reflect how unified environments support enterprise evolution under executive control.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "env-continuity::systemic-equilibrium",
      continuityDomain: "systemic_equilibrium",
      continuityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (governanceSync?.syncStrength ?? 0.3) * 0.15 +
          (1 - (input.fragmentationRecords[0]?.fragmentationStrength ?? 0)) * 0.08
      ),
      explanation:
        "Systemic equilibrium continuity may preserve strategic coherence when the executive environment remains evidence-grounded.",
      contributingEnvironmentIds: Object.freeze(environmentIds.slice(0, 4)),
    })
  );

  logUnifiedExecutiveCognitiveEnvironmentDev("CognitiveContinuity", {
    continuityRecordCount: records.length,
    fragmentationCount: input.fragmentationRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
