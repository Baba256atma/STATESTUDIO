/**
 * KNL-7 — Policy & Rule Base metadata registry.
 */

import {
  COMPLIANCE_TAG_KEYS,
  POLICY_CATEGORY_KEYS,
  POLICY_CATEGORY_MAP,
  POLICY_EXTENSION_POINT_KEYS,
  POLICY_GROUP_KEYS,
  POLICY_GROUP_MAP,
  POLICY_KEYS,
  POLICY_LABELS,
  POLICY_NAMESPACE_KEYS,
  POLICY_RULE_BASE_CONTRACT_VERSION,
  POLICY_RULE_BASE_DEFAULT_LIMITS,
  POLICY_RULE_BASE_ID,
  POLICY_RULE_BASE_NAMESPACE,
  POLICY_RULE_BASE_OWNER,
} from "./policyRuleCatalog.ts";
import type {
  BusinessRule,
  BusinessRuleRegistrationInput,
  ComplianceTag,
  Policy,
  PolicyCategory,
  PolicyCategoryRegistrationInput,
  PolicyExtensionPoint,
  PolicyGroup,
  PolicyMetadata,
  PolicyNamespace,
  PolicyRegistrationInput,
  PolicyResult,
  PolicyRuleBaseSnapshot,
  PolicyRuleBaseState,
  RuleOwner,
} from "./policyRuleTypes.ts";
import type { PolicyCategoryKey, PolicyGroupKey } from "./policyRuleTypes.ts";
import {
  validateBusinessRuleRegistration,
  validatePolicyCategoryRegistration,
  validatePolicyRegistration,
} from "./policyRuleValidation.ts";
import { initializeFrameworkLibrary } from "./frameworkLibraryRegistry.ts";

export const POLICY_RULE_BASE_REGISTRY_VERSION = "KNL/7-REGISTRY-1" as const;

const POLICY_FRAMEWORK_MAP: Readonly<Record<(typeof POLICY_KEYS)[number], string>> = Object.freeze({
  financial: "framework-balanced_scorecard",
  hr: "framework-mckinsey_7s",
  security: "framework-swot",
  compliance: "framework-pdca",
  risk: "framework-porters_five_forces",
  procurement: "framework-value_chain",
  quality: "framework-pdca",
  governance: "framework-raci",
  data: "framework-business_model_canvas",
  privacy: "framework-pestel",
  operational: "framework-okr",
  it: "framework-kpi_framework",
});

const POLICY_COMPLIANCE_MAP: Readonly<Record<(typeof POLICY_KEYS)[number], readonly (typeof COMPLIANCE_TAG_KEYS)[number][]>> =
  Object.freeze({
    financial: Object.freeze(["sox", "internal"] as const),
    hr: Object.freeze(["internal"] as const),
    security: Object.freeze(["iso27001", "internal"] as const),
    compliance: Object.freeze(["sox", "internal"] as const),
    risk: Object.freeze(["internal"] as const),
    procurement: Object.freeze(["internal"] as const),
    quality: Object.freeze(["iso27001", "internal"] as const),
    governance: Object.freeze(["sox", "internal"] as const),
    data: Object.freeze(["gdpr", "internal"] as const),
    privacy: Object.freeze(["gdpr", "hipaa", "internal"] as const),
    operational: Object.freeze(["internal"] as const),
    it: Object.freeze(["iso27001", "pci_dss", "internal"] as const),
  });

const policyRegistry = new Map<string, Policy>();
const ruleRegistry = new Map<string, BusinessRule>();
const categoryRegistry = new Map<string, PolicyCategory>();
const groupRegistry = new Map<string, PolicyGroup>();
const ownerRegistry = new Map<string, RuleOwner>();
const complianceTagRegistry = new Map<string, ComplianceTag>();
const namespaceRegistry = new Map<string, PolicyNamespace>();
const extensionPointRegistry = new Map<string, PolicyExtensionPoint>();
const metadataRegistry = new Map<string, PolicyMetadata>();

let baseInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): PolicyResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: POLICY_RULE_BASE_CONTRACT_VERSION,
    namespace: POLICY_RULE_BASE_NAMESPACE,
    owner: POLICY_RULE_BASE_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetPolicyRuleBaseRegistryForTests(): void {
  policyRegistry.clear();
  ruleRegistry.clear();
  categoryRegistry.clear();
  groupRegistry.clear();
  ownerRegistry.clear();
  complianceTagRegistry.clear();
  namespaceRegistry.clear();
  extensionPointRegistry.clear();
  metadataRegistry.clear();
  baseInitialized = false;
  lastInitializedAt = null;
}

