import { getDiversityPreservationStore } from "./diversityPreservationStore";
import type {
  AntiConsensusFragilitySignal,
  DiversityResilienceObservation,
  EnterpriseGroupthinkIndicator,
  PerspectivePluralityField,
  StrategicDiversitySnapshot,
} from "./diversityPreservationTypes";

/** Readonly selectors for future diversity-resilience dashboards and anti-groupthink overlays. */

export function selectDiversityResilienceObservations(
  organizationId: string
): readonly DiversityResilienceObservation[] {
  return getDiversityPreservationStore(organizationId).getState().observations;
}

export function selectStrategicDiversitySnapshots(
  organizationId: string
): readonly StrategicDiversitySnapshot[] {
  return getDiversityPreservationStore(organizationId).getState().snapshots;
}

export function selectLatestStrategicDiversitySnapshot(
  organizationId: string
): StrategicDiversitySnapshot | null {
  return getDiversityPreservationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseGroupthinkIndicators(
  organizationId: string
): readonly EnterpriseGroupthinkIndicator[] {
  return getDiversityPreservationStore(organizationId).getState().groupthinkIndicators;
}

export function selectAntiConsensusFragilitySignals(
  organizationId: string
): readonly AntiConsensusFragilitySignal[] {
  return getDiversityPreservationStore(organizationId).getState().fragilitySignals;
}

export function selectPerspectivePluralityFields(
  organizationId: string
): readonly PerspectivePluralityField[] {
  return getDiversityPreservationStore(organizationId).getState().pluralityFields;
}

export function selectDiversityPreservationSignature(organizationId: string): string {
  return getDiversityPreservationStore(organizationId).getState().signature;
}
