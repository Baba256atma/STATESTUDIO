/**
 * NEX-4:4 — Exactly ten immutable validation categories.
 */

export const UserJourneyExperienceValidationCategories = Object.freeze([
  Object.freeze({ id: "NEX-4:4/Category/Identity", name: "Identity Validation", description: "Canonical identity requirements.", order: 1, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Completeness", name: "Completeness Validation", description: "Required experience metadata requirements.", order: 2, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Consistency", name: "Consistency Validation", description: "Internal metadata consistency requirements.", order: 3, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Relationship", name: "Relationship Validation", description: "Declared model relationship requirements.", order: 4, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Reference", name: "Reference Validation", description: "Model reference requirements.", order: 5, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Dependency", name: "Dependency Validation", description: "Architectural dependency requirements.", order: 6, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Integrity", name: "Integrity Validation", description: "Immutable metadata integrity requirements.", order: 7, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Uniqueness", name: "Uniqueness Validation", description: "Identifier and canonical-name uniqueness requirements.", order: 8, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Compatibility", name: "Compatibility Validation", description: "Compatibility declaration requirements.", order: 9, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:4/Category/Readiness", name: "Readiness Validation", description: "Manifest readiness requirements.", order: 10, metadataOnly: true, immutable: true }),
] as const);
