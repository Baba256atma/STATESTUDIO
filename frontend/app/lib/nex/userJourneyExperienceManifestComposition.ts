/**
 * NEX-4:5 — Manifest composition and declarations.
 */

import { UserJourneyExperienceValidation } from "./userJourneyExperienceValidation.ts";

export const UserJourneyExperienceManifestComposition = Object.freeze({
  id: "NEX-4:5/ManifestComposition",
  sections: Object.freeze([
    "ManifestIdentity",
    "ManifestInventory",
    "RegistryInventory",
    "ModelInventory",
    "ValidationInventory",
    "JourneyInventory",
    "ExperienceInventory",
    "PublicApiInventory",
    "ManifestComposition",
    "ManifestGuarantees",
    "ManifestCompatibility",
    "ManifestDependencies",
    "ManifestLifecycle",
    "ManifestReadiness",
    "ManifestPublication",
    "ManifestMetadata",
  ]),
  compatibility: Object.freeze({ id: "NEX-4:5/ManifestCompatibility", backwardCompatible: true, forwardExtendable: true, metadataCompatible: true, versionCompatible: true, metadataOnly: true, immutable: true }),
  dependencies: Object.freeze({ id: "NEX-4:5/ManifestDependencies", upstreamId: UserJourneyExperienceValidation.identity.id, upstreamPhase: "NEX-4:4", validationOnly: true, runtimeDependency: false, otherDependenciesAllowed: false, metadataOnly: true, immutable: true }),
  lifecycle: Object.freeze({ id: "NEX-4:5/ManifestLifecycle", stage: "PublishedForPlatform", executesTransitions: false, metadataOnly: true, immutable: true }),
  readiness: Object.freeze({ id: "NEX-4:5/ManifestReadiness", status: "ReadyForPlatform", readyForPlatform: true, executesReadinessGate: false, metadataOnly: true, immutable: true }),
  publication: Object.freeze({ id: "NEX-4:5/ManifestPublication", publicationType: "ValidatedUserJourneyExperienceMetadata", executablePublication: false, metadataOnly: true, immutable: true }),
  metadata: Object.freeze({ id: "NEX-4:5/ManifestMetadata", sourceValidationId: UserJourneyExperienceValidation.identity.id, inventoryDerivedFromValidation: true, metadataOnly: true, immutable: true }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
