import type { InstitutionalStrategicReflectionLayerSnapshot } from "./institutionalStrategicReflectionTypes";
import { INSTITUTIONAL_STRATEGIC_REFLECTION_SYNC_EVENT } from "./institutionalStrategicReflectionTypes";

export function publishInstitutionalStrategicReflectionSnapshot(
  snapshot: InstitutionalStrategicReflectionLayerSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(INSTITUTIONAL_STRATEGIC_REFLECTION_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
