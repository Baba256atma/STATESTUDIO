/**
 * KNL-8 — Best Practices contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BEST_PRACTICE_ARCHITECTURE_VERSION,
  BEST_PRACTICE_CATEGORY_KEYS,
  BEST_PRACTICE_CONTRACT_VERSION,
  BEST_PRACTICE_EXTENSION_POINT_KEYS,
  BEST_PRACTICE_FORBIDDEN_PATTERNS,
  BEST_PRACTICE_FUTURE_PHASE_KEYS,
  BEST_PRACTICE_GOVERNANCE_RULES,
  BEST_PRACTICE_MUST_NOT_OWN,
  BEST_PRACTICE_NAMESPACE,
  BEST_PRACTICE_PLATFORM_ID,
  BEST_PRACTICE_PLATFORM_NAME,
  BEST_PRACTICE_PRINCIPLES,
  BEST_PRACTICE_PUBLIC_API_REGISTRY,
  BEST_PRACTICE_SOURCE_KEYS,
} from "./bestPracticeCatalog.ts";
import {
  getBestPracticePlatformSnapshot,
  initializeBestPracticePlatform,
  isBestPracticePlatformInitialized,
} from "./bestPracticeRegistry.ts";
import type {
  BestPractice,
  BestPracticeCategory,
  BestPracticeContext,
  BestPracticeExtensionPoint,
  BestPracticeFrameworkMapping,
  BestPracticeGuideline,
  BestPracticeIndustryMapping,
  BestPracticeKpiMapping,
  BestPracticeManifest,
  BestPracticeMetadata,
  BestPracticeNamespace,
  BestPracticeOwner,
  BestPracticePlatformValidationReport,
  BestPracticePolicyMapping,
  BestPracticePrinciple,
  BestPracticeRecommendation,
  BestPracticeRiskMapping,
  BestPracticeSource,
  BestPracticeTemplate,
} from "./bestPracticeTypes.ts";
import {
  validateBestPracticeContractVersion,
  validateBestPracticeCoreNamespace,
  validateBestPracticeDependencyDeclarations,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validatePolicyRuleBaseDependency,
} from "./bestPracticeValidation.ts";

export const BEST_PRACTICE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noAdvisory: true,
  noRecommendations: true,
  noRanking: true,
  noScoring: true,
  noSemanticSearch: true,
  noRetrieval: true,
  noGraphTraversal: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  descriptiveOnly: true,
  readOnly: true as const,
});

export const BEST_PRACTICE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BEST_PRACTICE_FORBIDDEN_PATTERNS,
] as const);

export const BEST_PRACTICE_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/8",
  title: "Best Practices",
  goal: "Canonical metadata-only organizational and executive best practices catalog.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/bestPracticeCatalog.ts",
    "frontend/app/lib/knowledge/bestPracticeTypes.ts",
    "frontend/app/lib/knowledge/bestPracticeContracts.ts",
    "frontend/app/lib/knowledge/bestPracticeRegistry.ts",
    "frontend/app/lib/knowledge/bestPracticeValidation.ts",
    "frontend/app/lib/knowledge/bestPracticePlatform.ts",
    "frontend/app/lib/knowledge/bestPracticePlatform.test.ts",
    "docs/knl-8-best-practices-report.md",
  ]),
  forbiddenPatterns: BEST_PRACTICE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_8]", "[BEST_PRACTICES]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): BestPracticeMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: BEST_PRACTICE_CONTRACT_VERSION,
    namespace: BEST_PRACTICE_NAMESPACE,
    owner: "best-practice-platform-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveBestPracticeMetadataExample(timestamp: string): BestPracticeMetadata {
  return createMetadata("best-practice-metadata-example-001", timestamp);
}

export function resolveBestPracticeExample(timestamp: string): BestPractice {
  return Object.freeze({
    practiceId: "best-practice-strategic_planning",
    categoryKey: "strategic_planning",
    canonicalName: "strategic_planning",
    label: "Strategic Planning Best Practice",
    description: "Example best practice contract.",
    principle: resolveBestPracticePrincipleExample(timestamp),
    guideline: resolveBestPracticeGuidelineExample(timestamp),
    recommendation: resolveBestPracticeRecommendationExample(timestamp),
    context: resolveBestPracticeContextExample(timestamp),
    industryMapping: resolveBestPracticeIndustryMappingExample(timestamp),
    frameworkMapping: resolveBestPracticeFrameworkMappingExample(timestamp),
    policyMapping: resolveBestPracticePolicyMappingExample(timestamp),
    kpiMapping: resolveBestPracticeKpiMappingExample(timestamp),
    riskMapping: resolveBestPracticeRiskMappingExample(timestamp),
    ownerId: "best-practice-owner-executive",
    sourceId: "best-practice-source-industry_standard",
    ontologyEntityId: "business-relationship-type-supports",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeTemplateExample(timestamp: string): BestPracticeTemplate {
  return Object.freeze({
    templateId: "best-practice-template-strategic_planning",
    practiceId: "best-practice-strategic_planning",
    categoryKey: "strategic_planning",
    label: "Strategic Planning Template",
    description: "Example best practice template contract.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticePrincipleExample(timestamp: string): BestPracticePrinciple {
  return Object.freeze({
    principleId: "best-practice-principle-example-001",
    label: "Strategic Alignment",
    description: "Example best practice principle contract.",
    categoryKey: "strategic_planning",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeGuidelineExample(_timestamp: string): BestPracticeGuideline {
  return Object.freeze({
    guidelineId: "best-practice-guideline-example-001",
    label: "Define Strategic Objectives",
    description: "Example best practice guideline contract (metadata only).",
    readOnly: true as const,
  });
}

export function resolveBestPracticeRecommendationExample(_timestamp: string): BestPracticeRecommendation {
  return Object.freeze({
    recommendationId: "best-practice-recommendation-example-001",
    description: "Example recommendation metadata (not executable).",
    readOnly: true as const,
  });
}

export function resolveBestPracticeContextExample(_timestamp: string): BestPracticeContext {
  return Object.freeze({
    contextId: "best-practice-context-example-001",
    contextKey: "organization",
    label: "Organization",
    description: "Example best practice context contract.",
    readOnly: true as const,
  });
}

export function resolveBestPracticeIndustryMappingExample(_timestamp: string): BestPracticeIndustryMapping {
  return Object.freeze({
    mappingId: "best-practice-industry-example-001",
    industryModelId: "industry-model-technology",
    description: "Example industry mapping metadata.",
    readOnly: true as const,
  });
}

export function resolveBestPracticeFrameworkMappingExample(_timestamp: string): BestPracticeFrameworkMapping {
  return Object.freeze({
    mappingId: "best-practice-framework-example-001",
    frameworkId: "framework-swot",
    description: "Example framework mapping metadata.",
    readOnly: true as const,
  });
}

export function resolveBestPracticePolicyMappingExample(_timestamp: string): BestPracticePolicyMapping {
  return Object.freeze({
    mappingId: "best-practice-policy-example-001",
    policyId: "policy-governance",
    description: "Example policy mapping metadata.",
    readOnly: true as const,
  });
}

export function resolveBestPracticeKpiMappingExample(_timestamp: string): BestPracticeKpiMapping {
  return Object.freeze({
    mappingId: "best-practice-kpi-example-001",
    kpiLabel: "Strategic Objective Completion",
    description: "Example KPI mapping metadata.",
    readOnly: true as const,
  });
}

export function resolveBestPracticeRiskMappingExample(_timestamp: string): BestPracticeRiskMapping {
  return Object.freeze({
    mappingId: "best-practice-risk-example-001",
    riskLabel: "Strategic Misalignment",
    description: "Example risk mapping metadata.",
    readOnly: true as const,
  });
}

export function resolveBestPracticeCategoryExample(timestamp: string): BestPracticeCategory {
  return Object.freeze({
    categoryId: "best-practice-category-strategic_planning",
    categoryKey: "strategic_planning",
    label: "Strategic Planning",
    description: "Example best practice category contract.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeOwnerExample(timestamp: string): BestPracticeOwner {
  return Object.freeze({
    ownerId: "best-practice-owner-executive",
    label: "Executive Office",
    description: "Example best practice owner contract.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeSourceExample(timestamp: string): BestPracticeSource {
  return Object.freeze({
    sourceId: "best-practice-source-industry_standard",
    sourceKey: "industry_standard",
    label: "Industry Standard",
    description: "Example best practice source contract.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeNamespaceExample(timestamp: string): BestPracticeNamespace {
  return Object.freeze({
    namespaceId: "best-practice-namespace-knowledge-best-practices",
    namespaceKey: "knowledge-best-practices",
    label: "Best Practices",
    description: "Example best practice namespace contract.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBestPracticeExtensionPointExample(timestamp: string): BestPracticeExtensionPoint {
  return Object.freeze({
    extensionPointId: "best-practice-extension-knowledge-retrieval",
    extensionPointKey: "knowledge_retrieval",
    label: "Knowledge Retrieval",
    description: "Reserved extension point for KNL-9 Knowledge Retrieval.",
    version: BEST_PRACTICE_CONTRACT_VERSION,
    metadata: resolveBestPracticeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getBestPracticeManifest(timestamp: string = new Date(0).toISOString()): BestPracticeManifest {
  if (!isBestPracticePlatformInitialized()) {
    initializeBestPracticePlatform(timestamp);
  }
  return Object.freeze({
    platformId: BEST_PRACTICE_PLATFORM_ID,
    platformName: BEST_PRACTICE_PLATFORM_NAME,
    namespace: BEST_PRACTICE_NAMESPACE,
    contractVersion: BEST_PRACTICE_CONTRACT_VERSION,
    architectureVersion: BEST_PRACTICE_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    supportedCategories: BEST_PRACTICE_CATEGORY_KEYS,
    supportedSources: BEST_PRACTICE_SOURCE_KEYS,
    publicApis: BEST_PRACTICE_PUBLIC_API_REGISTRY,
    principles: BEST_PRACTICE_PRINCIPLES,
    mustNotOwn: BEST_PRACTICE_MUST_NOT_OWN,
    governanceRules: BEST_PRACTICE_GOVERNANCE_RULES,
    futurePhases: BEST_PRACTICE_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateBestPracticePlatform(
  timestamp: string = new Date(0).toISOString()
): BestPracticePlatformValidationReport {
  const issues: BestPracticePlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateBestPracticeDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateBestPracticeContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateBestPracticeCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isBestPracticePlatformInitialized()) {
    initializeBestPracticePlatform(timestamp);
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

  const manifestValidation = validateStageManifest(BEST_PRACTICE_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getBestPracticePlatformSnapshot();
  if (snapshot.practiceCount < BEST_PRACTICE_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "catalog_incomplete",
        message: "Best practice catalog must contain all seeded practices.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.templateCount < BEST_PRACTICE_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "templates_incomplete",
        message: "Best practice catalog must contain seeded templates.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < BEST_PRACTICE_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Best practice category registry must contain seeded defaults.",
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
    platformInitialized: isBestPracticePlatformInitialized(),
    registryValid:
      snapshot.practiceCount >= BEST_PRACTICE_CATEGORY_KEYS.length &&
      snapshot.templateCount >= BEST_PRACTICE_CATEGORY_KEYS.length &&
      snapshot.categoryCount >= BEST_PRACTICE_CATEGORY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const BestPracticeContract = Object.freeze({
  BEST_PRACTICE_PUBLIC_API_RULES,
  BEST_PRACTICE_SELF_MANIFEST,
  getBestPracticeManifest,
  validateBestPracticePlatform,
  resolveBestPracticeExample,
  resolveBestPracticeTemplateExample,
  version: BEST_PRACTICE_CONTRACT_VERSION,
});
