/** ASSISTANT-5:3 — Canonical immutable domain models and structural metadata. */
import { AssistantWorkspaceOrchestrationRegistry } from "./assistantWorkspaceOrchestrationRegistry.ts";
import { AssistantWorkspaceOrchestrationModelLifecycle } from "./assistantWorkspaceOrchestrationModel.lifecycle.ts";
import { AssistantWorkspaceOrchestrationModelRelationships } from "./assistantWorkspaceOrchestrationModel.relationships.ts";
import type { AssistantWorkspaceOrchestrationDomainModelMetadata } from "./assistantWorkspaceOrchestrationModel.types.ts";

const names = Object.freeze([
  "Workspace Orchestration",
  "Workspace Identity",
  "Workspace Session",
  "Workspace Context",
  "Workspace State",
  "Workspace Transition",
  "Workspace Selection",
  "Workspace Coordination",
  "Workspace Flow",
  "Workspace Route",
  "Workspace Objective",
  "Workspace Priority",
  "Workspace Outcome",
  "Workspace Policy",
  "Workspace Capability",
  "Workspace Boundary",
  "Workspace Lifecycle",
  "Workspace Timeline",
  "Workspace Summary",
  "Workspace Metadata",
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

export const AssistantWorkspaceOrchestrationDomainModels:
readonly AssistantWorkspaceOrchestrationDomainModelMetadata[] = Object.freeze(
  names.map((canonicalName, index) => {
    const identifier =
      `ASSISTANT-5:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
    return Object.freeze({
      identifier,
      canonicalName,
      description: `Canonical structural metadata for ${canonicalName}.`,
      category: "Workspace Orchestration Domain Model",
      parentModel: index === 0 ? null : "ASSISTANT-5:3/DomainModel/01",
      childModels: index === 0
        ? Object.freeze(names.slice(1).map((_, childIndex) =>
          `ASSISTANT-5:3/DomainModel/${
            String(childIndex + 2).padStart(2, "0")
          }`))
        : Object.freeze([]),
      relationshipReferences: Object.freeze(
        AssistantWorkspaceOrchestrationModelRelationships
          .filter(({ source, target }) =>
            canonicalName === source || canonicalName === target)
          .map(({ identifier: relationshipId }) => relationshipId),
      ),
      lifecycleReference: "ASSISTANT-5:3/Lifecycle",
      registryReference: AssistantWorkspaceOrchestrationRegistry.identity.id,
      version: "1.0.0",
      status: "Canonical",
      tags: Object.freeze(["assistant", "workspace-orchestration", "model"]),
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const AssistantWorkspaceOrchestrationModelStructuralMetadata =
  Object.freeze({
    rules: Object.freeze([
      "Consume Registry Identities Only",
      "Preserve Immutable Identities",
      "Define Explicit Relationships",
      "Expose Deterministic Structures",
      "Remain Implementation Free",
      "Contain No Executable Behaviour",
    ]),
    statistics: Object.freeze({
      domainModelCount: AssistantWorkspaceOrchestrationDomainModels.length,
      relationshipCount:
        AssistantWorkspaceOrchestrationModelRelationships.length,
      lifecycleCount: AssistantWorkspaceOrchestrationModelLifecycle.length,
      metadataCount: domainModelMetadataFields.length,
    }),
    boundaries: Object.freeze([
      "Runtime", "Workspace Execution", "Workspace Routing",
      "Workspace Switching", "Orchestration Engine", "Workflow Execution",
      "Scheduling", "Recommendation Generation", "Decision Generation",
      "LLM Integration", "Prompt Execution", "AI Reasoning", "Runtime Layer",
      "SDK", "Database", "API Endpoints", "Queue", "Event Bus", "Networking",
      "UI", "Rendering", "Authentication", "Authorization", "Logging",
      "Monitoring",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const);
