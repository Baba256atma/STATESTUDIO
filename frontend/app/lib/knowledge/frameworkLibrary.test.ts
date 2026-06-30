import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  FRAMEWORK_CATEGORY_KEYS,
  FRAMEWORK_KEYS,
  FRAMEWORK_LABELS,
  FRAMEWORK_LIBRARY_CONTRACT_VERSION,
  FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS,
  FRAMEWORK_LIBRARY_MUST_NOT_OWN,
  FRAMEWORK_LIBRARY_PRINCIPLES,
  FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY,
} from "./frameworkLibraryCatalog.ts";
import {
  FRAMEWORK_LIBRARY_PUBLIC_API_RULES,
  FRAMEWORK_LIBRARY_SELF_MANIFEST,
  FrameworkLibraryContract,
  getFrameworkLibraryManifest,
  resolveFrameworkExample,
  resolveFrameworkTemplateExample,
  validateFrameworkLibrary,
} from "./frameworkLibraryContracts.ts";
import {
  FrameworkLibrary,
  buildFrameworkLibrary,
  getFrameworkLibrary,
  isFrameworkLibraryInitialized,
  registerFramework,
  registerFrameworkCategory,
  registerFrameworkTemplate,
  resetFrameworkLibraryForTests,
} from "./frameworkLibrary.ts";
import {
  hasDuplicateFrameworkIds,
  hasDuplicateFrameworkNames,
  validateFrameworkNamespaceFormat,
  validateFrameworkVersionFormat,
  validateOntologyReference,
} from "./frameworkLibraryValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetFrameworkLibraryForTests();
});

test("exports KNL/6 framework library contract vocabulary", () => {
  assert.equal(FRAMEWORK_LIBRARY_CONTRACT_VERSION, "KNL/6");
  assert.equal(FRAMEWORK_KEYS.length, 15);
  assert.equal(FRAMEWORK_CATEGORY_KEYS.length, 6);
});

test("initializes framework library with KNL/1 through KNL/5 dependencies", () => {
  assert.equal(isFrameworkLibraryInitialized(), false);
  const init = buildFrameworkLibrary(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isFrameworkLibraryInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.industryDependency, "KNL/5");
  assert.equal(init.data?.contractVersion, "KNL/6");
});

test("seeds framework catalog with 15 executive frameworks", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const library = getFrameworkLibrary(FIXED_TIME);
  assert.equal(library.registry.frameworks.length, 15);
  assert.equal(library.registry.templates.length, 15);
  assert.equal(library.registry.components.length, 15);
  assert.equal(library.registry.categories.length, FRAMEWORK_CATEGORY_KEYS.length);
  for (const frameworkKey of FRAMEWORK_KEYS) {
    assert.ok(library.registry.frameworks.some((entry) => entry.frameworkKey === frameworkKey));
    assert.equal(
      library.registry.frameworks.find((entry) => entry.frameworkKey === frameworkKey)?.label,
      FRAMEWORK_LABELS[frameworkKey]
    );
  }
});

