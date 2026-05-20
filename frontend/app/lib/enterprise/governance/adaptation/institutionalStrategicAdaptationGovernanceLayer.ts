import { adaptationGovernanceSynchronizationGovernance } from "./adaptationGovernanceSynchronizationGovernance";
import {
  resolveInstitutionalStrategicAdaptationGovernance,
  type ResolveInstitutionalStrategicAdaptationGovernanceInput,
} from "./resolveInstitutionalStrategicAdaptationGovernance";
import type { InstitutionalStrategicAdaptationGovernanceSnapshot } from "./strategicAdaptationGovernanceTypes";

/**
 * F9:5 — Institutional strategic adaptation governance (organizational evolution cognition).
 */
export class InstitutionalStrategicAdaptationGovernanceLayer {
  private lastSnapshot: InstitutionalStrategicAdaptationGovernanceSnapshot | null = null;

  synchronize(
    input: ResolveInstitutionalStrategicAdaptationGovernanceInput
  ): InstitutionalStrategicAdaptationGovernanceSnapshot {
    const snapshot = resolveInstitutionalStrategicAdaptationGovernance(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): InstitutionalStrategicAdaptationGovernanceSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return adaptationGovernanceSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    adaptationGovernanceSynchronizationGovernance.reset();
  }
}

export const institutionalStrategicAdaptationGovernanceLayer =
  new InstitutionalStrategicAdaptationGovernanceLayer();
