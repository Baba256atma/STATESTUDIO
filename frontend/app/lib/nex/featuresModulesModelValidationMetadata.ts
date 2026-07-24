/**
 * NEX-3:3 — Declarative Model validation metadata.
 */

export const FeaturesModulesModelValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-3:3/Validation/UniqueIdentifier", requirement: "Every model shall have a unique identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/CanonicalName", requirement: "Every model shall have a canonical name.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/FeatureFamily", requirement: "Every Feature belongs to one Feature Family.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/FamilyCategory", requirement: "Every Feature Family belongs to one Feature Category.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/ModuleCategory", requirement: "Every Module belongs to one Module Category.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/CapabilityGroup", requirement: "Every Capability belongs to one Capability Group.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/DependencyTarget", requirement: "Every Dependency references a valid target.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/AcyclicRelationships", requirement: "No circular model relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/InventoryConsistency", requirement: "Model inventory shall remain internally consistent.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:3/Validation/ImmutableMetadata", requirement: "Model metadata shall remain immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
