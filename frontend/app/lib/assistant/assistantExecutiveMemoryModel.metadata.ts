/** ASSISTANT-2:3 — Canonical immutable domain models and structural metadata. */
import { AssistantExecutiveMemoryRegistry } from "./assistantExecutiveMemoryRegistry.ts";
import { AssistantExecutiveMemoryModelLifecycle } from "./assistantExecutiveMemoryModel.lifecycle.ts";
import { AssistantExecutiveMemoryModelRelationships } from "./assistantExecutiveMemoryModel.relationships.ts";
import type { AssistantExecutiveMemoryDomainModelMetadata } from "./assistantExecutiveMemoryModel.types.ts";

const names = Object.freeze([
  "Executive Memory",
  "Memory Session",
  "Memory Context",
  "Memory Scope",
  "Memory Timeline",
  "Memory Snapshot",
  "Memory Reference",
  "Memory Anchor",
  "Memory Collection",
  "Memory Category",
  "Memory Identity",
  "Memory Lifecycle",
  "Memory Policy",
  "Memory Capability",
  "Memory Boundary",
  "Workspace Memory",
  "Conversation Memory",
  "Object Memory",
  "Executive Context Memory",
  "Memory Metadata",
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

export const AssistantExecutiveMemoryDomainModels:
readonly AssistantExecutiveMemoryDomainModelMetadata[] = Object.freeze(
  names.map((canonicalName, index) => {
    const identifier =
      `ASSISTANT-2:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
    return Object.freeze({
      identifier,
      canonicalName,
      description: `Canonical structural metadata for ${canonicalName}.`,
      category: "Executive Memory Domain Model",
      parentModel: index === 0 ? null : "ASSISTANT-2:3/DomainModel/01",
      childModels: index === 0
        ? Object.freeze(names.slice(1).map((_, childIndex) =>
          `ASSISTANT-2:3/DomainModel/${
            String(childIndex + 2).padStart(2, "0")
          }`))
        : Object.freeze([]),
      relationshipReferences: Object.freeze(
        AssistantExecutiveMemoryModelRelationships
          .filter(({ source, target }) =>
            canonicalName === source || canonicalName === target)
          .map(({ identifier: relationshipId }) => relationshipId),
      ),
      lifecycleReference: "ASSISTANT-2:3/Lifecycle",
      registryReference: AssistantExecutiveMemoryRegistry.identity.id,
      version: "1.0.0",
      status: "Canonical",
      tags: Object.freeze(["assistant", "executive-memory", "model"]),
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const AssistantExecutiveMemoryModelStructuralMetadata = Object.freeze({
  rules: Object.freeze([
    "Consume Registry Identities Only",
    "Preserve Immutable Identities",
    "Define Explicit Relationships",
    "Expose Deterministic Structures",
    "Remain Implementation Free",
    "Contain No Executable Behaviour",
  ]),
  statistics: Object.freeze({
    domainModelCount: AssistantExecutiveMemoryDomainModels.length,
    relationshipCount: AssistantExecutiveMemoryModelRelationships.length,
    lifecycleCount: AssistantExecutiveMemoryModelLifecycle.length,
    metadataCount: domainModelMetadataFields.length,
  }),
  boundaries: Object.freeze([
    "Runtime Memory", "Memory Persistence", "Database", "Vector Database",
    "Embeddings", "Semantic Search", "Memory Retrieval", "Context Injection",
    "Prompt Execution", "LLM Integration", "AI Reasoning",
    "Workspace Execution", "Object Creation", "Recommendation Generation",
    "Decision Making", "Engine Execution", "Director", "DKL", "EVE", "NEA",
    "Runtime Layer", "SDK", "API Endpoints", "Queue", "Event Bus",
    "Networking", "UI", "Rendering", "Authentication", "Authorization",
    "Logging", "Monitoring",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
