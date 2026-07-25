/** ASSISTANT-1:3 — Canonical immutable domain models and structural metadata. */
import { AssistantConversationRegistry } from "./assistantConversationRegistry.ts";
import { AssistantConversationModelRelationships } from "./assistantConversationModel.relationships.ts";
import type { AssistantConversationDomainModelMetadata } from "./assistantConversationModel.types.ts";

const names = Object.freeze([
  "Assistant Conversation",
  "Executive Conversation",
  "Conversation Session",
  "Conversation Turn",
  "Executive Request",
  "Assistant Response",
  "Clarification Request",
  "Clarification Response",
  "Conversation Context",
  "Conversation Goal",
  "Conversation Outcome",
  "Conversation State",
  "Conversation Policy",
  "Conversation Capability",
  "Conversation Boundary",
  "Conversation Identity",
  "Conversation Timeline",
  "Conversation Summary",
  "Conversation Metadata",
  "Conversation Audit",
] as const);

export const AssistantConversationDomainModels:
readonly AssistantConversationDomainModelMetadata[] = Object.freeze(
  names.map((canonicalName, index) => {
    const identifier =
      `ASSISTANT-1:3/DomainModel/${String(index + 1).padStart(2, "0")}`;
    return Object.freeze({
      identifier,
      canonicalName,
      description: `Canonical structural metadata for ${canonicalName}.`,
      category: "Conversation Domain Model",
      parentModel: index === 0 ? null : "ASSISTANT-1:3/DomainModel/01",
      childModels: index === 0
        ? Object.freeze(names.slice(1).map((_, childIndex) =>
          `ASSISTANT-1:3/DomainModel/${String(childIndex + 2).padStart(2, "0")}`))
        : Object.freeze([]),
      relationshipReferences: Object.freeze(
        AssistantConversationModelRelationships
          .filter(({ source, target }) =>
            canonicalName.includes(source) || canonicalName.includes(target))
          .map(({ identifier: relationshipId }) => relationshipId),
      ),
      lifecycleReference: "ASSISTANT-1:3/Lifecycle",
      registryReference: AssistantConversationRegistry.identity.id,
      version: "1.0.0",
      status: "Canonical",
      tags: Object.freeze(["assistant", "conversation", "model"]),
      executable: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);

export const AssistantConversationModelStructuralMetadata = Object.freeze({
  rules: Object.freeze([
    "Reference Registry Identities Only",
    "Contain Immutable Structures",
    "Preserve Canonical Identities",
    "Define Explicit Relationships",
    "Expose No Executable Logic",
  ]),
  boundaries: Object.freeze([
    "Conversation Runtime", "Chat Execution", "Prompt Execution",
    "LLM Integration", "AI Reasoning", "Memory Storage",
    "Workspace Selection", "Object Creation", "Engine Execution",
    "DKL Queries", "Director", "EVE", "Runtime Layer", "UI", "Rendering",
    "Persistence", "API", "Network", "Queue", "Event Bus", "Authentication",
    "Authorization", "Monitoring", "Logging",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
