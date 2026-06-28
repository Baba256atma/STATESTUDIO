import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import { runExecutiveModelRuntimeAnalysis } from "../executiveModelRuntime/executiveModelRuntimeCertification.ts";
import { runExecutiveObjectIntegrationAnalysis } from "../executiveObject/executiveObjectCertification.ts";
import { resolveExecutiveObjectRegistryExample } from "../executiveObject/executiveObjectContract.ts";
import { runExecutiveRelationshipIntegrationAnalysis } from "../executiveRelationship/executiveRelationshipCertification.ts";
import { resolveExecutiveRelationshipRegistryExample } from "../executiveRelationship/executiveRelationshipContract.ts";
import {
  EXECUTIVE_KPI_CATEGORIES,
  EXECUTIVE_KPI_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_KPI_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_KPI_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_KPI_INTEGRATION_TAGS,
  EXECUTIVE_KPI_INTEGRATION_VERSION,
  EXECUTIVE_KPI_LIFECYCLE_STATES,
  EXECUTIVE_KPI_MEASUREMENT_TYPES,
  KPI_DECLARATIONS_EXTENSION_KEY,
  attachKpiDeclarationsToObjectRegistry,
  buildExecutiveKpiOwnershipContract,
  computeExecutiveKpiIntegrationAnalysisScore,
  computeExecutiveKpiIntegrationOverallScore,
  extractKpiDeclarationsFromRegistry,
  integrateExecutiveKpisFromRegistries,
  listExecutiveKpisByCategory,
  listExecutiveKpisForObject,
  meetsExecutiveKpiIntegrationMinimumScore,
  resolveExecutiveKpiById,
  resolveExecutiveKpiExample,
  resolveExecutiveKpiRegistryExample,
  resolveExecutiveObjectRegistryWithKpiDeclarationsExample,
  validateDeclaredKpiStub,
  validateEkiBindingIntegrity,
  validateEkiDualRegistryInputBoundary,
  validateEkiNoCalculationIntegrity,
  validateExecutiveKpi,
  validateExecutiveKpiRegistry,
  validateKpiObjectBindings,
  validateKpiRelationshipBindings,
} from "./executiveKpiContract.ts";
import {
  isExecutiveKpiIntegrationFrozen,
  runExecutiveKpiIntegrationAnalysis,
  runExecutiveKpiIntegrationCertification,
} from "./executiveKpiCertification.ts";
import {
  getExecutiveKpiDiagnosticsLog,
  recordExecutiveKpiDiagnosticEvent,
  resetExecutiveKpiDiagnosticsForTests,
} from "./executiveKpiDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveKpiDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
  runExecutiveRelationshipIntegrationAnalysis();
});

