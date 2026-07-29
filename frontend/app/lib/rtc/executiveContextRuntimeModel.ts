/**
 * RTC-1:3 — Executive Context Runtime Model.
 *
 * Canonical immutable data model for the Executive Context Runtime.
 * Consumes RTC-1:2 Registry public surface only.
 * Structure only — no validation, behaviour, persistence, or UI.
 *
 * Ownership: owned exclusively by RTC-1:3.
 *
 * Public exports:
 *   ExecutiveContextRuntimeModelId
 *   ExecutiveContextRuntimeModelVersion
 *   ExecutiveContextRuntimeModelName
 *   ExecutiveContextRuntimeModelNamespace
 *   ExecutiveContextRuntimeModelStatus
 *   ExecutiveContextRuntimeModelReadiness
 *   ExecutiveContextRuntimeModel
 *   getExecutiveContextRuntimeModelSummary()
 */

import {
  ExecutiveAdvisorModel,
  ExecutiveCompanyModel,
  ExecutiveContextEntityNames,
  ExecutiveContextFirstLevelEntities,
  ExecutiveContextModel,
  ExecutiveContextTypes,
  ExecutiveDirectorModel,
  ExecutiveFocusModel,
  ExecutiveIdentityModel,
  ExecutiveJournalModel,
  ExecutiveLifecycleModel,
  ExecutiveManagerModel,
  ExecutiveMetadataModel,
} from "./executiveContextModel.ts";
import { ExecutiveContextRuntimeRegistry } from "./executiveContextRuntimeRegistry.ts";
import { ExecutivePackModel } from "./executivePackModel.ts";
import {
  ExecutiveRuntimeInvariants,
  ExecutiveRuntimeModelExtensionStrategy,
  ExecutiveRuntimeModelPrinciples,
  ExecutiveRuntimeModelProhibitedSurfaces,
  ExecutiveRuntimeOwnershipHierarchy,
  ExecutiveRuntimeReferenceRules,
  ExecutiveRuntimeRelationshipCatalog,
  ExecutiveRuntimeRelationships,
} from "./executiveRuntimeRelationships.ts";
import { ExecutiveStageModel } from "./executiveStageModel.ts";
import { ExecutiveTimelineModel } from "./executiveTimelineModel.ts";
import { ExecutiveWorkspaceModel } from "./executiveWorkspaceModel.ts";

/** Canonical model identity. */
export const ExecutiveContextRuntimeModelId =
  "RTC-1:3/ExecutiveContextRuntimeModel" as const;

export const ExecutiveContextRuntimeModelName =
  "Executive Context Runtime Model" as const;

export const ExecutiveContextRuntimeModelVersion = "1.0.0" as const;

export const ExecutiveContextRuntimeModelNamespace =
  "nexora.rtc.executive.context.model" as const;

export const ExecutiveContextRuntimeModelStatus = "Model" as const;

export const ExecutiveContextRuntimeModelReadiness =
  "ReadyForValidation" as const;

export const ExecutiveContextRuntimeModelNextPhase =
  "RTC-1:4 — Executive Context Runtime Validation" as const;

