import { getTemporalCompressionStore } from "./temporalCompressionStore";
import type {
  EvolutionDistillationSignal,
  ExecutiveTemporalDigest,
  OrganizationalEvolutionSummary,
  StrategicTimelineCompression,
  TemporalAbstractionLayer,
  TemporalCompressionSnapshot,
} from "./temporalCompressionTypes";

/** Readonly selectors for future executive digests, evolution dashboards, and abstraction panels. */

export function selectExecutiveTemporalDigests(
  organizationId: string
): readonly ExecutiveTemporalDigest[] {
  return getTemporalCompressionStore(organizationId).getState().digests;
}

export function selectOrganizationalEvolutionSummaries(
  organizationId: string
): readonly OrganizationalEvolutionSummary[] {
  return getTemporalCompressionStore(organizationId).getState().summaries;
}

export function selectStrategicTimelineCompressions(
  organizationId: string
): readonly StrategicTimelineCompression[] {
  return getTemporalCompressionStore(organizationId).getState().timelineCompressions;
}

export function selectTemporalCompressionSnapshots(
  organizationId: string
): readonly TemporalCompressionSnapshot[] {
  return getTemporalCompressionStore(organizationId).getState().snapshots;
}

export function selectLatestTemporalCompressionSnapshot(
  organizationId: string
): TemporalCompressionSnapshot | null {
  return getTemporalCompressionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEvolutionDistillationSignals(
  organizationId: string
): readonly EvolutionDistillationSignal[] {
  return getTemporalCompressionStore(organizationId).getState().signals;
}

export function selectTemporalAbstractionLayers(
  organizationId: string
): readonly TemporalAbstractionLayer[] {
  return getTemporalCompressionStore(organizationId).getState().abstractionLayers;
}

export function selectTemporalCompressionSignature(organizationId: string): string {
  return getTemporalCompressionStore(organizationId).getState().signature;
}
