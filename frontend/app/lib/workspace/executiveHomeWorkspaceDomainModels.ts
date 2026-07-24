/** WS-2:3 — Canonical domain models sourced through Registry. */
import type { ExecutiveHomeModelDescriptor } from "./executiveHomeWorkspaceModelTypes.ts";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";

const names = Object.freeze([
  "Executive Home Workspace", "Executive Home Identity", "Executive Home Metadata",
  "Executive Home Category", "Executive Home Context", "Executive Home Overview",
  "Executive Summary Reference", "Dashboard Reference", "Workspace Launcher",
  "Quick Action Surface", "Executive Card Collection", "Executive Card",
  "Recent Activity Reference", "Notification Reference", "Recommendation Reference",
  "Favorite Workspace Reference", "Executive Status", "Layout Reference",
  "Navigation Reference", "Session Reference", "Permission Reference", "Configuration",
  "Capability", "Responsibility", "Boundary", "Lifecycle",
] as const);

export const ExecutiveHomeWorkspaceDomainModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
  name, source: ExecutiveHomeWorkspaceRegistry,
  metadataOnly: true, immutable: true,
})) satisfies readonly ExecutiveHomeModelDescriptor[]);