export const ExecutiveContextRuntimeModelIdentity = Object.freeze({
  id: ExecutiveContextRuntimeModelId,
  name: ExecutiveContextRuntimeModelName,
  phaseId: "RTC-1:3" as const,
  version: ExecutiveContextRuntimeModelVersion,
  namespace: ExecutiveContextRuntimeModelNamespace,
  status: ExecutiveContextRuntimeModelStatus,
  stage: ExecutiveContextRuntimeModelReadiness,
  readiness: ExecutiveContextRuntimeModelReadiness,
  layer: "Runtime Layer" as const,
  architecture: "NPA-T vNext" as const,
  domain: "Executive Context Runtime" as const,
  canonical: true as const,
  mutable: false as const,
  sourceRegistry: "RTC-1:2/ExecutiveContextRuntimeRegistry" as const,
  upstream: "RTC-1:2 — Executive Context Runtime Registry" as const,
  target: "Nexora Executive Experience MVP" as const,
  nextPhase: ExecutiveContextRuntimeModelNextPhase,
  description:
    "Canonical immutable data model for the Executive Context Runtime. Defines entities, relationships, ownership, state boundaries, and lifecycle references without behaviour, validation, persistence, or UI.",
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

/** All entity models including dedicated deliverable entities. */
const entityModels = Object.freeze([
  ExecutiveContextModel,
  ExecutiveIdentityModel,
  ExecutiveLifecycleModel,
  ExecutiveManagerModel,
  ExecutiveCompanyModel,
  ExecutiveWorkspaceModel,
  ExecutivePackModel,
  ExecutiveFocusModel,
  ExecutiveTimelineModel,
  ExecutiveJournalModel,
  ExecutiveStageModel,
  ExecutiveAdvisorModel,
  ExecutiveDirectorModel,
  ExecutiveMetadataModel,
] as const);

/**
 * Canonical immutable Executive Context Runtime Model aggregate.
 */
export const ExecutiveContextRuntimeModel = Object.freeze({
  identity: ExecutiveContextRuntimeModelIdentity,
  registry: ExecutiveContextRuntimeRegistry,
  root: ExecutiveContextModel,
  contextTypes: ExecutiveContextTypes,
  entityNames: ExecutiveContextEntityNames,
  entities: entityModels,
  firstLevelEntities: ExecutiveContextFirstLevelEntities,
  workspace: ExecutiveWorkspaceModel,
  pack: ExecutivePackModel,
  timeline: ExecutiveTimelineModel,
  stage: ExecutiveStageModel,
  focus: ExecutiveFocusModel,
  journal: ExecutiveJournalModel,
  advisor: ExecutiveAdvisorModel,
  director: ExecutiveDirectorModel,
  ownership: ExecutiveRuntimeOwnershipHierarchy,
  relationships: ExecutiveRuntimeRelationships,
  relationshipCatalog: ExecutiveRuntimeRelationshipCatalog,
  referenceRules: ExecutiveRuntimeReferenceRules,
  invariants: ExecutiveRuntimeInvariants,
  principles: ExecutiveRuntimeModelPrinciples,
  extensionStrategy: ExecutiveRuntimeModelExtensionStrategy,
  prohibitedSurfaces: ExecutiveRuntimeModelProhibitedSurfaces,
  statistics: Object.freeze({
    entityCount: entityModels.length,
    firstLevelEntityCount: ExecutiveContextEntityNames.length,
    contextTypeCount: ExecutiveContextTypes.length,
    relationshipCount: ExecutiveRuntimeRelationships.length,
    ownershipChildCount: ExecutiveRuntimeOwnershipHierarchy.ownedByRoot.length,
    invariantCount: ExecutiveRuntimeInvariants.length,
    referenceRuleCount: ExecutiveRuntimeReferenceRules.length,
    principleCount: ExecutiveRuntimeModelPrinciples.length,
    rootFieldCount: ExecutiveContextModel.fieldCount,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:2 — Executive Context Runtime Registry",
  ]),
  status: ExecutiveContextRuntimeModelStatus,
  readiness: ExecutiveContextRuntimeModelReadiness,
  nextPhase: ExecutiveContextRuntimeModelNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  storesRuntimeValues: false as const,
  executesTransitions: false as const,
  performsValidation: false as const,
  mutatesRuntimeState: false as const,
  renderingBehavior: false as const,
  calculatesMetrics: false as const,
  invokesAi: false as const,
  accessesDatabases: false as const,
  managesPersistence: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  validationPhase: false as const,
  manifestPhase: false as const,
  platformPhase: false as const,
} as const);

/** Deterministic frozen Model summary. */
export function getExecutiveContextRuntimeModelSummary() {
  return Object.freeze({
    modelId: ExecutiveContextRuntimeModelId,
    version: ExecutiveContextRuntimeModelVersion,
    name: ExecutiveContextRuntimeModelName,
    namespace: ExecutiveContextRuntimeModelNamespace,
    status: ExecutiveContextRuntimeModelStatus,
    readiness: ExecutiveContextRuntimeModelReadiness,
    rootEntity: ExecutiveContextModel.entityName,
    entityCount: entityModels.length,
    firstLevelEntityCount: ExecutiveContextEntityNames.length,
    contextTypeCount: ExecutiveContextTypes.length,
    relationshipCount: ExecutiveRuntimeRelationships.length,
    invariantCount: ExecutiveRuntimeInvariants.length,
    nextPhase: ExecutiveContextRuntimeModelNextPhase,
    sourceRegistry: ExecutiveContextRuntimeModelIdentity.sourceRegistry,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeModel = () =>
  ExecutiveContextRuntimeModel;
