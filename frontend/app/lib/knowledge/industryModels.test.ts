import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  INDUSTRY_CATEGORY_KEYS,
  INDUSTRY_MODELS_CONTRACT_VERSION,
  INDUSTRY_MODELS_FUTURE_PHASE_KEYS,
  INDUSTRY_MODELS_MUST_NOT_OWN,
  INDUSTRY_MODELS_PRINCIPLES,
  INDUSTRY_MODELS_PUBLIC_API_REGISTRY,
  INDUSTRY_SECTOR_KEYS,
  INDUSTRY_SECTOR_LABELS,
} from "./industryModelCatalog.ts";
import {
  INDUSTRY_MODELS_PUBLIC_API_RULES,
  INDUSTRY_MODELS_SELF_MANIFEST,
  IndustryModelsContract,
  getIndustryModelsManifest,
  resolveIndustryModelExample,
  resolveIndustryTemplateExample,
  validateIndustryModels,
} from "./industryModelContracts.ts";
import {
  IndustryModels,
  buildIndustryModels,
  getIndustryModels,
  isIndustryModelsInitialized,
  registerIndustryCategory,
  registerIndustryModel,
  registerIndustryTemplate,
  resetIndustryModelsForTests,
} from "./industryModels.ts";
import {
  hasDuplicateIndustryIds,
  validateIndustryNamespaceFormat,
  validateIndustryVersionFormat,
  validateOntologyReference,
} from "./industryModelValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetIndustryModelsForTests();
});

test("exports KNL/5 industry models contract vocabulary", () => {
  assert.equal(INDUSTRY_MODELS_CONTRACT_VERSION, "KNL/5");
  assert.equal(INDUSTRY_SECTOR_KEYS.length, 12);
  assert.equal(INDUSTRY_CATEGORY_KEYS.length, 6);
});

test("initializes industry models with KNL/1 through KNL/4 dependencies", () => {
  assert.equal(isIndustryModelsInitialized(), false);
  const init = buildIndustryModels(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isIndustryModelsInitialized(), true);
  assert.equal(init.data?.foundationDependency, "KNL/1");
  assert.equal(init.data?.ontologyDependency, "KNL/2");
  assert.equal(init.data?.vocabularyDependency, "KNL/3");
  assert.equal(init.data?.graphDependency, "KNL/4");
  assert.equal(init.data?.contractVersion, "KNL/5");
});

test("seeds industry catalog with 12 sectors models and templates", () => {
  buildIndustryModels(FIXED_TIME);
  const platform = getIndustryModels(FIXED_TIME);
  assert.equal(platform.registry.sectors.length, 12);
  assert.equal(platform.registry.models.length, 12);
  assert.equal(platform.registry.templates.length, 24);
  assert.equal(platform.registry.categories.length, INDUSTRY_CATEGORY_KEYS.length);
  for (const sectorKey of INDUSTRY_SECTOR_KEYS) {
    assert.ok(platform.registry.models.some((entry) => entry.modelId === `industry-model-${sectorKey}`));
    assert.equal(platform.registry.sectors.find((entry) => entry.sectorKey === sectorKey)?.label, INDUSTRY_SECTOR_LABELS[sectorKey]);
  }
});

test("registers custom industry model template and category", () => {
  buildIndustryModels(FIXED_TIME);
  const model = registerIndustryModel(
    Object.freeze({
      modelId: "industry-model-custom-001",
      sectorKey: "technology",
      categoryKey: "digital",
      label: "Custom Technology Model",
      description: "Custom industry model registration.",
      ontologyEntityId: "business-relationship-type-supports",
    }),
    FIXED_TIME
  );
  assert.equal(model.success, true);
  const template = registerIndustryTemplate(
    Object.freeze({
      templateId: "industry-template-custom-001",
      modelId: "industry-model-custom-001",
      templateType: "risk",
      label: "Technology Risk Template",
      description: "Custom risk template.",
      sectorKey: "technology",
      ontologyEntityId: "business-relationship-type-mitigates",
    }),
    FIXED_TIME
  );
  assert.equal(template.success, true);
  const category = registerIndustryCategory(
    Object.freeze({
      categoryId: "industry-category-custom-001",
      categoryKey: "regulated",
      label: "Custom Regulated",
      description: "This should fail - key already seeded.",
    }),
    FIXED_TIME
  );
  assert.equal(category.success, false);
});

