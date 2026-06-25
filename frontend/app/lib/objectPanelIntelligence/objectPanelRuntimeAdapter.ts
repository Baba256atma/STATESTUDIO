/**
 * INT-4 — Object Panel Runtime Adapter.
 * Orchestrates object selection → Executive Time Context → Unified Context → Gateway → Response.
 */

import { INTELLIGENCE_CONTEXT_VERSION } from "../dashboardIntelligence/intelligenceContextContract.ts";
import { requestIntelligenceWithContext } from "../dashboardIntelligence/intelligenceContextGateway.ts";
import {
  OBJECT_PANEL_CONSUMER,
  OBJECT_PANEL_DEFAULT_MODE,
  OBJECT_PANEL_DEFAULT_PANEL,
  OBJECT_PANEL_INTELLIGENCE_SOURCE,
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  type BuildObjectPanelIntelligenceInput,
  type ObjectPanelIntelligenceRequest,
  type ObjectPanelIntelligenceResult,
} from "./objectPanelIntelligenceContract.ts";
import {
  recordObjectPanelDiagnostics,
  recordObjectPanelEvent,
} from "./objectPanelDiagnostics.ts";
import { buildObjectPanelIntelligenceRequest } from "./objectPanelRequestBuilder.ts";
import { buildObjectPanelIntelligenceResponse } from "./objectPanelResponseBuilder.ts";
import { registerObjectPanelResult } from "./objectPanelRegistry.ts";

function buildRejectedObjectPanelRequest(
  input: BuildObjectPanelIntelligenceInput
): ObjectPanelIntelligenceRequest {
  const objectId = input.selectedObjectId ?? input.selection?.objectId ?? null;
  return Object.freeze({
    contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
    objectPanelRequestId: `obj_panel_req_rejected_${Date.now()}`,
    requestId: `intel_req_rejected_${Date.now()}`,
    workspace: input.workspace ?? null,
    selectedObjectId: objectId,
    consumer: OBJECT_PANEL_CONSUMER,
    panel: input.panel ?? OBJECT_PANEL_DEFAULT_PANEL,
    dashboardMode: input.dashboardMode ?? OBJECT_PANEL_DEFAULT_MODE,
    selection: Object.freeze({
      objectId,
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
    source: OBJECT_PANEL_INTELLIGENCE_SOURCE,
  });
}

export function requestObjectPanelIntelligence(
  input: BuildObjectPanelIntelligenceInput
): ObjectPanelIntelligenceResult {
  const runtimeStarted = performance.now();
  const requestBuild = buildObjectPanelIntelligenceRequest(input);

  if (!requestBuild.success || !requestBuild.request) {
    recordObjectPanelEvent({
      type: "ObjectPanelRequestRejected",
      selectedObjectId: input.selectedObjectId ?? input.selection?.objectId ?? null,
    });
    const rejectedRequest = buildRejectedObjectPanelRequest(input);
    const failedResponse = buildObjectPanelIntelligenceResponse({
      request: rejectedRequest,
      gateway: null,
    });
    return Object.freeze({
      request: rejectedRequest,
      response: failedResponse,
      gatewaySuccess: false,
      selectionChanged: false,
    });
  }

  recordObjectPanelEvent({
    type: "ObjectPanelRequestBuilt",
    objectPanelRequestId: requestBuild.request.objectPanelRequestId,
    selectedObjectId: requestBuild.request.selectedObjectId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });
  recordObjectPanelEvent({
    type: "ObjectPanelContextAdapted",
    objectPanelRequestId: requestBuild.request.objectPanelRequestId,
    selectedObjectId: requestBuild.request.selectedObjectId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const gatewayStarted = performance.now();
  const gateway = requestIntelligenceWithContext({
    consumer: OBJECT_PANEL_CONSUMER,
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
    viewMode: requestBuild.request.intelligenceContext?.viewMode ?? "focus",
    selectionPath: requestBuild.request.intelligenceContext?.selectionPath ?? Object.freeze([]),
  });
  const gatewayDurationMs = performance.now() - gatewayStarted;

  recordObjectPanelEvent({
    type: "ObjectPanelGatewayRequested",
    objectPanelRequestId: requestBuild.request.objectPanelRequestId,
    selectedObjectId: requestBuild.request.selectedObjectId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  const responseStarted = performance.now();
  const response = buildObjectPanelIntelligenceResponse({
    request: requestBuild.request,
    gateway: gateway.gateway,
  });
  const responseDurationMs = performance.now() - responseStarted;

  const selectionChanged = registerObjectPanelResult({
    request: requestBuild.request,
    response,
  });

  if (selectionChanged) {
    recordObjectPanelEvent({
      type: "ObjectPanelSelectionChanged",
      objectPanelRequestId: requestBuild.request.objectPanelRequestId,
      selectedObjectId: requestBuild.request.selectedObjectId,
      timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
    });
  }

  recordObjectPanelEvent({
    type: "ObjectPanelResponseBuilt",
    objectPanelRequestId: requestBuild.request.objectPanelRequestId,
    selectedObjectId: requestBuild.request.selectedObjectId,
    timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
  });

  recordObjectPanelDiagnostics(
    Object.freeze({
      objectPanelRequestId: requestBuild.request.objectPanelRequestId,
      selectedObjectId: requestBuild.request.selectedObjectId,
      consumer: OBJECT_PANEL_CONSUMER,
      workspace: requestBuild.request.workspace,
      contextVersion:
        requestBuild.request.intelligenceContext?.contractVersion ?? INTELLIGENCE_CONTEXT_VERSION,
      timeState: requestBuild.request.executiveTimeContext?.timeState ?? null,
      runtimeDurationMs: performance.now() - runtimeStarted,
      gatewayDurationMs,
      responseDurationMs,
      selectionChanged,
      errorCode: response.success ? null : response.reason,
      generatedAt: new Date().toISOString(),
    })
  );

  return Object.freeze({
    request: requestBuild.request,
    response,
    gatewaySuccess: Boolean(gateway.gateway && "runtimeResponse" in gateway.gateway),
    selectionChanged,
  });
}

export const ObjectPanelRuntimeAdapter = Object.freeze({
  requestObjectPanelIntelligence,
});
