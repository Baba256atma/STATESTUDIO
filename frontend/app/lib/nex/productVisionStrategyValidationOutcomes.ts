/**
 * NEX-1:4 — Immutable validation outcome vocabulary.
 */

export const ProductVisionStrategyValidationOutcomes = Object.freeze([
  Object.freeze({ identifier: "NEX-1:4/Outcome/Pass", canonicalName: "Pass", description: "Metadata outcome indicating a declared requirement is satisfied.", severity: "None", terminal: true, evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Outcome/Warning", canonicalName: "Warning", description: "Metadata outcome indicating a non-blocking concern.", severity: "Warning", terminal: true, evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Outcome/Error", canonicalName: "Error", description: "Metadata outcome indicating a blocking concern.", severity: "Error", terminal: true, evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ identifier: "NEX-1:4/Outcome/NotApplicable", canonicalName: "NotApplicable", description: "Metadata outcome indicating a rule does not apply.", severity: "None", terminal: true, evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
] as const);
