/**
 * NEX-2:2 — Declarative Registry validation metadata.
 */

export const ProductRoadmapRegistryValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-2:2/Validation/UniqueIdentifiers", requirement: "Registry identifiers shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/UniqueNames", requirement: "Registry names shall be unique.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/MilestoneReleaseReference", requirement: "Every milestone references one release strategy.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/InitiativeMissionReference", requirement: "Every initiative references one roadmap mission.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/PriorityThemeReference", requirement: "Every priority belongs to one product theme.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/OutcomeCriteriaReference", requirement: "Every outcome references one success criterion.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/ConstraintIdentifier", requirement: "Every planning constraint has an identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/AssumptionIdentifier", requirement: "Every planning assumption has an identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/AcyclicRelationships", requirement: "No circular metadata relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:2/Validation/ImmutableMetadata", requirement: "Registry metadata shall be immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
