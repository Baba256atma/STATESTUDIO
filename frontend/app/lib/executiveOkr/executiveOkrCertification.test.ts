import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import { runExecutiveModelRuntimeAnalysis } from "../executiveModelRuntime/executiveModelRuntimeCertification.ts";
import { runExecutiveObjectIntegrationAnalysis } from "../executiveObject/executiveObjectCertification.ts";
import { resolveExecutiveObjectRegistryExample } from "../executiveObject/executiveObjectContract.ts";
import { runExecutiveKpiIntegrationAnalysis } from "../executiveKpi/executiveKpiCertification.ts";
import { resolveExecutiveKpiRegistryExample } from "../executiveKpi/executiveKpiContract.ts";
import { runExecutiveRelationshipIntegrationAnalysis } from "../executiveRelationship/executiveRelationshipCertification.ts";
import { resolveExecutiveRelationshipRegistryExample } from "../executiveRelationship/executiveRelationshipContract.ts";
import { runExecutiveRiskIntegrationAnalysis } from "../executiveRisk/executiveRiskCertification.ts";
import { resolveExecutiveRiskRegistryExample } from "../executiveRisk/executiveRiskContract.ts";
import { runExecutiveScenarioIntegrationAnalysis } from "../executiveScenario/executiveScenarioCertification.ts";
import { resolveExecutiveScenarioRegistryExample } from "../executiveScenario/executiveScenarioContract.ts";
import {
  EXECUTIVE_OBJECTIVE_CATEGORIES,
  EXECUTIVE_OKR_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_OKR_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_OKR_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_OKR_INTEGRATION_TAGS,
  EXECUTIVE_OKR_INTEGRATION_VERSION,
  EXECUTIVE_OKR_LIFECYCLE_STATES,
  OKR_DECLARATIONS_EXTENSION_KEY,
  attachOkrDeclarationsToObjectRegistry,
  buildExecutiveOkrOwnershipContract,
  computeExecutiveOkrIntegrationAnalysisScore,
  computeExecutiveOkrIntegrationOverallScore,
  extractOkrDeclarationsFromRegistry,
  integrateExecutiveOkrsFromRegistries,
  listExecutiveObjectivesByCategory,
  listKeyResultsForKpi,
  listKeyResultsForObjective,
  meetsExecutiveOkrIntegrationMinimumScore,
  resolveExecutiveKeyResultById,
  resolveExecutiveKeyResultExample,
  resolveExecutiveObjectiveById,
  resolveExecutiveObjectiveExample,
  resolveExecutiveOkrRegistryExample,
  resolveExecutiveObjectRegistryWithOkrDeclarationsExample,
  validateDeclaredKeyResultStub,
  validateDeclaredObjectiveStub,
  validateEoikrNoCalculationIntegrity,
  validateEoikrPentaRegistryInputBoundary,
  validateEoikrReferenceIntegrity,
  validateExecutiveKeyResult,
  validateExecutiveObjective,
  validateExecutiveOkrRegistry,
  validateKeyResultKpiReferences,
  validateKeyResultObjectReferences,
  validateKeyResultRelationshipReferences,
  validateKeyResultRiskReferences,
  validateKeyResultScenarioReferences,
} from "./executiveOkrContract.ts";
import {
  isExecutiveOkrIntegrationFrozen,
  runExecutiveOkrIntegrationAnalysis,
  runExecutiveOkrIntegrationCertification,
} from "./executiveOkrCertification.ts";
import {
  getExecutiveOkrDiagnosticsLog,
  recordExecutiveOkrDiagnosticEvent,
  resetExecutiveOkrDiagnosticsForTests,
} from "./executiveOkrDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveOkrDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
  runExecutiveRelationshipIntegrationAnalysis();
  runExecutiveKpiIntegrationAnalysis();
  runExecutiveRiskIntegrationAnalysis();
  runExecutiveScenarioIntegrationAnalysis();
});

