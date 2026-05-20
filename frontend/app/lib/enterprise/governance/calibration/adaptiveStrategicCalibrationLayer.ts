import { calibrationSynchronizationGovernance } from "./calibrationSynchronizationGovernance";
import {
  resolveAdaptiveStrategicCalibration,
  type ResolveAdaptiveStrategicCalibrationInput,
} from "./resolveAdaptiveStrategicCalibration";
import type { AdaptiveStrategicCalibrationSnapshot } from "./adaptiveStrategicCalibrationTypes";

/**
 * F9:3 — Adaptive strategic calibration layer (institutional decision quality cognition).
 */
export class AdaptiveStrategicCalibrationLayer {
  private lastSnapshot: AdaptiveStrategicCalibrationSnapshot | null = null;

  synchronize(
    input: ResolveAdaptiveStrategicCalibrationInput
  ): AdaptiveStrategicCalibrationSnapshot {
    const snapshot = resolveAdaptiveStrategicCalibration(input);
    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): AdaptiveStrategicCalibrationSnapshot | null {
    return this.lastSnapshot;
  }

  shouldPublish(): boolean {
    return calibrationSynchronizationGovernance.shouldPublishSnapshot();
  }

  reset(): void {
    this.lastSnapshot = null;
    calibrationSynchronizationGovernance.reset();
  }
}

export const adaptiveStrategicCalibrationLayer = new AdaptiveStrategicCalibrationLayer();
