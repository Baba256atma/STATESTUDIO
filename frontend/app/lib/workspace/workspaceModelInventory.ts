/** WS-1:3 — Dynamically derived model inventory. */
import { WorkspaceCompositionModels } from "./workspaceCompositionModels.ts";
import { WorkspaceDomainModels } from "./workspaceDomainModels.ts";
import { WorkspaceLifecycleModels } from "./workspaceLifecycleModels.ts";
import { WorkspaceRegistry } from "./workspaceRegistry.ts";
import { WorkspaceRelationshipModels } from "./workspaceRelationshipModels.ts";

export const WorkspaceModelInventory = Object.freeze({
  domainModels: WorkspaceDomainModels,
  relationships: WorkspaceRelationshipModels,
  compositions: WorkspaceCompositionModels,
  lifecycleModels: WorkspaceLifecycleModels,
  workspaceTypeReferences: WorkspaceRegistry.types,
  registrySource: WorkspaceRegistry,
  domainModelCount: WorkspaceDomainModels.length,
  relationshipCount: WorkspaceRelationshipModels.length,
  compositionCount: WorkspaceCompositionModels.length,
  lifecycleModelCount: WorkspaceLifecycleModels.length,
  totalCount: WorkspaceDomainModels.length + WorkspaceRelationshipModels.length
    + WorkspaceCompositionModels.length + WorkspaceLifecycleModels.length,
  deterministic: true,
  immutable: true,
} as const);

