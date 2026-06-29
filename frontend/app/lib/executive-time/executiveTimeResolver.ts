/**
 * APP-1:1 — Executive Time Resolver.
 * Default resolution, event validation, and safe normalization — no runtime coupling.
 */

import {
  EXECUTIVE_TIME_DEFAULT_CONTEXT,
  EXECUTIVE_TIME_DEFAULT_PRIORITY,
  EXECUTIVE_TIME_DEFAULT_STATE,
  isExecutiveTimeContextKey,
  isExecutiveTimeEventCategory,
  isExecutiveTimePriorityKey,
  isExecutiveTimeStateKey,
  validateExecutiveTimeEventShape,
} from "./executiveTimeContract.ts";
import {
  hasExecutiveTimeContext,
  hasExecutiveTimeEventCategory,
  hasExecutiveTimePriority,
  hasExecutiveTimeState,
} from "./executiveTimeRegistry.ts";
import type {
  ExecutiveTimeContextKey,
  ExecutiveTimeEvent,
  ExecutiveTimeEventCategory,
  ExecutiveTimeEventInput,
  ExecutiveTimePriorityKey,
  ExecutiveTimeStateKey,
  ExecutiveTimeValidationIssue,
  ExecutiveTimeValidationResult,
} from "./executiveTimeTypes.ts";

function issue(code: string, message: string): ExecutiveTimeValidationIssue {
  return Object.freeze({ code, message });
}

function nowIso(): string {
  return new Date().toISOString();
}

export function resolveDefaultExecutiveTimeContext(): ExecutiveTimeContextKey {
  return EXECUTIVE_TIME_DEFAULT_CONTEXT;
}

export function resolveDefaultExecutiveTimeState(): ExecutiveTimeStateKey {
  return EXECUTIVE_TIME_DEFAULT_STATE;
}

export function resolveDefaultExecutiveTimePriority(): ExecutiveTimePriorityKey {
  return EXECUTIVE_TIME_DEFAULT_PRIORITY;
}

export function resolveSafeExecutiveTimeContext(value: string | undefined | null): ExecutiveTimeContextKey {
  if (value && isExecutiveTimeContextKey(value) && hasExecutiveTimeContext(value)) {
    return value;
  }
  return resolveDefaultExecutiveTimeContext();
}

export function resolveSafeExecutiveTimeState(value: string | undefined | null): ExecutiveTimeStateKey {
  if (value && isExecutiveTimeStateKey(value) && hasExecutiveTimeState(value)) {
    return value;
  }
  return resolveDefaultExecutiveTimeState();
}

export function resolveSafeExecutiveTimePriority(value: string | undefined | null): ExecutiveTimePriorityKey {
  if (value && isExecutiveTimePriorityKey(value) && hasExecutiveTimePriority(value)) {
    return value;
  }
  return resolveDefaultExecutiveTimePriority();
}

export function resolveSafeExecutiveTimeEventCategory(
  value: string | undefined | null
): ExecutiveTimeEventCategory {
  if (value && isExecutiveTimeEventCategory(value) && hasExecutiveTimeEventCategory(value)) {
    return value;
  }
  return "manual";
}

export function normalizeExecutiveTimeEvent(input: ExecutiveTimeEventInput): ExecutiveTimeEvent {
  return Object.freeze({
    id: input.id.trim(),
    workspaceId: input.workspaceId.trim(),
    title: input.title?.trim() || "Untitled executive time event",
    description: input.description?.trim() || "",
    category: resolveSafeExecutiveTimeEventCategory(input.category),
    timestamp: input.timestamp?.trim() || nowIso(),
    relatedEntityId: input.relatedEntityId?.trim() || null,
    relatedEntityType: input.relatedEntityType?.trim() || null,
    state: resolveSafeExecutiveTimeState(input.state),
    priority: resolveSafeExecutiveTimePriority(input.priority),
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
  });
}

export function validateExecutiveTimeEvent(input: Partial<ExecutiveTimeEvent>): ExecutiveTimeValidationResult {
  const issues: ExecutiveTimeValidationIssue[] = [];
  const shapeResult = validateExecutiveTimeEventShape(input);
  issues.push(...shapeResult.issues);

  if (input.id !== undefined && !input.id.trim()) {
    issues.push(issue("empty_id", "event.id cannot be empty."));
  }
  if (input.workspaceId !== undefined && !input.workspaceId.trim()) {
    issues.push(issue("empty_workspace_id", "event.workspaceId cannot be empty."));
  }
  if (input.category && !hasExecutiveTimeEventCategory(input.category)) {
    issues.push(issue("unknown_category", `Unknown event category "${input.category}".`));
  }
  if (input.state && !hasExecutiveTimeState(input.state)) {
    issues.push(issue("unknown_state", `Unknown time state "${input.state}".`));
  }
  if (input.priority && !hasExecutiveTimePriority(input.priority)) {
    issues.push(issue("unknown_priority", `Unknown time priority "${input.priority}".`));
  }
  if (input.timestamp?.trim()) {
    const parsed = Date.parse(input.timestamp);
    if (!Number.isFinite(parsed)) {
      issues.push(issue("invalid_timestamp", "timestamp must be a valid ISO date."));
    }
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}
