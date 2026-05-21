import { getForesightCognitionStore } from "./foresightCognitionStore";
import type {
  AnticipatoryOperationalPattern,
  EmergingStrategicSignal,
  EnterpriseForesightSnapshot,
  OrganizationalFutureIndicator,
  StrategicPressureEmergence,
  WeakSignalDetection,
} from "./foresightCognitionTypes";

/** Readonly selectors for future executive foresight dashboards and weak-signal overlays. */

export function selectEmergingStrategicSignals(
  organizationId: string
): readonly EmergingStrategicSignal[] {
  return getForesightCognitionStore(organizationId).getState().emergingSignals;
}

export function selectEnterpriseForesightSnapshots(
  organizationId: string
): readonly EnterpriseForesightSnapshot[] {
  return getForesightCognitionStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseForesightSnapshot(
  organizationId: string
): EnterpriseForesightSnapshot | null {
  return getForesightCognitionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectWeakSignalDetections(
  organizationId: string
): readonly WeakSignalDetection[] {
  return getForesightCognitionStore(organizationId).getState().weakSignalDetections;
}

export function selectAnticipatoryOperationalPatterns(
  organizationId: string
): readonly AnticipatoryOperationalPattern[] {
  return getForesightCognitionStore(organizationId).getState().anticipatoryPatterns;
}

export function selectStrategicPressureEmergences(
  organizationId: string
): readonly StrategicPressureEmergence[] {
  return getForesightCognitionStore(organizationId).getState().pressureEmergences;
}

export function selectOrganizationalFutureIndicators(
  organizationId: string
): readonly OrganizationalFutureIndicator[] {
  return getForesightCognitionStore(organizationId).getState().futureIndicators;
}

export function selectForesightCognitionSignature(organizationId: string): string {
  return getForesightCognitionStore(organizationId).getState().signature;
}
