import { getInterventionTimingStore } from "./interventionTimingStore";
import type {
  EnterpriseTimingSignal,
  InterventionWindowSnapshot,
  OperationalTimingSensitivity,
  StabilizationOpportunityField,
  StrategicInterventionWindow,
  TimingPressureIndicator,
} from "./interventionTimingTypes";

/** Readonly selectors for future intervention timing dashboards and response-window panels. */

export function selectStrategicInterventionWindows(
  organizationId: string
): readonly StrategicInterventionWindow[] {
  return getInterventionTimingStore(organizationId).getState().strategicInterventionWindows;
}

export function selectInterventionWindowSnapshots(
  organizationId: string
): readonly InterventionWindowSnapshot[] {
  return getInterventionTimingStore(organizationId).getState().snapshots;
}

export function selectLatestInterventionWindowSnapshot(
  organizationId: string
): InterventionWindowSnapshot | null {
  return getInterventionTimingStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseTimingSignals(
  organizationId: string
): readonly EnterpriseTimingSignal[] {
  return getInterventionTimingStore(organizationId).getState().timingSignals;
}

export function selectOperationalTimingSensitivities(
  organizationId: string
): readonly OperationalTimingSensitivity[] {
  return getInterventionTimingStore(organizationId).getState().timingSensitivities;
}

export function selectStabilizationOpportunityFields(
  organizationId: string
): readonly StabilizationOpportunityField[] {
  return getInterventionTimingStore(organizationId).getState().stabilizationOpportunityFields;
}

export function selectTimingPressureIndicators(
  organizationId: string
): readonly TimingPressureIndicator[] {
  return getInterventionTimingStore(organizationId).getState().timingPressureIndicators;
}

export function selectInterventionTimingSignature(organizationId: string): string {
  return getInterventionTimingStore(organizationId).getState().signature;
}
