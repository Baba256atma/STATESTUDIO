import {
  isValidDomainId,
  isValidDomainVersion,
  type DomainId,
  type DomainRegistry,
} from "./domainFoundationIndex.ts";
import {
  MAX_TERM_ID_LENGTH,
  MAX_VOCABULARY_ID_LENGTH,
  SUPPORTED_VOCABULARY_SCOPES,
} from "./domainVocabularyConstants.ts";
import { DOMAIN_VOCABULARY_CONTRACT_VERSION } from "./domainVocabularyTypes.ts";
import type {
  DomainTermId,
  DomainVocabularyEntry,
  DomainVocabularyId,
  DomainVocabularyPackage,
  DomainVocabularyRegistry,
  DomainVocabularyStatus,
  DomainVocabularyValidationIssue,
  DomainVocabularyValidationResult,
} from "./domainVocabularyTypes.ts";

function issue(code: string, field: string, message: string): DomainVocabularyValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainVocabularyValidationResult(
  issues: readonly DomainVocabularyValidationIssue[]
): DomainVocabularyValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

const VOCABULARY_STATUSES: readonly DomainVocabularyStatus[] = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "archived",
]);

export function isValidVocabularyId(vocabularyId: DomainVocabularyId): boolean {
  if (typeof vocabularyId !== "string") {
    return false;
  }
  const trimmed = vocabularyId.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_VOCABULARY_ID_LENGTH && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidTermId(termId: DomainTermId): boolean {
  if (typeof termId !== "string") {
    return false;
  }
  const trimmed = termId.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_TERM_ID_LENGTH && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

export function isValidVocabularyStatus(status: DomainVocabularyStatus): boolean {
  return VOCABULARY_STATUSES.includes(status);
}

function normalizeSynonymLabel(label: string): string {
  return label.trim().toLowerCase();
}

function validateTermStructure(term: DomainVocabularyEntry): DomainVocabularyValidationIssue[] {
  const issues: DomainVocabularyValidationIssue[] = [];

  if (!isValidTermId(term.termId)) {
    issues.push(issue("invalid_term_id", "terms.termId", "Term id must be a non-empty lowercase identifier."));
  }

  if (typeof term.label !== "string" || term.label.trim().length === 0) {
    issues.push(issue("invalid_term_label", "terms.label", "Term label must be a non-empty string."));
  }

  if (typeof term.definition.text !== "string" || term.definition.text.trim().length === 0) {
    issues.push(issue("invalid_term_definition", "terms.definition.text", "Term definition text must be non-empty."));
  }

  if (typeof term.definition.language !== "string" || term.definition.language.trim().length === 0) {
    issues.push(issue("invalid_term_language", "terms.definition.language", "Term definition language must be non-empty."));
  }

  if (!SUPPORTED_VOCABULARY_SCOPES.includes(term.scope)) {
    issues.push(issue("unsupported_term_scope", "terms.scope", "Term scope is not supported."));
  }

  if (!isValidVocabularyStatus(term.status)) {
    issues.push(issue("invalid_term_status", "terms.status", "Term status is not supported."));
  }

  const synonymLabels = term.synonyms.map((synonym) => normalizeSynonymLabel(synonym.label));
  if (new Set(synonymLabels).size !== synonymLabels.length) {
    issues.push(issue("duplicate_synonym", "terms.synonyms", "Term synonyms must be unique within a term."));
  }

  for (const synonym of term.synonyms) {
    if (typeof synonym.label !== "string" || synonym.label.trim().length === 0) {
      issues.push(issue("invalid_synonym_label", "terms.synonyms", "Synonym label must be non-empty."));
    }
    if (synonym.normalizedLabel !== normalizeSynonymLabel(synonym.label)) {
      issues.push(issue("invalid_synonym_normalization", "terms.synonyms", "Synonym normalized label must match normalized label value."));
    }
  }

  return issues;
}

export function validateDomainReference(domainId: DomainId, domainRegistry?: DomainRegistry): DomainVocabularyValidationResult {
  const issues: DomainVocabularyValidationIssue[] = [];

  if (!isValidDomainId(domainId)) {
    issues.push(issue("invalid_domain_reference", "domainId", "Domain reference must be a valid domain id."));
  }

  if (domainRegistry !== undefined && !domainRegistry.indexes.byId[domainId]) {
    issues.push(issue("missing_domain_reference", "domainId", `Domain reference is not registered: ${domainId}.`));
  }

  return domainVocabularyValidationResult(issues);
}

export function validateDomainVocabularyPackage(
  vocabularyPackage: DomainVocabularyPackage,
  domainRegistry?: DomainRegistry
): DomainVocabularyValidationResult {
  const issues: DomainVocabularyValidationIssue[] = [];

  if (vocabularyPackage.contractVersion !== DOMAIN_VOCABULARY_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Vocabulary package contract version must be DOM-2:1."));
  }

  if (!isValidVocabularyId(vocabularyPackage.vocabularyId)) {
    issues.push(issue("invalid_vocabulary_id", "vocabularyId", "Vocabulary id must be a valid lowercase identifier."));
  }

  issues.push(...validateDomainReference(vocabularyPackage.domainId, domainRegistry).issues);

  if (typeof vocabularyPackage.name !== "string" || vocabularyPackage.name.trim().length === 0) {
    issues.push(issue("invalid_vocabulary_name", "name", "Vocabulary name must be a non-empty string."));
  }

  if (typeof vocabularyPackage.description !== "string" || vocabularyPackage.description.trim().length === 0) {
    issues.push(issue("invalid_vocabulary_description", "description", "Vocabulary description must be a non-empty string."));
  }

  if (!isValidDomainVersion(vocabularyPackage.version)) {
    issues.push(issue("invalid_vocabulary_version", "version", "Vocabulary version must use non-negative integer major, minor, and patch values."));
  }

  if (!isValidVocabularyStatus(vocabularyPackage.status)) {
    issues.push(issue("invalid_vocabulary_status", "status", "Vocabulary status is not supported."));
  }

  const termIds = vocabularyPackage.terms.map((term) => term.termId);
  if (new Set(termIds).size !== termIds.length) {
    issues.push(issue("duplicate_term_id", "terms", "Term ids must be unique within a vocabulary package."));
  }

  const termLabels = vocabularyPackage.terms.map((term) => term.label.trim().toLowerCase());
  if (new Set(termLabels).size !== termLabels.length) {
    issues.push(issue("duplicate_term_label", "terms", "Term labels must be unique within a vocabulary package."));
  }

  for (const term of vocabularyPackage.terms) {
    issues.push(...validateTermStructure(term));
  }

  return domainVocabularyValidationResult(issues);
}

export function validateDomainVocabularyRegistration(
  registry: DomainVocabularyRegistry,
  vocabularyPackage: DomainVocabularyPackage,
  domainRegistry?: DomainRegistry
): DomainVocabularyValidationResult {
  const issues = [...validateDomainVocabularyPackage(vocabularyPackage, domainRegistry).issues];

  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "Vocabulary registry is frozen and cannot accept mutations."));
  }

  if (registry.indexes.byId[vocabularyPackage.vocabularyId]) {
    issues.push(
      issue("duplicate_vocabulary_id", "vocabularyId", `Vocabulary id already registered: ${vocabularyPackage.vocabularyId}.`)
    );
  }

  return domainVocabularyValidationResult(issues);
}

export function validateDomainVocabularyRegistry(registry: DomainVocabularyRegistry): DomainVocabularyValidationResult {
  const issues: DomainVocabularyValidationIssue[] = [];
  const vocabularyIds = registry.vocabularies.map((entry) => entry.package.vocabularyId);

  if (new Set(vocabularyIds).size !== vocabularyIds.length) {
    issues.push(issue("duplicate_registry_vocabulary_id", "vocabularies", "Registry contains duplicate vocabulary ids."));
  }

  for (const entry of registry.vocabularies) {
    issues.push(...validateDomainVocabularyPackage(entry.package).issues);
  }

  const orders = registry.vocabularies.map((entry) => entry.registrationOrder);
  if (orders.length > 0) {
    const expected = Array.from({ length: orders.length }, (_, index) => index);
    if (orders.some((order, index) => order !== expected[index])) {
      issues.push(issue("invalid_registration_order", "vocabularies", "Registry registration order is inconsistent."));
    }
  }

  return domainVocabularyValidationResult(issues);
}

export function validateDomainVocabularyFoundation(): DomainVocabularyValidationResult {
  return domainVocabularyValidationResult([]);
}
