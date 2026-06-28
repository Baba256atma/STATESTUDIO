import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import { runExecutiveModelRuntimeAnalysis } from "../executiveModelRuntime/executiveModelRuntimeCertification.ts";
import { runExecutiveObjectIntegrationAnalysis } from "../executiveObject/executiveObjectCertification.ts";
import { runExecutiveKpiIntegrationAnalysis } from "../executiveKpi/executiveKpiCertification.ts";
import { runExecutiveOkrIntegrationAnalysis } from "../executiveOkr/executiveOkrCertification.ts";
import { runExecutiveRelationshipIntegrationAnalysis } from "../executiveRelationship/executiveRelationshipCertification.ts";
import { runExecutiveRiskIntegrationAnalysis } from "../executiveRisk/executiveRiskCertification.ts";
import { runExecutiveScenarioIntegrationAnalysis } from "../executiveScenario/executiveScenarioCertification.ts";
import { runExecutiveIntelligencePlatformAnalysis } from "../executiveIntelligencePlatform/executiveIntelligencePlatformCertification.ts";
import {
  EXECUTIVE_ASSISTANT_EXPLANATION_STAGES,
  EXECUTIVE_ASSISTANT_FORBIDDEN_PATTERNS,
  EXECUTIVE_ASSISTANT_FREEZE_TAGS,
  EXECUTIVE_ASSISTANT_LIFECYCLE_STATES,
  EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_ASSISTANT_MUST_NOT_OWN,
  EXECUTIVE_ASSISTANT_REQUEST_TYPES,
  EXECUTIVE_ASSISTANT_SELF_MANIFEST,
  EXECUTIVE_ASSISTANT_SOURCE,
  EXECUTIVE_ASSISTANT_TAGS,
  EXECUTIVE_ASSISTANT_VERSION,
  buildExecutiveAssistantOwnershipContract,
  composeExecutiveAssistantExplanationFromIntelligence,
  computeExecutiveAssistantAnalysisScore,
  computeExecutiveAssistantOverallScore,
  meetsExecutiveAssistantMinimumScore,
  resolveExecutiveAssistantContextExample,
  resolveExecutiveAssistantExplanationInputExample,
  resolveExecutiveAssistantRequestExample,
  resolveExecutiveAssistantResponseExample,
  resolveExecutiveAssistantSessionExample,
  validateEaiConversationStateIntegrity,
  validateEaiEipInputBoundary,
  validateEaiExplanationOnlyIntegrity,
  validateEipIntelligenceInputCorrelation,
  validateExecutiveAssistantContext,
  validateExecutiveAssistantExplanation,
  validateExecutiveAssistantRequest,
  validateExecutiveAssistantResponse,
  validateExecutiveAssistantSession,
  validateExplanationReferenceProjection,
} from "./executiveAssistantContract.ts";
import {
  isExecutiveAssistantFrozen,
  runExecutiveAssistantAnalysis,
  runExecutiveAssistantCertification,
} from "./executiveAssistantCertification.ts";
import {
  getExecutiveAssistantDiagnosticsLog,
  recordExecutiveAssistantDiagnostic,
  resetExecutiveAssistantDiagnosticsForTests,
} from "./executiveAssistantDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveAssistantDiagnosticsForTests();
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
  runExecutiveIntelligencePlatformAnalysis();
});

