/**
 * NEX-4:3 — Declarative Model validation metadata.
 */

export const UserJourneyExperienceModelValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-4:3/Validation/UniqueIdentifier", requirement: "Every model shall have a unique identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/CanonicalName", requirement: "Every model shall have a canonical name.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/PersonaJourney", requirement: "Every Persona belongs to one User Journey.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/StageJourney", requirement: "Every Journey Stage belongs to one Journey.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/TouchpointStage", requirement: "Every Touchpoint belongs to one Journey Stage.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/UniqueBoundary", requirement: "Every Experience Boundary is uniquely identified.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/UniqueSuccessCriterion", requirement: "Every Success Criterion is uniquely identified.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/AcyclicRelationships", requirement: "No circular model relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/InventoryConsistency", requirement: "Model inventory shall remain internally consistent.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:3/Validation/ImmutableMetadata", requirement: "Model metadata shall remain immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
