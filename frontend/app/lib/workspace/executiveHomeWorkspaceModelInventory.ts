/** WS-2:3 — Dynamically derived Model inventory. */
import { ExecutiveHomeWorkspaceCompositionModels } from "./executiveHomeWorkspaceCompositionModels.ts";
import { ExecutiveHomeWorkspaceDomainModels } from "./executiveHomeWorkspaceDomainModels.ts";
import { ExecutiveHomeWorkspaceLifecycleModels } from "./executiveHomeWorkspaceLifecycleModels.ts";
import { ExecutiveHomeWorkspaceRegistry } from "./executiveHomeWorkspaceRegistry.ts";
import { ExecutiveHomeWorkspaceRelationshipModels } from "./executiveHomeWorkspaceRelationshipModels.ts";

export const ExecutiveHomeWorkspaceModelInventory = Object.freeze({
  domainModels: ExecutiveHomeWorkspaceDomainModels,
  relationships: ExecutiveHomeWorkspaceRelationshipModels,
  compositions: ExecutiveHomeWorkspaceCompositionModels,
  lifecycleModels: ExecutiveHomeWorkspaceLifecycleModels,
  categoryReferences: ExecutiveHomeWorkspaceRegistry.categories,
  registrySource: ExecutiveHomeWorkspaceRegistry,
  domainModelCount: ExecutiveHomeWorkspaceDomainModels.length,
  relationshipCount: ExecutiveHomeWorkspaceRelationshipModels.length,
  compositionCount: ExecutiveHomeWorkspaceCompositionModels.length,
  lifecycleModelCount: ExecutiveHomeWorkspaceLifecycleModels.length,
  categoryReferenceCount: ExecutiveHomeWorkspaceRegistry.categories.length,
  totalModelCount: ExecutiveHomeWorkspaceDomainModels.length
    + ExecutiveHomeWorkspaceRelationshipModels.length
    + ExecutiveHomeWorkspaceCompositionModels.length
    + ExecutiveHomeWorkspaceLifecycleModels.length,
  derived: true, deterministic: true, immutable: true,
} as const);

