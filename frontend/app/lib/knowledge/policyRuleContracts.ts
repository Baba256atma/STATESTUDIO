/**
 * KNL-7 — Policy & Rule Base contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  COMPLIANCE_TAG_KEYS,
  POLICY_CATEGORY_KEYS,
  POLICY_EXTENSION_POINT_KEYS,
  POLICY_GROUP_KEYS,
  POLICY_KEYS,
  POLICY_RULE_BASE_ARCHITECTURE_VERSION,
  POLICY_RULE_BASE_CONTRACT_VERSION,
  POLICY_RULE_BASE_FORBIDDEN_PATTERNS,
  POLICY_RULE_BASE_FUTURE_PHASE_KEYS,
  POLICY_RULE_BASE_GOVERNANCE_RULES,
  POLICY_RULE_BASE_ID,
  POLICY_RULE_BASE_MUST_NOT_OWN,
  POLICY_RULE_BASE_NAME,
  POLICY_RULE_BASE_NAMESPACE,
  POLICY_RULE_BASE_PRINCIPLES,
  POLICY_RULE_BASE_PUBLIC_API_REGISTRY,
  RULE_PRIORITY_KEYS,
  RULE_SCOPE_KEYS,
  RULE_SEVERITY_KEYS,
  RULE_STATUS_KEYS,
  RULE_TYPE_KEYS,
} from "./policyRuleCatalog.ts";
import {
  getPolicyRuleBaseSnapshot,
  initializePolicyRuleBase,
  isPolicyRuleBaseInitialized,
} from "./policyRuleRegistry.ts";
import type {
  BusinessRule,
  ComplianceTag,
  Policy,
  PolicyCategory,
  PolicyExtensionPoint,
  PolicyGroup,
  PolicyMetadata,
  PolicyNamespace,
  PolicyRuleBaseManifest,
  PolicyRuleBaseValidationReport,
  RuleAction,
  RuleCondition,
  RuleException,
  RuleOwner,
} from "./policyRuleTypes.ts";
import {
  validateBusinessOntologyDependency,
  validateBusinessVocabularyDependency,
  validateFrameworkLibraryDependency,
  validateIndustryModelsDependency,
  validateKnowledgeFoundationDependency,
  validateKnowledgeGraphDependency,
  validatePolicyRuleBaseContractVersion,
  validatePolicyRuleBaseCoreNamespace,
  validatePolicyRuleBaseDependencyDeclarations,
} from "./policyRuleValidation.ts";

export const POLICY_RULE_BASE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noExecution: true,
  noEvaluation: true,
  noRuleEngine: true,
  noDecisionEngine: true,
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

export const POLICY_RULE_BASE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...POLICY_RULE_BASE_FORBIDDEN_PATTERNS,
] as const);

export const POLICY_RULE_BASE_SELF_MANIFEST = Object.freeze({
  stageId: "KNL/7",
  title: "Policy & Rule Base",
  goal: "Canonical metadata-only organizational policies and business rules registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/knowledge/policyRuleCatalog.ts",
    "frontend/app/lib/knowledge/policyRuleTypes.ts",
    "frontend/app/lib/knowledge/policyRuleContracts.ts",
    "frontend/app/lib/knowledge/policyRuleRegistry.ts",
    "frontend/app/lib/knowledge/policyRuleValidation.ts",
    "frontend/app/lib/knowledge/policyRuleBase.ts",
    "frontend/app/lib/knowledge/policyRuleBase.test.ts",
    "docs/knl-7-policy-rule-base-report.md",
  ]),
  forbiddenPatterns: POLICY_RULE_BASE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["KNL/1", "KNL/2", "KNL/3", "KNL/4", "KNL/5", "KNL/6"]),
  runtimePath: "library-only" as const,
  tags: Object.freeze(["[KNL_7]", "[POLICY_RULE_BASE]", "[METADATA_ONLY]"]),
} satisfies StageManifest);

function createMetadata(metadataId: string, timestamp: string): PolicyMetadata {
  return Object.freeze({
    metadataId,
    metadataVersion: POLICY_RULE_BASE_CONTRACT_VERSION,
    namespace: POLICY_RULE_BASE_NAMESPACE,
    owner: "policy-rule-base-engine",
    extensions: Object.freeze({}),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resolvePolicyMetadataExample(timestamp: string): PolicyMetadata {
  return createMetadata("policy-metadata-example-001", timestamp);
}

export function resolvePolicyExample(timestamp: string): Policy {
  return Object.freeze({
    policyId: "policy-financial",
    policyKey: "financial",
    canonicalName: "financial",
    label: "Financial Policy",
    description: "Example policy contract.",
    categoryKey: "financial",
    groupKey: "corporate",
    status: "active",
    ontologyEntityId: "business-relationship-type-supports",
    frameworkId: "framework-balanced_scorecard",
    industryModelId: "industry-model-technology",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveBusinessRuleExample(timestamp: string): BusinessRule {
  return Object.freeze({
    ruleId: "business-rule-financial-001",
    policyId: "policy-financial",
    canonicalName: "financial_approval_threshold",
    label: "Financial Approval Threshold",
    description: "Example business rule contract (metadata only).",
    ruleType: "mandatory",
    ruleScope: "organization",
    priority: "high",
    severity: "major",
    status: "active",
    condition: resolveRuleConditionExample(timestamp),
    action: resolveRuleActionExample(timestamp),
    exception: null,
    ownerId: "policy-owner-finance",
    complianceTags: Object.freeze(["sox", "internal"] as const),
    ontologyEntityId: "business-relationship-type-supports",
    frameworkId: "framework-balanced_scorecard",
    industryModelId: "industry-model-technology",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveRuleConditionExample(timestamp: string): RuleCondition {
  return Object.freeze({
    conditionId: "rule-condition-example-001",
    description: "Expenditure exceeds approved threshold (metadata description only).",
    readOnly: true as const,
  });
}

export function resolveRuleActionExample(timestamp: string): RuleAction {
  return Object.freeze({
    actionId: "rule-action-example-001",
    description: "Require secondary approval (metadata description only).",
    readOnly: true as const,
  });
}

export function resolveRuleExceptionExample(timestamp: string): RuleException {
  return Object.freeze({
    exceptionId: "rule-exception-example-001",
    description: "Emergency procurement exception (metadata description only).",
    readOnly: true as const,
  });
}

export function resolvePolicyCategoryExample(timestamp: string): PolicyCategory {
  return Object.freeze({
    categoryId: "policy-category-financial",
    categoryKey: "financial",
    label: "Financial",
    description: "Example policy category contract.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolvePolicyGroupExample(timestamp: string): PolicyGroup {
  return Object.freeze({
    groupId: "policy-group-corporate",
    groupKey: "corporate",
    label: "Corporate",
    description: "Example policy group contract.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveRuleOwnerExample(timestamp: string): RuleOwner {
  return Object.freeze({
    ownerId: "policy-owner-finance",
    label: "Finance Governance",
    description: "Example rule owner contract.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolveComplianceTagExample(timestamp: string): ComplianceTag {
  return Object.freeze({
    tagId: "compliance-tag-sox",
    tagKey: "sox",
    label: "SOX",
    description: "Example compliance tag contract.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolvePolicyNamespaceExample(timestamp: string): PolicyNamespace {
  return Object.freeze({
    namespaceId: "policy-namespace-knowledge-policy-rule-base",
    namespaceKey: "knowledge-policy-rule-base",
    label: "Policy Rule Base",
    description: "Example policy namespace contract.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function resolvePolicyExtensionPointExample(timestamp: string): PolicyExtensionPoint {
  return Object.freeze({
    extensionPointId: "policy-extension-best-practices",
    extensionPointKey: "best_practices",
    label: "Best Practices",
    description: "Reserved extension point for KNL-8 Best Practices.",
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: resolvePolicyMetadataExample(timestamp),
    readOnly: true as const,
  });
}

export function getPolicyRuleBaseManifest(timestamp: string = new Date(0).toISOString()): PolicyRuleBaseManifest {
  if (!isPolicyRuleBaseInitialized()) {
    initializePolicyRuleBase(timestamp);
  }
  return Object.freeze({
    platformId: POLICY_RULE_BASE_ID,
    platformName: POLICY_RULE_BASE_NAME,
    namespace: POLICY_RULE_BASE_NAMESPACE,
    contractVersion: POLICY_RULE_BASE_CONTRACT_VERSION,
    architectureVersion: POLICY_RULE_BASE_ARCHITECTURE_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    supportedPolicies: POLICY_KEYS,
    supportedCategories: POLICY_CATEGORY_KEYS,
    supportedRuleTypes: RULE_TYPE_KEYS,
    supportedComplianceTags: COMPLIANCE_TAG_KEYS,
    publicApis: POLICY_RULE_BASE_PUBLIC_API_REGISTRY,
    principles: POLICY_RULE_BASE_PRINCIPLES,
    mustNotOwn: POLICY_RULE_BASE_MUST_NOT_OWN,
    governanceRules: POLICY_RULE_BASE_GOVERNANCE_RULES,
    futurePhases: POLICY_RULE_BASE_FUTURE_PHASE_KEYS,
    generatedAt: timestamp,
    readOnly: true as const,
  });
}

export function validatePolicyRuleBase(timestamp: string = new Date(0).toISOString()): PolicyRuleBaseValidationReport {
  const issues: PolicyRuleBaseValidationReport["issues"][number][] = [];

  const dependencyValidation = validatePolicyRuleBaseDependencyDeclarations();
  if (!dependencyValidation.valid) issues.push(...dependencyValidation.issues);

  const versionValidation = validatePolicyRuleBaseContractVersion();
  if (!versionValidation.valid) issues.push(...versionValidation.issues);

  const namespaceValidation = validatePolicyRuleBaseCoreNamespace();
  if (!namespaceValidation.valid) issues.push(...namespaceValidation.issues);

  if (!isPolicyRuleBaseInitialized()) {
    initializePolicyRuleBase(timestamp);
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

  const manifestValidation = validateStageManifest(POLICY_RULE_BASE_SELF_MANIFEST);
  if (!manifestValidation.valid) {
    for (const entry of manifestValidation.issues) {
      issues.push(Object.freeze({ code: entry.code, message: entry.message, readOnly: true as const }));
    }
  }

  const snapshot = getPolicyRuleBaseSnapshot();
  if (snapshot.policyCount < POLICY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "catalog_incomplete",
        message: "Policy catalog must contain all seeded policies.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.ruleCount < POLICY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "rules_incomplete",
        message: "Policy rule catalog must contain seeded business rules.",
        readOnly: true as const,
      })
    );
  }
  if (snapshot.categoryCount < POLICY_CATEGORY_KEYS.length) {
    issues.push(
      Object.freeze({
        code: "registry_incomplete",
        message: "Policy category registry must contain seeded defaults.",
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
    baseInitialized: isPolicyRuleBaseInitialized(),
    registryValid:
      snapshot.policyCount >= POLICY_KEYS.length &&
      snapshot.ruleCount >= POLICY_KEYS.length &&
      snapshot.categoryCount >= POLICY_CATEGORY_KEYS.length,
    identityValid: versionValidation.valid,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const PolicyRuleBaseContract = Object.freeze({
  POLICY_RULE_BASE_PUBLIC_API_RULES,
  POLICY_RULE_BASE_SELF_MANIFEST,
  getPolicyRuleBaseManifest,
  validatePolicyRuleBase,
  resolvePolicyExample,
  resolveBusinessRuleExample,
  version: POLICY_RULE_BASE_CONTRACT_VERSION,
});
