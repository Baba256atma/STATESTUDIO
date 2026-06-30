/**
 * KNL-13 — Knowledge Governance Platform metadata registry.
 */

import {
  APPROVAL_POLICY_KEYS,
  AUDIT_POLICY_KEYS,
  CERTIFICATION_POLICY_KEYS,
  GOVERNANCE_DEPENDENCY_KEYS,
  GOVERNANCE_EXTENSION_POINT_KEYS,
  GOVERNANCE_KNL_VERSION_MAP,
  GOVERNANCE_LIFECYCLE_KEYS,
  GOVERNANCE_NAMESPACE_KEYS,
  GOVERNANCE_PLATFORM_ID_MAP,
  GOVERNANCE_PLATFORM_KEYS,
  GOVERNANCE_PLATFORM_LABELS,
  GOVERNANCE_RULE_KEYS,
  GOVERNANCE_SCOPE_KEYS,
  GOVERNANCE_STATUS_KEYS,
  KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
  KNOWLEDGE_GOVERNANCE_DEFAULT_LIMITS,
  KNOWLEDGE_GOVERNANCE_NAMESPACE,
  KNOWLEDGE_GOVERNANCE_OWNER,
  KNOWLEDGE_GOVERNANCE_PLATFORM_ID,
} from "./knowledgeGovernanceCatalog.ts";
import type {
  ApprovalPolicy,
  AuditPolicy,
  CertificationPolicy,
  GovernanceDependency,
  GovernanceExtensionPoint,
  GovernanceLifecycle,
  GovernanceMetadata,
  GovernanceNamespace,
  GovernanceRule,
  GovernanceScope,
  KnowledgeGovernancePlatformSnapshot,
  KnowledgeGovernancePlatformState,
  KnowledgeGovernancePolicy,
  KnowledgeGovernancePolicyRegistrationInput,
  KnowledgeGovernanceResult,
  KnowledgeOwner,
  KnowledgeOwnerRegistrationInput,
  KnowledgeSteward,
  KnowledgeStewardRegistrationInput,
} from "./knowledgeGovernanceTypes.ts";
import {
  validateKnowledgeGovernancePolicyRegistration,
  validateKnowledgeOwnerRegistration,
  validateKnowledgeStewardRegistration,
} from "./knowledgeGovernanceValidation.ts";
import { initializeKnowledgeLearningBridgePlatform } from "./knowledgeLearningBridgeRegistry.ts";

export const KNOWLEDGE_GOVERNANCE_REGISTRY_VERSION = "KNL/13-REGISTRY-1" as const;

const policyRegistry = new Map<string, KnowledgeGovernancePolicy>();
const policyKeyRegistry = new Map<string, KnowledgeGovernancePolicy>();
const ownerRegistry = new Map<string, KnowledgeOwner>();
const ownerKeyRegistry = new Map<string, KnowledgeOwner>();
const stewardRegistry = new Map<string, KnowledgeSteward>();
const stewardKeyRegistry = new Map<string, KnowledgeSteward>();
const ruleRegistry = new Map<string, GovernanceRule>();
const approvalPolicyRegistry = new Map<string, ApprovalPolicy>();
const certificationPolicyRegistry = new Map<string, CertificationPolicy>();
const auditPolicyRegistry = new Map<string, AuditPolicy>();
const namespaceRegistry = new Map<string, GovernanceNamespace>();
const dependencyRegistry = new Map<string, GovernanceDependency>();
const extensionPointRegistry = new Map<string, GovernanceExtensionPoint>();
const scopeRegistry = new Map<string, GovernanceScope>();
const lifecycleRegistry = new Map<string, GovernanceLifecycle>();
const metadataRegistry = new Map<string, GovernanceMetadata>();

let platformInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): KnowledgeGovernanceResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    namespace: KNOWLEDGE_GOVERNANCE_NAMESPACE,
    owner: KNOWLEDGE_GOVERNANCE_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetKnowledgeGovernanceRegistryForTests(): void {
  policyRegistry.clear();
  policyKeyRegistry.clear();
  ownerRegistry.clear();
  ownerKeyRegistry.clear();
  stewardRegistry.clear();
  stewardKeyRegistry.clear();
  ruleRegistry.clear();
  approvalPolicyRegistry.clear();
  certificationPolicyRegistry.clear();
  auditPolicyRegistry.clear();
  namespaceRegistry.clear();
  dependencyRegistry.clear();
  extensionPointRegistry.clear();
  scopeRegistry.clear();
  lifecycleRegistry.clear();
  metadataRegistry.clear();
  platformInitialized = false;
  lastInitializedAt = null;
}

