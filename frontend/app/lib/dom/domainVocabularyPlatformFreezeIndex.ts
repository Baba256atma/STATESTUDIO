export type {
  DomainVocabularyCompatibilityEntry,
  DomainVocabularyExtensionPolicy,
  DomainVocabularyFreezeResult,
  DomainVocabularyFreezeStatus,
  DomainVocabularyPhaseRegistryEntry,
  DomainVocabularyPlatformFreezeManifest,
  DomainVocabularyPlatformIdentity,
  DomainVocabularyPublicApiEntry,
  DomainVocabularyReleaseMetadata,
} from "./domainVocabularyPlatformFreezeTypes.ts";
export {
  DOMAIN_VOCABULARY_EXTENSION_POLICY,
  DOMAIN_VOCABULARY_PHASE_REGISTRY,
  DOMAIN_VOCABULARY_PLATFORM_IDENTITY,
  DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY,
  DOMAIN_VOCABULARY_RELEASE_METADATA,
  listDomainVocabularyPlatformPhases,
  listDomainVocabularyPlatformPublicApis,
} from "./domainVocabularyPlatformFreezeRegistry.ts";
export {
  DOMAIN_VOCABULARY_COMPATIBILITY_MATRIX,
  getDomainVocabularyPlatformCompatibilityMatrix,
  isDomainVocabularyCompatibilityMatrixValid,
} from "./domainVocabularyPlatformCompatibility.ts";
export {
  buildDomainVocabularyPlatformFreezeManifest,
  isDomainVocabularyPlatformFreezeManifestValid,
} from "./domainVocabularyPlatformFreezeManifest.ts";
export {
  getDomainVocabularyPlatformFreezeState,
  runDomainVocabularyPlatformFreeze,
} from "./domainVocabularyPlatformFreezeRunner.ts";

import {
  getDomainVocabularyPlatformCompatibilityMatrix,
  isDomainVocabularyCompatibilityMatrixValid,
} from "./domainVocabularyPlatformCompatibility.ts";
import {
  buildDomainVocabularyPlatformFreezeManifest,
  isDomainVocabularyPlatformFreezeManifestValid,
} from "./domainVocabularyPlatformFreezeManifest.ts";
import {
  getDomainVocabularyPlatformFreezeState,
  runDomainVocabularyPlatformFreeze,
} from "./domainVocabularyPlatformFreezeRunner.ts";
import {
  listDomainVocabularyPlatformPhases,
  listDomainVocabularyPlatformPublicApis,
} from "./domainVocabularyPlatformFreezeRegistry.ts";

export const DomainVocabularyPlatformFreeze = Object.freeze({
  buildDomainVocabularyPlatformFreezeManifest,
  isDomainVocabularyPlatformFreezeManifestValid,
  runDomainVocabularyPlatformFreeze,
  getDomainVocabularyPlatformFreezeState,
  getDomainVocabularyPlatformCompatibilityMatrix,
  isDomainVocabularyCompatibilityMatrixValid,
  listDomainVocabularyPlatformPhases,
  listDomainVocabularyPlatformPublicApis,
});