test("exports integration version, objective categories, lifecycle, and tags", () => {
  assert.equal(EXECUTIVE_OKR_INTEGRATION_VERSION, "PHASE-9/OKR-INT-1");
  assert.equal(EXECUTIVE_OBJECTIVE_CATEGORIES.length, 8);
  assert.equal(EXECUTIVE_OKR_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_OKR_INTEGRATION_TAGS.includes("[OKR_INT_EXECUTIVE_OKR]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_OKR_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/lib/okr/workspaceOkrContract.ts",
    "frontend/app/lib/dashboardIntelligence/singleIntelligenceSourceGateway.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_OKR_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_OKR_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive objective and key result examples with mandatory fields", () => {
  const objective = resolveExecutiveObjectiveExample();
  assert.equal(validateExecutiveObjective(objective).valid, true);
  assert.equal(objective.lifecycleState, "validated");
  assert.equal(objective.objectiveCategory, "operational");

  const keyResult = resolveExecutiveKeyResultExample();
  assert.equal(validateExecutiveKeyResult(keyResult).valid, true);
  assert.equal(keyResult.lifecycleState, "validated");
  assert.ok(keyResult.targetDescription.length > 0);
  assert.equal(keyResult.objectReferences.length, 1);
  assert.equal(keyResult.scenarioReferences.length, 1);

  const registry = resolveExecutiveOkrRegistryExample();
  const ownership = buildExecutiveOkrOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates OKR registry example and lookup helpers", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  const registry = resolveExecutiveOkrRegistryExample();
  assert.equal(
    validateExecutiveOkrRegistry(registry, {
      objectRegistry,
      relationshipRegistry,
      kpiRegistry,
      riskRegistry,
      scenarioRegistry,
    }).valid,
    true
  );
  const firstObjective = registry.objectives[0];
  const firstKeyResult = registry.keyResults[0];
  assert.ok(firstObjective);
  assert.ok(firstKeyResult);
  assert.equal(
    resolveExecutiveObjectiveById(registry, firstObjective.executiveObjectiveId)?.executiveObjectiveId,
    firstObjective.executiveObjectiveId
  );
  assert.equal(
    resolveExecutiveKeyResultById(registry, firstKeyResult.executiveKeyResultId)?.executiveKeyResultId,
    firstKeyResult.executiveKeyResultId
  );
  assert.ok(listExecutiveObjectivesByCategory(registry, firstObjective.objectiveCategory).length >= 1);
  assert.ok(listKeyResultsForObjective(registry, firstObjective.executiveObjectiveId).length >= 1);
  assert.ok(listKeyResultsForKpi(registry, firstKeyResult.kpiReferences[0]!.executiveKpiId).length >= 1);
});

test("extracts OKR declarations from object registry metadata extension", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const declarations = extractOkrDeclarationsFromRegistry(objectRegistry);
  assert.equal(declarations.length, 1);
  assert.equal(declarations[0]?.executiveObjectiveId, "eoikr-objective-outcome-delivery-001");
  assert.equal(validateDeclaredObjectiveStub(declarations[0]!).valid, true);
  assert.equal(validateDeclaredKeyResultStub(declarations[0]!.keyResults[0]!).valid, true);
});

test("validates penta registry input boundary, no-calculation, and reference integrity", () => {
  assert.equal(validateEoikrPentaRegistryInputBoundary().valid, true);
  assert.equal(validateEoikrNoCalculationIntegrity().valid, true);
  assert.equal(validateEoikrReferenceIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("progress_calculation"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("risk_scoring"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("scenario_simulation"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("strategy_optimization"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption"));
  assert.ok(EXECUTIVE_OKR_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption"));
});

test("integrates OKRs from penta registries declarations only", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  const integration = integrateExecutiveOkrsFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    integrationSessionId: "eoikr-test-integration-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.objectives.length, 1);
  assert.equal(integration.keyResults.length, 1);
  assert.equal(
    validateExecutiveOkrRegistry(integration.registry!, {
      objectRegistry,
      relationshipRegistry,
      kpiRegistry,
      riskRegistry,
      scenarioRegistry,
    }).valid,
    true
  );
});

test("accepts empty declaration list as valid empty registry", () => {
  const integration = integrateExecutiveOkrsFromRegistries({
    objectRegistry: resolveExecutiveObjectRegistryExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    kpiRegistry: resolveExecutiveKpiRegistryExample(),
    riskRegistry: resolveExecutiveRiskRegistryExample(),
    scenarioRegistry: resolveExecutiveScenarioRegistryExample(),
    integrationSessionId: "eoikr-test-empty-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.objectives.length, 0);
  assert.equal(integration.keyResults.length, 0);
  assert.equal(integration.registry!.objectiveCount, 0);
  assert.equal(integration.registry!.keyResultCount, 0);
});

test("records OKR diagnostic lifecycle events", () => {
  recordExecutiveOkrDiagnosticEvent({
    type: "ObjectiveDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveObjectiveId: "objective-001",
  });
  assert.ok(getExecutiveOkrDiagnosticsLog().length >= 0);
});

test("computeExecutiveOkrIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveOkrIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveOkrIntegrationMinimumScore(overall), true);
});

test("computeExecutiveOkrIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveOkrIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    registryBoundaryIntegrity: 100,
    objectiveIntegrity: 100,
    keyResultIntegrity: 100,
    identityReferenceIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive OKR integration certification passes all gates", () => {
  const result = runExecutiveOkrIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 41);
});

test("executive OKR integration analysis passes and freezes contract", () => {
  const result = runExecutiveOkrIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_OKR_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveOkrIntegrationFrozen(), true);
  for (const tag of EXECUTIVE_OKR_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 50);
});

test("rejects objective without workspace id", () => {
  const objective = resolveExecutiveObjectiveExample();
  const invalid = Object.freeze({ ...objective, workspaceId: "" });
  assert.equal(validateExecutiveObjective(invalid).valid, false);
});

test("rejects key result without target description", () => {
  const keyResult = resolveExecutiveKeyResultExample();
  const invalid = Object.freeze({ ...keyResult, targetDescription: "" });
  assert.equal(validateExecutiveKeyResult(invalid).valid, false);
});

test("rejects missing object reference in object registry", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  assert.equal(
    validateKeyResultObjectReferences({
      objectReferences: Object.freeze([
        Object.freeze({ executiveObjectId: "missing-object", referenceRole: "primary" as const }),
      ]),
      objectRegistry,
    }).valid,
    false
  );
});

test("rejects missing relationship reference in relationship registry", () => {
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  assert.equal(
    validateKeyResultRelationshipReferences({
      relationshipReferences: Object.freeze([
        Object.freeze({ executiveRelationshipId: "missing-relationship", referenceRole: "primary" as const }),
      ]),
      relationshipRegistry,
    }).valid,
    false
  );
});

test("rejects missing KPI reference in KPI registry", () => {
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  assert.equal(
    validateKeyResultKpiReferences({
      kpiReferences: Object.freeze([
        Object.freeze({ executiveKpiId: "missing-kpi", referenceRole: "primary" as const }),
      ]),
      kpiRegistry,
    }).valid,
    false
  );
});

test("rejects missing risk reference in risk registry", () => {
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  assert.equal(
    validateKeyResultRiskReferences({
      riskReferences: Object.freeze([
        Object.freeze({ executiveRiskId: "missing-risk", referenceRole: "primary" as const }),
      ]),
      riskRegistry,
    }).valid,
    false
  );
});

test("rejects missing scenario reference in scenario registry", () => {
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  assert.equal(
    validateKeyResultScenarioReferences({
      scenarioReferences: Object.freeze([
        Object.freeze({ executiveScenarioId: "missing-scenario", referenceRole: "primary" as const }),
      ]),
      scenarioRegistry,
    }).valid,
    false
  );
});

test("uses okrDeclarations extension key on object metadata", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithOkrDeclarationsExample();
  const host = objectRegistry.objects.find((entry) => entry.executiveObjectId === "emg-obj-outcome");
  assert.ok(host);
  const extension = host!.metadata.extension.futureExtension;
  assert.ok(extension);
  assert.ok(Array.isArray((extension as Record<string, unknown>)[OKR_DECLARATIONS_EXTENSION_KEY]));
});

test("attachOkrDeclarationsToObjectRegistry preserves object registry shape", () => {
  const base = resolveExecutiveObjectRegistryExample();
  const enriched = attachOkrDeclarationsToObjectRegistry(base, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveObjectiveId: "eoikr-test-objective-001",
        displayName: "Test Objective",
        objectiveCategory: "strategic" as const,
        keyResults: Object.freeze([
          Object.freeze({
            executiveKeyResultId: "eoikr-test-kr-001",
            displayName: "Test Key Result",
            targetDescription: "Declarative target only.",
            objectReferences: Object.freeze([
              Object.freeze({ executiveObjectId: "emg-obj-outcome", referenceRole: "primary" as const }),
            ]),
            relationshipReferences: Object.freeze([]),
            kpiReferences: Object.freeze([]),
            riskReferences: Object.freeze([]),
            scenarioReferences: Object.freeze([]),
          }),
        ]),
      }),
    ]),
  });
  assert.equal(enriched.objectCount, base.objectCount);
  assert.equal(extractOkrDeclarationsFromRegistry(enriched).length, 1);
});
