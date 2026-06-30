/**
 * KNL-3 — Business Vocabulary domain types.
 */

import type {
  BUSINESS_VOCABULARY_CATEGORY_KEYS,
  BUSINESS_VOCABULARY_CONTRACT_VERSION,
  BUSINESS_VOCABULARY_DOMAIN_KEYS,
  BUSINESS_VOCABULARY_EXTENSION_POINT_KEYS,
  BUSINESS_VOCABULARY_LANGUAGE_KEYS,
  BUSINESS_VOCABULARY_NAMESPACE,
  BUSINESS_VOCABULARY_SOURCE_KEYS,
  BUSINESS_VOCABULARY_STATUS_KEYS,
} from "./businessVocabularyCatalog.ts";

export type VocabularyIdentifier = string;
export type VocabularyCategoryKey = (typeof BUSINESS_VOCABULARY_CATEGORY_KEYS)[number];
export type VocabularyDomainKey = (typeof BUSINESS_VOCABULARY_DOMAIN_KEYS)[number];
export type VocabularyLanguageCode = (typeof BUSINESS_VOCABULARY_LANGUAGE_KEYS)[number] | string;
export type VocabularyStatusKey = (typeof BUSINESS_VOCABULARY_STATUS_KEYS)[number];
export type VocabularySourceKey = (typeof BUSINESS_VOCABULARY_SOURCE_KEYS)[number];
export type VocabularyExtensionPointKey = (typeof BUSINESS_VOCABULARY_EXTENSION_POINT_KEYS)[number];
export type VocabularyVersion = typeof BUSINESS_VOCABULARY_CONTRACT_VERSION | string;

