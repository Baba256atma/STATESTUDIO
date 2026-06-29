/**
 * APP-5:7 — Scenario Timeline Assistant registry.
 */

import {
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_LIMITS,
} from "./scenarioTimelineAssistantConstants.ts";
import type {
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantRegistrySnapshot,
} from "./scenarioTimelineAssistantTypes.ts";

const registeredContexts = new Map<string, ScenarioTimelineAssistantContext>();

function contextKey(scenarioId: string, workspaceId: string): string {
  return `${workspaceId}::${scenarioId}`;
}

export function registerScenarioTimelineAssistantContext(context: ScenarioTimelineAssistantContext): void {
  const key = contextKey(context.scenarioId, context.workspaceId);
  if (registeredContexts.size >= SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_LIMITS.maxRegisteredContexts) {
    const oldest = registeredContexts.keys().next().value;
    if (oldest) {
      registeredContexts.delete(oldest);
    }
  }
  registeredContexts.set(key, context);
}

export function getScenarioTimelineAssistantContext(
  scenarioId: string,
  workspaceId: string
): ScenarioTimelineAssistantContext | null {
  return registeredContexts.get(contextKey(scenarioId, workspaceId)) ?? null;
}

export function getScenarioTimelineAssistantRegistrySnapshot(): ScenarioTimelineAssistantRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    registeredContextCount: registeredContexts.size,
    contextIds: Object.freeze([...registeredContexts.keys()]),
    readOnly: true as const,
  });
}

export function resetScenarioTimelineAssistantRegistryForTests(): void {
  registeredContexts.clear();
}

export const ScenarioTimelineAssistantRegistry = Object.freeze({
  registerScenarioTimelineAssistantContext,
  getScenarioTimelineAssistantContext,
  getScenarioTimelineAssistantRegistrySnapshot,
  resetScenarioTimelineAssistantRegistryForTests,
});
