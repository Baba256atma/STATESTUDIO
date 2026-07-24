/**
 * NEX-1:6 — Platform composition and supporting declarations.
 */

import { ProductVisionStrategyManifest } from "./productVisionStrategyManifest.ts";

export const ProductVisionStrategyPlatformComposition = Object.freeze({
  id: "NEX-1:6/PlatformComposition",
  sections: Object.freeze([
    "PlatformIdentity",
    "PlatformInventory",
    "PlatformComposition",
    "PlatformCapabilities",
    "PlatformGuarantees",
    "PlatformCompatibility",
    "PlatformDependencies",
    "PlatformReadiness",
    "PlatformLifecycle",
    "PlatformPublication",
    "PlatformVersioning",
    "PlatformRelationships",
    "PlatformConstraints",
    "PlatformAssumptions",
    "PlatformMetadata",
    "PublicApiInventory",
  ]),
  compatibility: Object.freeze({
    id: "NEX-1:6/PlatformCompatibility",
    backwardCompatible: true,
    forwardExtendable: true,
    metadataCompatible: true,
    versionCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-1:6/PlatformDependencies",
    upstreamId: ProductVisionStrategyManifest.identity.id,
    upstreamPhase: "NEX-1:5",
    manifestOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-1:6/PlatformReadiness",
    status: "ReadyForCertification",
    readyForCertification: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-1:6/PlatformLifecycle",
    stage: "ComposedForCertification",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-1:6/PlatformPublication",
    publicationType: "MetadataSurface",
    sourceManifestId: ProductVisionStrategyManifest.identity.id,
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-1:6/PlatformVersioning",
    platformVersion: "1.0.0",
    manifestVersion: ProductVisionStrategyManifest.identity.manifestVersion,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  relationships: Object.freeze([
    Object.freeze({ id: "NEX-1:6/Relationship/PlatformComposesManifest", source: "NEX-1:6/ProductVisionStrategyPlatform", relationship: "composes", target: ProductVisionStrategyManifest.identity.id, runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:6/Relationship/PlatformPublishesStrategy", source: "NEX-1:6/ProductVisionStrategyPlatform", relationship: "publishes", target: "NEX-1:6/ProductStrategyMetadata", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  ]),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-1:6/Constraint/MetadataCompositionOnly", name: "Metadata composition only", description: "The Platform composes metadata without behavior.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:6/Constraint/ManifestDependencyOnly", name: "Manifest dependency only", description: "The Platform consumes only NEX-1:5 Manifest.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-1:6/Assumption/CanonicalManifest", name: "Canonical Manifest", description: "NEX-1:5 is the canonical metadata source for Platform composition.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:6/Assumption/CertificationConsumer", name: "Certification consumer", description: "NEX-1:7 reviews Platform metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  metadata: Object.freeze({
    id: "NEX-1:6/PlatformMetadata",
    compositionOnly: true,
    sourceManifestId: ProductVisionStrategyManifest.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
