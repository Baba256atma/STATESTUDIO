/** WS-1:3 — Declarative composition structures without visual behavior. */
import { WorkspaceRegistry } from "./workspaceRegistry.ts";
import type { WorkspaceCompositionDescriptor } from "./workspaceModelTypes.ts";

const names = Object.freeze([
  "Workspace Aggregate Composition", "Workspace View Composition",
  "Workspace Object Composition", "Workspace Panel Composition",
  "Workspace Toolbar Composition", "Workspace Scene Composition Reference",
  "Workspace Timeline Composition Reference", "Workspace Action Composition",
  "Workspace Navigation Composition", "Workspace Context Composition",
] as const);

export const WorkspaceCompositionModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:3/Composition/${String(index + 1).padStart(2, "0")}`,
  name, source: WorkspaceRegistry, members: Object.freeze([]), rendering: false,
  metadataOnly: true, immutable: true,
})) satisfies readonly WorkspaceCompositionDescriptor[]);

