/** WS-3:3 — Dynamically derived model inventory and source registry. */
import { GoalWorkspaceCompositionModels } from "./goalWorkspaceCompositionModels.ts";
import { GoalWorkspaceDomainModels } from "./goalWorkspaceDomainModels.ts";
import { GoalWorkspaceMetadataModels } from "./goalWorkspaceMetadataModels.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
import { GoalWorkspaceRelationshipModels } from "./goalWorkspaceRelationshipModels.ts";
export const GoalWorkspaceModelRegistry = Object.freeze({
  domainModels: GoalWorkspaceDomainModels,
  relationshipModels: GoalWorkspaceRelationshipModels,
  compositionModels: GoalWorkspaceCompositionModels,
  metadataModels: GoalWorkspaceMetadataModels,
  sourceRegistry: GoalWorkspaceRegistry,
  domainModelCount: GoalWorkspaceDomainModels.length,
  relationshipModelCount: GoalWorkspaceRelationshipModels.length,
  compositionModelCount: GoalWorkspaceCompositionModels.length,
  metadataModelCount: GoalWorkspaceMetadataModels.length,
  totalModelCount: GoalWorkspaceDomainModels.length + GoalWorkspaceRelationshipModels.length
    + GoalWorkspaceCompositionModels.length + GoalWorkspaceMetadataModels.length,
  deterministic: true, immutable: true,
} as const);

