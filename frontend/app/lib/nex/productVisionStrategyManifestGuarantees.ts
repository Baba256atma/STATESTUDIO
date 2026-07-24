/**
 * NEX-1:5 — Immutable product guarantees.
 *
 * Declarative publication properties only; not runtime guarantees.
 */

export const ProductVisionStrategyManifestGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-1:5/Guarantee/MetadataOnly", name: "Metadata Only", description: "The package contains product-reference metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/Immutable", name: "Immutable", description: "Published manifest records are immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/Canonical", name: "Canonical", description: "The manifest identifies the canonical product strategy package.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/RegistryDerived", name: "Registry Derived", description: "Registry inventory metadata is represented through the validated package.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/ModelDerived", name: "Model Derived", description: "Model inventory metadata is represented through the validated package.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/ValidationDerived", name: "Validation Derived", description: "Manifest publication metadata derives from NEX-1:4 Validation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/Versioned", name: "Versioned", description: "Manifest metadata carries an explicit version.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/Deterministic", name: "Deterministic", description: "Manifest ordering and inventory declarations are stable metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/NonExecutable", name: "Non-Executable", description: "The manifest defines no executable product behavior.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:5/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The manifest does not replace or implement downstream technical architecture.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
