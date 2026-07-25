/** ASSISTANT-6:3 — Exactly 18 immutable descriptive Object & Context relationships. */
import { AssistantObjectContextManagementRegistry } from "./assistantObjectContextManagementRegistry.ts";
import type { AssistantObjectContextManagementRelationshipMetadata } from "./assistantObjectContextManagementModel.types.ts";

const declarations = Object.freeze([
  ["Object Context Management", "Executive Object", "owns"],
  ["Executive Object", "Object Identity", "owns"],
  ["Executive Object", "Object Reference", "maintains"],
  ["Executive Object", "Object Collection", "belongs to"],
  ["Executive Object", "Object Relationship", "participates in"],
  ["Executive Object", "Object Context", "exists within"],
  ["Object Context", "Context Session", "belongs to"],
  ["Context Session", "Context Scope", "defines"],
  ["Context Scope", "Context Snapshot", "contains"],
  ["Context Snapshot", "Context Timeline", "contributes to"],
  ["Context Timeline", "Context Transition", "records"],
  ["Context Transition", "Context State", "updates"],
  ["Context Session", "Context Lifecycle", "follows"],
  ["Context Session", "Context Policy", "governed by"],
  ["Context Session", "Context Capability", "exposes"],
  ["Context Session", "Context Boundary", "constrained by"],
  ["Context Summary", "Context Session", "summarizes"],
  ["Context Metadata", "Object Context Management", "describes"],
] as const);

export const AssistantObjectContextManagementModelRelationships:
readonly AssistantObjectContextManagementRelationshipMetadata[] =
  Object.freeze(
    declarations.map(([source, target, relationshipType], index) =>
      Object.freeze({
        identifier:
          `ASSISTANT-6:3/Relationship/${String(index + 1).padStart(2, "0")}`,
        source,
        target,
        relationshipType,
        registryReference:
          AssistantObjectContextManagementRegistry.identity.id,
        order: index + 1,
        executable: false,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );
