import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  KNOWLEDGE_VALIDATION_CONTRACT_VERSION,
  KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS,
  KNOWLEDGE_VALIDATION_MUST_NOT_OWN,
  KNOWLEDGE_VALIDATION_PRINCIPLES,
  KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY,
  VALIDATION_CATEGORY_KEYS,
  VALIDATION_PROFILE_KEYS,
  VALIDATION_PROFILE_LABELS,
} from "./knowledgeValidationPlatformCatalog.ts";
import {
  KNOWLEDGE_VALIDATION_PUBLIC_API_RULES,
  KNOWLEDGE_VALIDATION_SELF_MANIFEST,
  KnowledgeValidationPlatformContract,
  getKnowledgeValidationManifest,
  resolveKnowledgeValidationProfileExample,
  resolveValidationRuleExample,
  validateKnowledgeValidationPlatform,
} from "./knowledgeValidationPlatformContracts.ts";
import {
  KnowledgeValidationPlatformFacade,
  buildKnowledgeValidationPlatform,
  getKnowledgeValidationPlatform,
  isKnowledgeValidationPlatformInitialized,
  registerKnowledgeValidationCategory,
  registerKnowledgeValidationProfile,
  registerKnowledgeValidationRule,
  resetKnowledgeValidationPlatformForTests,
} from "./knowledgeValidationPlatform.ts";
import {
  hasDuplicateNamespaceKeys,
  hasDuplicateProfileNames,
  hasDuplicateRuleIds,
  hasDuplicateValidationIds,
  validateDependencyReference,
  validateKnowledgeValidationNamespaceFormat,
  validateKnowledgeValidationVersionFormat,
  validatePlatformReference,
  validateProfileNameFormat,
  validateTargetReference,
} from "./knowledgeValidationPlatformValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetKnowledgeValidationPlatformForTests();
});

test("exports KNL/10 knowledge validation contract vocabulary", () => {
  assert.equal(KNOWLEDGE_VALIDATION_CONTRACT_VERSION, "KNL/10");
  assert.equal(VALIDATION_PROFILE_KEYS.length, 9);
  assert.equal(VALIDATION_CATEGORY_KEYS.length, 9);
});

test("initializes knowledge validation platform with KNL/1 through KNL/9 dependencies", () => {
  assert.equal(isKnowledgeValidationPlatformInitialized(), false);
  const init = buildKnowledgeValidationPlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isKnowledgeValidationPlatformInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.bestPracticeDependency, "KNL/8");
  assert.equal(init.data?.retrievalDependency, "KNL/9");
  assert.equal(init.data?.contractVersion, "KNL/10");
});

test("seeds validation catalog with 9 KNL profiles and rules", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const platform = getKnowledgeValidationPlatform(FIXED_TIME);
  assert.equal(platform.registry.profiles.length, 9);
  assert.equal(platform.registry.rules.length, 9);
  assert.equal(platform.registry.categories.length, VALIDATION_CATEGORY_KEYS.length);
  assert.equal(platform.registry.targets.length, 9);
  assert.equal(platform.registry.dependencies.length, 9);
  assert.equal(platform.registry.scopes.length, 5);
  for (const profileKey of VALIDATION_PROFILE_KEYS) {
    assert.ok(platform.registry.profiles.some((entry) => entry.profileKey === profileKey));
    assert.equal(
      platform.registry.profiles.find((entry) => entry.profileKey === profileKey)?.label,
      `${VALIDATION_PROFILE_LABELS[profileKey]} Validation Profile`
    );
    assert.ok(platform.registry.rules.some((entry) => entry.ruleId === `validation-rule-${profileKey}-001`));
  }
});

