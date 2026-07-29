/**
 * EX-1:3 — Executive Stage Model.
 *
 * Canonical immutable structural model of the Executive Stage.
 * Consumes EX-1:2 Registry public surface only.
 * Structure only — no rendering, animation, interactions, or Runtime mutation.
 *
 * Ownership: owned exclusively by EX-1:3.
 *
 * Public exports:
 *   ExecutiveStageModelId
 *   ExecutiveStageModelVersion
 *   ExecutiveStageModelName
 *   ExecutiveStageModelNamespace
 *   ExecutiveStageModelStatus
 *   ExecutiveStageModelReadiness
 *   ExecutiveStageModel
 *   getExecutiveStageModelSummary()
 */

import { ExecutiveStageInteractionModel } from "./executiveStageInteractionModel.ts";
import {
  ExecutiveStageCanonicalLayers,
  ExecutiveStageLayerModel,
  ExecutiveStageLayerOrder,
} from "./executiveStageLayerModel.ts";
import { ExecutiveStageObjectModel } from "./executiveStageObjectModel.ts";
import { ExecutiveStageRegistry } from "./executiveStageRegistry.ts";
import { ExecutiveStageRelationshipModel } from "./executiveStageRelationshipModel.ts";
import {
  ExecutiveStageModelExtensionStrategy,
  ExecutiveStageModelPrinciples,
  ExecutiveStageModelProhibitedSurfaces,
  ExecutiveStageOwnershipEdges,
  ExecutiveStageOwnershipHierarchy,
  ExecutiveStageRuntimeBindingTypes,
  ExecutiveStageRuntimeReferenceRules,
  ExecutiveStageStructuralInvariants,
} from "./executiveStageRuntimeBindings.ts";
import { ExecutiveStageSurfaceModel } from "./executiveStageSurfaceModel.ts";

