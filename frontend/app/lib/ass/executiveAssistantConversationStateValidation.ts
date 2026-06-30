/**
 * ASS-3 — Executive Conversation State Architecture validation.
 */

import {
  ASS_COMPLETION_STATE_KEYS,
  ASS_CONVERSATION_STATE_COMPATIBLE_VERSIONS,
  ASS_CONVERSATION_STATE_MUST_NOT_OWN,
  ASS_CONVERSATION_STATE_PRINCIPLES,
  ASS_CONVERSATION_STATE_REGISTRY_KEYS,
  ASS_CONVERSATION_STATE_VERSION,
  ASS_DECLARATIVE_TRANSITIONS,
  ASS_FAILURE_METADATA_CODES,
  ASS_FAILURE_METADATA_MANDATORY_FIELDS,
  ASS_INTERACTION_STATE_KEYS,
  ASS_LIFECYCLE_REQUIRED_PATH,
  ASS_LIFECYCLE_STATE_KEYS,
  ASS_LIFECYCLE_TERMINAL_STATE_KEYS,
  ASS_PAUSE_RESUME_STATE_KEYS,
  ASS_SESSION_STATE_KEYS,
  ASS_SESSION_TERMINAL_STATE_KEYS,
  ASS_STATE_CATEGORY_KEYS,
  ASS_STATE_DEFINITION_MANDATORY_FIELDS,
  ASS_STATE_SNAPSHOT_MANDATORY_FIELDS,
  ASS_TRANSITION_CONTRACT_MANDATORY_FIELDS,
  ASS_TURN_STATE_KEYS,
  ASS_TURN_TERMINAL_STATE_KEYS,
  ASS_WAITING_STATE_KEYS,
} from "./executiveAssistantConversationStateContracts.ts";
import type {
  ExecutiveAssistantConversationStateManifest,
  ExecutiveAssistantConversationStateRegistryBundle,
  ExecutiveAssistantConversationStateValidationIssue,
  ExecutiveAssistantConversationStateValidationReport,
  ExecutiveAssistantStateCategoryKey,
} from "./executiveAssistantConversationStateTypes.ts";
import { getExecutiveAssistantTransitionMatrix } from "./executiveAssistantConversationStateRegistry.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantConversationStateValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantConversationStateValidationIssue[]): ExecutiveAssistantConversationStateValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

function resolveExpectedStateKeys(category: ExecutiveAssistantStateCategoryKey): readonly string[] {
  switch (category) {
    case "lifecycle":
      return ASS_LIFECYCLE_STATE_KEYS;
    case "session":
      return ASS_SESSION_STATE_KEYS;
    case "turn":
      return ASS_TURN_STATE_KEYS;
    case "interaction":
      return ASS_INTERACTION_STATE_KEYS;
    case "waiting":
      return ASS_WAITING_STATE_KEYS;
    case "completion":
      return ASS_COMPLETION_STATE_KEYS;
    case "pause_resume":
      return ASS_PAUSE_RESUME_STATE_KEYS;
  }
}

function resolveRegistryStates(
  registry: ExecutiveAssistantConversationStateRegistryBundle,
  category: ExecutiveAssistantStateCategoryKey
) {
  switch (category) {
    case "lifecycle":
      return registry.lifecycleStateRegistry;
    case "session":
      return registry.sessionStateRegistry;
    case "turn":
      return registry.turnStateRegistry;
    case "interaction":
      return registry.interactionStateRegistry;
    case "waiting":
      return registry.waitingStateRegistry;
    case "completion":
      return registry.completionStateRegistry;
    case "pause_resume":
      return registry.pauseResumeStateRegistry;
  }
}

function resolveTerminalKeys(category: ExecutiveAssistantStateCategoryKey): readonly string[] {
  switch (category) {
    case "lifecycle":
      return ASS_LIFECYCLE_TERMINAL_STATE_KEYS;
    case "session":
      return ASS_SESSION_TERMINAL_STATE_KEYS;
    case "turn":
      return ASS_TURN_TERMINAL_STATE_KEYS;
    default:
      return Object.freeze([]);
  }
}

