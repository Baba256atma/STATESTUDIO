import {
  DEFAULT_VOCABULARY_STATUS,
  DOMAIN_VOCABULARY_VERSION,
  MAX_TERM_ID_LENGTH,
  MAX_VOCABULARY_ID_LENGTH,
  SUPPORTED_VOCABULARY_SCOPES,
} from "./domainVocabularyConstants.ts";
import { validateDomainVocabularyFoundation } from "./domainVocabularyValidation.ts";
import { DOMAIN_VOCABULARY_CONTRACT_VERSION, type DomainVocabularyFoundationManifest } from "./domainVocabularyTypes.ts";

export const DOMAIN_VOCABULARY_PUBLIC_APIS = Object.freeze([
  "DomainVocabularyFoundation",
  "createDomainVocabularyRegistry",
  "registerDomainVocabulary",
  "unregisterDomainVocabulary",
  "getDomainVocabulary",
  "listDomainVocabularies",
  "listVocabulariesByDomain",
  "hasDomainVocabulary",
  "freezeDomainVocabularyRegistry",
  "buildDomainVocabularyManifest",
  "validateDomainVocabularyFoundation",
  "validateDomainVocabularyPackage",
  "validateDomainVocabularyRegistration",
  "validateDomainVocabularyRegistry",
  "validateDomainReference",
] as const);

export function buildDomainVocabularyManifest(
  validation = validateDomainVocabularyFoundation()
): DomainVocabularyFoundationManifest {
  return Object.freeze({
    contractVersion: DOMAIN_VOCABULARY_CONTRACT_VERSION,
    version: DOMAIN_VOCABULARY_VERSION,
    defaultStatus: DEFAULT_VOCABULARY_STATUS,
    maxTermIdLength: MAX_TERM_ID_LENGTH,
    maxVocabularyIdLength: MAX_VOCABULARY_ID_LENGTH,
    supportedScopes: SUPPORTED_VOCABULARY_SCOPES,
    publicApis: DOMAIN_VOCABULARY_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeBehavior: false,
    readyFor: "DOM-2:2 Domain Vocabulary Query Layer",
  });
}
