/**
 * NEX-2:3 — Declarative Roadmap Model validation metadata.
 */

export const ProductRoadmapModelValidationMetadata = Object.freeze([
  Object.freeze({ id: "NEX-2:3/Validation/UniqueIdentifier", requirement: "Every model shall have a unique identifier.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/CanonicalName", requirement: "Every model shall have a canonical name.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/MilestoneRelease", requirement: "Every milestone references one release strategy.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/InitiativeMission", requirement: "Every initiative references one roadmap mission.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/PriorityTheme", requirement: "Every priority belongs to one product theme.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/OutcomeCriteria", requirement: "Every outcome references one success criterion.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/GovernanceLifecycle", requirement: "Every governance model references one lifecycle.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/AcyclicRelationships", requirement: "No circular model relationships are permitted.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/ImmutableModels", requirement: "Models shall be immutable.", executesValidation: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:3/Validation/InventoryConsistency", requirement: "Model inventory shall be internally consistent.", executesValidation: false, metadataOnly: true, immutable: true }),
] as const);
