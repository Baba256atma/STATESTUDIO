/**
 * APP-1:1 — Executive Time Registry.
 * Deterministic metadata registry — no workflow execution.
 */

import {
  EXECUTIVE_TIME_BUILTIN_CONTEXTS,
  EXECUTIVE_TIME_BUILTIN_EVENT_CATEGORIES,
  EXECUTIVE_TIME_BUILTIN_PRIORITIES,
  EXECUTIVE_TIME_BUILTIN_STATES,
  EXECUTIVE_TIME_BUILTIN_TRANSITION_RULES,
  EXECUTIVE_TIME_FOUNDATION_VERSION,
  isExecutiveTimeContextKey,
  isExecutiveTimeEventCategory,
  isExecutiveTimePriorityKey,
  isExecutiveTimeStateKey,
  isValidRegistryKey,
} from "./executiveTimeContract.ts";
import type {
  ExecutiveTimeContextDefinition,
  ExecutiveTimeContextKey,
  ExecutiveTimeEventCategory,
  ExecutiveTimeEventCategoryDefinition,
  ExecutiveTimePriorityDefinition,
  ExecutiveTimePriorityKey,
  ExecutiveTimeRegistryRegistrationResult,
  ExecutiveTimeRegistrySnapshot,
  ExecutiveTimeStateDefinition,
  ExecutiveTimeStateKey,
  ExecutiveTimeTransitionRule,
} from "./executiveTimeTypes.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function cloneDefinitions<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

const contextRegistry = new Map<ExecutiveTimeContextKey, ExecutiveTimeContextDefinition>();
const stateRegistry = new Map<ExecutiveTimeStateKey, ExecutiveTimeStateDefinition>();
const priorityRegistry = new Map<ExecutiveTimePriorityKey, ExecutiveTimePriorityDefinition>();
const eventCategoryRegistry = new Map<ExecutiveTimeEventCategory, ExecutiveTimeEventCategoryDefinition>();
const transitionRuleRegistry = new Map<string, ExecutiveTimeTransitionRule>();

let registrySeeded = false;

function seedBuiltinDefinitions(): void {
  if (registrySeeded) return;
  registrySeeded = true;
  for (const entry of EXECUTIVE_TIME_BUILTIN_CONTEXTS) contextRegistry.set(entry.key, entry);
  for (const entry of EXECUTIVE_TIME_BUILTIN_STATES) stateRegistry.set(entry.key, entry);
  for (const entry of EXECUTIVE_TIME_BUILTIN_PRIORITIES) priorityRegistry.set(entry.key, entry);
  for (const entry of EXECUTIVE_TIME_BUILTIN_EVENT_CATEGORIES) eventCategoryRegistry.set(entry.key, entry);
  for (const entry of EXECUTIVE_TIME_BUILTIN_TRANSITION_RULES) transitionRuleRegistry.set(entry.ruleId, entry);
}

function registrationFailure(reason: string): ExecutiveTimeRegistryRegistrationResult {
  return Object.freeze({ success: false, reason });
}

function registrationSuccess(reason: string): ExecutiveTimeRegistryRegistrationResult {
  return Object.freeze({ success: true, reason });
}

export function resetExecutiveTimeRegistryForTests(): void {
  contextRegistry.clear();
  stateRegistry.clear();
  priorityRegistry.clear();
  eventCategoryRegistry.clear();
  transitionRuleRegistry.clear();
  registrySeeded = false;
  seedBuiltinDefinitions();
}

export function registerExecutiveTimeContext(
  definition: ExecutiveTimeContextDefinition
): ExecutiveTimeRegistryRegistrationResult {
  seedBuiltinDefinitions();
  if (!isValidRegistryKey(definition.key)) {
    return registrationFailure("Invalid context key.");
  }
  if (!isExecutiveTimeContextKey(definition.key)) {
    return registrationFailure("Context key is not a supported executive time context.");
  }
  if (contextRegistry.has(definition.key)) {
    return registrationFailure(`Context "${definition.key}" is already registered.`);
  }
  contextRegistry.set(definition.key, Object.freeze({ ...definition }));
  return registrationSuccess(`Context "${definition.key}" registered.`);
}

export function registerExecutiveTimeState(
  definition: ExecutiveTimeStateDefinition
): ExecutiveTimeRegistryRegistrationResult {
  seedBuiltinDefinitions();
  if (!isValidRegistryKey(definition.key)) {
    return registrationFailure("Invalid state key.");
  }
  if (!isExecutiveTimeStateKey(definition.key)) {
    return registrationFailure("State key is not a supported executive time state.");
  }
  if (stateRegistry.has(definition.key)) {
    return registrationFailure(`State "${definition.key}" is already registered.`);
  }
  stateRegistry.set(definition.key, Object.freeze({ ...definition }));
  return registrationSuccess(`State "${definition.key}" registered.`);
}

