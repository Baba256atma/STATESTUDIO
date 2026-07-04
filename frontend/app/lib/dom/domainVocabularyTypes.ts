import type { DomainId, DomainVersion } from "./domainFoundationIndex.ts";

export const DOMAIN_VOCABULARY_CONTRACT_VERSION = "DOM-2:1" as const;

export type DomainTermId = string;

export type DomainVocabularyId = string;

export type DomainVocabularyScope = "domain" | "module" | "feature" | "context" | "global";

export type DomainVocabularyStatus = "draft" | "active" | "deprecated" | "archived";

export type DomainVocabularyDefinition = Readonly<{
  text: string;
  language: string;
}>;

export type DomainVocabularySynonym = Readonly<{
  label: string;
  normalizedLabel: string;
}>;

export type DomainVocabularyEntry = Readonly<{
  termId: DomainTermId;
  label: string;
  definition: DomainVocabularyDefinition;
  synonyms: readonly DomainVocabularySynonym[];
  scope: DomainVocabularyScope;
  status: DomainVocabularyStatus;
}>;

export type DomainVocabularyPackage = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_CONTRACT_VERSION;
  vocabularyId: DomainVocabularyId;
  domainId: DomainId;
  name: string;
  description: string;
  version: DomainVersion;
  status: DomainVocabularyStatus;
  terms: readonly DomainVocabularyEntry[];
}>;

export type RegisteredDomainVocabulary = Readonly<{
  package: DomainVocabularyPackage;
  registrationOrder: number;
}>;

export type DomainVocabularyRegistryIndexes = Readonly<{
  byId: Readonly<Record<DomainVocabularyId, RegisteredDomainVocabulary>>;
  byDomainId: Readonly<Record<DomainId, readonly RegisteredDomainVocabulary[]>>;
}>;

export type DomainVocabularyRegistry = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_CONTRACT_VERSION;
  registryId: string;
  frozen: boolean;
  vocabularies: readonly RegisteredDomainVocabulary[];
  indexes: DomainVocabularyRegistryIndexes;
}>;

export type DomainVocabularyValidationIssue = Readonly<{
  code: string;
  field: string;
  message: string;
  severity: "error";
}>;

export type DomainVocabularyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DomainVocabularyValidationIssue[];
}>;

export type DomainVocabularyRegistryMutationResult = Readonly<{
  success: boolean;
  registry: DomainVocabularyRegistry;
  vocabulary: RegisteredDomainVocabulary | null;
  validation: DomainVocabularyValidationResult;
}>;

export type DomainVocabularyFoundationManifest = Readonly<{
  contractVersion: typeof DOMAIN_VOCABULARY_CONTRACT_VERSION;
  version: typeof import("./domainVocabularyConstants.ts").DOMAIN_VOCABULARY_VERSION;
  defaultStatus: DomainVocabularyStatus;
  maxTermIdLength: number;
  maxVocabularyIdLength: number;
  supportedScopes: readonly DomainVocabularyScope[];
  publicApis: readonly string[];
  validation: DomainVocabularyValidationResult;
  metadataOnly: true;
  runtimeBehavior: false;
  readyFor: "DOM-2:2 Domain Vocabulary Query Layer";
}>;
