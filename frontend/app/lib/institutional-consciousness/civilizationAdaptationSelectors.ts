import { getCivilizationAdaptationStore } from "./civilizationAdaptationStore";
import type {
  CivilizationAdaptationSnapshot,
  EcosystemTransformationField,
  LongHorizonEvolutionObservation,
  MacroEvolutionSignal,
  SystemicAdaptationTopology,
} from "./civilizationAdaptationTypes";

/** Readonly selectors for future civilization-evolution dashboards and transformation overlays. */

export function selectLongHorizonEvolutionObservations(
  organizationId: string
): readonly LongHorizonEvolutionObservation[] {
  return getCivilizationAdaptationStore(organizationId).getState().observations;
}

export function selectCivilizationAdaptationSnapshots(
  organizationId: string
): readonly CivilizationAdaptationSnapshot[] {
  return getCivilizationAdaptationStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationAdaptationSnapshot(
  organizationId: string
): CivilizationAdaptationSnapshot | null {
  return getCivilizationAdaptationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectMacroEvolutionSignals(
  organizationId: string
): readonly MacroEvolutionSignal[] {
  return getCivilizationAdaptationStore(organizationId).getState().evolutionSignals;
}

export function selectEcosystemTransformationFields(
  organizationId: string
): readonly EcosystemTransformationField[] {
  return getCivilizationAdaptationStore(organizationId).getState().transformationFields;
}

export function selectSystemicAdaptationTopologies(
  organizationId: string
): readonly SystemicAdaptationTopology[] {
  return getCivilizationAdaptationStore(organizationId).getState().adaptationTopologies;
}

export function selectCivilizationAdaptationSignature(organizationId: string): string {
  return getCivilizationAdaptationStore(organizationId).getState().signature;
}
