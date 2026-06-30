/**
 * KNL-15 — Knowledge Platform Freeze contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  COMPATIBILITY_CONSUMER_KEYS,
  KNOWLEDGE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  KNOWLEDGE_PLATFORM_FREEZE_GOVERNANCE_RULES,
  KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN,
  KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
  KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_ID,
  KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_NAME,
  KNOWLEDGE_PLATFORM_FREEZE_PRINCIPLES,
  KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  KNOWLEDGE_PLATFORM_RELEASE_TAG,
  KNOWLEDGE_PLATFORM_RELEASE_VERSION,
  KNL_FROZEN_PHASE_KEYS,
} from "./knowledgePlatformFreezeCatalog.ts";
import { getKnowledgePlatformCompatibilityMatrix as buildCompatibilityMatrix } from "./knowledgePlatformFreezeCompatibility.ts";
import {
  getKnowledgePlatformFreezeManifest as buildPublicFreezeManifest,
  isFreezeManifestComplete,
} from "./knowledgePlatformFreezeManifest.ts";
import {
  getStoredKnowledgePlatformFreezeManifest,
  isKnowledgePlatformFrozen,
  runKnowledgePlatformFreeze,
} from "./knowledgePlatformFreezeRunner.ts";
import type {
  CompatibilityMatrix,
  ExtensionPolicy,
  FreezeIdentity,
  FreezeManifest,
  FreezeMetadata,
  KnowledgePlatformFreezePlatformValidationReport,
  KnowledgePlatformFreezePublicManifest,
  PlatformIdentity,
  ReleaseMetadata,
  ReleaseTag,
} from "./knowledgePlatformFreezeTypes.ts";
import {
  validateKnowledgePlatformCertificationPassed,
  validateKnowledgePlatformFreezeContractVersion,
  validateKnowledgePlatformFreezeCoreNamespace,
  validateKnowledgePlatformFreezeDependencyDeclarations,
  validateKnowledgePlatformFreezeManifest,
} from "./knowledgePlatformFreezeValidation.ts";

export const KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noRuntimeChanges: true,
  noPlatformMutation: true,
  noMigration: true,
  noRuntimeValidation: true,
  noSearch: true,
  noRetrieval: true,
  noMachineLearning: true,
  noLlm: true,
  noLearning: true,
  noRuntime: true,
  noReact: true,
  metadataOnly: true,
  descriptiveOnly: true,
  readOnly: true as const,
});

export const KNOWLEDGE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/15",
  title: "Knowledge Platform Freeze",
  goal: "Official immutable release metadata freeze for the complete Nexora Knowledge Platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgePlatformFreezeCatalog.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeTypes.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeContracts.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeManifest.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeCompatibility.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeValidation.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreezeRunner.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreeze.ts",
    "frontend/app/lib/knowledge/knowledgePlatformFreeze.test.ts",
    "docs/knl-15-knowledge-platform-freeze-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9", "KNL/10", "KNL/11", "KNL/12", "KNL/13", "KNL/14",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_15]", "[KNOWLEDGE_PLATFORM_FREEZE]", "[METADATA_ONLY]", "[FROZEN]", "[RELEASED]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): FreezeMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
    owner: "knowledge-platform-freeze-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveFreezeMetadataExample(timestamp: string): FreezeMetadata {
  return createMetadata("freeze-metadata-example-001", timestamp);
}

export function resolveFreezeIdentityExample(): FreezeIdentity {
  return Object.freeze({
    identityId: "freeze-identity-example-001",
    layerId: "KNL",
    platformId: "knowledge-platform",
    platformName: "Nexora Knowledge Platform",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    releaseTag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolvePlatformIdentityExample(): PlatformIdentity {
  return Object.freeze({
    platformId: "knowledge-platform",
    platformName: "Nexora Knowledge Platform",
    layerId: "KNL",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    readOnly: true as const,
  });
}

export function resolveReleaseTagExample(): ReleaseTag {
  return Object.freeze({
    tagId: "release-tag-example-001",
    tag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    label: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    description: "Example release tag contract.",
    readOnly: true as const,
  });
}

export function resolveReleaseMetadataExample(timestamp: string): ReleaseMetadata {
  return Object.freeze({
    releaseId: "release-metadata-example-001",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    releaseTag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    releaseDate: timestamp,
    status: "released",
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    metadata: resolveFreezeMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveExtensionPolicyExample(): ExtensionPolicy {
  return Object.freeze({
    policyId: "extension-policy-example-001",
    policyKey: "additive_only",
    label: "additive_only",
    description: "Example extension policy contract.",
    enforced: true as const,
    readOnly: true as const,
  });
}

export function resolveFreezeManifestExample(timestamp: string): FreezeManifest {
  return buildPublicFreezeManifest(timestamp);
}

export function getKnowledgePlatformFreezeManifest(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformFreezePublicManifest {
  if (!isKnowledgePlatformFrozen()) {
    runKnowledgePlatformFreeze(timestamp);
  }
  const stored = getStoredKnowledgePlatformFreezeManifest();
  const manifest = stored ?? buildPublicFreezeManifest(timestamp);
  void manifest;
  return Object.freeze({
    platformId: KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_ID,
    platformName: KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_NAME,
    namespace: KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE,
    contractVersion: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    certificationDependency: "KNL/14",
    releaseVersion: KNOWLEDGE_PLATFORM_RELEASE_VERSION,
    releaseTag: KNOWLEDGE_PLATFORM_RELEASE_TAG,
    frozenPhases: KNL_FROZEN_PHASE_KEYS,
    compatibilityConsumers: COMPATIBILITY_CONSUMER_KEYS,
    publicApis: KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_PLATFORM_FREEZE_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_PLATFORM_FREEZE_GOVERNANCE_RULES,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function getKnowledgePlatformCompatibilityMatrix(): CompatibilityMatrix {
  if (!isKnowledgePlatformFrozen()) {
    runKnowledgePlatformFreeze();
  }
  const stored = getStoredKnowledgePlatformFreezeManifest();
  return stored?.compatibilityMatrix ?? buildCompatibilityMatrix();
}

export function validateKnowledgePlatformFreeze(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformFreezePlatformValidationReport {
  const issues: KnowledgePlatformFreezePlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgePlatformFreezeDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgePlatformFreezeContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgePlatformFreezeCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  const certificationValidation = validateKnowledgePlatformCertificationPassed(timestamp);
  if (!certificationValidation.valid) issues.push(...certificationValidation.issues);

  const runResult = runKnowledgePlatformFreeze(timestamp);
  if (!runResult.success) {
    issues.push(Object.freeze({ code: "freeze_failed", message: runResult.reason, readOnly: true as const }));
  }

  const stored = getStoredKnowledgePlatformFreezeManifest();
  if (!stored || !isFreezeManifestComplete(stored)) {
    issues.push(Object.freeze({ code: "manifest_incomplete", message: "Freeze manifest is incomplete.", readOnly: true as const }));
  } else {
    const manifestValidation = validateKnowledgePlatformFreezeManifest(stored);
    if (!manifestValidation.valid) issues.push(...manifestValidation.issues);
  }

  const manifestValidation = validateStageManifest(KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  return Object.freeze({
    valid: issues.length === 0,
    certificationValid: certificationValidation.valid,
    platformInitialized: isKnowledgePlatformFrozen(),
    freezeValid: runResult.success,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgePlatformFreezeContract = Object.freeze({
  KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_RULES,
  KNOWLEDGE_PLATFORM_FREEZE_SELF_MANIFEST,
  getKnowledgePlatformFreezeManifest,
  validateKnowledgePlatformFreeze,
  resolveFreezeManifestExample,
  version: KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION,
});
