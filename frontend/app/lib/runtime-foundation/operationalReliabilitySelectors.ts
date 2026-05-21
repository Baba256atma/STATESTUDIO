import { getOperationalReliabilityStore } from "./operationalReliabilityStore";
import type {
  ExecutiveOperationalReliabilitySnapshot,
  OperationalReliabilityHistoryEntry,
  OperationalReliabilityObservation,
  RuntimeTrustRiskIndicator,
  RuntimeTrustSignal,
} from "./operationalReliabilityTypes";

/** Readonly selectors for future runtime trust badges and operational reliability dashboards. */

export function selectExecutiveOperationalReliabilitySnapshots(
  organizationId: string
): readonly ExecutiveOperationalReliabilitySnapshot[] {
  return getOperationalReliabilityStore(organizationId).getState().reliabilitySnapshots;
}

export function selectLatestExecutiveOperationalReliabilitySnapshot(
  organizationId: string
): ExecutiveOperationalReliabilitySnapshot | null {
  return (
    getOperationalReliabilityStore(organizationId).getState().reliabilitySnapshots[0] ?? null
  );
}

export function selectOperationalReliabilityObservations(
  organizationId: string
): readonly OperationalReliabilityObservation[] {
  return getOperationalReliabilityStore(organizationId).getState().trustObservations;
}

export function selectRuntimeTrustSignals(organizationId: string): readonly RuntimeTrustSignal[] {
  return (
    selectLatestExecutiveOperationalReliabilitySnapshot(organizationId)?.runtimeTrustSignals ?? []
  );
}

export function selectRuntimeTrustRiskIndicators(
  organizationId: string
): readonly RuntimeTrustRiskIndicator[] {
  return (
    selectLatestExecutiveOperationalReliabilitySnapshot(organizationId)?.runtimeTrustRiskIndicators ??
    []
  );
}

export function selectOperationalReliabilityHistory(
  organizationId: string
): readonly OperationalReliabilityHistoryEntry[] {
  return getOperationalReliabilityStore(organizationId).getState().trustHistory;
}

export function selectOperationalReliabilitySignature(organizationId: string): string {
  return getOperationalReliabilityStore(organizationId).getState().signature;
}
