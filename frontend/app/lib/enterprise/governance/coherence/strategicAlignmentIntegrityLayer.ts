import { coherenceSynchronizationGovernance } from "./coherenceSynchronizationGovernance";
import {
  resolveStrategicAlignmentIntegrity,
  type ResolveStrategicAlignmentIntegrityInput,
} from "./resolveStrategicAlignmentIntegrity";
import type { StrategicAlignmentIntegritySnapshot } from "./enterpriseStrategicCoherenceTypes";

/**
 * F9:2 — Strategic alignment integrity layer (enterprise coherence cognition).
 */
export class StrategicAlignmentIntegrityLayer {
  private lastSnapshot: StrategicAlignmentIntegritySnapshot | null = null;

  synchronize(
    input: ResolveStrategicAlignmentIntegrityInput
  ): StrategicAlignmentIntegritySnapshot {
    const snapshot = resolveStrategicAlignmentIntegrity(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): StrategicAlignmentIntegritySnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return coherenceSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    coherenceSynchronizationGovernance.reset();
  }
}

export const strategicAlignmentIntegrityLayer = new StrategicAlignmentIntegrityLayer();
