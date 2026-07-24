/**
 * NEX-3:1 — Declarative Features & Modules Foundation rules.
 */

export const FeaturesModulesFoundationRules = Object.freeze([
  Object.freeze({ id: "NEX-3:1/Rule/FeatureCategory", requirement: "Every feature shall belong to one feature category.", category: "Reference", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/ModuleCategory", requirement: "Every module shall belong to one module category.", category: "Reference", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/UniqueCapabilityGroup", requirement: "Every capability group shall have a unique identifier.", category: "Uniqueness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/FeatureBoundary", requirement: "Every feature boundary shall be explicitly defined.", category: "Completeness", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/ModuleDependency", requirement: "Every module dependency shall be declared.", category: "Dependency", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/CanonicalComposition", requirement: "Product composition shall be canonical.", category: "Composition", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/ImmutableGovernance", requirement: "Governance metadata shall be immutable.", category: "Integrity", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/VersionedMetadata", requirement: "Foundation metadata shall be versioned.", category: "Versioning", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/ImplementationIndependent", requirement: "Foundation shall remain implementation independent.", category: "Architecture", executesRule: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:1/Rule/NoExecutableBehavior", requirement: "No executable behavior is permitted.", category: "Architecture", executesRule: false, metadataOnly: true, immutable: true }),
] as const);
