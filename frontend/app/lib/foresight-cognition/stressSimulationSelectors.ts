import { getStressSimulationStore } from "./stressSimulationStore";
import type {
  AnticipatoryStrainSignal,
  EnterpriseStressPropagation,
  OperationalStressScenario,
  OrganizationalPressureField,
  StrategicPressureSimulation,
  StressSimulationSnapshot,
} from "./stressSimulationTypes";

/** Readonly selectors for future operational stress overlays and executive strain dashboards. */

export function selectOperationalStressScenarios(
  organizationId: string
): readonly OperationalStressScenario[] {
  return getStressSimulationStore(organizationId).getState().operationalStressScenarios;
}

export function selectStressSimulationSnapshots(
  organizationId: string
): readonly StressSimulationSnapshot[] {
  return getStressSimulationStore(organizationId).getState().snapshots;
}

export function selectLatestStressSimulationSnapshot(
  organizationId: string
): StressSimulationSnapshot | null {
  return getStressSimulationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicPressureSimulations(
  organizationId: string
): readonly StrategicPressureSimulation[] {
  return getStressSimulationStore(organizationId).getState().pressureSimulations;
}

export function selectEnterpriseStressPropagations(
  organizationId: string
): readonly EnterpriseStressPropagation[] {
  return getStressSimulationStore(organizationId).getState().stressPropagations;
}

export function selectAnticipatoryStrainSignals(
  organizationId: string
): readonly AnticipatoryStrainSignal[] {
  return getStressSimulationStore(organizationId).getState().strainSignals;
}

export function selectOrganizationalPressureFields(
  organizationId: string
): readonly OrganizationalPressureField[] {
  return getStressSimulationStore(organizationId).getState().pressureFields;
}

export function selectStressSimulationSignature(organizationId: string): string {
  return getStressSimulationStore(organizationId).getState().signature;
}
