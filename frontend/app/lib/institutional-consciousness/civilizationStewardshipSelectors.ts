import { getCivilizationStewardshipStore } from "./civilizationStewardshipStore";
import type {
  CivilizationStewardshipSnapshot,
  EcosystemSurvivabilityField,
  InstitutionalPreservationTopology,
  LongHorizonStewardshipObservation,
  MacroPreservationSignal,
} from "./civilizationStewardshipTypes";

/** Readonly selectors for future civilization-stewardship dashboards and preservation overlays. */

export function selectLongHorizonStewardshipObservations(
  organizationId: string
): readonly LongHorizonStewardshipObservation[] {
  return getCivilizationStewardshipStore(organizationId).getState().observations;
}

export function selectCivilizationStewardshipSnapshots(
  organizationId: string
): readonly CivilizationStewardshipSnapshot[] {
  return getCivilizationStewardshipStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationStewardshipSnapshot(
  organizationId: string
): CivilizationStewardshipSnapshot | null {
  return getCivilizationStewardshipStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectMacroPreservationSignals(
  organizationId: string
): readonly MacroPreservationSignal[] {
  return getCivilizationStewardshipStore(organizationId).getState().preservationSignals;
}

export function selectEcosystemSurvivabilityFields(
  organizationId: string
): readonly EcosystemSurvivabilityField[] {
  return getCivilizationStewardshipStore(organizationId).getState().survivabilityFields;
}

export function selectInstitutionalPreservationTopologies(
  organizationId: string
): readonly InstitutionalPreservationTopology[] {
  return getCivilizationStewardshipStore(organizationId).getState().preservationTopologies;
}

export function selectCivilizationStewardshipSignature(organizationId: string): string {
  return getCivilizationStewardshipStore(organizationId).getState().signature;
}
