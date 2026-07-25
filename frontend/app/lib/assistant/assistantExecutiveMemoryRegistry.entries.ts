/** ASSISTANT-2:2 — Canonical immutable registry entries. */
import type { AssistantExecutiveMemoryRegistryEntry } from "./assistantExecutiveMemoryRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantExecutiveMemoryRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-2:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "executive-memory",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantExecutiveMemoryTypeEntries = register("MemoryType", [
  "Executive Memory",
  "Conversation Memory",
  "Session Memory",
  "Workspace Memory",
  "Object Memory",
  "Timeline Memory",
  "Organization Memory",
  "Project Memory",
]);

export const AssistantExecutiveMemoryScopeEntries = register("MemoryScope", [
  "Local",
  "Conversation",
  "Session",
  "Workspace",
  "Executive",
  "Department",
  "Organization",
  "Global",
]);

export const AssistantExecutiveMemoryStateEntries = register("MemoryState", [
  "Declared",
  "Active",
  "Referenced",
  "Updated",
  "Frozen",
  "Archived",
  "Deprecated",
  "Removed",
]);

export const AssistantExecutiveMemoryContextTypeEntries = register(
  "MemoryContextType",
  [
    "Executive Context",
    "Workspace Context",
    "Business Context",
    "Strategic Context",
    "Operational Context",
    "Analytical Context",
    "Decision Context",
    "Scenario Context",
  ],
);

export const AssistantExecutiveMemoryReferenceTypeEntries = register(
  "MemoryReferenceType",
  [
    "Conversation",
    "Workspace",
    "Business Object",
    "Timeline",
    "Goal",
    "Decision",
    "Scenario",
    "Knowledge",
  ],
);

export const AssistantExecutiveMemoryLifecycleStateEntries = register(
  "MemoryLifecycleState",
  [
    "Created",
    "Initialized",
    "Active",
    "Referenced",
    "Reviewed",
    "Frozen",
    "Archived",
  ],
);

export const AssistantExecutiveMemoryPolicyEntries = register("MemoryPolicy", [
  "Immutable Metadata",
  "Canonical Identity",
  "Metadata Only",
  "Version Controlled",
  "Freeze Compatible",
  "Public Index Compatible",
]);

export const AssistantExecutiveMemoryPriorityEntries = register(
  "MemoryPriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantExecutiveMemoryOutcomeEntries = register(
  "MemoryOutcome",
  ["Valid", "Incomplete", "Pending", "Reviewed", "Certified", "Frozen"],
);

export const AssistantExecutiveMemoryTagEntries = register("MemoryTag", [
  "Executive",
  "Strategic",
  "Operational",
  "Workspace",
  "Timeline",
  "Context",
  "Session",
  "Object",
]);

export const AssistantExecutiveMemoryRegistryEntries = Object.freeze([
  ...AssistantExecutiveMemoryTypeEntries,
  ...AssistantExecutiveMemoryScopeEntries,
  ...AssistantExecutiveMemoryStateEntries,
  ...AssistantExecutiveMemoryContextTypeEntries,
  ...AssistantExecutiveMemoryReferenceTypeEntries,
  ...AssistantExecutiveMemoryLifecycleStateEntries,
  ...AssistantExecutiveMemoryPolicyEntries,
  ...AssistantExecutiveMemoryPriorityEntries,
  ...AssistantExecutiveMemoryOutcomeEntries,
  ...AssistantExecutiveMemoryTagEntries,
]);
