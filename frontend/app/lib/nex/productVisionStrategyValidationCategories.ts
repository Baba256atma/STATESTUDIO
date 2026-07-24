/**
 * NEX-1:4 — Immutable validation category metadata.
 */

export const ProductVisionStrategyValidationCategories = Object.freeze([
  Object.freeze({ identifier: "NEX-1:4/Category/Identity", canonicalName: "Identity Validation", description: "Rules concerning canonical identities.", order: 1, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Completeness", canonicalName: "Completeness Validation", description: "Rules concerning required product-reference metadata.", order: 2, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Consistency", canonicalName: "Consistency Validation", description: "Rules concerning internal metadata consistency.", order: 3, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Relationship", canonicalName: "Relationship Validation", description: "Rules concerning declared model relationships.", order: 4, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Reference", canonicalName: "Reference Validation", description: "Rules concerning metadata references.", order: 5, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Dependency", canonicalName: "Dependency Validation", description: "Rules concerning permitted architectural dependencies.", order: 6, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Integrity", canonicalName: "Integrity Validation", description: "Rules concerning immutable structural integrity.", order: 7, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Uniqueness", canonicalName: "Uniqueness Validation", description: "Rules concerning unique identifiers and names.", order: 8, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Compatibility", canonicalName: "Compatibility Validation", description: "Rules concerning declared compatibility metadata.", order: 9, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Category/Readiness", canonicalName: "Readiness Validation", description: "Rules concerning readiness for the Manifest phase.", order: 10, metadataOnly: true, immutable: true }),
] as const);
