/**
 * APP-6:10 — Decision Assistant registry.
 */

import {
  DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  DECISION_ASSISTANT_INTEGRATION_LIMITS,
  type DecisionAssistantIntegrationResponse,
  type DecisionAssistantModel,
  type DecisionAssistantRegistrySnapshot,
  assistantFailure,
  assistantSuccess,
} from "./decisionAssistantTypes.ts";

const modelRegistry = new Map<string, DecisionAssistantModel>();

export function resetDecisionAssistantRegistryForTests(): void {
  modelRegistry.clear();
}

export function registerDecisionAssistantModel(model: DecisionAssistantModel): DecisionAssistantIntegrationResponse {
  if (modelRegistry.has(model.modelId)) {
    return assistantFailure(`Assistant model already registered: ${model.modelId}.`);
  }
  if (modelRegistry.size >= DECISION_ASSISTANT_INTEGRATION_LIMITS.maxRegisteredModels) {
    return assistantFailure("Decision assistant registry is full.");
  }
  modelRegistry.set(model.modelId, model);
  return assistantSuccess("Decision assistant model registered.", model);
}

export function getRegisteredDecisionAssistantModel(modelId: string): DecisionAssistantModel | null {
  return modelRegistry.get(modelId) ?? null;
}

export function getDecisionAssistantRegistry(): DecisionAssistantRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    registeredModelCount: modelRegistry.size,
    modelIds: Object.freeze([...modelRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionAssistantRegistry = Object.freeze({
  resetDecisionAssistantRegistryForTests,
  registerDecisionAssistantModel,
  getRegisteredDecisionAssistantModel,
  getDecisionAssistantRegistry,
});
