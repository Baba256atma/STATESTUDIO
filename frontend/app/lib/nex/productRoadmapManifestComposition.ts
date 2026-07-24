/**
 * NEX-2:5 — Manifest composition and supporting declarations.
 */

import { ProductRoadmapValidation } from "./productRoadmapValidation.ts";

export const ProductRoadmapManifestComposition = Object.freeze({
  id: "NEX-2:5/ManifestComposition",
  sections: Object.freeze([
    "ManifestIdentity",
    "ManifestInventory",
    "RegistryInventory",
    "ModelInventory",
    "ValidationInventory",
    "RoadmapInventory",
    "RelationshipInventory",
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
    id: "NEX-2:5/ManifestCompatibility",
    backwardCompatible: true,
    forwardExtendable: true,
    metadataCompatible: true,
    versionCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-2:5/ManifestDependencies",
    upstreamId: ProductRoadmapValidation.identity.id,
    upstreamPhase: "NEX-2:4",
    validationOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-2:5/ManifestLifecycle",
    stage: "PublishedForPlatform",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-2:5/ManifestReadiness",
    status: "ReadyForPlatform",
    readyForPlatform: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-2:5/ManifestPublication",
    publicationType: "ValidatedRoadmapMetadata",
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  metadata: Object.freeze({
    id: "NEX-2:5/ManifestMetadata",
    sourceValidationId: ProductRoadmapValidation.identity.id,
    inventoryDerivedFromValidation: true,
    metadataOnly: true,
    immutable: true,
  }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