export function isPolicyRuleBaseInitialized(): boolean {
  return baseInitialized;
}

export function getPolicyRuleBaseState(timestamp: string = new Date(0).toISOString()): PolicyRuleBaseState {
  const snapshot = getPolicyRuleBaseSnapshot();
  return Object.freeze({
    platformId: POLICY_RULE_BASE_ID,
    contractVersion: POLICY_RULE_BASE_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    ontologyDependency: "KNL/2",
    vocabularyDependency: "KNL/3",
    graphDependency: "KNL/4",
    industryDependency: "KNL/5",
    frameworkDependency: "KNL/6",
    initialized: baseInitialized,
    policyCount: snapshot.policyCount,
    ruleCount: snapshot.ruleCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializePolicyRuleBase(
  timestamp: string = new Date(0).toISOString()
): PolicyResult<PolicyRuleBaseState> {
  const framework = initializeFrameworkLibrary(timestamp);
  if (!framework.success) {
    return createResult(false, "KNL/6 Framework Library initialization failed.", null);
  }
  seedPolicyRuleBaseCatalog(timestamp);
  baseInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Policy rule base initialized.", getPolicyRuleBaseState(timestamp));
}

export function registerPolicy(
  input: PolicyRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): PolicyResult<Policy> {
  const validation = validatePolicyRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (policyRegistry.size >= POLICY_RULE_BASE_DEFAULT_LIMITS.maxRegisteredPolicies) {
    return createResult(false, "Policy registration limit reached.", null);
  }
  if (policyRegistry.has(input.policyId)) {
    return createResult(false, `Policy already registered: ${input.policyId}.`, null);
  }
  const duplicateName = [...policyRegistry.values(), ...ruleRegistry.values()].some(
    (entry) =>
      "canonicalName" in entry &&
      entry.canonicalName.trim().toLowerCase() === input.canonicalName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Canonical name already registered: ${input.canonicalName}.`, null);
  }
  const entry = Object.freeze({
    policyId: input.policyId,
    policyKey: input.policyKey,
    canonicalName: input.canonicalName,
    label: input.label,
    description: input.description,
    categoryKey: input.categoryKey,
    groupKey: input.groupKey,
    status: input.status,
    ontologyEntityId: input.ontologyEntityId ?? null,
    frameworkId: input.frameworkId ?? null,
    industryModelId: input.industryModelId ?? null,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-policy-${input.policyId}`, timestamp),
    readOnly: true as const,
  });
  policyRegistry.set(entry.policyId, entry);
  return createResult(true, "Policy registered.", entry);
}

export function registerBusinessRule(
  input: BusinessRuleRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): PolicyResult<BusinessRule> {
  const validation = validateBusinessRuleRegistration(
    input,
    [...policyRegistry.keys()]
  );
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (ruleRegistry.size >= POLICY_RULE_BASE_DEFAULT_LIMITS.maxRegisteredRules) {
    return createResult(false, "Business rule registration limit reached.", null);
  }
  if (ruleRegistry.has(input.ruleId)) {
    return createResult(false, `Business rule already registered: ${input.ruleId}.`, null);
  }
  const duplicateName = [...policyRegistry.values(), ...ruleRegistry.values()].some(
    (entry) =>
      "canonicalName" in entry &&
      entry.canonicalName.trim().toLowerCase() === input.canonicalName.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Canonical name already registered: ${input.canonicalName}.`, null);
  }
  const condition = Object.freeze({
    conditionId: `rule-condition-${input.ruleId}`,
    description: input.conditionDescription,
    readOnly: true as const,
  });
  const action = Object.freeze({
    actionId: `rule-action-${input.ruleId}`,
    description: input.actionDescription,
    readOnly: true as const,
  });
  const exception = input.exceptionDescription
    ? Object.freeze({
        exceptionId: `rule-exception-${input.ruleId}`,
        description: input.exceptionDescription,
        readOnly: true as const,
      })
    : null;
  const entry = Object.freeze({
    ruleId: input.ruleId,
    policyId: input.policyId,
    canonicalName: input.canonicalName,
    label: input.label,
    description: input.description,
    ruleType: input.ruleType,
    ruleScope: input.ruleScope,
    priority: input.priority,
    severity: input.severity,
    status: input.status,
    condition,
    action,
    exception,
    ownerId: input.ownerId ?? null,
    complianceTags: Object.freeze([...(input.complianceTags ?? [])]),
    ontologyEntityId: input.ontologyEntityId ?? null,
    frameworkId: input.frameworkId ?? null,
    industryModelId: input.industryModelId ?? null,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-rule-${input.ruleId}`, timestamp),
    readOnly: true as const,
  });
  ruleRegistry.set(entry.ruleId, entry);
  return createResult(true, "Business rule registered.", entry);
}

