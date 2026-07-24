/**
 * NEX-3:2 — Declarative Registry validation metadata.
 */

export const FeaturesModulesRegistryValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-3:2/Validation/UniqueIdentifiers", requirement: "Registry identifiers shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/UniqueNames", requirement: "Registry names shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/FeatureFamilyReference", requirement: "Every Feature belongs to one Feature Family.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/FamilyCategoryReference", requirement: "Every Feature Family belongs to one Feature Category.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/ModuleCategoryReference", requirement: "Every Module belongs to one Module Category.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/CapabilityGroupReference", requirement: "Every Capability belongs to one Capability Group.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/DependencyIdentifier", requirement: "Every Dependency has an identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/AcyclicRelationships", requirement: "No circular metadata relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/InventoryConsistency", requirement: "Registry inventory shall remain consistent.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:2/Validation/ImmutableMetadata", requirement: "Registry metadata shall be immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