export function isKnowledgeGovernancePlatformInitialized(): boolean {
  return platformInitialized;
}

export function getKnowledgeGovernancePlatformSnapshot(): KnowledgeGovernancePlatformSnapshot {
  return Object.freeze({
    platformVersion: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    policyCount: policyRegistry.size,
    ownerCount: ownerRegistry.size,
    stewardCount: stewardRegistry.size,
    ruleCount: ruleRegistry.size,
    approvalPolicyCount: approvalPolicyRegistry.size,
    certificationPolicyCount: certificationPolicyRegistry.size,
    auditPolicyCount: auditPolicyRegistry.size,
    namespaceCount: namespaceRegistry.size || GOVERNANCE_NAMESPACE_KEYS.length,
    dependencyCount: dependencyRegistry.size || GOVERNANCE_DEPENDENCY_KEYS.length,
    readOnly: true as const,
  });
}

export function getKnowledgeGovernancePlatformState(
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernancePlatformState {
  const snapshot = getKnowledgeGovernancePlatformSnapshot();
  return Object.freeze({
    platformId: KNOWLEDGE_GOVERNANCE_PLATFORM_ID,
    contractVersion: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
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
    initialized: platformInitialized,
    policyCount: snapshot.policyCount,
    ownerCount: snapshot.ownerCount,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeKnowledgeGovernancePlatform(
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernanceResult<KnowledgeGovernancePlatformState> {
  const validation = initializeKnowledgeLearningBridgePlatform(timestamp);
  if (!validation.success) {
    return createResult(false, "KNL/12 Knowledge Learning Bridge initialization failed.", null);
  }
  seedKnowledgeGovernanceCatalog(timestamp);
  platformInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(
    true,
    "Knowledge governance platform initialized.",
    getKnowledgeGovernancePlatformState(timestamp)
  );
}

export function registerKnowledgeOwner(
  input: KnowledgeOwnerRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernanceResult<KnowledgeOwner> {
  const validation = validateKnowledgeOwnerRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (ownerRegistry.size >= KNOWLEDGE_GOVERNANCE_DEFAULT_LIMITS.maxRegisteredOwners) {
    return createResult(false, "Knowledge owner registration limit reached.", null);
  }
  if (ownerRegistry.has(input.ownerId)) {
    return createResult(false, `Knowledge owner already registered: ${input.ownerId}.`, null);
  }
  if (ownerKeyRegistry.has(input.ownerKey)) {
    return createResult(false, `Knowledge owner key already registered: ${input.ownerKey}.`, null);
  }
  const entry = Object.freeze({
    ownerId: input.ownerId,
    ownerKey: input.ownerKey,
    platformKey: input.platformKey,
    platformReference: input.platformReference,
    label: input.label,
    description: input.description,
    status: input.status,
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-owner-${input.ownerKey}`, timestamp),
    readOnly: true as const,
  });
  ownerRegistry.set(entry.ownerId, entry);
  ownerKeyRegistry.set(entry.ownerKey, entry);
  return createResult(true, "Knowledge owner registered.", entry);
}

export function registerKnowledgeSteward(
  input: KnowledgeStewardRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernanceResult<KnowledgeSteward> {
  const validation = validateKnowledgeStewardRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (stewardRegistry.size >= KNOWLEDGE_GOVERNANCE_DEFAULT_LIMITS.maxRegisteredStewards) {
    return createResult(false, "Knowledge steward registration limit reached.", null);
  }
  if (stewardRegistry.has(input.stewardId)) {
    return createResult(false, `Knowledge steward already registered: ${input.stewardId}.`, null);
  }
  if (stewardKeyRegistry.has(input.stewardKey)) {
    return createResult(false, `Knowledge steward key already registered: ${input.stewardKey}.`, null);
  }
  const entry = Object.freeze({
    stewardId: input.stewardId,
    stewardKey: input.stewardKey,
    platformKey: input.platformKey,
    label: input.label,
    description: input.description,
    status: input.status,
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-steward-${input.stewardKey}`, timestamp),
    readOnly: true as const,
  });
  stewardRegistry.set(entry.stewardId, entry);
  stewardKeyRegistry.set(entry.stewardKey, entry);
  return createResult(true, "Knowledge steward registered.", entry);
}

export function registerKnowledgeGovernancePolicy(
  input: KnowledgeGovernancePolicyRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): KnowledgeGovernanceResult<KnowledgeGovernancePolicy> {
  const registeredOwnerIds = [...ownerRegistry.keys()];
  const registeredStewardIds = [...stewardRegistry.keys()];
  const validation = validateKnowledgeGovernancePolicyRegistration(
    input,
    registeredOwnerIds,
    registeredStewardIds
  );
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (policyRegistry.size >= KNOWLEDGE_GOVERNANCE_DEFAULT_LIMITS.maxRegisteredPolicies) {
    return createResult(false, "Governance policy registration limit reached.", null);
  }
  if (policyRegistry.has(input.policyId)) {
    return createResult(false, `Governance policy already registered: ${input.policyId}.`, null);
  }
  if (policyKeyRegistry.has(input.policyKey)) {
    return createResult(false, `Governance policy key already registered: ${input.policyKey}.`, null);
  }
  const scope = Object.freeze({
    scopeId: `governance-scope-${input.scopeKey}`,
    scopeKey: input.scopeKey,
    label: input.scopeKey,
    description: `${input.scopeKey} governance scope metadata.`,
    readOnly: true as const,
  });
  const lifecycle = Object.freeze({
    lifecycleId: `governance-lifecycle-${input.lifecycleKey}`,
    lifecycleKey: input.lifecycleKey,
    label: input.lifecycleKey,
    description: `${input.lifecycleKey} governance lifecycle metadata.`,
    readOnly: true as const,
  });
  const approvalPolicy = Object.freeze({
    approvalPolicyId: `approval-policy-${input.platformKey}`,
    approvalPolicyKey: input.approvalPolicyKey,
    description: input.approvalPolicyDescription,
    readOnly: true as const,
  });
  const certificationPolicy = Object.freeze({
    certificationPolicyId: `certification-policy-${input.platformKey}`,
    certificationPolicyKey: input.certificationPolicyKey,
    description: input.certificationPolicyDescription,
    readOnly: true as const,
  });
  const auditPolicy = Object.freeze({
    auditPolicyId: `audit-policy-${input.platformKey}`,
    auditPolicyKey: input.auditPolicyKey,
    description: input.auditPolicyDescription,
    readOnly: true as const,
  });
  const governanceRule = Object.freeze({
    ruleId: `governance-rule-${input.platformKey}`,
    ruleKey: input.governanceRuleKey,
    description: input.governanceRuleDescription,
    readOnly: true as const,
  });
  const entry = Object.freeze({
    policyId: input.policyId,
    policyKey: input.policyKey,
    platformKey: input.platformKey,
    platformReference: input.platformReference,
    knlVersion: GOVERNANCE_KNL_VERSION_MAP[input.platformKey],
    scope,
    lifecycle,
    ownerId: input.ownerId,
    stewardId: input.stewardId,
    label: input.label,
    description: input.description,
    status: input.status,
    approvalPolicy,
    certificationPolicy,
    auditPolicy,
    governanceRules: Object.freeze([governanceRule]),
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-policy-${input.platformKey}`, timestamp),
    readOnly: true as const,
  });
  policyRegistry.set(entry.policyId, entry);
  policyKeyRegistry.set(entry.policyKey, entry);
  ruleRegistry.set(governanceRule.ruleId, governanceRule);
  approvalPolicyRegistry.set(approvalPolicy.approvalPolicyId, approvalPolicy);
  certificationPolicyRegistry.set(certificationPolicy.certificationPolicyId, certificationPolicy);
  auditPolicyRegistry.set(auditPolicy.auditPolicyId, auditPolicy);
  scopeRegistry.set(scope.scopeId, scope);
  lifecycleRegistry.set(lifecycle.lifecycleId, lifecycle);
  return createResult(true, "Governance policy registered.", entry);
}

function registerGovernanceNamespace(
  namespaceKey: (typeof GOVERNANCE_NAMESPACE_KEYS)[number],
  timestamp: string
): KnowledgeGovernanceResult<GovernanceNamespace> {
  const namespaceId = `governance-namespace-${namespaceKey}`;
  if (namespaceRegistry.has(namespaceId)) {
    return createResult(false, `Governance namespace already registered: ${namespaceId}.`, null);
  }
  const entry = Object.freeze({
    namespaceId,
    namespaceKey,
    label: namespaceKey,
    description: `${namespaceKey} governance namespace metadata.`,
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-namespace-${namespaceKey}`, timestamp),
    readOnly: true as const,
  });
  namespaceRegistry.set(entry.namespaceId, entry);
  return createResult(true, "Governance namespace registered.", entry);
}

function registerGovernanceDependency(
  dependencyKey: (typeof GOVERNANCE_DEPENDENCY_KEYS)[number],
  timestamp: string
): KnowledgeGovernanceResult<GovernanceDependency> {
  const dependencyId = `governance-dependency-${dependencyKey.replace("/", "-").toLowerCase()}`;
  if (dependencyRegistry.has(dependencyId)) {
    return createResult(false, `Governance dependency already registered: ${dependencyId}.`, null);
  }
  const entry = Object.freeze({
    dependencyId,
    dependencyKey,
    label: dependencyKey,
    description: `${dependencyKey} governance dependency metadata.`,
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-dependency-${dependencyKey.replace("/", "-")}`, timestamp),
    readOnly: true as const,
  });
  dependencyRegistry.set(entry.dependencyId, entry);
  return createResult(true, "Governance dependency registered.", entry);
}

function registerGovernanceExtensionPoint(
  extensionPointKey: (typeof GOVERNANCE_EXTENSION_POINT_KEYS)[number],
  timestamp: string
): KnowledgeGovernanceResult<GovernanceExtensionPoint> {
  const extensionPointId = `governance-extension-${extensionPointKey.replace(/_/g, "-")}`;
  if (extensionPointRegistry.has(extensionPointId)) {
    return createResult(false, `Governance extension point already registered: ${extensionPointId}.`, null);
  }
  const entry = Object.freeze({
    extensionPointId,
    extensionPointKey,
    label: extensionPointKey,
    description: `${extensionPointKey} governance extension point metadata.`,
    version: KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-extension-${extensionPointKey}`, timestamp),
    readOnly: true as const,
  });
  extensionPointRegistry.set(entry.extensionPointId, entry);
  return createResult(true, "Governance extension point registered.", entry);
}

export function getKnowledgeGovernancePlatformRegistry(): Readonly<{
  policies: readonly KnowledgeGovernancePolicy[];
  owners: readonly KnowledgeOwner[];
  stewards: readonly KnowledgeSteward[];
  rules: readonly GovernanceRule[];
  approvalPolicies: readonly ApprovalPolicy[];
  certificationPolicies: readonly CertificationPolicy[];
  auditPolicies: readonly AuditPolicy[];
  namespaces: readonly GovernanceNamespace[];
  dependencies: readonly GovernanceDependency[];
  extensionPoints: readonly GovernanceExtensionPoint[];
  scopes: readonly GovernanceScope[];
  lifecycles: readonly GovernanceLifecycle[];
  metadataRecords: readonly GovernanceMetadata[];
  snapshot: KnowledgeGovernancePlatformSnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    policies: Object.freeze(
      [...policyRegistry.values()].sort((a, b) => a.policyId.localeCompare(b.policyId))
    ),
    owners: Object.freeze(
      [...ownerRegistry.values()].sort((a, b) => a.ownerId.localeCompare(b.ownerId))
    ),
    stewards: Object.freeze(
      [...stewardRegistry.values()].sort((a, b) => a.stewardId.localeCompare(b.stewardId))
    ),
    rules: Object.freeze(
      [...ruleRegistry.values()].sort((a, b) => a.ruleId.localeCompare(b.ruleId))
    ),
    approvalPolicies: Object.freeze(
      [...approvalPolicyRegistry.values()].sort((a, b) => a.approvalPolicyId.localeCompare(b.approvalPolicyId))
    ),
    certificationPolicies: Object.freeze(
      [...certificationPolicyRegistry.values()].sort((a, b) =>
        a.certificationPolicyId.localeCompare(b.certificationPolicyId)
      )
    ),
    auditPolicies: Object.freeze(
      [...auditPolicyRegistry.values()].sort((a, b) => a.auditPolicyId.localeCompare(b.auditPolicyId))
    ),
    namespaces: Object.freeze(
      [...namespaceRegistry.values()].sort((a, b) => a.namespaceId.localeCompare(b.namespaceId))
    ),
    dependencies: Object.freeze(
      [...dependencyRegistry.values()].sort((a, b) => a.dependencyId.localeCompare(b.dependencyId))
    ),
    extensionPoints: Object.freeze(
      [...extensionPointRegistry.values()].sort((a, b) => a.extensionPointId.localeCompare(b.extensionPointId))
    ),
    scopes: Object.freeze(
      [...scopeRegistry.values()].sort((a, b) => a.scopeId.localeCompare(b.scopeId))
    ),
    lifecycles: Object.freeze(
      [...lifecycleRegistry.values()].sort((a, b) => a.lifecycleId.localeCompare(b.lifecycleId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getKnowledgeGovernancePlatformSnapshot(),
    readOnly: true as const,
  });
}

export function seedKnowledgeGovernanceCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (policyRegistry.size > 0) {
    return;
  }
  for (const namespaceKey of GOVERNANCE_NAMESPACE_KEYS) {
    registerGovernanceNamespace(namespaceKey, timestamp);
  }
  for (const dependencyKey of GOVERNANCE_DEPENDENCY_KEYS) {
    registerGovernanceDependency(dependencyKey, timestamp);
  }
  for (const extensionPointKey of GOVERNANCE_EXTENSION_POINT_KEYS) {
    registerGovernanceExtensionPoint(extensionPointKey, timestamp);
  }
  for (const platformKey of GOVERNANCE_PLATFORM_KEYS) {
    registerKnowledgeOwner(
      Object.freeze({
        ownerId: `knowledge-owner-${platformKey}`,
        ownerKey: `${platformKey}_owner`,
        platformKey,
        platformReference: GOVERNANCE_PLATFORM_ID_MAP[platformKey],
        label: `${GOVERNANCE_PLATFORM_LABELS[platformKey]} Owner`,
        description: `Governance owner metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
        status: "active",
      }),
      timestamp
    );
    registerKnowledgeSteward(
      Object.freeze({
        stewardId: `knowledge-steward-${platformKey}`,
        stewardKey: `${platformKey}_steward`,
        platformKey,
        label: `${GOVERNANCE_PLATFORM_LABELS[platformKey]} Steward`,
        description: `Governance steward metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
        status: "active",
      }),
      timestamp
    );
    registerKnowledgeGovernancePolicy(
      Object.freeze({
        policyId: `governance-policy-${platformKey}`,
        policyKey: `${platformKey}_governance`,
        platformKey,
        platformReference: GOVERNANCE_PLATFORM_ID_MAP[platformKey],
        scopeKey: GOVERNANCE_SCOPE_KEYS[0],
        lifecycleKey: GOVERNANCE_LIFECYCLE_KEYS[1],
        ownerId: `knowledge-owner-${platformKey}`,
        stewardId: `knowledge-steward-${platformKey}`,
        label: `${GOVERNANCE_PLATFORM_LABELS[platformKey]} Governance`,
        description: `Governance policy metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]} (no workflow).`,
        status: "active",
        approvalPolicyKey: APPROVAL_POLICY_KEYS[0],
        approvalPolicyDescription: `Approval policy metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
        certificationPolicyKey: CERTIFICATION_POLICY_KEYS[0],
        certificationPolicyDescription: `Certification policy metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
        auditPolicyKey: AUDIT_POLICY_KEYS[0],
        auditPolicyDescription: `Audit policy metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
        governanceRuleKey: GOVERNANCE_RULE_KEYS[0],
        governanceRuleDescription: `Governance rule metadata for ${GOVERNANCE_PLATFORM_LABELS[platformKey]}.`,
      }),
      timestamp
    );
  }
  for (const statusKey of GOVERNANCE_STATUS_KEYS) {
    const metadata = createMetadata(`metadata-status-${statusKey}`, timestamp);
    metadataRegistry.set(metadata.metadataId, metadata);
  }
  const rootMetadata = createMetadata("knowledge-governance-platform-root-metadata", timestamp, Object.freeze({ catalog: "default" }));
  metadataRegistry.set(rootMetadata.metadataId, rootMetadata);
}

export const KnowledgeGovernanceRegistry = Object.freeze({
  resetKnowledgeGovernanceRegistryForTests,
  initializeKnowledgeGovernancePlatform,
  registerKnowledgeGovernancePolicy,
  registerKnowledgeOwner,
  registerKnowledgeSteward,
  getKnowledgeGovernancePlatformRegistry,
  getKnowledgeGovernancePlatformSnapshot,
  seedKnowledgeGovernanceCatalog,
});
