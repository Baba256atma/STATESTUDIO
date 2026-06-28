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
import {
  EXECUTIVE_RISK_CATEGORIES,
  EXECUTIVE_RISK_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_RISK_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_RISK_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_RISK_INTEGRATION_TAGS,
  EXECUTIVE_RISK_INTEGRATION_VERSION,
  EXECUTIVE_RISK_LIFECYCLE_STATES,
  EXECUTIVE_RISK_LIKELIHOOD_HINTS,
  EXECUTIVE_RISK_SEVERITY_HINTS,
  RISK_DECLARATIONS_EXTENSION_KEY,
  attachRiskDeclarationsToObjectRegistry,
  buildExecutiveRiskOwnershipContract,
  computeExecutiveRiskIntegrationAnalysisScore,
  computeExecutiveRiskIntegrationOverallScore,
  extractRiskDeclarationsFromRegistry,
  integrateExecutiveRisksFromRegistries,
  listExecutiveRisksByCategory,
  listExecutiveRisksForKpi,
  listExecutiveRisksForObject,
  meetsExecutiveRiskIntegrationMinimumScore,
  resolveExecutiveRiskById,
  resolveExecutiveRiskExample,
  resolveExecutiveRiskRegistryExample,
  resolveExecutiveObjectRegistryWithRiskDeclarationsExample,
  validateDeclaredRiskStub,
  validateErirBindingIntegrity,
  validateErirNoScoringIntegrity,
  validateErirTripleRegistryInputBoundary,
  validateExecutiveRisk,
  validateExecutiveRiskRegistry,
  validateRiskKpiBindings,
  validateRiskObjectBindings,
  validateRiskRelationshipBindings,
} from "./executiveRiskContract.ts";
import {
  isExecutiveRiskIntegrationFrozen,
  runExecutiveRiskIntegrationAnalysis,
  runExecutiveRiskIntegrationCertification,
} from "./executiveRiskCertification.ts";
import {
  getExecutiveRiskDiagnosticsLog,
  recordExecutiveRiskDiagnosticEvent,
  resetExecutiveRiskDiagnosticsForTests,
} from "./executiveRiskDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveRiskDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
  runExecutiveRelationshipIntegrationAnalysis();
  runExecutiveKpiIntegrationAnalysis();
});

