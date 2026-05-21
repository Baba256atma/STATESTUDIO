import type { UnifiedStrategicConsciousnessRuntimeSnapshot } from "./unifiedStrategicConsciousnessTypes";
import { UNIFIED_STRATEGIC_CONSCIOUSNESS_SYNC_EVENT } from "./unifiedStrategicConsciousnessTypes";

export function publishUnifiedStrategicConsciousnessSnapshot(
  snapshot: UnifiedStrategicConsciousnessRuntimeSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(UNIFIED_STRATEGIC_CONSCIOUSNESS_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
