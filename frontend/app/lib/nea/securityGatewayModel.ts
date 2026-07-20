/**
 * NEA-4:3 — Security Gateway Model.
 *
 * Canonical immutable domain model layer for Security Gateway.
 * Consumes only NEA-4:2 Security Gateway Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-4:3.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayModelId
 *   SecurityGatewayModelVersion
 *   SecurityGatewayModelName
 *   SecurityGatewayModelNamespace
 *   SecurityGatewayModelStatus
 *   SecurityGatewayModelReadiness
 *   SecurityGatewayModelPlatform
 *   getSecurityGatewayModelSummary()
 */

import {
  SecurityGatewayRegistryId,
  SecurityGatewayRegistryPlatform,
  SecurityGatewayRegistryVersion,
} from "./securityGatewayRegistry.ts";
import { SecurityGatewayModelLifecycle } from "./securityGatewayModelLifecycle.ts";
import { SecurityGatewayModelMetadata } from "./securityGatewayModelMetadata.ts";
import {
  SecurityGatewayModelBoundaries,
  SecurityGatewayModelOwnership,
} from "./securityGatewayModelOwnership.ts";
import { SecurityGatewayDomainModelCatalog } from "./securityGatewayModels.ts";
import { SecurityGatewayModelRelationshipCatalog } from "./securityGatewayRelationships.ts";
import type {
  SecurityGatewayModelIdentity,
  SecurityGatewayModelSummary,
} from "./securityGatewayModelTypes.ts";

/** Canonical model identity. */
export const SecurityGatewayModelId = "NEA-4:3/SecurityGatewayModel" as const;

/** Human-readable model name. */
export const SecurityGatewayModelName = "Security Gateway Model" as const;

/** Semantic version. */
export const SecurityGatewayModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayModelNamespace =
  "nexora.nea.security-gateway.model" as const;

/** Model status. */
export const SecurityGatewayModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayModelReadiness = "ReadyForValidation" as const;

const identity: SecurityGatewayModelIdentity = Object.freeze({
  modelId: SecurityGatewayModelId,
  modelName: SecurityGatewayModelName,
  modelVersion: SecurityGatewayModelVersion,
  modelNamespace: SecurityGatewayModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-4:3" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayModelStatus,
  readiness: SecurityGatewayModelReadiness,
  registryId: SecurityGatewayRegistryId,
  registryVersion: SecurityGatewayRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Security Gateway data structures.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:3/Dependency/NEA42Registry",
  directPreviousPhaseModule: "securityGatewayRegistry.ts" as const,
  registryOnly: true as const,
  registryId: SecurityGatewayRegistryId,
  registryVersion: SecurityGatewayRegistryVersion,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "NEA-4:3 → NEA-4:2 SecurityGatewayRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:3" as const,
    section: "Model" as const,
    kind,
    version: SecurityGatewayModelVersion,
    status: SecurityGatewayModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayModelApiRegistry = Object.freeze([
  modelApi("SecurityGatewayModelId", "IdentityConstant"),
  modelApi("SecurityGatewayModelVersion", "IdentityConstant"),
  modelApi("SecurityGatewayModelName", "IdentityConstant"),
  modelApi("SecurityGatewayModelNamespace", "IdentityConstant"),
  modelApi("SecurityGatewayModelStatus", "MetadataConstant"),
  modelApi("SecurityGatewayModelReadiness", "MetadataConstant"),
  modelApi("SecurityGatewayModelPlatform", "Aggregate"),
  modelApi("getSecurityGatewayModelSummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Model platform.
 * Nine ordered sections. Metadata only.
 */
export const SecurityGatewayModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: SecurityGatewayDomainModelCatalog,
  relationships: SecurityGatewayModelRelationshipCatalog,
  lifecycle: SecurityGatewayModelLifecycle,
  metadata: SecurityGatewayModelMetadata,
  ownership: SecurityGatewayModelOwnership,
  boundaries: SecurityGatewayModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-4:3/ModelReadiness",
    readiness: SecurityGatewayModelReadiness,
    nextPhase: SecurityGatewayModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsAuthenticationImplemented: false as const,
    claimsAuthorizationImplemented: false as const,
    claimsEncryptionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayModelStatus,
  nextPhase: SecurityGatewayModelMetadata.nextPhase,
  downstreamReadiness: SecurityGatewayModelReadiness,
  registryPlatform: SecurityGatewayRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  evaluatesPermissions: false as const,
  evaluatesTrust: false as const,
  enforcesConsent: false as const,
  verifiesIdentity: false as const,
  calculatesSecurityDecisions: false as const,
  implementsEncryption: false as const,
  generatesTokens: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getSecurityGatewayModelSummary(): SecurityGatewayModelSummary {
  const meta = SecurityGatewayModelMetadata;
  return Object.freeze({
    modelId: SecurityGatewayModelId,
    version: SecurityGatewayModelVersion,
    name: SecurityGatewayModelName,
    namespace: SecurityGatewayModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-4:3" as const,
    status: SecurityGatewayModelStatus,
    readiness: SecurityGatewayModelReadiness,
    registryId: SecurityGatewayRegistryId,
    domainModelCount: meta.domainModelCount,
    securityIdentityModelCount: meta.securityIdentityModelCount,
    securityPrincipalModelCount: meta.securityPrincipalModelCount,
    relationshipCount: meta.relationshipCount,
    lifecycleStateCount: meta.lifecycleStateCount,
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