test("prevents duplicate model and template ids", () => {
  buildIndustryModels(FIXED_TIME);
  const duplicateModel = registerIndustryModel(
    Object.freeze({
      modelId: "industry-model-manufacturing",
      sectorKey: "manufacturing",
      categoryKey: "primary",
      label: "Duplicate",
      description: "Duplicate model.",
      ontologyEntityId: "business-relationship-type-contains",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateModel.success, false);
  const duplicateTemplate = registerIndustryTemplate(
    Object.freeze({
      templateId: "industry-template-manufacturing-process",
      modelId: "industry-model-manufacturing",
      templateType: "process",
      label: "Duplicate",
      description: "Duplicate template.",
      sectorKey: "manufacturing",
    }),
    FIXED_TIME
  );
  assert.equal(duplicateTemplate.success, false);
});

test("rejects template for unknown model and invalid ontology reference", () => {
  buildIndustryModels(FIXED_TIME);
  const orphanTemplate = registerIndustryTemplate(
    Object.freeze({
      templateId: "industry-template-orphan",
      modelId: "industry-model-nonexistent",
      templateType: "kpi",
      label: "Orphan",
      description: "Missing model.",
      sectorKey: "retail",
    }),
    FIXED_TIME
  );
  assert.equal(orphanTemplate.success, false);
  const invalidModel = registerIndustryModel(
    Object.freeze({
      modelId: "industry-model-invalid-ref",
      sectorKey: "banking",
      categoryKey: "regulated",
      label: "Invalid Ref",
      description: "Invalid ontology reference.",
      ontologyEntityId: "nonexistent-ontology-entity",
    }),
    FIXED_TIME
  );
  assert.equal(invalidModel.success, false);
});

test("validates industry version namespace format and duplicate ids", () => {
  assert.equal(validateIndustryVersionFormat("KNL/5").valid, true);
  assert.equal(validateIndustryVersionFormat("invalid").valid, false);
  assert.equal(validateIndustryNamespaceFormat("knowledge-industry-models").valid, true);
  assert.equal(validateIndustryNamespaceFormat("invalid_namespace").valid, false);
  assert.equal(hasDuplicateIndustryIds(["a", "b", "a"]), true);
  buildIndustryModels(FIXED_TIME);
  assert.equal(validateOntologyReference("business-relationship-type-owns").valid, true);
});

test("resolves immutable industry contract examples", () => {
  assert.equal(Object.isFrozen(resolveIndustryModelExample(FIXED_TIME)), true);
  assert.equal(Object.isFrozen(resolveIndustryTemplateExample(FIXED_TIME)), true);
  assert.equal(resolveIndustryModelExample(FIXED_TIME).version, "KNL/5");
  assert.equal(resolveIndustryModelExample(FIXED_TIME).sectorKey, "manufacturing");
});

test("builds immutable industry models manifest", () => {
  buildIndustryModels(FIXED_TIME);
  const manifest = getIndustryModelsManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.contractVersion, "KNL/5");
  assert.equal(manifest.graphDependency, "KNL/4");
  assert.equal(manifest.supportedSectors.length, 12);
  assert.equal(manifest.publicApis.length, INDUSTRY_MODELS_PUBLIC_API_REGISTRY.length);
});

test("validates industry models certification report", () => {
  const report = validateIndustryModels(FIXED_TIME);
  assert.equal(report.valid, true, report.issues.map((entry) => entry.message).join("; "));
  assert.equal(report.foundationValid, true);
  assert.equal(report.ontologyValid, true);
  assert.equal(report.vocabularyValid, true);
  assert.equal(report.graphValid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.registryValid, true);
});

test("validates KNL/5 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(INDUSTRY_MODELS_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/knowledge/industryModels.ts",
    allowedFiles: INDUSTRY_MODELS_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: INDUSTRY_MODELS_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("enforces public API and boundary rules", () => {
  assert.equal(INDUSTRY_MODELS_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(INDUSTRY_MODELS_PUBLIC_API_RULES.noSimulation, true);
  assert.equal(INDUSTRY_MODELS_PUBLIC_API_RULES.noBusinessCalculations, true);
  assert.equal(INDUSTRY_MODELS_MUST_NOT_OWN.includes("simulation"), true);
  assert.equal(INDUSTRY_MODELS_MUST_NOT_OWN.includes("business_calculations"), true);
  assert.equal(INDUSTRY_MODELS_PRINCIPLES.includes("knl_5_consumes_knl_1_through_knl_4_only"), true);
});

test("exports industry models contract bundle", () => {
  assert.equal(IndustryModelsContract.version, "KNL/5");
  assert.equal(typeof IndustryModelsContract.validateIndustryModels, "function");
  assert.equal(typeof IndustryModelsContract.getIndustryModelsManifest, "function");
});

test("IndustryModels namespace exposes public APIs only", () => {
  assert.equal(typeof IndustryModels.registerIndustryModel, "function");
  assert.equal(typeof IndustryModels.registerIndustryTemplate, "function");
  assert.equal(typeof IndustryModels.registerIndustryCategory, "function");
  assert.equal(typeof IndustryModels.getIndustryModels, "function");
  assert.equal(typeof IndustryModels.validateIndustryModels, "function");
  assert.equal(typeof IndustryModels.getIndustryModelsManifest, "function");
  assert.equal(IndustryModels.version, "KNL/5");
});

test("public API registry includes required industry exports", () => {
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("registerIndustryModel"));
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("registerIndustryTemplate"));
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("registerIndustryCategory"));
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("getIndustryModels"));
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("validateIndustryModels"));
  assert.ok(INDUSTRY_MODELS_PUBLIC_API_REGISTRY.includes("getIndustryModelsManifest"));
});

test("future phase registry reserves framework library without implementation", () => {
  assert.equal(INDUSTRY_MODELS_FUTURE_PHASE_KEYS.includes("framework_library"), true);
  assert.equal(INDUSTRY_MODELS_FUTURE_PHASE_KEYS.includes("knowledge_retrieval"), true);
});

test("getIndustryModels returns state and registry", () => {
  buildIndustryModels(FIXED_TIME);
  const platform = getIndustryModels(FIXED_TIME);
  assert.equal(platform.state.initialized, true);
  assert.equal(platform.registry.snapshot.platformVersion, "KNL/5");
  assert.equal(platform.state.sectorCount, 12);
});

test("seeded sectors include all required industries", () => {
  buildIndustryModels(FIXED_TIME);
  const required = ["manufacturing", "healthcare", "banking", "technology", "telecommunications"];
  const platform = getIndustryModels(FIXED_TIME);
  for (const sector of required) {
    assert.ok(platform.registry.sectors.some((entry) => entry.sectorKey === sector));
  }
});
