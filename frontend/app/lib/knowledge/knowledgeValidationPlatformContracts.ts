/**
 * KNL-10 — Knowledge Validation Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_VALIDATION_ARCHITECTURE_VERSION,
  KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
  KNOWLEDGE_VALIDATION_FORBIDDEN_PATTERNS,
  KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS,
  KNOWLEDGE_VALIDATION_GOVERNANCE_RULES,
  KNOWLEDGE_VALIDATION_MUST_NOT_OWN,
  KNOWLEDGE_VALIDATION_NAMESPACE,
  KNOWLEDGE_VALIDATION_PLATFORM_ID,
  KNOWLEDGE_VALIDATION_PLATFORM_NAME,
  KNOWLEDGE_VALIDATION_PRINCIPLES,
  KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY,
  VALIDATION_CATEGORY_KEYS,
  VALIDATION_PROFILE_KEYS,
} from "./knowledgeValidationPlatformCatalog.ts";
import {
  getKnowledgeValidationPlatformSnapshot,
  initializeKnowledgeValidationPlatform,
  isKnowledgeValidationPlatformInitialized,
} from "./knowledgeValidationPlatformRegistry.ts";
import type {
  KnowledgeValidationProfile,
  ValidationDependency,
  ValidationExtensionPoint,
  ValidationManifest,
  ValidationMetadata,
  ValidationResultDescriptor,
  ValidationRule,
  ValidationTarget,
} from "./knowledgeValidationPlatformTypes.ts";
import type { KnowledgeValidationPlatformValidationReport } from "./knowledgeValidationPlatformTypes.ts";
import {
  validateBestPracticePlatformDependency,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validateKnowledgeRetrievalEngineDependency,
  validateKnowledgeValidationContractVersion,
  validateKnowledgeValidationCoreNamespace,
  validateKnowledgeValidationDependencyDeclarations,
  validatePolicyRuleBaseDependency,
} from "./knowledgeValidationPlatformValidation.ts";

export const KNOWLEDGE_VALIDATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noRuntimeValidation: true,
  noRuleEngine: true,
  noSearch: true,
  noRetrieval: true,
  noRecommendations: true,
  noSemanticSearch: true,
  noGraphTraversal: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  descriptiveOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_VALIDATION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_VALIDATION_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_VALIDATION_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/10",
  title: "Knowledge Validation Platform",
  goal: "Canonical metadata-only knowledge validation profiles, rules, and governance registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeValidationPlatformCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatformTypes.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatformContracts.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatformRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatformValidation.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatform.ts",
    "frontend/app/lib/knowledge/knowledgeValidationPlatform.test.ts",
    "docs/knl-10-knowledge-validation-platform-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_VALIDATION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_10]", "[KNOWLEDGE_VALIDATION]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): ValidationMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    namespace: KNOWLEDGE_VALIDATION_NAMESPACE,
    owner: "knowledge-validation-platform-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveValidationMetadataExample(timestamp: string): ValidationMetadata {
  return createMetadata("validation-metadata-example-001", timestamp);
}

export function resolveKnowledgeValidationProfileExample(timestamp: string): KnowledgeValidationProfile {
  return Object.freeze({
    profileId: "validation-profile-knl_foundation",
    profileKey: "knl_foundation",
    profileName: "knl_foundation",
    label: "Knowledge Foundation Validation Profile",
    description: "Example validation profile contract.",
    categoryKey: "structural",
    scopeKey: "platform",
    targetKey: "foundation_platform",
    dependencyKey: "KNL/1",
    platformId: "knowledge-platform",
    status: "active",
    resultDescriptor: resolveValidationResultDescriptorExample(timestamp),
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: resolveValidationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveValidationRuleExample(timestamp: string): ValidationRule {
  return Object.freeze({
    ruleId: "validation-rule-knl_foundation-001",
    profileId: "validation-profile-knl_foundation",
    profileKey: "knl_foundation",
    ruleName: "knl_foundation_integrity_rule",
    label: "Knowledge Foundation Integrity Rule",
    description: "Example validation rule contract (metadata only).",
    categoryKey: "structural",
    scopeKey: "registry",
    severity: "major",
    status: "active",
    resultDescriptor: resolveValidationResultDescriptorExample(timestamp),
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: resolveValidationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveValidationResultDescriptorExample(_timestamp: string): ValidationResultDescriptor {
  return Object.freeze({
    descriptorId: "validation-result-example-001",
    label: "Validation Result Descriptor",
    description: "Example result descriptor contract (not executable).",
    readOnly: true as const,
  });
}

export function resolveValidationTargetExample(timestamp: string): ValidationTarget {
  return Object.freeze({
    targetId: "validation-target-knl_foundation",
    targetKey: "foundation_platform",
    platformId: "knowledge-platform",
    profileKey: "knl_foundation",
    label: "Knowledge Foundation",
    description: "Example validation target contract.",
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: resolveValidationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveValidationDependencyExample(timestamp: string): ValidationDependency {
  return Object.freeze({
    dependencyId: "validation-dependency-knl-1",
    dependencyKey: "KNL/1",
    label: "KNL/1",
    description: "Example validation dependency contract.",
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: resolveValidationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveValidationExtensionPointExample(timestamp: string): ValidationExtensionPoint {
  return Object.freeze({
    extensionPointId: "validation-extension-knowledge-versioning",
    extensionPointKey: "knowledge_versioning",
    label: "Knowledge Versioning",
    description: "Reserved extension point for KNL-11 Knowledge Versioning Platform.",
    version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    metadata: resolveValidationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeValidationManifest(timestamp: string = new Date(0).toISOString()): ValidationManifest {
  if (!isKnowledgeValidationPlatformInitialized()) {
    initializeKnowledgeValidationPlatform(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_VALIDATION_PLATFORM_ID,
    platformName: KNOWLEDGE_VALIDATION_PLATFORM_NAME,
    namespace: KNOWLEDGE_VALIDATION_NAMESPACE,
    contractVersion: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_VALIDATION_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    retrievalDependency: "KNL/9",
    supportedProfiles: VALIDATION_PROFILE_KEYS,
    supportedCategories: VALIDATION_CATEGORY_KEYS,
    publicApis: KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_VALIDATION_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_VALIDATION_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_VALIDATION_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeValidationPlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeValidationPlatformValidationReport {
  const issues: KnowledgeValidationPlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgeValidationDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgeValidationContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgeValidationCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isKnowledgeValidationPlatformInitialized()) {
    initializeKnowledgeValidationPlatform(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) issues.push(...foundationValidation.issues);

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) issues.push(...ontologyValidation.issues);

  const vocabularyValidation = validateBusinessVocabularyDependency(timestamp);
  if (!vocabularyValidation.valid) issues.push(...vocabularyValidation.issues);

  const graphValidation = validateKnowledgeGraphDependency(timestamp);
  if (!graphValidation.valid) issues.push(...graphValidation.issues);

  const industryValidation = validateIndustryModelsDependency(timestamp);
  if (!industryValidation.valid) issues.push(...industryValidation.issues);

  const frameworkValidation = validateFrameworkLibraryDependency(timestamp);
  if (!frameworkValidation.valid) issues.push(...frameworkValidation.issues);

  const policyValidation = validatePolicyRuleBaseDependency(timestamp);
  if (!policyValidation.valid) issues.push(...policyValidation.issues);

  const bestPracticeValidation = validateBestPracticePlatformDependency(timestamp);
  if (!bestPracticeValidation.valid) issues.push(...bestPracticeValidation.issues);

  const retrievalValidation = validateKnowledgeRetrievalEngineDependency(timestamp);
  if (!retrievalValidation.valid) issues.push(...retrievalValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_VALIDATION_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeValidationPlatformSnapshot();
  if (snapshot.profileCount < VALIDATION_PROFILE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "profiles_incomplete",
        message: "Validation profile catalog must contain all seeded KNL profiles.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.ruleCount < VALIDATION_PROFILE_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "rules_incomplete",
        message: "Validation rule catalog must contain seeded rules.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < VALIDATION_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Validation category registry must contain seeded defaults.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    foundationValid: foundationValidation.valid,
    ontologyValid: ontologyValidation.valid,
    vocabularyValid: vocabularyValidation.valid,
    graphValid: graphValidation.valid,
    industryValid: industryValidation.valid,
    frameworkValid: frameworkValidation.valid,
    policyValid: policyValidation.valid,
    bestPracticeValid: bestPracticeValidation.valid,
    retrievalValid: retrievalValidation.valid,
    platformInitialized: isKnowledgeValidationPlatformInitialized(),
    registryValid:
      snapshot.profileCount >= VALIDATION_PROFILE_KEYS.length &&
      snapshot.ruleCount >= VALIDATION_PROFILE_KEYS.length &&
      snapshot.categoryCount >= VALIDATION_CATEGORY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeValidationPlatformContract = Object.freeze({
  KNOWLEDGE_VALIDATION_PUBLIC_API_RULES,
  KNOWLEDGE_VALIDATION_SELF_MANIFEST,
  getKnowledgeValidationManifest,
  validateKnowledgeValidationPlatform,
  resolveKnowledgeValidationProfileExample,
  resolveValidationRuleExample,
  version: KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
});
