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
import { runExecutiveDashboardAnalysis } from "../executiveDashboard/executiveDashboardCertification.ts";
import { runExecutiveAssistantAnalysis } from "../executiveAssistant/executiveAssistantCertification.ts";
import { resolveExecutiveDashboardResponseExample } from "../executiveDashboard/executiveDashboardContract.ts";
import { resolveExecutiveAssistantResponseExample } from "../executiveAssistant/executiveAssistantContract.ts";
import {
  PRESENTATION_ADAPTER_FORBIDDEN_PATTERNS,
  PRESENTATION_ADAPTER_FREEZE_TAGS,
  PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE,
  PRESENTATION_ADAPTER_MUST_NOT_OWN,
  PRESENTATION_ADAPTER_SELF_MANIFEST,
  PRESENTATION_ADAPTER_SOURCE,
  PRESENTATION_ADAPTER_TAGS,
  PRESENTATION_ADAPTER_UI_EVENT_TYPES,
  PRESENTATION_ADAPTER_VERSION,
  applyPresentationAdapterLocalStateUpdate,
  computePresentationAdapterAnalysisScore,
  computePresentationAdapterOverallScore,
  defaultPresentationAdapterLocalUiState,
  mapExecutiveAssistantToChatProps,
  mapExecutiveDashboardToPresentationProps,
  mapUiInteractionToAdapterEvent,
  meetsPresentationAdapterMinimumScore,
  resolvePresentationAdapterAssistantChatPropsExample,
  resolvePresentationAdapterDashboardPropsExample,
  resolvePresentationAdapterUiEventExample,
  validatePaDumbAdapterIntegrity,
  validatePaEaiInputBoundary,
  validatePaEdiInputBoundary,
  validatePaLocalStateSafety,
  validatePresentationAdapterAssistantChatProps,
  validatePresentationAdapterDashboardProps,
  validatePresentationAdapterLocalUiState,
  validatePresentationAdapterUiEvent,
} from "./presentationAdapterContract.ts";
import {
  isPresentationAdapterFrozen,
  runPresentationAdapterAnalysis,
  runPresentationAdapterCertification,
} from "./presentationAdapterCertification.ts";
import {
  getPresentationAdapterDiagnosticsLog,
  recordPresentationAdapterDiagnostic,
  resetPresentationAdapterDiagnosticsForTests,
} from "./presentationAdapterDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetPresentationAdapterDiagnosticsForTests();
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
  runExecutiveDashboardAnalysis();
  runExecutiveAssistantAnalysis();
});

