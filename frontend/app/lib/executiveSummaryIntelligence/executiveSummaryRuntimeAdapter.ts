/**
 * INT-3 — Executive Summary Runtime Adapter.
 * Orchestrates Executive Time Context → Unified Context → Gateway → Response.
 */

import { INTELLIGENCE_CONTEXT_VERSION } from "../dashboardIntelligence/intelligenceContextContract.ts";
import { requestIntelligenceWithContext } from "../dashboardIntelligence/intelligenceContextGateway.ts";
import {
  EXECUTIVE_SUMMARY_CONSUMER,
  EXECUTIVE_SUMMARY_DEFAULT_MODE,
  EXECUTIVE_SUMMARY_DEFAULT_PANEL,
  EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  type BuildExecutiveSummaryIntelligenceInput,
  type ExecutiveSummaryIntelligenceRequest,
  type ExecutiveSummaryIntelligenceResult,
} from "./executiveSummaryIntelligenceContract.ts";
import {
  recordExecutiveSummaryDiagnostics,
  recordExecutiveSummaryEvent,
} from "./executiveSummaryDiagnostics.ts";
import { buildExecutiveSummaryIntelligenceRequest } from "./executiveSummaryRequestBuilder.ts";
import { buildExecutiveSummaryIntelligenceResponse } from "./executiveSummaryResponseBuilder.ts";
import { registerExecutiveSummaryResult } from "./executiveSummaryRegistry.ts";

function buildRejectedExecutiveSummaryRequest(
  input: BuildExecutiveSummaryIntelligenceInput
): ExecutiveSummaryIntelligenceRequest {
  return Object.freeze({
    contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
    summaryRequestId: `exec_sum_req_rejected_${Date.now()}`,
    requestId: `intel_req_rejected_${Date.now()}`,
    workspace: input.workspace ?? null,
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    panel: input.panel ?? EXECUTIVE_SUMMARY_DEFAULT_PANEL,
    dashboardMode: input.dashboardMode ?? EXECUTIVE_SUMMARY_DEFAULT_MODE,
    selection: Object.freeze({
      objectId: input.selection?.objectId ?? null,
      relationshipId: input.selection?.relationshipId ?? null,
      kpiId: input.selection?.kpiId ?? null,
      riskId: input.selection?.riskId ?? null,
      scenarioId: input.selection?.scenarioId ?? null,
      dataSourceId: input.selection?.dataSourceId ?? null,
    }),
    executiveTime: Object.freeze({ timeState: input.executiveTime?.timeState ?? "now" }),
    intelligenceContext: null,
    executiveTimeContext: null,
    timestamp: new Date().toISOString(),
    source: EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  });
}

export function requestExecutiveSummaryIntelligence(
  input: BuildExecutiveSummaryIntelligenceInput = Object.freeze({})
): ExecutiveSummaryIntelligenceResult {
  const runtimeStarted = performance.now();
  const requestBuild = buildExecutiveSummaryIntelligenceRequest(input);

  if (!requestBuild.success || !requestBuild.request) {
    recordExecutiveSummaryEvent({ type: "ExecutiveSummaryRequestRejected" });
    const rejectedRequest = buildRejectedExecutiveSummaryRequest(input);
    const failedResponse = buildExecutiveSummaryIntelligenceResponse({
      request: rejectedRequest,
      gateway: null,
    });
    return Object.freeze({
      request: rejectedRequest,
      response: failedResponse,
      gatewaySuccess: false,
    });
  }

  recordExecutiveSummaryEvent({
    type: "ExecutiveSummaryRequestBuilt",
    summaryRequestId: requestBuild.request.summaryRequestId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });
  recordExecutiveSummaryEvent({
    type: "ExecutiveSummaryContextAdapted",
    summaryRequestId: requestBuild.request.summaryRequestId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const gatewayStarted = performance.now();
  const gateway = requestIntelligenceWithContext({
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    workspace: requestBuild.request.workspace,
    panel: requestBuild.request.panel,
    dashboardMode: requestBuild.request.dashboardMode,
    selectedObject: requestBuild.request.selection.objectId,
    selectedRelationship: requestBuild.request.selection.relationshipId,
    selectedKpi: requestBuild.request.selection.kpiId,
    selectedRisk: requestBuild.request.selection.riskId,
    selectedScenario: requestBuild.request.selection.scenarioId,
    selectedDataSource: requestBuild.request.selection.dataSourceId,
    executiveTime: requestBuild.request.executiveTime,
    timelinePosition: requestBuild.request.executiveTimeContext?.timelinePosition ?? null,
    filters: requestBuild.request.intelligenceContext?.filters ?? Object.freeze({}),
    viewMode: requestBuild.request.intelligenceContext?.viewMode ?? "overview",
    selectionPath: requestBuild.request.intelligenceContext?.selectionPath ?? Object.freeze([]),
  });
  const gatewayDurationMs = performance.now() - gatewayStarted;

  recordExecutiveSummaryEvent({
    type: "ExecutiveSummaryGatewayRequested",
    summaryRequestId: requestBuild.request.summaryRequestId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const summaryStarted = performance.now();
  const response = buildExecutiveSummaryIntelligenceResponse({
    request: requestBuild.request,
    gateway: gateway.gateway,
  });
  const summaryGenerationDurationMs = performance.now() - summaryStarted;

  registerExecutiveSummaryResult({
    request: requestBuild.request,
    response,
  });

  recordExecutiveSummaryEvent({
    type: "ExecutiveSummaryResponseBuilt",
    summaryRequestId: requestBuild.request.summaryRequestId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  recordExecutiveSummaryDiagnostics(
    Object.freeze({
      summaryRequestId: requestBuild.request.summaryRequestId,
      consumer: EXECUTIVE_SUMMARY_CONSUMER,
      workspace: requestBuild.request.workspace,
      contextVersion:
        requestBuild.request.intelligenceContext?.contractVersion ?? INTELLIGENCE_CONTEXT_VERSION,
      timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
      runtimeDurationMs: performance.now() - runtimeStarted,
      gatewayDurationMs,
      summaryGenerationDurationMs,
      errorCode: response.success ? null : response.reason,
      generatedAt: new Date().toISOString(),
    })
  );

  return Object.freeze({
    request: requestBuild.request,
    response,
    gatewaySuccess: Boolean(gateway.gateway && "runtimeResponse" in gateway.gateway),
  });
}

export const ExecutiveSummaryRuntimeAdapter = Object.freeze({
  requestExecutiveSummaryIntelligence,
});
