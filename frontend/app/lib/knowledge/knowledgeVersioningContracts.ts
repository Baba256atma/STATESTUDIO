/**
 * KNL-11 — Knowledge Versioning Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_VERSIONING_ARCHITECTURE_VERSION,
  KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
  KNOWLEDGE_VERSIONING_FORBIDDEN_PATTERNS,
  KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS,
  KNOWLEDGE_VERSIONING_GOVERNANCE_RULES,
  KNOWLEDGE_VERSIONING_MUST_NOT_OWN,
  KNOWLEDGE_VERSIONING_NAMESPACE,
  KNOWLEDGE_VERSIONING_PLATFORM_ID,
  KNOWLEDGE_VERSIONING_PLATFORM_NAME,
  KNOWLEDGE_VERSIONING_PRINCIPLES,
  KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY,
  VERSION_SCOPE_KEYS,
  VERSIONED_ASSET_KEYS,
} from "./knowledgeVersioningCatalog.ts";
import {
  getKnowledgeVersioningPlatformSnapshot,
  initializeKnowledgeVersioningPlatform,
  isKnowledgeVersioningPlatformInitialized,
} from "./knowledgeVersioningRegistry.ts";
import type {
  KnowledgeVersion,
  VersionCompatibility,
  VersionExtensionPoint,
  VersionManifest,
  VersionMetadata,
  VersionReleaseDescriptor,
  VersionedKnowledgeAsset,
} from "./knowledgeVersioningTypes.ts";
import type { KnowledgeVersioningPlatformValidationReport } from "./knowledgeVersioningTypes.ts";
import {
  validateBestPracticePlatformDependency,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validateKnowledgeRetrievalEngineDependency,
  validateKnowledgeValidationPlatformDependency,
  validateKnowledgeVersioningContractVersion,
  validateKnowledgeVersioningCoreNamespace,
  validateKnowledgeVersioningDependencyDeclarations,
  validatePolicyRuleBaseDependency,
} from "./knowledgeVersioningValidation.ts";

export const KNOWLEDGE_VERSIONING_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noMigration: true,
  noMutation: true,
  noRollback: true,
  noDiffing: true,
  noRuntimeResolution: true,
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

export const KNOWLEDGE_VERSIONING_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_VERSIONING_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_VERSIONING_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/11",
  title: "Knowledge Versioning Platform",
  goal: "Canonical metadata-only knowledge versioning profiles, assets, and compatibility registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeVersioningCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningTypes.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningContracts.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningValidation.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningPlatform.ts",
    "frontend/app/lib/knowledge/knowledgeVersioningPlatform.test.ts",
    "docs/knl-11-knowledge-versioning-platform-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_VERSIONING_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9", "KNL/10",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_11]", "[KNOWLEDGE_VERSIONING]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): VersionMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    namespace: KNOWLEDGE_VERSIONING_NAMESPACE,
    owner: "knowledge-versioning-platform-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveVersionMetadataExample(timestamp: string): VersionMetadata {
  return createMetadata("version-metadata-example-001", timestamp);
}

export function resolveKnowledgeVersionExample(timestamp: string): KnowledgeVersion {
  return Object.freeze({
    versionId: "knowledge-version-knl_foundation",
    assetKey: "knl_foundation",
    versionLabel: "KNL/1",
    platformId: "knowledge-platform",
    scopeKey: "platform",
    status: "active",
    label: "Knowledge Foundation Version",
    description: "Example knowledge version contract.",
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: resolveVersionMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVersionedKnowledgeAssetExample(timestamp: string): VersionedKnowledgeAsset {
  return Object.freeze({
    assetId: "versioned-asset-knl_foundation",
    assetKey: "knl_foundation",
    assetName: "knl_foundation",
    platformId: "knowledge-platform",
    versionLabel: "KNL/1",
    scopeKey: "registry",
    status: "active",
    label: "Knowledge Foundation Asset",
    description: "Example versioned knowledge asset contract.",
    lineage: Object.freeze({
      lineageId: "version-lineage-example-001",
      assetKey: "knl_foundation",
      versionLabel: "KNL/1",
      description: "Example version lineage metadata.",
      readOnly: true as const,
    }),
    changeDescriptor: Object.freeze({
      changeId: "version-change-example-001",
      label: "Foundation Change",
      description: "Example change descriptor (metadata only, no mutation).",
      readOnly: true as const,
    }),
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: resolveVersionMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVersionCompatibilityExample(timestamp: string): VersionCompatibility {
  return Object.freeze({
    compatibilityId: "version-compatibility-knl_foundation",
    assetKey: "knl_foundation",
    versionLabel: "KNL/1",
    compatibleWithVersion: "KNL/1",
    platformId: "knowledge-platform",
    label: "Foundation Self Compatibility",
    description: "Example version compatibility contract.",
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: resolveVersionMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVersionReleaseDescriptorExample(timestamp: string): VersionReleaseDescriptor {
  return Object.freeze({
    releaseId: "version-release-knl_foundation",
    assetKey: "knl_foundation",
    versionLabel: "KNL/1",
    label: "Knowledge Foundation Release",
    description: "Example release descriptor (metadata only).",
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: resolveVersionMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveVersionExtensionPointExample(timestamp: string): VersionExtensionPoint {
  return Object.freeze({
    extensionPointId: "version-extension-knowledge-learning-bridge",
    extensionPointKey: "knowledge_learning_bridge",
    label: "Knowledge Learning Bridge",
    description: "Reserved extension point for KNL-12 Knowledge Learning Bridge.",
    version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    metadata: resolveVersionMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeVersioningManifest(timestamp: string = new Date(0).toISOString()): VersionManifest {
  if (!isKnowledgeVersioningPlatformInitialized()) {
    initializeKnowledgeVersioningPlatform(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_VERSIONING_PLATFORM_ID,
    platformName: KNOWLEDGE_VERSIONING_PLATFORM_NAME,
    namespace: KNOWLEDGE_VERSIONING_NAMESPACE,
    contractVersion: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_VERSIONING_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    policyDependency: "KNL/7",
    bestPracticeDependency: "KNL/8",
    retrievalDependency: "KNL/9",
    validationDependency: "KNL/10",
    supportedAssets: VERSIONED_ASSET_KEYS,
    supportedScopes: VERSION_SCOPE_KEYS,
    publicApis: KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_VERSIONING_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_VERSIONING_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_VERSIONING_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeVersioningPlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeVersioningPlatformValidationReport {
  const issues: KnowledgeVersioningPlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgeVersioningDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgeVersioningContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgeVersioningCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isKnowledgeVersioningPlatformInitialized()) {
    initializeKnowledgeVersioningPlatform(timestamp);
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

  const validationPlatformValidation = validateKnowledgeValidationPlatformDependency(timestamp);
  if (!validationPlatformValidation.valid) issues.push(...validationPlatformValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_VERSIONING_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeVersioningPlatformSnapshot();
  if (snapshot.versionCount < VERSIONED_ASSET_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "versions_incomplete",
        message: "Version catalog must contain all seeded KNL versions.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.assetCount < VERSIONED_ASSET_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "assets_incomplete",
        message: "Versioned asset catalog must contain seeded assets.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.compatibilityCount < VERSIONED_ASSET_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "compatibilities_incomplete",
        message: "Version compatibility registry must contain seeded records.",
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
    validationValid: validationPlatformValidation.valid,
    platformInitialized: isKnowledgeVersioningPlatformInitialized(),
    registryValid:
      snapshot.versionCount >= VERSIONED_ASSET_KEYS.length &&
      snapshot.assetCount >= VERSIONED_ASSET_KEYS.length &&
      snapshot.compatibilityCount >= VERSIONED_ASSET_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeVersioningContract = Object.freeze({
  KNOWLEDGE_VERSIONING_PUBLIC_API_RULES,
  KNOWLEDGE_VERSIONING_SELF_MANIFEST,
  getKnowledgeVersioningManifest,
  validateKnowledgeVersioningPlatform,
  resolveKnowledgeVersionExample,
  resolveVersionedKnowledgeAssetExample,
  version: KNOWLEDGE_VERSIONING_CONTRACT_VERSION,
});
