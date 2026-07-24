/**
 * NEX-4:6 — Exactly ten immutable Platform guarantees.
 */

export const UserJourneyExperiencePlatformGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-4:6/Guarantee/MetadataOnly", name: "Metadata Only", description: "The Platform contains metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/Immutable", name: "Immutable", description: "Platform metadata is immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/Canonical", name: "Canonical", description: "The Platform identifies the canonical experience surface.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/ManifestDerived", name: "Manifest Derived", description: "Platform metadata derives exclusively from NEX-4:5 Manifest.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/Deterministic", name: "Deterministic", description: "Platform ordering and identities are stable declarations.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The Platform introduces no UI or runtime implementation.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/PublicationReady", name: "Publication Ready", description: "The Platform is declared ready for Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/VersionStable", name: "Version Stable", description: "Platform version metadata is explicit and stable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/CompatibilityPreserved", name: "Compatibility Preserved", description: "Manifest compatibility declarations are preserved.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:6/Guarantee/NonExecutable", name: "Non-Executable", description: "Platform capabilities do not execute.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
