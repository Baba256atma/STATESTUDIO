/**
 * NEX-4:2 — Declarative Registry validation metadata.
 */

export const UserJourneyExperienceRegistryValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-4:2/Validation/UniqueIdentifiers", requirement: "Registry identifiers shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/UniqueNames", requirement: "Registry names shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/PersonaJourney", requirement: "Every Persona references one primary Journey.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/StageJourney", requirement: "Every Journey Stage belongs to one Journey.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/TouchpointStage", requirement: "Every Touchpoint belongs to one Journey Stage.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/ExplicitBoundary", requirement: "Every Experience Boundary is explicitly defined.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/UniqueSuccessCriterion", requirement: "Every Success Criterion has a unique identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/AcyclicRelationships", requirement: "No circular metadata relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/InventoryConsistency", requirement: "Registry inventory shall remain consistent.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:2/Validation/ImmutableMetadata", requirement: "Registry metadata shall remain immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
