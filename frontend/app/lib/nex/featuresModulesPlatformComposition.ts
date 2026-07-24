/**
 * NEX-3:6 — Platform composition and supporting declarations.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";

export const FeaturesModulesPlatformComposition = Object.freeze({
  id: "NEX-3:6/PlatformComposition",
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
  compatibility: FeaturesModulesManifest.compatibility,
  dependencies: Object.freeze({
    id: "NEX-3:6/PlatformDependencies",
    upstreamId: FeaturesModulesManifest.identity.id,
    upstreamPhase: "NEX-3:5",
    manifestOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-3:6/PlatformReadiness",
    status: "ReadyForCertification",
    readyForCertification: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-3:6/PlatformLifecycle",
    stage: "ComposedForCertification",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-3:6/PlatformPublication",
    publicationType: "FeaturesModulesMetadataSurface",
    sourceManifestId: FeaturesModulesManifest.identity.id,
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-3:6/PlatformVersioning",
    platformVersion: "1.0.0",
    manifestVersion: FeaturesModulesManifest.identity.manifestVersion,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  relationships: Object.freeze([
    Object.freeze({ id: "NEX-3:6/Relationship/PlatformComposesManifest", source: "NEX-3:6/FeaturesModulesPlatform", relationship: "composes", target: FeaturesModulesManifest.identity.id, runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:6/Relationship/PlatformPublishesMetadata", source: "NEX-3:6/FeaturesModulesPlatform", relationship: "publishes", target: "NEX-3:6/FeaturesModulesMetadata", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  ]),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-3:6/Constraint/MetadataCompositionOnly", name: "Metadata composition only", description: "The Platform composes metadata without feature execution or module loading.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:6/Constraint/ManifestDependencyOnly", name: "Manifest dependency only", description: "The Platform consumes only NEX-3:5 Manifest.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-3:6/Assumption/CanonicalManifest", name: "Canonical Manifest", description: "NEX-3:5 is the canonical Platform metadata source.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:6/Assumption/CertificationConsumer", name: "Certification consumer", description: "NEX-3:7 reviews Platform metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  metadata: Object.freeze({
    id: "NEX-3:6/PlatformMetadata",
    sourceManifestId: FeaturesModulesManifest.identity.id,
    inventoryDerivedFromManifest: true,
    compositionOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
