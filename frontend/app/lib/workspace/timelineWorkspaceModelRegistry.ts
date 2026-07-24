/** WS-10:3 — Immutable inventory of canonical Timeline Workspace models. */
import { TimelineWorkspaceCompositionModels } from "./timelineWorkspaceCompositionModels.ts";
import { TimelineWorkspaceDomainModels } from "./timelineWorkspaceDomainModels.ts";
import { TimelineWorkspaceRelationshipModels } from "./timelineWorkspaceRelationshipModels.ts";
import { TimelineWorkspaceRepresentationModel } from "./timelineWorkspaceRepresentationModel.ts";

export const TimelineWorkspaceModelRegistry = Object.freeze({
  domainModels: TimelineWorkspaceDomainModels,
  relationshipModels: TimelineWorkspaceRelationshipModels,
  compositionModels: TimelineWorkspaceCompositionModels,
  representationModel: TimelineWorkspaceRepresentationModel,
  domainModelCount: TimelineWorkspaceDomainModels.length,
  relationshipModelCount: TimelineWorkspaceRelationshipModels.length,
  compositionModelCount: TimelineWorkspaceCompositionModels.length,
  representationModelCount: 1,
  totalModelCount:
    TimelineWorkspaceDomainModels.length
    + TimelineWorkspaceRelationshipModels.length
    + TimelineWorkspaceCompositionModels.length
    + 1,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} as const);
