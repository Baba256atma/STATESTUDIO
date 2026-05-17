/**
 * D7:1:10 — Replay integrity verification (failures never silently pass).
 */

import type { ReplayOrchestrationSnapshot } from "../replay/replayTypes.ts";
import type { ReplayIntegrityFailure, ReplayIntegrityReport } from "./simulationGovernanceTypes.ts";
import { GOVERNANCE_POLICY } from "./governancePolicies.ts";
import { logGovernanceDev } from "./governanceDevLog.ts";

function verifyReplaySnapshot(snapshot: ReplayOrchestrationSnapshot): ReplayIntegrityFailure[] {
  const failures: ReplayIntegrityFailure[] = [];
  const replayId = snapshot.session.replayId;

  if (snapshot.session.sourceTimelineId !== snapshot.reconstruction.timelineId) {
    failures.push({
      replayId,
      code: "timeline_mismatch",
      message: "Replay session source timeline does not match reconstruction bundle",
    });
  }

  const ordered = snapshot.reconstruction.orderedSnapshots;
  for (let i = 1; i < ordered.length; i += 1) {
    if (ordered[i]!.timestamp.tick < ordered[i - 1]!.timestamp.tick) {
      failures.push({
        replayId,
        code: "snapshot_order",
        message: "Replay reconstruction snapshot order is corrupted",
      });
      break;
    }
  }

  if (ordered.length !== snapshot.reconstruction.replayTrack.frames.length) {
    failures.push({
      replayId,
      code: "frame_count_mismatch",
      message: "Replay track frame count does not match ordered snapshots",
    });
  }

  const markers = snapshot.reconstruction.decisionMarkers;
  for (let i = 1; i < markers.length; i += 1) {
    if (markers[i]!.appliedAtTick < markers[i - 1]!.appliedAtTick) {
      failures.push({
        replayId,
        code: "intervention_order",
        message: "Decision replay markers are not monotonically ordered by tick",
      });
      break;
    }
  }

  if (!snapshot.fingerprint || snapshot.fingerprint.length < 8) {
    failures.push({
      replayId,
      code: "missing_fingerprint",
      message: "Replay orchestration snapshot missing stable fingerprint",
    });
  }

  if (!snapshot.memory.fingerprint) {
    failures.push({
      replayId,
      code: "memory_fingerprint",
      message: "Strategic memory snapshot missing fingerprint",
    });
  }

  return failures;
}

export function verifyReplayIntegrity(
  replaySnapshots: readonly ReplayOrchestrationSnapshot[] | undefined
): ReplayIntegrityReport {
  const snapshots = replaySnapshots ?? [];
  const failures: ReplayIntegrityFailure[] = [];

  for (const snapshot of snapshots) {
    failures.push(...verifyReplaySnapshot(snapshot));
  }

  const score =
    snapshots.length === 0
      ? 1
      : Number(
          Math.max(
            0,
            1 - failures.length / Math.max(1, snapshots.length * 2)
          ).toFixed(4)
        );

  const verified = failures.length === 0 && score >= GOVERNANCE_POLICY.minReplayIntegrityScore;

  logGovernanceDev("ReplayValidation", {
    checked: snapshots.length,
    failures: failures.length,
    verified,
    score,
  });

  return Object.freeze({
    verified,
    checkedReplayCount: snapshots.length,
    failures: Object.freeze(failures),
    score,
  });
}
