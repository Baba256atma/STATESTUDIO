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
  EXECUTIVE_DASHBOARD_FORBIDDEN_PATTERNS,
  EXECUTIVE_DASHBOARD_FREEZE_TAGS,
  EXECUTIVE_DASHBOARD_LIFECYCLE_STATES,
  EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_DASHBOARD_MUST_NOT_OWN,
  EXECUTIVE_DASHBOARD_PRESENTATION_STAGES,
  EXECUTIVE_DASHBOARD_SECTION_TYPES,
  EXECUTIVE_DASHBOARD_SELF_MANIFEST,
  EXECUTIVE_DASHBOARD_SOURCE,
  EXECUTIVE_DASHBOARD_TAGS,
  EXECUTIVE_DASHBOARD_VERSION,
  EXECUTIVE_DASHBOARD_WIDGET_TYPES,
  buildExecutiveDashboardOwnershipContract,
  composeExecutiveDashboardFromIntelligence,
  computeExecutiveDashboardAnalysisScore,
  computeExecutiveDashboardOverallScore,
  meetsExecutiveDashboardMinimumScore,
  resolveExecutiveDashboardContextExample,
  resolveExecutiveDashboardLayoutInputExample,
  resolveExecutiveDashboardRequestExample,
  resolveExecutiveDashboardResponseExample,
  resolveExecutiveDashboardSessionExample,
  validateEdiEipInputBoundary,
  validateEdiNoRenderingIntegrity,
  validateEdiPresentationStateIntegrity,
  validateEipIntelligenceInputCorrelation,
  validateExecutiveDashboardContext,
  validateExecutiveDashboardRequest,
  validateExecutiveDashboardResponse,
  validateExecutiveDashboardSection,
  validateExecutiveDashboardSession,
  validateExecutiveDashboardWidget,
  validateWidgetReferenceProjection,
} from "./executiveDashboardContract.ts";
import {
  isExecutiveDashboardFrozen,
  runExecutiveDashboardAnalysis,
  runExecutiveDashboardCertification,
} from "./executiveDashboardCertification.ts";
import {
  getExecutiveDashboardDiagnosticsLog,
  recordExecutiveDashboardDiagnostic,
  resetExecutiveDashboardDiagnosticsForTests,
} from "./executiveDashboardDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveDashboardDiagnosticsForTests();
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

