import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BEST_PRACTICE_CATEGORY_KEYS,
  BEST_PRACTICE_CONTRACT_VERSION,
  BEST_PRACTICE_FUTURE_PHASE_KEYS,
  BEST_PRACTICE_LABELS,
  BEST_PRACTICE_MUST_NOT_OWN,
  BEST_PRACTICE_PRINCIPLES,
  BEST_PRACTICE_PUBLIC_API_REGISTRY,
  BEST_PRACTICE_SOURCE_KEYS,
} from "./bestPracticeCatalog.ts";
import {
  BEST_PRACTICE_PUBLIC_API_RULES,
  BEST_PRACTICE_SELF_MANIFEST,
  BestPracticeContract,
  getBestPracticeManifest,
  resolveBestPracticeExample,
  resolveBestPracticeTemplateExample,
  validateBestPracticePlatform,
} from "./bestPracticeContracts.ts";
import {
  BestPracticePlatform,
  buildBestPracticePlatform,
  getBestPracticePlatform,
  isBestPracticePlatformInitialized,
  registerBestPractice,
  registerBestPracticeCategory,
  registerBestPracticeTemplate,
  resetBestPracticePlatformForTests,
} from "./bestPracticePlatform.ts";
import {
  hasDuplicateBestPracticeIds,
  hasDuplicateBestPracticeNames,
  hasDuplicateTemplateIds,
  validateBestPracticeNamespaceFormat,
  validateBestPracticeVersionFormat,
  validateFrameworkReference,
  validateOntologyReference,
  validatePolicyReference,
} from "./bestPracticeValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBestPracticePlatformForTests();
});

test("exports KNL/8 best practice contract vocabulary", () => {
  assert.equal(BEST_PRACTICE_CONTRACT_VERSION, "KNL/8");
  assert.equal(BEST_PRACTICE_CATEGORY_KEYS.length, 12);
  assert.equal(BEST_PRACTICE_SOURCE_KEYS.length, 4);
});

test("initializes best practice platform with KNL/1 through KNL/7 dependencies", () => {
  assert.equal(isBestPracticePlatformInitialized(), false);
  const init = buildBestPracticePlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isBestPracticePlatformInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.frameworkDependency, "KNL/6");
  assert.equal(init.data?.policyDependency, "KNL/7");
  assert.equal(init.data?.contractVersion, "KNL/8");
});

test("seeds best practice catalog with 12 categories templates and practices", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const platform = getBestPracticePlatform(FIXED_TIME);
  assert.equal(platform.registry.practices.length, 12);
  assert.equal(platform.registry.templates.length, 12);
  assert.equal(platform.registry.categories.length, BEST_PRACTICE_CATEGORY_KEYS.length);
  assert.equal(platform.registry.sources.length, BEST_PRACTICE_SOURCE_KEYS.length);
  assert.equal(platform.registry.principles.length, 12);
  for (const categoryKey of BEST_PRACTICE_CATEGORY_KEYS) {
    assert.ok(platform.registry.categories.some((entry) => entry.categoryKey === categoryKey));
    assert.equal(
      platform.registry.categories.find((entry) => entry.categoryKey === categoryKey)?.label,
      BEST_PRACTICE_LABELS[categoryKey]
    );
    assert.ok(platform.registry.practices.some((entry) => entry.practiceId === `best-practice-${categoryKey}`));
    assert.ok(platform.registry.templates.some((entry) => entry.templateId === `best-practice-template-${categoryKey}`));
  }
});

test("registers custom best practice and template and rejects duplicate category", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const practice = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-custom-001",
      categoryKey: "strategic_planning",
      canonicalName: "custom_strategic_planning",
      label: "Custom Strategic Planning",
      description: "Custom best practice metadata.",
      principleLabel: "Custom Principle",
      principleDescription: "Custom principle metadata.",
      guidelineLabel: "Custom Guideline",
      guidelineDescription: "Custom guideline metadata.",
      recommendationDescription: "Custom recommendation metadata (not executable).",
      contextKey: "executive",
      contextDescription: "Executive context metadata.",
      kpiLabel: "Custom KPI",
      kpiDescription: "Custom KPI mapping metadata.",
      riskLabel: "Custom Risk",
      riskDescription: "Custom risk mapping metadata.",
      ownerId: "best-practice-owner-executive",
      sourceId: "best-practice-source-executive_playbook",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-swot",
      policyId: "policy-governance",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(practice.success, true);
  const template = registerBestPracticeTemplate(
    Object.freeze({
      templateId: "best-practice-template-custom-001",
      practiceId: "best-practice-custom-001",
      categoryKey: "strategic_planning",
      label: "Custom Template",
      description: "Custom template metadata.",
    }),
    FIXED_TIME
  );
  assert.equal(template.success, true);
  const category = registerBestPracticeCategory(
    Object.freeze({
      categoryId: "best-practice-category-custom",
      categoryKey: "strategic_planning",
      label: "Duplicate Category",
      description: "Should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate practice ids template ids and canonical names", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const duplicatePracticeId = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-strategic_planning",
      categoryKey: "governance",
      canonicalName: "governance_custom",
      label: "Duplicate",
      description: "Duplicate practice id.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-raci",
      policyId: "policy-governance",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicatePracticeId.success, false);
  const duplicateName = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-duplicate-name",
      categoryKey: "governance",
      canonicalName: "strategic_planning",
      label: "Duplicate Name",
      description: "Duplicate canonical name.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-raci",
      policyId: "policy-governance",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateName.success, false);
  const duplicateTemplateId = registerBestPracticeTemplate(
    Object.freeze({
      templateId: "best-practice-template-strategic_planning",
      practiceId: "best-practice-strategic_planning",
      categoryKey: "strategic_planning",
      label: "Duplicate",
      description: "Duplicate template id.",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateTemplateId.success, false);
});

test("rejects invalid ontology framework policy and industry references", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const invalidOntology = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-invalid-ontology",
      categoryKey: "risk_management",
      canonicalName: "invalid_risk_practice",
      label: "Invalid",
      description: "Invalid ontology ref.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "nonexistent-entity",
      frameworkId: "framework-porters_five_forces",
      policyId: "policy-risk",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidOntology.success, false);
  const invalidFramework = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-invalid-framework",
      categoryKey: "risk_management",
      canonicalName: "invalid_framework_risk",
      label: "Invalid Framework",
      description: "Invalid framework ref.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-nonexistent",
      policyId: "policy-risk",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidFramework.success, false);
  const invalidPolicy = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-invalid-policy",
      categoryKey: "risk_management",
      canonicalName: "invalid_policy_risk",
      label: "Invalid Policy",
      description: "Invalid policy ref.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "business-relationship-type-supports",
      frameworkId: "framework-porters_five_forces",
      policyId: "policy-nonexistent",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidPolicy.success, false);
  const invalidIndustry = registerBestPractice(
    Object.freeze({
      practiceId: "best-practice-invalid-industry",
      categoryKey: "risk_management",
      canonicalName: "invalid_industry_risk",
      label: "Invalid Industry",
      description: "Invalid industry ref.",
      principleLabel: "Principle",
      principleDescription: "Principle.",
      guidelineLabel: "Guideline",
      guidelineDescription: "Guideline.",
      recommendationDescription: "Recommendation metadata.",
      contextKey: "organization",
      contextDescription: "Context.",
      kpiLabel: "KPI",
      kpiDescription: "KPI.",
      riskLabel: "Risk",
      riskDescription: "Risk.",
      ontologyEntityId: "business-relationship-type-measures",
      frameworkId: "framework-porters_five_forces",
      policyId: "policy-risk",
      industryModelId: "industry-model-nonexistent",
    }),
    FIXED_TIME
  );
  assert.equal(invalidIndustry.success, false);
});

