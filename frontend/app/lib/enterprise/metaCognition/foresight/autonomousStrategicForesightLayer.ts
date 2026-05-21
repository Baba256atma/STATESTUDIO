import { foresightSynchronizationGovernance } from "./foresightSynchronizationGovernance";
import {
  resolveAutonomousStrategicForesight,
  type ResolveAutonomousStrategicForesightInput,
} from "./resolveAutonomousStrategicForesight";
import type { AutonomousStrategicForesightLayerSnapshot } from "./institutionalFutureStateTypes";

/**
 * F10:4 — Autonomous strategic foresight + institutional future-state intelligence.
 * Structured future-state reasoning — not deterministic prediction.
 */
export class AutonomousStrategicForesightLayer {
  private lastSnapshot: AutonomousStrategicForesightLayerSnapshot | null = null;

  synchronize(
    input: ResolveAutonomousStrategicForesightInput
  ): AutonomousStrategicForesightLayerSnapshot {
    const snapshot = resolveAutonomousStrategicForesight(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): AutonomousStrategicForesightLayerSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return foresightSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    foresightSynchronizationGovernance.reset();
  }
}

export const autonomousStrategicForesightLayer = new AutonomousStrategicForesightLayer();
