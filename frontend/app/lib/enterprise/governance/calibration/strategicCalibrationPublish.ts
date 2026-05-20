import type { AdaptiveStrategicCalibrationSnapshot } from "./adaptiveStrategicCalibrationTypes";
import { ADAPTIVE_STRATEGIC_CALIBRATION_SYNC_EVENT } from "./adaptiveStrategicCalibrationTypes";

export function publishAdaptiveStrategicCalibrationSnapshot(
  snapshot: AdaptiveStrategicCalibrationSnapshot
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(ADAPTIVE_STRATEGIC_CALIBRATION_SYNC_EVENT, { detail: snapshot })
  );
}
