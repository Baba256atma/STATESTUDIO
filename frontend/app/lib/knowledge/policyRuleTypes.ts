/**
 * KNL-7 — Policy & Rule Base domain types.
 */

import type {
  COMPLIANCE_TAG_KEYS,
  POLICY_CATEGORY_KEYS,
  POLICY_EXTENSION_POINT_KEYS,
  POLICY_GROUP_KEYS,
  POLICY_KEYS,
  POLICY_NAMESPACE_KEYS,
  POLICY_RULE_BASE_CONTRACT_VERSION,
  POLICY_RULE_BASE_NAMESPACE,
  RULE_PRIORITY_KEYS,
  RULE_SCOPE_KEYS,
  RULE_SEVERITY_KEYS,
  RULE_STATUS_KEYS,
  RULE_TYPE_KEYS,
} from "./policyRuleCatalog.ts";

export type PolicyIdentifier = string;
export type PolicyKey = (typeof POLICY_KEYS)[number];
export type PolicyCategoryKey = (typeof POLICY_CATEGORY_KEYS)[number];
export type RuleTypeKey = (typeof RULE_TYPE_KEYS)[number];
export type RuleScopeKey = (typeof RULE_SCOPE_KEYS)[number];
export type RulePriorityKey = (typeof RULE_PRIORITY_KEYS)[number];
export type RuleSeverityKey = (typeof RULE_SEVERITY_KEYS)[number];
export type RuleStatusKey = (typeof RULE_STATUS_KEYS)[number];
export type ComplianceTagKey = (typeof COMPLIANCE_TAG_KEYS)[number];
export type PolicyGroupKey = (typeof POLICY_GROUP_KEYS)[number];
export type PolicyNamespaceKey = (typeof POLICY_NAMESPACE_KEYS)[number];
export type PolicyExtensionPointKey = (typeof POLICY_EXTENSION_POINT_KEYS)[number];
export type PolicyRuleVersion = typeof POLICY_RULE_BASE_CONTRACT_VERSION | string;

export type PolicyMetadata = Readonly<{
  metadataId: PolicyIdentifier;
  metadataVersion: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  namespace: typeof POLICY_RULE_BASE_NAMESPACE | string;
  owner: string;
  extensions: Readonly<Record<string, string>>;
  createdAt: string;
  readOnly: true;
}>;

