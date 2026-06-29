/**
 * APP-1:4 — Executive Time State Registry.
 * Entity lifecycle state catalog — metadata only.
 */

import type {
  ExecutiveTimeEntityStateDefinition,
  ExecutiveTimeEntityStateSet,
  ExecutiveTimeEntityType,
  ExecutiveTimeStateRegistrationResult,
  ExecutiveTimeStateRegistrySnapshot,
  ExecutiveTimeStateValidationIssue,
  ExecutiveTimeStateValidationResult,
} from "./executiveTimeStateTypes.ts";
import { EXECUTIVE_TIME_STATE_ENGINE_VERSION } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_ENTITY_TYPES = Object.freeze([
  "scenario",
  "decision",
  "kpi",
  "risk",
  "object",
  "relationship",
  "data_source",
  "report",
  "dashboard",
  "assistant",
  "custom",
] as const satisfies readonly ExecutiveTimeEntityType[]);

type StateSeed = Readonly<{
  id: string;
  name: string;
  description: string;
  lifecycleOrder: number;
  isTerminal?: boolean;
  isEditable?: boolean;
  isVisible?: boolean;
  supportsTransition?: boolean;
}>;

const DEFAULT_STATE_SETS: Readonly<Record<ExecutiveTimeEntityType, readonly StateSeed[]>> = Object.freeze({
  scenario: Object.freeze([
    seed("draft", "Draft", 0),
    seed("planned", "Planned", 1),
    seed("active", "Active", 2),
    seed("waiting", "Waiting", 3),
    seed("blocked", "Blocked", 4),
    seed("completed", "Completed", 5, true, false),
    seed("archived", "Archived", 6, true, false),
  ]),
  decision: Object.freeze([
    seed("draft", "Draft", 0),
    seed("review", "Review", 1),
    seed("approved", "Approved", 2),
    seed("rejected", "Rejected", 3, true, false),
    seed("executed", "Executed", 4, true, false),
    seed("cancelled", "Cancelled", 5, true, false),
  ]),
  risk: Object.freeze([
    seed("detected", "Detected", 0),
    seed("monitoring", "Monitoring", 1),
    seed("escalating", "Escalating", 2),
    seed("mitigated", "Mitigated", 3),
    seed("accepted", "Accepted", 4, true, false),
    seed("closed", "Closed", 5, true, false),
  ]),
  kpi: Object.freeze([
    seed("inactive", "Inactive", 0),
    seed("collecting", "Collecting", 1),
    seed("monitoring", "Monitoring", 2),
    seed("warning", "Warning", 3),
    seed("target_met", "Target Met", 4),
    seed("completed", "Completed", 5, true, false),
  ]),
  object: Object.freeze([
    seed("created", "Created", 0),
    seed("active", "Active", 1),
    seed("inactive", "Inactive", 2),
    seed("deprecated", "Deprecated", 3),
    seed("archived", "Archived", 4, true, false),
  ]),
  relationship: Object.freeze([seed("draft", "Draft", 0), seed("active", "Active", 1), seed("archived", "Archived", 2, true, false)]),
  data_source: Object.freeze([seed("empty", "Empty", 0), seed("connected", "Connected", 1), seed("archived", "Archived", 2, true, false)]),
  report: Object.freeze([seed("draft", "Draft", 0), seed("published", "Published", 1, true, false)]),
  dashboard: Object.freeze([seed("draft", "Draft", 0), seed("active", "Active", 1), seed("archived", "Archived", 2, true, false)]),
  assistant: Object.freeze([seed("idle", "Idle", 0), seed("active", "Active", 1), seed("archived", "Archived", 2, true, false)]),
  custom: Object.freeze([seed("draft", "Draft", 0), seed("active", "Active", 1), seed("archived", "Archived", 2, true, false)]),
});

function seed(
  id: string,
  name: string,
  lifecycleOrder: number,
  isTerminal = false,
  isEditable = true,
  isVisible = true,
  supportsTransition = true
): StateSeed {
  return Object.freeze({ id, name, description: `${name} state.`, lifecycleOrder, isTerminal, isEditable, isVisible, supportsTransition });
}

function buildState(entityType: ExecutiveTimeEntityType, input: StateSeed): ExecutiveTimeEntityStateDefinition {
  return Object.freeze({
    id: input.id,
    name: input.name,
    entityType,
    description: input.description,
    lifecycleOrder: input.lifecycleOrder,
    isTerminal: input.isTerminal ?? false,
    isEditable: input.isEditable ?? true,
    isVisible: input.isVisible ?? true,
    supportsTransition: input.supportsTransition ?? true,
    metadata: Object.freeze({ source: "executive-time-state-registry" }),
  });
}

const stateRegistry = new Map<ExecutiveTimeEntityType, Map<string, ExecutiveTimeEntityStateDefinition>>();
let registrySeeded = false;

function nowIso(): string {
  return new Date().toISOString();
}

function failure(reason: string): ExecutiveTimeStateRegistrationResult {
  return Object.freeze({ success: false, reason });
}

function success(reason: string): ExecutiveTimeStateRegistrationResult {
  return Object.freeze({ success: true, reason });
}

function issue(code: string, message: string): ExecutiveTimeStateValidationIssue {
  return Object.freeze({ code, message });
}

export function isKnownExecutiveTimeEntityType(value: string): value is ExecutiveTimeEntityType {
  return (EXECUTIVE_TIME_ENTITY_TYPES as readonly string[]).includes(value);
}

