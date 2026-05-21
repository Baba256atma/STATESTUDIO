import { metaCognitionSynchronizationGovernance } from "./metaCognitionSynchronizationGovernance";
import {
  resolveAutonomousExecutiveMetaCognition,
  type ResolveAutonomousExecutiveMetaCognitionInput,
} from "./resolveAutonomousExecutiveMetaCognition";
import type { AutonomousExecutiveMetaCognitionLayerSnapshot } from "./executiveMetaCognitionTypes";

/**
 * F10:1 — Autonomous executive meta-cognition (enterprise strategic self-awareness).
 */
export class AutonomousExecutiveMetaCognitionLayer {
  private lastSnapshot: AutonomousExecutiveMetaCognitionLayerSnapshot | null = null;

  synchronize(
    input: ResolveAutonomousExecutiveMetaCognitionInput
  ): AutonomousExecutiveMetaCognitionLayerSnapshot {
    const snapshot = resolveAutonomousExecutiveMetaCognition(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): AutonomousExecutiveMetaCognitionLayerSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return metaCognitionSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    metaCognitionSynchronizationGovernance.reset();
  }
}

export const autonomousExecutiveMetaCognitionLayer = new AutonomousExecutiveMetaCognitionLayer();