export type VocabularyMetadata = Readonly<{
  metadataId: VocabularyIdentifier;
  metadataVersion: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  namespace: typeof BUSINESS_VOCABULARY_NAMESPACE;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type CanonicalName = Readonly<{
  value: string;
  normalized: string;
  readOnly: true;
}>;

export type DisplayName = Readonly<{
  value: string;
  readOnly: true;
}>;

export type PreferredLabel = Readonly<{
  value: string;
  readOnly: true;
}>;

export type BusinessDefinition = Readonly<{
  value: string;
  readOnly: true;
}>;

export type VocabularyDescription = Readonly<{
  value: string;
  readOnly: true;
}>;

export type VocabularyCategory = Readonly<{
  categoryId: VocabularyIdentifier;
  categoryKey: VocabularyCategoryKey;
  label: string;
  description: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyDomain = Readonly<{
  domainId: VocabularyIdentifier;
  domainKey: VocabularyDomainKey;
  label: string;
  description: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type EntityReference = Readonly<{
  entityId: VocabularyIdentifier;
  readOnly: true;
}>;

export type OntologyReference = Readonly<{
  ontologyEntityId: VocabularyIdentifier;
  readOnly: true;
}>;

export type RelationshipReference = Readonly<{
  relationshipId: VocabularyIdentifier;
  readOnly: true;
}>;

export type VocabularyTag = Readonly<{
  tagId: VocabularyIdentifier;
  value: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyAlias = Readonly<{
  aliasId: VocabularyIdentifier;
  termId: VocabularyIdentifier;
  alias: string;
  languageCode: VocabularyLanguageCode;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyAcronym = Readonly<{
  acronymId: VocabularyIdentifier;
  termId: VocabularyIdentifier;
  acronym: string;
  expandedForm: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyLanguage = Readonly<{
  languageId: VocabularyIdentifier;
  languageCode: VocabularyLanguageCode;
  label: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularySource = Readonly<{
  sourceId: VocabularyIdentifier;
  sourceKey: VocabularySourceKey;
  label: string;
  description: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyExtensionPoint = Readonly<{
  extensionPointId: VocabularyIdentifier;
  extensionPointKey: VocabularyExtensionPointKey;
  label: string;
  description: string;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyTerm = Readonly<{
  termId: VocabularyIdentifier;
  canonicalName: CanonicalName;
  displayName: DisplayName;
  preferredLabel: PreferredLabel;
  aliases: readonly string[];
  acronyms: readonly string[];
  businessDefinition: BusinessDefinition;
  description: VocabularyDescription;
  categoryKey: VocabularyCategoryKey;
  domainKey: VocabularyDomainKey;
  entityReference: EntityReference | null;
  ontologyReference: OntologyReference | null;
  relationshipReference: RelationshipReference | null;
  tags: readonly string[];
  languageCode: VocabularyLanguageCode;
  status: VocabularyStatusKey;
  sourceKey: VocabularySourceKey;
  version: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  metadata: VocabularyMetadata;
  readOnly: true;
}>;

export type VocabularyValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type VocabularyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly VocabularyValidationIssue[];
  readOnly: true;
}>;

export type VocabularyResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type VocabularyTermRegistrationInput = Readonly<{
  termId: VocabularyIdentifier;
  canonicalName: string;
  displayName: string;
  preferredLabel: string;
  businessDefinition: string;
  description: string;
  categoryKey: VocabularyCategoryKey;
  domainKey: VocabularyDomainKey;
  languageCode: VocabularyLanguageCode;
  status: VocabularyStatusKey;
  sourceKey: VocabularySourceKey;
  ontologyEntityId?: VocabularyIdentifier;
  relationshipId?: VocabularyIdentifier;
  entityReferenceId?: VocabularyIdentifier;
  tags?: readonly string[];
}>;

export type VocabularyAliasRegistrationInput = Readonly<{
  aliasId: VocabularyIdentifier;
  termId: VocabularyIdentifier;
  alias: string;
  languageCode: VocabularyLanguageCode;
}>;

export type VocabularyAcronymRegistrationInput = Readonly<{
  acronymId: VocabularyIdentifier;
  termId: VocabularyIdentifier;
  acronym: string;
  expandedForm: string;
}>;

export type VocabularyCategoryRegistrationInput = Readonly<{
  categoryId: VocabularyIdentifier;
  categoryKey: VocabularyCategoryKey;
  label: string;
  description: string;
}>;

export type VocabularyDomainRegistrationInput = Readonly<{
  domainId: VocabularyIdentifier;
  domainKey: VocabularyDomainKey;
  label: string;
  description: string;
}>;

export type VocabularyLanguageRegistrationInput = Readonly<{
  languageId: VocabularyIdentifier;
  languageCode: VocabularyLanguageCode;
  label: string;
}>;

export type VocabularyTagRegistrationInput = Readonly<{
  tagId: VocabularyIdentifier;
  value: string;
}>;

export type VocabularySourceRegistrationInput = Readonly<{
  sourceId: VocabularyIdentifier;
  sourceKey: VocabularySourceKey;
  label: string;
  description: string;
}>;

export type VocabularySnapshot = Readonly<{
  vocabularyVersion: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  termCount: number;
  aliasCount: number;
  acronymCount: number;
  categoryCount: number;
  domainCount: number;
  languageCount: number;
  tagCount: number;
  sourceCount: number;
  readOnly: true;
}>;

export type VocabularyState = Readonly<{
  vocabularyId: typeof import("./businessVocabularyCatalog.ts").BUSINESS_VOCABULARY_ID;
  contractVersion: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  initialized: boolean;
  termCount: number;
  aliasCount: number;
  acronymCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type VocabularyManifest = Readonly<{
  vocabularyId: typeof import("./businessVocabularyCatalog.ts").BUSINESS_VOCABULARY_ID;
  vocabularyName: typeof import("./businessVocabularyCatalog.ts").BUSINESS_VOCABULARY_NAME;
  namespace: typeof BUSINESS_VOCABULARY_NAMESPACE;
  contractVersion: typeof BUSINESS_VOCABULARY_CONTRACT_VERSION;
  architectureVersion: typeof import("./businessVocabularyCatalog.ts").BUSINESS_VOCABULARY_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  supportedCategories: readonly VocabularyCategoryKey[];
  supportedDomains: readonly VocabularyDomainKey[];
  supportedLanguages: readonly (typeof BUSINESS_VOCABULARY_LANGUAGE_KEYS)[number][];
  supportedStatuses: readonly VocabularyStatusKey[];
  supportedSources: readonly VocabularySourceKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type VocabularyValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly VocabularyValidationIssue[];
  readOnly: true;
}>;
