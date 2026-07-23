/**
 * EIL-6:6 — Integration Observability Platform Composition.
 *
 * Immutable composition referencing Foundation → Registry → Model →
 * Validation → Manifest through the Manifest aggregate only.
 * No duplicated metadata.
 *
 * Ownership: owned exclusively by EIL-6:6.
 */

import { IntegrationObservabilityManifest } from "./integrationObservabilityManifest.ts";
import { IntegrationObservabilityPlatformCanonicalId } from "./integrationObservabilityPlatformIdentity.ts";

const manifest = IntegrationObservabilityManifest;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

/**
 * Canonical immutable Platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationObservabilityPlatformComposition = Object.freeze({
  compositionId: "EIL-6:6/Composition" as const,
  platformCanonicalId: IntegrationObservabilityPlatformCanonicalId,
  foundation: Object.freeze({
    phase: "EIL-6:1" as const,
    canonicalId: foundation.identity.canonicalId,
    identity: foundation.identity,
    aggregate: foundation,
    entryPoint: "integrationObservabilityFoundation.ts" as const,
  }),
  registry: Object.freeze({
    phase: "EIL-6:2" as const,
    canonicalId: registry.identity.canonicalId,
    identity: registry.identity,
    aggregate: registry,
    entryPoint: "integrationObservabilityRegistry.ts" as const,
  }),
  model: Object.freeze({
    phase: "EIL-6:3" as const,
    canonicalId: model.identity.canonicalId,
    identity: model.identity,
    aggregate: model,
    entryPoint: "integrationObservabilityModel.ts" as const,
  }),
  validation: Object.freeze({
    phase: "EIL-6:4" as const,
    canonicalId: validation.identity.canonicalId,
    identity: validation.identity,
    aggregate: validation,
    entryPoint: "integrationObservabilityValidation.ts" as const,
  }),
  manifest: Object.freeze({
    phase: "EIL-6:5" as const,
    canonicalId: manifest.identity.canonicalId,
    identity: manifest.identity,
    aggregate: manifest,
    entryPoint: "integrationObservabilityManifest.ts" as const,
  }),
  canonicalReferenceChain: Object.freeze([
    foundation.identity.canonicalId,
    registry.identity.canonicalId,
    model.identity.canonicalId,
    validation.identity.canonicalId,
    manifest.identity.canonicalId,
    IntegrationObservabilityPlatformCanonicalId,
  ] as const),
  duplicatesUpstreamContents: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
