import { getCivilizationWisdomStore } from "./civilizationWisdomStore";
import type {
  CivilizationWisdomSnapshot,
  InstitutionalLearningConvergenceSignal,
  LongHorizonWisdomObservation,
  MacroWisdomField,
  StrategicExperienceTopology,
} from "./civilizationWisdomTypes";

/** Readonly selectors for future civilization-wisdom dashboards and learning-convergence overlays. */

export function selectLongHorizonWisdomObservations(
  organizationId: string
): readonly LongHorizonWisdomObservation[] {
  return getCivilizationWisdomStore(organizationId).getState().observations;
}

export function selectCivilizationWisdomSnapshots(
  organizationId: string
): readonly CivilizationWisdomSnapshot[] {
  return getCivilizationWisdomStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationWisdomSnapshot(
  organizationId: string
): CivilizationWisdomSnapshot | null {
  return getCivilizationWisdomStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectInstitutionalLearningConvergenceSignals(
  organizationId: string
): readonly InstitutionalLearningConvergenceSignal[] {
  return getCivilizationWisdomStore(organizationId).getState().convergenceSignals;
}

export function selectMacroWisdomFields(organizationId: string): readonly MacroWisdomField[] {
  return getCivilizationWisdomStore(organizationId).getState().wisdomFields;
}

export function selectStrategicExperienceTopologies(
  organizationId: string
): readonly StrategicExperienceTopology[] {
  return getCivilizationWisdomStore(organizationId).getState().experienceTopologies;
}

export function selectCivilizationWisdomSignature(organizationId: string): string {
  return getCivilizationWisdomStore(organizationId).getState().signature;
}
