import { getTrustCalibrationStore } from "./trustCalibrationStore";
import type {
  CognitiveReliabilityIndicator,
  EnterpriseReliabilitySignal,
  ExecutiveTrustCalibrationSnapshot,
  OperationalTrustworthinessField,
  StrategicTrustAdjustment,
} from "./trustCalibrationTypes";

/** Readonly selectors for future executive trust dashboards and reliability overlays. */

export function selectStrategicTrustAdjustments(
  organizationId: string
): readonly StrategicTrustAdjustment[] {
  return getTrustCalibrationStore(organizationId).getState().trustAdjustments;
}

export function selectExecutiveTrustCalibrationSnapshots(
  organizationId: string
): readonly ExecutiveTrustCalibrationSnapshot[] {
  return getTrustCalibrationStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveTrustCalibrationSnapshot(
  organizationId: string
): ExecutiveTrustCalibrationSnapshot | null {
  return getTrustCalibrationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseReliabilitySignals(
  organizationId: string
): readonly EnterpriseReliabilitySignal[] {
  return getTrustCalibrationStore(organizationId).getState().reliabilitySignals;
}

export function selectOperationalTrustworthinessFields(
  organizationId: string
): readonly OperationalTrustworthinessField[] {
  return getTrustCalibrationStore(organizationId).getState().trustworthinessFields;
}

export function selectCognitiveReliabilityIndicators(
  organizationId: string
): readonly CognitiveReliabilityIndicator[] {
  return getTrustCalibrationStore(organizationId).getState().reliabilityIndicators;
}

export function selectTrustCalibrationSignature(organizationId: string): string {
  return getTrustCalibrationStore(organizationId).getState().signature;
}
