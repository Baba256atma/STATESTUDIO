/** WS-1:3 — Declarative Workspace relationships. */
import { WorkspaceRegistry } from "./workspaceRegistry.ts";
import type { WorkspaceRelationshipDescriptor } from "./workspaceModelTypes.ts";

const relationships = Object.freeze([
  ["Workspace", "has", "Identity"], ["Workspace", "has", "Metadata"],
  ["Workspace", "belongs to", "Workspace Type"], ["Workspace", "serves", "Objective"],
  ["Workspace", "operates within", "Scope"], ["Workspace", "receives", "Context"],
  ["Workspace", "contains", "Object Collection"], ["Workspace", "references", "Timeline"],
  ["Workspace", "references", "Advisor"], ["Workspace", "references", "Scene"],
  ["Workspace", "references", "Navigation"], ["Workspace", "uses", "Layout"],
  ["Workspace", "exposes", "Action Surface"], ["Workspace", "is governed by", "Permissions"],
  ["Workspace", "follows", "Configuration"], ["Workspace", "supports", "Capabilities"],
  ["Workspace", "owns", "Responsibilities"], ["Workspace", "enforces", "Boundaries"],
  ["Workspace", "participates in", "Lifecycle"], ["Workspace", "contains", "Sessions"],
  ["Workspace", "may transition to", "Workspace"], ["Workspace", "may compose", "Workspace Views"],
  ["Workspace", "may inherit", "Approved Shared Configuration"],
  ["Workspace", "may reference", "Related Executive Objects"],
] as const);

export const WorkspaceRelationshipModels = Object.freeze(relationships.map(
  ([sourceKind, relation, targetKind], index) => Object.freeze({
    id: `WS-1:3/Relationship/${String(index + 1).padStart(2, "0")}`,
    name: `${sourceKind} ${relation} ${targetKind}`, source: WorkspaceRegistry,
    sourceKind, relation, targetKind, metadataOnly: true, immutable: true,
  }),
) satisfies readonly WorkspaceRelationshipDescriptor[]);

