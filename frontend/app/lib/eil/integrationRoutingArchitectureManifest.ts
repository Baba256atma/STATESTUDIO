/**
 * EIL-3:5 — Integration Routing Architecture Manifest.
 *
 * Immutable architectural identity, scope, and release lineage publication.
 * Consumes only the Validation aggregate for canonical references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:5.
 */

import {
  IntegrationRoutingValidationIdentity,
  IntegrationRoutingValidationPlatform,
} from "./integrationRoutingValidation.ts";
import type { RoutingArchitectureManifest } from "./integrationRoutingManifestTypes.ts";

const validation = IntegrationRoutingValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/**
 * Canonical immutable architecture manifesto.
 */
export const IntegrationRoutingArchitectureManifest: RoutingArchitectureManifest =
  Object.freeze({
    architectureId: "EIL-3:5/Architecture",
    platformIdentity: "EIL-3",
    architectureIdentity: "EIL-3:5/IntegrationRoutingManifest",
    namespace: "nexora.eil.integration-routing.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    canonicalReferences: Object.freeze([
      foundation.identity.foundationId,
      registry.identity.canonicalId,
      model.identity.canonicalId,
      IntegrationRoutingValidationIdentity.canonicalId,
    ]),
    sourcePhases: Object.freeze([
      "EIL-3:1",
      "EIL-3:2",
      "EIL-3:3",
      "EIL-3:4",
      "EIL-3:5",
    ] as const),
    ownership: "EIL-3:5",
    architecturalScope: Object.freeze([
      "routing architecture",
      "routing inventory",
      "routing dependencies",
      "routing compatibility",
      "validation summary",
      "readiness summary",
      "canonical references",
      "architectural completeness",
    ]),
    releaseLineage: Object.freeze([
      `${foundation.identity.foundationId} → ${registry.identity.canonicalId}`,
      `${registry.identity.canonicalId} → ${model.identity.canonicalId}`,
      `${model.identity.canonicalId} → ${IntegrationRoutingValidationIdentity.canonicalId}`,
      `${IntegrationRoutingValidationIdentity.canonicalId} → EIL-3:5/IntegrationRoutingManifest`,
    ]),
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
