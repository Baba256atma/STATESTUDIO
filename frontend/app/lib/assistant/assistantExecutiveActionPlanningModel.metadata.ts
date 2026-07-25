/** ASSISTANT-7:3 — Canonical immutable domain models and structural metadata. */
import { AssistantExecutiveActionPlanningRegistry } from "./assistantExecutiveActionPlanningRegistry.ts";
import { AssistantExecutiveActionPlanningModelLifecycle } from "./assistantExecutiveActionPlanningModel.lifecycle.ts";
import { AssistantExecutiveActionPlanningModelRelationships } from "./assistantExecutiveActionPlanningModel.relationships.ts";
import type { AssistantExecutiveActionPlanningDomainModelMetadata } from "./assistantExecutiveActionPlanningModel.types.ts";

const names = Object.freeze([
  "Executive Action Planning",
  "Action Plan",
  "Action Plan Identity",
  "Action Objective",
  "Planned Action",
  "Action Sequence",
  "Action Dependency",
  "Action Priority",
  "Action Owner Reference",
  "Action Time Horizon",
  "Action Milestone",
  "Action Constraint",
  "Action Outcome",
  "Action Policy",
  "Action Planning Capability",
  "Action Planning Boundary",
  "Action Planning Context",
  "Action Planning Lifecycle",
  "Action Plan Summary",
  "Action Planning Metadata",
] as const);

const domainModelMetadataFields = Object.freeze([
  "identifier",
  "canonicalName",
  "description",
  "category",
  "parentModel",
  "childModels",
  "relationshipReferences",
  "lifecycleReference",
  "version",
  "status",
  "tags",
] as const);

export const AssistantExecutiveActionPlanningDomainModels:
readonly AssistantExecutiveActionPlanningDomainModelMetadata[] =
  Object.freeze(
    names.map((canonicalName, index) => {
      const identifier =
        `ASSISTANT-7:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
      return Object.freeze({
        identifier,
        canonicalName,
        description: `Canonical structural metadata for ${canonicalName}.`,
        category: "Executive Action Planning Domain Model",
        parentModel: index === 0 ? null : "ASSISTANT-7:3/DomainModel/01",
        childModels: index === 0
          ? Object.freeze(names.slice(1).map((_, childIndex) =>
            `ASSISTANT-7:3/DomainModel/${
              String(childIndex + 2).padStart(2, "0")
            }`))
          : Object.freeze([]),
        relationshipReferences: Object.freeze(
          AssistantExecutiveActionPlanningModelRelationships
            .filter(({ source, target }) =>
              canonicalName === source || canonicalName === target)
            .map(({ identifier: relationshipId }) => relationshipId),
        ),
        lifecycleReference: "ASSISTANT-7:3/Lifecycle",
        registryReference:
          AssistantExecutiveActionPlanningRegistry.identity.id,
        version: "1.0.0",
        status: "Canonical",
        tags: Object.freeze([
          "assistant",
          "executive-action-planning",
          "model",
        ]),
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  );

export const AssistantExecutiveActionPlanningModelStructuralMetadata =
  Object.freeze({
    rules: Object.freeze([
      "Consume Registry Identities Only",
      "Preserve Immutable Identities",
      "Define Explicit Relationships",
      "Expose Deterministic Structures",
      "Remain Implementation Free",
      "Contain No Executable Behaviour",
    ]),
    constraints: Object.freeze([
      "Action Plan Identity",
      "Action Hierarchy",
      "Planning Context",
      "Dependency Graph Description",
      "Ownership References",
      "Planning Traceability",
      "Milestone References",
      "Constraint References",
      "Outcome References",
    ]),
    statistics: Object.freeze({
      domainModelCount: AssistantExecutiveActionPlanningDomainModels.length,
      relationshipCount:
        AssistantExecutiveActionPlanningModelRelationships.length,
      lifecycleCount: AssistantExecutiveActionPlanningModelLifecycle.length,
      metadataCount: domainModelMetadataFields.length,
    }),
    boundaries: Object.freeze([
      "Runtime", "Planning Engine", "Action Generation", "Task Execution",
      "Scheduling", "Assignment", "Workflow Execution", "Automation",
      "Critical Path Calculation", "Resource Optimization",
      "Capacity Planning", "Calendar Integration", "Object Mutation",
      "Object Persistence", "Context Persistence",
      "Recommendation Generation", "Decision Generation", "LLM Integration",
      "Prompt Execution", "AI Reasoning", "Runtime Layer", "SDK", "Database",
      "API Endpoints", "Queue", "Event Bus", "Networking", "UI", "Rendering",
      "Authentication", "Authorization", "Logging", "Monitoring",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const);
