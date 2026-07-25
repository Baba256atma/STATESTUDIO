/** ASSISTANT-4:2 — Canonical immutable registry entries. */
import type { AssistantExecutiveGuidanceRegistryEntry } from "./assistantExecutiveGuidanceRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantExecutiveGuidanceRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-4:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "executive-guidance",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantExecutiveGuidanceTypeEntries = register(
  "GuidanceType",
  [
    "Strategic Guidance",
    "Tactical Guidance",
    "Operational Guidance",
    "Analytical Guidance",
    "Planning Guidance",
    "Decision Guidance",
    "Risk Guidance",
    "Opportunity Guidance",
    "Review Guidance",
    "Monitoring Guidance",
    "Coaching Guidance",
    "Educational Guidance",
  ],
);

export const AssistantExecutiveGuidanceObjectiveEntries = register(
  "GuidanceObjective",
  [
    "Understand",
    "Clarify",
    "Prioritize",
    "Analyze",
    "Decide",
    "Plan",
    "Improve",
    "Monitor",
    "Optimize",
    "Execute",
  ],
);

export const AssistantExecutiveGuidanceStateEntries = register(
  "GuidanceState",
  [
    "Initialized",
    "Active",
    "Assessing",
    "Guiding",
    "Reviewing",
    "Confirming",
    "Completed",
    "Suspended",
    "Archived",
    "Cancelled",
  ],
);

export const AssistantExecutiveGuidanceSessionTypeEntries = register(
  "GuidanceSessionType",
  [
    "Executive Session",
    "Strategy Session",
    "Planning Session",
    "Review Session",
    "Crisis Session",
    "Coaching Session",
    "Performance Session",
    "Decision Session",
    "Monitoring Session",
    "Advisory Session",
  ],
);

export const AssistantExecutiveGuidancePriorityEntries = register(
  "GuidancePriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantExecutiveGuidanceOutcomeEntries = register(
  "GuidanceOutcome",
  [
    "Clarified",
    "Guided",
    "Recommended",
    "Planned",
    "Confirmed",
    "Deferred",
    "Escalated",
    "Completed",
  ],
);

export const AssistantExecutiveGuidanceStrategyEntries = register(
  "GuidanceStrategy",
  [
    "Investigate First",
    "Clarify First",
    "Prioritize First",
    "Risk First",
    "Opportunity First",
    "Goal Driven",
    "Data Driven",
    "Executive Driven",
    "Scenario Driven",
    "Evidence Driven",
  ],
);

export const AssistantExecutiveGuidancePolicyEntries = register(
  "GuidancePolicy",
  [
    "Metadata Only",
    "Immutable Registry",
    "Canonical Identity",
    "Version Controlled",
    "Freeze Compatible",
    "Public Index Compatible",
  ],
);

export const AssistantExecutiveGuidanceLifecycleStateEntries = register(
  "GuidanceLifecycleState",
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

export const AssistantExecutiveGuidanceTagEntries = register("GuidanceTag", [
  "Executive",
  "Guidance",
  "Strategy",
  "Planning",
  "Decision",
  "Review",
  "Coaching",
  "Advisory",
]);

export const AssistantExecutiveGuidanceRegistryEntries = Object.freeze([
  ...AssistantExecutiveGuidanceTypeEntries,
  ...AssistantExecutiveGuidanceObjectiveEntries,
  ...AssistantExecutiveGuidanceStateEntries,
  ...AssistantExecutiveGuidanceSessionTypeEntries,
  ...AssistantExecutiveGuidancePriorityEntries,
  ...AssistantExecutiveGuidanceOutcomeEntries,
  ...AssistantExecutiveGuidanceStrategyEntries,
  ...AssistantExecutiveGuidancePolicyEntries,
  ...AssistantExecutiveGuidanceLifecycleStateEntries,
  ...AssistantExecutiveGuidanceTagEntries,
]);
