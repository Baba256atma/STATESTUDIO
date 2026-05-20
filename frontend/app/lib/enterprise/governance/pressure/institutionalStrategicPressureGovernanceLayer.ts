import { pressureGovernanceSynchronizationGovernance } from "./pressureGovernanceSynchronizationGovernance";
import {
  resolveInstitutionalStrategicPressureGovernance,
  type ResolveInstitutionalStrategicPressureGovernanceInput,
} from "./resolveInstitutionalStrategicPressureGovernance";
import type { InstitutionalStrategicPressureGovernanceSnapshot } from "./strategicPressureGovernanceTypes";

/**
 * F9:4 — Institutional strategic pressure governance (executive stability cognition).
 */
export class InstitutionalStrategicPressureGovernanceLayer {
  private lastSnapshot: InstitutionalStrategicPressureGovernanceSnapshot | null = null;

  synchronize(
    input: ResolveInstitutionalStrategicPressureGovernanceInput
  ): InstitutionalStrategicPressureGovernanceSnapshot {
    const snapshot = resolveInstitutionalStrategicPressureGovernance(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): InstitutionalStrategicPressureGovernanceSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return pressureGovernanceSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    pressureGovernanceSynchronizationGovernance.reset();
  }
}

export const institutionalStrategicPressureGovernanceLayer =
  new InstitutionalStrategicPressureGovernanceLayer();
