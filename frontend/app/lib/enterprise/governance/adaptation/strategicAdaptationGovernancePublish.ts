import type { InstitutionalStrategicAdaptationGovernanceSnapshot } from "./strategicAdaptationGovernanceTypes";
import { INSTITUTIONAL_STRATEGIC_ADAPTATION_GOVERNANCE_SYNC_EVENT } from "./strategicAdaptationGovernanceTypes";

export function publishInstitutionalStrategicAdaptationGovernanceSnapshot(
  snapshot: InstitutionalStrategicAdaptationGovernanceSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(INSTITUTIONAL_STRATEGIC_ADAPTATION_GOVERNANCE_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
