import { getStrategicWillStore } from "./strategicWillStore";
import type {
  CrossSystemCommitmentField,
  DirectionalCommitmentSignal,
  EnterpriseCommitmentObservation,
  EnterpriseStrategicWillSnapshot,
  StrategicWillFragmentationIndicator,
} from "./strategicWillTypes";

/** Readonly selectors for future strategic commitment dashboards and directional coherence overlays. */

export function selectEnterpriseCommitmentObservations(
  organizationId: string
): readonly EnterpriseCommitmentObservation[] {
  return getStrategicWillStore(organizationId).getState().observations;
}

export function selectEnterpriseStrategicWillSnapshots(
  organizationId: string
): readonly EnterpriseStrategicWillSnapshot[] {
  return getStrategicWillStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseStrategicWillSnapshot(
  organizationId: string
): EnterpriseStrategicWillSnapshot | null {
  return getStrategicWillStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectDirectionalCommitmentSignals(
  organizationId: string
): readonly DirectionalCommitmentSignal[] {
  return getStrategicWillStore(organizationId).getState().directionalCommitmentSignals;
}

export function selectCrossSystemCommitmentFields(
  organizationId: string
): readonly CrossSystemCommitmentField[] {
  return getStrategicWillStore(organizationId).getState().crossSystemCommitmentFields;
}

export function selectStrategicWillFragmentationIndicators(
  organizationId: string
): readonly StrategicWillFragmentationIndicator[] {
  return getStrategicWillStore(organizationId).getState().fragmentationIndicators;
}

export function selectStrategicWillSignature(organizationId: string): string {
  return getStrategicWillStore(organizationId).getState().signature;
}
