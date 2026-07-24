/**
 * NEX-1:8 — Immutable architectural lock declarations.
 */

export const ProductVisionStrategyArchitecturalLocks = Object.freeze([
  Object.freeze({ id: "NEX-1:8/Lock/Identity", name: "Identity Locked", target: "Canonical Identity", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Namespace", name: "Namespace Locked", target: "Canonical Namespace", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Metadata", name: "Metadata Locked", target: "Certified Metadata", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Publication", name: "Publication Locked", target: "Publication Surface", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Compatibility", name: "Compatibility Locked", target: "Compatibility Declarations", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Dependency", name: "Dependency Locked", target: "Dependency Metadata", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Capability", name: "Capability Locked", target: "Platform Capabilities", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Guarantee", name: "Guarantee Locked", target: "Platform Guarantees", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Structure", name: "Structure Locked", target: "Platform Structure", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Version", name: "Version Locked", target: "Version Metadata", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/ApiRegistry", name: "API Registry Locked", target: "Public API Registry", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/Lock/Architecture", name: "Architecture Locked", target: "Certified Architecture", lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
] as const);

export const ProductVisionStrategyCanonicalLockDeclaration = Object.freeze({
  id: "NEX-1:8/CanonicalLockDeclaration",
  lockIdentifier: "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED",
  declaration: "The certified NEX-1 Vision & Product Strategy metadata baseline is canonically locked.",
  permanentAfterRelease: true,
  executableLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
