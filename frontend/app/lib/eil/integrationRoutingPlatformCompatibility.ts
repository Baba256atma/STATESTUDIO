/**
 * EIL-3:6 — Integration Routing Platform Compatibility.
 *
 * Descriptive compatibility declarations for Platform composition.
 * Metadata only — no runtime compatibility validation.
 *
 * Ownership: owned exclusively by EIL-3:6.
 */

import {
  IntegrationRoutingCompatibilityManifest,
  IntegrationRoutingManifestIdentity,
} from "./integrationRoutingManifest.ts";
import type {
  RoutingPlatformCompatibilityDeclaration,
  RoutingPlatformCompatibilityScope,
} from "./integrationRoutingPlatformTypes.ts";

const declaration = (
  key: string,
  scope: RoutingPlatformCompatibilityScope,
  canonicalName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
): RoutingPlatformCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-3:6/Compatibility/${key}` as const,
    scope,
    canonicalKey: key,
    canonicalName,
    description,
    ordinal,
    tags: Object.freeze([...tags]),
    runtimeValidated: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly ten platform compatibility declarations.
 * Manifest compatibility scopes are referenced, not reconstructed.
 */
export const IntegrationRoutingPlatformCompatibility: readonly RoutingPlatformCompatibilityDeclaration[] =
  Object.freeze([
    declaration(
      "FoundationCompatibility",
      "Foundation",
      "Foundation compatibility",
      "Compatible with Foundation lineage published through Manifest architecture references.",
      1,
      Object.freeze(["foundation"]),
    ),
    declaration(
      "RegistryCompatibility",
      "Registry",
      "Registry compatibility",
      "Compatible with Registry lineage published through Manifest architecture references.",
      2,
      Object.freeze(["registry"]),
    ),
    declaration(
      "ModelCompatibility",
      "Model",
      "Model compatibility",
      "Compatible with Model lineage published through Manifest architecture references.",
      3,
      Object.freeze(["model"]),
    ),
    declaration(
      "ValidationCompatibility",
      "Validation",
      "Validation compatibility",
      "Compatible with Validation lineage published through Manifest architecture references.",
      4,
      Object.freeze(["validation"]),
    ),
    declaration(
      "ManifestCompatibility",
      "Manifest",
      "Manifest compatibility",
      `Compatible with ${IntegrationRoutingManifestIdentity.canonicalId} at ${IntegrationRoutingManifestIdentity.version}; Manifest declares ${IntegrationRoutingCompatibilityManifest.declarationCount} scopes.`,
      5,
      Object.freeze(["manifest"]),
    ),
    declaration(
      "ForwardCompatibility",
      "Forward",
      "Forward compatibility",
      "Platform remains forward-compatible with Certification without runtime claims.",
      6,
      Object.freeze(["forward"]),
    ),
    declaration(
      "VersionCompatibility",
      "Version",
      "Version compatibility",
      "Semantic version 1.0.0 lineage compatibility preserved across EIL-3.",
      7,
      Object.freeze(["version"]),
    ),
    declaration(
      "NamespaceCompatibility",
      "Namespace",
      "Namespace compatibility",
      "Namespaces remain under nexora.eil.integration-routing.* without collision.",
      8,
      Object.freeze(["namespace"]),
    ),
    declaration(
      "ReleaseCompatibility",
      "Release",
      "Release compatibility",
      "Release lineage remains consistent from Foundation through Platform.",
      9,
      Object.freeze(["release"]),
    ),
    declaration(
      "ArchitecturalCompatibility",
      "Architecture",
      "Architectural compatibility",
      "Metadata-only architecture preserved across the complete EIL-3 ladder.",
      10,
      Object.freeze(["architecture"]),
    ),
  ]);
