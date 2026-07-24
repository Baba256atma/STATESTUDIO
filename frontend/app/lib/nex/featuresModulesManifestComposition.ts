/**
 * NEX-3:5 — Manifest composition and declarations.
 */

import { FeaturesModulesValidation } from "./featuresModulesValidation.ts";

export const FeaturesModulesManifestComposition = Object.freeze({
  id: "NEX-3:5/ManifestComposition",
  sections: Object.freeze([
    "ManifestIdentity",
    "ManifestInventory",
    "RegistryInventory",
    "ModelInventory",
    "ValidationInventory",
    "FeaturesInventory",
    "ModulesInventory",
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
  compatibility: Object.freeze({
    id: "NEX-3:5/ManifestCompatibility",
    backwardCompatible: true,
    forwardExtendable: true,
    metadataCompatible: true,
    versionCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-3:5/ManifestDependencies",
    upstreamId: FeaturesModulesValidation.identity.id,
    upstreamPhase: "NEX-3:4",
    validationOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-3:5/ManifestLifecycle",
    stage: "PublishedForPlatform",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-3:5/ManifestReadiness",
    status: "ReadyForPlatform",
    readyForPlatform: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-3:5/ManifestPublication",
    publicationType: "ValidatedFeaturesModulesMetadata",
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  metadata: Object.freeze({
    id: "NEX-3:5/ManifestMetadata",
    sourceValidationId: FeaturesModulesValidation.identity.id,
    inventoryDerivedFromValidation: true,
    metadataOnly: true,
    immutable: true,
  }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
