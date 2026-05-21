import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  EnterpriseTemporalSnapshot,
  OperationalChronologyFrame,
  OrganizationalEvolutionEvent,
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TemporalCognitionSignal,
} from "./temporalCognitionTypes";

/** Readonly selectors for future executive timelines, chronology overlays, and replay systems. */

export function selectStrategicTimelineSequences(
  organizationId: string
): readonly StrategicTimelineSequence[] {
  return getTemporalCognitionStore(organizationId).getState().sequences;
}

export function selectOrganizationalTimelineEvents(
  organizationId: string
): readonly OrganizationalTimelineEvent[] {
  return getTemporalCognitionStore(organizationId).getState().events;
}

export function selectEnterpriseTemporalSnapshots(
  organizationId: string
): readonly EnterpriseTemporalSnapshot[] {
  return getTemporalCognitionStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseTemporalSnapshot(
  organizationId: string
): EnterpriseTemporalSnapshot | null {
  return getTemporalCognitionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectTemporalCognitionSignals(
  organizationId: string
): readonly TemporalCognitionSignal[] {
  return getTemporalCognitionStore(organizationId).getState().signals;
}

export function selectOperationalChronologyFrames(
  organizationId: string
): readonly OperationalChronologyFrame[] {
  return getTemporalCognitionStore(organizationId).getState().chronologyFrames;
}

export function selectOrganizationalEvolutionEvents(
  organizationId: string
): readonly OrganizationalEvolutionEvent[] {
  return getTemporalCognitionStore(organizationId).getState().evolutionEvents;
}

export function selectTemporalCognitionSignature(organizationId: string): string {
  return getTemporalCognitionStore(organizationId).getState().signature;
}
