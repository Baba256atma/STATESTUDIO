import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  GOVERNANCE_PLATFORM_KEYS,
  GOVERNANCE_PLATFORM_LABELS,
  GOVERNANCE_PLATFORM_ID_MAP,
  GOVERNANCE_KNL_VERSION_MAP,
  KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION,
  KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS,
  KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN,
  KNOWLEDGE_GOVERNANCE_PRINCIPLES,
  KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY,
} from "./knowledgeGovernanceCatalog.ts";
import {
  KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES,
  KNOWLEDGE_GOVERNANCE_SELF_MANIFEST,
  KnowledgeGovernanceContract,
  getKnowledgeGovernanceManifest,
  resolveKnowledgeGovernancePolicyExample,
  resolveKnowledgeOwnerExample,
  validateKnowledgeGovernancePlatform,
} from "./knowledgeGovernanceContracts.ts";
import {
  KnowledgeGovernancePlatformFacade,
  buildKnowledgeGovernancePlatform,
  getKnowledgeGovernancePlatform,
  isKnowledgeGovernancePlatformInitialized,
  registerKnowledgeGovernancePolicy,
  registerKnowledgeOwner,
  registerKnowledgeSteward,
  resetKnowledgeGovernancePlatformForTests,
} from "./knowledgeGovernancePlatform.ts";
import {
  hasDuplicateOwnerIds,
  hasDuplicateOwnerKeys,
  hasDuplicatePolicyIds,
  hasDuplicatePolicyKeys,
  hasDuplicateStewardIds,
  hasDuplicateStewardKeys,
  validateGovernanceDependencyReference,
  validateGovernancePlatformReference,
  validateKnowledgeGovernanceNamespaceFormat,
  validateKnowledgeGovernanceVersionFormat,
  validatePolicyKeyFormat,
} from "./knowledgeGovernanceValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeGovernancePlatformForTests();
});

test("exports KNL/13 knowledge governance contract vocabulary", () => {
  assert.equal(KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION, "KNL/13");
  assert.equal(GOVERNANCE_PLATFORM_KEYS.length, 12);
  assert.equal(GOVERNANCE_PLATFORM_KEYS.includes("knl_learning_bridge"), true);
});

test("initializes knowledge governance platform with KNL/1 through KNL/12 dependencies", () => {
  assert.equal(isKnowledgeGovernancePlatformInitialized(), false);
  const init = buildKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeGovernancePlatformInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.bestPracticeDependency, "KNL/8");
  assert.equal(init.data?.retrievalDependency, "KNL/9");
  assert.equal(init.data?.validationDependency, "KNL/10");
  assert.equal(init.data?.versioningDependency, "KNL/11");
  assert.equal(init.data?.learningBridgeDependency, "KNL/12");
  assert.equal(init.data?.contractVersion, "KNL/13");
});

test("seeds governance catalog with 12 policies owners and stewards", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const platform = getKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(platform.registry.policies.length, 12);
  assert.equal(platform.registry.owners.length, 12);
  assert.equal(platform.registry.stewards.length, 12);
  assert.equal(platform.registry.dependencies.length, 12);
  assert.equal(platform.registry.namespaces.length, 4);
  assert.equal(platform.registry.extensionPoints.length, 2);
  for (const platformKey of GOVERNANCE_PLATFORM_KEYS) {
    assert.ok(platform.registry.policies.some((entry) => entry.platformKey === platformKey));
    assert.ok(platform.registry.owners.some((entry) => entry.ownerId === `knowledge-owner-${platformKey}`));
    assert.ok(platform.registry.stewards.some((entry) => entry.stewardId === `knowledge-steward-${platformKey}`));
  }
});

