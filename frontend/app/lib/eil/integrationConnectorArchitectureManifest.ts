/**
 * EIL-2:5 — Integration Connector Architecture Manifest.
 *
 * Immutable architectural identity, scope, and release lineage publication.
 * Consumes only the Validation aggregate for canonical references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:5.
 */

import {
  IntegrationConnectorValidationIdentity,
  IntegrationConnectorValidationPlatform,
} from "./integrationConnectorValidation.ts";
import type { IntegrationConnectorArchitectureManifestDescriptor } from "./integrationConnectorManifestTypes.ts";

const validation = IntegrationConnectorValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/**
 * Canonical immutable architecture manifesto.
 */
export const IntegrationConnectorArchitectureManifest: IntegrationConnectorArchitectureManifestDescriptor =
  Object.freeze({
    architectureId: "EIL-2:5/Architecture",
    platformIdentity: "EIL-2",
    architectureIdentity: "EIL-2:5/IntegrationConnectorManifest",
    namespace: "nexora.eil.integration-connector.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    canonicalReferences: Object.freeze([
      foundation.identity.foundationId,
      registry.identity.canonicalId,
      model.identity.canonicalId,
      IntegrationConnectorValidationIdentity.canonicalId,
    ]),
    sourcePhases: Object.freeze([
      "EIL-2:1",
      "EIL-2:2",
      "EIL-2:3",
      "EIL-2:4",
      "EIL-2:5",
    ] as const),
    ownership: "EIL-2:5",
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
      `${model.identity.canonicalId} → ${IntegrationConnectorValidationIdentity.canonicalId}`,
      `${IntegrationConnectorValidationIdentity.canonicalId} → EIL-2:5/IntegrationConnectorManifest`,
    ]),
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
