/**
 * EIL-7:6 — Integration Governance Platform Composition.
 *
 * Immutable composition referencing Foundation → Registry → Model →
 * Validation → Manifest through the Manifest aggregate only.
 * No duplicated metadata.
 *
 * Ownership: owned exclusively by EIL-7:6.
 */

import { IntegrationGovernanceManifest } from "./integrationGovernanceManifest.ts";
import { IntegrationGovernancePlatformCanonicalId } from "./integrationGovernancePlatformIdentity.ts";

const manifest = IntegrationGovernanceManifest;
const validation = manifest.validationReference.aggregate;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

/**
 * Canonical immutable Platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationGovernancePlatformComposition = Object.freeze({
  compositionId: "EIL-7:6/Composition" as const,
  platformCanonicalId: IntegrationGovernancePlatformCanonicalId,
  foundation: Object.freeze({
    phase: "EIL-7:1" as const,
    canonicalId: foundation.identity.canonicalId,
    identity: foundation.identity,
    aggregate: foundation,
    entryPoint: "integrationGovernanceFoundation.ts" as const,
  }),
  registry: Object.freeze({
    phase: "EIL-7:2" as const,
    canonicalId: registry.identity.canonicalId,
    identity: registry.identity,
    aggregate: registry,
    entryPoint: "integrationGovernanceRegistry.ts" as const,
  }),
  model: Object.freeze({
    phase: "EIL-7:3" as const,
    canonicalId: model.identity.canonicalId,
    identity: model.identity,
    aggregate: model,
    entryPoint: "integrationGovernanceModel.ts" as const,
  }),
  validation: Object.freeze({
    phase: "EIL-7:4" as const,
    canonicalId: validation.identity.canonicalId,
    identity: validation.identity,
    aggregate: validation,
    entryPoint: "integrationGovernanceValidation.ts" as const,
  }),
  manifest: Object.freeze({
    phase: "EIL-7:5" as const,
    canonicalId: manifest.identity.canonicalId,
    identity: manifest.identity,
    aggregate: manifest,
    entryPoint: "integrationGovernanceManifest.ts" as const,
  }),
  canonicalReferenceChain: Object.freeze([
    foundation.identity.canonicalId,
    registry.identity.canonicalId,
    model.identity.canonicalId,
    validation.identity.canonicalId,
    manifest.identity.canonicalId,
    IntegrationGovernancePlatformCanonicalId,
  ] as const),
  duplicatesUpstreamContents: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
