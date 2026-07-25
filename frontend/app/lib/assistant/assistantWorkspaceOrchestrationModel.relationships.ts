/** ASSISTANT-5:3 — Exactly 18 immutable descriptive Workspace relationships. */
import { AssistantWorkspaceOrchestrationRegistry } from "./assistantWorkspaceOrchestrationRegistry.ts";
import type { AssistantWorkspaceOrchestrationRelationshipMetadata } from "./assistantWorkspaceOrchestrationModel.types.ts";

const declarations = Object.freeze([
  ["Workspace Orchestration", "Workspace Session", "owns"],
  ["Workspace Session", "Workspace Context", "contains"],
  ["Workspace Session", "Workspace State", "maintains"],
  ["Workspace Context", "Workspace Selection", "determines"],
  ["Workspace Selection", "Workspace Coordination", "activates"],
  ["Workspace Coordination", "Workspace Flow", "governs"],
  ["Workspace Flow", "Workspace Route", "defines"],
  ["Workspace Route", "Workspace Transition", "performs"],
  ["Workspace Transition", "Workspace State", "updates"],
  ["Workspace Session", "Workspace Objective", "targets"],
  ["Workspace Priority", "Workspace Selection", "influences"],
  ["Workspace Outcome", "Workspace Session", "completes"],
  ["Workspace Session", "Workspace Lifecycle", "follows"],
  ["Workspace Session", "Workspace Policy", "governed by"],
  ["Workspace Session", "Workspace Capability", "exposes"],
  ["Workspace Session", "Workspace Boundary", "constrained by"],
  ["Workspace Summary", "Workspace Session", "summarizes"],
  ["Workspace Metadata", "Workspace Orchestration", "describes"],
] as const);

export const AssistantWorkspaceOrchestrationModelRelationships:
readonly AssistantWorkspaceOrchestrationRelationshipMetadata[] = Object.freeze(
  declarations.map(([source, target, relationshipType], index) =>
    Object.freeze({
      identifier:
        `ASSISTANT-5:3/Relationship/${String(index + 1).padStart(2, "0")}`,
      source,
      target,
      relationshipType,
      registryReference: AssistantWorkspaceOrchestrationRegistry.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
