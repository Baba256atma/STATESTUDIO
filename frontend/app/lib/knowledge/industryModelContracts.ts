/**
 * KNL-5 — Industry Models contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  INDUSTRY_CAPABILITY_KEYS,
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_MODELS_ARCHITECTURE_VERSION,
  INDUSTRY_MODELS_CONTRACT_VERSION,
  INDUSTRY_MODELS_FORBIDDEN_PATTERNS,
  INDUSTRY_MODELS_FUTURE_PHASE_KEYS,
  INDUSTRY_MODELS_GOVERNANCE_RULES,
  INDUSTRY_MODELS_ID,
  INDUSTRY_MODELS_MUST_NOT_OWN,
  INDUSTRY_MODELS_NAME,
  INDUSTRY_MODELS_NAMESPACE,
  INDUSTRY_MODELS_PRINCIPLES,
  INDUSTRY_MODELS_PUBLIC_API_REGISTRY,
  INDUSTRY_SECTOR_KEYS,
  INDUSTRY_TEMPLATE_TYPE_KEYS,
} from "./industryModelCatalog.ts";
import {
  getIndustryModelsSnapshot,
  initializeIndustryModels,
  isIndustryModelsInitialized,
} from "./industryModelRegistry.ts";
import type {
  IndustryExtensionPoint,
  IndustryManifest,
  IndustryMetadata,
  IndustryModel,
  IndustryProcessTemplate,
  IndustryProfile,
  IndustryTemplate,
  IndustryValidationReport,
} from "./industryModelTypes.ts";
import {
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateIndustryContractVersion,
  validateIndustryCoreNamespace,
  validateIndustryDependencyDeclarations,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
} from "./industryModelValidation.ts";

export const INDUSTRY_MODELS_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noSimulation: true,
  noBusinessCalculations: true,
  noSemanticSearch: true,
  noRetrieval: true,
  noGraphTraversal: true,
  noMachineLearning: true,
  noLlm: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  templatesOnly: true,
  readOnly: true as const,
});

export const INDUSTRY_MODELS_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...INDUSTRY_MODELS_FORBIDDEN_PATTERNS,
] as const);

export const INDUSTRY_MODELS_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/5",
  title: "Industry Models",
  goal: "Canonical metadata-only industry model templates, sectors, categories, and registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/industryModelCatalog.ts",
    "frontend/app/lib/knowledge/industryModelTypes.ts",
    "frontend/app/lib/knowledge/industryModelContracts.ts",
    "frontend/app/lib/knowledge/industryModelRegistry.ts",
    "frontend/app/lib/knowledge/industryModelValidation.ts",
    "frontend/app/lib/knowledge/industryModels.ts",
    "frontend/app/lib/knowledge/industryModels.test.ts",
    "docs/knl-5-industry-models-report.md",
  ]),
  forbiddenPatterns: INDUSTRY_MODELS_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_5]", "[INDUSTRY_MODELS]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): IndustryMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: INDUSTRY_MODELS_CONTRACT_VERSION,
    namespace: INDUSTRY_MODELS_NAMESPACE,
    owner: "industry-models-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveIndustryMetadataExample(timestamp: string): IndustryMetadata {
  return createMetadata("industry-metadata-example-001", timestamp);
}

export function resolveIndustryModelExample(timestamp: string): IndustryModel {
  return Object.freeze({
    modelId: "industry-model-example-001",
    sectorKey: "manufacturing",
    categoryKey: "primary",
    label: "Manufacturing Industry Model",
    description: "Example industry model contract.",
    profileId: null,
    ontologyEntityId: "business-relationship-type-contains",
    vocabularyTermId: null,
    graphNodeId: null,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: resolveIndustryMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveIndustryTemplateExample(timestamp: string): IndustryTemplate {
  return Object.freeze({
    templateId: "industry-template-example-001",
    modelId: "industry-model-manufacturing",
    templateType: "process",
    label: "Manufacturing Process Template",
    description: "Example industry template contract.",
    sectorKey: "manufacturing",
    ontologyEntityId: "business-relationship-type-produces",
    vocabularyTermId: null,
    graphNodeId: null,
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: resolveIndustryMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveIndustryProfileExample(timestamp: string): IndustryProfile {
  return Object.freeze({
    profileId: "industry-profile-example-001",
    modelId: "industry-model-manufacturing",
    label: "Manufacturing Profile",
    description: "Example industry profile contract.",
    sectorKey: "manufacturing",
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: resolveIndustryMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveIndustryProcessTemplateExample(timestamp: string): IndustryProcessTemplate {
  return Object.freeze({
    templateId: "industry-process-template-example-001",
    modelId: "industry-model-manufacturing",
    label: "Process Template Example",
    description: "Example process template contract.",
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: resolveIndustryMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveIndustryExtensionPointExample(timestamp: string): IndustryExtensionPoint {
  return Object.freeze({
    extensionPointId: "industry-extension-framework-library",
    extensionPointKey: "framework_library",
    label: "Framework Library",
    description: "Reserved extension point for framework library.",
    version: INDUSTRY_MODELS_CONTRACT_VERSION,
    metadata: resolveIndustryMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getIndustryModelsManifest(timestamp: string = new Date(0).toISOString()): IndustryManifest {
  if (!isIndustryModelsInitialized()) {
    initializeIndustryModels(timestamp);
  }
  return Object.freeze({
    platformId: INDUSTRY_MODELS_ID,
    platformName: INDUSTRY_MODELS_NAME,
    namespace: INDUSTRY_MODELS_NAMESPACE,
    contractVersion: INDUSTRY_MODELS_CONTRACT_VERSION,
    architectureVersion: INDUSTRY_MODELS_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    supportedSectors: INDUSTRY_SECTOR_KEYS,
    supportedCategories: INDUSTRY_CATEGORY_KEYS,
    supportedTemplateTypes: INDUSTRY_TEMPLATE_TYPE_KEYS,
    supportedCapabilities: INDUSTRY_CAPABILITY_KEYS,
    publicApis: INDUSTRY_MODELS_PUBLIC_API_REGISTRY,
    principles: INDUSTRY_MODELS_PRINCIPLES,
    mustNotOwn: INDUSTRY_MODELS_MUST_NOT_OWN,
    governanceRules: INDUSTRY_MODELS_GOVERNANCE_RULES,
    futurePhases: INDUSTRY_MODELS_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateIndustryModels(timestamp: string = new Date(0).toISOString()): IndustryValidationReport {
  const issues: IndustryValidationReport["issues"][number][] = [];

  const dependencyValidation = validateIndustryDependencyDeclarations();
  if (!dependencyValidation.valid) {
    issues.push(...dependencyValidation.issues);
  }

  const versionValidation = validateIndustryContractVersion();
  if (!versionValidation.valid) {
    issues.push(...versionValidation.issues);
  }

  const namespaceValidation = validateIndustryCoreNamespace();
  if (!namespaceValidation.valid) {
    issues.push(...namespaceValidation.issues);
  }

  if (!isIndustryModelsInitialized()) {
    initializeIndustryModels(timestamp);
  }

  const foundationValidation = validateKnowledgeFoundationDependency(timestamp);
  if (!foundationValidation.valid) {
    issues.push(...foundationValidation.issues);
  }

  const ontologyValidation = validateBusinessOntologyDependency(timestamp);
  if (!ontologyValidation.valid) {
    issues.push(...ontologyValidation.issues);
  }

  const vocabularyValidation = validateBusinessVocabularyDependency(timestamp);
  if (!vocabularyValidation.valid) {
    issues.push(...vocabularyValidation.issues);
  }

  const graphValidation = validateKnowledgeGraphDependency(timestamp);
  if (!graphValidation.valid) {
    issues.push(...graphValidation.issues);
  }

  const manifestValidation = validateStageManifest(INDUSTRY_MODELS_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getIndustryModelsSnapshot();
  if (snapshot.sectorCount < INDUSTRY_SECTOR_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "catalog_incomplete",
        message: "Industry sector catalog must contain all seeded sectors.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.modelCount < INDUSTRY_SECTOR_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "catalog_incomplete",
        message: "Industry model catalog must contain seeded sector models.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < INDUSTRY_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Industry category registry must contain seeded defaults.",
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
    platformInitialized: isIndustryModelsInitialized(),
    registryValid:
      snapshot.sectorCount >= INDUSTRY_SECTOR_KEYS.length &&
      snapshot.modelCount >= INDUSTRY_SECTOR_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const IndustryModelsContract = Object.freeze({
  INDUSTRY_MODELS_PUBLIC_API_RULES,
  INDUSTRY_MODELS_SELF_MANIFEST,
  getIndustryModelsManifest,
  validateIndustryModels,
  resolveIndustryModelExample,
  resolveIndustryTemplateExample,
  version: INDUSTRY_MODELS_CONTRACT_VERSION,
});