test("exports integration version, risk categories, severity, likelihood, and tags", () => {
  assert.equal(EXECUTIVE_RISK_INTEGRATION_VERSION, "PHASE-7/DS5-INT-1");
  assert.equal(EXECUTIVE_RISK_CATEGORIES.length, 8);
  assert.equal(EXECUTIVE_RISK_SEVERITY_HINTS.length, 4);
  assert.equal(EXECUTIVE_RISK_LIKELIHOOD_HINTS.length, 5);
  assert.equal(EXECUTIVE_RISK_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_RISK_INTEGRATION_TAGS.includes("[DS5_INT_EXECUTIVE_RISK]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_RISK_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/risk-intelligence/RiskIntelligenceRuntime.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_RISK_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_RISK_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive risk example with mandatory fields", () => {
  const risk = resolveExecutiveRiskExample();
  assert.equal(validateExecutiveRisk(risk).valid, true);
  assert.equal(risk.lifecycleState, "validated");
  assert.equal(risk.riskCategory, "operational");
  assert.equal(risk.severityHint, "high");
  assert.equal(risk.likelihoodHint, "possible");
  const registry = resolveExecutiveRiskRegistryExample();
  const ownership = buildExecutiveRiskOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates risk registry example and lookup helpers", () => {
  const integrationInput = {
    objectRegistry: resolveExecutiveObjectRegistryWithRiskDeclarationsExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    kpiRegistry: resolveExecutiveKpiRegistryExample(),
  };
  const registry = resolveExecutiveRiskRegistryExample();
  assert.equal(validateExecutiveRiskRegistry(registry, integrationInput).valid, true);
  const first = registry.risks[0];
  assert.ok(first);
  assert.equal(resolveExecutiveRiskById(registry, first.executiveRiskId)?.executiveRiskId, first.executiveRiskId);
  assert.ok(listExecutiveRisksByCategory(registry, first.riskCategory).length >= 1);
  assert.ok(listExecutiveRisksForObject(registry, first.objectBindings[0]!.executiveObjectId).length >= 1);
  assert.ok(listExecutiveRisksForKpi(registry, first.kpiBindings[0]!.executiveKpiId).length >= 1);
});

test("extracts risk declarations from object registry metadata extension", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  const declarations = extractRiskDeclarationsFromRegistry(objectRegistry);
  assert.equal(declarations.length, 1);
  assert.equal(declarations[0]?.executiveRiskId, "erir-risk-outcome-delivery-001");
  assert.equal(validateDeclaredRiskStub(declarations[0]!).valid, true);
});

test("validates triple registry input boundary, no-scoring, and binding integrity", () => {
  assert.equal(validateErirTripleRegistryInputBoundary().valid, true);
  assert.equal(validateErirNoScoringIntegrity().valid, true);
  assert.equal(validateErirBindingIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("risk_scoring"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("probability_calculation"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("mitigation_engine"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption"));
  assert.ok(EXECUTIVE_RISK_INTEGRATION_MUST_NOT_OWN.includes("emg_model_record_consumption"));
});

test("integrates risks from triple registries declarations only", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const integration = integrateExecutiveRisksFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    integrationSessionId: "erir-test-integration-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.risks.length, 1);
  assert.equal(
    validateExecutiveRiskRegistry(integration.registry!, { objectRegistry, relationshipRegistry, kpiRegistry }).valid,
    true
  );
});

test("accepts empty declaration list as valid empty registry", () => {
  const integration = integrateExecutiveRisksFromRegistries({
    objectRegistry: resolveExecutiveObjectRegistryExample(),
    relationshipRegistry: resolveExecutiveRelationshipRegistryExample(),
    kpiRegistry: resolveExecutiveKpiRegistryExample(),
    integrationSessionId: "erir-test-empty-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.risks.length, 0);
  assert.equal(integration.registry!.riskCount, 0);
});

test("records risk diagnostic lifecycle events", () => {
  recordExecutiveRiskDiagnosticEvent({
    type: "RiskDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveRiskId: "risk-001",
  });
  assert.ok(getExecutiveRiskDiagnosticsLog().length >= 0);
});

test("computeExecutiveRiskIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveRiskIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveRiskIntegrationMinimumScore(overall), true);
});

test("computeExecutiveRiskIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveRiskIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    registryBoundaryIntegrity: 100,
    riskModelIntegrity: 100,
    bindingIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive risk integration certification passes all gates", () => {
  const result = runExecutiveRiskIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("executive risk integration analysis passes and freezes contract", () => {
  const result = runExecutiveRiskIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_RISK_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveRiskIntegrationFrozen(), true);
  for (const tag of EXECUTIVE_RISK_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 41);
});

test("rejects risk without workspace id", () => {
  const risk = resolveExecutiveRiskExample();
  const invalid = Object.freeze({ ...risk, workspaceId: "" });
  assert.equal(validateExecutiveRisk(invalid).valid, false);
});

test("rejects missing object binding in object registry", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  assert.equal(
    validateRiskObjectBindings({
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
    validateRiskRelationshipBindings({
      relationshipBindings: Object.freeze([
        Object.freeze({ executiveRelationshipId: "missing-relationship", bindingRole: "primary" as const }),
      ]),
      relationshipRegistry,
    }).valid,
    false
  );
});

test("rejects missing KPI binding in KPI registry", () => {
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  assert.equal(
    validateRiskKpiBindings({
      kpiBindings: Object.freeze([
        Object.freeze({ executiveKpiId: "missing-kpi", bindingRole: "primary" as const }),
      ]),
      kpiRegistry,
    }).valid,
    false
  );
});

test("uses riskDeclarations extension key on object metadata", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithRiskDeclarationsExample();
  const host = objectRegistry.objects.find((entry) => entry.executiveObjectId === "emg-obj-outcome");
  assert.ok(host);
  const extension = host!.metadata.extension.futureExtension;
  assert.ok(extension);
  assert.ok(Array.isArray((extension as Record<string, unknown>)[RISK_DECLARATIONS_EXTENSION_KEY]));
});

test("attachRiskDeclarationsToObjectRegistry preserves object registry shape", () => {
  const base = resolveExecutiveObjectRegistryExample();
  const enriched = attachRiskDeclarationsToObjectRegistry(base, {
    "emg-obj-outcome": Object.freeze([
      Object.freeze({
        executiveRiskId: "erir-test-risk-001",
        displayName: "Test Risk",
        riskCategory: "technical" as const,
        severityHint: "medium" as const,
        likelihoodHint: "unlikely" as const,
        objectBindings: Object.freeze([
          Object.freeze({ executiveObjectId: "emg-obj-outcome", bindingRole: "primary" as const }),
        ]),
        relationshipBindings: Object.freeze([]),
        kpiBindings: Object.freeze([]),
      }),
    ]),
  });
  assert.equal(enriched.objectCount, base.objectCount);
  assert.equal(extractRiskDeclarationsFromRegistry(enriched).length, 1);
});
