import { getCivilizationFragilityStore } from "./civilizationFragilityStore";
import type {
  CascadingInstabilityObservation,
  CivilizationFragilitySnapshot,
  FragilityPropagationField,
  MacroResilienceSignal,
  SystemicResilienceTopology,
} from "./civilizationFragilityTypes";

/** Readonly selectors for future civilization-fragility dashboards and macro-resilience overlays. */

export function selectCascadingInstabilityObservations(
  organizationId: string
): readonly CascadingInstabilityObservation[] {
  return getCivilizationFragilityStore(organizationId).getState().observations;
}

export function selectCivilizationFragilitySnapshots(
  organizationId: string
): readonly CivilizationFragilitySnapshot[] {
  return getCivilizationFragilityStore(organizationId).getState().snapshots;
}

export function selectLatestCivilizationFragilitySnapshot(
  organizationId: string
): CivilizationFragilitySnapshot | null {
  return getCivilizationFragilityStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectMacroResilienceSignals(
  organizationId: string
): readonly MacroResilienceSignal[] {
  return getCivilizationFragilityStore(organizationId).getState().resilienceSignals;
}

export function selectFragilityPropagationFields(
  organizationId: string
): readonly FragilityPropagationField[] {
  return getCivilizationFragilityStore(organizationId).getState().propagationFields;
}

export function selectSystemicResilienceTopologies(
  organizationId: string
): readonly SystemicResilienceTopology[] {
  return getCivilizationFragilityStore(organizationId).getState().resilienceTopologies;
}

export function selectCivilizationFragilitySignature(organizationId: string): string {
  return getCivilizationFragilityStore(organizationId).getState().signature;
}
