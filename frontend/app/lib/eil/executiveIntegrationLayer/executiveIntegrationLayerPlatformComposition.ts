/**
 * EIL-9:6 — Executive Integration Layer Platform Composition.
 *
 * Immutable composition referencing Foundation → Registry → Model →
 * Validation → Manifest through the Manifest aggregate only.
 * No duplicated metadata.
 *
 * Ownership: owned exclusively by EIL-9:6.
 */

import { ExecutiveIntegrationLayerManifest } from "./executiveIntegrationLayerManifest.ts";
import { ExecutiveIntegrationLayerPlatformCanonicalId } from "./executiveIntegrationLayerPlatformIdentity.ts";

const manifest = ExecutiveIntegrationLayerManifest;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

/**
 * Canonical immutable Platform composition.
 * Upstream references only — no content duplication.
 */
export const ExecutiveIntegrationLayerPlatformComposition = Object.freeze({
  compositionId: "EIL-9:6/Composition" as const,
  platformCanonicalId: ExecutiveIntegrationLayerPlatformCanonicalId,
  foundation: Object.freeze({
    phase: "EIL-9:1" as const,
    canonicalId: foundation.identity.canonicalId,
    identity: foundation.identity,
    aggregate: foundation,
    entryPoint: "executiveIntegrationLayerFoundation.ts" as const,
  }),
  registry: Object.freeze({
    phase: "EIL-9:2" as const,
    canonicalId: registry.identity.canonicalId,
    identity: registry.identity,
    aggregate: registry,
    entryPoint: "executiveIntegrationLayerRegistry.ts" as const,
  }),
  model: Object.freeze({
    phase: "EIL-9:3" as const,
    canonicalId: model.identity.canonicalId,
    identity: model.identity,
    aggregate: model,
    entryPoint: "executiveIntegrationLayerModel.ts" as const,
  }),
  validation: Object.freeze({
    phase: "EIL-9:4" as const,
    canonicalId: validation.identity.canonicalId,
    identity: validation.identity,
    aggregate: validation,
    entryPoint: "executiveIntegrationLayerValidation.ts" as const,
  }),
  manifest: Object.freeze({
    phase: "EIL-9:5" as const,
    canonicalId: manifest.identity.canonicalId,
    identity: manifest.identity,
    aggregate: manifest,
    entryPoint: "executiveIntegrationLayerManifest.ts" as const,
  }),
  canonicalReferenceChain: Object.freeze([
    foundation.identity.canonicalId,
    registry.identity.canonicalId,
    model.identity.canonicalId,
    validation.identity.canonicalId,
    manifest.identity.canonicalId,
    ExecutiveIntegrationLayerPlatformCanonicalId,
  ] as const),
  duplicatesUpstreamContents: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
