/**
 * KNL-13 — Knowledge Governance Platform contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  GOVERNANCE_PLATFORM_KEYS,
  GOVERNANCE_SCOPE_KEYS,
  KNOWLEDGE_GOVERNANCE_ARCHITECTURE_VERSION,
  KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
  KNOWLEDGE_GOVERNANCE_FORBIDDEN_PATTERNS,
  KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_GOVERNANCE_GOVERNANCE_RULES,
  KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN,
  KNOWLEDGE_GOVERNANCE_NAMESPACE,
  KNOWLEDGE_GOVERNANCE_PLATFORM_ID,
  KNOWLEDGE_GOVERNANCE_PLATFORM_NAME,
  KNOWLEDGE_GOVERNANCE_PRINCIPLES,
  KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY,
} from "./knowledgeGovernanceCatalog.ts";
import {
  getKnowledgeGovernancePlatformSnapshot,
  initializeKnowledgeGovernancePlatform,
  isKnowledgeGovernancePlatformInitialized,
} from "./knowledgeGovernanceRegistry.ts";
import type {
  ApprovalPolicy,
  AuditPolicy,
  CertificationPolicy,
  GovernanceDependency,
  GovernanceExtensionPoint,
  GovernanceLifecycle,
  GovernanceManifest,
  GovernanceMetadata,
  GovernanceNamespace,
  GovernanceRule,
  GovernanceScope,
  KnowledgeGovernancePlatformValidationReport,
  KnowledgeGovernancePolicy,
  KnowledgeOwner,
  KnowledgeSteward,
} from "./knowledgeGovernanceTypes.ts";
import {
  validateBestPracticePlatformDependency,
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validateKnowledgeGovernanceContractVersion,
  validateKnowledgeGovernanceCoreNamespace,
  validateKnowledgeGovernanceDependencyDeclarations,
  validateKnowledgeLearningBridgePlatformDependency,
  validateKnowledgeRetrievalEngineDependency,
  validateKnowledgeValidationPlatformDependency,
  validateKnowledgeVersioningPlatformDependency,
  validatePolicyRuleBaseDependency,
} from "./knowledgeGovernanceValidation.ts";

export const KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noWorkflowEngine: true,
  noApprovalWorkflow: true,
  noAuthorization: true,
  noPermissions: true,
  noRuntimeGovernance: true,
  noAuditExecution: true,
  noPolicyEnforcement: true,
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

export const KNOWLEDGE_GOVERNANCE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...KNOWLEDGE_GOVERNANCE_FORBIDDEN_PATTERNS,
] as const);

export const KNOWLEDGE_GOVERNANCE_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/13",
  title: "Knowledge Governance Platform",
  goal: "Canonical metadata-only governance for the entire KNL ecosystem.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/knowledgeGovernanceCatalog.ts",
    "frontend/app/lib/knowledge/knowledgeGovernanceTypes.ts",
    "frontend/app/lib/knowledge/knowledgeGovernanceContracts.ts",
    "frontend/app/lib/knowledge/knowledgeGovernanceRegistry.ts",
    "frontend/app/lib/knowledge/knowledgeGovernanceValidation.ts",
    "frontend/app/lib/knowledge/knowledgeGovernancePlatform.ts",
    "frontend/app/lib/knowledge/knowledgeGovernancePlatform.test.ts",
    "docs/knl-13-knowledge-governance-platform-report.md",
  ]),
  forbiddenPatterns: KNOWLEDGE_GOVERNANCE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze([
    "KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6", "KNL/7", "KNL/8", "KNL/9", "KNL/10", "KNL/11", "KNL/12",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_13]", "[KNOWLEDGE_GOVERNANCE]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): GovernanceMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_GOVERNANCE_NAMESPACE,
    owner: "knowledge-governance-platform-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolveGovernanceMetadataExample(timestamp: string): GovernanceMetadata {
  return createMetadata("governance-metadata-example-001", timestamp);
}

export function resolveKnowledgeOwnerExample(timestamp: string): KnowledgeOwner {
  return Object.freeze({
    ownerId: "knowledge-owner-knl_foundation",
    ownerKey: "knl_foundation_owner",
    platformKey: "knl_foundation",
    platformReference: "knowledge-platform",
    label: "Knowledge Foundation Owner",
    description: "Example knowledge owner contract.",
    status: "active",
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveKnowledgeStewardExample(timestamp: string): KnowledgeSteward {
  return Object.freeze({
    stewardId: "knowledge-steward-knl_foundation",
    stewardKey: "knl_foundation_steward",
    platformKey: "knl_foundation",
    label: "Knowledge Foundation Steward",
    description: "Example knowledge steward contract.",
    status: "active",
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveApprovalPolicyExample(): ApprovalPolicy {
  return Object.freeze({
    approvalPolicyId: "approval-policy-example-001",
    approvalPolicyKey: "metadata_review",
    description: "Example approval policy (metadata only, no workflow).",
    readOnly: true as const,
  });
}

export function resolveCertificationPolicyExample(): CertificationPolicy {
  return Object.freeze({
    certificationPolicyId: "certification-policy-example-001",
    certificationPolicyKey: "platform_certification",
    description: "Example certification policy (metadata only).",
    readOnly: true as const,
  });
}

export function resolveAuditPolicyExample(): AuditPolicy {
  return Object.freeze({
    auditPolicyId: "audit-policy-example-001",
    auditPolicyKey: "metadata_audit",
    description: "Example audit policy (metadata only, no execution).",
    readOnly: true as const,
  });
}

export function resolveGovernanceRuleExample(): GovernanceRule {
  return Object.freeze({
    ruleId: "governance-rule-example-001",
    ruleKey: "ownership",
    description: "Example governance rule contract.",
    readOnly: true as const,
  });
}

export function resolveGovernanceScopeExample(): GovernanceScope {
  return Object.freeze({
    scopeId: "governance-scope-example-001",
    scopeKey: "platform",
    label: "Platform",
    description: "Example governance scope contract.",
    readOnly: true as const,
  });
}

export function resolveGovernanceLifecycleExample(): GovernanceLifecycle {
  return Object.freeze({
    lifecycleId: "governance-lifecycle-example-001",
    lifecycleKey: "active",
    label: "Active",
    description: "Example governance lifecycle contract.",
    readOnly: true as const,
  });
}

export function resolveKnowledgeGovernancePolicyExample(timestamp: string): KnowledgeGovernancePolicy {
  return Object.freeze({
    policyId: "governance-policy-knl_foundation",
    policyKey: "knl_foundation_governance",
    platformKey: "knl_foundation",
    platformReference: "knowledge-platform",
    knlVersion: "KNL/1",
    scope: resolveGovernanceScopeExample(),
    lifecycle: resolveGovernanceLifecycleExample(),
    ownerId: "knowledge-owner-knl_foundation",
    stewardId: "knowledge-steward-knl_foundation",
    label: "Knowledge Foundation Governance",
    description: "Example governance policy contract.",
    status: "active",
    approvalPolicy: resolveApprovalPolicyExample(),
    certificationPolicy: resolveCertificationPolicyExample(),
    auditPolicy: resolveAuditPolicyExample(),
    governanceRules: Object.freeze([resolveGovernanceRuleExample()]),
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveGovernanceNamespaceExample(timestamp: string): GovernanceNamespace {
  return Object.freeze({
    namespaceId: "governance-namespace-knowledge-governance-platform",
    namespaceKey: "knowledge-governance-platform",
    label: "knowledge-governance-platform",
    description: "Example governance namespace contract.",
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveGovernanceDependencyExample(timestamp: string): GovernanceDependency {
  return Object.freeze({
    dependencyId: "governance-dependency-knl-1",
    dependencyKey: "KNL/1",
    label: "KNL/1",
    description: "Example governance dependency contract.",
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveGovernanceExtensionPointExample(timestamp: string): GovernanceExtensionPoint {
  return Object.freeze({
    extensionPointId: "governance-extension-platform-certification",
    extensionPointKey: "platform_certification",
    label: "Platform Certification",
    description: "Reserved extension point for KNL-14 Knowledge Platform Certification.",
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: resolveGovernanceMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getKnowledgeGovernanceManifest(timestamp: string = new Date(0).toISOString()): GovernanceManifest {
  if (!isKnowledgeGovernancePlatformInitialized()) {
    initializeKnowledgeGovernancePlatform(timestamp);
  }
  return Object.freeze({
    platformId: KNOWLEDGE_GOVERNANCE_PLATFORM_ID,
    platformName: KNOWLEDGE_GOVERNANCE_PLATFORM_NAME,
    namespace: KNOWLEDGE_GOVERNANCE_NAMESPACE,
    contractVersion: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    architectureVersion: KNOWLEDGE_GOVERNANCE_ARCHITECTURE_VERSION,
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
    versioningDependency: "KNL/11",
    learningBridgeDependency: "KNL/12",
    supportedPlatforms: GOVERNANCE_PLATFORM_KEYS,
    supportedScopes: GOVERNANCE_SCOPE_KEYS,
    publicApis: KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY,
    principles: KNOWLEDGE_GOVERNANCE_PRINCIPLES,
    mustNotOwn: KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN,
    governanceRules: KNOWLEDGE_GOVERNANCE_GOVERNANCE_RULES,
    futurePhases: KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validateKnowledgeGovernancePlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernancePlatformValidationReport {
  const issues: KnowledgeGovernancePlatformValidationReport["issues"][number][] = [];

  const dependencyValidation = validateKnowledgeGovernanceDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validateKnowledgeGovernanceContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validateKnowledgeGovernanceCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isKnowledgeGovernancePlatformInitialized()) {
    initializeKnowledgeGovernancePlatform(timestamp);
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

  const versioningValidation = validateKnowledgeVersioningPlatformDependency(timestamp);
  if (!versioningValidation.valid) issues.push(...versioningValidation.issues);

  const learningBridgeValidation = validateKnowledgeLearningBridgePlatformDependency(timestamp);
  if (!learningBridgeValidation.valid) issues.push(...learningBridgeValidation.issues);

  const manifestValidation = validateStageManifest(KNOWLEDGE_GOVERNANCE_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getKnowledgeGovernancePlatformSnapshot();
  if (snapshot.policyCount < GOVERNANCE_PLATFORM_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "policies_incomplete",
        message: "Governance policy catalog must contain all seeded policies.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.ownerCount < GOVERNANCE_PLATFORM_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "owners_incomplete",
        message: "Knowledge owner catalog must contain seeded owners.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.stewardCount < GOVERNANCE_PLATFORM_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "stewards_incomplete",
        message: "Knowledge steward catalog must contain seeded stewards.",
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
    versioningValid: versioningValidation.valid,
    learningBridgeValid: learningBridgeValidation.valid,
    platformInitialized: isKnowledgeGovernancePlatformInitialized(),
    registryValid:
      snapshot.policyCount >= GOVERNANCE_PLATFORM_KEYS.length &&
      snapshot.ownerCount >= GOVERNANCE_PLATFORM_KEYS.length &&
      snapshot.stewardCount >= GOVERNANCE_PLATFORM_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const KnowledgeGovernanceContract = Object.freeze({
  KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES,
  KNOWLEDGE_GOVERNANCE_SELF_MANIFEST,
  getKnowledgeGovernanceManifest,
  validateKnowledgeGovernancePlatform,
  resolveKnowledgeGovernancePolicyExample,
  resolveKnowledgeOwnerExample,
  version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
});
