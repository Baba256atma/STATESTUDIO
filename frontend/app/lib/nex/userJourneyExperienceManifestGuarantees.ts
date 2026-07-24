/**
 * NEX-4:5 — Exactly ten immutable Manifest guarantees.
 */

export const UserJourneyExperienceManifestGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-4:5/Guarantee/MetadataOnly", name: "Metadata Only", description: "The Manifest publishes User Journey & Experience metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/Immutable", name: "Immutable", description: "Manifest records are immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/Canonical", name: "Canonical", description: "The Manifest identifies the canonical publication package.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/ValidationDerived", name: "Validation Derived", description: "Manifest metadata derives exclusively from NEX-4:4 Validation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/RegistryTraceable", name: "Registry Traceable", description: "Registry inventory is traceable through validated metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/ModelTraceable", name: "Model Traceable", description: "Model inventory is traceable through validated metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/Deterministic", name: "Deterministic", description: "Manifest ordering and identities are stable declarations.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The Manifest introduces no UI or runtime implementation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/VersionStable", name: "Version Stable", description: "Manifest version metadata is explicit and stable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:5/Guarantee/PublicationReady", name: "Publication Ready", description: "Manifest metadata is ready for Platform composition.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
