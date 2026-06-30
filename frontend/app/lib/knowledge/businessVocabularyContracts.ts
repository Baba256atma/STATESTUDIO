/**
 * KNL-3 — Business Vocabulary contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_VOCABULARY_ARCHITECTURE_VERSION,
  BUSINESS_VOCABULARY_CATEGORY_KEYS,
  BUSINESS_VOCABULARY_CONTRACT_VERSION,
  BUSINESS_VOCABULARY_DOMAIN_KEYS,
  BUSINESS_VOCABULARY_FORBIDDEN_PATTERNS,
  BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS,
  BUSINESS_VOCABULARY_GOVERNANCE_RULES,
  BUSINESS_VOCABULARY_ID,
  BUSINESS_VOCABULARY_LANGUAGE_KEYS,
  BUSINESS_VOCABULARY_MUST_NOT_OWN,
  BUSINESS_VOCABULARY_NAME,
  BUSINESS_VOCABULARY_NAMESPACE,
  BUSINESS_VOCABULARY_PRINCIPLES,
  BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY,
  BUSINESS_VOCABULARY_SOURCE_KEYS,
  BUSINESS_VOCABULARY_STATUS_KEYS,
} from "./businessVocabularyCatalog.ts";
import {
  getBusinessVocabularySnapshot,
  initializeBusinessVocabulary,
  isBusinessVocabularyInitialized,
} from "./businessVocabularyRegistry.ts";
import type {
  BusinessDefinition,
  CanonicalName,
  DisplayName,
  EntityReference,
  OntologyReference,
  PreferredLabel,
  RelationshipReference,
  VocabularyAcronym,
  VocabularyAlias,
  VocabularyDescription,
  VocabularyExtensionPoint,
  VocabularyManifest,
  VocabularyMetadata,
  VocabularyTerm,
  VocabularyValidationReport,
} from "./businessVocabularyTypes.ts";
import {
  validateBusinessOntologyDependency,
  validateKnowledgeFoundationDependency,
  validateVocabularyContractVersion,
  validateVocabularyDependencyDeclarations,
} from "./businessVocabularyValidation.ts";

export const BUSINESS_VOCABULARY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noNlp: true,
  noTranslation: true,
  noSemanticSearch: true,
  noRetrieval: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  vocabularyOnly: true,
  readOnly: true as const,
});

export const BUSINESS_VOCABULARY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_VOCABULARY_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_VOCABULARY_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/3",
  title: "Business Vocabulary",
  goal: "Canonical metadata-only business vocabulary terms, aliases, acronyms, and ontology references.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/businessVocabularyCatalog.ts",
    "frontend/app/lib/knowledge/businessVocabularyTypes.ts",
    "frontend/app/lib/knowledge/businessVocabularyContracts.ts",
    "frontend/app/lib/knowledge/businessVocabularyRegistry.ts",
    "frontend/app/lib/knowledge/businessVocabularyValidation.ts",
    "frontend/app/lib/knowledge/businessVocabulary.ts",
    "frontend/app/lib/knowledge/businessVocabulary.test.ts",
    "docs/knl-3-business-vocabulary-report.md",
  ]),
  forbiddenPatterns: BUSINESS_VOCABULARY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_3]", "[BUSINESS_VOCABULARY]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): VocabularyMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    namespace: BUSINESS_VOCABULARY_NAMESPACE,
    owner: "business-vocabulary-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveVocabularyMetadataExample(timestamp: string): VocabularyMetadata {
  return createMetadata("vocabulary-metadata-example-001", timestamp);
}

export function resolveCanonicalNameExample(): CanonicalName {
  return Object.freeze({ value: "strategic_goal", normalized: "strategic_goal", readOnly: true as const });
}

export function resolveDisplayNameExample(): DisplayName {
  return Object.freeze({ value: "Strategic Goal", readOnly: true as const });
}

export function resolvePreferredLabelExample(): PreferredLabel {
  return Object.freeze({ value: "Strategic Goal", readOnly: true as const });
}

export function resolveBusinessDefinitionExample(): BusinessDefinition {
  return Object.freeze({
    value: "A measurable objective aligned with organizational strategy.",
    readOnly: true as const,
  });
}

export function resolveVocabularyDescriptionExample(): VocabularyDescription {
  return Object.freeze({
    value: "Canonical vocabulary term for strategic goals.",
    readOnly: true as const,
  });
}

export function resolveEntityReferenceExample(): EntityReference {
  return Object.freeze({ entityId: "business-entity-example-001", readOnly: true as const });
}

export function resolveOntologyReferenceExample(): OntologyReference {
  return Object.freeze({ ontologyEntityId: "business-relationship-type-supports", readOnly: true as const });
}

export function resolveRelationshipReferenceExample(): RelationshipReference {
  return Object.freeze({ relationshipId: "business-relationship-example-001", readOnly: true as const });
}

export function resolveVocabularyTermExample(timestamp: string): VocabularyTerm {
  return Object.freeze({
    termId: "vocabulary-term-example-001",
    canonicalName: resolveCanonicalNameExample(),
    displayName: resolveDisplayNameExample(),
    preferredLabel: resolvePreferredLabelExample(),
    aliases: Object.freeze(["Strategic Objective"]),
    acronyms: Object.freeze(["SG"]),
    businessDefinition: resolveBusinessDefinitionExample(),
    description: resolveVocabularyDescriptionExample(),
    categoryKey: "strategy",
    domainKey: "strategy",
    entityReference: null,
    ontologyReference: resolveOntologyReferenceExample(),
    relationshipReference: null,
    tags: Object.freeze(["canonical", "strategy"]),
    languageCode: "en",
    status: "active",
    sourceKey: "ontology",
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: resolveVocabularyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVocabularyAliasExample(timestamp: string): VocabularyAlias {
  return Object.freeze({
    aliasId: "vocabulary-alias-example-001",
    termId: "vocabulary-term-example-001",
    alias: "Strategic Objective",
    languageCode: "en",
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: resolveVocabularyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVocabularyAcronymExample(timestamp: string): VocabularyAcronym {
  return Object.freeze({
    acronymId: "vocabulary-acronym-example-001",
    termId: "vocabulary-term-example-001",
    acronym: "SG",
    expandedForm: "Strategic Goal",
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: resolveVocabularyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVocabularyExtensionPointExample(timestamp: string): VocabularyExtensionPoint {
  return Object.freeze({
    extensionPointId: "vocabulary-extension-knowledge-graph",
    extensionPointKey: "knowledge_graph",
    label: "Knowledge Graph",
    description: "Reserved extension point for knowledge graph integration.",
    version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    metadata: resolveVocabularyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getBusinessVocabularyManifest(
  timestamp: string = new Date(0).toISOString()
): VocabularyManifest {
  if (!isBusinessVocabularyInitialized()) {
    initializeBusinessVocabulary(timestamp);
  }
  return Object.freeze({
    vocabularyId: BUSINESS_VOCABULARY_ID,
    vocabularyName: BUSINESS_VOCABULARY_NAME,
    namespace: BUSINESS_VOCABULARY_NAMESPACE,
    contractVersion: BUSINESS_VOCABULARY_CONTRACT_VERSION,
    architectureVersion: BUSINESS_VOCABULARY_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    supportedCategories: BUSINESS_VOCABULARY_CATEGORY_KEYS,
    supportedDomains: BUSINESS_VOCABULARY_DOMAIN_KEYS,
    supportedLanguages: BUSINESS_VOCABULARY_LANGUAGE_KEYS,
    supportedStatuses: BUSINESS_VOCABULARY_STATUS_KEYS,
    supportedSources: BUSINESS_VOCABULARY_SOURCE_KEYS,
    publicApis: BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY,
    principles: BUSINESS_VOCABULARY_PRINCIPLES,
    mustNotOwn: BUSINESS_VOCABULARY_MUST_NOT_OWN,
    governanceRules: BUSINESS_VOCABULARY_GOVERNANCE_RULES,
    futurePhases: BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateBusinessVocabulary(
  timestamp: string = new Date(0).toISOString()
): VocabularyValidationReport {
  const issues: VocabularyValidationReport["issues"][number][] = [];

  const dependencyValidation = validateVocabularyDependencyDeclarations();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const versionValidation = validateVocabularyContractVersion();
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  if (!isBusinessVocabularyInitialized()) {
    initializeBusinessVocabulary(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) {
    issues.push(...foundationValidation.issues);
  }

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) {
    issues.push(...ontologyValidation.issues);
  }

  const manifestValidation = validateStageManifest(BUSINESS_VOCABULARY_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getBusinessVocabularySnapshot();
  if (snapshot.categoryCount < BUSINESS_VOCABULARY_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Vocabulary category registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.domainCount < BUSINESS_VOCABULARY_DOMAIN_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Vocabulary domain registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.languageCount < BUSINESS_VOCABULARY_LANGUAGE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Vocabulary language registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyValid: ontologyValidation.valid,
    vocabularyInitialized: isBusinessVocabularyInitialized(),
    registryValid:
      snapshot.categoryCount >= BUSINESS_VOCABULARY_CATEGORY_KEYS.length &&
      snapshot.domainCount >= BUSINESS_VOCABULARY_DOMAIN_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const BusinessVocabularyContract = Object.freeze({
  BUSINESS_VOCABULARY_PUBLIC_API_RULES,
  BUSINESS_VOCABULARY_SELF_MANIFEST,
  getBusinessVocabularyManifest,
  validateBusinessVocabulary,
  resolveVocabularyTermExample,
  resolveVocabularyAliasExample,
  resolveVocabularyAcronymExample,
  version: BUSINESS_VOCABULARY_CONTRACT_VERSION,
});
