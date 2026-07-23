/**
 * EIL-1:6 — Integration Platform Composition.
 *
 * Immutable composition metadata referencing upstream EIL-1 artifacts
 * without duplicating their contents.
 * Consumes only the Manifest aggregate.
 *
 * Ownership: owned exclusively by EIL-1:6.
 */

import {
  IntegrationArchitectureManifest,
  IntegrationManifestIdentity,
} from "./integrationManifest.ts";
import type { IntegrationPlatformCompositionDescriptor } from "./integrationPlatformTypes.ts";

const references = IntegrationArchitectureManifest.canonicalReferences;

/**
 * Canonical immutable platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationPlatformComposition: IntegrationPlatformCompositionDescriptor =
  Object.freeze({
    compositionId: "EIL-1:6/Composition",
    platformIdentity: "EIL-1:6/IntegrationPlatform",
    canonicalArchitecture: "EIL-1:5/Architecture",
    foundationReference: references[0]!,
    registryReference: references[1]!,
    modelReference: references[2]!,
    validationReference: references[3]!,
    manifestReference: IntegrationManifestIdentity.canonicalId,
    ownership: "EIL-1:6",
    namespace: "nexora.eil.integration.platform",
    version: "1.0.0",
    releaseLineage: Object.freeze([
      ...IntegrationArchitectureManifest.releaseLineage,
      `${IntegrationManifestIdentity.canonicalId} → EIL-1:6/IntegrationPlatform`,
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
