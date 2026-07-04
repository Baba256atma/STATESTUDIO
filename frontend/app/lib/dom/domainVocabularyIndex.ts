export {
  DEFAULT_VOCABULARY_STATUS,
  DOMAIN_VOCABULARY_ARCHITECTURAL_ROLE,
  DOMAIN_VOCABULARY_DESCRIPTION,
  DOMAIN_VOCABULARY_VERSION,
  MAX_TERM_ID_LENGTH,
  MAX_VOCABULARY_ID_LENGTH,
  SUPPORTED_VOCABULARY_SCOPES,
} from "./domainVocabularyConstants.ts";
export type {
  DomainTermId,
  DomainVocabularyDefinition,
  DomainVocabularyEntry,
  DomainVocabularyFoundationManifest,
  DomainVocabularyId,
  DomainVocabularyPackage,
  DomainVocabularyRegistry,
  DomainVocabularyRegistryIndexes,
  DomainVocabularyRegistryMutationResult,
  DomainVocabularyScope,
  DomainVocabularyStatus,
  DomainVocabularySynonym,
  DomainVocabularyValidationIssue,
  DomainVocabularyValidationResult,
  RegisteredDomainVocabulary,
} from "./domainVocabularyTypes.ts";
export { DOMAIN_VOCABULARY_CONTRACT_VERSION } from "./domainVocabularyTypes.ts";
export {
  createDomainVocabularyRegistry,
  freezeDomainVocabularyRegistry,
  getDomainVocabulary,
  hasDomainVocabulary,
  listDomainVocabularies,
  listVocabulariesByDomain,
  registerDomainVocabulary,
  unregisterDomainVocabulary,
} from "./domainVocabularyRegistry.ts";
export {
  domainVocabularyValidationResult,
  isValidTermId,
  isValidVocabularyId,
  isValidVocabularyStatus,
  validateDomainReference,
  validateDomainVocabularyFoundation,
  validateDomainVocabularyPackage,
  validateDomainVocabularyRegistration,
  validateDomainVocabularyRegistry,
} from "./domainVocabularyValidation.ts";
export { DOMAIN_VOCABULARY_PUBLIC_APIS, buildDomainVocabularyManifest } from "./domainVocabularyManifest.ts";

import { buildDomainVocabularyManifest } from "./domainVocabularyManifest.ts";
import {
  createDomainVocabularyRegistry,
  freezeDomainVocabularyRegistry,
  getDomainVocabulary,
  hasDomainVocabulary,
  listDomainVocabularies,
  listVocabulariesByDomain,
  registerDomainVocabulary,
  unregisterDomainVocabulary,
} from "./domainVocabularyRegistry.ts";
import {
  validateDomainVocabularyFoundation,
  validateDomainVocabularyPackage,
  validateDomainVocabularyRegistry,
} from "./domainVocabularyValidation.ts";

export const DomainVocabularyFoundation = Object.freeze({
  createDomainVocabularyRegistry,
  registerDomainVocabulary,
  unregisterDomainVocabulary,
  getDomainVocabulary,
  listDomainVocabularies,
  listVocabulariesByDomain,
  hasDomainVocabulary,
  freezeDomainVocabularyRegistry,
  buildDomainVocabularyManifest,
  validateDomainVocabularyFoundation,
  validateDomainVocabularyPackage,
  validateDomainVocabularyRegistry,
});
