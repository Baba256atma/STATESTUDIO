/**
 * NEX-2:8 — Twelve immutable architectural lock declarations.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapArchitecturalLocks = Object.freeze([
  Object.freeze({ id: "NEX-2:8/Lock/Identity", name: "Identity Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[0], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Namespace", name: "Namespace Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[1], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Metadata", name: "Metadata Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[2], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Publication", name: "Publication Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[3], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Compatibility", name: "Compatibility Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[4], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Dependency", name: "Dependency Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[5], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Capability", name: "Capability Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[6], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Guarantee", name: "Guarantee Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[7], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Structure", name: "Structure Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[8], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Version", name: "Version Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[9], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/PublicApiRegistry", name: "Public API Registry Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[10], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:8/Lock/Architecture", name: "Architecture Locked", subject: ProductRoadmapCertification.freezeSeedMetadata.lockSubjects[11], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
] as const);

export const ProductRoadmapCanonicalLockDeclaration = Object.freeze({
  id: "NEX-2:8/CanonicalLockDeclaration",
  lockIdentifier: "NEX-2-PRODUCT-ROADMAP-LOCKED",
  declaration: "The certified NEX-2 Product Roadmap metadata baseline is canonically locked.",
  permanentAfterRelease: true,
  executableLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
