/**
 * EIL-8:6 — Executive Integration Suite Platform Composition.
 *
 * Immutable composition referencing Foundation → Registry → Model →
 * Validation → Manifest through the Manifest aggregate only.
 * No duplicated metadata.
 *
 * Ownership: owned exclusively by EIL-8:6.
 */

import { ExecutiveIntegrationSuiteManifest } from "./executiveIntegrationSuiteManifest.ts";
import { ExecutiveIntegrationSuitePlatformCanonicalId } from "./executiveIntegrationSuitePlatformIdentity.ts";

const manifest = ExecutiveIntegrationSuiteManifest;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

/**
 * Canonical immutable Platform composition.
 * Upstream references only — no content duplication.
 */
export const ExecutiveIntegrationSuitePlatformComposition = Object.freeze({
  compositionId: "EIL-8:6/Composition" as const,
  platformCanonicalId: ExecutiveIntegrationSuitePlatformCanonicalId,
  foundation: Object.freeze({
    phase: "EIL-8:1" as const,
    canonicalId: foundation.identity.canonicalId,
    identity: foundation.identity,
    aggregate: foundation,
    entryPoint: "executiveIntegrationSuiteFoundation.ts" as const,
  }),
  registry: Object.freeze({
    phase: "EIL-8:2" as const,
    canonicalId: registry.identity.canonicalId,
    identity: registry.identity,
    aggregate: registry,
    entryPoint: "executiveIntegrationSuiteRegistry.ts" as const,
  }),
  model: Object.freeze({
    phase: "EIL-8:3" as const,
    canonicalId: model.identity.canonicalId,
    identity: model.identity,
    aggregate: model,
    entryPoint: "executiveIntegrationSuiteModel.ts" as const,
  }),
  validation: Object.freeze({
    phase: "EIL-8:4" as const,
    canonicalId: validation.identity.canonicalId,
    identity: validation.identity,
    aggregate: validation,
    entryPoint: "executiveIntegrationSuiteValidation.ts" as const,
  }),
  manifest: Object.freeze({
    phase: "EIL-8:5" as const,
    canonicalId: manifest.identity.canonicalId,
    identity: manifest.identity,
    aggregate: manifest,
    entryPoint: "executiveIntegrationSuiteManifest.ts" as const,
  }),
  canonicalReferenceChain: Object.freeze([
    foundation.identity.canonicalId,
    registry.identity.canonicalId,
    model.identity.canonicalId,
    validation.identity.canonicalId,
    manifest.identity.canonicalId,
    ExecutiveIntegrationSuitePlatformCanonicalId,
  ] as const),
  duplicatesUpstreamContents: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