test("registers custom governance policy owner and steward rejects duplicates", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const duplicateOwner = registerKnowledgeOwner(
    Object.freeze({
      ownerId: "knowledge-owner-knl_foundation",
      ownerKey: "custom_owner",
      platformKey: "knl_foundation",
      platformReference: "knowledge-platform",
      label: "Duplicate Owner",
      description: "Duplicate owner id.",
      status: "active",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateOwner.success, false);
  const duplicateSteward = registerKnowledgeSteward(
    Object.freeze({
      stewardId: "knowledge-steward-knl_foundation",
      stewardKey: "custom_steward",
      platformKey: "knl_foundation",
      label: "Duplicate Steward",
      description: "Duplicate steward id.",
      status: "active",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateSteward.success, false);
  const duplicatePolicy = registerKnowledgeGovernancePolicy(
    Object.freeze({
      policyId: "governance-policy-knl_foundation",
      policyKey: "knl_ontology_governance",
      platformKey: "knl_ontology",
      platformReference: "business-ontology",
      scopeKey: "platform",
      lifecycleKey: "active",
      ownerId: "knowledge-owner-knl_ontology",
      stewardId: "knowledge-steward-knl_ontology",
      label: "Duplicate Policy",
      description: "Duplicate policy id.",
      status: "active",
      approvalPolicyKey: "metadata_review",
      approvalPolicyDescription: "Approval.",
      certificationPolicyKey: "platform_certification",
      certificationPolicyDescription: "Certification.",
      auditPolicyKey: "metadata_audit",
      auditPolicyDescription: "Audit.",
      governanceRuleKey: "ownership",
      governanceRuleDescription: "Rule.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicatePolicy.success, false);
});

test("prevents duplicate policy ids policy keys owner keys and steward keys", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(hasDuplicatePolicyIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicatePolicyKeys(["a", "b", "a"]), true);
  assert.equal(hasDuplicateOwnerIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateOwnerKeys(["a", "b", "a"]), true);
  assert.equal(hasDuplicateStewardIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateStewardKeys(["a", "b", "a"]), true);
});

test("rejects invalid platform dependency and owner references", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const invalidPlatform = registerKnowledgeGovernancePolicy(
    Object.freeze({
      policyId: "governance-policy-invalid-platform",
      policyKey: "knl_graph_governance",
      platformKey: "knl_graph",
      platformReference: "wrong-platform-id",
      scopeKey: "platform",
      lifecycleKey: "active",
      ownerId: "knowledge-owner-knl_graph",
      stewardId: "knowledge-steward-knl_graph",
      label: "Invalid Platform",
      description: "Invalid platform reference.",
      status: "active",
      approvalPolicyKey: "metadata_review",
      approvalPolicyDescription: "Approval.",
      certificationPolicyKey: "platform_certification",
      certificationPolicyDescription: "Certification.",
      auditPolicyKey: "metadata_audit",
      auditPolicyDescription: "Audit.",
      governanceRuleKey: "ownership",
      governanceRuleDescription: "Rule.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPlatform.success, false);
  const invalidPolicyKey = registerKnowledgeGovernancePolicy(
    Object.freeze({
      policyId: "governance-policy-invalid-key",
      policyKey: "wrong_policy_key",
      platformKey: "knl_graph",
      platformReference: "knowledge-graph",
      scopeKey: "platform",
      lifecycleKey: "active",
      ownerId: "knowledge-owner-knl_graph",
      stewardId: "knowledge-steward-knl_graph",
      label: "Invalid Policy Key",
      description: "Policy key must match platform.",
      status: "active",
      approvalPolicyKey: "metadata_review",
      approvalPolicyDescription: "Approval.",
      certificationPolicyKey: "platform_certification",
      certificationPolicyDescription: "Certification.",
      auditPolicyKey: "metadata_audit",
      auditPolicyDescription: "Audit.",
      governanceRuleKey: "ownership",
      governanceRuleDescription: "Rule.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPolicyKey.success, false);
});

test("validates governance version namespace format and references", () => {
  assert.equal(validateKnowledgeGovernanceVersionFormat("KNL/13").valid, true);
  assert.equal(validateKnowledgeGovernanceVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgeGovernanceNamespaceFormat("knowledge-governance-platform").valid, true);
  assert.equal(validateKnowledgeGovernanceNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validatePolicyKeyFormat("knl_foundation_governance").valid, true);
  assert.equal(validatePolicyKeyFormat("Invalid-Key").valid, false);
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(validateGovernancePlatformReference("knl_foundation", "knowledge-platform").valid, true);
  assert.equal(validateGovernanceDependencyReference("knl_graph", "KNL/4").valid, true);
});

test("resolves immutable knowledge governance contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeGovernancePolicyExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveKnowledgeOwnerExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeGovernancePolicyExample(FIXED_TIME).platformKey, "knl_foundation");
  assert.equal(resolveKnowledgeGovernancePolicyExample(FIXED_TIME).version, "KNL/13");
});

test("builds immutable knowledge governance manifest", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const manifest = getKnowledgeGovernanceManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/13");
  assert.equal(manifest.learningBridgeDependency, "KNL/12");
  assert.equal(manifest.supportedPlatforms.length, 12);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge governance platform certification report", () => {
  const report = validateKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.policyValid, true);
  assert.equal(report.bestPracticeValid, true);
  assert.equal(report.retrievalValid, true);
  assert.equal(report.validationValid, true);
  assert.equal(report.versioningValid, true);
  assert.equal(report.learningBridgeValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/13 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_GOVERNANCE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeGovernancePlatform.ts",
    allowedFiles: KNOWLEDGE_GOVERNANCE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_GOVERNANCE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES.noWorkflowEngine, true);
  assert.equal(KNOWLEDGE_GOVERNANCE_PUBLIC_API_RULES.noAuthorization, true);
  assert.equal(KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN.includes("approval_workflow"), true);
  assert.equal(KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN.includes("runtime_governance"), true);
  assert.equal(KNOWLEDGE_GOVERNANCE_PRINCIPLES.includes("knl_13_consumes_knl_1_through_knl_12_only"), true);
});

test("exports knowledge governance contract bundle", () => {
  assert.equal(KnowledgeGovernanceContract.version, "KNL/13");
  assert.equal(typeof KnowledgeGovernanceContract.validateKnowledgeGovernancePlatform, "function");
  assert.equal(typeof KnowledgeGovernanceContract.getKnowledgeGovernanceManifest, "function");
});

test("KnowledgeGovernancePlatformFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeGovernancePlatformFacade.registerKnowledgeGovernancePolicy, "function");
  assert.equal(typeof KnowledgeGovernancePlatformFacade.registerKnowledgeOwner, "function");
  assert.equal(typeof KnowledgeGovernancePlatformFacade.registerKnowledgeSteward, "function");
  assert.equal(typeof KnowledgeGovernancePlatformFacade.getKnowledgeGovernancePlatform, "function");
  assert.equal(typeof KnowledgeGovernancePlatformFacade.validateKnowledgeGovernancePlatform, "function");
  assert.equal(typeof KnowledgeGovernancePlatformFacade.getKnowledgeGovernanceManifest, "function");
  assert.equal(KnowledgeGovernancePlatformFacade.version, "KNL/13");
});

test("public API registry includes required knowledge governance exports", () => {
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("registerKnowledgeGovernancePolicy"));
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("registerKnowledgeOwner"));
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("registerKnowledgeSteward"));
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("getKnowledgeGovernancePlatform"));
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("validateKnowledgeGovernancePlatform"));
  assert.ok(KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY.includes("getKnowledgeGovernanceManifest"));
});

test("future phase registry reserves platform certification without implementation", () => {
  assert.equal(KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
  assert.equal(KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS.includes("knowledge_platform_integration"), true);
});

test("getKnowledgeGovernancePlatform returns state and registry", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const platform = getKnowledgeGovernancePlatform(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/13");
  assert.equal(platform.state.policyCount, 12);
  assert.equal(platform.state.ownerCount, 12);
});

test("seeded catalog includes required KNL governance platforms", () => {
  buildKnowledgeGovernancePlatform(FIXED_TIME);
  const required = ["knl_foundation", "knl_graph", "knl_framework", "knl_validation", "knl_learning_bridge"] as const;
  const platform = getKnowledgeGovernancePlatform(FIXED_TIME);
  for (const key of required) {
    const policy = platform.registry.policies.find((entry) => entry.platformKey === key);
    assert.ok(policy);
    assert.equal(policy?.label, `${GOVERNANCE_PLATFORM_LABELS[key]} Governance`);
    assert.equal(policy?.platformReference, GOVERNANCE_PLATFORM_ID_MAP[key]);
    assert.equal(policy?.knlVersion, GOVERNANCE_KNL_VERSION_MAP[key]);
  }
});

test("rejects governance policy when owner is not registered", () => {
  resetKnowledgeGovernancePlatformForTests();
  registerKnowledgeSteward(
    Object.freeze({
      stewardId: "knowledge-steward-orphan",
      stewardKey: "orphan_steward",
      platformKey: "knl_foundation",
      label: "Orphan Steward",
      description: "Steward only.",
      status: "active",
    }),
    FIXED_TIME
  );
  const result = registerKnowledgeGovernancePolicy(
    Object.freeze({
      policyId: "governance-policy-orphan",
      policyKey: "knl_foundation_governance",
      platformKey: "knl_foundation",
      platformReference: "knowledge-platform",
      scopeKey: "platform",
      lifecycleKey: "active",
      ownerId: "knowledge-owner-knl_foundation",
      stewardId: "knowledge-steward-orphan",
      label: "Orphan Policy",
      description: "Owner not registered.",
      status: "active",
      approvalPolicyKey: "metadata_review",
      approvalPolicyDescription: "Approval.",
      certificationPolicyKey: "platform_certification",
      certificationPolicyDescription: "Certification.",
      auditPolicyKey: "metadata_audit",
      auditPolicyDescription: "Audit.",
      governanceRuleKey: "ownership",
      governanceRuleDescription: "Rule.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