test("exports assistant version, request types, lifecycle, and tags", () => {
  assert.equal(EXECUTIVE_ASSISTANT_VERSION, "PHASE-12/EAI-1");
  assert.equal(EXECUTIVE_ASSISTANT_REQUEST_TYPES.length, 9);
  assert.equal(EXECUTIVE_ASSISTANT_LIFECYCLE_STATES.length, 6);
  assert.equal(EXECUTIVE_ASSISTANT_EXPLANATION_STAGES.length, 6);
  assert.ok(EXECUTIVE_ASSISTANT_TAGS.includes("[EAI_EXECUTIVE_ASSISTANT]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_ASSISTANT_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/executiveObject/executiveObjectContract.ts",
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/assistantIntelligence/assistantResponseBuilder.ts",
    "frontend/app/lib/assistant/assistantRuntimeAdapter.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_ASSISTANT_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_ASSISTANT_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates assistant session, request, response, and context examples", () => {
  const session = resolveExecutiveAssistantSessionExample();
  assert.equal(validateExecutiveAssistantSession(session).valid, true);
  assert.equal(session.lifecycleState, "available");
  assert.equal(session.requestTypesUsed[0], "explain_summary");

  const request = resolveExecutiveAssistantRequestExample();
  assert.equal(validateExecutiveAssistantRequest(request).valid, true);
  assert.equal(request.requestType, "explain_summary");

  const response = resolveExecutiveAssistantResponseExample();
  assert.equal(validateExecutiveAssistantResponse(response).valid, true);
  assert.ok(response.explanation.explanationText.length > 0);

  const context = resolveExecutiveAssistantContextExample();
  assert.equal(validateExecutiveAssistantContext(context).valid, true);
  assert.equal(context.conversationState.selectedTopic, "explain_summary");

  const ownership = buildExecutiveAssistantOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  assert.equal(ownership.mutationPolicy, "read-only-explanation-snapshot");
});

test("validates EIP boundary, explanation-only, and conversation state integrity", () => {
  assert.equal(validateEaiEipInputBoundary().valid, true);
  assert.equal(validateEaiExplanationOnlyIntegrity().valid, true);
  assert.equal(validateEaiConversationStateIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("llm_inference"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("llm_runtime"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("recommendation_generation"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("registry_access"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("explanation_cache"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("intelligence_cache"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("dashboard_layout_composition"));
  assert.ok(EXECUTIVE_ASSISTANT_MUST_NOT_OWN.includes("intelligence_creation"));
});

test("composes assistant explanation from EIP intelligence response", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const result = composeExecutiveAssistantExplanationFromIntelligence(input);
  assert.equal(result.success, true);
  assert.ok(result.session);
  assert.ok(result.response);
  assert.equal(result.session!.intelligenceResponseId, input.intelligenceResponse.responseId);
  assert.equal(result.response!.source, EXECUTIVE_ASSISTANT_SOURCE);
  assert.equal(result.response!.explanation.explanationScope, "explain_summary");
});

test("composes scoped explanation for explain_object request type", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const objectId = input.intelligenceResponse.referencedObjects[0]?.executiveObjectId;
  assert.ok(objectId);
  const result = composeExecutiveAssistantExplanationFromIntelligence({
    ...input,
    requestType: "explain_object",
    targetReferenceId: objectId,
    assistantSessionId: "eai-test-object-001",
  });
  assert.equal(result.success, true);
  assert.equal(result.response!.explanation.referenceKind, "object");
  assert.ok(result.response!.explanation.identityReferences.includes(objectId!));
});

test("validates explanation model shape", () => {
  const response = resolveExecutiveAssistantResponseExample();
  assert.equal(validateExecutiveAssistantExplanation(response.explanation).valid, true);
});

test("validates explanation reference projection against EIP response", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const result = composeExecutiveAssistantExplanationFromIntelligence(input);
  assert.equal(result.success, true);
  const projection = validateExplanationReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    explanation: result.response!.explanation,
  });
  assert.equal(projection.valid, true);
});

test("validates EIP intelligence input correlation", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const correlation = validateEipIntelligenceInputCorrelation({
    intelligenceResponse: input.intelligenceResponse,
    intelligenceSession: input.intelligenceSession,
    intelligenceContext: input.intelligenceContext,
  });
  assert.equal(correlation.valid, true);
});

test("accepts empty EIP reference scope for explain_summary", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const emptyResponse = Object.freeze({
    ...input.intelligenceResponse,
    executiveSummary: "Empty scope explanation probe.",
    referencedObjects: Object.freeze([] as const),
    referencedRelationships: Object.freeze([] as const),
    referencedKpis: Object.freeze([] as const),
    referencedRisks: Object.freeze([] as const),
    referencedScenarios: Object.freeze([] as const),
    referencedOkrs: Object.freeze([] as const),
  });
  const result = composeExecutiveAssistantExplanationFromIntelligence({
    ...input,
    intelligenceResponse: emptyResponse,
    requestType: "explain_summary",
    assistantSessionId: "eai-test-empty-001",
  });
  assert.equal(result.success, true);
  assert.ok(result.response!.explanation.explanationText.includes("Empty scope"));
});

test("rejects assistant session with invalid contract version", () => {
  const session = resolveExecutiveAssistantSessionExample();
  const invalid = Object.freeze({ ...session, contractVersion: "INVALID" });
  assert.equal(validateExecutiveAssistantSession(invalid).valid, false);
});

test("rejects explanation with unknown reference id not in EIP response", () => {
  const input = resolveExecutiveAssistantExplanationInputExample();
  const explanation = Object.freeze({
    ...resolveExecutiveAssistantResponseExample().explanation,
    identityReferences: Object.freeze(["unknown-ref-id"]),
  });
  const projection = validateExplanationReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    explanation,
  });
  assert.equal(projection.valid, false);
});

test("records assistant diagnostic events", () => {
  recordExecutiveAssistantDiagnostic({
    type: "AssistantSessionCreated",
    assistantSessionId: "eai-diag-001",
    workspaceId: "ws-001",
    message: "Diagnostic probe.",
  });
  assert.ok(getExecutiveAssistantDiagnosticsLog().length > 0);
});

test("computeExecutiveAssistantOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveAssistantOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveAssistantMinimumScore(overall), true);
});

test("computeExecutiveAssistantAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveAssistantAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    eipInputBoundaryIntegrity: 100,
    conversationOnlyIntegrity: 100,
    explanationIntegrity: 100,
    conversationMetadataSafety: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE);
});

test("executive assistant certification passes all gates", () => {
  const result = runExecutiveAssistantCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 43);
});

test("executive assistant analysis passes and freezes contract", () => {
  const result = runExecutiveAssistantAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_ASSISTANT_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveAssistantFrozen(), true);
  for (const tag of EXECUTIVE_ASSISTANT_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 54);
});
