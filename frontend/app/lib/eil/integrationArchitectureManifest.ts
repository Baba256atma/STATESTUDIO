/**
 * EIL-1:5 — Integration Architecture Manifest.
 *
 * Immutable architectural identity, scope, and release lineage publication.
 * Consumes only the Validation aggregate for canonical references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:5.
 */

import {
  IntegrationValidationIdentity,
  IntegrationValidationPlatform,
} from "./integrationValidation.ts";
import type { IntegrationArchitectureManifestDescriptor } from "./integrationManifestTypes.ts";

const validation = IntegrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/**
 * Canonical immutable architecture manifesto.
 */
export const IntegrationArchitectureManifest: IntegrationArchitectureManifestDescriptor =
  Object.freeze({
    architectureId: "EIL-1:5/Architecture",
    platformIdentity: "EIL-1",
    architectureIdentity: "EIL-1:5/IntegrationManifest",
    namespace: "nexora.eil.integration.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    canonicalReferences: Object.freeze([
      foundation.identity.foundationId,
      registry.identity.canonicalId,
      model.identity.canonicalId,
      IntegrationValidationIdentity.canonicalId,
    ]),
    sourcePhases: Object.freeze([
      "EIL-1:1",
      "EIL-1:2",
      "EIL-1:3",
      "EIL-1:4",
      "EIL-1:5",
    ] as const),
    ownership: "EIL-1:5",
    architecturalScope: Object.freeze([
      "architecture identity",
      "inventory",
      "dependencies",
      "compatibility",
      "validation summary",
      "readiness",
      "public architecture summary",
      "canonical references",
    ]),
    releaseLineage: Object.freeze([
      `${foundation.identity.foundationId} → ${registry.identity.canonicalId}`,
      `${registry.identity.canonicalId} → ${model.identity.canonicalId}`,
      `${model.identity.canonicalId} → ${IntegrationValidationIdentity.canonicalId}`,
      `${IntegrationValidationIdentity.canonicalId} → EIL-1:5/IntegrationManifest`,
    ]),
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
