/** ASSISTANT-7:2 — Canonical immutable registry entries. */
import type { AssistantExecutiveActionPlanningRegistryEntry } from "./assistantExecutiveActionPlanningRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantExecutiveActionPlanningRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-7:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze([
      "assistant",
      "executive-action-planning",
      category.toLowerCase(),
    ]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantExecutiveActionPlanningActionPlanTypeEntries = register(
  "ActionPlanType",
  [
    "Strategic Action Plan",
    "Operational Action Plan",
    "Tactical Action Plan",
    "Decision Implementation Plan",
    "Goal Achievement Plan",
    "Problem Resolution Plan",
    "Scenario Response Plan",
    "Risk Mitigation Plan",
    "Opportunity Realization Plan",
    "Transformation Plan",
    "Crisis Response Plan",
    "Performance Improvement Plan",
  ],
);

export const AssistantExecutiveActionPlanningPlannedActionTypeEntries =
  register(
    "PlannedActionType",
    [
      "Investigate",
      "Clarify",
      "Decide",
      "Approve",
      "Prepare",
      "Execute",
      "Review",
      "Validate",
      "Monitor",
      "Escalate",
      "Communicate",
      "Close",
    ],
  );

export const AssistantExecutiveActionPlanningActionStateEntries = register(
  "ActionState",
  [
    "Draft",
    "Defined",
    "Planned",
    "Sequenced",
    "Reviewed",
    "Approved",
    "Ready",
    "Completed",
    "Archived",
    "Cancelled",
  ],
);

export const AssistantExecutiveActionPlanningActionPriorityLevelEntries =
  register(
    "ActionPriorityLevel",
    ["Critical", "High", "Normal", "Low"],
  );

export const AssistantExecutiveActionPlanningTimeHorizonTypeEntries = register(
  "TimeHorizonType",
  [
    "Immediate",
    "Near Term",
    "Short Term",
    "Medium Term",
    "Long Term",
    "Continuous",
    "Unspecified",
  ],
);

export const AssistantExecutiveActionPlanningDependencyTypeEntries = register(
  "DependencyType",
  [
    "Requires",
    "Required By",
    "Blocks",
    "Blocked By",
    "Precedes",
    "Follows",
    "Supports",
    "Conflicts With",
    "Coordinates With",
    "Independent Of",
  ],
);

export const AssistantExecutiveActionPlanningOwnershipReferenceTypeEntries =
  register(
    "OwnershipReferenceType",
    [
      "Executive",
      "Manager",
      "Team",
      "Department",
      "Organization",
      "Workspace",
      "Business Object",
      "External Party",
      "System",
      "Unassigned",
    ],
  );

export const AssistantExecutiveActionPlanningPolicyEntries = register(
  "PlanningPolicy",
  [
    "Metadata Only",
    "Immutable Registry",
    "Canonical Identity",
    "Version Controlled",
    "Freeze Compatible",
    "Public Index Compatible",
  ],
);

export const AssistantExecutiveActionPlanningLifecycleStateEntries = register(
  "PlanningLifecycleState",
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

export const AssistantExecutiveActionPlanningTagEntries = register(
  "PlanningTag",
  [
    "Executive",
    "Planning",
    "Action",
    "Strategy",
    "Decision",
    "Goal",
    "Problem",
    "Scenario",
    "Risk",
    "Operations",
  ],
);

export const AssistantExecutiveActionPlanningRegistryEntries = Object.freeze([
  ...AssistantExecutiveActionPlanningActionPlanTypeEntries,
  ...AssistantExecutiveActionPlanningPlannedActionTypeEntries,
  ...AssistantExecutiveActionPlanningActionStateEntries,
  ...AssistantExecutiveActionPlanningActionPriorityLevelEntries,
  ...AssistantExecutiveActionPlanningTimeHorizonTypeEntries,
  ...AssistantExecutiveActionPlanningDependencyTypeEntries,
  ...AssistantExecutiveActionPlanningOwnershipReferenceTypeEntries,
  ...AssistantExecutiveActionPlanningPolicyEntries,
  ...AssistantExecutiveActionPlanningLifecycleStateEntries,
  ...AssistantExecutiveActionPlanningTagEntries,
]);
