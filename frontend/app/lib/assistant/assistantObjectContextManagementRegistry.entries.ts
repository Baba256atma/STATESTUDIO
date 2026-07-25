/** ASSISTANT-6:2 — Canonical immutable registry entries. */
import type { AssistantObjectContextManagementRegistryEntry } from "./assistantObjectContextManagementRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantObjectContextManagementRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-6:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "object-context-management",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantObjectContextManagementExecutiveObjectTypeEntries =
  register(
    "ExecutiveObjectType",
    [
      "Goal Object",
      "Problem Object",
      "Decision Object",
      "Scenario Object",
      "KPI Object",
      "Risk Object",
      "Strategy Object",
      "Initiative Object",
      "Task Object",
      "Project Object",
      "Organization Object",
      "Knowledge Object",
    ],
  );

export const AssistantObjectContextManagementContextTypeEntries = register(
  "ContextType",
  [
    "Conversation Context",
    "Executive Context",
    "Business Context",
    "Workspace Context",
    "Strategic Context",
    "Operational Context",
    "Temporal Context",
    "Organizational Context",
    "Analytical Context",
    "External Context",
  ],
);

export const AssistantObjectContextManagementContextStateEntries = register(
  "ContextState",
  [
    "Initialized",
    "Active",
    "Focused",
    "Expanded",
    "Shared",
    "Archived",
    "Suspended",
    "Completed",
    "Invalid",
    "Closed",
  ],
);

export const AssistantObjectContextManagementContextSessionTypeEntries =
  register(
    "ContextSessionType",
    [
      "Executive Session",
      "Strategy Session",
      "Planning Session",
      "Decision Session",
      "Analysis Session",
      "Review Session",
      "Monitoring Session",
      "Collaboration Session",
      "Investigation Session",
      "Advisory Session",
    ],
  );

export const AssistantObjectContextManagementObjectPriorityEntries = register(
  "ObjectPriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantObjectContextManagementObjectOutcomeEntries = register(
  "ObjectOutcome",
  [
    "Created",
    "Referenced",
    "Updated",
    "Reviewed",
    "Linked",
    "Validated",
    "Archived",
    "Closed",
  ],
);

export const AssistantObjectContextManagementContextStrategyEntries = register(
  "ContextStrategy",
  [
    "Context Driven",
    "Object Driven",
    "Goal Driven",
    "Decision Driven",
    "Workspace Driven",
    "Timeline Driven",
    "Evidence Driven",
    "Executive Driven",
    "Relationship Driven",
    "Manual Override",
  ],
);

export const AssistantObjectContextManagementContextPolicyEntries = register(
  "ContextPolicy",
  [
    "Metadata Only",
    "Immutable Registry",
    "Canonical Identity",
    "Version Controlled",
    "Freeze Compatible",
    "Public Index Compatible",
  ],
);

export const AssistantObjectContextManagementContextLifecycleStateEntries =
  register(
    "ContextLifecycleState",
    [
      "Declared",
      "Registered",
      "Modelled",
      "Validated",
      "Published",
      "Certified",
      "Frozen",
      "Released",
    ],
  );

export const AssistantObjectContextManagementContextTagEntries = register(
  "ContextTag",
  [
    "Executive",
    "Object",
    "Context",
    "Business",
    "Workspace",
    "Strategy",
    "Decision",
    "Knowledge",
  ],
);

export const AssistantObjectContextManagementRegistryEntries = Object.freeze([
  ...AssistantObjectContextManagementExecutiveObjectTypeEntries,
  ...AssistantObjectContextManagementContextTypeEntries,
  ...AssistantObjectContextManagementContextStateEntries,
  ...AssistantObjectContextManagementContextSessionTypeEntries,
  ...AssistantObjectContextManagementObjectPriorityEntries,
  ...AssistantObjectContextManagementObjectOutcomeEntries,
  ...AssistantObjectContextManagementContextStrategyEntries,
  ...AssistantObjectContextManagementContextPolicyEntries,
  ...AssistantObjectContextManagementContextLifecycleStateEntries,
  ...AssistantObjectContextManagementContextTagEntries,
]);
