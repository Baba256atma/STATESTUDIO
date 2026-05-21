import { getScenarioCoordinationStore } from "./scenarioCoordinationStore";
import type {
  EnterpriseResponseTopology,
  OperationalInteractionField,
  ResponseReinforcementSignal,
  ScenarioCoordinationSnapshot,
  StrategicResponseScenario,
} from "./scenarioCoordinationTypes";

/** Readonly selectors for future strategic response topology overlays and coordination panels. */

export function selectEnterpriseResponseTopologies(
  organizationId: string
): readonly EnterpriseResponseTopology[] {
  return getScenarioCoordinationStore(organizationId).getState().responseTopologies;
}

export function selectScenarioCoordinationSnapshots(
  organizationId: string
): readonly ScenarioCoordinationSnapshot[] {
  return getScenarioCoordinationStore(organizationId).getState().snapshots;
}

export function selectLatestScenarioCoordinationSnapshot(
  organizationId: string
): ScenarioCoordinationSnapshot | null {
  return getScenarioCoordinationStore(organizationId).getState().snapshots[0] ?? null;
}

export function selectStrategicResponseScenarios(
  organizationId: string
): readonly StrategicResponseScenario[] {
  return getScenarioCoordinationStore(organizationId).getState().strategicScenarios;
}

export function selectOperationalInteractionFields(
  organizationId: string
): readonly OperationalInteractionField[] {
  return getScenarioCoordinationStore(organizationId).getState().interactionFields;
}

export function selectResponseReinforcementSignals(
  organizationId: string
): readonly ResponseReinforcementSignal[] {
  return getScenarioCoordinationStore(organizationId).getState().reinforcementSignals;
}

export function selectScenarioCoordinationSignature(organizationId: string): string {
  return getScenarioCoordinationStore(organizationId).getState().signature;
}
