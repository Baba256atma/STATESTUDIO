/**
 * APP-5:8 — Scenario Timeline Dashboard registry.
 */

import {
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS,
} from "./scenarioTimelineDashboardConstants.ts";
import type {
  ScenarioTimelineDashboardContext,
  ScenarioTimelineDashboardRegistrySnapshot,
  ScenarioTimelineDashboardViewModel,
} from "./scenarioTimelineDashboardTypes.ts";

const registeredContexts = new Map<string, ScenarioTimelineDashboardContext>();
const registeredViewModels = new Map<string, ScenarioTimelineDashboardViewModel>();

function registryKey(scenarioId: string, workspaceId: string): string {
  return `${workspaceId}::${scenarioId}`;
}

export function registerScenarioTimelineDashboardContext(context: ScenarioTimelineDashboardContext): void {
  registeredContexts.set(registryKey(context.scenarioId, context.workspaceId), context);
}

export function registerScenarioTimelineDashboardViewModel(viewModel: ScenarioTimelineDashboardViewModel): void {
  const key = registryKey(viewModel.scenarioId, viewModel.workspaceId);
  if (registeredViewModels.size >= SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_LIMITS.maxRegisteredViewModels) {
    const oldest = registeredViewModels.keys().next().value;
    if (oldest) {
      registeredViewModels.delete(oldest);
    }
  }
  registeredViewModels.set(key, viewModel);
}

export function getScenarioTimelineDashboardContext(
  scenarioId: string,
  workspaceId: string
): ScenarioTimelineDashboardContext | null {
  return registeredContexts.get(registryKey(scenarioId, workspaceId)) ?? null;
}

export function getScenarioTimelineDashboardViewModel(
  scenarioId: string,
  workspaceId: string
): ScenarioTimelineDashboardViewModel | null {
  return registeredViewModels.get(registryKey(scenarioId, workspaceId)) ?? null;
}

export function getScenarioTimelineDashboardRegistrySnapshot(): ScenarioTimelineDashboardRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    registeredViewModelCount: registeredViewModels.size,
    viewModelIds: Object.freeze([...registeredViewModels.keys()]),
    readOnly: true as const,
  });
}

export function resetScenarioTimelineDashboardRegistryForTests(): void {
  registeredContexts.clear();
  registeredViewModels.clear();
}

export const ScenarioTimelineDashboardRegistry = Object.freeze({
  registerScenarioTimelineDashboardContext,
  registerScenarioTimelineDashboardViewModel,
  getScenarioTimelineDashboardContext,
  getScenarioTimelineDashboardViewModel,
  getScenarioTimelineDashboardRegistrySnapshot,
  resetScenarioTimelineDashboardRegistryForTests,
});
