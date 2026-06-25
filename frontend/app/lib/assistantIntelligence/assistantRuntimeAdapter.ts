/**
 * INT-2 — Assistant Runtime Adapter.
 * Orchestrates Executive Time Context → Unified Context → Gateway → Response.
 */

import { INTELLIGENCE_CONTEXT_VERSION } from "../dashboardIntelligence/intelligenceContextContract.ts";
import { requestIntelligenceWithContext } from "../dashboardIntelligence/intelligenceContextGateway.ts";
import {
  ASSISTANT_INTELLIGENCE_CONSUMER,
  ASSISTANT_INTELLIGENCE_SOURCE,
  ASSISTANT_INTELLIGENCE_VERSION,
  ASSISTANT_REQUEST_PANEL_MAP,
  type AssistantIntelligenceRequest,
  type AssistantIntelligenceResult,
  type BuildAssistantIntelligenceInput,
} from "./assistantIntelligenceContract.ts";
import {
  recordAssistantIntelligenceDiagnostics,
  recordAssistantIntelligenceEvent,
} from "./assistantDiagnostics.ts";
import { buildAssistantIntelligenceRequest } from "./assistantRequestBuilder.ts";
import { buildAssistantIntelligenceResponse } from "./assistantResponseBuilder.ts";
import { registerAssistantRuntimeResult } from "./assistantRuntimeRegistry.ts";

function buildRejectedAssistantRequest(
  input: BuildAssistantIntelligenceInput
): AssistantIntelligenceRequest {
  return Object.freeze({
    contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
    assistantRequestId: `asst_req_rejected_${Date.now()}`,
    conversationId: input.conversationId?.trim() || "asst_conv_rejected",
    requestId: `intel_req_rejected_${Date.now()}`,
    requestType: input.requestType,
    managerPhrase: input.managerPhrase ?? null,
    workspace: input.workspace ?? null,
    consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
    panel: input.panel ?? ASSISTANT_REQUEST_PANEL_MAP[input.requestType],
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
    source: ASSISTANT_INTELLIGENCE_SOURCE,
  });
}

export function requestAssistantIntelligence(
  input: BuildAssistantIntelligenceInput
): AssistantIntelligenceResult {
  const runtimeStarted = performance.now();
  const requestBuild = buildAssistantIntelligenceRequest(input);

  if (!requestBuild.success || !requestBuild.request) {
    recordAssistantIntelligenceEvent({
      type: "AssistantRequestRejected",
      requestType: input.requestType,
    });
    const rejectedRequest = buildRejectedAssistantRequest(input);
    const failedResponse = buildAssistantIntelligenceResponse({
      request: rejectedRequest,
      gateway: null,
    });
    return Object.freeze({
      request: rejectedRequest,
      response: failedResponse,
      gatewaySuccess: false,
    });
  }

  recordAssistantIntelligenceEvent({
    type: "AssistantRequestBuilt",
    assistantRequestId: requestBuild.request.assistantRequestId,
    requestType: requestBuild.request.requestType,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });
  recordAssistantIntelligenceEvent({
    type: "AssistantContextAdapted",
    assistantRequestId: requestBuild.request.assistantRequestId,
    requestType: requestBuild.request.requestType,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const gatewayStarted = performance.now();
  const gateway = requestIntelligenceWithContext({
    consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
    workspace: requestBuild.request.workspace,
    panel: requestBuild.request.panel,
    dashboardMode: requestBuild.request.panel,
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

  recordAssistantIntelligenceEvent({
    type: "AssistantGatewayRequested",
    assistantRequestId: requestBuild.request.assistantRequestId,
    requestType: requestBuild.request.requestType,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const responseStarted = performance.now();
  const response = buildAssistantIntelligenceResponse({
    request: requestBuild.request,
    gateway: gateway.gateway,
  });
  const responseDurationMs = performance.now() - responseStarted;

  registerAssistantRuntimeResult({
    request: requestBuild.request,
    response,
  });

  recordAssistantIntelligenceEvent({
    type: "AssistantResponseBuilt",
    assistantRequestId: requestBuild.request.assistantRequestId,
    requestType: requestBuild.request.requestType,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  recordAssistantIntelligenceDiagnostics(
    Object.freeze({
      assistantRequestId: requestBuild.request.assistantRequestId,
      conversationId: requestBuild.request.conversationId,
      consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
      workspace: requestBuild.request.workspace,
      requestType: requestBuild.request.requestType,
      contextVersion: requestBuild.request.intelligenceContext?.contractVersion ?? INTELLIGENCE_CONTEXT_VERSION,
      timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
      runtimeDurationMs: performance.now() - runtimeStarted,
      gatewayDurationMs,
      responseDurationMs,
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

export const AssistantRuntimeAdapter = Object.freeze({
  requestAssistantIntelligence,
});
