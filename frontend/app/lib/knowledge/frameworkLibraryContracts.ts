/**
 * KNL-6 — Framework Library contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  FRAMEWORK_CAPABILITY_KEYS,
  FRAMEWORK_CATEGORY_KEYS,
  FRAMEWORK_KEYS,
  FRAMEWORK_LIBRARY_ARCHITECTURE_VERSION,
  FRAMEWORK_LIBRARY_CONTRACT_VERSION,
  FRAMEWORK_LIBRARY_FORBIDDEN_PATTERNS,
  FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS,
  FRAMEWORK_LIBRARY_GOVERNANCE_RULES,
  FRAMEWORK_LIBRARY_ID,
  FRAMEWORK_LIBRARY_MUST_NOT_OWN,
  FRAMEWORK_LIBRARY_NAME,
  FRAMEWORK_LIBRARY_NAMESPACE,
  FRAMEWORK_LIBRARY_PRINCIPLES,
  FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY,
} from "./frameworkLibraryCatalog.ts";
import {
  getFrameworkLibrarySnapshot,
  initializeFrameworkLibrary,
  isFrameworkLibraryInitialized,
} from "./frameworkLibraryRegistry.ts";
import type {
  Framework,
  FrameworkExtensionPoint,
  FrameworkManifest,
  FrameworkMetadata,
  FrameworkPhase,
  FrameworkStep,
  FrameworkTemplate,
  FrameworkValidationReport,
} from "./frameworkLibraryTypes.ts";
import {
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkContractVersion,
  validateFrameworkCoreNamespace,
  validateFrameworkDependencyDeclarations,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
} from "./frameworkLibraryValidation.ts";

export const FRAMEWORK_LIBRARY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noScoring: true,
  noRecommendations: true,
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

export const FRAMEWORK_LIBRARY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...FRAMEWORK_LIBRARY_FORBIDDEN_PATTERNS,
] as const);

export const FRAMEWORK_LIBRARY_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/6",
  title: "Framework Library",
  goal: "Canonical metadata-only business framework templates, categories, and registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/frameworkLibraryCatalog.ts",
    "frontend/app/lib/knowledge/frameworkLibraryTypes.ts",
    "frontend/app/lib/knowledge/frameworkLibraryContracts.ts",
    "frontend/app/lib/knowledge/frameworkLibraryRegistry.ts",
    "frontend/app/lib/knowledge/frameworkLibraryValidation.ts",
    "frontend/app/lib/knowledge/frameworkLibrary.ts",
    "frontend/app/lib/knowledge/frameworkLibrary.test.ts",
    "docs/knl-6-framework-library-report.md",
  ]),
  forbiddenPatterns: FRAMEWORK_LIBRARY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_6]", "[FRAMEWORK_LIBRARY]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): FrameworkMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    namespace: FRAMEWORK_LIBRARY_NAMESPACE,
    owner: "framework-library-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveFrameworkMetadataExample(timestamp: string): FrameworkMetadata {
  return createMetadata("framework-metadata-example-001", timestamp);
}

export function resolveFrameworkExample(timestamp: string): Framework {
  return Object.freeze({
    frameworkId: "framework-swot",
    frameworkKey: "swot",
    canonicalName: "swot",
    label: "SWOT Analysis",
    description: "Example framework contract.",
    categoryKey: "strategic_analysis",
    ontologyEntityId: "business-relationship-type-supports",
    vocabularyTermId: null,
    industryModelId: "industry-model-technology",
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: resolveFrameworkMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveFrameworkTemplateExample(timestamp: string): FrameworkTemplate {
  return Object.freeze({
    templateId: "framework-template-swot",
    frameworkId: "framework-swot",
    label: "SWOT Analysis Template",
    description: "Example framework template contract.",
    categoryKey: "strategic_analysis",
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: resolveFrameworkMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveFrameworkStepExample(timestamp: string): FrameworkStep {
  return Object.freeze({
    stepId: "framework-step-example-001",
    frameworkId: "framework-swot",
    label: "Identify Strengths",
    description: "Example framework step contract.",
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: resolveFrameworkMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveFrameworkPhaseExample(timestamp: string): FrameworkPhase {
  return Object.freeze({
    phaseId: "framework-phase-example-001",
    frameworkId: "framework-pdca",
    label: "Plan Phase",
    description: "Example framework phase contract.",
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: resolveFrameworkMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveFrameworkExtensionPointExample(timestamp: string): FrameworkExtensionPoint {
  return Object.freeze({
    extensionPointId: "framework-extension-knowledge-policy",
    extensionPointKey: "knowledge_policy",
    label: "Knowledge Policy",
    description: "Reserved extension point for knowledge policy.",
    version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    metadata: resolveFrameworkMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getFrameworkLibraryManifest(timestamp: string = new Date(0).toISOString()): FrameworkManifest {
  if (!isFrameworkLibraryInitialized()) {
    initializeFrameworkLibrary(timestamp);
  }
  return Object.freeze({
    platformId: FRAMEWORK_LIBRARY_ID,
    platformName: FRAMEWORK_LIBRARY_NAME,
    namespace: FRAMEWORK_LIBRARY_NAMESPACE,
    contractVersion: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
    architectureVersion: FRAMEWORK_LIBRARY_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    supportedFrameworks: FRAMEWORK_KEYS,
    supportedCategories: FRAMEWORK_CATEGORY_KEYS,
    supportedCapabilities: FRAMEWORK_CAPABILITY_KEYS,
    publicApis: FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY,
    principles: FRAMEWORK_LIBRARY_PRINCIPLES,
    mustNotOwn: FRAMEWORK_LIBRARY_MUST_NOT_OWN,
    governanceRules: FRAMEWORK_LIBRARY_GOVERNANCE_RULES,
    futurePhases: FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateFrameworkLibrary(timestamp: string = new Date(0).toISOString()): FrameworkValidationReport {
  const issues: FrameworkValidationReport["issues"][number][] = [];

  const dependencyValidation = validateFrameworkDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateFrameworkContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateFrameworkCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isFrameworkLibraryInitialized()) {
    initializeFrameworkLibrary(timestamp);
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

  const manifestValidation = validateStageManifest(FRAMEWORK_LIBRARY_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getFrameworkLibrarySnapshot();
  if (snapshot.frameworkCount < FRAMEWORK_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "catalog_incomplete",
        message: "Framework catalog must contain all seeded frameworks.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < FRAMEWORK_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Framework category registry must contain seeded defaults.",
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
    libraryInitialized: isFrameworkLibraryInitialized(),
    registryValid:
      snapshot.frameworkCount >= FRAMEWORK_KEYS.length &&
      snapshot.categoryCount >= FRAMEWORK_CATEGORY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const FrameworkLibraryContract = Object.freeze({
  FRAMEWORK_LIBRARY_PUBLIC_API_RULES,
  FRAMEWORK_LIBRARY_SELF_MANIFEST,
  getFrameworkLibraryManifest,
  validateFrameworkLibrary,
  resolveFrameworkExample,
  resolveFrameworkTemplateExample,
  version: FRAMEWORK_LIBRARY_CONTRACT_VERSION,
});
