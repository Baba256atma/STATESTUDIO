import type { AutonomousExecutiveMetaCognitionLayerSnapshot } from "./executiveMetaCognitionTypes";
import { AUTONOMOUS_EXECUTIVE_META_COGNITION_SYNC_EVENT } from "./executiveMetaCognitionTypes";

export function publishAutonomousExecutiveMetaCognitionSnapshot(
  snapshot: AutonomousExecutiveMetaCognitionLayerSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTONOMOUS_EXECUTIVE_META_COGNITION_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
