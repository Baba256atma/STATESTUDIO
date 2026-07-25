/** ASSISTANT-5:2 — Canonical immutable registry entries. */
import type { AssistantWorkspaceOrchestrationRegistryEntry } from "./assistantWorkspaceOrchestrationRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantWorkspaceOrchestrationRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-5:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "workspace-orchestration",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantWorkspaceOrchestrationTypeEntries = register(
  "WorkspaceType",
  [
    "Executive Home Workspace",
    "Goal Workspace",
    "Problem Workspace",
    "Decision Workspace",
    "Scenario Workspace",
    "Strategy Workspace",
    "KPI Workspace",
    "Risk Workspace",
    "Operations Workspace",
    "Knowledge Workspace",
    "Timeline Workspace",
    "War Room Workspace",
  ],
);

export const AssistantWorkspaceOrchestrationStateEntries = register(
  "WorkspaceState",
  [
    "Initialized",
    "Available",
    "Active",
    "Focused",
    "Suspended",
    "Transitioning",
    "Completed",
    "Archived",
    "Disabled",
    "Closed",
  ],
);

export const AssistantWorkspaceOrchestrationTransitionTypeEntries = register(
  "WorkspaceTransitionType",
  [
    "Automatic Transition",
    "Manual Transition",
    "Context Transition",
    "Goal Transition",
    "Decision Transition",
    "Problem Transition",
    "Timeline Transition",
    "Scenario Transition",
    "Recovery Transition",
    "Executive Override",
  ],
);

export const AssistantWorkspaceOrchestrationSessionTypeEntries = register(
  "WorkspaceSessionType",
  [
    "Executive Session",
    "Planning Session",
    "Strategy Session",
    "Review Session",
    "Crisis Session",
    "Analysis Session",
    "Decision Session",
    "Monitoring Session",
    "Collaboration Session",
    "Exploration Session",
  ],
);

export const AssistantWorkspaceOrchestrationPriorityEntries = register(
  "WorkspacePriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantWorkspaceOrchestrationOutcomeEntries = register(
  "WorkspaceOutcome",
  [
    "Activated",
    "Coordinated",
    "Transitioned",
    "Focused",
    "Completed",
    "Deferred",
    "Escalated",
    "Archived",
  ],
);

export const AssistantWorkspaceOrchestrationCoordinationStrategyEntries =
  register(
    "WorkspaceCoordinationStrategy",
    [
      "Context Driven",
      "Goal Driven",
      "Problem Driven",
      "Decision Driven",
      "Timeline Driven",
      "Scenario Driven",
      "Executive Driven",
      "Manual Override",
      "Evidence Driven",
      "Priority Driven",
    ],
  );

export const AssistantWorkspaceOrchestrationPolicyEntries = register(
  "WorkspacePolicy",
  [
    "Metadata Only",
    "Immutable Registry",
    "Canonical Identity",
    "Version Controlled",
    "Freeze Compatible",
    "Public Index Compatible",
  ],
);

export const AssistantWorkspaceOrchestrationLifecycleStateEntries = register(
  "WorkspaceLifecycleState",
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

export const AssistantWorkspaceOrchestrationTagEntries = register(
  "WorkspaceTag",
  [
    "Executive",
    "Workspace",
    "Orchestration",
    "Coordination",
    "Strategy",
    "Planning",
    "Decision",
    "Timeline",
  ],
);

export const AssistantWorkspaceOrchestrationRegistryEntries = Object.freeze([
  ...AssistantWorkspaceOrchestrationTypeEntries,
  ...AssistantWorkspaceOrchestrationStateEntries,
  ...AssistantWorkspaceOrchestrationTransitionTypeEntries,
  ...AssistantWorkspaceOrchestrationSessionTypeEntries,
  ...AssistantWorkspaceOrchestrationPriorityEntries,
  ...AssistantWorkspaceOrchestrationOutcomeEntries,
  ...AssistantWorkspaceOrchestrationCoordinationStrategyEntries,
  ...AssistantWorkspaceOrchestrationPolicyEntries,
  ...AssistantWorkspaceOrchestrationLifecycleStateEntries,
  ...AssistantWorkspaceOrchestrationTagEntries,
]);
