/**
 * NEA-4:4 — Security Gateway Validation.
 *
 * Canonical immutable declarative validation architecture for Security Gateway.
 * Consumes only NEA-4:3 Security Gateway Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-4:4.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayValidationId
 *   SecurityGatewayValidationVersion
 *   SecurityGatewayValidationName
 *   SecurityGatewayValidationNamespace
 *   SecurityGatewayValidationStatus
 *   SecurityGatewayValidationReadiness
 *   SecurityGatewayValidationPlatform
 *   getSecurityGatewayValidationSummary()
 */

import {
  SecurityGatewayModelId,
  SecurityGatewayModelPlatform,
  SecurityGatewayModelVersion,
} from "./securityGatewayModel.ts";
import { SecurityGatewayValidationMetadata } from "./securityGatewayValidationMetadata.ts";
import {
  SecurityGatewayValidationBoundaries,
  SecurityGatewayValidationOwnership,
} from "./securityGatewayValidationOwnership.ts";
import { SecurityGatewayValidationPolicyCatalog } from "./securityGatewayValidationPolicies.ts";
import { SecurityGatewayValidationRelationshipCatalog } from "./securityGatewayValidationRelationships.ts";
import { SecurityGatewayValidationRuleCatalog } from "./securityGatewayValidationRules.ts";
import type {
  SecurityGatewayValidationIdentity,
  SecurityGatewayValidationSummary,
} from "./securityGatewayValidationTypes.ts";

/** Canonical validation identity. */
export const SecurityGatewayValidationId =
  "NEA-4:4/SecurityGatewayValidation" as const;

/** Human-readable validation name. */
export const SecurityGatewayValidationName =
  "Security Gateway Validation" as const;

/** Semantic version. */
export const SecurityGatewayValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayValidationNamespace =
  "nexora.nea.security-gateway.validation" as const;

/** Validation status. */
export const SecurityGatewayValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayValidationReadiness = "ReadyForManifest" as const;

const identity: SecurityGatewayValidationIdentity = Object.freeze({
  validationId: SecurityGatewayValidationId,
  validationName: SecurityGatewayValidationName,
  validationVersion: SecurityGatewayValidationVersion,
  validationNamespace: SecurityGatewayValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-4:4" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayValidationStatus,
  readiness: SecurityGatewayValidationReadiness,
  modelId: SecurityGatewayModelId,
  modelVersion: SecurityGatewayModelVersion,
  description:
    "Immutable declarative validation architecture for Security Gateway domain models. Metadata only; no validation engine.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:4/Dependency/NEA43Model",
  directPreviousPhaseModule: "securityGatewayModel.ts" as const,
  modelOnly: true as const,
  modelId: SecurityGatewayModelId,
  modelVersion: SecurityGatewayModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-4:4 → NEA-4:3 SecurityGatewayModelPlatform (exclusive)",
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
    id: `NEA-4:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:4" as const,
    section: "Validation" as const,
    kind,
    version: SecurityGatewayValidationVersion,
    status: SecurityGatewayValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayValidationApiRegistry = Object.freeze([
  validationApi("SecurityGatewayValidationId", "IdentityConstant"),
  validationApi("SecurityGatewayValidationVersion", "IdentityConstant"),
  validationApi("SecurityGatewayValidationName", "IdentityConstant"),
  validationApi("SecurityGatewayValidationNamespace", "IdentityConstant"),
  validationApi("SecurityGatewayValidationStatus", "MetadataConstant"),
  validationApi("SecurityGatewayValidationReadiness", "MetadataConstant"),
  validationApi("SecurityGatewayValidationPlatform", "Aggregate"),
  validationApi("getSecurityGatewayValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const SecurityGatewayValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: SecurityGatewayValidationRuleCatalog.categories,
  rules: SecurityGatewayValidationRuleCatalog,
  relationships: SecurityGatewayValidationRelationshipCatalog,
  policies: SecurityGatewayValidationPolicyCatalog,
  metadata: SecurityGatewayValidationMetadata,
  ownership: SecurityGatewayValidationOwnership,
  boundaries: SecurityGatewayValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-4:4/ValidationReadiness",
    readiness: SecurityGatewayValidationReadiness,
    nextPhase: SecurityGatewayValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayValidationStatus,
  nextPhase: SecurityGatewayValidationMetadata.nextPhase,
  downstreamReadiness: SecurityGatewayValidationReadiness,
  modelPlatform: SecurityGatewayModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  evaluatesPermissions: false as const,
  evaluatesTrust: false as const,
  enforcesConsent: false as const,
  verifiesIdentity: false as const,
  calculatesSecurityDecisions: false as const,
  implementsEncryption: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getSecurityGatewayValidationSummary(): SecurityGatewayValidationSummary {
  const meta = SecurityGatewayValidationMetadata;
  return Object.freeze({
    validationId: SecurityGatewayValidationId,
    version: SecurityGatewayValidationVersion,
    name: SecurityGatewayValidationName,
    namespace: SecurityGatewayValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-4:4" as const,
    status: SecurityGatewayValidationStatus,
    readiness: SecurityGatewayValidationReadiness,
    modelId: SecurityGatewayModelId,
    categoryCount: meta.categoryCount,
    ruleCount: meta.ruleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
