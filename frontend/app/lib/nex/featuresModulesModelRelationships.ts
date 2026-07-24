/**
 * NEX-3:3 — Immutable metadata-only Model relationships.
 */

export const FeaturesModulesModelRelationships = Object.freeze([
  Object.freeze({ id: "NEX-3:3/Relationship/VisionGuidesPrinciples", sourceModel: "NEX-3:3/Model/ProductFeatureVision", relationship: "guides", targetModel: "NEX-3:3/Model/FeaturePrinciple", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/PrinciplesDefineFamilies", sourceModel: "NEX-3:3/Model/FeaturePrinciple", relationship: "define", targetModel: "NEX-3:3/Model/FeatureFamily", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/FamiliesContainFeatures", sourceModel: "NEX-3:3/Model/FeatureFamily", relationship: "contain", targetModel: "NEX-3:3/ProductFeature", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/CategoriesOrganizeFamilies", sourceModel: "NEX-3:3/Model/FeatureCategory", relationship: "organize", targetModel: "NEX-3:3/Model/FeatureFamily", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/ModuleCategoriesOrganizeModules", sourceModel: "NEX-3:3/Model/ModuleCategory", relationship: "organize", targetModel: "NEX-3:3/Model/ProductModule", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/ModulesExposeCapabilities", sourceModel: "NEX-3:3/Model/ProductModule", relationship: "expose", targetModel: "NEX-3:3/Model/ProductCapability", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/GroupsContainCapabilities", sourceModel: "NEX-3:3/Model/CapabilityGroup", relationship: "contain", targetModel: "NEX-3:3/Model/ProductCapability", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/CompositionContainsModules", sourceModel: "NEX-3:3/Model/ProductComposition", relationship: "contains", targetModel: "NEX-3:3/Model/ProductModule", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/FeatureDependenciesReferenceFeatures", sourceModel: "NEX-3:3/Model/FeatureDependency", relationship: "reference", targetModel: "NEX-3:3/ProductFeature", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/ModuleDependenciesReferenceModules", sourceModel: "NEX-3:3/Model/ModuleDependency", relationship: "reference", targetModel: "NEX-3:3/Model/ProductModule", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/FeatureLifecycleGovernsFeatures", sourceModel: "NEX-3:3/Model/FeatureLifecycle", relationship: "governs", targetModel: "NEX-3:3/ProductFeature", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/ModuleLifecycleGovernsModules", sourceModel: "NEX-3:3/Model/ModuleLifecycle", relationship: "governs", targetModel: "NEX-3:3/Model/ProductModule", runtimeRelationship: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Relationship/GovernanceOverseesComposition", sourceModel: "NEX-3:3/Model/FeaturesModulesGovernance", relationship: "oversees", targetModel: "NEX-3:3/Model/ProductComposition", runtimeRelationship: false, metadataOnly: true, immutable: true }),
] as const);
