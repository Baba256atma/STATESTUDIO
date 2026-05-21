import type { AutonomousInstitutionalIntelligenceRuntimeSnapshot } from "./enterpriseCognitiveRuntimeTypes";
import { AUTONOMOUS_INSTITUTIONAL_INTELLIGENCE_SYNC_EVENT } from "./enterpriseCognitiveRuntimeTypes";

export function publishAutonomousInstitutionalIntelligenceSnapshot(
  snapshot: AutonomousInstitutionalIntelligenceRuntimeSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTONOMOUS_INSTITUTIONAL_INTELLIGENCE_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
