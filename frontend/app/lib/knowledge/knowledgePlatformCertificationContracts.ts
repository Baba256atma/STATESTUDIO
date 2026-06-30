/**
 * KNL-14 — Knowledge Platform Certification contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  CERTIFICATION_EXTENSION_POINT_KEYS,
  CERTIFICATION_GATE_KEYS,
  CERTIFICATION_SCOPE_KEYS,
  KNL_CERTIFICATION_PHASE_KEYS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  KNOWLEDGE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS,
  KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_RULES,
  KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN,
  KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_ID,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_NAME,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PRINCIPLES,
  KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY,
} from "./knowledgePlatformCertificationCatalog.ts";
import {
  getKnowledgePlatformCertificationReport,
  isKnowledgePlatformCertificationInitialized,
  runKnowledgePlatformCertification,
} from "./knowledgePlatformCertificationRunner.ts";
import type {
  CertificationExtensionPoint,
  CertificationGate,
  CertificationManifest,
  CertificationMetadata,
  CertificationProfile,
  KnowledgePlatformCertificationPlatformValidationReport,
} from "./knowledgePlatformCertificationTypes.ts";
import {
  validateKnowledgeGovernancePlatformDependency,
  validateKnowledgePlatformCertificationContractVersion,
  validateKnowledgePlatformCertificationCoreNamespace,
  validateKnowledgePlatformCertificationDependencyDeclarations,
} from "./knowledgePlatformCertificationValidation.ts";
import { buildKnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";

export const KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noRuntimeValidation: true,
  noPlatformFreeze: true,
  noMigration: true,
  noRollback: true,
  noAssetMutation: true,
  noRuleExecution: true,
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

export const KNOWLEDGE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/14",
  title: "Knowledge Platform Certification",
  goal: "Canonical metadata-only certification of the complete KNL platform KNL/1 through KNL/13.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgePlatformCertificationCatalog.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertificationTypes.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertificationContracts.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertificationValidation.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertificationRunner.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertification.ts",
    "frontend/app/lib/knowledge/knowledgePlatformCertification.test.ts",
    "docs/knl-14-knowledge-platform-certification-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9", "KNL/10", "KNL/11", "KNL/12", "KNL/13",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_14]", "[KNOWLEDGE_PLATFORM_CERTIFICATION]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): CertificationMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    namespace: KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
    owner: "knowledge-platform-certification-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveCertificationMetadataExample(timestamp: string): CertificationMetadata {
  return createMetadata("certification-metadata-example-001", timestamp);
}

export function resolveCertificationProfileExample(timestamp: string): CertificationProfile {
  return Object.freeze({
    profileId: "certification-profile-knl_foundation",
    phaseKey: "knl_foundation",
    phaseId: "KNL/1",
    platformId: "knowledge-platform",
    label: "Knowledge Foundation",
    description: "Example certification profile contract.",
    status: "passed",
    version: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    metadata: resolveCertificationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveCertificationGateExample(): CertificationGate {
  return Object.freeze({
    gateId: "certification-gate-example-001",
    gateKey: "A_knl_1_foundation",
    title: "Knowledge Foundation certification",
    passed: true,
    evidence: "KNL/1",
    readOnly: true as const,
  });
}

export function resolveCertificationExtensionPointExample(timestamp: string): CertificationExtensionPoint {
  return Object.freeze({
    extensionPointId: "certification-extension-platform-freeze",
    extensionPointKey: "platform_freeze",
    label: "Platform Freeze",
    description: "Reserved extension point for KNL-15 Knowledge Platform Freeze.",
    version: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    metadata: resolveCertificationMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgePlatformCertificationManifest(
  timestamp: string = new Date(0).toISOString()
): CertificationManifest {
  if (!isKnowledgePlatformCertificationInitialized()) {
    runKnowledgePlatformCertification(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_ID,
    platformName: KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_NAME,
    namespace: KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE,
    contractVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION,
    governanceDependency: "KNL/13",
    certifiedPhases: KNL_CERTIFICATION_PHASE_KEYS,
    certificationScopes: CERTIFICATION_SCOPE_KEYS,
    certificationGates: CERTIFICATION_GATE_KEYS,
    publicApis: KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_PLATFORM_CERTIFICATION_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgePlatformCertification(
  timestamp: string = new Date(0).toISOString()
): KnowledgePlatformCertificationPlatformValidationReport {
  const issues: KnowledgePlatformCertificationPlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgePlatformCertificationDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgePlatformCertificationContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgePlatformCertificationCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  const init = buildKnowledgeGovernancePlatform(timestamp);
  if (!init.success) {
    issues.push(Object.freeze({ code: "init_failed", message: init.reason, readOnly: true as const }));
  }

  const governanceValidation = validateKnowledgeGovernancePlatformDependency(timestamp);
  if (!governanceValidation.valid) issues.push(...governanceValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const runResult = runKnowledgePlatformCertification(timestamp);
  if (!runResult.success) {
    issues.push(
      Object.freeze({
        code: "certification_failed",
        message: runResult.reason,
        readOnly: true as const,
      })
    );
  }

  const report = getKnowledgePlatformCertificationReport();
  if (!report || !report.passed) {
    issues.push(
      Object.freeze({
        code: "report_invalid",
        message: "Knowledge platform certification report did not pass all gates.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    governanceValid: governanceValidation.valid,
    platformInitialized: isKnowledgePlatformCertificationInitialized(),
    certificationValid: runResult.success,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgePlatformCertificationContract = Object.freeze({
  KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_RULES,
  KNOWLEDGE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  getKnowledgePlatformCertificationManifest,
  validateKnowledgePlatformCertification,
  resolveCertificationProfileExample,
  version: KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
});
