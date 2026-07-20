/**
 * NEA-4:6 — Security Gateway Platform.
 *
 * Canonical immutable composition surface for the complete Security Gateway architecture.
 * Consumes only NEA-4:5 Security Gateway Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-4:6.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayPlatformId
 *   SecurityGatewayPlatformVersion
 *   SecurityGatewayPlatformName
 *   SecurityGatewayPlatformNamespace
 *   SecurityGatewayPlatformStatus
 *   SecurityGatewayPlatformReadiness
 *   SecurityGatewayPlatform
 *   getSecurityGatewayPlatformSummary()
 */

import {
  SecurityGatewayManifestId,
  SecurityGatewayManifestPlatform,
  SecurityGatewayManifestVersion,
} from "./securityGatewayManifest.ts";
import { SecurityGatewayPlatformMetadata } from "./securityGatewayPlatformMetadata.ts";
import { SecurityGatewayPlatformNamespaceObject } from "./securityGatewayPlatformNamespace.ts";
import {
  SecurityGatewayPlatformBoundaries,
  SecurityGatewayPlatformOwnership,
} from "./securityGatewayPlatformOwnership.ts";
import {
  SecurityGatewayPlatformReadinessDeclaration,
  SecurityGatewayPlatformReadinessValue,
} from "./securityGatewayPlatformReadiness.ts";
import { buildSecurityGatewayPlatformSummary } from "./securityGatewayPlatformSummary.ts";
import type {
  SecurityGatewayPlatformIdentity,
  SecurityGatewayPlatformSummary,
} from "./securityGatewayPlatformTypes.ts";

/** Canonical platform identity. */
export const SecurityGatewayPlatformId =
  "NEA-4:6/SecurityGatewayPlatform" as const;

/** Human-readable platform name. */
export const SecurityGatewayPlatformName =
  "Security Gateway Platform" as const;

/** Semantic version. */
export const SecurityGatewayPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayPlatformNamespace =
  "nexora.nea.security-gateway.platform" as const;

/** Platform status. */
export const SecurityGatewayPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayPlatformReadiness =
  SecurityGatewayPlatformReadinessValue;

const identity: SecurityGatewayPlatformIdentity = Object.freeze({
  platformId: SecurityGatewayPlatformId,
  platformName: SecurityGatewayPlatformName,
  platformVersion: SecurityGatewayPlatformVersion,
  platformNamespace: SecurityGatewayPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-4:6" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayPlatformStatus,
  readiness: SecurityGatewayPlatformReadiness,
  manifestId: SecurityGatewayManifestId,
  manifestVersion: SecurityGatewayManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:6/Dependency/NEA45Manifest",
  directPreviousPhaseModule: "securityGatewayManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: SecurityGatewayManifestId,
  manifestVersion: SecurityGatewayManifestVersion,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-4:6 → NEA-4:5 ManifestPlatform → Validation → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const platformApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:6" as const,
    section: "Platform" as const,
    kind,
    version: SecurityGatewayPlatformVersion,
    status: SecurityGatewayPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayPlatformApiRegistry = Object.freeze([
  platformApi("SecurityGatewayPlatformId", "IdentityConstant"),
  platformApi("SecurityGatewayPlatformVersion", "IdentityConstant"),
  platformApi("SecurityGatewayPlatformName", "IdentityConstant"),
  platformApi("SecurityGatewayPlatformNamespace", "IdentityConstant"),
  platformApi("SecurityGatewayPlatformStatus", "MetadataConstant"),
  platformApi("SecurityGatewayPlatformReadiness", "MetadataConstant"),
  platformApi("SecurityGatewayPlatform", "Aggregate"),
  platformApi("getSecurityGatewayPlatformSummary", "Helper"),
]);

const summarySnapshot = buildSecurityGatewayPlatformSummary();

/**
 * Canonical immutable Security Gateway Platform.
 * Consumer surface for the complete NEA-4 architecture.
 * Nine ordered sections. Metadata only.
 */
export const SecurityGatewayPlatform = Object.freeze({
  identity,
  dependency,
  namespace: SecurityGatewayPlatformNamespaceObject,
  metadata: SecurityGatewayPlatformMetadata,
  ownership: SecurityGatewayPlatformOwnership,
  boundaries: SecurityGatewayPlatformBoundaries,
  readiness: SecurityGatewayPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-4:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "securityGatewayPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-4 through SecurityGatewayPlatform only.",
    composedSections: SecurityGatewayPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayPlatformStatus,
  nextPhase: SecurityGatewayPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: SecurityGatewayPlatformReadiness,
  manifestPlatform: SecurityGatewayManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsEncryption: false as const,
  runtimeSecurity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getSecurityGatewayPlatformSummary(): SecurityGatewayPlatformSummary {
  return buildSecurityGatewayPlatformSummary();
}
