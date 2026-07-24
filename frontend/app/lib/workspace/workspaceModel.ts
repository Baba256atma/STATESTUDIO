/** WS-1:3 — Canonical Workspace Model surface for Validation. */
import { WorkspaceCompositionModels } from "./workspaceCompositionModels.ts";
import { WorkspaceDomainModels } from "./workspaceDomainModels.ts";
import { WorkspaceLifecycleModels } from "./workspaceLifecycleModels.ts";
import { WorkspaceModelInventory } from "./workspaceModelInventory.ts";
import { WorkspaceRegistry } from "./workspaceRegistry.ts";
import { WorkspaceRelationshipModels } from "./workspaceRelationshipModels.ts";

export const WorkspaceModel = Object.freeze({
  identity: Object.freeze({ id: "WS-1:3/WorkspaceModel", name: "Workspace Model",
    layer: "Workspace", phase: "1:3", version: "1.0.0", status: "ReadyForValidation",
    namespace: "nexora.workspace.model" }),
  registry: WorkspaceRegistry,
  domainModels: WorkspaceDomainModels,
  relationships: WorkspaceRelationshipModels,
  compositions: WorkspaceCompositionModels,
  lifecycleModels: WorkspaceLifecycleModels,
  aggregate: Object.freeze({
    identity: "Workspace Identity", metadata: "Workspace Metadata", type: "Workspace Type",
    objective: "Workspace Objective", context: "Workspace Context", scope: "Workspace Scope",
    configuration: "Workspace Configuration", lifecycleState: "Workspace Lifecycle",
    objectCollectionReference: "Workspace Object Collection",
    timelineReference: "Workspace Timeline Reference", advisorReference: "Workspace Advisor Reference",
    sceneReference: "Workspace Scene Reference", navigationReference: "Workspace Navigation Reference",
    layoutReference: "Workspace Layout", actionSurface: "Workspace Action Surface",
    permissionReferences: "Workspace Permission", capabilityReferences: "Workspace Capability",
    responsibilityReferences: "Workspace Responsibility", boundaryReferences: "Workspace Boundary",
    sessionReferences: "Workspace Session", metadataOnly: true, immutable: true,
  }),
  inventory: WorkspaceModelInventory,
  readiness: "ReadyForValidation",
  upstreamDependencies: Object.freeze(["WS-1:2 Workspace Registry"]),
  publicApiSurface: Object.freeze(["WorkspaceModel"]),
  metadataOnly: true, immutable: true, runtimeState: false, activeSessions: false,
  persistence: false, rendering: false, navigationExecution: false, orchestration: false,
} as const);
