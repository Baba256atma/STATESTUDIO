/**
 * D7:7:2 — Enterprise continuity intelligence (synchronized operational reality).
 */

import type {
  CrossDomainSynchronizationRecord,
  EnterpriseContinuityRecord,
  EnterpriseRealitySynchronizationSignal,
  OperationalDriftRecord,
} from "./enterpriseRealitySynchronizationTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import { logEnterpriseRealitySynchronizationDev } from "./enterpriseRealitySynchronizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterpriseContinuity(input: {
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  syncRecords: readonly CrossDomainSynchronizationRecord[];
  driftRecords: readonly OperationalDriftRecord[];
  trajectoryState: PredictiveTrajectoryState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterpriseContinuityRecord[] {
  const records: EnterpriseContinuityRecord[] = [];
  const syncIds = input.synchronizationSignals.map((s) => s.synchronizationId);

  const recoveryLogistics = input.syncRecords.find((r) =>
    r.recordId.includes("recovery-logistics")
  );
  const governanceAlignment = input.syncRecords.find((r) =>
    r.recordId.includes("governance-alignment")
  );
  const enterpriseContinuity = input.syncRecords.find((r) =>
    r.recordId.includes("enterprise-continuity")
  );

  const driftPenalty =
    input.driftRecords.length === 0
      ? 0
      : input.driftRecords.reduce((s, r) => s + r.driftStrength, 0) /
        input.driftRecords.length;

  records.push(
    Object.freeze({
      recordId: "continuity::operations",
      continuityDomain: "operations",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.45 +
          (enterpriseContinuity?.syncStrength ?? 0.3) * 0.3 -
          driftPenalty * 0.1
      ),
      explanation:
        "Operations continuity may improve when synchronized enterprise reality stabilizes cross-domain operational movement.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::logistics",
      continuityDomain: "logistics",
      continuityStrength: clamp01(
        (recoveryLogistics?.syncStrength ?? 0.35) * 0.55 +
          input.momentumState.recoveryMomentumScore * 0.3 -
          driftPenalty * 0.08
      ),
      explanation:
        "Logistics continuity may strengthen when recovery systems synchronize with manufacturing and staffing pathways.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::finance",
      continuityDomain: "finance",
      continuityStrength: clamp01(
        (governanceAlignment?.syncStrength ?? 0.35) * 0.5 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.25 -
          driftPenalty * 0.1
      ),
      explanation:
        "Finance continuity may depend on governance alignment when financial coordination pathways introduce operational drift.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::recovery",
      continuityDomain: "recovery",
      continuityStrength: clamp01(
        input.momentumState.recoveryMomentumScore * 0.5 +
          (recoveryLogistics?.syncStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Recovery continuity may advance when manufacturing recovery synchronization aligns with governance stabilization.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::strategic-momentum",
      continuityDomain: "strategic_momentum",
      continuityStrength: clamp01(
        input.momentumState.organizationalMomentumScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 -
          driftPenalty * 0.08
      ),
      explanation:
        "Strategic momentum continuity may preserve enterprise-wide alignment when predictive and operational layers synchronize.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "continuity::systemic-equilibrium",
      continuityDomain: "systemic_equilibrium",
      continuityStrength: clamp01(
        input.equilibriumState.equilibriumScore * 0.5 +
          (enterpriseContinuity?.syncStrength ?? 0.3) * 0.35
      ),
      explanation:
        "Systemic equilibrium continuity may reflect balanced operational pressure when synchronized reality spans all enterprise domains.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
    })
  );

  logEnterpriseRealitySynchronizationDev("EnterpriseContinuity", {
    continuityRecordCount: records.length,
    driftRecordCount: input.driftRecords.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