test("registers custom framework template and rejects duplicate category", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const unique = registerFramework(
    Object.freeze({
      frameworkId: "framework-custom-001",
      frameworkKey: "vrio",
      canonicalName: "custom_vrio_variant",
      label: "Custom VRIO Variant",
      description: "Custom framework with unique key.",
      categoryKey: "strategic_analysis",
      ontologyEntityId: "business-relationship-type-supports",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(unique.success, true);
  const template = registerFrameworkTemplate(
    Object.freeze({
      templateId: "framework-template-custom-001",
      frameworkId: "framework-custom-001",
      label: "Custom VRIO Template",
      description: "Custom template.",
      categoryKey: "strategic_analysis",
    }),
    FIXED_TIME
  );
  assert.equal(template.success, true);
  const category = registerFrameworkCategory(
    Object.freeze({
      categoryId: "framework-category-custom",
      categoryKey: "strategic_analysis",
      label: "Duplicate Category",
      description: "Should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate framework ids and canonical names", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const duplicateId = registerFramework(
    Object.freeze({
      frameworkId: "framework-swot",
      frameworkKey: "pestel",
      canonicalName: "pestel_custom",
      label: "Duplicate",
      description: "Duplicate id.",
      categoryKey: "strategic_analysis",
      ontologyEntityId: "business-relationship-type-supports",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateId.success, false);
  const duplicateName = registerFramework(
    Object.freeze({
      frameworkId: "framework-duplicate-name",
      frameworkKey: "pestel",
      canonicalName: "swot",
      label: "Duplicate Name",
      description: "Duplicate canonical name.",
      categoryKey: "strategic_analysis",
      ontologyEntityId: "business-relationship-type-supports",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateName.success, false);
  const duplicateTemplate = registerFrameworkTemplate(
    Object.freeze({
      templateId: "framework-template-swot",
      frameworkId: "framework-swot",
      label: "Duplicate",
      description: "Duplicate template.",
      categoryKey: "strategic_analysis",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateTemplate.success, false);
});

test("rejects invalid ontology and industry model references", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const invalidOntology = registerFramework(
    Object.freeze({
      frameworkId: "framework-invalid-ontology",
      frameworkKey: "okr",
      canonicalName: "invalid_okr",
      label: "Invalid",
      description: "Invalid ontology ref.",
      categoryKey: "goal_setting",
      ontologyEntityId: "nonexistent-entity",
      industryModelId: "industry-model-technology",
    }),
    FIXED_TIME
  );
  assert.equal(invalidOntology.success, false);
  const invalidIndustry = registerFramework(
    Object.freeze({
      frameworkId: "framework-invalid-industry",
      frameworkKey: "okr",
      canonicalName: "invalid_industry_okr",
      label: "Invalid Industry",
      description: "Invalid industry ref.",
      categoryKey: "goal_setting",
      ontologyEntityId: "business-relationship-type-measures",
      industryModelId: "industry-model-nonexistent",
    }),
    FIXED_TIME
  );
  assert.equal(invalidIndustry.success, false);
});

test("validates framework version namespace format and duplicate ids", () => {
  assert.equal(validateFrameworkVersionFormat("KNL/6").valid, true);
  assert.equal(validateFrameworkVersionFormat("invalid").valid, false);
  assert.equal(validateFrameworkNamespaceFormat("knowledge-framework-library").valid, true);
  assert.equal(validateFrameworkNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(hasDuplicateFrameworkIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateFrameworkNames(["SWOT", "swot"]), true);
  buildFrameworkLibrary(FIXED_TIME);
  assert.equal(validateOntologyReference("business-relationship-type-owns").valid, true);
});

test("resolves immutable framework contract examples", () => {
  assert.equal(Object.isFrozen(resolveFrameworkExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveFrameworkTemplateExample(FIXED_TIME)), true);
  assert.equal(resolveFrameworkExample(FIXED_TIME).frameworkKey, "swot");
  assert.equal(resolveFrameworkExample(FIXED_TIME).version, "KNL/6");
});

test("builds immutable framework library manifest", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const manifest = getFrameworkLibraryManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/6");
  assert.equal(manifest.industryDependency, "KNL/5");
  assert.equal(manifest.supportedFrameworks.length, 15);
  assert.equal(manifest.publicApis.length, FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.length);
});

test("validates framework library certification report", () => {
  const report = validateFrameworkLibrary(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.industryValid, true);
  assert.equal(report.libraryInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/6 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(FRAMEWORK_LIBRARY_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/frameworkLibrary.ts",
    allowedFiles: FRAMEWORK_LIBRARY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: FRAMEWORK_LIBRARY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(FRAMEWORK_LIBRARY_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(FRAMEWORK_LIBRARY_PUBLIC_API_RULES.noExecution, true);
  assert.equal(FRAMEWORK_LIBRARY_PUBLIC_API_RULES.noScoring, true);
  assert.equal(FRAMEWORK_LIBRARY_MUST_NOT_OWN.includes("framework_execution"), true);
  assert.equal(FRAMEWORK_LIBRARY_MUST_NOT_OWN.includes("framework_scoring"), true);
  assert.equal(FRAMEWORK_LIBRARY_PRINCIPLES.includes("knl_6_consumes_knl_1_through_knl_5_only"), true);
});

test("exports framework library contract bundle", () => {
  assert.equal(FrameworkLibraryContract.version, "KNL/6");
  assert.equal(typeof FrameworkLibraryContract.validateFrameworkLibrary, "function");
  assert.equal(typeof FrameworkLibraryContract.getFrameworkLibraryManifest, "function");
});

test("FrameworkLibrary namespace exposes public APIs only", () => {
  assert.equal(typeof FrameworkLibrary.registerFramework, "function");
  assert.equal(typeof FrameworkLibrary.registerFrameworkTemplate, "function");
  assert.equal(typeof FrameworkLibrary.registerFrameworkCategory, "function");
  assert.equal(typeof FrameworkLibrary.getFrameworkLibrary, "function");
  assert.equal(typeof FrameworkLibrary.validateFrameworkLibrary, "function");
  assert.equal(typeof FrameworkLibrary.getFrameworkLibraryManifest, "function");
  assert.equal(FrameworkLibrary.version, "KNL/6");
});

test("public API registry includes required framework exports", () => {
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("registerFramework"));
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("registerFrameworkTemplate"));
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("registerFrameworkCategory"));
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("getFrameworkLibrary"));
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("validateFrameworkLibrary"));
  assert.ok(FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY.includes("getFrameworkLibraryManifest"));
});

test("future phase registry reserves knowledge policy without implementation", () => {
  assert.equal(FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS.includes("knowledge_policy"), true);
  assert.equal(FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getFrameworkLibrary returns state and registry", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const library = getFrameworkLibrary(FIXED_TIME);
  assert.equal(library.state.initialized, true);
  assert.equal(library.registry.snapshot.platformVersion, "KNL/6");
  assert.equal(library.state.frameworkCount, 15);
});

test("seeded catalog includes required executive frameworks", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const required = ["swot", "okr", "balanced_scorecard", "business_model_canvas", "pdca"];
  const library = getFrameworkLibrary(FIXED_TIME);
  for (const key of required) {
    assert.ok(library.registry.frameworks.some((entry) => entry.frameworkKey === key));
  }
});

test("rejects template for unknown framework", () => {
  buildFrameworkLibrary(FIXED_TIME);
  const result = registerFrameworkTemplate(
    Object.freeze({
      templateId: "framework-template-orphan",
      frameworkId: "framework-nonexistent",
      label: "Orphan",
      description: "Missing framework.",
      categoryKey: "strategic_analysis",
    }),
    FIXED_TIME
  );
  assert.equal(result.success, false);
});
