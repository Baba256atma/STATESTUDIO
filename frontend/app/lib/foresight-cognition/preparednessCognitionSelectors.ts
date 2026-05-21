import { getPreparednessCognitionStore } from "./preparednessCognitionStore";
import type {
  EnterprisePreparednessSnapshot,
  OperationalResilienceCapability,
  OrganizationalResponseReadiness,
  PreparednessGapIndicator,
  StrategicReadinessSignal,
} from "./preparednessCognitionTypes";

/** Readonly selectors for future preparedness dashboards and executive readiness panels. */

export function selectStrategicReadinessSignals(
  organizationId: string
): readonly StrategicReadinessSignal[] {
  return getPreparednessCognitionStore(organizationId).getState().strategicReadinessSignals;
}

export function selectEnterprisePreparednessSnapshots(
  organizationId: string
): readonly EnterprisePreparednessSnapshot[] {
  return getPreparednessCognitionStore(organizationId).getState().snapshots;
}

export function selectLatestEnterprisePreparednessSnapshot(
  organizationId: string
): EnterprisePreparednessSnapshot | null {
  return getPreparednessCognitionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectOperationalResilienceCapabilities(
  organizationId: string
): readonly OperationalResilienceCapability[] {
  return getPreparednessCognitionStore(organizationId).getState().resilienceCapabilities;
}

export function selectPreparednessGapIndicators(
  organizationId: string
): readonly PreparednessGapIndicator[] {
  return getPreparednessCognitionStore(organizationId).getState().preparednessGapIndicators;
}

export function selectOrganizationalResponseReadiness(
  organizationId: string
): readonly OrganizationalResponseReadiness[] {
  return getPreparednessCognitionStore(organizationId).getState().responseReadiness;
}

export function selectPreparednessCognitionSignature(organizationId: string): string {
  return getPreparednessCognitionStore(organizationId).getState().signature;
}
