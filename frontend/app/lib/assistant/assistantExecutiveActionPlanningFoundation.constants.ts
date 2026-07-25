/** ASSISTANT-7:1 — Immutable constants and canonical vocabulary inventories. */
import { AssistantExecutiveActionPlanningFoundationBoundaries } from "./assistantExecutiveActionPlanningFoundation.boundaries.ts";
import { AssistantExecutiveActionPlanningFoundationCapabilities } from "./assistantExecutiveActionPlanningFoundation.capabilities.ts";
import { AssistantExecutiveActionPlanningFoundationContracts } from "./assistantExecutiveActionPlanningFoundation.contracts.ts";
import type {
  AssistantExecutiveActionPlanningCategoryMetadata,
  AssistantExecutiveActionPlanningConceptMetadata,
  AssistantExecutiveActionPlanningInvariantMetadata,
  AssistantExecutiveActionPlanningLifecycleMetadata,
  AssistantExecutiveActionPlanningPolicyMetadata,
} from "./assistantExecutiveActionPlanningFoundation.types.ts";

const registerCategory = (
  prefix: string,
  names: readonly string[],
): readonly AssistantExecutiveActionPlanningCategoryMetadata[] =>
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-7:1/${prefix}/${String(index + 1).padStart(2, "0")}`,
      name,
      order: index + 1,
      conceptualOnly: true,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

export const AssistantExecutiveActionPlanningResponsibilities = Object.freeze([
  "Executive Action Planning",
  "Action Plan Identity",
  "Action Plan",
  "Planned Action",
  "Action Objective",
  "Action Sequence",
  "Action Dependency",
  "Action Priority",
  "Action Owner Reference",
  "Action Time Horizon",
  "Action Milestone",
  "Action Constraint",
  "Action Risk Reference",
  "Action Outcome",
  "Action Plan Policy",
  "Action Plan Boundary",
  "Action Planning Capability",
  "Action Planning Lifecycle",
  "Action Planning Context",
  "Action Planning Metadata",
] as const);

const actionPlanConceptDeclarations = Object.freeze([
  [
    "Action Plan",
    "Structured executive plan associated with executive objects.",
  ],
  [
    "Planned Action",
    "One descriptive action within an Action Plan.",
  ],
  [
    "Action Objective",
    "Intended executive result supported by the Action Plan.",
  ],
  [
    "Action Sequence",
    "Descriptive ordering of planned actions.",
  ],
  [
    "Action Dependency",
    "Prerequisite, successor, blocker, or relationship metadata.",
  ],
  [
    "Action Owner Reference",
    "Immutable reference to accountable entity without assignment.",
  ],
  [
    "Action Time Horizon",
    "Descriptive planning period classification.",
  ],
  [
    "Action Milestone",
    "Significant planned checkpoint or expected result.",
  ],
  [
    "Action Constraint",
    "Limitation affecting the plan as descriptive metadata.",
  ],
  [
    "Action Risk Reference",
    "Descriptive reference to a risk affecting the plan.",
  ],
  [
    "Action Outcome",
    "Intended or expected result of a plan or action.",
  ],
  [
    "Action Planning Context",
    "Surrounding executive, business, and workspace context.",
  ],
] as const);

export const AssistantExecutiveActionPlanningConcepts:
readonly AssistantExecutiveActionPlanningConceptMetadata[] = Object.freeze(
  actionPlanConceptDeclarations.map(([name, description], index) =>
    Object.freeze({
      id: `ASSISTANT-7:1/Concept/${String(index + 1).padStart(2, "0")}`,
      name,
      description,
      order: index + 1,
      descriptiveOnly: true,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
);

export const AssistantExecutiveActionPlanningActionPlanCategories =
  registerCategory("ActionPlanCategory", [
    "Strategic Action Plan",
    "Operational Action Plan",
    "Tactical Action Plan",
    "Decision Implementation Plan",
    "Problem Resolution Plan",
    "Goal Achievement Plan",
    "Scenario Response Plan",
    "Risk Mitigation Plan",
    "Opportunity Realization Plan",
    "Performance Improvement Plan",
    "Crisis Response Plan",
    "Transformation Plan",
  ]);

export const AssistantExecutiveActionPlanningPlannedActionCategories =
  registerCategory("PlannedActionCategory", [
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
  ]);

export const AssistantExecutiveActionPlanningActionPriorities =
  registerCategory("ActionPriority", [
    "Critical",
    "High",
    "Normal",
    "Low",
  ]);

export const AssistantExecutiveActionPlanningActionTimeHorizons =
  registerCategory("ActionTimeHorizon", [
    "Immediate",
    "Near Term",
    "Short Term",
    "Medium Term",
    "Long Term",
    "Continuous",
    "Unspecified",
  ]);

export const AssistantExecutiveActionPlanningDependencyConcepts =
  registerCategory("DependencyConcept", [
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
  ]);

export const AssistantExecutiveActionPlanningContextReferences =
  registerCategory("PlanningContextReference", [
    "Conversation Context",
    "Executive Memory",
    "Executive Intent",
    "Executive Guidance",
    "Workspace Context",
    "Executive Object",
    "Goal Object",
    "Problem Object",
    "Decision Object",
    "Scenario Object",
    "Risk Object",
    "KPI Object",
    "Strategy Object",
    "Initiative Object",
    "Timeline Context",
    "Organizational Context",
  ]);

const lifecycleNames = Object.freeze([
  "Declared",
  "Context Established",
  "Objective Defined",
  "Actions Structured",
  "Dependencies Described",
  "Plan Prepared",
  "Plan Reviewed",
  "Plan Confirmed",
  "Completed",
  "Archived",
] as const);

export const AssistantExecutiveActionPlanningLifecycle:
readonly AssistantExecutiveActionPlanningLifecycleMetadata[] = Object.freeze(
  lifecycleNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-7:1/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const policyNames = Object.freeze([
  "Metadata Only",
  "Immutable Architecture",
  "Canonical Identity",
  "Context Traceability",
  "Object Reference Integrity",
  "Explicit Objective Required",
  "Explicit Action Identity Required",
  "Dependency Transparency",
  "Ownership Reference Transparency",
  "Timing Reference Transparency",
  "No Runtime Execution",
  "No Automatic Assignment",
  "No Automatic Scheduling",
  "No Automatic Approval",
  "No Side Effects",
  "Version Controlled",
  "Freeze Compatible",
  "Public Index Compatible",
] as const);

export const AssistantExecutiveActionPlanningPolicies:
readonly AssistantExecutiveActionPlanningPolicyMetadata[] = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-7:1/Policy/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    enforceableAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const invariantStatements = Object.freeze([
  "Every Action Plan has one canonical identity.",
  "Every Planned Action has one stable identity.",
  "Every Action Plan references at least one Action Objective conceptually.",
  "Planned Actions belong to an Action Plan.",
  "Action Dependencies reference valid action identities conceptually.",
  "Action ownership is represented only through immutable references.",
  "Time horizons remain descriptive and non-executable.",
  "Milestones remain descriptive and non-scheduled.",
  "Context references preserve upstream identity.",
  "No plan automatically becomes an executable workflow.",
  "No planned action automatically becomes an OPS task.",
  "No planned action may trigger Runtime behaviour.",
  "No plan may mutate upstream objects.",
  "All public metadata remains immutable.",
  "All downstream phases derive from this Foundation.",
] as const);

export const AssistantExecutiveActionPlanningInvariants:
readonly AssistantExecutiveActionPlanningInvariantMetadata[] = Object.freeze(
  invariantStatements.map((statement, index) => Object.freeze({
    id: `ASSISTANT-7:1/Invariant/${String(index + 1).padStart(2, "0")}`,
    statement,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantExecutiveActionPlanningFoundationConstants =
  Object.freeze({
    phaseIdentifier: "ASSISTANT-7:1",
    canonicalIdentifier: "ASSISTANT-7:1/ExecutiveActionPlanningFoundation",
    namespace: "nexora.assistant.executive-action-planning.foundation",
    version: "1.0.0",
    foundationStatus: "Foundation",
    readiness: "ReadyForRegistry",
    contractCount:
      AssistantExecutiveActionPlanningFoundationContracts.length,
    capabilityCount:
      AssistantExecutiveActionPlanningFoundationCapabilities.length,
    policyCount: AssistantExecutiveActionPlanningPolicies.length,
    boundaryCount:
      AssistantExecutiveActionPlanningFoundationBoundaries.length,
    actionPlanCategoryCount:
      AssistantExecutiveActionPlanningActionPlanCategories.length,
    plannedActionCategoryCount:
      AssistantExecutiveActionPlanningPlannedActionCategories.length,
    actionPriorityCount:
      AssistantExecutiveActionPlanningActionPriorities.length,
    actionTimeHorizonCount:
      AssistantExecutiveActionPlanningActionTimeHorizons.length,
    dependencyConceptCount:
      AssistantExecutiveActionPlanningDependencyConcepts.length,
  } as const);
