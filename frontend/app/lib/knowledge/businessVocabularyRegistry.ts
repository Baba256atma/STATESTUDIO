/**
 * KNL-3 — Business Vocabulary metadata registry.
 */

import {
  BUSINESS_VOCABULARY_CATEGORY_KEYS,
  BUSINESS_VOCABULARY_CONTRACT_VERSION,
  BUSINESS_VOCABULARY_DEFAULT_LIMITS,
  BUSINESS_VOCABULARY_DOMAIN_KEYS,
  BUSINESS_VOCABULARY_ID,
  BUSINESS_VOCABULARY_LANGUAGE_KEYS,
  BUSINESS_VOCABULARY_NAMESPACE,
  BUSINESS_VOCABULARY_OWNER,
  BUSINESS_VOCABULARY_SOURCE_KEYS,
} from "./businessVocabularyCatalog.ts";
import type {
  VocabularyAcronym,
  VocabularyAcronymRegistrationInput,
  VocabularyAlias,
  VocabularyAliasRegistrationInput,
  VocabularyCategory,
  VocabularyCategoryRegistrationInput,
  VocabularyDomain,
  VocabularyDomainRegistrationInput,
  VocabularyLanguage,
  VocabularyLanguageRegistrationInput,
  VocabularyMetadata,
  VocabularyResult,
  VocabularySnapshot,
  VocabularySource,
  VocabularySourceRegistrationInput,
  VocabularyState,
  VocabularyTag,
  VocabularyTagRegistrationInput,
  VocabularyTerm,
  VocabularyTermRegistrationInput,
} from "./businessVocabularyTypes.ts";
import {
  validateVocabularyAcronymRegistration,
  validateVocabularyAliasRegistration,
  validateVocabularyTermRegistration,
} from "./businessVocabularyValidation.ts";
import { initializeBusinessOntology } from "./businessOntologyRegistry.ts";

export const BUSINESS_VOCABULARY_REGISTRY_VERSION = "KNL/3-REGISTRY-1" as const;

const termRegistry = new Map<string, VocabularyTerm>();
const aliasRegistry = new Map<string, VocabularyAlias>();
const acronymRegistry = new Map<string, VocabularyAcronym>();
const categoryRegistry = new Map<string, VocabularyCategory>();
const domainRegistry = new Map<string, VocabularyDomain>();
const languageRegistry = new Map<string, VocabularyLanguage>();
const tagRegistry = new Map<string, VocabularyTag>();
const sourceRegistry = new Map<string, VocabularySource>();

let vocabularyInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): VocabularyResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    namespace: BUSINESS_VOCABULARY_NAMESPACE,
    owner: BUSINESS_VOCABULARY_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

function normalizeCanonicalName(value: string): string {
  return value.trim().toLowerCase();
}

export function resetBusinessVocabularyRegistryForTests(): void {
  termRegistry.clear();
  aliasRegistry.clear();
  acronymRegistry.clear();
  categoryRegistry.clear();
  domainRegistry.clear();
  languageRegistry.clear();
  tagRegistry.clear();
  sourceRegistry.clear();
  vocabularyInitialized = false;
  lastInitializedAt = null;
}

export function isBusinessVocabularyInitialized(): boolean {
  return vocabularyInitialized;
}

