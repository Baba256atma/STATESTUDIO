import { institutionalReflectionSynchronizationGovernance } from "./institutionalReflectionSynchronizationGovernance";
import {
  resolveInstitutionalStrategicReflection,
  type ResolveInstitutionalStrategicReflectionInput,
} from "./resolveInstitutionalStrategicReflection";
import type { InstitutionalStrategicReflectionLayerSnapshot } from "./institutionalStrategicReflectionTypes";

/**
 * F10:3 — Institutional strategic reflection + executive cognitive evolution intelligence.
 */
export class InstitutionalStrategicReflectionLayer {
  private lastSnapshot: InstitutionalStrategicReflectionLayerSnapshot | null = null;

  synchronize(
    input: ResolveInstitutionalStrategicReflectionInput
  ): InstitutionalStrategicReflectionLayerSnapshot {
    const snapshot = resolveInstitutionalStrategicReflection(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): InstitutionalStrategicReflectionLayerSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return institutionalReflectionSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    institutionalReflectionSynchronizationGovernance.reset();
  }
}

export const institutionalStrategicReflectionLayer = new InstitutionalStrategicReflectionLayer();