test("registers custom validation profile and rule and rejects duplicate category", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const profile = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-custom-001",
      profileKey: "knl_foundation",
      profileName: "custom_foundation_profile",
      label: "Custom Foundation Profile",
      description: "Custom validation profile metadata.",
      categoryKey: "structural",
      scopeKey: "contract",
      targetKey: "foundation_platform",
      dependencyKey: "KNL/1",
      platformId: "knowledge-platform",
      status: "active",
      resultDescriptorLabel: "Custom Result",
      resultDescriptorDescription: "Custom result descriptor metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(profile.success, true);
  const rule = registerKnowledgeValidationRule(
    Object.freeze({
      ruleId: "validation-rule-custom-001",
      profileId: "validation-profile-custom-001",
      profileKey: "knl_foundation",
      ruleName: "custom_foundation_rule",
      label: "Custom Foundation Rule",
      description: "Custom validation rule metadata.",
      categoryKey: "structural",
      scopeKey: "registry",
      severity: "major",
      status: "active",
      resultDescriptorLabel: "Custom Rule Result",
      resultDescriptorDescription: "Custom rule result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(rule.success, true);
  const category = registerKnowledgeValidationCategory(
    Object.freeze({
      categoryId: "validation-category-custom",
      categoryKey: "structural",
      label: "Duplicate Category",
      description: "Should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate profile ids profile names and rule ids", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const duplicateProfileId = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-knl_foundation",
      profileKey: "knl_ontology",
      profileName: "knl_ontology_custom",
      label: "Duplicate",
      description: "Duplicate profile id.",
      categoryKey: "semantic",
      scopeKey: "platform",
      targetKey: "ontology_platform",
      dependencyKey: "KNL/2",
      platformId: "business-ontology",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateProfileId.success, false);
  const duplicateProfileName = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-duplicate-name",
      profileKey: "knl_ontology",
      profileName: "knl_foundation",
      label: "Duplicate Name",
      description: "Duplicate profile name.",
      categoryKey: "semantic",
      scopeKey: "platform",
      targetKey: "ontology_platform",
      dependencyKey: "KNL/2",
      platformId: "business-ontology",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateProfileName.success, false);
  const duplicateRuleId = registerKnowledgeValidationRule(
    Object.freeze({
      ruleId: "validation-rule-knl_foundation-001",
      profileId: "validation-profile-knl_foundation",
      profileKey: "knl_foundation",
      ruleName: "duplicate_rule",
      label: "Duplicate Rule",
      description: "Duplicate rule id.",
      categoryKey: "structural",
      scopeKey: "registry",
      severity: "minor",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateRuleId.success, false);
});

test("rejects invalid platform target and dependency references", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const invalidPlatform = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-invalid-platform",
      profileKey: "knl_graph",
      profileName: "invalid_graph_profile",
      label: "Invalid Platform",
      description: "Invalid platform reference.",
      categoryKey: "reference",
      scopeKey: "platform",
      targetKey: "graph_platform",
      dependencyKey: "KNL/4",
      platformId: "wrong-platform-id",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPlatform.success, false);
  const invalidTarget = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-invalid-target",
      profileKey: "knl_graph",
      profileName: "invalid_target_graph",
      label: "Invalid Target",
      description: "Invalid target reference.",
      categoryKey: "reference",
      scopeKey: "platform",
      targetKey: "foundation_platform",
      dependencyKey: "KNL/4",
      platformId: "knowledge-graph",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidTarget.success, false);
  const invalidDependency = registerKnowledgeValidationProfile(
    Object.freeze({
      profileId: "validation-profile-invalid-dependency",
      profileKey: "knl_graph",
      profileName: "invalid_dependency_graph",
      label: "Invalid Dependency",
      description: "Invalid dependency reference.",
      categoryKey: "reference",
      scopeKey: "platform",
      targetKey: "graph_platform",
      dependencyKey: "KNL/99" as "KNL/1",
      platformId: "knowledge-graph",
      status: "active",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(invalidDependency.success, false);
});

test("validates knowledge validation version namespace format and duplicate ids", () => {
  assert.equal(validateKnowledgeValidationVersionFormat("KNL/10").valid, true);
  assert.equal(validateKnowledgeValidationVersionFormat("invalid").valid, false);
  assert.equal(validateKnowledgeValidationNamespaceFormat("knowledge-validation-platform").valid, true);
  assert.equal(validateKnowledgeValidationNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(validateProfileNameFormat("knl_foundation").valid, true);
  assert.equal(validateProfileNameFormat("Invalid-Name").valid, false);
  assert.equal(hasDuplicateValidationIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateProfileNames(["Foundation", "foundation"]), true);
  assert.equal(hasDuplicateRuleIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateNamespaceKeys(["ns", "ns"]), true);
  buildKnowledgeValidationPlatform(FIXED_TIME);
  assert.equal(validatePlatformReference("knl_foundation", "knowledge-platform").valid, true);
  assert.equal(validateTargetReference("graph_platform").valid, true);
  assert.equal(validateDependencyReference("KNL/5").valid, true);
});

test("resolves immutable knowledge validation contract examples", () => {
  assert.equal(Object.isFrozen(resolveKnowledgeValidationProfileExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveValidationRuleExample(FIXED_TIME)), true);
  assert.equal(resolveKnowledgeValidationProfileExample(FIXED_TIME).profileKey, "knl_foundation");
  assert.equal(resolveKnowledgeValidationProfileExample(FIXED_TIME).version, "KNL/10");
});

test("builds immutable knowledge validation manifest", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const manifest = getKnowledgeValidationManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/10");
  assert.equal(manifest.retrievalDependency, "KNL/9");
  assert.equal(manifest.supportedProfiles.length, 9);
  assert.equal(manifest.publicApis.length, KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.length);
});

test("validates knowledge validation platform certification report", () => {
  const report = validateKnowledgeValidationPlatform(FIXED_TIME);
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
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/10 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(KNOWLEDGE_VALIDATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/knowledgeValidationPlatform.ts",
    allowedFiles: KNOWLEDGE_VALIDATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: KNOWLEDGE_VALIDATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(KNOWLEDGE_VALIDATION_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(KNOWLEDGE_VALIDATION_PUBLIC_API_RULES.noRuntimeValidation, true);
  assert.equal(KNOWLEDGE_VALIDATION_PUBLIC_API_RULES.noRuleEngine, true);
  assert.equal(KNOWLEDGE_VALIDATION_MUST_NOT_OWN.includes("runtime_validation"), true);
  assert.equal(KNOWLEDGE_VALIDATION_MUST_NOT_OWN.includes("validation_engine"), true);
  assert.equal(KNOWLEDGE_VALIDATION_PRINCIPLES.includes("knl_10_consumes_knl_1_through_knl_9_only"), true);
});

test("exports knowledge validation contract bundle", () => {
  assert.equal(KnowledgeValidationPlatformContract.version, "KNL/10");
  assert.equal(typeof KnowledgeValidationPlatformContract.validateKnowledgeValidationPlatform, "function");
  assert.equal(typeof KnowledgeValidationPlatformContract.getKnowledgeValidationManifest, "function");
});

test("KnowledgeValidationPlatformFacade namespace exposes public APIs only", () => {
  assert.equal(typeof KnowledgeValidationPlatformFacade.registerKnowledgeValidationProfile, "function");
  assert.equal(typeof KnowledgeValidationPlatformFacade.registerKnowledgeValidationRule, "function");
  assert.equal(typeof KnowledgeValidationPlatformFacade.registerKnowledgeValidationCategory, "function");
  assert.equal(typeof KnowledgeValidationPlatformFacade.getKnowledgeValidationPlatform, "function");
  assert.equal(typeof KnowledgeValidationPlatformFacade.validateKnowledgeValidationPlatform, "function");
  assert.equal(typeof KnowledgeValidationPlatformFacade.getKnowledgeValidationManifest, "function");
  assert.equal(KnowledgeValidationPlatformFacade.version, "KNL/10");
});

test("public API registry includes required knowledge validation exports", () => {
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("registerKnowledgeValidationProfile"));
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("registerKnowledgeValidationRule"));
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("registerKnowledgeValidationCategory"));
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("getKnowledgeValidationPlatform"));
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("validateKnowledgeValidationPlatform"));
  assert.ok(KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY.includes("getKnowledgeValidationManifest"));
});

test("future phase registry reserves knowledge versioning without implementation", () => {
  assert.equal(KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS.includes("knowledge_versioning"), true);
  assert.equal(KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
});

test("getKnowledgeValidationPlatform returns state and registry", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const platform = getKnowledgeValidationPlatform(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/10");
  assert.equal(platform.state.profileCount, 9);
  assert.equal(platform.state.ruleCount, 9);
});

test("seeded catalog includes required KNL validation profiles", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const required = ["knl_foundation", "knl_graph", "knl_framework", "knl_policy", "knl_retrieval"];
  const platform = getKnowledgeValidationPlatform(FIXED_TIME);
  for (const key of required) {
    assert.ok(platform.registry.profiles.some((entry) => entry.profileKey === key));
  }
});

test("rejects validation rule for unknown profile", () => {
  buildKnowledgeValidationPlatform(FIXED_TIME);
  const result = registerKnowledgeValidationRule(
    Object.freeze({
      ruleId: "validation-rule-orphan",
      profileId: "validation-profile-nonexistent",
      profileKey: "knl_foundation",
      ruleName: "orphan_rule",
      label: "Orphan",
      description: "Missing profile.",
      categoryKey: "structural",
      scopeKey: "registry",
      severity: "informational",
      status: "draft",
      resultDescriptorLabel: "Result",
      resultDescriptorDescription: "Result descriptor.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