function validateLifecycleOrdering(states: readonly ExecutiveTimeEntityStateDefinition[]): ExecutiveTimeStateValidationResult {
  const issues: ExecutiveTimeStateValidationIssue[] = [];
  const orders = states.map((entry) => entry.lifecycleOrder);
  for (let index = 1; index < orders.length; index += 1) {
    if (orders[index]! < orders[index - 1]!) {
      issues.push(issue("invalid_lifecycle_order", "lifecycleOrder must be non-decreasing within an entity set."));
      break;
    }
  }
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    issues.push(issue("duplicate_lifecycle_order", "lifecycleOrder values must be unique within an entity set."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function seedBuiltinStateSets(): void {
  if (registrySeeded) return;
  registrySeeded = true;
  for (const entityType of EXECUTIVE_TIME_ENTITY_TYPES) {
    const seeds = DEFAULT_STATE_SETS[entityType];
    registerEntityStateSet({
      entityType,
      states: seeds.map((entry) => buildState(entityType, entry)),
      defaultStateId: seeds[0]!.id,
    });
  }
}

export function resetExecutiveTimeStateRegistryForTests(): void {
  stateRegistry.clear();
  registrySeeded = false;
  seedBuiltinStateSets();
}

export function registerState(state: ExecutiveTimeEntityStateDefinition): ExecutiveTimeStateRegistrationResult {
  seedBuiltinStateSets();
  if (!isKnownExecutiveTimeEntityType(state.entityType)) {
    return failure("Invalid entity type.");
  }
  const bucket = stateRegistry.get(state.entityType) ?? new Map<string, ExecutiveTimeEntityStateDefinition>();
  if (bucket.has(state.id)) {
    return failure(`State "${state.id}" already registered for entity "${state.entityType}".`);
  }
  bucket.set(state.id, Object.freeze({ ...state, metadata: Object.freeze({ ...state.metadata }) }));
  stateRegistry.set(state.entityType, bucket);
  return success(`State "${state.id}" registered for "${state.entityType}".`);
}

export function registerEntityStateSet(input: {
  entityType: ExecutiveTimeEntityType;
  states: readonly ExecutiveTimeEntityStateDefinition[];
  defaultStateId: string;
}): ExecutiveTimeStateRegistrationResult {
  if (!isKnownExecutiveTimeEntityType(input.entityType)) {
    return failure("Invalid entity type.");
  }
  const ordering = validateLifecycleOrdering(input.states);
  if (!ordering.valid) {
    return failure(ordering.issues[0]?.message ?? "Invalid lifecycle ordering.");
  }
  if (!input.states.some((entry) => entry.id === input.defaultStateId)) {
    return failure("defaultStateId must exist in the state set.");
  }
  const bucket = new Map<string, ExecutiveTimeEntityStateDefinition>();
  for (const state of input.states) {
    if (state.entityType !== input.entityType) {
      return failure("All states in a set must match entityType.");
    }
    if (bucket.has(state.id)) {
      return failure(`Duplicate state id "${state.id}" in entity set.`);
    }
    bucket.set(state.id, Object.freeze({ ...state, metadata: Object.freeze({ ...state.metadata }) }));
  }
  stateRegistry.set(input.entityType, bucket);
  return success(`State set registered for "${input.entityType}".`);
}

export function getState(entityType: ExecutiveTimeEntityType, stateId: string): ExecutiveTimeEntityStateDefinition | null {
  seedBuiltinStateSets();
  return stateRegistry.get(entityType)?.get(stateId) ?? null;
}

export function listStates(): readonly ExecutiveTimeEntityStateDefinition[] {
  seedBuiltinStateSets();
  return Object.freeze(
    [...stateRegistry.entries()]
      .flatMap(([, bucket]) => [...bucket.values()])
      .sort((a, b) => a.entityType.localeCompare(b.entityType) || a.lifecycleOrder - b.lifecycleOrder)
  );
}

export function listEntityStates(entityType: ExecutiveTimeEntityType): readonly ExecutiveTimeEntityStateDefinition[] {
  seedBuiltinStateSets();
  const bucket = stateRegistry.get(entityType);
  if (!bucket) return Object.freeze([]);
  return Object.freeze([...bucket.values()].sort((a, b) => a.lifecycleOrder - b.lifecycleOrder));
}

export function validateState(entityType: ExecutiveTimeEntityType, stateId: string): ExecutiveTimeStateValidationResult {
  const state = getState(entityType, stateId);
  if (!state) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([issue("unknown_state", `Unknown state "${stateId}" for entity "${entityType}".`)]),
    });
  }
  return Object.freeze({ valid: true, issues: Object.freeze([]) });
}

export function getExecutiveTimeStateRegistrySnapshot(): ExecutiveTimeStateRegistrySnapshot {
  seedBuiltinStateSets();
  const statesByEntity: Record<string, readonly ExecutiveTimeEntityStateDefinition[]> = {};
  for (const entityType of EXECUTIVE_TIME_ENTITY_TYPES) {
    statesByEntity[entityType] = listEntityStates(entityType);
  }
  return Object.freeze({
    version: EXECUTIVE_TIME_STATE_ENGINE_VERSION,
    entityTypes: EXECUTIVE_TIME_ENTITY_TYPES,
    statesByEntity: Object.freeze(statesByEntity),
    generatedAt: nowIso(),
  });
}

export function getDefaultStateIdForEntity(entityType: ExecutiveTimeEntityType): string | null {
  const states = listEntityStates(entityType);
  return states[0]?.id ?? null;
}

seedBuiltinStateSets();
