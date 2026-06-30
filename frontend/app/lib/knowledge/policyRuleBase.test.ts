import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  COMPLIANCE_TAG_KEYS,
  POLICY_CATEGORY_KEYS,
  POLICY_KEYS,
  POLICY_LABELS,
  POLICY_RULE_BASE_CONTRACT_VERSION,
  POLICY_RULE_BASE_FUTURE_PHASE_KEYS,
  POLICY_RULE_BASE_MUST_NOT_OWN,
  POLICY_RULE_BASE_PRINCIPLES,
  POLICY_RULE_BASE_PUBLIC_API_REGISTRY,
} from "./policyRuleCatalog.ts";
import {
  POLICY_RULE_BASE_PUBLIC_API_RULES,
  POLICY_RULE_BASE_SELF_MANIFEST,
  PolicyRuleBaseContract,
  getPolicyRuleBaseManifest,
  resolveBusinessRuleExample,
  resolvePolicyExample,
  validatePolicyRuleBase,
} from "./policyRuleContracts.ts";
import {
  PolicyRuleBase,
  buildPolicyRuleBase,
  getPolicyRuleBase,
  isPolicyRuleBaseInitialized,
  registerBusinessRule,
  registerPolicy,
  registerPolicyCategory,
  resetPolicyRuleBaseForTests,
} from "./policyRuleBase.ts";
import {
  hasDuplicatePolicyIds,
  hasDuplicatePolicyRuleNames,
  hasDuplicateRuleIds,
  validateFrameworkReference,
  validateOntologyReference,
  validatePolicyNamespaceFormat,
  validatePolicyRuleVersionFormat,
} from "./policyRuleValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetPolicyRuleBaseForTests();
});

test("exports KNL/7 policy rule base contract vocabulary", () => {
  assert.equal(POLICY_RULE_BASE_CONTRACT_VERSION, "KNL/7");
  assert.equal(POLICY_KEYS.length, 12);
  assert.equal(POLICY_CATEGORY_KEYS.length, 8);
  assert.equal(COMPLIANCE_TAG_KEYS.length, 6);
});

test("initializes policy rule base with KNL/1 through KNL/6 dependencies", () => {
  assert.equal(isPolicyRuleBaseInitialized(), false);
  const init = buildPolicyRuleBase(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isPolicyRuleBaseInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.contractVersion, "KNL/7");
});

test("seeds policy catalog with 12 organizational policies and rules", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const base = getPolicyRuleBase(FIXED_TIME);
  assert.equal(base.registry.policies.length, 12);
  assert.equal(base.registry.rules.length, 12);
  assert.equal(base.registry.categories.length, POLICY_CATEGORY_KEYS.length);
  assert.equal(base.registry.groups.length, 4);
  assert.equal(base.registry.complianceTags.length, COMPLIANCE_TAG_KEYS.length);
  assert.equal(base.registry.namespaces.length, 4);
  for (const policyKey of POLICY_KEYS) {
    assert.ok(base.registry.policies.some((entry) => entry.policyKey === policyKey));
    assert.equal(
      base.registry.policies.find((entry) => entry.policyKey === policyKey)?.label,
      POLICY_LABELS[policyKey]
    );
    assert.ok(base.registry.rules.some((entry) => entry.ruleId === `business-rule-${policyKey}-001`));
  }
});

