/**
 * NEX-1:6 — Immutable declarative Platform guarantees.
 */

export const ProductVisionStrategyPlatformGuarantees = Object.freeze([
  Object.freeze({ id: "NEX-1:6/Guarantee/MetadataOnly", name: "Metadata Only", description: "The Platform surface contains metadata only.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/Immutable", name: "Immutable", description: "Platform metadata is immutable.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/Canonical", name: "Canonical", description: "The Platform identifies the canonical product strategy surface.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/Deterministic", name: "Deterministic", description: "Platform composition and ordering are stable declarations.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/ManifestDerived", name: "Manifest Derived", description: "Platform metadata is composed from NEX-1:5 Manifest.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/Versioned", name: "Versioned", description: "The Platform carries explicit version metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/ArchitectureSafe", name: "Architecture Safe", description: "The Platform does not replace downstream technical architecture.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/NonExecutable", name: "Non-Executable", description: "The Platform implements no executable behavior.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/PlatformConsistent", name: "Platform Consistent", description: "Platform sections share canonical identity and version metadata.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:6/Guarantee/PublicationReady", name: "Publication Ready", description: "The Platform is declared ready for Certification review.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
] as const);
