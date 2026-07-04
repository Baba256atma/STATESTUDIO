import type { DomainVocabularyScope, DomainVocabularyStatus } from "./domainVocabularyTypes.ts";

export const DOMAIN_VOCABULARY_VERSION = "DOM-2:1" as const;

export const DEFAULT_VOCABULARY_STATUS: DomainVocabularyStatus = "draft";

export const MAX_TERM_ID_LENGTH = 128;

export const MAX_VOCABULARY_ID_LENGTH = 128;

export const SUPPORTED_VOCABULARY_SCOPES: readonly DomainVocabularyScope[] = Object.freeze([
  "domain",
  "module",
  "feature",
  "context",
  "global",
]);

export const DOMAIN_VOCABULARY_ARCHITECTURAL_ROLE =
  "Metadata-only foundation for controlled terminology contracts in domain packages." as const;

export const DOMAIN_VOCABULARY_DESCRIPTION =
  "Canonical vocabulary types, registry, validation, and public APIs for Nexora domain terminology infrastructure." as const;
