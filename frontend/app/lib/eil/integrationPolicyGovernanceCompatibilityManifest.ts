/**
 * EIL-5:5 — Integration Policy & Governance Compatibility Manifest.
 *
 * Descriptive compatibility declarations across Foundation → Validation.
 * Metadata only — no runtime compatibility validation.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

import {
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationPlatform,
} from "./integrationPolicyGovernanceValidation.ts";
import type {
  IntegrationPolicyGovernanceCompatibilityManifest as PolicyGovernanceCompatibilityManifestDescriptor,
  PolicyGovernanceCompatibilityDeclaration,
  PolicyGovernanceManifestCompatibilityScope,
  PolicyGovernanceManifestSourcePhase,
} from "./integrationPolicyGovernanceManifestTypes.ts";

const validation = IntegrationPolicyGovernanceValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const declaration = (
  key: string,
  scope: PolicyGovernanceManifestCompatibilityScope,
  canonicalName: string,
  description: string,
  sourcePhase: PolicyGovernanceManifestSourcePhase,
  ordinal: number,
  tags: readonly string[],
): PolicyGovernanceCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-5:5/Compatibility/${key}` as const,
    scope,
    canonicalKey: key,
    canonicalName,
    description,
    sourcePhase,
    ordinal,
    tags: Object.freeze([...tags]),
    runtimeValidated: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const declarations: readonly PolicyGovernanceCompatibilityDeclaration[] =
  Object.freeze([
    declaration(
      "FoundationCompatibility",
      "Foundation",
      "Foundation compatibility",
      `Compatible with ${foundation.identity.foundationId} at ${foundation.identity.foundationVersion}.`,
      "EIL-5:1",
      1,
      Object.freeze(["foundation", "compatibility"]),
    ),
    declaration(
      "RegistryCompatibility",
      "Registry",
      "Registry compatibility",
      `Compatible with ${registry.identity.canonicalId} at ${registry.identity.version}.`,
      "EIL-5:2",
      2,
      Object.freeze(["registry", "compatibility"]),
    ),
    declaration(
      "ModelCompatibility",
      "Model",
      "Model compatibility",
      `Compatible with ${model.identity.canonicalId} at ${model.identity.version}.`,
      "EIL-5:3",
      3,
      Object.freeze(["model", "compatibility"]),
    ),
    declaration(
      "ValidationCompatibility",
      "Validation",
      "Validation compatibility",
      `Compatible with ${IntegrationPolicyGovernanceValidationIdentity.canonicalId} at ${IntegrationPolicyGovernanceValidationIdentity.version}.`,
      "EIL-5:4",
      4,
      Object.freeze(["validation", "compatibility"]),
    ),
    declaration(
      "ForwardCompatibility",
      "Forward",
      "Forward compatibility",
      "Manifest remains forward-compatible with Platform composition without runtime claims.",
      "EIL-5:5",
      5,
      Object.freeze(["forward"]),
    ),
    declaration(
      "VersionCompatibility",
      "Version",
      "Version compatibility",
      "All upstream phases publish semantic version 1.0.0 lineage compatibility.",
      "EIL-5:5",
      6,
      Object.freeze(["version"]),
    ),
    declaration(
      "NamespaceCompatibility",
      "Namespace",
      "Namespace compatibility",
      "Namespaces remain under nexora.eil.integration-policy-governance.* without collision.",
      "EIL-5:5",
      7,
      Object.freeze(["namespace"]),
    ),
    declaration(
      "ArchitecturalCompatibility",
      "Architecture",
      "Architectural compatibility",
      "Metadata-only architecture preserved across Foundation through Validation.",
      "EIL-5:5",
      8,
      Object.freeze(["architecture"]),
    ),
  ]);

/**
 * Canonical immutable compatibility manifesto.
 */
export const IntegrationPolicyGovernanceCompatibilityManifest: PolicyGovernanceCompatibilityManifestDescriptor =
  Object.freeze({
    compatibilityManifestId: "EIL-5:5/CompatibilityManifest",
    declarations,
    declarationCount: declarations.length,
    runtimeValidated: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
