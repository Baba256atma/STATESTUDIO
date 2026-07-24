/** WS-2:3 — Declarative compositions without rendering or UI layout. */
import type { ExecutiveHomeCompositionDescriptor } from "./executiveHomeWorkspaceModelTypes.ts";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";
const names = Object.freeze(["Executive Home Aggregate", "Executive Overview Composition",
  "Executive Dashboard Composition", "Executive Card Composition",
  "Executive Card Collection Composition", "Workspace Launcher Composition",
  "Quick Action Composition", "Notification Composition", "Recommendation Composition",
  "Favorite Workspace Composition", "Layout Composition", "Navigation Composition"] as const);
export const ExecutiveHomeWorkspaceCompositionModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:3/Composition/${String(index + 1).padStart(2, "0")}`,
  name, source: ExecutiveHomeWorkspaceRegistry, members: Object.freeze([]),
  rendering: false, uiLayout: false, metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeCompositionDescriptor[]);

