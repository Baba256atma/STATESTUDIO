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
import {
  EXECUTIVE_SCENARIO_CATEGORIES,
  EXECUTIVE_SCENARIO_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_SCENARIO_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_SCENARIO_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_SCENARIO_INTEGRATION_TAGS,
  EXECUTIVE_SCENARIO_INTEGRATION_VERSION,
  EXECUTIVE_SCENARIO_LIFECYCLE_STATES,
  EXECUTIVE_SCENARIO_STATUSES,
  SCENARIO_DECLARATIONS_EXTENSION_KEY,
  attachScenarioDeclarationsToObjectRegistry,
  buildExecutiveScenarioOwnershipContract,
  computeExecutiveScenarioIntegrationAnalysisScore,
  computeExecutiveScenarioIntegrationOverallScore,
  extractScenarioDeclarationsFromRegistry,
  integrateExecutiveScenariosFromRegistries,
  listExecutiveScenariosByCategory,
  listExecutiveScenariosByStatus,
  listExecutiveScenariosForObject,
  listExecutiveScenariosForRisk,
  meetsExecutiveScenarioIntegrationMinimumScore,
  resolveExecutiveScenarioById,
  resolveExecutiveScenarioExample,
  resolveExecutiveScenarioRegistryExample,
  resolveExecutiveObjectRegistryWithScenarioDeclarationsExample,
  validateDeclaredScenarioStub,
  validateEsisNoSimulationIntegrity,
  validateEsisQuadRegistryInputBoundary,
  validateEsisReferenceIntegrity,
  validateExecutiveScenario,
  validateExecutiveScenarioRegistry,
  validateScenarioAssumptions,
  validateScenarioConstraints,
  validateScenarioKpiReferences,
  validateScenarioObjectReferences,
  validateScenarioRelationshipReferences,
  validateScenarioRiskReferences,
} from "./executiveScenarioContract.ts";
import {
  isExecutiveScenarioIntegrationFrozen,
  runExecutiveScenarioIntegrationAnalysis,
  runExecutiveScenarioIntegrationCertification,
} from "./executiveScenarioCertification.ts";
import {
  getExecutiveScenarioDiagnosticsLog,
  recordExecutiveScenarioDiagnosticEvent,
  resetExecutiveScenarioDiagnosticsForTests,
} from "./executiveScenarioDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveScenarioDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
  runExecutiveRelationshipIntegrationAnalysis();
  runExecutiveKpiIntegrationAnalysis();
  runExecutiveRiskIntegrationAnalysis();
});

test("exports integration version, scenario categories, statuses, and tags", () => {
  assert.equal(EXECUTIVE_SCENARIO_INTEGRATION_VERSION, "PHASE-8/DS6-INT-1");
  assert.equal(EXECUTIVE_SCENARIO_CATEGORIES.length, 8);
  assert.equal(EXECUTIVE_SCENARIO_STATUSES.length, 5);
  assert.equal(EXECUTIVE_SCENARIO_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_TAGS.includes("[DS6_INT_EXECUTIVE_SCENARIO]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_SCENARIO_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/lib/scenario-authoring/scenarioAuthoringContract.ts",
    "frontend/app/lib/ui/mrpWorkspace/scenario/scenarioWorkspaceContract.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_SCENARIO_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_SCENARIO_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive scenario example with mandatory fields", () => {
  const scenario = resolveExecutiveScenarioExample();
  assert.equal(validateExecutiveScenario(scenario).valid, true);
  assert.equal(scenario.lifecycleState, "validated");
  assert.equal(scenario.scenarioCategory, "contingency");
  assert.equal(scenario.scenarioStatus, "proposed");
  assert.equal(scenario.assumptions.length, 1);
  assert.equal(scenario.constraints.length, 1);
  const registry = resolveExecutiveScenarioRegistryExample();
  const ownership = buildExecutiveScenarioOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates scenario registry example and lookup helpers", () => {
  const integrationInput = {
    objectRegistry: resolveExecutiveObjectRegistryWithScenarioDeclarationsExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    kpiRegistry: resolveExecutiveKpiRegistryExample(),
    riskRegistry: resolveExecutiveRiskRegistryExample(),
  };
  const registry = resolveExecutiveScenarioRegistryExample();
  assert.equal(validateExecutiveScenarioRegistry(registry, integrationInput).valid, true);
  const first = registry.scenarios[0];
  assert.ok(first);
  assert.equal(
    resolveExecutiveScenarioById(registry, first.executiveScenarioId)?.executiveScenarioId,
    first.executiveScenarioId
  );
  assert.ok(listExecutiveScenariosByCategory(registry, first.scenarioCategory).length >= 1);
  assert.ok(listExecutiveScenariosByStatus(registry, first.scenarioStatus).length >= 1);
  assert.ok(listExecutiveScenariosForObject(registry, first.objectReferences[0]!.executiveObjectId).length >= 1);
  assert.ok(listExecutiveScenariosForRisk(registry, first.riskReferences[0]!.executiveRiskId).length >= 1);
});

test("extracts scenario declarations from object registry metadata extension", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  const declarations = extractScenarioDeclarationsFromRegistry(objectRegistry);
  assert.equal(declarations.length, 1);
  assert.equal(declarations[0]?.executiveScenarioId, "esis-scenario-outcome-delay-001");
  assert.equal(validateDeclaredScenarioStub(declarations[0]!).valid, true);
});

test("validates quad registry input boundary, no-simulation, and reference integrity", () => {
  assert.equal(validateEsisQuadRegistryInputBoundary().valid, true);
  assert.equal(validateEsisNoSimulationIntegrity().valid, true);
  assert.equal(validateEsisReferenceIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_simulation"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("scenario_prediction"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("optimization_engine"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption"));
  assert.ok(EXECUTIVE_SCENARIO_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption"));
});

test("integrates scenarios from quad registries declarations only", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const integration = integrateExecutiveScenariosFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    integrationSessionId: "esis-test-integration-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.scenarios.length, 1);
  assert.equal(
    validateExecutiveScenarioRegistry(integration.registry!, {
      objectRegistry,
      relationshipRegistry,
      kpiRegistry,
      riskRegistry,
    }).valid,
    true
  );
});

test("accepts empty declaration list as valid empty registry", () => {
  const integration = integrateExecutiveScenariosFromRegistries({
    objectRegistry: resolveExecutiveObjectRegistryExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    kpiRegistry: resolveExecutiveKpiRegistryExample(),
    riskRegistry: resolveExecutiveRiskRegistryExample(),
    integrationSessionId: "esis-test-empty-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.scenarios.length, 0);
  assert.equal(integration.registry!.scenarioCount, 0);
});

test("records scenario diagnostic lifecycle events", () => {
  recordExecutiveScenarioDiagnosticEvent({
    type: "ScenarioDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveScenarioId: "scenario-001",
  });
  assert.ok(getExecutiveScenarioDiagnosticsLog().length >= 0);
});

test("computeExecutiveScenarioIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveScenarioIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveScenarioIntegrationMinimumScore(overall), true);
});

test("computeExecutiveScenarioIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveScenarioIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    registryBoundaryIntegrity: 100,
    scenarioModelIntegrity: 100,
    referenceIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive scenario integration certification passes all gates", () => {
  const result = runExecutiveScenarioIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 36);
});

