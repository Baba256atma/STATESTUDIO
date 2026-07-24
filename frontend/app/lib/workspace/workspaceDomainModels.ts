/** WS-1:3 — Canonical domain model kinds sourced through Registry. */
import { WorkspaceRegistry } from "./workspaceRegistry.ts";
import type { WorkspaceModelDescriptor } from "./workspaceModelTypes.ts";

const names = Object.freeze([
  "Workspace", "Workspace Identity", "Workspace Metadata", "Workspace Type",
  "Workspace Context", "Workspace Objective", "Workspace Scope", "Workspace Session",
  "Workspace State Reference", "Workspace Object", "Workspace Object Collection",
  "Workspace Timeline Reference", "Workspace Advisor Reference", "Workspace Scene Reference",
  "Workspace Navigation Reference", "Workspace Layout", "Workspace View", "Workspace Action",
  "Workspace Action Surface", "Workspace Permission", "Workspace Configuration",
  "Workspace Capability", "Workspace Responsibility", "Workspace Boundary",
  "Workspace Lifecycle", "Workspace Collaboration Reference",
] as const);

export const WorkspaceDomainModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
  name, source: WorkspaceRegistry, metadataOnly: true, immutable: true,
})) satisfies readonly WorkspaceModelDescriptor[]);

