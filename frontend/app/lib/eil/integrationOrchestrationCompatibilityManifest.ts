/**
 * EIL-4:5 — Integration Orchestration Compatibility Manifest.
 *
 * Descriptive compatibility declarations across Foundation → Validation.
 * Metadata only — no runtime compatibility validation.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

import {
  IntegrationOrchestrationValidationIdentity,
  IntegrationOrchestrationValidationPlatform,
} from "./integrationOrchestrationValidation.ts";
import type {
  IntegrationOrchestrationCompatibilityManifest as OrchestrationCompatibilityManifestDescriptor,
  OrchestrationCompatibilityDeclaration,
  OrchestrationManifestCompatibilityScope,
  OrchestrationManifestSourcePhase,
} from "./integrationOrchestrationManifestTypes.ts";

const validation = IntegrationOrchestrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const declaration = (
  key: string,
  scope: OrchestrationManifestCompatibilityScope,
  canonicalName: string,
  description: string,
  sourcePhase: OrchestrationManifestSourcePhase,
  ordinal: number,
  tags: readonly string[],
): OrchestrationCompatibilityDeclaration =>
  Object.freeze({
    compatibilityId: `EIL-4:5/Compatibility/${key}` as const,
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

const declarations: readonly OrchestrationCompatibilityDeclaration[] =
  Object.freeze([
    declaration(
      "FoundationCompatibility",
      "Foundation",
      "Foundation compatibility",
      `Compatible with ${foundation.identity.foundationId} at ${foundation.identity.foundationVersion}.`,
      "EIL-4:1",
      1,
      Object.freeze(["foundation", "compatibility"]),
    ),
    declaration(
      "RegistryCompatibility",
      "Registry",
      "Registry compatibility",
      `Compatible with ${registry.identity.canonicalId} at ${registry.identity.version}.`,
      "EIL-4:2",
      2,
      Object.freeze(["registry", "compatibility"]),
    ),
    declaration(
      "ModelCompatibility",
      "Model",
      "Model compatibility",
      `Compatible with ${model.identity.canonicalId} at ${model.identity.version}.`,
      "EIL-4:3",
      3,
      Object.freeze(["model", "compatibility"]),
    ),
    declaration(
      "ValidationCompatibility",
      "Validation",
      "Validation compatibility",
      `Compatible with ${IntegrationOrchestrationValidationIdentity.canonicalId} at ${IntegrationOrchestrationValidationIdentity.version}.`,
      "EIL-4:4",
      4,
      Object.freeze(["validation", "compatibility"]),
    ),
    declaration(
      "ForwardCompatibility",
      "Forward",
      "Forward compatibility",
      "Manifest remains forward-compatible with Platform composition without runtime claims.",
      "EIL-4:5",
      5,
      Object.freeze(["forward"]),
    ),
    declaration(
      "VersionCompatibility",
      "Version",
      "Version compatibility",
      "All upstream phases publish semantic version 1.0.0 lineage compatibility.",
      "EIL-4:5",
      6,
      Object.freeze(["version"]),
    ),
    declaration(
      "NamespaceCompatibility",
      "Namespace",
      "Namespace compatibility",
      "Namespaces remain under nexora.eil.integration-orchestration.* without collision.",
      "EIL-4:5",
      7,
      Object.freeze(["namespace"]),
    ),
    declaration(
      "ArchitecturalCompatibility",
      "Architecture",
      "Architectural compatibility",
      "Metadata-only architecture preserved across Foundation through Validation.",
      "EIL-4:5",
      8,
      Object.freeze(["architecture"]),
    ),
  ]);

/**
 * Canonical immutable compatibility manifesto.
 */
export const IntegrationOrchestrationCompatibilityManifest: OrchestrationCompatibilityManifestDescriptor =
  Object.freeze({
    compatibilityManifestId: "EIL-4:5/CompatibilityManifest",
    declarations,
    declarationCount: declarations.length,
    runtimeValidated: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
