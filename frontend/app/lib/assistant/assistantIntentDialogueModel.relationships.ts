/** ASSISTANT-3:3 — Exactly 18 immutable descriptive Intent & Dialogue relationships. */
import { AssistantIntentDialogueRegistry } from "./assistantIntentDialogueRegistry.ts";
import type { AssistantIntentDialogueRelationshipMetadata } from "./assistantIntentDialogueModel.types.ts";

const declarations = Object.freeze([
  ["Executive Intent", "Dialogue Session", "belongs to"],
  ["Dialogue Session", "Dialogue Context", "contains"],
  ["Dialogue Session", "Dialogue Turn", "contains"],
  ["Dialogue Turn", "Executive Intent", "references"],
  ["Dialogue Turn", "Clarification Request", "produces"],
  ["Clarification Request", "Clarification Response", "receives"],
  ["Dialogue Context", "Executive Memory", "references"],
  ["Dialogue Context", "Conversation", "references"],
  ["Dialogue Flow", "Dialogue Transition", "governs"],
  ["Dialogue Transition", "Dialogue State", "updates"],
  ["Executive Intent", "Dialogue Objective", "targets"],
  ["Dialogue Session", "Dialogue Summary", "produces"],
  ["Dialogue Session", "Dialogue Policy", "governed by"],
  ["Dialogue Session", "Dialogue Capability", "exposes"],
  ["Dialogue Session", "Dialogue Boundary", "constrained by"],
  ["Dialogue Session", "Dialogue Lifecycle", "follows"],
  ["Dialogue Metadata", "Dialogue Session", "describes"],
  ["Intent Identity", "Executive Intent", "owns"],
] as const);

export const AssistantIntentDialogueModelRelationships:
readonly AssistantIntentDialogueRelationshipMetadata[] = Object.freeze(
  declarations.map(([source, target, relationshipType], index) =>
    Object.freeze({
      identifier:
        `ASSISTANT-3:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      registryReference: AssistantIntentDialogueRegistry.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
