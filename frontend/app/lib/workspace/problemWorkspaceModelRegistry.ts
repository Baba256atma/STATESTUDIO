/** WS-6:3 — Dynamically derived Problem model inventory. */
import { ProblemWorkspaceCompositionModels } from "./problemWorkspaceCompositionModels.ts";
import { ProblemWorkspaceDomainModels } from "./problemWorkspaceDomainModels.ts";
import { ProblemWorkspaceRegistry } from "./problemWorkspaceRegistry.ts";
import { ProblemWorkspaceRelationshipModels } from "./problemWorkspaceRelationshipModels.ts";
import { ProblemWorkspaceRepresentationModel } from "./problemWorkspaceRepresentationModel.ts";

export const ProblemWorkspaceModelRegistry = Object.freeze({
  domainModels: ProblemWorkspaceDomainModels,
  relationshipModels: ProblemWorkspaceRelationshipModels,
  compositionModels: ProblemWorkspaceCompositionModels,
  representationModel: ProblemWorkspaceRepresentationModel,
  sourceRegistry: ProblemWorkspaceRegistry,
  domainModelCount: ProblemWorkspaceDomainModels.length,
  relationshipModelCount: ProblemWorkspaceRelationshipModels.length,
  compositionModelCount: ProblemWorkspaceCompositionModels.length,
  representationFieldCount:
    ProblemWorkspaceRepresentationModel.fields.length,
  totalModelCount:
    ProblemWorkspaceDomainModels.length
    + ProblemWorkspaceRelationshipModels.length
    + ProblemWorkspaceCompositionModels.length
    + 1,
  deterministic: true,
  immutable: true,
} as const);
