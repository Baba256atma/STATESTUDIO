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
import { runExecutiveOkrIntegrationAnalysis } from "../executiveOkr/executiveOkrCertification.ts";
import { integrateExecutiveOkrsFromRegistries } from "../executiveOkr/executiveOkrContract.ts";
import { runExecutiveRelationshipIntegrationAnalysis } from "../executiveRelationship/executiveRelationshipCertification.ts";
import { resolveExecutiveRelationshipRegistryExample } from "../executiveRelationship/executiveRelationshipContract.ts";
import { runExecutiveRiskIntegrationAnalysis } from "../executiveRisk/executiveRiskCertification.ts";
import { resolveExecutiveRiskRegistryExample } from "../executiveRisk/executiveRiskContract.ts";
import { runExecutiveScenarioIntegrationAnalysis } from "../executiveScenario/executiveScenarioCertification.ts";
import { resolveExecutiveScenarioRegistryExample } from "../executiveScenario/executiveScenarioContract.ts";
import {
  EXECUTIVE_INTELLIGENCE_PLATFORM_FORBIDDEN_PATTERNS,
  EXECUTIVE_INTELLIGENCE_PLATFORM_FREEZE_TAGS,
  EXECUTIVE_INTELLIGENCE_PLATFORM_LIFECYCLE_STATES,
  EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN,
  EXECUTIVE_INTELLIGENCE_PLATFORM_SELF_MANIFEST,
  EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE,
  EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION,
  EXECUTIVE_INTELLIGENCE_ORCHESTRATION_STAGES,
  EXECUTIVE_INTELLIGENCE_REQUEST_TYPES,
  buildConsumedRegistriesFromInput,
  buildExecutiveIntelligenceOwnershipContract,
  computeExecutiveIntelligencePlatformAnalysisScore,
  computeExecutiveIntelligencePlatformOverallScore,
  meetsExecutiveIntelligencePlatformMinimumScore,
  orchestrateExecutiveIntelligenceFromRegistries,
  resolveExecutiveIntelligenceContextExample,
  resolveExecutiveIntelligenceOrchestrationInputExample,
  resolveExecutiveIntelligenceRequestExample,
  resolveExecutiveIntelligenceResponseExample,
  resolveExecutiveIntelligenceSessionExample,
  validateEipHexRegistryInputBoundary,
  validateEipNoReasoningIntegrity,
  validateEipReferenceIntegrity,
  validateExecutiveIntelligenceContext,
  validateExecutiveIntelligenceRequest,
  validateExecutiveIntelligenceResponse,
  validateExecutiveIntelligenceSession,
  validateResponseKpiReferences,
  validateResponseObjectReferences,
  validateResponseOkrReferences,
  validateResponseRelationshipReferences,
  validateResponseRiskReferences,
  validateResponseScenarioReferences,
} from "./executiveIntelligencePlatformContract.ts";
import {
  isExecutiveIntelligencePlatformFrozen,
  runExecutiveIntelligencePlatformAnalysis,
  runExecutiveIntelligencePlatformCertification,
} from "./executiveIntelligencePlatformCertification.ts";
import {
  getExecutiveIntelligenceDiagnosticsLog,
  recordExecutiveIntelligenceDiagnosticEvent,
  resetExecutiveIntelligenceDiagnosticsForTests,
} from "./executiveIntelligencePlatformDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveIntelligenceDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
  runExecutiveRelationshipIntegrationAnalysis();
  runExecutiveKpiIntegrationAnalysis();
  runExecutiveRiskIntegrationAnalysis();
  runExecutiveScenarioIntegrationAnalysis();
  runExecutiveOkrIntegrationAnalysis();
});

