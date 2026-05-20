import type { StrategicAlignmentIntegritySnapshot } from "./enterpriseStrategicCoherenceTypes";
import { STRATEGIC_ALIGNMENT_INTEGRITY_SYNC_EVENT } from "./enterpriseStrategicCoherenceTypes";

export function publishStrategicAlignmentIntegritySnapshot(
  snapshot: StrategicAlignmentIntegritySnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(STRATEGIC_ALIGNMENT_INTEGRITY_SYNC_EVENT, { detail: snapshot })
  );
}