test("exports adapter version, UI event types, and tags", () => {
  assert.equal(PRESENTATION_ADAPTER_VERSION, "PHASE-13/PA-1");
  assert.equal(PRESENTATION_ADAPTER_UI_EVENT_TYPES.length, 7);
  assert.ok(PRESENTATION_ADAPTER_TAGS.includes("[PA_PRESENTATION_ADAPTER]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(PRESENTATION_ADAPTER_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/executiveIntelligencePlatform/executiveIntelligencePlatformContract.ts",
    "frontend/app/lib/executiveObject/executiveObjectContract.ts",
    "frontend/app/lib/assistantIntelligence/assistantResponseBuilder.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: PRESENTATION_ADAPTER_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: PRESENTATION_ADAPTER_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates dashboard props, assistant props, UI event, and local state examples", () => {
  const dashboardProps = resolvePresentationAdapterDashboardPropsExample();
  assert.equal(validatePresentationAdapterDashboardProps(dashboardProps).valid, true);
  assert.ok(dashboardProps.sections.length > 0);

  const assistantProps = resolvePresentationAdapterAssistantChatPropsExample();
  assert.equal(validatePresentationAdapterAssistantChatProps(assistantProps).valid, true);
  assert.equal(assistantProps.messages[0]?.role, "assistant");

  const uiEvent = resolvePresentationAdapterUiEventExample();
  assert.equal(validatePresentationAdapterUiEvent(uiEvent).valid, true);

  const localState = defaultPresentationAdapterLocalUiState();
  assert.equal(validatePresentationAdapterLocalUiState(localState).valid, true);
});

test("validates EDI/EAI boundaries and dumb adapter integrity", () => {
  assert.equal(validatePaEdiInputBoundary().valid, true);
  assert.equal(validatePaEaiInputBoundary().valid, true);
  assert.equal(validatePaDumbAdapterIntegrity().valid, true);
  assert.equal(validatePaLocalStateSafety().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("eip_direct_execution"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("registry_access"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("llm_runtime"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("persistence"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("edi_mutation"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("eai_mutation"));
  assert.ok(PRESENTATION_ADAPTER_MUST_NOT_OWN.includes("ui_implementation"));
});

test("maps EDI dashboard response to presentation props", () => {
  const dashboardResponse = resolveExecutiveDashboardResponseExample();
  const result = mapExecutiveDashboardToPresentationProps({ dashboardResponse });
  assert.equal(result.success, true);
  assert.ok(result.props);
  assert.equal(result.props!.source, PRESENTATION_ADAPTER_SOURCE);
  assert.equal(result.props!.dashboardResponseId, dashboardResponse.responseId);
  assert.equal(result.props!.sections.length, dashboardResponse.sections.length);
});

test("maps EAI assistant response to chat props", () => {
  const assistantResponse = resolveExecutiveAssistantResponseExample();
  const result = mapExecutiveAssistantToChatProps({ assistantResponse });
  assert.equal(result.success, true);
  assert.ok(result.props);
  assert.equal(result.props!.assistantResponseId, assistantResponse.responseId);
  assert.ok(result.props!.messages[0]!.text.includes(assistantResponse.explanation.explanationText.slice(0, 20)));
});

test("maps UI interaction to adapter event", () => {
  const result = mapUiInteractionToAdapterEvent({
    eventType: "section_selected",
    targetId: "executive_summary",
    workspaceId: "ws-test-001",
  });
  assert.equal(result.success, true);
  assert.equal(result.props!.eventType, "section_selected");
});

test("applies local UI state update", () => {
  const current = defaultPresentationAdapterLocalUiState();
  const result = applyPresentationAdapterLocalStateUpdate({
    current,
    patch: { selectedSection: "kpi_overview", activeWidgetId: "widget-001" },
  });
  assert.equal(result.success, true);
  assert.equal(result.props!.selectedSection, "kpi_overview");
  assert.equal(result.props!.activeWidgetId, "widget-001");
});

test("rejects dashboard props with invalid contract version", () => {
  const props = resolvePresentationAdapterDashboardPropsExample();
  const invalid = Object.freeze({ ...props, contractVersion: "INVALID" });
  assert.equal(validatePresentationAdapterDashboardProps(invalid).valid, false);
});

test("rejects local state with forbidden cache keys", () => {
  const invalid = Object.freeze({
    ...defaultPresentationAdapterLocalUiState(),
    intelligenceCache: Object.freeze({}),
  });
  assert.equal(validatePresentationAdapterLocalUiState(invalid).valid, false);
});

test("records adapter diagnostic events", () => {
  recordPresentationAdapterDiagnostic({
    type: "AdapterInitialized",
    adapterId: "pa-diag-001",
    message: "Diagnostic probe.",
  });
  assert.ok(getPresentationAdapterDiagnosticsLog().length > 0);
});

test("computePresentationAdapterOverallScore meets minimum when dimensions are strong", () => {
  const overall = computePresentationAdapterOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsPresentationAdapterMinimumScore(overall), true);
});

test("presentation adapter certification passes all gates", () => {
  const result = runPresentationAdapterCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 44);
});

test("computePresentationAdapterAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computePresentationAdapterAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    inputBoundaryIntegrity: 100,
    mappingIntegrity: 100,
    presentationStateSafety: 100,
    reactIndependence: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE);
});

test("presentation adapter analysis passes and freezes contract", () => {
  const result = runPresentationAdapterAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= PRESENTATION_ADAPTER_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isPresentationAdapterFrozen(), true);
  for (const tag of PRESENTATION_ADAPTER_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 55);
});
