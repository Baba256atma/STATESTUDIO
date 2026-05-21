import type { AutonomousStrategicForesightLayerSnapshot } from "./institutionalFutureStateTypes";
import { AUTONOMOUS_STRATEGIC_FORESIGHT_SYNC_EVENT } from "./institutionalFutureStateTypes";

export function publishAutonomousStrategicForesightSnapshot(
  snapshot: AutonomousStrategicForesightLayerSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTONOMOUS_STRATEGIC_FORESIGHT_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
