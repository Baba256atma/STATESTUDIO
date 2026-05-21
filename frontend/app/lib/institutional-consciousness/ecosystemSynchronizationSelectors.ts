import { getEcosystemSynchronizationStore } from "./ecosystemSynchronizationStore";
import type {
  CivilizationScaleCoordinationField,
  EcosystemSynchronizationSnapshot,
  InstitutionalInterdependencySignal,
  MacroDependencyTopology,
  OperationalSynchronizationObservation,
} from "./ecosystemSynchronizationTypes";

/** Readonly selectors for future ecosystem-synchronization dashboards and interdependency overlays. */

export function selectOperationalSynchronizationObservations(
  organizationId: string
): readonly OperationalSynchronizationObservation[] {
  return getEcosystemSynchronizationStore(organizationId).getState().observations;
}

export function selectEcosystemSynchronizationSnapshots(
  organizationId: string
): readonly EcosystemSynchronizationSnapshot[] {
  return getEcosystemSynchronizationStore(organizationId).getState().snapshots;
}

export function selectLatestEcosystemSynchronizationSnapshot(
  organizationId: string
): EcosystemSynchronizationSnapshot | null {
  return getEcosystemSynchronizationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectInstitutionalInterdependencySignals(
  organizationId: string
): readonly InstitutionalInterdependencySignal[] {
  return getEcosystemSynchronizationStore(organizationId).getState().interdependencySignals;
}

export function selectCivilizationScaleCoordinationFields(
  organizationId: string
): readonly CivilizationScaleCoordinationField[] {
  return getEcosystemSynchronizationStore(organizationId).getState().coordinationFields;
}

export function selectMacroDependencyTopologies(
  organizationId: string
): readonly MacroDependencyTopology[] {
  return getEcosystemSynchronizationStore(organizationId).getState().dependencyTopologies;
}

export function selectEcosystemSynchronizationSignature(organizationId: string): string {
  return getEcosystemSynchronizationStore(organizationId).getState().signature;
}
