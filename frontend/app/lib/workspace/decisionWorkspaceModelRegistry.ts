/** WS-4:3 — Dynamically derived model inventory and source registry. */
import { DecisionWorkspaceCompositionModels } from "./decisionWorkspaceCompositionModels.ts";
import { DecisionWorkspaceDomainModels } from "./decisionWorkspaceDomainModels.ts";
import { DecisionWorkspaceMetadataModels } from "./decisionWorkspaceMetadataModels.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";
import { DecisionWorkspaceRelationshipModels } from "./decisionWorkspaceRelationshipModels.ts";

export const DecisionWorkspaceModelRegistry = Object.freeze({
  domainModels: DecisionWorkspaceDomainModels,
  relationshipModels: DecisionWorkspaceRelationshipModels,
  compositionModels: DecisionWorkspaceCompositionModels,
  metadataModels: DecisionWorkspaceMetadataModels,
  sourceRegistry: DecisionWorkspaceRegistry,
  domainModelCount: DecisionWorkspaceDomainModels.length,
  relationshipModelCount: DecisionWorkspaceRelationshipModels.length,
  compositionModelCount: DecisionWorkspaceCompositionModels.length,
  metadataModelCount: DecisionWorkspaceMetadataModels.length,
  totalModelCount:
    DecisionWorkspaceDomainModels.length
    + DecisionWorkspaceRelationshipModels.length
    + DecisionWorkspaceCompositionModels.length
    + DecisionWorkspaceMetadataModels.length,
  deterministic: true,
  immutable: true,
} as const);
