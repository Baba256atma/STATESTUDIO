import { getCivilizationContinuityStore } from "./civilizationContinuityStore";
import type {
  CivilizationContinuitySnapshot,
  EcosystemSurvivabilityObservation,
  LongHorizonResilienceField,
  MacroSustainabilitySignal,
  OperationalContinuityTopology,
} from "./civilizationContinuityTypes";

/** Readonly selectors for future civilization-continuity dashboards and sustainability overlays. */

export function selectEcosystemSurvivabilityObservations(
  organizationId: string
): readonly EcosystemSurvivabilityObservation[] {
  return getCivilizationContinuityStore(organizationId).getState().observations;
}

export function selectCivilizationContinuitySnapshots(
  organizationId: string
): readonly CivilizationContinuitySnapshot[] {
  return getCivilizationContinuityStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationContinuitySnapshot(
  organizationId: string
): CivilizationContinuitySnapshot | null {
  return getCivilizationContinuityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectMacroSustainabilitySignals(
  organizationId: string
): readonly MacroSustainabilitySignal[] {
  return getCivilizationContinuityStore(organizationId).getState().sustainabilitySignals;
}

export function selectLongHorizonResilienceFields(
  organizationId: string
): readonly LongHorizonResilienceField[] {
  return getCivilizationContinuityStore(organizationId).getState().resilienceFields;
}

export function selectOperationalContinuityTopologies(
  organizationId: string
): readonly OperationalContinuityTopology[] {
  return getCivilizationContinuityStore(organizationId).getState().continuityTopologies;
}

export function selectCivilizationContinuitySignature(organizationId: string): string {
  return getCivilizationContinuityStore(organizationId).getState().signature;
}