export function validateAllConversationStatesRegistered(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  for (const category of ASS_STATE_CATEGORY_KEYS) {
    const expected = resolveExpectedStateKeys(category);
    const registered = new Set(resolveRegistryStates(registry, category).map((entry) => entry.stateKey));
    for (const stateKey of expected) {
      if (!registered.has(stateKey)) {
        issues.push(issue("missing_state", `Missing ${category} state: ${stateKey}.`));
      }
    }
    if (registered.size !== expected.length) {
      issues.push(issue("state_count_mismatch", `${category} state registry count mismatch.`));
    }
  }
  if (registry.failureMetadataCount !== ASS_FAILURE_METADATA_CODES.length) {
    issues.push(issue("failure_metadata_incomplete", "Failure metadata registry is incomplete."));
  }
  if (registry.transitionCount !== ASS_DECLARATIVE_TRANSITIONS.length) {
    issues.push(issue("transition_count_mismatch", "Transition contract registry count mismatch."));
  }
  return report(issues);
}

export function validateTransitionGraphValidity(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  const transitionKeys = new Set<string>();
  for (const transition of registry.transitionContractRegistry) {
    if (transitionKeys.has(transition.transitionKey)) {
      issues.push(issue("duplicate_transition", `Duplicate transition key: ${transition.transitionKey}.`));
    }
    transitionKeys.add(transition.transitionKey);
    const states = new Set(resolveRegistryStates(registry, transition.stateCategory).map((entry) => entry.stateKey));
    if (!states.has(transition.fromStateKey)) {
      issues.push(
        issue("invalid_from_state", `Transition ${transition.transitionKey} references unknown from state.`)
      );
    }
    if (!states.has(transition.toStateKey)) {
      issues.push(issue("invalid_to_state", `Transition ${transition.transitionKey} references unknown to state.`));
    }
    if (transition.declarativeOnly !== true) {
      issues.push(issue("non_declarative_transition", `Transition ${transition.transitionKey} is not declarative.`));
    }
  }
  return report(issues);
}

export function validateNoIllegalTransitions(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  const allowed = new Set(
    registry.transitionContractRegistry.map(
      (entry) => `${entry.stateCategory}:${entry.fromStateKey}->${entry.toStateKey}`
    )
  );
  for (const category of ["lifecycle", "session", "turn"] as const) {
    const terminalKeys = resolveTerminalKeys(category);
    for (const transition of registry.transitionContractRegistry.filter((entry) => entry.stateCategory === category)) {
      if (terminalKeys.includes(transition.fromStateKey as never)) {
        issues.push(
          issue("illegal_transition_from_terminal", `Illegal transition from terminal state ${transition.fromStateKey}.`)
        );
      }
      const key = `${transition.stateCategory}:${transition.fromStateKey}->${transition.toStateKey}`;
      if (!allowed.has(key)) {
        issues.push(issue("illegal_transition", `Transition not in allowed graph: ${key}.`));
      }
    }
  }
  return report(issues);
}

export function validateLifecycleCompleteness(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  const lifecycleStates = new Set(registry.lifecycleStateRegistry.map((entry) => entry.stateKey));
  for (const required of ["draft", "active", "completed"] as const) {
    if (!lifecycleStates.has(required)) {
      issues.push(issue("lifecycle_incomplete", `Missing required lifecycle state: ${required}.`));
    }
  }
  const adjacency = new Map<string, Set<string>>();
  for (const transition of registry.transitionContractRegistry.filter((entry) => entry.stateCategory === "lifecycle")) {
    const next = adjacency.get(transition.fromStateKey) ?? new Set<string>();
    next.add(transition.toStateKey);
    adjacency.set(transition.fromStateKey, next);
  }
  let reachable = false;
  const visited = new Set<string>();
  const queue = ["draft"];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    if (current === "completed") {
      reachable = true;
      break;
    }
    for (const next of adjacency.get(current) ?? []) {
      queue.push(next);
    }
  }
  if (!reachable) {
    issues.push(issue("lifecycle_path_missing", "No declarative path from draft to completed."));
  }
  for (const step of ASS_LIFECYCLE_REQUIRED_PATH) {
    if (!lifecycleStates.has(step)) {
      issues.push(issue("lifecycle_path_step_missing", `Required lifecycle path step missing: ${step}.`));
    }
  }
  return report(issues);
}

