/**
 * KNL-13 — Knowledge Governance Platform domain types.
 */

import type {
  APPROVAL_POLICY_KEYS,
  AUDIT_POLICY_KEYS,
  CERTIFICATION_POLICY_KEYS,
  GOVERNANCE_DEPENDENCY_KEYS,
  GOVERNANCE_EXTENSION_POINT_KEYS,
  GOVERNANCE_LIFECYCLE_KEYS,
  GOVERNANCE_NAMESPACE_KEYS,
  GOVERNANCE_PLATFORM_KEYS,
  GOVERNANCE_RULE_KEYS,
  GOVERNANCE_SCOPE_KEYS,
  GOVERNANCE_STATUS_KEYS,
  KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
  KNOWLEDGE_GOVERNANCE_NAMESPACE,
} from "./knowledgeGovernanceCatalog.ts";

export type KnowledgeGovernanceIdentifier = string;
export type GovernancePlatformKey = (typeof GOVERNANCE_PLATFORM_KEYS)[number];
export type GovernanceScopeKey = (typeof GOVERNANCE_SCOPE_KEYS)[number];
export type GovernanceLifecycleKey = (typeof GOVERNANCE_LIFECYCLE_KEYS)[number];
export type GovernanceRuleKey = (typeof GOVERNANCE_RULE_KEYS)[number];
export type ApprovalPolicyKey = (typeof APPROVAL_POLICY_KEYS)[number];
export type CertificationPolicyKey = (typeof CERTIFICATION_POLICY_KEYS)[number];
export type AuditPolicyKey = (typeof AUDIT_POLICY_KEYS)[number];
export type GovernanceStatusKey = (typeof GOVERNANCE_STATUS_KEYS)[number];
export type GovernanceNamespaceKey = (typeof GOVERNANCE_NAMESPACE_KEYS)[number];
export type GovernanceDependencyKey = (typeof GOVERNANCE_DEPENDENCY_KEYS)[number];
export type GovernanceExtensionPointKey = (typeof GOVERNANCE_EXTENSION_POINT_KEYS)[number];