test("executive scenario integration analysis passes and freezes contract", () => {
  const result = runExecutiveScenarioIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_SCENARIO_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveScenarioIntegrationFrozen(), true);
  for (const tag of EXECUTIVE_SCENARIO_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 44);
});

test("rejects scenario without workspace id", () => {
  const scenario = resolveExecutiveScenarioExample();
  const invalid = Object.freeze({ ...scenario, workspaceId: "" });
  assert.equal(validateExecutiveScenario(invalid).valid, false);
});

test("rejects missing object reference in object registry", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  assert.equal(
    validateScenarioObjectReferences({
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
    validateScenarioRelationshipReferences({
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
    validateScenarioKpiReferences({
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
    validateScenarioRiskReferences({
      riskReferences: Object.freeze([
        Object.freeze({ executiveRiskId: "missing-risk", referenceRole: "primary" as const }),
      ]),
      riskRegistry,
    }).valid,
    false
  );
});

test("validates assumptions and constraints shape", () => {
  assert.equal(
    validateScenarioAssumptions(Object.freeze([Object.freeze({ assumptionId: "", description: "x" })])).valid,
    false
  );
  assert.equal(
    validateScenarioConstraints(Object.freeze([Object.freeze({ constraintId: "c1", description: "" })])).valid,
    false
  );
  assert.equal(validateScenarioAssumptions(Object.freeze([])).valid, true);
  assert.equal(validateScenarioConstraints(Object.freeze([])).valid, true);
});

test("uses scenarioDeclarations extension key on object metadata", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithScenarioDeclarationsExample();
  const host = objectRegistry.objects.find((entry) => entry.executiveObjectId === "emg-obj-outcome");
  assert.ok(host);
  const extension = host!.metadata.extension.futureExtension;
  assert.ok(extension);
  assert.ok(Array.isArray((extension as Record<string, unknown>)[SCENARIO_DECLARATIONS_EXTENSION_KEY]));
});

test("attachScenarioDeclarationsToObjectRegistry preserves object registry shape", () => {
  const base = resolveExecutiveObjectRegistryExample();
  const enriched = attachScenarioDeclarationsToObjectRegistry(base, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveScenarioId: "esis-test-scenario-001",
        displayName: "Test Scenario",
        scenarioCategory: "operational" as const,
        scenarioStatus: "proposed" as const,
        objectReferences: Object.freeze([
          Object.freeze({ executiveObjectId: "emg-obj-outcome", referenceRole: "primary" as const }),
        ]),
        relationshipReferences: Object.freeze([]),
        kpiReferences: Object.freeze([]),
        riskReferences: Object.freeze([]),
        assumptions: Object.freeze([]),
        constraints: Object.freeze([]),
      }),
    ]),
  });
  assert.equal(enriched.objectCount, base.objectCount);
  assert.equal(extractScenarioDeclarationsFromRegistry(enriched).length, 1);
});