test("exports dashboard version, section types, widget types, lifecycle, and tags", () => {
  assert.equal(EXECUTIVE_DASHBOARD_VERSION, "PHASE-11/EDI-1");
  assert.equal(EXECUTIVE_DASHBOARD_SECTION_TYPES.length, 9);
  assert.equal(EXECUTIVE_DASHBOARD_WIDGET_TYPES.length, 6);
  assert.equal(EXECUTIVE_DASHBOARD_LIFECYCLE_STATES.length, 6);
  assert.equal(EXECUTIVE_DASHBOARD_PRESENTATION_STAGES.length, 6);
  assert.ok(EXECUTIVE_DASHBOARD_TAGS.includes("[EDI_EXECUTIVE_DASHBOARD]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_DASHBOARD_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/executiveObject/executiveObjectContract.ts",
    "frontend/app/lib/executiveKpi/executiveKpiContract.ts",
    "frontend/app/lib/dashboardIntelligence/singleIntelligenceSourceGateway.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_DASHBOARD_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_DASHBOARD_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates dashboard session, request, response, and context examples", () => {
  const session = resolveExecutiveDashboardSessionExample();
  assert.equal(validateExecutiveDashboardSession(session).valid, true);
  assert.equal(session.lifecycleState, "available");
  assert.ok(session.widgetCount > 0);

  const request = resolveExecutiveDashboardRequestExample();
  assert.equal(validateExecutiveDashboardRequest(request).valid, true);
  assert.equal(request.requestedSections.length, 9);

  const response = resolveExecutiveDashboardResponseExample();
  assert.equal(validateExecutiveDashboardResponse(response).valid, true);
  assert.equal(response.sections.length, 9);

  const context = resolveExecutiveDashboardContextExample();
  assert.equal(validateExecutiveDashboardContext(context).valid, true);
  assert.equal(context.presentationState.selectedSection, "executive_summary");

  const ownership = buildExecutiveDashboardOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  assert.equal(ownership.mutationPolicy, "read-only-presentation-snapshot");
  assert.equal(ownership.upstreamAuthority, "phase-10-executive-intelligence-platform");
});

test("validates EIP boundary, no-rendering, and presentation state integrity", () => {
  assert.equal(validateEdiEipInputBoundary().valid, true);
  assert.equal(validateEdiNoRenderingIntegrity().valid, true);
  assert.equal(validateEdiPresentationStateIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("recommendation_generation"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("risk_scoring"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("scenario_simulation"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("okr_progress"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("dashboard_rendering"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("ui_implementation"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("registry_access"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("registry_caching"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("intelligence_cache"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("legacy_dashboard_intelligence_duplication"));
  assert.ok(EXECUTIVE_DASHBOARD_MUST_NOT_OWN.includes("business_entity_ownership"));
});

test("composes dashboard layout from EIP intelligence response", () => {
  const input = resolveExecutiveDashboardLayoutInputExample();
  const result = composeExecutiveDashboardFromIntelligence(input);
  assert.equal(result.success, true);
  assert.ok(result.session);
  assert.ok(result.response);
  assert.equal(result.response!.sections.length, 9);
  assert.equal(result.session!.intelligenceResponseId, input.intelligenceResponse.responseId);
  assert.equal(result.response!.source, EXECUTIVE_DASHBOARD_SOURCE);

  const executiveSummarySection = result.response!.sections.find(
    (section) => section.sectionType === "executive_summary"
  );
  assert.ok(executiveSummarySection);
  assert.ok(executiveSummarySection!.widgets.some((widget) => widget.widgetType === "summary_card"));
});

test("validates widget and section shapes", () => {
  const response = resolveExecutiveDashboardResponseExample();
  const section = response.sections[0];
  assert.equal(validateExecutiveDashboardSection(section).valid, true);
  const widget = section.widgets[0];
  assert.equal(validateExecutiveDashboardWidget(widget).valid, true);
});

test("validates widget reference projection against EIP response", () => {
  const input = resolveExecutiveDashboardLayoutInputExample();
  const result = composeExecutiveDashboardFromIntelligence(input);
  assert.equal(result.success, true);
  const widgets = result.response!.sections.flatMap((section) => section.widgets);
  const projection = validateWidgetReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    widgets,
  });
  assert.equal(projection.valid, true);
});

test("validates EIP intelligence input correlation", () => {
  const input = resolveExecutiveDashboardLayoutInputExample();
  const correlation = validateEipIntelligenceInputCorrelation({
    intelligenceResponse: input.intelligenceResponse,
    intelligenceSession: input.intelligenceSession,
    intelligenceContext: input.intelligenceContext,
  });
  assert.equal(correlation.valid, true);
});

test("accepts empty EIP reference scope for executive summary section", () => {
  const input = resolveExecutiveDashboardLayoutInputExample();
  const emptyResponse = Object.freeze({
    ...input.intelligenceResponse,
    executiveSummary: "Empty scope layout probe.",
    referencedObjects: Object.freeze([] as const),
    referencedRelationships: Object.freeze([] as const),
    referencedKpis: Object.freeze([] as const),
    referencedRisks: Object.freeze([] as const),
    referencedScenarios: Object.freeze([] as const),
    referencedOkrs: Object.freeze([] as const),
  });
  const result = composeExecutiveDashboardFromIntelligence({
    ...input,
    intelligenceResponse: emptyResponse,
    requestedSections: Object.freeze(["executive_summary"] as const),
    dashboardSessionId: "edi-test-empty-001",
  });
  assert.equal(result.success, true);
  assert.equal(result.response!.sections.length, 1);
});

test("rejects dashboard session with invalid contract version", () => {
  const session = resolveExecutiveDashboardSessionExample();
  const invalid = Object.freeze({ ...session, contractVersion: "INVALID" });
  assert.equal(validateExecutiveDashboardSession(invalid).valid, false);
});

test("rejects widget with unknown reference id not in EIP response", () => {
  const input = resolveExecutiveDashboardLayoutInputExample();
  const widget = Object.freeze({
    widgetId: "bad-widget",
    widgetType: "reference_list" as const,
    widgetTitle: "Bad",
    contentSource: "referenced_kpis" as const,
    referenceIds: Object.freeze(["unknown-kpi-id"]),
    displayHint: "list",
    metadata: resolveExecutiveDashboardResponseExample().metadata,
  });
  const projection = validateWidgetReferenceProjection({
    intelligenceResponse: input.intelligenceResponse,
    widgets: Object.freeze([widget]),
  });
  assert.equal(projection.valid, false);
});

test("records dashboard diagnostic events", () => {
  recordExecutiveDashboardDiagnostic({
    type: "DashboardSessionCreated",
    dashboardSessionId: "edi-diag-001",
    workspaceId: "ws-001",
    message: "Diagnostic probe.",
  });
  assert.ok(getExecutiveDashboardDiagnosticsLog().length > 0);
});

test("computeExecutiveDashboardOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveDashboardOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveDashboardMinimumScore(overall), true);
});

test("computeExecutiveDashboardAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveDashboardAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    eipInputBoundaryIntegrity: 100,
    presentationOnlyIntegrity: 100,
    layoutIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE);
});

test("executive dashboard certification passes all gates", () => {
  const result = runExecutiveDashboardCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.checks.length, 43);
});

test("executive dashboard analysis passes and freezes contract", () => {
  const result = runExecutiveDashboardAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_DASHBOARD_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveDashboardFrozen(), true);
  for (const tag of EXECUTIVE_DASHBOARD_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 53);
});
