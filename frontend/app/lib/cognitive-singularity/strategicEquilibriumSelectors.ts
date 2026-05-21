import { getStrategicEquilibriumStore } from "./strategicEquilibriumStore";
import type {
  CognitiveBalanceSignal,
  EnterpriseStrategicEquilibriumSnapshot,
  EquilibriumStabilityField,
  StrategicImbalanceIndicator,
  TotalSystemBalanceObservation,
} from "./strategicEquilibriumTypes";

/** Readonly selectors for future strategic equilibrium dashboards and cognitive balance overlays. */

export function selectStrategicEquilibriumObservations(
  organizationId: string
): readonly TotalSystemBalanceObservation[] {
  return getStrategicEquilibriumStore(organizationId).getState().observations;
}

export function selectEnterpriseStrategicEquilibriumSnapshots(
  organizationId: string
): readonly EnterpriseStrategicEquilibriumSnapshot[] {
  return getStrategicEquilibriumStore(organizationId).getState().snapshots;
}

export function selectLatestEnterpriseStrategicEquilibriumSnapshot(
  organizationId: string
): EnterpriseStrategicEquilibriumSnapshot | null {
  return getStrategicEquilibriumStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectCognitiveBalanceSignals(
  organizationId: string
): readonly CognitiveBalanceSignal[] {
  return getStrategicEquilibriumStore(organizationId).getState().cognitiveBalanceSignals;
}

export function selectEquilibriumStabilityFields(
  organizationId: string
): readonly EquilibriumStabilityField[] {
  return getStrategicEquilibriumStore(organizationId).getState().equilibriumStabilityFields;
}

export function selectStrategicImbalanceIndicators(
  organizationId: string
): readonly StrategicImbalanceIndicator[] {
  return getStrategicEquilibriumStore(organizationId).getState().imbalanceIndicators;
}

export function selectStrategicEquilibriumSignature(organizationId: string): string {
  return getStrategicEquilibriumStore(organizationId).getState().signature;
}
