/**
 * EIL-4:6 — Integration Orchestration Platform Composition.
 *
 * Immutable composition metadata referencing upstream EIL-4 artifacts
 * without duplicating their contents.
 * Consumes only the Manifest aggregate.
 *
 * Ownership: owned exclusively by EIL-4:6.
 */

import {
  IntegrationOrchestrationArchitectureManifest,
  IntegrationOrchestrationManifestIdentity,
} from "./integrationOrchestrationManifest.ts";
import type { IntegrationOrchestrationPlatformComposition as OrchestrationPlatformCompositionDescriptor } from "./integrationOrchestrationPlatformTypes.ts";

const references = IntegrationOrchestrationArchitectureManifest.canonicalReferences;

/**
 * Canonical immutable platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationOrchestrationPlatformComposition: OrchestrationPlatformCompositionDescriptor =
  Object.freeze({
    compositionId: "EIL-4:6/Composition",
    platformIdentity: "EIL-4:6/IntegrationOrchestrationPlatform",
    canonicalArchitecture: "EIL-4:5/Architecture",
    foundationReference: references[0]!,
    registryReference: references[1]!,
    modelReference: references[2]!,
    validationReference: references[3]!,
    manifestReference: IntegrationOrchestrationManifestIdentity.canonicalId,
    ownership: "EIL-4:6",
    namespace: "nexora.eil.integration-orchestration.platform",
    version: "1.0.0",
    releaseLineage: Object.freeze([
      ...IntegrationOrchestrationArchitectureManifest.releaseLineage,
      `${IntegrationOrchestrationManifestIdentity.canonicalId} → EIL-4:6/IntegrationOrchestrationPlatform`,
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
