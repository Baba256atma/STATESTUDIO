/**
 * NEX-3:5 — Exactly ten immutable declarative Manifest guarantees.
 */

export const FeaturesModulesManifestGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-3:5/Guarantee/MetadataOnly", name: "Metadata Only", description: "The Manifest publishes Features & Modules metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/Immutable", name: "Immutable", description: "Manifest records are immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/Canonical", name: "Canonical", description: "The Manifest identifies the canonical publication package.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/ValidationDerived", name: "Validation Derived", description: "Manifest metadata derives exclusively from NEX-3:4 Validation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/RegistryTraceable", name: "Registry Traceable", description: "Registry inventory is traceable through validated metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/ModelTraceable", name: "Model Traceable", description: "Model inventory is traceable through validated metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/Deterministic", name: "Deterministic", description: "Manifest ordering and identities are stable declarations.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The Manifest introduces no technical implementation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/VersionStable", name: "Version Stable", description: "Manifest version metadata is explicit and stable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:5/Guarantee/PublicationReady", name: "Publication Ready", description: "Manifest metadata is ready for Platform composition.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
