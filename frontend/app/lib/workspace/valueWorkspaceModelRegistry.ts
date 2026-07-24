/** WS-9:3 — Immutable inventory of canonical Value Workspace models. */
import { ValueWorkspaceCompositionModels } from "./valueWorkspaceCompositionModels.ts";
import { ValueWorkspaceDomainModels } from "./valueWorkspaceDomainModels.ts";
import { ValueWorkspaceRelationshipModels } from "./valueWorkspaceRelationshipModels.ts";
import { ValueWorkspaceRepresentationModel } from "./valueWorkspaceRepresentationModel.ts";

export const ValueWorkspaceModelRegistry = Object.freeze({
  domainModels: ValueWorkspaceDomainModels,
  relationshipModels: ValueWorkspaceRelationshipModels,
  compositionModels: ValueWorkspaceCompositionModels,
  representationModel: ValueWorkspaceRepresentationModel,
  domainModelCount: ValueWorkspaceDomainModels.length,
  relationshipModelCount: ValueWorkspaceRelationshipModels.length,
  compositionModelCount: ValueWorkspaceCompositionModels.length,
  representationModelCount: 1,
  totalModelCount:
    ValueWorkspaceDomainModels.length
    + ValueWorkspaceRelationshipModels.length
    + ValueWorkspaceCompositionModels.length
    + 1,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} as const);
