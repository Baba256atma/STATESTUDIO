/** WS-2:3 — Canonical Executive Home Model surface for Validation. */
import { ExecutiveHomeWorkspaceCompositionModels } from "./executiveHomeWorkspaceCompositionModels.ts";
import { ExecutiveHomeWorkspaceDomainModels } from "./executiveHomeWorkspaceDomainModels.ts";
import { ExecutiveHomeWorkspaceLifecycleModels } from "./executiveHomeWorkspaceLifecycleModels.ts";
import { ExecutiveHomeWorkspaceModelInventory } from "./executiveHomeWorkspaceModelInventory.ts";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";
import { ExecutiveHomeWorkspaceRelationshipModels } from "./executiveHomeWorkspaceRelationshipModels.ts";

export const ExecutiveHomeWorkspaceModel = Object.freeze({
  identity: Object.freeze({
    id: "WS-2:3/ExecutiveHomeWorkspaceModel", name: "Executive Home Workspace Model",
    layer: "Workspace", phase: "2:3", version: "1.0.0", status: "ReadyForValidation",
    namespace: "nexora.workspace.executive-home.model",
  }),
  registry: ExecutiveHomeWorkspaceRegistry,
  domainModels: ExecutiveHomeWorkspaceDomainModels,
  relationships: ExecutiveHomeWorkspaceRelationshipModels,
  compositions: ExecutiveHomeWorkspaceCompositionModels,
  lifecycleModels: ExecutiveHomeWorkspaceLifecycleModels,
  aggregate: Object.freeze({
    identity: "Executive Home Identity", metadata: "Executive Home Metadata",
    category: "Executive Home Category", executiveOverview: "Executive Home Overview",
    executiveSummary: "Executive Summary Reference", dashboard: "Dashboard Reference",
    workspaceLauncher: "Workspace Launcher", quickActions: "Quick Action Surface",
    executiveCards: "Executive Card Collection", recentActivity: "Recent Activity Reference",
    notifications: "Notification Reference", recommendations: "Recommendation Reference",
    favoriteWorkspaces: "Favorite Workspace Reference", executiveStatus: "Executive Status",
    context: "Executive Home Context", layout: "Layout Reference",
    navigation: "Navigation Reference", session: "Session Reference",
    permissions: "Permission Reference", configuration: "Configuration",
    capabilities: "Capability", responsibilities: "Responsibility",
    boundaries: "Boundary", lifecycle: "Lifecycle",
    metadataOnly: true, immutable: true,
  }),
  inventory: ExecutiveHomeWorkspaceModelInventory,
  readiness: "ReadyForValidation",
  nextPhase: "WS-2:4 — Executive Home Workspace Validation",
  upstreamDependencies: Object.freeze(["WS-2:2 Executive Home Workspace Registry"]),
  publicApiSurface: Object.freeze(["ExecutiveHomeWorkspaceModel"]),
  metadataOnly: true, immutable: true, deterministic: true,
  runtimeState: false, activeWorkspaceInstances: false, dashboardImplementation: false,
  widgets: false, ui: false, rendering: false, navigationRuntime: false,
  stateManagement: false, persistence: false, aiBehavior: false,
} as const);

