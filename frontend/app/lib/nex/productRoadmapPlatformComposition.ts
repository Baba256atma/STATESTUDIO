/**
 * NEX-2:6 — Platform composition and supporting metadata declarations.
 */

import { ProductRoadmapManifest } from "./productRoadmapManifest.ts";

export const ProductRoadmapPlatformComposition = Object.freeze({
  id: "NEX-2:6/PlatformComposition",
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
  compatibility: ProductRoadmapManifest.compatibility,
  dependencies: Object.freeze({
    id: "NEX-2:6/PlatformDependencies",
    upstreamId: ProductRoadmapManifest.identity.id,
    upstreamPhase: "NEX-2:5",
    manifestOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-2:6/PlatformReadiness",
    status: "ReadyForCertification",
    readyForCertification: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-2:6/PlatformLifecycle",
    stage: "ComposedForCertification",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-2:6/PlatformPublication",
    publicationType: "RoadmapMetadataSurface",
    sourceManifestId: ProductRoadmapManifest.identity.id,
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-2:6/PlatformVersioning",
    platformVersion: "1.0.0",
    manifestVersion: ProductRoadmapManifest.identity.manifestVersion,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  relationships: Object.freeze([
    Object.freeze({ id: "NEX-2:6/Relationship/PlatformComposesManifest", source: "NEX-2:6/ProductRoadmapPlatform", relationship: "composes", target: ProductRoadmapManifest.identity.id, runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:6/Relationship/PlatformPublishesRoadmap", source: "NEX-2:6/ProductRoadmapPlatform", relationship: "publishes", target: "NEX-2:6/ProductRoadmapMetadata", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  ]),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-2:6/Constraint/MetadataCompositionOnly", name: "Metadata composition only", description: "The Platform composes metadata without roadmap execution.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:6/Constraint/ManifestDependencyOnly", name: "Manifest dependency only", description: "The Platform consumes only NEX-2:5 Manifest.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-2:6/Assumption/CanonicalManifest", name: "Canonical Manifest", description: "NEX-2:5 is the canonical Platform metadata source.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:6/Assumption/CertificationConsumer", name: "Certification consumer", description: "NEX-2:7 reviews Platform metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  metadata: Object.freeze({
    id: "NEX-2:6/PlatformMetadata",
    sourceManifestId: ProductRoadmapManifest.identity.id,
    inventoryDerivedFromManifest: true,
    compositionOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