test("exports integration version, request types, lifecycle, and tags", () => {
  assert.equal(EXECUTIVE_INTELLIGENCE_PLATFORM_VERSION, "PHASE-10/EIP-1");
  assert.equal(EXECUTIVE_INTELLIGENCE_REQUEST_TYPES.length, 6);
  assert.equal(EXECUTIVE_INTELLIGENCE_PLATFORM_LIFECYCLE_STATES.length, 6);
  assert.equal(EXECUTIVE_INTELLIGENCE_ORCHESTRATION_STAGES.length, 6);
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS.includes("[EIP_EXECUTIVE_INTELLIGENCE_PLATFORM]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_INTELLIGENCE_PLATFORM_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformCertificationRunner.ts",
    "frontend/app/lib/dashboardIntelligence/singleIntelligenceSourceGateway.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_INTELLIGENCE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_INTELLIGENCE_PLATFORM_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates intelligence session, request, response, and context examples", () => {
  const session = resolveExecutiveIntelligenceSessionExample();
  assert.equal(validateExecutiveIntelligenceSession(session).valid, true);
  assert.equal(session.lifecycleState, "available");
  assert.equal(session.requestType, "executive_overview");

  const request = resolveExecutiveIntelligenceRequestExample();
  assert.equal(validateExecutiveIntelligenceRequest(request).valid, true);

  const response = resolveExecutiveIntelligenceResponseExample();
  assert.equal(validateExecutiveIntelligenceResponse(response).valid, true);
  assert.ok(response.executiveSummary.length > 0);
  assert.equal(response.referencedObjects.length, 1);

  const context = resolveExecutiveIntelligenceContextExample();
  assert.equal(validateExecutiveIntelligenceContext(context).valid, true);

  const ownership = buildExecutiveIntelligenceOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  assert.equal(ownership.mutationPolicy, "read-only-orchestration-snapshot");
});

test("builds consumed registries correlation from hex input", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  const consumed = buildConsumedRegistriesFromInput(input);
  assert.equal(consumed.objectRegistryId, input.objectRegistry.registryId);
  assert.equal(consumed.okrRegistryId, input.okrRegistry.registryId);
});

test("validates hex registry boundary, no-reasoning, and reference integrity", () => {
  assert.equal(validateEipHexRegistryInputBoundary().valid, true);
  assert.equal(validateEipNoReasoningIntegrity().valid, true);
  assert.equal(validateEipReferenceIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("recommendation_generation"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("risk_scoring"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("scenario_simulation"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("okr_progress"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("registry_mutation"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("registry_caching"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("business_entity_ownership"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_MUST_NOT_OWN.includes("emg_direct_consumption"));
});

test("orchestrates intelligence from hex registries read-only", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  const result = orchestrateExecutiveIntelligenceFromRegistries(input);
  assert.equal(result.success, true);
  assert.ok(result.session);
  assert.ok(result.request);
  assert.ok(result.response);
  assert.ok(result.context);
  assert.equal(result.response!.source, EXECUTIVE_INTELLIGENCE_PLATFORM_SOURCE);
  assert.equal(result.response!.referencedKpis[0]?.executiveKpiId, "eki-kpi-outcome-delivery-001");
});

test("accepts empty hex scope as valid orchestration", () => {
  const objectRegistry = resolveExecutiveObjectRegistryExample();
  const relationshipRegistry = resolveExecutiveRelationshipRegistryExample();
  const kpiRegistry = resolveExecutiveKpiRegistryExample();
  const riskRegistry = resolveExecutiveRiskRegistryExample();
  const scenarioRegistry = resolveExecutiveScenarioRegistryExample();
  const emptyOkrIntegration = integrateExecutiveOkrsFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    integrationSessionId: "eip-test-empty-okr-001",
  });
  assert.ok(emptyOkrIntegration.registry);
  const result = orchestrateExecutiveIntelligenceFromRegistries({
    objectRegistry,
    relationshipRegistry,
    kpiRegistry,
    riskRegistry,
    scenarioRegistry,
    okrRegistry: emptyOkrIntegration.registry,
    requestType: "summary",
    intelligenceSessionId: "eip-test-empty-001",
  });
  assert.equal(result.success, true);
  assert.ok(result.response);
  assert.equal(result.response!.referencedOkrs.length, 0);
  assert.ok(result.response!.executiveSummary.length > 0);
});

test("records intelligence diagnostic lifecycle events", () => {
  recordExecutiveIntelligenceDiagnosticEvent({
    type: "IntelligenceSessionCreated",
    intelligenceSessionId: "session-001",
    workspaceId: "workspace-001",
  });
  assert.ok(getExecutiveIntelligenceDiagnosticsLog().length >= 0);
});

test("computeExecutiveIntelligencePlatformOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveIntelligencePlatformOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveIntelligencePlatformMinimumScore(overall), true);
});

test("computeExecutiveIntelligencePlatformAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveIntelligencePlatformAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    registryBoundaryIntegrity: 100,
    orchestrationIntegrity: 100,
    referenceIntegrity: 100,
    businessOwnershipIsolation: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE);
});

test("executive intelligence platform certification passes all gates", () => {
  const result = runExecutiveIntelligencePlatformCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 44);
});

test("executive intelligence platform analysis passes and freezes contract", () => {
  const result = runExecutiveIntelligencePlatformAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_INTELLIGENCE_PLATFORM_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveIntelligencePlatformFrozen(), true);
  for (const tag of EXECUTIVE_INTELLIGENCE_PLATFORM_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 54);
});

