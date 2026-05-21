import { getInstitutionalInfluenceStore } from "./institutionalInfluenceStore";
import type {
  CivilizationImpactSignal,
  EcosystemImpactTopology,
  InstitutionalInfluenceSnapshot,
  MacroInfluenceObservation,
  OperationalInfluenceField,
} from "./institutionalInfluenceTypes";

/** Readonly selectors for future institutional-impact dashboards and ecosystem-influence overlays. */

export function selectMacroInfluenceObservations(
  organizationId: string
): readonly MacroInfluenceObservation[] {
  return getInstitutionalInfluenceStore(organizationId).getState().observations;
}

export function selectInstitutionalInfluenceSnapshots(
  organizationId: string
): readonly InstitutionalInfluenceSnapshot[] {
  return getInstitutionalInfluenceStore(organizationId).getState().snapshots;
}

export function selectLatestInstitutionalInfluenceSnapshot(
  organizationId: string
): InstitutionalInfluenceSnapshot | null {
  return getInstitutionalInfluenceStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCivilizationImpactSignals(
  organizationId: string
): readonly CivilizationImpactSignal[] {
  return getInstitutionalInfluenceStore(organizationId).getState().impactSignals;
}

export function selectOperationalInfluenceFields(
  organizationId: string
): readonly OperationalInfluenceField[] {
  return getInstitutionalInfluenceStore(organizationId).getState().influenceFields;
}

export function selectEcosystemImpactTopologies(
  organizationId: string
): readonly EcosystemImpactTopology[] {
  return getInstitutionalInfluenceStore(organizationId).getState().impactTopologies;
}

export function selectInstitutionalInfluenceSignature(organizationId: string): string {
  return getInstitutionalInfluenceStore(organizationId).getState().signature;
}
