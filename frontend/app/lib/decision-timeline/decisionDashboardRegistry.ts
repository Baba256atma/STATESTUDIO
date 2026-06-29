/**
 * APP-6:9 — Decision Dashboard registry.
 * Ephemeral dashboard model cache — no persistence.
 */

import {
  DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  DECISION_DASHBOARD_INTEGRATION_LIMITS,
  type DecisionDashboardIntegrationResponse,
  type DecisionDashboardModel,
  type DecisionDashboardRegistrySnapshot,
  dashboardFailure,
  dashboardSuccess,
} from "./decisionDashboardTypes.ts";

const modelRegistry = new Map<string, DecisionDashboardModel>();

export function resetDecisionDashboardRegistryForTests(): void {
  modelRegistry.clear();
}

export function registerDecisionDashboardModel(model: DecisionDashboardModel): DecisionDashboardIntegrationResponse {
  if (modelRegistry.has(model.modelId)) {
    return dashboardFailure(`Dashboard model already registered: ${model.modelId}.`);
  }
  if (modelRegistry.size >= DECISION_DASHBOARD_INTEGRATION_LIMITS.maxRegisteredModels) {
    return dashboardFailure("Decision dashboard registry is full.");
  }
  modelRegistry.set(model.modelId, model);
  return dashboardSuccess("Decision dashboard model registered.", model);
}

export function getRegisteredDecisionDashboardModel(modelId: string): DecisionDashboardModel | null {
  return modelRegistry.get(modelId) ?? null;
}

export function getDecisionDashboardRegistry(): DecisionDashboardRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    registeredModelCount: modelRegistry.size,
    modelIds: Object.freeze([...modelRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionDashboardRegistry = Object.freeze({
  resetDecisionDashboardRegistryForTests,
  registerDecisionDashboardModel,
  getRegisteredDecisionDashboardModel,
  getDecisionDashboardRegistry,
});