/** Shared entity field declaration — structure only. */
export interface ExecutiveStageEntityField {
  readonly fieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: boolean;
  readonly isReference: boolean;
  readonly order: number;
  readonly mutable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Shared entity model declaration. */
export interface ExecutiveStageEntityModel {
  readonly entityId: string;
  readonly entityName: string;
  readonly description: string;
  readonly root: boolean;
  readonly fields: readonly ExecutiveStageEntityField[];
  readonly fieldCount: number;
  readonly stableIdentity: true;
  readonly ownsBusinessState: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const field = (
  entityName: string,
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
): ExecutiveStageEntityField =>
  Object.freeze({
    fieldId: `EX-1:3/${entityName}/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const entity = (
  entityName: string,
  description: string,
  fields: readonly ExecutiveStageEntityField[],
  order: number,
  root = false,
): ExecutiveStageEntityModel =>
  Object.freeze({
    entityId: `EX-1:3/Entity/${entityName}`,
    entityName,
    description,
    root,
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    stableIdentity: true as const,
    ownsBusinessState: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical model identity. */
export const ExecutiveStageModelId = "EX-1:3/ExecutiveStageModel" as const;

export const ExecutiveStageModelName = "Executive Stage Model" as const;

export const ExecutiveStageModelVersion = "1.0.0" as const;

export const ExecutiveStageModelNamespace =
  "nexora.ex.executive.stage.model" as const;

export const ExecutiveStageModelStatus = "Model" as const;

export const ExecutiveStageModelReadiness = "ReadyForValidation" as const;

export const ExecutiveStageModelNextPhase =
  "EX-1:4 — Executive Stage Validation" as const;

export const ExecutiveStageModelIdentity = Object.freeze({
  id: ExecutiveStageModelId,
  name: ExecutiveStageModelName,
  phaseId: "EX-1:3" as const,
  version: ExecutiveStageModelVersion,
  namespace: ExecutiveStageModelNamespace,
  status: ExecutiveStageModelStatus,
  readiness: ExecutiveStageModelReadiness,
  layer: "Executive Experience" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Stage" as const,
  canonical: true as const,
  mutable: false as const,
  sourceRegistry: "EX-1:2/ExecutiveStageRegistry" as const,
  upstream: "EX-1:2 — Executive Stage Registry" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveStageModelNextPhase,
  description:
    "Canonical immutable structural model of the Executive Stage. Defines organisation, entity relationships, and Runtime consumption without rendering, animation, interactions, business logic, or Runtime state transitions.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Identity entity — companion first-level entity. */
export const ExecutiveStageIdentityModel = entity(
  "Identity",
  "Immutable Stage identity structure.",
  Object.freeze([
    field("Identity", "stageId", "Stable Executive Stage identity.", 1),
    field("Identity", "version", "Stage identity version.", 2),
    field("Identity", "namespace", "Stage identity namespace.", 3),
  ]),
  1,
);

/** Focus entity — only one active focus exists. */
export const ExecutiveStageFocusModel = entity(
  "StageFocus",
  "Executive attention focus structure. Only one active focus exists.",
  Object.freeze([
    field("StageFocus", "identity", "Focus identity.", 1),
    field("StageFocus", "focusType", "Registered focus type.", 2),
    field(
      "StageFocus",
      "targetReference",
      "Focus target identity reference.",
      3,
      true,
      true,
    ),
    field("StageFocus", "focusState", "Focus state structure.", 4),
    field(
      "StageFocus",
      "runtimeFocusId",
      "Immutable Runtime Focus ID binding.",
      5,
      true,
      true,
    ),
    field("StageFocus", "timestamp", "Focus timestamp metadata.", 6),
  ]),
  6,
);

/** Overlay entity — non-business visual layers. */
export const ExecutiveStageOverlayModel = entity(
  "StageOverlay",
  "Non-business overlay structure (loading, diagnostics).",
  Object.freeze([
    field("StageOverlay", "identity", "Overlay identity.", 1),
    field("StageOverlay", "overlayType", "Registered overlay type.", 2),
    field("StageOverlay", "priority", "Overlay priority structure.", 3),
    field("StageOverlay", "visibility", "Overlay visibility structure.", 4),
  ]),
  8,
);

/** Viewport entity — visible Stage area. */
export const ExecutiveStageViewportModel = entity(
  "Viewport",
  "Visible Stage area structure. Responsive behaviour is introduced later.",
  Object.freeze([
    field("Viewport", "identity", "Viewport identity.", 1),
    field("Viewport", "width", "Viewport width structure.", 2),
    field("Viewport", "height", "Viewport height structure.", 3),
    field("Viewport", "scale", "Viewport scale structure.", 4),
    field("Viewport", "safeArea", "Safe area structure.", 5),
    field("Viewport", "metadata", "Viewport metadata structure.", 6, false),
  ]),
  9,
);

/** Metadata entity — immutable Stage metadata. */
export const ExecutiveStageMetadataModel = entity(
  "Metadata",
  "Immutable Stage metadata structure.",
  Object.freeze([
    field("Metadata", "identity", "Metadata identity.", 1),
    field("Metadata", "version", "Metadata version.", 2),
    field("Metadata", "created", "Created timestamp metadata.", 3),
    field("Metadata", "updated", "Updated timestamp metadata.", 4),
    field("Metadata", "source", "Metadata source reference.", 5, true, true),
    field(
      "Metadata",
      "runtimeVersion",
      "Runtime version metadata reference.",
      6,
      true,
      true,
    ),
  ]),
  10,
);

/**
 * Root ExecutiveStage entity.
 * Every visual entity belongs to this root.
 */
export const ExecutiveStageRootModel = entity(
  "ExecutiveStage",
  "Root Executive Stage structural entity. Runtime projection only.",
  Object.freeze([
    field("ExecutiveStage", "identity", "Stage identity structure.", 1),
    field("ExecutiveStage", "surface", "Stage surface structure.", 2),
    field("ExecutiveStage", "layers", "Canonical layer structures.", 3),
    field("ExecutiveStage", "objects", "Stage object structures.", 4),
    field(
      "ExecutiveStage",
      "relationships",
      "Stage relationship structures.",
      5,
    ),
    field("ExecutiveStage", "focus", "Stage focus structure.", 6),
    field("ExecutiveStage", "interaction", "Stage interaction structure.", 7),
    field("ExecutiveStage", "overlay", "Stage overlay structure.", 8),
    field("ExecutiveStage", "viewport", "Stage viewport structure.", 9),
    field("ExecutiveStage", "metadata", "Stage metadata structure.", 10),
  ]),
  0,
  true,
);

/** First-level entity names under the Stage root. */
export const ExecutiveStageFirstLevelEntities = Object.freeze([
  "Identity",
  "Surface",
  "Layers",
  "Objects",
  "Relationships",
  "Focus",
  "Interaction",
  "Overlay",
  "Viewport",
  "Metadata",
] as const);

/** All entity models including dedicated deliverable entities. */
const entityModels = Object.freeze([
  ExecutiveStageRootModel,
  ExecutiveStageIdentityModel,
  ExecutiveStageSurfaceModel,
  ExecutiveStageLayerModel,
  ExecutiveStageObjectModel,
  ExecutiveStageRelationshipModel,
  ExecutiveStageFocusModel,
  ExecutiveStageInteractionModel,
  ExecutiveStageOverlayModel,
  ExecutiveStageViewportModel,
  ExecutiveStageMetadataModel,
] as const);

/**
 * Canonical immutable Executive Stage Model aggregate.
 */
export const ExecutiveStageModel = Object.freeze({
  identity: ExecutiveStageModelIdentity,
  registry: ExecutiveStageRegistry,
  root: ExecutiveStageRootModel,
  firstLevelEntities: ExecutiveStageFirstLevelEntities,
  entities: entityModels,
  surface: ExecutiveStageSurfaceModel,
  layers: ExecutiveStageLayerModel,
  layerOrder: ExecutiveStageLayerOrder,
  canonicalLayers: ExecutiveStageCanonicalLayers,
  objects: ExecutiveStageObjectModel,
  relationships: ExecutiveStageRelationshipModel,
  focus: ExecutiveStageFocusModel,
  interaction: ExecutiveStageInteractionModel,
  overlay: ExecutiveStageOverlayModel,
  viewport: ExecutiveStageViewportModel,
  metadata: ExecutiveStageMetadataModel,
  stageIdentity: ExecutiveStageIdentityModel,
  runtimeBindings: ExecutiveStageRuntimeBindingTypes,
  referenceRules: ExecutiveStageRuntimeReferenceRules,
  ownership: ExecutiveStageOwnershipHierarchy,
  ownershipEdges: ExecutiveStageOwnershipEdges,
  invariants: ExecutiveStageStructuralInvariants,
  principles: ExecutiveStageModelPrinciples,
  extensionStrategy: ExecutiveStageModelExtensionStrategy,
  prohibitedSurfaces: ExecutiveStageModelProhibitedSurfaces,
  baselines: Object.freeze({
    rootStageModels: 1 as const,
    firstLevelEntities: ExecutiveStageFirstLevelEntities.length,
    canonicalLayers: ExecutiveStageCanonicalLayers.length,
    runtimeBindingTypes: ExecutiveStageRuntimeBindingTypes.length,
    structuralInvariants: ExecutiveStageStructuralInvariants.length,
    ownershipLevels: ExecutiveStageOwnershipHierarchy.ownershipLevels,
  }),
  statistics: Object.freeze({
    entityCount: entityModels.length,
    firstLevelEntityCount: ExecutiveStageFirstLevelEntities.length,
    canonicalLayerCount: ExecutiveStageCanonicalLayers.length,
    runtimeBindingCount: ExecutiveStageRuntimeBindingTypes.length,
    invariantCount: ExecutiveStageStructuralInvariants.length,
    ownershipChildCount: ExecutiveStageOwnershipHierarchy.ownedByRoot.length,
    ownershipLevelCount: ExecutiveStageOwnershipHierarchy.ownershipLevels,
    principleCount: ExecutiveStageModelPrinciples.length,
  }),
  status: ExecutiveStageModelStatus,
  readiness: ExecutiveStageModelReadiness,
  nextPhase: ExecutiveStageModelNextPhase,
  ownsBusinessState: false as const,
  ownsRuntimeState: false as const,
  rendersUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** Model summary for inspection. */
export const getExecutiveStageModelSummary = () =>
  Object.freeze({
    id: ExecutiveStageModelId,
    name: ExecutiveStageModelName,
    version: ExecutiveStageModelVersion,
    namespace: ExecutiveStageModelNamespace,
    status: ExecutiveStageModelStatus,
    readiness: ExecutiveStageModelReadiness,
    root: ExecutiveStageRootModel.entityName,
    firstLevelEntityCount: ExecutiveStageFirstLevelEntities.length,
    baselines: ExecutiveStageModel.baselines,
    layerOrder: ExecutiveStageCanonicalLayers,
    nextPhase: ExecutiveStageModelNextPhase,
    ownsBusinessState: false as const,
    ownsRuntimeState: false as const,
    rendersUi: false as const,
  });

/** Resolve the canonical model aggregate. */
export const getExecutiveStageModel = () => ExecutiveStageModel;
