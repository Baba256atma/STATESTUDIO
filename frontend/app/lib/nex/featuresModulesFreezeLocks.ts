/**
 * NEX-3:8 — Exactly twelve immutable architectural lock declarations.
 */

import { FeaturesModulesCertification } from "./featuresModulesCertification.ts";

const Subjects = FeaturesModulesCertification.freezeSeedMetadata.lockSubjects;

export const FeaturesModulesArchitecturalLocks = Object.freeze([
  Object.freeze({ id: "NEX-3:8/Lock/Identity", name: "Identity Locked", subject: Subjects[0], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Namespace", name: "Namespace Locked", subject: Subjects[1], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Metadata", name: "Metadata Locked", subject: Subjects[2], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Publication", name: "Publication Locked", subject: Subjects[3], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Compatibility", name: "Compatibility Locked", subject: Subjects[4], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Dependency", name: "Dependency Locked", subject: Subjects[5], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Capability", name: "Capability Locked", subject: Subjects[6], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Guarantee", name: "Guarantee Locked", subject: Subjects[7], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Structure", name: "Structure Locked", subject: Subjects[8], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Version", name: "Version Locked", subject: Subjects[9], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/PublicApiRegistry", name: "Public API Registry Locked", subject: Subjects[10], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/Lock/Architecture", name: "Architecture Locked", subject: Subjects[11], lockStatus: "Locked", executableLock: false, metadataOnly: true, immutable: true }),
] as const);

export const FeaturesModulesCanonicalLockDeclaration = Object.freeze({
  id: "NEX-3:8/CanonicalLockDeclaration",
  lockIdentifier: "NEX-3-FEATURES-MODULES-LOCKED",
  declaration: "The certified NEX-3 Features & Modules metadata baseline is canonically locked.",
  permanentAfterRelease: true,
  executableLock: false,
  metadataOnly: true,
  immutable: true,
} as const);