export function registerPolicyCategory(
  input: PolicyCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): PolicyResult<PolicyCategory> {
  const validation = validatePolicyCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.size >= POLICY_RULE_BASE_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Policy category registration limit reached.", null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Policy category already registered: ${input.categoryId}.`, null);
  }
  const duplicateKey = [...categoryRegistry.values()].some((entry) => entry.categoryKey === input.categoryKey);
  if (duplicateKey) {
    return createResult(false, `Policy category key already registered: ${input.categoryKey}.`, null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label,
    description: input.description,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Policy category registered.", entry);
}

function registerPolicyGroup(groupKey: PolicyGroupKey, timestamp: string): PolicyResult<PolicyGroup> {
  const groupId = `policy-group-${groupKey}`;
  if (groupRegistry.has(groupId)) {
    return createResult(false, `Policy group already registered: ${groupId}.`, null);
  }
  const entry = Object.freeze({
    groupId,
    groupKey,
    label: groupKey,
    description: `${groupKey} policy group metadata.`,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-group-${groupKey}`, timestamp),
    readOnly: true as const,
  });
  groupRegistry.set(entry.groupId, entry);
  return createResult(true, "Policy group registered.", entry);
}

function registerRuleOwner(ownerId: string, label: string, description: string, timestamp: string): PolicyResult<RuleOwner> {
  if (ownerRegistry.has(ownerId)) {
    return createResult(false, `Rule owner already registered: ${ownerId}.`, null);
  }
  const entry = Object.freeze({
    ownerId,
    label,
    description,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-owner-${ownerId}`, timestamp),
    readOnly: true as const,
  });
  ownerRegistry.set(entry.ownerId, entry);
  return createResult(true, "Rule owner registered.", entry);
}

