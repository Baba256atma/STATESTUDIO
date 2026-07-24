/**
 * NEX-3:4 — Exactly four immutable validation outcomes.
 */

export const FeaturesModulesValidationOutcomes = Object.freeze([
  Object.freeze({ id: "NEX-3:4/Outcome/Pass", name: "Pass", description: "Declared outcome for a satisfied requirement.", evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Outcome/Warning", name: "Warning", description: "Declared outcome for a non-blocking concern.", evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Outcome/Error", name: "Error", description: "Declared outcome for a blocking concern.", evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:4/Outcome/NotApplicable", name: "NotApplicable", description: "Declared outcome when a requirement does not apply.", evaluatedAtRuntime: false, metadataOnly: true, immutable: true }),
] as const);
