/**
 * NEX-3:6 — Exactly ten immutable declarative Platform guarantees.
 */

export const FeaturesModulesPlatformGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-3:6/Guarantee/MetadataOnly", name: "Metadata Only", description: "The Platform contains metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/Immutable", name: "Immutable", description: "Platform metadata is immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/Canonical", name: "Canonical", description: "The Platform identifies the canonical Features & Modules surface.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/ManifestDerived", name: "Manifest Derived", description: "Platform metadata derives exclusively from NEX-3:5 Manifest.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/Deterministic", name: "Deterministic", description: "Platform ordering and identities are stable declarations.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The Platform introduces no technical implementation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/PublicationReady", name: "Publication Ready", description: "The Platform is declared ready for Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/VersionStable", name: "Version Stable", description: "Platform version metadata is explicit and stable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/CompatibilityPreserved", name: "Compatibility Preserved", description: "Manifest compatibility declarations are preserved.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:6/Guarantee/NonExecutable", name: "Non-Executable", description: "Platform capabilities do not execute.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
