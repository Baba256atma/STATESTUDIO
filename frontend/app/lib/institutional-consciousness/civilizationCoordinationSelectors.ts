import { getCivilizationCoordinationStore } from "./civilizationCoordinationStore";
import type {
  CivilizationCoordinationSnapshot,
  CoordinationStabilityObservation,
  EcosystemAlignmentTopology,
  InstitutionalHarmonySignal,
  MacroOperationalCoherenceField,
} from "./civilizationCoordinationTypes";

/** Readonly selectors for future civilization-coordination dashboards and ecosystem-harmony overlays. */

export function selectCoordinationStabilityObservations(
  organizationId: string
): readonly CoordinationStabilityObservation[] {
  return getCivilizationCoordinationStore(organizationId).getState().observations;
}

export function selectCivilizationCoordinationSnapshots(
  organizationId: string
): readonly CivilizationCoordinationSnapshot[] {
  return getCivilizationCoordinationStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationCoordinationSnapshot(
  organizationId: string
): CivilizationCoordinationSnapshot | null {
  return getCivilizationCoordinationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectInstitutionalHarmonySignals(
  organizationId: string
): readonly InstitutionalHarmonySignal[] {
  return getCivilizationCoordinationStore(organizationId).getState().harmonySignals;
}

export function selectMacroOperationalCoherenceFields(
  organizationId: string
): readonly MacroOperationalCoherenceField[] {
  return getCivilizationCoordinationStore(organizationId).getState().coherenceFields;
}

export function selectEcosystemAlignmentTopologies(
  organizationId: string
): readonly EcosystemAlignmentTopology[] {
  return getCivilizationCoordinationStore(organizationId).getState().alignmentTopologies;
}

export function selectCivilizationCoordinationSignature(organizationId: string): string {
  return getCivilizationCoordinationStore(organizationId).getState().signature;
}
