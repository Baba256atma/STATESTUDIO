import { getInterventionProjectionStore } from "./interventionProjectionStore";
import type {
  EnterpriseOutcomeSimulation,
  InterventionEffectTopology,
  OperationalConsequenceSignal,
  OutcomeProjectionSnapshot,
  ResponseEvolutionProjection,
  StrategicInterventionProjection,
} from "./interventionProjectionTypes";

/** Readonly selectors for future intervention projection dashboards and consequence panels. */

export function selectStrategicInterventionProjections(
  organizationId: string
): readonly StrategicInterventionProjection[] {
  return getInterventionProjectionStore(organizationId).getState().interventionProjections;
}

export function selectOutcomeProjectionSnapshots(
  organizationId: string
): readonly OutcomeProjectionSnapshot[] {
  return getInterventionProjectionStore(organizationId).getState().snapshots;
}

export function selectLatestOutcomeProjectionSnapshot(
  organizationId: string
): OutcomeProjectionSnapshot | null {
  return getInterventionProjectionStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectEnterpriseOutcomeSimulations(
  organizationId: string
): readonly EnterpriseOutcomeSimulation[] {
  return getInterventionProjectionStore(organizationId).getState().outcomeSimulations;
}

export function selectOperationalConsequenceSignals(
  organizationId: string
): readonly OperationalConsequenceSignal[] {
  return getInterventionProjectionStore(organizationId).getState().consequenceSignals;
}

export function selectResponseEvolutionProjections(
  organizationId: string
): readonly ResponseEvolutionProjection[] {
  return getInterventionProjectionStore(organizationId).getState().evolutionProjections;
}

export function selectInterventionEffectTopologies(
  organizationId: string
): readonly InterventionEffectTopology[] {
  return getInterventionProjectionStore(organizationId).getState().effectTopologies;
}

export function selectInterventionProjectionSignature(organizationId: string): string {
  return getInterventionProjectionStore(organizationId).getState().signature;
}
