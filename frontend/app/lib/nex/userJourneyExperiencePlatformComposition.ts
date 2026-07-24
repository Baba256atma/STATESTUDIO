/**
 * NEX-4:6 — Platform composition and supporting declarations.
 */

import { UserJourneyExperienceManifest } from "./userJourneyExperienceManifest.ts";

export const UserJourneyExperiencePlatformComposition = Object.freeze({
  id: "NEX-4:6/PlatformComposition",
  sections: Object.freeze(["PlatformIdentity", "PlatformInventory", "PlatformComposition", "PlatformCapabilities", "PlatformGuarantees", "PlatformCompatibility", "PlatformDependencies", "PlatformReadiness", "PlatformLifecycle", "PlatformPublication", "PlatformVersioning", "PlatformRelationships", "PlatformConstraints", "PlatformAssumptions", "PlatformMetadata", "PublicApiInventory"]),
  compatibility: UserJourneyExperienceManifest.compatibility,
  dependencies: Object.freeze({ id: "NEX-4:6/PlatformDependencies", upstreamId: UserJourneyExperienceManifest.identity.id, upstreamPhase: "NEX-4:5", manifestOnly: true, runtimeDependency: false, otherDependenciesAllowed: false, metadataOnly: true, immutable: true }),
  readiness: Object.freeze({ id: "NEX-4:6/PlatformReadiness", status: "ReadyForCertification", readyForCertification: true, executesReadinessGate: false, metadataOnly: true, immutable: true }),
  lifecycle: Object.freeze({ id: "NEX-4:6/PlatformLifecycle", stage: "ComposedForCertification", executesTransitions: false, metadataOnly: true, immutable: true }),
  publication: Object.freeze({ id: "NEX-4:6/PlatformPublication", publicationType: "UserJourneyExperienceMetadataSurface", sourceManifestId: UserJourneyExperienceManifest.identity.id, executablePublication: false, metadataOnly: true, immutable: true }),
  versioning: Object.freeze({ id: "NEX-4:6/PlatformVersioning", platformVersion: "1.0.0", manifestVersion: UserJourneyExperienceManifest.identity.manifestVersion, versionResolution: false, metadataOnly: true, immutable: true }),
  relationships: Object.freeze([
    Object.freeze({ id: "NEX-4:6/Relationship/PlatformComposesManifest", source: "NEX-4:6/UserJourneyExperiencePlatform", relationship: "composes", target: UserJourneyExperienceManifest.identity.id, runtimeRelationship: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:6/Relationship/PlatformPublishesMetadata", source: "NEX-4:6/UserJourneyExperiencePlatform", relationship: "publishes", target: "NEX-4:6/UserJourneyExperienceMetadata", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  ]),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-4:6/Constraint/MetadataCompositionOnly", name: "Metadata composition only", description: "The Platform composes metadata without UI or UX behavior.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:6/Constraint/ManifestDependencyOnly", name: "Manifest dependency only", description: "The Platform consumes only NEX-4:5 Manifest.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-4:6/Assumption/CanonicalManifest", name: "Canonical Manifest", description: "NEX-4:5 is the canonical Platform metadata source.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:6/Assumption/CertificationConsumer", name: "Certification consumer", description: "NEX-4:7 reviews Platform metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  metadata: Object.freeze({ id: "NEX-4:6/PlatformMetadata", sourceManifestId: UserJourneyExperienceManifest.identity.id, inventoryDerivedFromManifest: true, compositionOnly: true, metadataOnly: true, immutable: true }),
  compositionOnly: true,
  metadataOnly: true,
  immutable: true,
} as const);
