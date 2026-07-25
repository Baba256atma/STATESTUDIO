/** ASSISTANT-6:3 — Canonical immutable domain models and structural metadata. */
import { AssistantObjectContextManagementRegistry } from "./assistantObjectContextManagementRegistry.ts";
import { AssistantObjectContextManagementModelLifecycle } from "./assistantObjectContextManagementModel.lifecycle.ts";
import { AssistantObjectContextManagementModelRelationships } from "./assistantObjectContextManagementModel.relationships.ts";
import type { AssistantObjectContextManagementDomainModelMetadata } from "./assistantObjectContextManagementModel.types.ts";

const names = Object.freeze([
  "Object Context Management",
  "Executive Object",
  "Object Identity",
  "Object Reference",
  "Object Collection",
  "Object Relationship",
  "Object Context",
  "Context Session",
  "Context Scope",
  "Context Snapshot",
  "Context Timeline",
  "Context State",
  "Context Transition",
  "Context Policy",
  "Context Capability",
  "Context Boundary",
  "Context Lifecycle",
  "Context Summary",
  "Context Metadata",
  "Context Index",
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

export const AssistantObjectContextManagementDomainModels:
readonly AssistantObjectContextManagementDomainModelMetadata[] =
  Object.freeze(
    names.map((canonicalName, index) => {
      const identifier =
        `ASSISTANT-6:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
      return Object.freeze({
        identifier,
        canonicalName,
        description: `Canonical structural metadata for ${canonicalName}.`,
        category: "Object & Context Management Domain Model",
        parentModel: index === 0 ? null : "ASSISTANT-6:3/DomainModel/01",
        childModels: index === 0
          ? Object.freeze(names.slice(1).map((_, childIndex) =>
            `ASSISTANT-6:3/DomainModel/${
              String(childIndex + 2).padStart(2, "0")
            }`))
          : Object.freeze([]),
        relationshipReferences: Object.freeze(
          AssistantObjectContextManagementModelRelationships
            .filter(({ source, target }) =>
              canonicalName === source || canonicalName === target)
            .map(({ identifier: relationshipId }) => relationshipId),
        ),
        lifecycleReference: "ASSISTANT-6:3/Lifecycle",
        registryReference:
          AssistantObjectContextManagementRegistry.identity.id,
        version: "1.0.0",
        status: "Canonical",
        tags: Object.freeze([
          "assistant",
          "object-context-management",
          "model",
        ]),
        executable: false,
        metadataOnly: true,
        immutable: true,
      });
    }),
  );

export const AssistantObjectContextManagementModelStructuralMetadata =
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
      domainModelCount: AssistantObjectContextManagementDomainModels.length,
      relationshipCount:
        AssistantObjectContextManagementModelRelationships.length,
      lifecycleCount: AssistantObjectContextManagementModelLifecycle.length,
      metadataCount: domainModelMetadataFields.length,
    }),
    boundaries: Object.freeze([
      "Runtime", "Object Creation", "Object Persistence",
      "Context Persistence", "Context Synchronization", "Workflow Execution",
      "Workspace Execution", "Recommendation Generation",
      "Decision Generation", "LLM Integration", "Prompt Execution",
      "AI Reasoning", "Runtime Layer", "SDK", "Database", "API Endpoints",
      "Queue", "Event Bus", "Networking", "UI", "Rendering",
      "Authentication", "Authorization", "Logging", "Monitoring",
    ]),
    metadataOnly: true,
    immutable: true,
  } as const);
