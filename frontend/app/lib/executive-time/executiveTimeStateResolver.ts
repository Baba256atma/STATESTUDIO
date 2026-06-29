/**
 * APP-1:4 — Executive Time State Resolver.
 * State resolution and transition metadata validation — no execution.
 */

import {
  getDefaultStateIdForEntity,
  getState,
  isKnownExecutiveTimeEntityType,
  listEntityStates,
  validateState,
} from "./executiveTimeStateRegistry.ts";
import type {
  ExecutiveTimeEntityStateDefinition,
  ExecutiveTimeEntityType,
  ExecutiveTimeStateFutureIntegrations,
  ExecutiveTimeStateTransitionContract,
  ExecutiveTimeStateValidationIssue,
  ExecutiveTimeStateValidationResult,
} from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS: ExecutiveTimeStateFutureIntegrations = Object.freeze({
  scenarioEngine: Object.freeze({ consumerId: "scenario", integrationImplemented: false, readOnly: true }),
  riskEngine: Object.freeze({ consumerId: "risk", integrationImplemented: false, readOnly: true }),
  kpiEngine: Object.freeze({ consumerId: "kpi", integrationImplemented: false, readOnly: true }),
  decisionEngine: Object.freeze({ consumerId: "decision", integrationImplemented: false, readOnly: true }),
  timeline: Object.freeze({ consumerId: "timeline", integrationImplemented: false, readOnly: true }),
  dashboard: Object.freeze({ consumerId: "dashboard", integrationImplemented: false, readOnly: true }),
  assistant: Object.freeze({ consumerId: "assistant", integrationImplemented: false, readOnly: true }),
  recommendation: Object.freeze({ consumerId: "recommendation", integrationImplemented: false, readOnly: true }),
});

function issue(code: string, message: string): ExecutiveTimeStateValidationIssue {
  return Object.freeze({ code, message });
}

export function isKnownEntity(entityType: string): entityType is ExecutiveTimeEntityType {
  return isKnownExecutiveTimeEntityType(entityType);
}

export function isKnownState(entityType: ExecutiveTimeEntityType, stateId: string): boolean {
  return validateState(entityType, stateId).valid;
}

export function resolveDefaultState(entityType: ExecutiveTimeEntityType): ExecutiveTimeEntityStateDefinition | null {
  const stateId = getDefaultStateIdForEntity(entityType);
  if (!stateId) return null;
  return getState(entityType, stateId);
}

export function resolveState(entityType: ExecutiveTimeEntityType, stateId: string): ExecutiveTimeEntityStateDefinition | null {
  return getState(entityType, stateId);
}

export function normalizeState(entityType: ExecutiveTimeEntityType, stateId: string | null | undefined): ExecutiveTimeEntityStateDefinition | null {
  if (stateId && isKnownState(entityType, stateId)) {
    return getState(entityType, stateId);
  }
  return resolveDefaultState(entityType);
}

export function resolveTerminalStates(entityType: ExecutiveTimeEntityType): readonly ExecutiveTimeEntityStateDefinition[] {
  return Object.freeze(listEntityStates(entityType).filter((entry) => entry.isTerminal));
}

export function resolveTerminalState(entityType: ExecutiveTimeEntityType): ExecutiveTimeEntityStateDefinition | null {
  const terminals = resolveTerminalStates(entityType);
  return terminals[terminals.length - 1] ?? null;
}

export function resolveEditableStates(entityType: ExecutiveTimeEntityType): readonly ExecutiveTimeEntityStateDefinition[] {
  return Object.freeze(listEntityStates(entityType).filter((entry) => entry.isEditable));
}

export function resolveEditableState(entityType: ExecutiveTimeEntityType, stateId: string): ExecutiveTimeEntityStateDefinition | null {
  const state = getState(entityType, stateId);
  if (!state || !state.isEditable) return null;
  return state;
}

export function resolveLifecycleOrder(entityType: ExecutiveTimeEntityType, stateId: string): number | null {
  return getState(entityType, stateId)?.lifecycleOrder ?? null;
}

export function isTerminal(entityType: ExecutiveTimeEntityType, stateId: string): boolean {
  return getState(entityType, stateId)?.isTerminal ?? false;
}

export function isEditable(entityType: ExecutiveTimeEntityType, stateId: string): boolean {
  return getState(entityType, stateId)?.isEditable ?? false;
}

export function canTransition(input: {
  entityType: ExecutiveTimeEntityType;
  fromState: string;
  toState: string;
}): boolean {
  const from = getState(input.entityType, input.fromState);
  const to = getState(input.entityType, input.toState);
  if (!from || !to) return false;
  if (from.isTerminal) return false;
  if (!from.supportsTransition || !to.supportsTransition) return false;
  return to.lifecycleOrder >= from.lifecycleOrder;
}

export function validateExecutiveTimeStateTransition(
  input: Partial<ExecutiveTimeStateTransitionContract>
): ExecutiveTimeStateValidationResult {
  const issues: ExecutiveTimeStateValidationIssue[] = [];
  if (!input.entityType || !isKnownEntity(input.entityType)) {
    issues.push(issue("invalid_entity_type", "entityType must be a known executive entity type."));
  }
  if (!input.fromState?.trim()) issues.push(issue("missing_from_state", "fromState is required."));
  if (!input.toState?.trim()) issues.push(issue("missing_to_state", "toState is required."));
  if (!input.transitionReason?.trim()) issues.push(issue("missing_transition_reason", "transitionReason is required."));
  if (!input.actor?.trim()) issues.push(issue("missing_actor", "actor is required."));
  if (!input.timestamp?.trim()) issues.push(issue("missing_timestamp", "timestamp is required."));
  if (typeof input.requiresApproval !== "boolean") {
    issues.push(issue("missing_requires_approval", "requiresApproval is required."));
  }
  if (!input.metadata || typeof input.metadata !== "object") {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  if (input.entityType && input.fromState && !isKnownState(input.entityType, input.fromState)) {
    issues.push(issue("unknown_from_state", `Unknown fromState "${input.fromState}".`));
  }
  if (input.entityType && input.toState && !isKnownState(input.entityType, input.toState)) {
    issues.push(issue("unknown_to_state", `Unknown toState "${input.toState}".`));
  }
  if (
    input.entityType &&
    input.fromState &&
    input.toState &&
    isKnownState(input.entityType, input.fromState) &&
    isKnownState(input.entityType, input.toState) &&
    !canTransition({ entityType: input.entityType, fromState: input.fromState, toState: input.toState })
  ) {
    issues.push(issue("transition_not_allowed", "Transition metadata indicates this move is not allowed."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}