export type PolicyNamespace = Readonly<{
  namespaceId: PolicyIdentifier;
  namespaceKey: PolicyNamespaceKey;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type PolicyCategory = Readonly<{
  categoryId: PolicyIdentifier;
  categoryKey: PolicyCategoryKey;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type PolicyGroup = Readonly<{
  groupId: PolicyIdentifier;
  groupKey: PolicyGroupKey;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type RuleOwner = Readonly<{
  ownerId: PolicyIdentifier;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type ComplianceTag = Readonly<{
  tagId: PolicyIdentifier;
  tagKey: ComplianceTagKey;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type RuleCondition = Readonly<{
  conditionId: PolicyIdentifier;
  description: string;
  readOnly: true;
}>;

export type RuleAction = Readonly<{
  actionId: PolicyIdentifier;
  description: string;
  readOnly: true;
}>;

export type RuleException = Readonly<{
  exceptionId: PolicyIdentifier;
  description: string;
  readOnly: true;
}>;

export type Policy = Readonly<{
  policyId: PolicyIdentifier;
  policyKey: PolicyKey;
  canonicalName: string;
  label: string;
  description: string;
  categoryKey: PolicyCategoryKey;
  groupKey: PolicyGroupKey;
  status: RuleStatusKey;
  ontologyEntityId: string | null;
  frameworkId: string | null;
  industryModelId: string | null;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type BusinessRule = Readonly<{
  ruleId: PolicyIdentifier;
  policyId: PolicyIdentifier;
  canonicalName: string;
  label: string;
  description: string;
  ruleType: RuleTypeKey;
  ruleScope: RuleScopeKey;
  priority: RulePriorityKey;
  severity: RuleSeverityKey;
  status: RuleStatusKey;
  condition: RuleCondition;
  action: RuleAction;
  exception: RuleException | null;
  ownerId: PolicyIdentifier | null;
  complianceTags: readonly ComplianceTagKey[];
  ontologyEntityId: string | null;
  frameworkId: string | null;
  industryModelId: string | null;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type PolicyExtensionPoint = Readonly<{
  extensionPointId: PolicyIdentifier;
  extensionPointKey: PolicyExtensionPointKey;
  label: string;
  description: string;
  version: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  metadata: PolicyMetadata;
  readOnly: true;
}>;

export type PolicyRuleBaseManifest = Readonly<{
  platformId: typeof import("./policyRuleCatalog.ts").POLICY_RULE_BASE_ID;
  platformName: typeof import("./policyRuleCatalog.ts").POLICY_RULE_BASE_NAME;
  namespace: typeof POLICY_RULE_BASE_NAMESPACE;
  contractVersion: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  architectureVersion: typeof import("./policyRuleCatalog.ts").POLICY_RULE_BASE_ARCHITECTURE_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  supportedPolicies: readonly PolicyKey[];
  supportedCategories: readonly PolicyCategoryKey[];
  supportedRuleTypes: readonly RuleTypeKey[];
  supportedComplianceTags: readonly ComplianceTagKey[];
  publicApis: readonly string[];
  principles: readonly string[];
  mustNotOwn: readonly string[];
  governanceRules: readonly Readonly<{ ruleId: string; description: string; enforced: true }>[];
  futurePhases: readonly string[];
  generatedAt: string;
  readOnly: true;
}>;

export type PolicyValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type PolicyValidationResult = Readonly<{
  valid: boolean;
  issues: readonly PolicyValidationIssue[];
  readOnly: true;
}>;

export type PolicyResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type PolicyRegistrationInput = Readonly<{
  policyId: PolicyIdentifier;
  policyKey: PolicyKey;
  canonicalName: string;
  label: string;
  description: string;
  categoryKey: PolicyCategoryKey;
  groupKey: PolicyGroupKey;
  status: RuleStatusKey;
  ontologyEntityId?: string;
  frameworkId?: string;
  industryModelId?: string;
}>;

export type BusinessRuleRegistrationInput = Readonly<{
  ruleId: PolicyIdentifier;
  policyId: PolicyIdentifier;
  canonicalName: string;
  label: string;
  description: string;
  ruleType: RuleTypeKey;
  ruleScope: RuleScopeKey;
  priority: RulePriorityKey;
  severity: RuleSeverityKey;
  status: RuleStatusKey;
  conditionDescription: string;
  actionDescription: string;
  exceptionDescription?: string;
  ownerId?: string;
  complianceTags?: readonly ComplianceTagKey[];
  ontologyEntityId?: string;
  frameworkId?: string;
  industryModelId?: string;
}>;

export type PolicyCategoryRegistrationInput = Readonly<{
  categoryId: PolicyIdentifier;
  categoryKey: PolicyCategoryKey;
  label: string;
  description: string;
}>;

export type PolicyRuleBaseSnapshot = Readonly<{
  platformVersion: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  policyCount: number;
  ruleCount: number;
  categoryCount: number;
  groupCount: number;
  ownerCount: number;
  complianceTagCount: number;
  namespaceCount: number;
  readOnly: true;
}>;

export type PolicyRuleBaseState = Readonly<{
  platformId: typeof import("./policyRuleCatalog.ts").POLICY_RULE_BASE_ID;
  contractVersion: typeof POLICY_RULE_BASE_CONTRACT_VERSION;
  foundationDependency: "KNL/1";
  ontologyDependency: "KNL/2";
  vocabularyDependency: "KNL/3";
  graphDependency: "KNL/4";
  industryDependency: "KNL/5";
  frameworkDependency: "KNL/6";
  initialized: boolean;
  policyCount: number;
  ruleCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type PolicyRuleBaseValidationReport = Readonly<{
  valid: boolean;
  foundationValid: boolean;
  ontologyValid: boolean;
  vocabularyValid: boolean;
  graphValid: boolean;
  industryValid: boolean;
  frameworkValid: boolean;
  baseInitialized: boolean;
  registryValid: boolean;
  identityValid: boolean;
  issues: readonly PolicyValidationIssue[];
  readOnly: true;
}>;