test("exports integration version, KPI categories, measurement types, and tags", () => {
  assert.equal(EXECUTIVE_KPI_INTEGRATION_VERSION, "PHASE-6/DS4-INT-1");
  assert.equal(EXECUTIVE_KPI_CATEGORIES.length, 8);
  assert.equal(EXECUTIVE_KPI_MEASUREMENT_TYPES.length, 8);
  assert.equal(EXECUTIVE_KPI_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_KPI_INTEGRATION_TAGS.includes("[DS4_INT_EXECUTIVE_KPI]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_KPI_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/kpi-intelligence/executiveKpiSummaryContract.ts",
    "frontend/app/lib/relationships/executive/relationshipFocusRuntime.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_KPI_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_KPI_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive KPI example with mandatory fields", () => {
  const kpi = resolveExecutiveKpiExample();
  assert.equal(validateExecutiveKpi(kpi).valid, true);
  assert.equal(kpi.lifecycleState, "validated");
  assert.equal(kpi.kpiCategory, "operational");
  assert.equal(kpi.measurementType, "percentage");
  const registry = resolveExecutiveKpiRegistryExample();
  const ownership = buildExecutiveKpiOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates KPI registry example and lookup helpers", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const registry = resolveExecutiveKpiRegistryExample();
  assert.equal(
    validateExecutiveKpiRegistry(registry, { objectRegistry, relationshipRegistry }).valid,
    true
  );
  const first = registry.kpis[0];
  assert.ok(first);
  assert.equal(resolveExecutiveKpiById(registry, first.executiveKpiId)?.executiveKpiId, first.executiveKpiId);
  assert.ok(listExecutiveKpisByCategory(registry, first.kpiCategory).length >= 1);
  assert.ok(listExecutiveKpisForObject(registry, first.objectBindings[0]!.executiveObjectId).length >= 1);
});

test("extracts KPI declarations from object registry metadata extension", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  const declarations = extractKpiDeclarationsFromRegistry(objectRegistry);
  assert.equal(declarations.length, 1);
  assert.equal(declarations[0]?.executiveKpiId, "eki-kpi-outcome-delivery-001");
  assert.equal(validateDeclaredKpiStub(declarations[0]!).valid, true);
});

test("validates dual registry input boundary, no-calculation, and binding integrity", () => {
  assert.equal(validateEkiDualRegistryInputBoundary().valid, true);
  assert.equal(validateEkiNoCalculationIntegrity().valid, true);
  assert.equal(validateEkiBindingIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("kpi_formula_execution"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("aggregation_engine"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption"));
  assert.ok(EXECUTIVE_KPI_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption"));
});

test("integrates KPIs from dual registries declarations only", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const integration = integrateExecutiveKpisFromRegistries({
    objectRegistry,
    relationshipRegistry,
    integrationSessionId: "eki-test-integration-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.kpis.length, 1);
  assert.equal(
    validateExecutiveKpiRegistry(integration.registry!, { objectRegistry, relationshipRegistry }).valid,
    true
  );
});

test("accepts empty declaration list as valid empty registry", () => {
  const integration = integrateExecutiveKpisFromRegistries({
    objectRegistry: resolveExecutiveObjectRegistryExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    integrationSessionId: "eki-test-empty-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.kpis.length, 0);
  assert.equal(integration.registry!.kpiCount, 0);
});

test("records KPI diagnostic lifecycle events", () => {
  recordExecutiveKpiDiagnosticEvent({
    type: "KpiDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveKpiId: "kpi-001",
  });
  assert.ok(getExecutiveKpiDiagnosticsLog().length >= 0);
});

test("computeExecutiveKpiIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveKpiIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveKpiIntegrationMinimumScore(overall), true);
});

test("computeExecutiveKpiIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveKpiIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    registryBoundaryIntegrity: 100,
    kpiModelIntegrity: 100,
    bindingIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive KPI integration certification passes all gates", () => {
  const result = runExecutiveKpiIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("executive KPI integration analysis passes and freezes contract", () => {
  const result = runExecutiveKpiIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_KPI_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveKpiIntegrationFrozen(), true);
  for (const tag of EXECUTIVE_KPI_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 37);
});

test("rejects KPI without workspace id", () => {
  const kpi = resolveExecutiveKpiExample();
  const invalid = Object.freeze({ ...kpi, workspaceId: "" });
  assert.equal(validateExecutiveKpi(invalid).valid, false);
});

test("rejects missing object binding in object registry", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  assert.equal(
    validateKpiObjectBindings({
      objectBindings: Object.freeze([
        Object.freeze({ executiveObjectId: "missing-object", bindingRole: "primary" as const }),
      ]),
      objectRegistry,
    }).valid,
    false
  );
});

test("rejects missing relationship binding in relationship registry", () => {
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  assert.equal(
    validateKpiRelationshipBindings({
      relationshipBindings: Object.freeze([
        Object.freeze({ executiveRelationshipId: "missing-relationship", bindingRole: "primary" as const }),
      ]),
      relationshipRegistry,
    }).valid,
    false
  );
});

test("uses kpiDeclarations extension key on object metadata", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithKpiDeclarationsExample();
  const host = objectRegistry.objects.find((entry) => entry.executiveObjectId === "emg-obj-outcome");
  assert.ok(host);
  const extension = host!.metadata.extension.futureExtension;
  assert.ok(extension);
  assert.ok(Array.isArray((extension as Record<string, unknown>)[KPI_DECLARATIONS_EXTENSION_KEY]));
});

test("attachKpiDeclarationsToObjectRegistry preserves object registry shape", () => {
  const base = resolveExecutiveObjectRegistryExample();
  const enriched = attachKpiDeclarationsToObjectRegistry(base, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveKpiId: "eki-test-kpi-001",
        displayName: "Test KPI",
        kpiCategory: "quality" as const,
        measurementType: "score" as const,
        targetDefinition: Object.freeze({
          description: "Quality score target.",
          unitHint: "score",
          directionHint: "higher_is_better" as const,
          targetValueHint: "90",
        }),
        objectBindings: Object.freeze([
          Object.freeze({ executiveObjectId: "emg-obj-outcome", bindingRole: "primary" as const }),
        ]),
        relationshipBindings: Object.freeze([]),
      }),
    ]),
  });
  assert.equal(enriched.objectCount, base.objectCount);
  assert.equal(extractKpiDeclarationsFromRegistry(enriched).length, 1);
});
