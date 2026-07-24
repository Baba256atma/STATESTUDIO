/**
 * NEX-3:1 — Immutable Features & Modules domain metadata.
 */

export const FeaturesModulesFoundationDomains = Object.freeze([
  Object.freeze({ id: "NEX-3:1/Domain/FeatureVision", name: "Feature Vision", description: "Long-term direction for coherent Nexora product capabilities.", category: "Direction", order: 1, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeaturePrinciples", name: "Feature Principles", description: "Durable principles guiding feature definition and composition.", category: "Governance", order: 2, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureTaxonomy", name: "Feature Taxonomy", description: "Canonical vocabulary organizing product features.", category: "Taxonomy", order: 3, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleTaxonomy", name: "Module Taxonomy", description: "Canonical vocabulary organizing product modules.", category: "Taxonomy", order: 4, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureCategories", name: "Feature Categories", description: "Categories classifying feature intent and value.", category: "Category", order: 5, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleCategories", name: "Module Categories", description: "Categories classifying module responsibility.", category: "Category", order: 6, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/CapabilityGroups", name: "Capability Groups", description: "Coherent groups of related product capabilities.", category: "Capability", order: 7, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureBoundaries", name: "Feature Boundaries", description: "Explicit metadata limits for feature ownership.", category: "Boundary", order: 8, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleBoundaries", name: "Module Boundaries", description: "Explicit metadata limits for module responsibility.", category: "Boundary", order: 9, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureLifecycle", name: "Feature Lifecycle", description: "Declarative lifecycle stages for feature metadata.", category: "Lifecycle", order: 10, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleLifecycle", name: "Module Lifecycle", description: "Declarative lifecycle stages for module metadata.", category: "Lifecycle", order: 11, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureDependencies", name: "Feature Dependencies", description: "Declared metadata relationships among features.", category: "Dependency", order: 12, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleDependencies", name: "Module Dependencies", description: "Declared metadata relationships among modules.", category: "Dependency", order: 13, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ProductComposition", name: "Product Composition", description: "Canonical feature and module composition metadata.", category: "Composition", order: 14, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/ModuleGovernance", name: "Module Governance", description: "Ownership and stewardship metadata for modules.", category: "Governance", order: 15, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Domain/FeatureGovernance", name: "Feature Governance", description: "Ownership and stewardship metadata for features.", category: "Governance", order: 16, metadataOnly: true, immutable: true }),
] as const);

export const FeaturesModulesFoundationVocabulary = Object.freeze({
  vision: Object.freeze({
    id: "NEX-3:1/Vision",
    statement: "Compose Nexora from understandable, bounded, and strategically coherent product capabilities.",
    metadataOnly: true,
    immutable: true,
  }),
  principles: Object.freeze([
    Object.freeze({ id: "NEX-3:1/Principle/CoherentValue", name: "Coherent value", description: "Define features around understandable product value.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:1/Principle/ExplicitBoundaries", name: "Explicit boundaries", description: "Keep feature and module ownership explicit.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:1/Principle/ComposableStructure", name: "Composable structure", description: "Organize capabilities into coherent compositional metadata.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:1/Principle/ImplementationIndependent", name: "Implementation independent", description: "Separate product composition from technical implementation.", metadataOnly: true, immutable: true }),
  ]),
  featureTaxonomy: Object.freeze(["CoreValue", "DecisionSupport", "Collaboration", "Governance"]),
  moduleTaxonomy: Object.freeze(["ProductDomain", "CapabilityGroup", "SharedReference", "Extension"]),
  featureLifecycle: Object.freeze(["Declared", "Defined", "Composed", "Published", "Evolved", "Retired"]),
  moduleLifecycle: Object.freeze(["Declared", "Categorized", "Composed", "Published", "Evolved", "Retired"]),
  metadataOnly: true,
  immutable: true,
} as const);