export function validateFrozenImmutableRecords(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  for (const category of ASS_STATE_CATEGORY_KEYS) {
    for (const state of resolveRegistryStates(registry, category)) {
      if (!Object.isFrozen(state)) {
        issues.push(issue("mutable_state", `State ${state.stateId} is not frozen.`));
      }
      for (const field of ASS_STATE_DEFINITION_MANDATORY_FIELDS) {
        if (!(field in state)) {
          issues.push(issue("missing_field", `State ${state.stateId} missing field ${field}.`, field));
        }
      }
    }
  }
  for (const transition of registry.transitionContractRegistry) {
    if (!Object.isFrozen(transition)) {
      issues.push(issue("mutable_transition", `Transition ${transition.transitionId} is not frozen.`));
    }
    for (const field of ASS_TRANSITION_CONTRACT_MANDATORY_FIELDS) {
      if (!(field in transition)) {
        issues.push(issue("missing_field", `Transition ${transition.transitionId} missing field ${field}.`, field));
      }
    }
  }
  for (const failure of registry.failureMetadataRegistry) {
    if (!Object.isFrozen(failure)) {
      issues.push(issue("mutable_failure_metadata", `Failure metadata ${failure.failureMetadataId} is not frozen.`));
    }
    for (const field of ASS_FAILURE_METADATA_MANDATORY_FIELDS) {
      if (!(field in failure)) {
        issues.push(issue("missing_field", `Failure metadata ${failure.failureMetadataId} missing field ${field}.`, field));
      }
    }
  }
  for (const snapshot of registry.stateSnapshotRegistry) {
    if (!Object.isFrozen(snapshot)) {
      issues.push(issue("mutable_snapshot", `Snapshot ${snapshot.snapshotId} is not frozen.`));
    }
    for (const field of ASS_STATE_SNAPSHOT_MANDATORY_FIELDS) {
      if (!(field in snapshot)) {
        issues.push(issue("missing_field", `Snapshot ${snapshot.snapshotId} missing field ${field}.`, field));
      }
    }
  }
  return report(issues);
}

export function validateNoStateRuntimeOwnership(): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  for (const principle of [
    "declarative_transitions_no_execution",
    "no_timers_no_async_no_websockets",
  ] as const) {
    if (!(ASS_CONVERSATION_STATE_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  for (const forbidden of ["state_machine_execution", "async_processing", "timers", "websocket_transport"] as const) {
    if (!ASS_CONVERSATION_STATE_MUST_NOT_OWN.includes(forbidden)) {
      issues.push(issue("runtime_boundary_missing", `Must not own ${forbidden}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantConversationStateManifestRecord(
  manifest: ExecutiveAssistantConversationStateManifest
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  if (manifest.version !== ASS_CONVERSATION_STATE_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/3."));
  }
  if (manifest.registryKeys.length !== ASS_CONVERSATION_STATE_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_CONVERSATION_STATE_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantConversationStateRegistry(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateValidationReport {
  const issues: ExecutiveAssistantConversationStateValidationIssue[] = [];
  for (const validation of [
    validateAllConversationStatesRegistered(registry),
    validateTransitionGraphValidity(registry),
    validateNoIllegalTransitions(registry),
    validateLifecycleCompleteness(registry),
    validateFrozenImmutableRecords(registry),
    validateNoStateRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  const matrix = getExecutiveAssistantTransitionMatrix();
  if (matrix.length !== registry.transitionCount) {
    issues.push(issue("transition_matrix_mismatch", "Transition matrix does not match registry."));
  }
  return report(issues);
}

export function getDefaultConversationStateCompatibility(): readonly string[] {
  return Object.freeze([...ASS_CONVERSATION_STATE_COMPATIBLE_VERSIONS, ASS_CONVERSATION_STATE_VERSION]);
}
