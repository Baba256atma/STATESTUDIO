import { getTemporalMemorySyncStore } from "./temporalMemorySyncStore";
import type {
  CrossPeriodAwarenessSignal,
  InstitutionalTemporalSyncSnapshot,
  OrganizationalPeriodBridge,
  PeriodSynchronizationSequence,
  TemporalMemorySyncRecord,
  TemporalPeriodAlignment,
} from "./temporalMemorySyncTypes";

/** Readonly selectors for future executive cross-period panels and institutional sync dashboards. */

export function selectTemporalMemorySyncRecords(
  organizationId: string
): readonly TemporalMemorySyncRecord[] {
  return getTemporalMemorySyncStore(organizationId).getState().syncRecords;
}

export function selectInstitutionalTemporalSyncSnapshots(
  organizationId: string
): readonly InstitutionalTemporalSyncSnapshot[] {
  return getTemporalMemorySyncStore(organizationId).getState().snapshots;
}

export function selectLatestInstitutionalTemporalSyncSnapshot(
  organizationId: string
): InstitutionalTemporalSyncSnapshot | null {
  return getTemporalMemorySyncStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCrossPeriodAwarenessSignals(
  organizationId: string
): readonly CrossPeriodAwarenessSignal[] {
  return getTemporalMemorySyncStore(organizationId).getState().awarenessSignals;
}

export function selectOrganizationalPeriodBridges(
  organizationId: string
): readonly OrganizationalPeriodBridge[] {
  return getTemporalMemorySyncStore(organizationId).getState().periodBridges;
}

export function selectTemporalPeriodAlignments(
  organizationId: string
): readonly TemporalPeriodAlignment[] {
  return getTemporalMemorySyncStore(organizationId).getState().periodAlignments;
}

export function selectPeriodSynchronizationSequences(
  organizationId: string
): readonly PeriodSynchronizationSequence[] {
  return getTemporalMemorySyncStore(organizationId).getState().sequences;
}

export function selectTemporalMemorySyncSignature(organizationId: string): string {
  return getTemporalMemorySyncStore(organizationId).getState().signature;
}