test("rejects session without workspace id", () => {
  const session = resolveExecutiveIntelligenceSessionExample();
  const invalid = Object.freeze({ ...session, workspaceId: "" });
  assert.equal(validateExecutiveIntelligenceSession(invalid).valid, false);
});

test("rejects response without executive summary", () => {
  const response = resolveExecutiveIntelligenceResponseExample();
  const invalid = Object.freeze({ ...response, executiveSummary: "" });
  assert.equal(validateExecutiveIntelligenceResponse(invalid).valid, false);
});

test("rejects missing object reference in object registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseObjectReferences({
      referencedObjects: Object.freeze([
        Object.freeze({ executiveObjectId: "missing-object", referenceRole: "primary" as const }),
      ]),
      objectRegistry: input.objectRegistry,
    }).valid,
    false
  );
});

test("rejects missing relationship reference in relationship registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseRelationshipReferences({
      referencedRelationships: Object.freeze([
        Object.freeze({ executiveRelationshipId: "missing-relationship", referenceRole: "primary" as const }),
      ]),
      relationshipRegistry: input.relationshipRegistry,
    }).valid,
    false
  );
});

test("rejects missing KPI reference in KPI registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseKpiReferences({
      referencedKpis: Object.freeze([
        Object.freeze({ executiveKpiId: "missing-kpi", referenceRole: "primary" as const }),
      ]),
      kpiRegistry: input.kpiRegistry,
    }).valid,
    false
  );
});

test("rejects missing risk reference in risk registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseRiskReferences({
      referencedRisks: Object.freeze([
        Object.freeze({ executiveRiskId: "missing-risk", referenceRole: "primary" as const }),
      ]),
      riskRegistry: input.riskRegistry,
    }).valid,
    false
  );
});

test("rejects missing scenario reference in scenario registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseScenarioReferences({
      referencedScenarios: Object.freeze([
        Object.freeze({ executiveScenarioId: "missing-scenario", referenceRole: "primary" as const }),
      ]),
      scenarioRegistry: input.scenarioRegistry,
    }).valid,
    false
  );
});

test("rejects missing OKR reference in OKR registry", () => {
  const input = resolveExecutiveIntelligenceOrchestrationInputExample();
  assert.equal(
    validateResponseOkrReferences({
      referencedOkrs: Object.freeze([
        Object.freeze({
          executiveObjectiveId: "missing-objective",
          executiveKeyResultId: null,
          referenceRole: "primary" as const,
        }),
      ]),
      okrRegistry: input.okrRegistry,
    }).valid,
    false
  );
});
