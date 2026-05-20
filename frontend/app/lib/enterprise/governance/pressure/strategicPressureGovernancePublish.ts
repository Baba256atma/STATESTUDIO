import type { InstitutionalStrategicPressureGovernanceSnapshot } from "./strategicPressureGovernanceTypes";
import { INSTITUTIONAL_STRATEGIC_PRESSURE_GOVERNANCE_SYNC_EVENT } from "./strategicPressureGovernanceTypes";

export function publishInstitutionalStrategicPressureGovernanceSnapshot(
  snapshot: InstitutionalStrategicPressureGovernanceSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(INSTITUTIONAL_STRATEGIC_PRESSURE_GOVERNANCE_SYNC_EVENT, {
      detail: snapshot,
    })
  );
}