export function getBusinessVocabularyState(timestamp: string = new Date(0).toISOString()): VocabularyState {
  const snapshot = getBusinessVocabularySnapshot();
  return Object.freeze({
    vocabularyId: BUSINESS_VOCABULARY_ID,
    contractVersion: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    initialized: vocabularyInitialized,
    termCount: snapshot.termCount,
    aliasCount: snapshot.aliasCount,
    acronymCount: snapshot.acronymCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeBusinessVocabulary(
  timestamp: string = new Date(0).toISOString()
): VocabularyResult<VocabularyState> {
  const ontology = initializeBusinessOntology(timestamp);
  if (!ontology.success) {
    return createResult(false, "KNL/2 Business Ontology initialization failed.", null);
  }
  seedDefaultBusinessVocabularyCatalog(timestamp);
  vocabularyInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Business vocabulary initialized.", getBusinessVocabularyState(timestamp));
}

export function registerBusinessTerm(
  input: VocabularyTermRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): VocabularyResult<VocabularyTerm> {
  const validation = validateVocabularyTermRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (termRegistry.has(input.termId)) {
    return createResult(false, `Business term already registered: ${input.termId}.`, null);
  }
  const duplicateCanonical = [...termRegistry.values()].some(
    (entry) => entry.canonicalName.normalized === normalizeCanonicalName(input.canonicalName)
  );
  if (duplicateCanonical) {
    return createResult(false, `Canonical name already registered: ${input.canonicalName}.`, null);
  }
  if (termRegistry.size >= BUSINESS_VOCABULARY_DEFAULT_LIMITS.maxRegisteredTerms) {
    return createResult(false, "Business term registry limit reached.", null);
  }
  const entry = Object.freeze({
    termId: input.termId,
    canonicalName: Object.freeze({
      value: input.canonicalName.trim(),
      normalized: normalizeCanonicalName(input.canonicalName),
      readOnly: true as const,
    }),
    displayName: Object.freeze({ value: input.displayName.trim(), readOnly: true as const }),
    preferredLabel: Object.freeze({ value: input.preferredLabel.trim(), readOnly: true as const }),
    aliases: Object.freeze([] as readonly string[]),
    acronyms: Object.freeze([] as readonly string[]),
    businessDefinition: Object.freeze({ value: input.businessDefinition.trim(), readOnly: true as const }),
    description: Object.freeze({ value: input.description.trim(), readOnly: true as const }),
    categoryKey: input.categoryKey,
    domainKey: input.domainKey,
    entityReference: input.entityReferenceId
      ? Object.freeze({ entityId: input.entityReferenceId, readOnly: true as const })
      : null,
    ontologyReference: input.ontologyEntityId
      ? Object.freeze({ ontologyEntityId: input.ontologyEntityId, readOnly: true as const })
      : null,
    relationshipReference: input.relationshipId
      ? Object.freeze({ relationshipId: input.relationshipId, readOnly: true as const })
      : null,
    tags: Object.freeze([...(input.tags ?? [])]),
    languageCode: input.languageCode,
    status: input.status,
    sourceKey: input.sourceKey,
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-term-${input.termId}`, timestamp),
    readOnly: true as const,
  });
  termRegistry.set(entry.termId, entry);
  return createResult(true, "Business term registered.", entry);
}

export function registerBusinessAlias(
  input: VocabularyAliasRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): VocabularyResult<VocabularyAlias> {
  const validation = validateVocabularyAliasRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (!termRegistry.has(input.termId)) {
    return createResult(false, `Business term not found: ${input.termId}.`, null);
  }
  if (aliasRegistry.has(input.aliasId)) {
    return createResult(false, `Business alias already registered: ${input.aliasId}.`, null);
  }
  const normalizedAlias = input.alias.trim().toLowerCase();
  const duplicateAlias = [...aliasRegistry.values()].some(
    (entry) => entry.alias.trim().toLowerCase() === normalizedAlias
  );
  if (duplicateAlias) {
    return createResult(false, `Alias already registered: ${input.alias}.`, null);
  }
  if (aliasRegistry.size >= BUSINESS_VOCABULARY_DEFAULT_LIMITS.maxRegisteredAliases) {
    return createResult(false, "Business alias registry limit reached.", null);
  }
  const entry = Object.freeze({
    aliasId: input.aliasId,
    termId: input.termId,
    alias: input.alias.trim(),
    languageCode: input.languageCode,
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-alias-${input.aliasId}`, timestamp),
    readOnly: true as const,
  });
  aliasRegistry.set(entry.aliasId, entry);
  const term = termRegistry.get(input.termId)!;
  termRegistry.set(
    input.termId,
    Object.freeze({
      ...term,
      aliases: Object.freeze([...term.aliases, entry.alias]),
      readOnly: true as const,
    })
  );
  return createResult(true, "Business alias registered.", entry);
}

export function registerBusinessAcronym(
  input: VocabularyAcronymRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): VocabularyResult<VocabularyAcronym> {
  const validation = validateVocabularyAcronymRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (!termRegistry.has(input.termId)) {
    return createResult(false, `Business term not found: ${input.termId}.`, null);
  }
  if (acronymRegistry.has(input.acronymId)) {
    return createResult(false, `Business acronym already registered: ${input.acronymId}.`, null);
  }
  const normalizedAcronym = input.acronym.trim().toUpperCase();
  const duplicateAcronym = [...acronymRegistry.values()].some(
    (entry) => entry.acronym.trim().toUpperCase() === normalizedAcronym
  );
  if (duplicateAcronym) {
    return createResult(false, `Acronym already registered: ${input.acronym}.`, null);
  }
  if (acronymRegistry.size >= BUSINESS_VOCABULARY_DEFAULT_LIMITS.maxRegisteredAcronyms) {
    return createResult(false, "Business acronym registry limit reached.", null);
  }
  const entry = Object.freeze({
    acronymId: input.acronymId,
    termId: input.termId,
    acronym: input.acronym.trim().toUpperCase(),
    expandedForm: input.expandedForm.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-acronym-${input.acronymId}`, timestamp),
    readOnly: true as const,
  });
  acronymRegistry.set(entry.acronymId, entry);
  const term = termRegistry.get(input.termId)!;
  termRegistry.set(
    input.termId,
    Object.freeze({
      ...term,
      acronyms: Object.freeze([...term.acronyms, entry.acronym]),
      readOnly: true as const,
    })
  );
  return createResult(true, "Business acronym registered.", entry);
}

function registerVocabularyCategory(
  input: VocabularyCategoryRegistrationInput,
  timestamp: string
): VocabularyResult<VocabularyCategory> {
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Category already registered: ${input.categoryId}.`, null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Category registered.", entry);
}

function registerVocabularyDomain(
  input: VocabularyDomainRegistrationInput,
  timestamp: string
): VocabularyResult<VocabularyDomain> {
  if (domainRegistry.has(input.domainId)) {
    return createResult(false, `Domain already registered: ${input.domainId}.`, null);
  }
  const entry = Object.freeze({
    domainId: input.domainId,
    domainKey: input.domainKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-domain-${input.domainId}`, timestamp),
    readOnly: true as const,
  });
  domainRegistry.set(entry.domainId, entry);
  return createResult(true, "Domain registered.", entry);
}

function registerVocabularyLanguage(
  input: VocabularyLanguageRegistrationInput,
  timestamp: string
): VocabularyResult<VocabularyLanguage> {
  if (languageRegistry.has(input.languageId)) {
    return createResult(false, `Language already registered: ${input.languageId}.`, null);
  }
  const entry = Object.freeze({
    languageId: input.languageId,
    languageCode: input.languageCode,
    label: input.label.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-language-${input.languageId}`, timestamp),
    readOnly: true as const,
  });
  languageRegistry.set(entry.languageId, entry);
  return createResult(true, "Language registered.", entry);
}

function registerVocabularyTag(input: VocabularyTagRegistrationInput, timestamp: string): VocabularyResult<VocabularyTag> {
  if (tagRegistry.has(input.tagId)) {
    return createResult(false, `Tag already registered: ${input.tagId}.`, null);
  }
  const entry = Object.freeze({
    tagId: input.tagId,
    value: input.value.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-tag-${input.tagId}`, timestamp),
    readOnly: true as const,
  });
  tagRegistry.set(entry.tagId, entry);
  return createResult(true, "Tag registered.", entry);
}

function registerVocabularySource(
  input: VocabularySourceRegistrationInput,
  timestamp: string
): VocabularyResult<VocabularySource> {
  if (sourceRegistry.has(input.sourceId)) {
    return createResult(false, `Source already registered: ${input.sourceId}.`, null);
  }
  const entry = Object.freeze({
    sourceId: input.sourceId,
    sourceKey: input.sourceKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-source-${input.sourceId}`, timestamp),
    readOnly: true as const,
  });
  sourceRegistry.set(entry.sourceId, entry);
  return createResult(true, "Source registered.", entry);
}

export function getBusinessVocabularySnapshot(): VocabularySnapshot {
  return Object.freeze({
    vocabularyVersion: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    termCount: termRegistry.size,
    aliasCount: aliasRegistry.size,
    acronymCount: acronymRegistry.size,
    categoryCount: categoryRegistry.size || BUSINESS_VOCABULARY_CATEGORY_KEYS.length,
    domainCount: domainRegistry.size || BUSINESS_VOCABULARY_DOMAIN_KEYS.length,
    languageCount: languageRegistry.size || BUSINESS_VOCABULARY_LANGUAGE_KEYS.length,
    tagCount: tagRegistry.size,
    sourceCount: sourceRegistry.size || BUSINESS_VOCABULARY_SOURCE_KEYS.length,
    readOnly: true as const,
  });
}

export function getBusinessVocabularyRegistry(): Readonly<{
  terms: readonly VocabularyTerm[];
  aliases: readonly VocabularyAlias[];
  acronyms: readonly VocabularyAcronym[];
  categories: readonly VocabularyCategory[];
  domains: readonly VocabularyDomain[];
  languages: readonly VocabularyLanguage[];
  tags: readonly VocabularyTag[];
  sources: readonly VocabularySource[];
  snapshot: VocabularySnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    terms: Object.freeze([...termRegistry.values()].sort((a, b) => a.termId.localeCompare(b.termId))),
    aliases: Object.freeze([...aliasRegistry.values()].sort((a, b) => a.aliasId.localeCompare(b.aliasId))),
    acronyms: Object.freeze([...acronymRegistry.values()].sort((a, b) => a.acronymId.localeCompare(b.acronymId))),
    categories: Object.freeze([...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))),
    domains: Object.freeze([...domainRegistry.values()].sort((a, b) => a.domainId.localeCompare(b.domainId))),
    languages: Object.freeze([...languageRegistry.values()].sort((a, b) => a.languageId.localeCompare(b.languageId))),
    tags: Object.freeze([...tagRegistry.values()].sort((a, b) => a.tagId.localeCompare(b.tagId))),
    sources: Object.freeze([...sourceRegistry.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId))),
    snapshot: getBusinessVocabularySnapshot(),
    readOnly: true as const,
  });
}

export function seedDefaultBusinessVocabularyCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (categoryRegistry.size > 0) {
    return;
  }
  for (const categoryKey of BUSINESS_VOCABULARY_CATEGORY_KEYS) {
    registerVocabularyCategory(
      Object.freeze({
        categoryId: `vocabulary-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} vocabulary category metadata.`,
      }),
      timestamp
    );
  }
  for (const domainKey of BUSINESS_VOCABULARY_DOMAIN_KEYS) {
    registerVocabularyDomain(
      Object.freeze({
        domainId: `vocabulary-domain-${domainKey}`,
        domainKey,
        label: domainKey,
        description: `${domainKey} vocabulary domain metadata.`,
      }),
      timestamp
    );
  }
  for (const languageCode of BUSINESS_VOCABULARY_LANGUAGE_KEYS) {
    registerVocabularyLanguage(
      Object.freeze({
        languageId: `vocabulary-language-${languageCode}`,
        languageCode,
        label: languageCode,
      }),
      timestamp
    );
  }
  for (const sourceKey of BUSINESS_VOCABULARY_SOURCE_KEYS) {
    registerVocabularySource(
      Object.freeze({
        sourceId: `vocabulary-source-${sourceKey}`,
        sourceKey,
        label: sourceKey,
        description: `${sourceKey} vocabulary source metadata.`,
      }),
      timestamp
    );
  }
  registerVocabularyTag(
    Object.freeze({ tagId: "vocabulary-tag-canonical", value: "canonical" }),
    timestamp
  );
}

export const BusinessVocabularyRegistry = Object.freeze({
  resetBusinessVocabularyRegistryForTests,
  initializeBusinessVocabulary,
  registerBusinessTerm,
  registerBusinessAlias,
  registerBusinessAcronym,
  getBusinessVocabularyRegistry,
  getBusinessVocabularySnapshot,
  seedDefaultBusinessVocabularyCatalog,
});
