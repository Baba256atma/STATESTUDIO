/**
 * APP-1:1 — Executive Time Foundation contract.
 * Temporal vocabulary, validation helpers, and isolation manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  ExecutiveTimeContextDefinition,
  ExecutiveTimeContextKey,
  ExecutiveTimeEvent,
  ExecutiveTimeEventCategory,
  ExecutiveTimeEventCategoryDefinition,
  ExecutiveTimePriorityDefinition,
  ExecutiveTimePriorityKey,
  ExecutiveTimeStateDefinition,
  ExecutiveTimeStateKey,
  ExecutiveTimeTransitionRule,
  ExecutiveTimeValidationIssue,
  ExecutiveTimeValidationResult,
} from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_FOUNDATION_VERSION = "APP-1/1" as const;
export const EXECUTIVE_TIME_FOUNDATION_SOURCE = "app-1-executive-time-foundation" as const;
export const EXECUTIVE_TIME_FOUNDATION_LOG_PREFIX = "[NexoraExecutiveTime]" as const;

export const EXECUTIVE_TIME_FOUNDATION_TAGS = Object.freeze([
  "[APP1_1_EXECUTIVE_TIME_FOUNDATION]",
  "[EXECUTIVE_TIME_CONTRACT_READY]",
  "[EXECUTIVE_TIME_REGISTRY_READY]",
  "[EXECUTIVE_TIME_RESOLVER_READY]",
  "[NO_UI_MUTATION]",
  "[NO_SCENARIO_MUTATION]",
  "[NO_DASHBOARD_MUTATION]",
  "[NO_ASSISTANT_MUTATION]",
] as const);

export const EXECUTIVE_TIME_CONTEXT_KEYS = Object.freeze([
  "now",
  "today",
  "this_week",
  "this_month",
  "this_quarter",
  "this_year",
  "yesterday",
  "last_week",
  "last_month",
  "last_quarter",
  "last_year",
  "tomorrow",
  "next_week",
  "next_month",
  "next_quarter",
  "next_year",
  "custom_range",
  "future_projection",
  "past_review",
] as const satisfies readonly ExecutiveTimeContextKey[]);

export const EXECUTIVE_TIME_CONTEXT_CATEGORIES = Object.freeze([
  "current",
  "historical",
  "future",
  "flexible",
  "strategic",
] as const);

export const EXECUTIVE_TIME_CONTEXT_LENSES = Object.freeze([
  "operational",
  "management",
  "strategic",
  "forecast",
  "retrospective",
  "tactical",
] as const);

export const EXECUTIVE_TIME_STATE_KEYS = Object.freeze([
  "draft",
  "planned",
  "active",
  "waiting",
  "blocked",
  "completed",
  "expired",
  "archived",
] as const satisfies readonly ExecutiveTimeStateKey[]);

export const EXECUTIVE_TIME_PRIORITY_KEYS = Object.freeze([
  "critical",
  "urgent",
  "soon",
  "normal",
  "later",
  "expired",
] as const satisfies readonly ExecutiveTimePriorityKey[]);

export const EXECUTIVE_TIME_EVENT_CATEGORIES = Object.freeze([
  "scenario",
  "decision",
  "kpi",
  "risk",
  "object",
  "relationship",
  "data_source",
  "assistant",
  "dashboard",
  "manual",
] as const satisfies readonly ExecutiveTimeEventCategory[]);

export const EXECUTIVE_TIME_DEFAULT_CONTEXT: ExecutiveTimeContextKey = "now";
export const EXECUTIVE_TIME_DEFAULT_STATE: ExecutiveTimeStateKey = "draft";
export const EXECUTIVE_TIME_DEFAULT_PRIORITY: ExecutiveTimePriorityKey = "normal";

export const EXECUTIVE_TIME_EVENT_MANDATORY_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "description",
  "category",
  "timestamp",
  "relatedEntityId",
  "relatedEntityType",
  "state",
  "priority",
  "metadata",
] as const);

export const EXECUTIVE_TIME_MUST_NOT_OWN = Object.freeze([
  "time_panel_ui",
  "timeline_ui",
  "dashboard_ui",
  "assistant_ui",
  "scenario_engine",
  "scenario_simulation",
  "prediction_engine",
  "ml_inference",
  "time_camera",
  "workflow_automation",
  "transition_execution",
  "scene_sync",
  "workspace_mutation",
  "mrp_routing",
  "legacy_dashboard_modules",
  "legacy_assistant_modules",
] as const);

export const EXECUTIVE_TIME_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveDashboard/",
  "executiveAssistant/",
  "executiveScenario/",
  "dashboardIntelligence/",
  "assistantIntelligence/",
  "assistant/assistantRuntimeAdapter",
  "scenario-intelligence/",
  "workspace/workspaceSceneSync",
  "workspace/workspaceRelationshipSceneSync",
  "scene/",
  "components/",
  ".tsx",
] as const);

export const EXECUTIVE_TIME_SELF_MANIFEST = Object.freeze({
  stageId: "APP-1/1",
  title: "Executive Time Foundation",
  goal: "Metadata-first temporal intelligence foundation — contracts, registry, and resolver only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executive-time/executiveTimeTypes.ts",
    "frontend/app/lib/executive-time/executiveTimeContract.ts",
    "frontend/app/lib/executive-time/executiveTimeRegistry.ts",
    "frontend/app/lib/executive-time/executiveTimeResolver.ts",
    "frontend/app/lib/executive-time/executiveTimeCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeCertification.test.ts",
    "docs/app-1-1-executive-time-foundation-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_FOUNDATION_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_TIME_MODULE_PATHS = Object.freeze(
  EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

export const EXECUTIVE_TIME_BUILTIN_CONTEXTS: readonly ExecutiveTimeContextDefinition[] = Object.freeze(
  EXECUTIVE_TIME_CONTEXT_KEYS.map((key) =>
    Object.freeze({
      key,
      label: key.replace(/_/g, " "),
      description: `Executive temporal lens: ${key.replace(/_/g, " ")}.`,
    })
  )
);

export const EXECUTIVE_TIME_BUILTIN_STATES: readonly ExecutiveTimeStateDefinition[] = Object.freeze(
  EXECUTIVE_TIME_STATE_KEYS.map((key) =>
    Object.freeze({
      key,
      label: key,
      description: `Temporal state: ${key}.`,
    })
  )
);

export const EXECUTIVE_TIME_BUILTIN_PRIORITIES: readonly ExecutiveTimePriorityDefinition[] = Object.freeze(
  EXECUTIVE_TIME_PRIORITY_KEYS.map((key, index) =>
    Object.freeze({
      key,
      label: key,
      description: `Time sensitivity: ${key}.`,
      rank: index,
    })
  )
);

export const EXECUTIVE_TIME_BUILTIN_EVENT_CATEGORIES: readonly ExecutiveTimeEventCategoryDefinition[] =
  Object.freeze(
    EXECUTIVE_TIME_EVENT_CATEGORIES.map((key) =>
      Object.freeze({
        key,
        label: key.replace(/_/g, " "),
        description: `Event category: ${key.replace(/_/g, " ")}.`,
      })
    )
  );

export const EXECUTIVE_TIME_BUILTIN_TRANSITION_RULES: readonly ExecutiveTimeTransitionRule[] = Object.freeze([
  Object.freeze({
    ruleId: "draft-to-planned",
    fromState: "draft" as const,
    toState: "planned" as const,
    label: "Draft to planned",
    metadata: Object.freeze({}),
  }),
  Object.freeze({
    ruleId: "planned-to-active",
    fromState: "planned" as const,
    toState: "active" as const,
    label: "Planned to active",
    metadata: Object.freeze({}),
  }),
  Object.freeze({
    ruleId: "active-to-completed",
    fromState: "active" as const,
    toState: "completed" as const,
    label: "Active to completed",
    metadata: Object.freeze({}),
  }),
  Object.freeze({
    ruleId: "active-to-blocked",
    fromState: "active" as const,
    toState: "blocked" as const,
    label: "Active to blocked",
    metadata: Object.freeze({}),
  }),
  Object.freeze({
    ruleId: "blocked-to-waiting",
    fromState: "blocked" as const,
    toState: "waiting" as const,
    label: "Blocked to waiting",
    metadata: Object.freeze({}),
  }),
  Object.freeze({
    ruleId: "completed-to-archived",
    fromState: "completed" as const,
    toState: "archived" as const,
    label: "Completed to archived",
    metadata: Object.freeze({}),
  }),
]);

function issue(code: string, message: string): ExecutiveTimeValidationIssue {
  return Object.freeze({ code, message });
}

export function isExecutiveTimeContextKey(value: string): value is ExecutiveTimeContextKey {
  return (EXECUTIVE_TIME_CONTEXT_KEYS as readonly string[]).includes(value);
}

export function isExecutiveTimeStateKey(value: string): value is ExecutiveTimeStateKey {
  return (EXECUTIVE_TIME_STATE_KEYS as readonly string[]).includes(value);
}

export function isExecutiveTimePriorityKey(value: string): value is ExecutiveTimePriorityKey {
  return (EXECUTIVE_TIME_PRIORITY_KEYS as readonly string[]).includes(value);
}

export function isExecutiveTimeEventCategory(value: string): value is ExecutiveTimeEventCategory {
  return (EXECUTIVE_TIME_EVENT_CATEGORIES as readonly string[]).includes(value);
}

export function isValidRegistryKey(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && /^[a-z][a-z0-9_]*$/.test(trimmed);
}

export function validateExecutiveTimeTransition(
  input: Partial<{
    fromState: string;
    toState: string;
    reason: string;
    timestamp: string;
    actor: string;
    metadata: Readonly<Record<string, unknown>>;
  }>
): ExecutiveTimeValidationResult {
  const issues: ExecutiveTimeValidationIssue[] = [];
  if (!input.fromState || !isExecutiveTimeStateKey(input.fromState)) {
    issues.push(issue("invalid_from_state", "fromState must be a known executive time state."));
  }
  if (!input.toState || !isExecutiveTimeStateKey(input.toState)) {
    issues.push(issue("invalid_to_state", "toState must be a known executive time state."));
  }
  if (!input.reason?.trim()) issues.push(issue("missing_reason", "reason is required."));
  if (!input.timestamp?.trim()) issues.push(issue("missing_timestamp", "timestamp is required."));
  if (!input.actor?.trim()) issues.push(issue("missing_actor", "actor is required."));
  if (!input.metadata || typeof input.metadata !== "object") {
    issues.push(issue("missing_metadata", "metadata is required."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateExecutiveTimeEventShape(
  input: Partial<ExecutiveTimeEvent>
): ExecutiveTimeValidationResult {
  const issues: ExecutiveTimeValidationIssue[] = [];
  for (const field of EXECUTIVE_TIME_EVENT_MANDATORY_FIELDS) {
    if (!(field in input) || input[field as keyof ExecutiveTimeEvent] === undefined) {
      issues.push(issue(`missing_${field}`, `event.${field} is required.`));
    }
  }
  if (input.category && !isExecutiveTimeEventCategory(input.category)) {
    issues.push(issue("invalid_category", "category must be a known event category."));
  }
  if (input.state && !isExecutiveTimeStateKey(input.state)) {
    issues.push(issue("invalid_state", "state must be a known executive time state."));
  }
  if (input.priority && !isExecutiveTimePriorityKey(input.priority)) {
    issues.push(issue("invalid_priority", "priority must be a known executive time priority."));
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function resolveExecutiveTimeEventExample(): ExecutiveTimeEvent {
  return Object.freeze({
    id: "et-event-example-001",
    workspaceId: "ws-example-001",
    title: "Executive time foundation probe",
    description: "Example event for certification.",
    category: "manual",
    timestamp: new Date(0).toISOString(),
    relatedEntityId: null,
    relatedEntityType: null,
    state: EXECUTIVE_TIME_DEFAULT_STATE,
    priority: EXECUTIVE_TIME_DEFAULT_PRIORITY,
    metadata: Object.freeze({ probe: true }),
  });
}
