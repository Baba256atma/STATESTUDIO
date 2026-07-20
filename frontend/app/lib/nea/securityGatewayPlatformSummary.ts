/**
 * NEA-4:6 — Security Gateway Platform Summary.
 *
 * Immutable summary helpers for Platform consumers.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:6.
 */

import { SecurityGatewayManifestId } from "./securityGatewayManifest.ts";
import { SecurityGatewayPlatformMetadata } from "./securityGatewayPlatformMetadata.ts";
import { SecurityGatewayPlatformNamespaceObject } from "./securityGatewayPlatformNamespace.ts";
import {
  SecurityGatewayPlatformBoundaries,
  SecurityGatewayPlatformOwnership,
} from "./securityGatewayPlatformOwnership.ts";
import { SecurityGatewayPlatformReadinessDeclaration } from "./securityGatewayPlatformReadiness.ts";
import type { SecurityGatewayPlatformSummary } from "./securityGatewayPlatformTypes.ts";

/** Platform identity constants used by summary composition. */
export const SECURITY_GATEWAY_PLATFORM_SUMMARY_IDENTITY = Object.freeze({
  platformId: "NEA-4:6/SecurityGatewayPlatform" as const,
  name: "Security Gateway Platform" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.security-gateway.platform" as const,
  publicExportCount: 8 as const,
  sectionCount: 9 as const,
});

/**
 * Build deterministic frozen Platform summary.
 * Derived exclusively from canonical Platform and Manifest collections.
 */
export function buildSecurityGatewayPlatformSummary(): SecurityGatewayPlatformSummary {
  const identity = SECURITY_GATEWAY_PLATFORM_SUMMARY_IDENTITY;
  const meta = SecurityGatewayPlatformMetadata;
  const ns = SecurityGatewayPlatformNamespaceObject;
  return Object.freeze({
    platformId: identity.platformId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-4:6" as const,
    status: "Platform" as const,
    readiness: SecurityGatewayPlatformReadinessDeclaration.readiness,
    manifestId: SecurityGatewayManifestId,
    composedPhaseCount: ns.composedPhaseCount,
    namespaceSectionCount: ns.sectionCount,
    phaseReferenceCount: meta.phaseReferenceCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    ownershipCount: SecurityGatewayPlatformOwnership.ownsCount,
    nonOwnershipCount: SecurityGatewayPlatformOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      SecurityGatewayPlatformBoundaries.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: SecurityGatewayPlatformReadinessDeclaration.nextPhase,
    architectureStatus:
      SecurityGatewayPlatformReadinessDeclaration.architectureStatus,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Frozen summary catalog for composition consumers. */
export const SecurityGatewayPlatformSummaryCatalog = Object.freeze({
  catalogId: "NEA-4:6/PlatformSummaryCatalog",
  sourcePhase: "NEA-4:6" as const,
  buildSummary: buildSecurityGatewayPlatformSummary,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