export type GovernanceMetadata = Readonly<{
  metadataId: KnowledgeGovernanceIdentifier;
  metadataVersion: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  namespace: typeof KNOWLEDGE_GOVERNANCE_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type GovernanceNamespace = Readonly<{
  namespaceId: KnowledgeGovernanceIdentifier;
  namespaceKey: GovernanceNamespaceKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type GovernanceDependency = Readonly<{
  dependencyId: KnowledgeGovernanceIdentifier;
  dependencyKey: GovernanceDependencyKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type KnowledgeOwner = Readonly<{
  ownerId: KnowledgeGovernanceIdentifier;
  ownerKey: string;
  platformKey: GovernancePlatformKey;
  platformReference: string;
  label: string;
  description: string;
  status: GovernanceStatusKey;
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type KnowledgeSteward = Readonly<{
  stewardId: KnowledgeGovernanceIdentifier;
  stewardKey: string;
  platformKey: GovernancePlatformKey;
  label: string;
  description: string;
  status: GovernanceStatusKey;
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type GovernanceRule = Readonly<{
  ruleId: KnowledgeGovernanceIdentifier;
  ruleKey: GovernanceRuleKey;
  description: string;
  readOnly: true;
}>;

export type ApprovalPolicy = Readonly<{
  approvalPolicyId: KnowledgeGovernanceIdentifier;
  approvalPolicyKey: ApprovalPolicyKey;
  description: string;
  readOnly: true;
}>;

export type CertificationPolicy = Readonly<{
  certificationPolicyId: KnowledgeGovernanceIdentifier;
  certificationPolicyKey: CertificationPolicyKey;
  description: string;
  readOnly: true;
}>;

export type AuditPolicy = Readonly<{
  auditPolicyId: KnowledgeGovernanceIdentifier;
  auditPolicyKey: AuditPolicyKey;
  description: string;
  readOnly: true;
}>;

export type GovernanceScope = Readonly<{
  scopeId: KnowledgeGovernanceIdentifier;
  scopeKey: GovernanceScopeKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type GovernanceLifecycle = Readonly<{
  lifecycleId: KnowledgeGovernanceIdentifier;
  lifecycleKey: GovernanceLifecycleKey;
  label: string;
  description: string;
  readOnly: true;
}>;

export type KnowledgeGovernancePolicy = Readonly<{
  policyId: KnowledgeGovernanceIdentifier;
  policyKey: string;
  platformKey: GovernancePlatformKey;
  platformReference: string;
  knlVersion: string;
  scope: GovernanceScope;
  lifecycle: GovernanceLifecycle;
  ownerId: KnowledgeGovernanceIdentifier;
  stewardId: KnowledgeGovernanceIdentifier;
  label: string;
  description: string;
  status: GovernanceStatusKey;
  approvalPolicy: ApprovalPolicy;
  certificationPolicy: CertificationPolicy;
  auditPolicy: AuditPolicy;
  governanceRules: readonly GovernanceRule[];
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type GovernanceExtensionPoint = Readonly<{
  extensionPointId: KnowledgeGovernanceIdentifier;
  extensionPointKey: GovernanceExtensionPointKey;
  label: string;
  description: string;
  version: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  metadata: GovernanceMetadata;
  readOnly: true;
}>;

export type GovernanceManifest = Readonly<{
  platformId: typeof import("./knowledgeGovernanceCatalog.ts").KNOWLEDGE_GOVERNANCE_PLATFORM_ID;
  platformName: typeof import("./knowledgeGovernanceCatalog.ts").KNOWLEDGE_GOVERNANCE_PLATFORM_NAME;
  namespace: typeof KNOWLEDGE_GOVERNANCE_NAMESPACE;
  contractVersion: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  architectureVersion: typeof import("./knowledgeGovernanceCatalog.ts").KNOWLEDGE_GOVERNANCE_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  versioningDependency: "KNL/11";
  learningBridgeDependency: "KNL/12";
  supportedPlatforms: readonly GovernancePlatformKey[];
  supportedScopes: readonly GovernanceScopeKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type KnowledgeGovernanceIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type KnowledgeGovernanceValidationResult = Readonly<{
  valid: boolean;
  issues: readonly KnowledgeGovernanceIssue[];
  readOnly: true;
}>;

export type KnowledgeGovernanceResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type KnowledgeOwnerRegistrationInput = Readonly<{
  ownerId: KnowledgeGovernanceIdentifier;
  ownerKey: string;
  platformKey: GovernancePlatformKey;
  platformReference: string;
  label: string;
  description: string;
  status: GovernanceStatusKey;
}>;

export type KnowledgeStewardRegistrationInput = Readonly<{
  stewardId: KnowledgeGovernanceIdentifier;
  stewardKey: string;
  platformKey: GovernancePlatformKey;
  label: string;
  description: string;
  status: GovernanceStatusKey;
}>;

export type KnowledgeGovernancePolicyRegistrationInput = Readonly<{
  policyId: KnowledgeGovernanceIdentifier;
  policyKey: string;
  platformKey: GovernancePlatformKey;
  platformReference: string;
  scopeKey: GovernanceScopeKey;
  lifecycleKey: GovernanceLifecycleKey;
  ownerId: KnowledgeGovernanceIdentifier;
  stewardId: KnowledgeGovernanceIdentifier;
  label: string;
  description: string;
  status: GovernanceStatusKey;
  approvalPolicyKey: ApprovalPolicyKey;
  approvalPolicyDescription: string;
  certificationPolicyKey: CertificationPolicyKey;
  certificationPolicyDescription: string;
  auditPolicyKey: AuditPolicyKey;
  auditPolicyDescription: string;
  governanceRuleKey: GovernanceRuleKey;
  governanceRuleDescription: string;
}>;

export type KnowledgeGovernancePlatformSnapshot = Readonly<{
  platformVersion: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  policyCount: number;
  ownerCount: number;
  stewardCount: number;
  ruleCount: number;
  approvalPolicyCount: number;
  certificationPolicyCount: number;
  auditPolicyCount: number;
  namespaceCount: number;
  dependencyCount: number;
  readOnly: true;
}>;

export type KnowledgeGovernancePlatformState = Readonly<{
  platformId: typeof import("./knowledgeGovernanceCatalog.ts").KNOWLEDGE_GOVERNANCE_PLATFORM_ID;
  contractVersion: typeof KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  policyDependency: "KNL/7";
  bestPracticeDependency: "KNL/8";
  retrievalDependency: "KNL/9";
  validationDependency: "KNL/10";
  versioningDependency: "KNL/11";
  learningBridgeDependency: "KNL/12";
  initialized: boolean;
  policyCount: number;
  ownerCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type KnowledgeGovernancePlatformValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  policyValid: boolean;
  bestPracticeValid: boolean;
  retrievalValid: boolean;
  validationValid: boolean;
  versioningValid: boolean;
  learningBridgeValid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly KnowledgeGovernanceIssue[];
  readOnly: true;
}>;
