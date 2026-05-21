import { getStrategicIdentityStore } from "./strategicIdentityStore";
import type {
  EnterpriseStrategicIdentitySnapshot,
  IdentityAlignmentObservation,
  OrganizationalDriftIndicator,
  OrganizationalSelfConsistencySignal,
  StrategicIdentityField,
} from "./strategicIdentityTypes";

/** Readonly selectors for future enterprise-purpose dashboards and executive-alignment overlays. */

export function selectIdentityAlignmentObservations(
  organizationId: string
): readonly IdentityAlignmentObservation[] {
  return getStrategicIdentityStore(organizationId).getState().observations;
}

export function selectEnterpriseStrategicIdentitySnapshots(
  organizationId: string
): readonly EnterpriseStrategicIdentitySnapshot[] {
  return getStrategicIdentityStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseStrategicIdentitySnapshot(
  organizationId: string
): EnterpriseStrategicIdentitySnapshot | null {
  return getStrategicIdentityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectOrganizationalSelfConsistencySignals(
  organizationId: string
): readonly OrganizationalSelfConsistencySignal[] {
  return getStrategicIdentityStore(organizationId).getState().selfConsistencySignals;
}

export function selectStrategicIdentityFields(
  organizationId: string
): readonly StrategicIdentityField[] {
  return getStrategicIdentityStore(organizationId).getState().strategicIdentityFields;
}

export function selectOrganizationalDriftIndicators(
  organizationId: string
): readonly OrganizationalDriftIndicator[] {
  return getStrategicIdentityStore(organizationId).getState().driftIndicators;
}

export function selectStrategicIdentitySignature(organizationId: string): string {
  return getStrategicIdentityStore(organizationId).getState().signature;
}
