/**
 * NEX-1:5 — Manifest composition, lifecycle, dependencies, constraints,
 * and assumptions.
 */

import { ProductVisionStrategyValidation } from "./productVisionStrategyValidation.ts";

export const ProductVisionStrategyManifestComposition = Object.freeze({
  id: "NEX-1:5/ManifestComposition",
  entries: Object.freeze([
    "ManifestIdentity",
    "ManifestInventory",
    "ModelInventory",
    "RegistryInventory",
    "ValidationInventory",
    "ProductStrategyInventory",
    "RelationshipInventory",
    "PublicApiInventory",
    "CompatibilityDeclaration",
    "ReadinessDeclaration",
    "ProductGuarantees",
    "ProductConstraints",
    "ProductAssumptions",
    "ManifestLifecycle",
    "ManifestDependencies",
    "ManifestComposition",
  ]),
  lifecycle: Object.freeze({
    id: "NEX-1:5/ManifestLifecycle",
    stage: "PublishedForPlatform",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-1:5/ManifestDependencies",
    upstreamId: ProductVisionStrategyValidation.identity.id,
    upstreamPhase: "NEX-1:4",
    validationOnly: true,
    downstreamRuntimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  productConstraints: Object.freeze([
    Object.freeze({ id: "NEX-1:5/Constraint/MetadataPublicationOnly", name: "Metadata publication only", description: "The manifest publishes metadata and implements no product behavior.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:5/Constraint/ValidationDependencyOnly", name: "Validation dependency only", description: "The manifest consumes only NEX-1:4 Validation.", metadataOnly: true, immutable: true }),
  ]),
  productAssumptions: Object.freeze([
    Object.freeze({ id: "NEX-1:5/Assumption/ValidatedPackage", name: "Validated package metadata", description: "Published inventory represents the canonical NEX-1:4 validated package.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:5/Assumption/PlatformConsumer", name: "Platform metadata consumer", description: "NEX-1:6 consumes this manifest as metadata without changing its meaning.", metadataOnly: true, immutable: true }),
  ]),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
