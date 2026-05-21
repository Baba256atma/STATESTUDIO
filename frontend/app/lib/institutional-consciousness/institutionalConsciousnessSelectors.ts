import { getInstitutionalConsciousnessStore } from "./institutionalConsciousnessStore";
import type {
  CivilizationScaleAwarenessField,
  EcosystemOperationalSignal,
  EnterpriseEcosystemRelationship,
  InstitutionalConsciousnessSnapshot,
  MacroOperationalObservation,
} from "./institutionalConsciousnessTypes";

/** Readonly selectors for future institutional-awareness dashboards and ecosystem overlays. */

export function selectMacroOperationalObservations(
  organizationId: string
): readonly MacroOperationalObservation[] {
  return getInstitutionalConsciousnessStore(organizationId).getState().observations;
}

export function selectInstitutionalConsciousnessSnapshots(
  organizationId: string
): readonly InstitutionalConsciousnessSnapshot[] {
  return getInstitutionalConsciousnessStore(organizationId).getState().snapshots;
}

export function selectLatestInstitutionalConsciousnessSnapshot(
  organizationId: string
): InstitutionalConsciousnessSnapshot | null {
  return getInstitutionalConsciousnessStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEcosystemOperationalSignals(
  organizationId: string
): readonly EcosystemOperationalSignal[] {
  return getInstitutionalConsciousnessStore(organizationId).getState().ecosystemSignals;
}

export function selectCivilizationScaleAwarenessFields(
  organizationId: string
): readonly CivilizationScaleAwarenessField[] {
  return getInstitutionalConsciousnessStore(organizationId).getState().awarenessFields;
}

export function selectEnterpriseEcosystemRelationships(
  organizationId: string
): readonly EnterpriseEcosystemRelationship[] {
  return getInstitutionalConsciousnessStore(organizationId).getState().ecosystemRelationships;
}

export function selectInstitutionalConsciousnessSignature(organizationId: string): string {
  return getInstitutionalConsciousnessStore(organizationId).getState().signature;
}
