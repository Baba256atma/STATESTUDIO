/**
 * EIL-2:8 — Integration Connector Freeze Compatibility.
 *
 * Descriptive compatibility declarations for the frozen EIL-2 connector baseline.
 * Metadata only — no runtime compatibility validation.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

import {
  IntegrationConnectorCertificationIdentity,
  IntegrationConnectorCertificationPlatform,
} from "./integrationConnectorCertification.ts";
import type {
  IntegrationConnectorFreezeCompatibilityDeclaration,
  IntegrationConnectorFreezeCompatibilityScope,
} from "./integrationConnectorFreezeTypes.ts";

const platform =
  IntegrationConnectorCertificationPlatform.integrationConnectorPlatform;

const declaration = (
  key: string,
  scope: IntegrationConnectorFreezeCompatibilityScope,
  canonicalName: string,
  description: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorFreezeCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-2:8/Compatibility/${key}` as const,
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
 * Exactly ten freeze compatibility declarations.
 */
export const IntegrationConnectorFreezeCompatibility: readonly IntegrationConnectorFreezeCompatibilityDeclaration[] =
  Object.freeze([
    declaration(
      "FoundationCompatibility",
      "Foundation",
      "Foundation compatibility",
      `Frozen-compatible with ${platform.composition.foundationReference}.`,
      1,
      Object.freeze(["foundation"]),
    ),
    declaration(
      "RegistryCompatibility",
      "Registry",
      "Registry compatibility",
      `Frozen-compatible with ${platform.composition.registryReference}.`,
      2,
      Object.freeze(["registry"]),
    ),
    declaration(
      "ModelCompatibility",
      "Model",
      "Model compatibility",
      `Frozen-compatible with ${platform.composition.modelReference}.`,
      3,
      Object.freeze(["model"]),
    ),
    declaration(
      "ValidationCompatibility",
      "Validation",
      "Validation compatibility",
      `Frozen-compatible with ${platform.composition.validationReference}.`,
      4,
      Object.freeze(["validation"]),
    ),
    declaration(
      "ManifestCompatibility",
      "Manifest",
      "Manifest compatibility",
      `Frozen-compatible with ${platform.composition.manifestReference}.`,
      5,
      Object.freeze(["manifest"]),
    ),
    declaration(
      "PlatformCompatibility",
      "Platform",
      "Platform compatibility",
      `Frozen-compatible with ${platform.identity.canonicalId}.`,
      6,
      Object.freeze(["platform"]),
    ),
    declaration(
      "CertificationCompatibility",
      "Certification",
      "Certification compatibility",
      `Frozen-compatible with ${IntegrationConnectorCertificationIdentity.canonicalId}.`,
      7,
      Object.freeze(["certification"]),
    ),
    declaration(
      "ForwardCompatibility",
      "Forward",
      "Forward compatibility",
      "Frozen baseline remains forward-compatible with Public Index publication.",
      8,
      Object.freeze(["forward"]),
    ),
    declaration(
      "NamespaceCompatibility",
      "Namespace",
      "Namespace compatibility",
      "Frozen namespaces remain under nexora.eil.integration-connector.* without collision.",
      9,
      Object.freeze(["namespace"]),
    ),
    declaration(
      "VersionCompatibility",
      "Version",
      "Version compatibility",
      "Frozen semantic version 1.0.0 lineage remains consistent across EIL-2.",
      10,
      Object.freeze(["version"]),
    ),
  ]);
