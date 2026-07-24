/** WS-8:3 — Deterministically derived War Room model inventory. */
import { WarRoomWorkspaceCompositionModels } from "./warRoomWorkspaceCompositionModels.ts";
import { WarRoomWorkspaceDomainModels } from "./warRoomWorkspaceDomainModels.ts";
import { WarRoomWorkspaceRegistry } from "./warRoomWorkspaceRegistry.ts";
import { WarRoomWorkspaceRelationshipModels } from "./warRoomWorkspaceRelationshipModels.ts";
import { WarRoomWorkspaceRepresentationModel } from "./warRoomWorkspaceRepresentationModel.ts";

export const WarRoomWorkspaceModelRegistry = Object.freeze({
  domainModels: WarRoomWorkspaceDomainModels,
  relationshipModels: WarRoomWorkspaceRelationshipModels,
  compositionModels: WarRoomWorkspaceCompositionModels,
  representationModel: WarRoomWorkspaceRepresentationModel,
  sourceRegistry: WarRoomWorkspaceRegistry,
  domainModelCount: WarRoomWorkspaceDomainModels.length,
  relationshipModelCount: WarRoomWorkspaceRelationshipModels.length,
  compositionModelCount: WarRoomWorkspaceCompositionModels.length,
  representationFieldCount:
    WarRoomWorkspaceRepresentationModel.fields.length,
  totalModelCount:
    WarRoomWorkspaceDomainModels.length
    + WarRoomWorkspaceRelationshipModels.length
    + WarRoomWorkspaceCompositionModels.length
    + 1,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} as const);
