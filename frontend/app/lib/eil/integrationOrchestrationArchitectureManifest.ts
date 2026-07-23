/**
 * EIL-4:5 — Integration Orchestration Architecture Manifest.
 *
 * Immutable architectural identity, scope, and release lineage publication.
 * Consumes only the Validation aggregate for canonical references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

import {
  IntegrationOrchestrationValidationIdentity,
  IntegrationOrchestrationValidationPlatform,
} from "./integrationOrchestrationValidation.ts";
import type { IntegrationOrchestrationArchitectureManifest as OrchestrationArchitectureManifestDescriptor } from "./integrationOrchestrationManifestTypes.ts";

const validation = IntegrationOrchestrationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/**
 * Canonical immutable architecture manifesto.
 */
export const IntegrationOrchestrationArchitectureManifest: OrchestrationArchitectureManifestDescriptor =
  Object.freeze({
    architectureId: "EIL-4:5/Architecture",
    platformIdentity: "EIL-4",
    architectureIdentity: "EIL-4:5/IntegrationOrchestrationManifest",
    namespace: "nexora.eil.integration-orchestration.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    canonicalReferences: Object.freeze([
      foundation.identity.foundationId,
      registry.identity.canonicalId,
      model.identity.canonicalId,
      IntegrationOrchestrationValidationIdentity.canonicalId,
    ]),
    sourcePhases: Object.freeze([
      "EIL-4:1",
      "EIL-4:2",
      "EIL-4:3",
      "EIL-4:4",
      "EIL-4:5",
    ] as const),
    ownership: "EIL-4:5",
    architecturalScope: Object.freeze([
      "orchestration architecture",
      "orchestration inventory",
      "orchestration dependencies",
      "orchestration compatibility",
      "validation summary",
      "readiness summary",
      "canonical references",
      "architectural completeness",
    ]),
    releaseLineage: Object.freeze([
      `${foundation.identity.foundationId} → ${registry.identity.canonicalId}`,
      `${registry.identity.canonicalId} → ${model.identity.canonicalId}`,
      `${model.identity.canonicalId} → ${IntegrationOrchestrationValidationIdentity.canonicalId}`,
      `${IntegrationOrchestrationValidationIdentity.canonicalId} → EIL-4:5/IntegrationOrchestrationManifest`,
    ]),
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