test("validates best practice version namespace format and duplicate ids", () => {
  assert.equal(validateBestPracticeVersionFormat("KNL/8").valid, true);
  assert.equal(validateBestPracticeVersionFormat("invalid").valid, false);
  assert.equal(validateBestPracticeNamespaceFormat("knowledge-best-practices").valid, true);
  assert.equal(validateBestPracticeNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(hasDuplicateBestPracticeIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateTemplateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateBestPracticeNames(["Strategic", "strategic"]), true);
  buildBestPracticePlatform(FIXED_TIME);
  assert.equal(validateOntologyReference("business-relationship-type-owns").valid, true);
  assert.equal(validateFrameworkReference("framework-swot").valid, true);
  assert.equal(validatePolicyReference("policy-governance").valid, true);
});

test("resolves immutable best practice contract examples", () => {
  assert.equal(Object.isFrozen(resolveBestPracticeExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveBestPracticeTemplateExample(FIXED_TIME)), true);
  assert.equal(resolveBestPracticeExample(FIXED_TIME).categoryKey, "strategic_planning");
  assert.equal(resolveBestPracticeExample(FIXED_TIME).version, "KNL/8");
});

test("builds immutable best practice manifest", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const manifest = getBestPracticeManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/8");
  assert.equal(manifest.policyDependency, "KNL/7");
  assert.equal(manifest.supportedCategories.length, 12);
  assert.equal(manifest.publicApis.length, BEST_PRACTICE_PUBLIC_API_REGISTRY.length);
});

test("validates best practice platform certification report", () => {
  const report = validateBestPracticePlatform(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.frameworkValid, true);
  assert.equal(report.policyValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/8 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(BEST_PRACTICE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/bestPracticePlatform.ts",
    allowedFiles: BEST_PRACTICE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BEST_PRACTICE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(BEST_PRACTICE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(BEST_PRACTICE_PUBLIC_API_RULES.noAdvisory, true);
  assert.equal(BEST_PRACTICE_PUBLIC_API_RULES.noRecommendations, true);
  assert.equal(BEST_PRACTICE_MUST_NOT_OWN.includes("recommendation_engine"), true);
  assert.equal(BEST_PRACTICE_MUST_NOT_OWN.includes("advisory_engine"), true);
  assert.equal(BEST_PRACTICE_PRINCIPLES.includes("knl_8_consumes_knl_1_through_knl_7_only"), true);
});

test("exports best practice contract bundle", () => {
  assert.equal(BestPracticeContract.version, "KNL/8");
  assert.equal(typeof BestPracticeContract.validateBestPracticePlatform, "function");
  assert.equal(typeof BestPracticeContract.getBestPracticeManifest, "function");
});

test("BestPracticePlatform namespace exposes public APIs only", () => {
  assert.equal(typeof BestPracticePlatform.registerBestPractice, "function");
  assert.equal(typeof BestPracticePlatform.registerBestPracticeTemplate, "function");
  assert.equal(typeof BestPracticePlatform.registerBestPracticeCategory, "function");
  assert.equal(typeof BestPracticePlatform.getBestPracticePlatform, "function");
  assert.equal(typeof BestPracticePlatform.validateBestPracticePlatform, "function");
  assert.equal(typeof BestPracticePlatform.getBestPracticeManifest, "function");
  assert.equal(BestPracticePlatform.version, "KNL/8");
});

test("public API registry includes required best practice exports", () => {
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("registerBestPractice"));
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("registerBestPracticeTemplate"));
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("registerBestPracticeCategory"));
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("getBestPracticePlatform"));
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("validateBestPracticePlatform"));
  assert.ok(BEST_PRACTICE_PUBLIC_API_REGISTRY.includes("getBestPracticeManifest"));
});

test("future phase registry reserves knowledge retrieval without implementation", () => {
  assert.equal(BEST_PRACTICE_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
  assert.equal(BEST_PRACTICE_FUTURE_PHASE_KEYS.includes("platform_certification"), true);
});

test("getBestPracticePlatform returns state and registry", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const platform = getBestPracticePlatform(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/8");
  assert.equal(platform.state.practiceCount, 12);
  assert.equal(platform.state.templateCount, 12);
});

test("seeded catalog includes required executive best practice categories", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const required = ["strategic_planning", "operational_excellence", "risk_management", "governance", "kpi_management", "change_management"];
  const platform = getBestPracticePlatform(FIXED_TIME);
  for (const key of required) {
    assert.ok(platform.registry.practices.some((entry) => entry.categoryKey === key));
  }
});

test("rejects template for unknown best practice", () => {
  buildBestPracticePlatform(FIXED_TIME);
  const result = registerBestPracticeTemplate(
    Object.freeze({
      templateId: "best-practice-template-orphan",
      practiceId: "best-practice-nonexistent",
      categoryKey: "governance",
      label: "Orphan",
      description: "Missing practice.",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
