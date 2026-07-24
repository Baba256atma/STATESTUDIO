/** WS-7:3 — Deterministically derived Decision model inventory. */
import { DecisionWorkspaceV7CompositionModels } from "./decisionWorkspaceV7CompositionModels.ts";
import { DecisionWorkspaceV7DomainModels } from "./decisionWorkspaceV7DomainModels.ts";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";
import { DecisionWorkspaceV7RelationshipModels } from "./decisionWorkspaceV7RelationshipModels.ts";
import { DecisionWorkspaceV7RepresentationModel } from "./decisionWorkspaceV7RepresentationModel.ts";

export const DecisionWorkspaceV7ModelRegistry = Object.freeze({
  domainModels: DecisionWorkspaceV7DomainModels,
  relationshipModels: DecisionWorkspaceV7RelationshipModels,
  compositionModels: DecisionWorkspaceV7CompositionModels,
  representationModel: DecisionWorkspaceV7RepresentationModel,
  sourceRegistry: DecisionWorkspaceV7Registry,
  domainModelCount: DecisionWorkspaceV7DomainModels.length,
  relationshipModelCount: DecisionWorkspaceV7RelationshipModels.length,
  compositionModelCount: DecisionWorkspaceV7CompositionModels.length,
  representationFieldCount:
    DecisionWorkspaceV7RepresentationModel.fields.length,
  totalModelCount:
    DecisionWorkspaceV7DomainModels.length
    + DecisionWorkspaceV7RelationshipModels.length
    + DecisionWorkspaceV7CompositionModels.length
    + 1,
  deterministic: true,
  metadataOnly: true,
  immutable: true,
} as const);
