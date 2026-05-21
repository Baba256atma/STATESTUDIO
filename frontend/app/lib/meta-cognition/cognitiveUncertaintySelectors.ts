import { getCognitiveUncertaintyStore } from "./cognitiveUncertaintyStore";
import type {
  EnterpriseAmbiguitySignal,
  ExecutiveCognitiveUncertaintySnapshot,
  IncompleteInformationIndicator,
  StrategicAmbiguityObservation,
  UncertaintyTopologyField,
  UnknownZoneObservation,
} from "./cognitiveUncertaintyTypes";

/** Readonly selectors for future ambiguity dashboards and executive caution overlays. */

export function selectStrategicAmbiguityObservations(
  organizationId: string
): readonly StrategicAmbiguityObservation[] {
  return getCognitiveUncertaintyStore(organizationId).getState().ambiguityObservations;
}

export function selectExecutiveCognitiveUncertaintySnapshots(
  organizationId: string
): readonly ExecutiveCognitiveUncertaintySnapshot[] {
  return getCognitiveUncertaintyStore(organizationId).getState().snapshots;
}

export function selectLatestExecutiveCognitiveUncertaintySnapshot(
  organizationId: string
): ExecutiveCognitiveUncertaintySnapshot | null {
  return getCognitiveUncertaintyStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseAmbiguitySignals(
  organizationId: string
): readonly EnterpriseAmbiguitySignal[] {
  return getCognitiveUncertaintyStore(organizationId).getState().ambiguitySignals;
}

export function selectUncertaintyTopologyFields(
  organizationId: string
): readonly UncertaintyTopologyField[] {
  return getCognitiveUncertaintyStore(organizationId).getState().uncertaintyTopologyFields;
}

export function selectIncompleteInformationIndicators(
  organizationId: string
): readonly IncompleteInformationIndicator[] {
  return getCognitiveUncertaintyStore(organizationId).getState().incompleteInformationIndicators;
}

export function selectUnknownZoneObservations(
  organizationId: string
): readonly UnknownZoneObservation[] {
  return getCognitiveUncertaintyStore(organizationId).getState().unknownZoneObservations;
}

export function selectCognitiveUncertaintySignature(organizationId: string): string {
  return getCognitiveUncertaintyStore(organizationId).getState().signature;
}