function registerComplianceTag(
  tagKey: (typeof COMPLIANCE_TAG_KEYS)[number],
  timestamp: string
): PolicyResult<ComplianceTag> {
  const tagId = `compliance-tag-${tagKey}`;
  if (complianceTagRegistry.has(tagId)) {
    return createResult(false, `Compliance tag already registered: ${tagId}.`, null);
  }
  const entry = Object.freeze({
    tagId,
    tagKey,
    label: tagKey.toUpperCase(),
    description: `${tagKey} compliance tag metadata.`,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-compliance-${tagKey}`, timestamp),
    readOnly: true as const,
  });
  complianceTagRegistry.set(entry.tagId, entry);
  return createResult(true, "Compliance tag registered.", entry);
}

function registerPolicyNamespace(
  namespaceKey: (typeof POLICY_NAMESPACE_KEYS)[number],
  timestamp: string
): PolicyResult<PolicyNamespace> {
  const namespaceId = `policy-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Policy namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} policy namespace metadata.`,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Policy namespace registered.", entry);
}

function registerPolicyExtensionPoint(
  extensionPointKey: (typeof POLICY_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): PolicyResult<PolicyExtensionPoint> {
  const extensionPointId = `policy-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Policy extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} policy extension point metadata.`,
    version: POLICY_RULE_BASE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Policy extension point registered.", entry);
}

export function getPolicyRuleBaseSnapshot(): PolicyRuleBaseSnapshot {
  return Object.freeze({
    platformVersion: POLICY_RULE_BASE_CONTRACT_VERSION,
    policyCount: policyRegistry.size,
    ruleCount: ruleRegistry.size,
    categoryCount: categoryRegistry.size || POLICY_CATEGORY_KEYS.length,
    groupCount: groupRegistry.size || POLICY_GROUP_KEYS.length,
    ownerCount: ownerRegistry.size,
    complianceTagCount: complianceTagRegistry.size || COMPLIANCE_TAG_KEYS.length,
    namespaceCount: namespaceRegistry.size || POLICY_NAMESPACE_KEYS.length,
    readOnly: true as const,
  });
}

export function getPolicyRuleBaseRegistry(): Readonly<{
  policies: readonly Policy[];
  rules: readonly BusinessRule[];
  categories: readonly PolicyCategory[];
  groups: readonly PolicyGroup[];
  owners: readonly RuleOwner[];
  complianceTags: readonly ComplianceTag[];
  namespaces: readonly PolicyNamespace[];
  extensionPoints: readonly PolicyExtensionPoint[];
  metadataRecords: readonly PolicyMetadata[];
  snapshot: PolicyRuleBaseSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    policies: Object.freeze(
      [...policyRegistry.values()].sort((a, b) => a.policyId.localeCompare(b.policyId))
    ),
    rules: Object.freeze(
      [...ruleRegistry.values()].sort((a, b) => a.ruleId.localeCompare(b.ruleId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    groups: Object.freeze(
      [...groupRegistry.values()].sort((a, b) => a.groupId.localeCompare(b.groupId))
    ),
    owners: Object.freeze(
      [...ownerRegistry.values()].sort((a, b) => a.ownerId.localeCompare(b.ownerId))
    ),
    complianceTags: Object.freeze(
      [...complianceTagRegistry.values()].sort((a, b) => a.tagId.localeCompare(b.tagId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getPolicyRuleBaseSnapshot(),
    readOnly: true as const,
  });
}

export function seedPolicyRuleBaseCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (policyRegistry.size > 0) {
    return;
  }
  for (const categoryKey of POLICY_CATEGORY_KEYS) {
    registerPolicyCategory(
      Object.freeze({
        categoryId: `policy-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} policy category metadata.`,
      }),
      timestamp
    );
  }
  for (const groupKey of POLICY_GROUP_KEYS) {
    registerPolicyGroup(groupKey, timestamp);
  }
  for (const tagKey of COMPLIANCE_TAG_KEYS) {
    registerComplianceTag(tagKey, timestamp);
  }
  for (const namespaceKey of POLICY_NAMESPACE_KEYS) {
    registerPolicyNamespace(namespaceKey, timestamp);
  }
  for (const extensionPointKey of POLICY_EXTENSION_POINT_KEYS) {
    registerPolicyExtensionPoint(extensionPointKey, timestamp);
  }
  registerRuleOwner(
    "policy-owner-governance",
    "Governance Office",
    "Central governance rule ownership metadata.",
    timestamp
  );
  registerRuleOwner(
    "policy-owner-finance",
    "Finance Governance",
    "Financial policy rule ownership metadata.",
    timestamp
  );
  registerRuleOwner(
    "policy-owner-security",
    "Security Office",
    "Security policy rule ownership metadata.",
    timestamp
  );
  for (const policyKey of POLICY_KEYS) {
    const policyId = `policy-${policyKey}`;
    const categoryKey = POLICY_CATEGORY_MAP[policyKey];
    const groupKey = POLICY_GROUP_MAP[policyKey];
    registerPolicy(
      Object.freeze({
        policyId,
        policyKey,
        canonicalName: policyKey,
        label: POLICY_LABELS[policyKey],
        description: `Canonical metadata for ${POLICY_LABELS[policyKey]}.`,
        categoryKey,
        groupKey,
        status: "active",
        ontologyEntityId: "business-relationship-type-supports",
        frameworkId: POLICY_FRAMEWORK_MAP[policyKey],
        industryModelId: "industry-model-technology",
      }),
      timestamp
    );
    registerBusinessRule(
      Object.freeze({
        ruleId: `business-rule-${policyKey}-001`,
        policyId,
        canonicalName: `${policyKey}_governance_rule`,
        label: `${POLICY_LABELS[policyKey]} Governance Rule`,
        description: `Primary governance rule metadata for ${POLICY_LABELS[policyKey]}.`,
        ruleType: "mandatory",
        ruleScope: "organization",
        priority: "high",
        severity: "major",
        status: "active",
        conditionDescription: `Applies when ${POLICY_LABELS[policyKey]} scope is active (metadata only).`,
        actionDescription: `Require documented compliance with ${POLICY_LABELS[policyKey]} (metadata only).`,
        ownerId: policyKey === "financial" ? "policy-owner-finance" : policyKey === "security" ? "policy-owner-security" : "policy-owner-governance",
        complianceTags: POLICY_COMPLIANCE_MAP[policyKey],
        ontologyEntityId: "business-relationship-type-supports",
        frameworkId: POLICY_FRAMEWORK_MAP[policyKey],
        industryModelId: "industry-model-technology",
      }),
      timestamp
    );
  }
  const rootMetadata = createMetadata("policy-rule-base-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const PolicyRuleBaseRegistry = Object.freeze({
  resetPolicyRuleBaseRegistryForTests,
  initializePolicyRuleBase,
  registerPolicy,
  registerBusinessRule,
  registerPolicyCategory,
  getPolicyRuleBaseRegistry,
  getPolicyRuleBaseSnapshot,
  seedPolicyRuleBaseCatalog,
});
