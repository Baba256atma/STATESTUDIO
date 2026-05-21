import { getOperationalReplayStore } from "./operationalReplayStore";
import type {
  EnterpriseReplayFrame,
  HistoricalScenarioReconstruction,
  OperationalReplaySequence,
  OrganizationalReplaySnapshot,
  StrategicReplayEvent,
} from "./operationalReplayTypes";

/** Readonly selectors for future replay timelines, dashboards, and reconstruction overlays. */

export function selectOperationalReplaySequences(
  organizationId: string
): readonly OperationalReplaySequence[] {
  return getOperationalReplayStore(organizationId).getState().replays;
}

export function selectHistoricalScenarioReconstructions(
  organizationId: string
): readonly HistoricalScenarioReconstruction[] {
  return getOperationalReplayStore(organizationId).getState().scenarios;
}

export function selectEnterpriseReplayFrames(
  organizationId: string
): readonly EnterpriseReplayFrame[] {
  return getOperationalReplayStore(organizationId).getState().frames;
}

export function selectOrganizationalReplaySnapshots(
  organizationId: string
): readonly OrganizationalReplaySnapshot[] {
  return getOperationalReplayStore(organizationId).getState().snapshots;
}

export function selectLatestOrganizationalReplaySnapshot(
  organizationId: string
): OrganizationalReplaySnapshot | null {
  return getOperationalReplayStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicReplayEvents(
  organizationId: string
): readonly StrategicReplayEvent[] {
  return getOperationalReplayStore(organizationId).getState().strategicEvents;
}

export function selectOperationalReplaySignature(organizationId: string): string {
  return getOperationalReplayStore(organizationId).getState().signature;
}
