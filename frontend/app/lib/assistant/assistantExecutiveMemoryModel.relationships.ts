/** ASSISTANT-2:3 — Exactly 18 immutable descriptive Executive Memory relationships. */
import { AssistantExecutiveMemoryRegistry } from "./assistantExecutiveMemoryRegistry.ts";
import type { AssistantExecutiveMemoryRelationshipMetadata } from "./assistantExecutiveMemoryModel.types.ts";

const declarations = Object.freeze([
  ["Executive Memory", "Memory Session", "contains"],
  ["Memory Session", "Memory Context", "contains"],
  ["Memory Context", "Workspace Memory", "references"],
  ["Memory Context", "Conversation Memory", "references"],
  ["Memory Context", "Object Memory", "references"],
  ["Executive Memory", "Memory Timeline", "contains"],
  ["Memory Timeline", "Memory Snapshot", "contains"],
  ["Memory Snapshot", "Memory Anchor", "references"],
  ["Memory Anchor", "Memory Reference", "references"],
  ["Executive Memory", "Memory Policy", "governed by"],
  ["Executive Memory", "Memory Capability", "exposes"],
  ["Executive Memory", "Memory Boundary", "constrained by"],
  ["Executive Memory", "Memory Lifecycle", "follows"],
  ["Workspace Memory", "Memory Collection", "references"],
  ["Conversation Memory", "Executive Context Memory", "references"],
  ["Memory Metadata", "Executive Memory", "describes"],
  ["Memory Identity", "Executive Memory", "owns"],
  ["Memory Collection", "Memory Reference", "groups"],
] as const);

export const AssistantExecutiveMemoryModelRelationships:
readonly AssistantExecutiveMemoryRelationshipMetadata[] = Object.freeze(
  declarations.map(([source, target, relationshipType], index) =>
    Object.freeze({
      identifier:
        `ASSISTANT-2:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      registryReference: AssistantExecutiveMemoryRegistry.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
