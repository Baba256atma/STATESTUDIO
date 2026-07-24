/**
 * NEX-3:2 — Metadata-only Registry relationships.
 */

export const FeaturesModulesRegistryRelationships = Object.freeze([
  Object.freeze({ id: "NEX-3:2/Relationship/VisionGuidesPrinciples", source: "NEX-3:2/Vision/CoherentComposition", relationship: "guides", target: "NEX-3:2/Principle/CoherentValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/PrinciplesDefineFamilies", source: "NEX-3:2/Principle/CoherentValue", relationship: "define", target: "NEX-3:2/FeatureFamily/CoherentValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/FamiliesContainFeatures", source: "NEX-3:2/FeatureFamily/CoherentValue", relationship: "contain", target: "NEX-3:2/Feature/ProductValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/CategoriesOrganizeFamilies", source: "NEX-3:2/FeatureCategory/CoreValue", relationship: "organize", target: "NEX-3:2/FeatureFamily/CoherentValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/GroupsContainCapabilities", source: "NEX-3:2/CapabilityGroup/ProductComposition", relationship: "contain", target: "NEX-3:2/Capability/CanonicalComposition", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/ModulesExposeCapabilities", source: "NEX-3:2/Module/ProductDomain", relationship: "expose", target: "NEX-3:2/Capability/CanonicalComposition", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/FeatureDependenciesReferenceFeatures", source: "NEX-3:2/FeatureDependency/DeclaredReference", relationship: "reference", target: "NEX-3:2/Feature/ProductValue", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/ModuleDependenciesReferenceModules", source: "NEX-3:2/ModuleDependency/DeclaredReference", relationship: "reference", target: "NEX-3:2/Module/ProductDomain", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/CompositionContainsModules", source: "NEX-3:2/Composition/CanonicalProduct", relationship: "contains", target: "NEX-3:2/Module/ProductDomain", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Relationship/GovernanceGovernsComposition", source: "NEX-3:2/Governance/ProductStewardship", relationship: "governs", target: "NEX-3:2/Composition/CanonicalProduct", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
