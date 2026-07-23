/**
 * EIL-2:6 — Integration Connector Platform Composition.
 *
 * Immutable composition metadata referencing upstream EIL-2 artifacts
 * without duplicating their contents.
 * Consumes only the Manifest aggregate.
 *
 * Ownership: owned exclusively by EIL-2:6.
 */

import {
  IntegrationConnectorArchitectureManifest,
  IntegrationConnectorManifestIdentity,
} from "./integrationConnectorManifest.ts";
import type { IntegrationConnectorPlatformCompositionDescriptor } from "./integrationConnectorPlatformTypes.ts";

const references = IntegrationConnectorArchitectureManifest.canonicalReferences;

/**
 * Canonical immutable platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationConnectorPlatformComposition: IntegrationConnectorPlatformCompositionDescriptor =
  Object.freeze({
    compositionId: "EIL-2:6/Composition",
    platformIdentity: "EIL-2:6/IntegrationConnectorPlatform",
    canonicalArchitecture: "EIL-2:5/Architecture",
    foundationReference: references[0]!,
    registryReference: references[1]!,
    modelReference: references[2]!,
    validationReference: references[3]!,
    manifestReference: IntegrationConnectorManifestIdentity.canonicalId,
    ownership: "EIL-2:6",
    namespace: "nexora.eil.integration-connector.platform",
    version: "1.0.0",
    releaseLineage: Object.freeze([
      ...IntegrationConnectorArchitectureManifest.releaseLineage,
      `${IntegrationConnectorManifestIdentity.canonicalId} → EIL-2:6/IntegrationConnectorPlatform`,
    ]),
    architecturalScope: Object.freeze([
      "platform identity",
      "platform composition",
      "platform inventory",
      "platform guarantees",
      "platform compatibility",
      "platform readiness",
      "platform summary",
      "canonical references",
    ]),
    duplicatesUpstreamContents: false as const,
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
