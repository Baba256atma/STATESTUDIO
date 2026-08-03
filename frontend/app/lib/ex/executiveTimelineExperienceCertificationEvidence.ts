/** EX-3:7 immutable read-only Certification evidence. */

import { ExecutiveTimelineExperiencePlatform } from "./executiveTimelineExperiencePlatform.ts";

const platform = ExecutiveTimelineExperiencePlatform;
const manifest = platform.manifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

export const ExecutiveTimelineExperienceCertificationEvidenceRecord =
  Object.freeze({
    evidenceId: "EX-3:7/ExecutiveTimelineExperienceCertificationEvidence" as const,
    platformIdentity: platform.identity.id,
    manifestIdentity: manifest.identity.id,
    validationIdentity: validation.identity.id,
    modelIdentity: model.identity.id,
    registryIdentity: registry.identity.id,
    foundationIdentity: foundation.identity.id,
    capabilityBindingCount: platform.capabilityBindingCount,
    contractCount: platform.contractCount,
    version: "1.0.0" as const,
    readiness: platform.readiness,
    platformStatus: platform.status,
    platformEligibility: platform.canonicalEligibility.eligibility,
    readOnly: true as const,
    duplicatesUpstream: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    sideEffectFree: true as const,
  });
