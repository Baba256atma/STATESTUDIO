/**
 * NEA-1:4 — Executive Gateway Validation.
 *
 * Canonical immutable declarative validation architecture for Executive Gateway.
 * Consumes only NEA-1:3 Executive Gateway Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-1:4.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayValidationId
 *   ExecutiveGatewayValidationVersion
 *   ExecutiveGatewayValidationName
 *   ExecutiveGatewayValidationNamespace
 *   ExecutiveGatewayValidationStatus
 *   ExecutiveGatewayValidationReadiness
 *   ExecutiveGatewayValidationPlatform
 *   getExecutiveGatewayValidationSummary()
 */

import {
  ExecutiveGatewayModelId,
  ExecutiveGatewayModelPlatform,
  ExecutiveGatewayModelVersion,
} from "./executiveGatewayModel.ts";
import { ExecutiveGatewayValidationMetadata } from "./executiveGatewayValidationMetadata.ts";
import {
  ExecutiveGatewayValidationBoundaries,
  ExecutiveGatewayValidationOwnership,
} from "./executiveGatewayValidationOwnership.ts";
import { ExecutiveGatewayValidationPolicyCatalog } from "./executiveGatewayValidationPolicies.ts";
import { ExecutiveGatewayValidationRelationshipCatalog } from "./executiveGatewayValidationRelationships.ts";
import { ExecutiveGatewayValidationRuleCatalog } from "./executiveGatewayValidationRules.ts";
import type {
  ExecutiveGatewayValidationIdentity,
  ExecutiveGatewayValidationSummary,
} from "./executiveGatewayValidationTypes.ts";

/** Canonical validation identity. */
export const ExecutiveGatewayValidationId =
  "NEA-1:4/ExecutiveGatewayValidation" as const;

/** Human-readable validation name. */
export const ExecutiveGatewayValidationName =
  "Executive Gateway Validation" as const;

/** Semantic version. */
export const ExecutiveGatewayValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayValidationNamespace =
  "nexora.nea.executive-gateway.validation" as const;

/** Validation status. */
export const ExecutiveGatewayValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayValidationReadiness =
  "ReadyForManifest" as const;

const identity: ExecutiveGatewayValidationIdentity = Object.freeze({
  validationId: ExecutiveGatewayValidationId,
  validationName: ExecutiveGatewayValidationName,
  validationVersion: ExecutiveGatewayValidationVersion,
  validationNamespace: ExecutiveGatewayValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-1:4" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayValidationStatus,
  readiness: ExecutiveGatewayValidationReadiness,
  modelId: ExecutiveGatewayModelId,
  modelVersion: ExecutiveGatewayModelVersion,
  description:
    "Immutable declarative validation architecture for Executive Gateway domain models. Metadata only; no validation engine.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:4/Dependency/NEA13Model",
  directPreviousPhaseModule: "executiveGatewayModel.ts" as const,
  modelOnly: true as const,
  modelId: ExecutiveGatewayModelId,
  modelVersion: ExecutiveGatewayModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-1:4 → NEA-1:3 ExecutiveGatewayModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-1:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:4" as const,
    section: "Validation" as const,
    kind,
    version: ExecutiveGatewayValidationVersion,
    status: ExecutiveGatewayValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayValidationApiRegistry = Object.freeze([
  validationApi("ExecutiveGatewayValidationId", "IdentityConstant"),
  validationApi("ExecutiveGatewayValidationVersion", "IdentityConstant"),
  validationApi("ExecutiveGatewayValidationName", "IdentityConstant"),
  validationApi("ExecutiveGatewayValidationNamespace", "IdentityConstant"),
  validationApi("ExecutiveGatewayValidationStatus", "MetadataConstant"),
  validationApi("ExecutiveGatewayValidationReadiness", "MetadataConstant"),
  validationApi("ExecutiveGatewayValidationPlatform", "Aggregate"),
  validationApi("getExecutiveGatewayValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const ExecutiveGatewayValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: ExecutiveGatewayValidationRuleCatalog.categories,
  rules: ExecutiveGatewayValidationRuleCatalog,
  relationships: ExecutiveGatewayValidationRelationshipCatalog,
  policies: ExecutiveGatewayValidationPolicyCatalog,
  metadata: ExecutiveGatewayValidationMetadata,
  ownership: ExecutiveGatewayValidationOwnership,
  boundaries: ExecutiveGatewayValidationBoundaries,
  readiness: ExecutiveGatewayValidationReadiness,
  apiRegistry: ExecutiveGatewayValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayValidationStatus,
  nextPhase: "NEA-1:5 — Executive Gateway Manifest",
  downstreamReadiness: ExecutiveGatewayValidationReadiness,
  modelPlatform: ExecutiveGatewayModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  authenticationEngine: false as const,
  authorizationEngine: false as const,
  routingEngine: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getExecutiveGatewayValidationSummary(): ExecutiveGatewayValidationSummary {
  const meta = ExecutiveGatewayValidationMetadata;
  return Object.freeze({
    validationId: ExecutiveGatewayValidationId,
    version: ExecutiveGatewayValidationVersion,
    name: ExecutiveGatewayValidationName,
    namespace: ExecutiveGatewayValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-1:4" as const,
    status: ExecutiveGatewayValidationStatus,
    readiness: ExecutiveGatewayValidationReadiness,
    modelId: ExecutiveGatewayModelId,
    categoryCount: meta.categoryCount,
    ruleCount: meta.ruleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "NEA-1:5 — Executive Gateway Manifest",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
