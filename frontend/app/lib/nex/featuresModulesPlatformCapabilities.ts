/**
 * NEX-3:6 — Exactly eight immutable descriptive Platform capabilities.
 */

import { FeaturesModulesManifest } from "./featuresModulesManifest.ts";

export const FeaturesModulesPlatformCapabilities = Object.freeze([
  Object.freeze({ id: "NEX-3:6/Capability/ProductFeaturePublication", name: "Product Feature Publication", description: "Represents canonical product feature metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[0], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/ProductModulePublication", name: "Product Module Publication", description: "Represents canonical product module metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[1], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/CapabilityPublication", name: "Capability Publication", description: "Represents product capability metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[2], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/FeatureDependencyPublication", name: "Feature Dependency Publication", description: "Represents feature dependency metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[3], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/ModuleDependencyPublication", name: "Module Dependency Publication", description: "Represents module dependency metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[4], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/ProductCompositionPublication", name: "Product Composition Publication", description: "Represents canonical product composition metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[5], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/GovernancePublication", name: "Governance Publication", description: "Represents Features & Modules governance metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[6], executable: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Capability/FeatureLifecyclePublication", name: "Feature Lifecycle Publication", description: "Represents feature lifecycle metadata.", sourceSubject: FeaturesModulesManifest.platformSeedMetadata.capabilitySubjects[7], executable: false, metadataOnly: true, immutable: true }),
] as const);
