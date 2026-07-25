/** ASSISTANT-1:3 — Immutable descriptive Conversation relationships. */
import { AssistantConversationRegistry } from "./assistantConversationRegistry.ts";
import type { AssistantConversationRelationshipMetadata } from "./assistantConversationModel.types.ts";

const declarations = Object.freeze([
  ["Conversation", "Session", "contains"],
  ["Session", "Turns", "contains"],
  ["Turn", "Session", "belongs to"],
  ["Turn", "Intent", "references"],
  ["Turn", "Context", "references"],
  ["Conversation", "Goal", "targets"],
  ["Conversation", "Outcome", "produces"],
  ["Conversation", "Lifecycle", "follows"],
  ["Conversation", "Policy", "governed by"],
  ["Conversation", "Boundary", "constrained by"],
  ["Conversation", "Capability", "exposes"],
  ["Conversation", "Identity", "owned by"],
] as const);

export const AssistantConversationModelRelationships:
readonly AssistantConversationRelationshipMetadata[] = Object.freeze(
  declarations.map(([source, target, relationshipType], index) =>
    Object.freeze({
      identifier:
        `ASSISTANT-1:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      registryReference: AssistantConversationRegistry.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
