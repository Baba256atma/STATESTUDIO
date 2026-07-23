/**
 * EIL-3:6 — Integration Routing Platform Composition.
 *
 * Immutable composition metadata referencing upstream EIL-3 artifacts
 * without duplicating their contents.
 * Consumes only the Manifest aggregate.
 *
 * Ownership: owned exclusively by EIL-3:6.
 */

import {
  IntegrationRoutingArchitectureManifest,
  IntegrationRoutingManifestIdentity,
} from "./integrationRoutingManifest.ts";
import type { RoutingPlatformComposition } from "./integrationRoutingPlatformTypes.ts";

const references = IntegrationRoutingArchitectureManifest.canonicalReferences;

/**
 * Canonical immutable platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationRoutingPlatformComposition: RoutingPlatformComposition =
  Object.freeze({
    compositionId: "EIL-3:6/Composition",
    platformIdentity: "EIL-3:6/IntegrationRoutingPlatform",
    canonicalArchitecture: "EIL-3:5/Architecture",
    foundationReference: references[0]!,
    registryReference: references[1]!,
    modelReference: references[2]!,
    validationReference: references[3]!,
    manifestReference: IntegrationRoutingManifestIdentity.canonicalId,
    ownership: "EIL-3:6",
    namespace: "nexora.eil.integration-routing.platform",
    version: "1.0.0",
    releaseLineage: Object.freeze([
      ...IntegrationRoutingArchitectureManifest.releaseLineage,
      `${IntegrationRoutingManifestIdentity.canonicalId} → EIL-3:6/IntegrationRoutingPlatform`,
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