export function registerExecutiveTimePriority(
  definition: ExecutiveTimePriorityDefinition
): ExecutiveTimeRegistryRegistrationResult {
  seedBuiltinDefinitions();
  if (!isValidRegistryKey(definition.key)) {
    return registrationFailure("Invalid priority key.");
  }
  if (!isExecutiveTimePriorityKey(definition.key)) {
    return registrationFailure("Priority key is not a supported executive time priority.");
  }
  if (priorityRegistry.has(definition.key)) {
    return registrationFailure(`Priority "${definition.key}" is already registered.`);
  }
  priorityRegistry.set(definition.key, Object.freeze({ ...definition }));
  return registrationSuccess(`Priority "${definition.key}" registered.`);
}

export function registerExecutiveTimeEventCategory(
  definition: ExecutiveTimeEventCategoryDefinition
): ExecutiveTimeRegistryRegistrationResult {
  seedBuiltinDefinitions();
  if (!isValidRegistryKey(definition.key)) {
    return registrationFailure("Invalid event category key.");
  }
  if (!isExecutiveTimeEventCategory(definition.key)) {
    return registrationFailure("Event category key is not supported.");
  }
  if (eventCategoryRegistry.has(definition.key)) {
    return registrationFailure(`Event category "${definition.key}" is already registered.`);
  }
  eventCategoryRegistry.set(definition.key, Object.freeze({ ...definition }));
  return registrationSuccess(`Event category "${definition.key}" registered.`);
}

export function registerExecutiveTimeTransitionRule(
  rule: ExecutiveTimeTransitionRule
): ExecutiveTimeRegistryRegistrationResult {
  seedBuiltinDefinitions();
  if (!isValidRegistryKey(rule.ruleId)) {
    return registrationFailure("Invalid transition rule id.");
  }
  if (!isExecutiveTimeStateKey(rule.fromState) || !isExecutiveTimeStateKey(rule.toState)) {
    return registrationFailure("Transition rule states must be known executive time states.");
  }
  if (transitionRuleRegistry.has(rule.ruleId)) {
    return registrationFailure(`Transition rule "${rule.ruleId}" is already registered.`);
  }
  transitionRuleRegistry.set(rule.ruleId, Object.freeze({ ...rule, metadata: Object.freeze({ ...rule.metadata }) }));
  return registrationSuccess(`Transition rule "${rule.ruleId}" registered.`);
}

export function hasExecutiveTimeContext(key: string): boolean {
  seedBuiltinDefinitions();
  return isExecutiveTimeContextKey(key) && contextRegistry.has(key);
}

export function hasExecutiveTimeState(key: string): boolean {
  seedBuiltinDefinitions();
  return isExecutiveTimeStateKey(key) && stateRegistry.has(key);
}

export function hasExecutiveTimePriority(key: string): boolean {
  seedBuiltinDefinitions();
  return isExecutiveTimePriorityKey(key) && priorityRegistry.has(key);
}

export function hasExecutiveTimeEventCategory(key: string): boolean {
  seedBuiltinDefinitions();
  return isExecutiveTimeEventCategory(key) && eventCategoryRegistry.has(key);
}

export function getExecutiveTimeRegistrySnapshot(): ExecutiveTimeRegistrySnapshot {
  seedBuiltinDefinitions();
  const contexts = cloneDefinitions(
    [...contextRegistry.values()].sort((a, b) => a.key.localeCompare(b.key))
  );
  const states = cloneDefinitions([...stateRegistry.values()].sort((a, b) => a.key.localeCompare(b.key)));
  const priorities = cloneDefinitions(
    [...priorityRegistry.values()].sort((a, b) => a.rank - b.rank || a.key.localeCompare(b.key))
  );
  const eventCategories = cloneDefinitions(
    [...eventCategoryRegistry.values()].sort((a, b) => a.key.localeCompare(b.key))
  );
  const transitionRules = cloneDefinitions(
    [...transitionRuleRegistry.values()].sort((a, b) => a.ruleId.localeCompare(b.ruleId))
  );
  return Object.freeze({
    contractVersion: EXECUTIVE_TIME_FOUNDATION_VERSION,
    contexts,
    states,
    priorities,
    eventCategories,
    transitionRules,
    generatedAt: nowIso(),
  });
}

seedBuiltinDefinitions();
