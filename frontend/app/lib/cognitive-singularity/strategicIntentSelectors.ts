import { getStrategicIntentStore } from "./strategicIntentStore";
import type {
  EnterprisePurposeAlignmentSignal,
  OrganizationalIntentTopology,
  PurposeAlignmentObservation,
  StrategicDirectionField,
  UnifiedStrategicIntentSnapshot,
} from "./strategicIntentTypes";

/** Readonly selectors for future enterprise-purpose dashboards and executive-alignment overlays. */

export function selectPurposeAlignmentObservations(
  organizationId: string
): readonly PurposeAlignmentObservation[] {
  return getStrategicIntentStore(organizationId).getState().observations;
}

export function selectUnifiedStrategicIntentSnapshots(
  organizationId: string
): readonly UnifiedStrategicIntentSnapshot[] {
  return getStrategicIntentStore(organizationId).getState().snapshots;
}

export function selectLatestUnifiedStrategicIntentSnapshot(
  organizationId: string
): UnifiedStrategicIntentSnapshot | null {
  return getStrategicIntentStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterprisePurposeAlignmentSignals(
  organizationId: string
): readonly EnterprisePurposeAlignmentSignal[] {
  return getStrategicIntentStore(organizationId).getState().purposeAlignmentSignals;
}

export function selectStrategicDirectionFields(
  organizationId: string
): readonly StrategicDirectionField[] {
  return getStrategicIntentStore(organizationId).getState().strategicDirectionFields;
}

export function selectOrganizationalIntentTopologies(
  organizationId: string
): readonly OrganizationalIntentTopology[] {
  return getStrategicIntentStore(organizationId).getState().intentTopologies;
}

export function selectStrategicIntentSignature(organizationId: string): string {
  return getStrategicIntentStore(organizationId).getState().signature;
}