test("registers custom policy and business rule and rejects duplicate category", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const policy = registerPolicy(
    Object.freeze({
      policyId: "policy-custom-001",
      policyKey: "financial",
      canonicalName: "custom_financial_policy",
      label: "Custom Financial Policy",
      description: "Custom policy metadata.",
      categoryKey: "financial",
      groupKey: "corporate",
      status: "active",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-balanced_scorecard",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(policy.success, true);
  const rule = registerBusinessRule(
    Object.freeze({
      ruleId: "business-rule-custom-001",
      policyId: "policy-custom-001",
      canonicalName: "custom_financial_rule",
      label: "Custom Financial Rule",
      description: "Custom rule metadata.",
      ruleType: "mandatory",
      ruleScope: "organization",
      priority: "high",
      severity: "major",
      status: "active",
      conditionDescription: "Custom condition metadata.",
      actionDescription: "Custom action metadata.",
      ownerId: "policy-owner-finance",
      complianceTags: Object.freeze(["sox"] as const),
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-balanced_scorecard",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(rule.success, true);
  const category = registerPolicyCategory(
    Object.freeze({
      categoryId: "policy-category-custom",
      categoryKey: "financial",
      label: "Duplicate Category",
      description: "Should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate policy ids rule ids and canonical names", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const duplicatePolicyId = registerPolicy(
    Object.freeze({
      policyId: "policy-financial",
      policyKey: "hr",
      canonicalName: "hr_custom",
      label: "Duplicate",
      description: "Duplicate policy id.",
      categoryKey: "human_resources",
      groupKey: "corporate",
      status: "active",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-mckinsey_7s",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicatePolicyId.success, false);
  const duplicatePolicyName = registerPolicy(
    Object.freeze({
      policyId: "policy-duplicate-name",
      policyKey: "hr",
      canonicalName: "financial",
      label: "Duplicate Name",
      description: "Duplicate canonical name.",
      categoryKey: "human_resources",
      groupKey: "corporate",
      status: "active",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-mckinsey_7s",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicatePolicyName.success, false);
  const duplicateRuleId = registerBusinessRule(
    Object.freeze({
      ruleId: "business-rule-financial-001",
      policyId: "policy-financial",
      canonicalName: "duplicate_financial_rule",
      label: "Duplicate Rule",
      description: "Duplicate rule id.",
      ruleType: "mandatory",
      ruleScope: "organization",
      priority: "high",
      severity: "major",
      status: "active",
      conditionDescription: "Condition.",
      actionDescription: "Action.",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-balanced_scorecard",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateRuleId.success, false);
});

test("rejects invalid ontology framework and industry references", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const invalidOntology = registerPolicy(
    Object.freeze({
      policyId: "policy-invalid-ontology",
      policyKey: "risk",
      canonicalName: "invalid_risk_policy",
      label: "Invalid",
      description: "Invalid ontology ref.",
      categoryKey: "risk",
      groupKey: "regulatory",
      status: "active",
      ontologyEntityId: "nonexistent-entity",
      frameworkId: "framework-porters_five_forces",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidOntology.success, false);
  const invalidFramework = registerPolicy(
    Object.freeze({
      policyId: "policy-invalid-framework",
      policyKey: "risk",
      canonicalName: "invalid_framework_risk",
      label: "Invalid Framework",
      description: "Invalid framework ref.",
      categoryKey: "risk",
      groupKey: "regulatory",
      status: "active",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-nonexistent",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidFramework.success, false);
  const invalidIndustry = registerPolicy(
    Object.freeze({
      policyId: "policy-invalid-industry",
      policyKey: "risk",
      canonicalName: "invalid_industry_risk",
      label: "Invalid Industry",
      description: "Invalid industry ref.",
      categoryKey: "risk",
      groupKey: "regulatory",
      status: "active",
      ontologyEntityId: "business-relationship-type-measures",
      frameworkId: "framework-porters_five_forces",
      industryModelId: "industry-model-nonexistent",
    }),
    FIXED_TIME
  );
  assert.equal(invalidIndustry.success, false);
});

test("validates policy version namespace format and duplicate ids", () => {
  assert.equal(validatePolicyRuleVersionFormat("KNL/7").valid, true);
  assert.equal(validatePolicyRuleVersionFormat("invalid").valid, false);
  assert.equal(validatePolicyNamespaceFormat("knowledge-policy-rule-base").valid, true);
  assert.equal(validatePolicyNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(hasDuplicatePolicyIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateRuleIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicatePolicyRuleNames(["Financial", "financial"]), true);
  buildPolicyRuleBase(FIXED_TIME);
  assert.equal(validateOntologyReference("business-relationship-type-owns").valid, true);
  assert.equal(validateFrameworkReference("framework-swot").valid, true);
});

test("resolves immutable policy and business rule contract examples", () => {
  assert.equal(Object.isFrozen(resolvePolicyExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBusinessRuleExample(FIXED_TIME)), true);
  assert.equal(resolvePolicyExample(FIXED_TIME).policyKey, "financial");
  assert.equal(resolvePolicyExample(FIXED_TIME).version, "KNL/7");
  assert.equal(resolveBusinessRuleExample(FIXED_TIME).ruleType, "mandatory");
});

test("builds immutable policy rule base manifest", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const manifest = getPolicyRuleBaseManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/7");
  assert.equal(manifest.frameworkDependency, "KNL/6");
  assert.equal(manifest.supportedPolicies.length, 12);
  assert.equal(manifest.publicApis.length, POLICY_RULE_BASE_PUBLIC_API_REGISTRY.length);
});

test("validates policy rule base certification report", () => {
  const report = validatePolicyRuleBase(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.baseInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/7 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(POLICY_RULE_BASE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/policyRuleBase.ts",
    allowedFiles: POLICY_RULE_BASE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: POLICY_RULE_BASE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(POLICY_RULE_BASE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(POLICY_RULE_BASE_PUBLIC_API_RULES.noExecution, true);
  assert.equal(POLICY_RULE_BASE_PUBLIC_API_RULES.noRuleEngine, true);
  assert.equal(POLICY_RULE_BASE_MUST_NOT_OWN.includes("rule_engine"), true);
  assert.equal(POLICY_RULE_BASE_MUST_NOT_OWN.includes("rule_evaluation"), true);
  assert.equal(POLICY_RULE_BASE_PRINCIPLES.includes("knl_7_consumes_knl_1_through_knl_6_only"), true);
});

test("exports policy rule base contract bundle", () => {
  assert.equal(PolicyRuleBaseContract.version, "KNL/7");
  assert.equal(typeof PolicyRuleBaseContract.validatePolicyRuleBase, "function");
  assert.equal(typeof PolicyRuleBaseContract.getPolicyRuleBaseManifest, "function");
});

test("PolicyRuleBase namespace exposes public APIs only", () => {
  assert.equal(typeof PolicyRuleBase.registerPolicy, "function");
  assert.equal(typeof PolicyRuleBase.registerBusinessRule, "function");
  assert.equal(typeof PolicyRuleBase.registerPolicyCategory, "function");
  assert.equal(typeof PolicyRuleBase.getPolicyRuleBase, "function");
  assert.equal(typeof PolicyRuleBase.validatePolicyRuleBase, "function");
  assert.equal(typeof PolicyRuleBase.getPolicyRuleBaseManifest, "function");
  assert.equal(PolicyRuleBase.version, "KNL/7");
});

test("public API registry includes required policy rule base exports", () => {
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("registerPolicy"));
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("registerBusinessRule"));
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("registerPolicyCategory"));
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("getPolicyRuleBase"));
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("validatePolicyRuleBase"));
  assert.ok(POLICY_RULE_BASE_PUBLIC_API_REGISTRY.includes("getPolicyRuleBaseManifest"));
});

test("future phase registry reserves best practices without implementation", () => {
  assert.equal(POLICY_RULE_BASE_FUTURE_PHASE_KEYS.includes("best_practices"), true);
  assert.equal(POLICY_RULE_BASE_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getPolicyRuleBase returns state and registry", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const base = getPolicyRuleBase(FIXED_TIME);
  assert.equal(base.state.initialized, true);
  assert.equal(base.registry.snapshot.platformVersion, "KNL/7");
  assert.equal(base.state.policyCount, 12);
  assert.equal(base.state.ruleCount, 12);
});

test("seeded catalog includes required organizational policies", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const required = ["financial", "security", "compliance", "privacy", "governance", "it"];
  const base = getPolicyRuleBase(FIXED_TIME);
  for (const key of required) {
    assert.ok(base.registry.policies.some((entry) => entry.policyKey === key));
  }
});

test("rejects business rule for unknown policy", () => {
  buildPolicyRuleBase(FIXED_TIME);
  const result = registerBusinessRule(
    Object.freeze({
      ruleId: "business-rule-orphan",
      policyId: "policy-nonexistent",
      canonicalName: "orphan_rule",
      label: "Orphan",
      description: "Missing policy.",
      ruleType: "advisory",
      ruleScope: "organization",
      priority: "low",
      severity: "informational",
      status: "draft",
      conditionDescription: "Condition.",
      actionDescription: "Action.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
