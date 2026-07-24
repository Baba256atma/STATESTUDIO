/** WS-2:3 — Declarative Executive Home relationships. */
import type { ExecutiveHomeRelationshipDescriptor } from "./executiveHomeWorkspaceModelTypes.ts";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";

const definitions = Object.freeze([
  ["Executive Home", "has", "Identity"], ["Executive Home", "has", "Metadata"],
  ["Executive Home", "belongs to", "Category"], ["Executive Home", "owns", "Executive Overview"],
  ["Executive Home", "references", "Executive Summary"],
  ["Executive Home", "references", "Dashboard"],
  ["Executive Home", "exposes", "Workspace Launcher"],
  ["Executive Home", "exposes", "Quick Actions"],
  ["Executive Home", "contains", "Executive Cards"],
  ["Executive Home", "references", "Recent Activity"],
  ["Executive Home", "references", "Notifications"],
  ["Executive Home", "references", "Recommendations"],
  ["Executive Home", "references", "Favorite Workspaces"],
  ["Executive Home", "exposes", "Executive Status"],
  ["Executive Home", "references", "Context"], ["Executive Home", "references", "Layout"],
  ["Executive Home", "references", "Navigation"], ["Executive Home", "references", "Session"],
  ["Executive Home", "references", "Permissions"],
  ["Executive Home", "references", "Configuration"],
  ["Executive Home", "supports", "Capabilities"],
  ["Executive Home", "owns", "Responsibilities"],
  ["Executive Home", "enforces", "Boundaries"],
  ["Executive Home", "participates in", "Lifecycle"],
] as const);

export const ExecutiveHomeWorkspaceRelationshipModels = Object.freeze(definitions.map(
  ([sourceKind, relation, targetKind], index) => Object.freeze({
    id: `WS-2:3/Relationship/${String(index + 1).padStart(2, "0")}`,
    name: `${sourceKind} ${relation} ${targetKind}`, source: ExecutiveHomeWorkspaceRegistry,
    sourceKind, relation, targetKind, metadataOnly: true, immutable: true,
  }),
) satisfies readonly ExecutiveHomeRelationshipDescriptor[]);

