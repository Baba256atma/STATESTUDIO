/**
 * INT-1.1 — Single Intelligence Source Gateway.
 * The one and only intelligence entry point for all presentation surfaces.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  buildIntelligenceConsumerDiagnostics,
  recordIntelligenceConsumerDiagnostics,
} from "./consumerDiagnosticsContract.ts";
import type {
  DashboardIntelligencePanelId,
  DashboardIntelligenceRefreshTrigger,
} from "./dashboardIntelligenceContract.ts";
import {
  refreshDashboardIntelligence,
  requestDashboardIntelligence,
} from "./dashboardIntelligenceRuntime.ts";
import {
  evaluateRuntimeAccessPolicy,
  toGatewayRejection,
} from "./runtimeAccessPolicy.ts";
import {
  SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
  SINGLE_INTELLIGENCE_SOURCE_TAGS,
  SINGLE_INTELLIGENCE_SOURCE_VERSION,
  type IntelligenceConsumerId,
  type IntelligenceGatewayContext,
  type IntelligenceGatewayRequest,
  type IntelligenceGatewayResponse,
  type IntelligenceGatewayResult,
} from "./singleIntelligenceSourceContract.ts";

let requestSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function nextRequestId(): string {
  requestSequence += 1;
  return `intel_req_${requestSequence}_${Date.now()}`;
}

export function buildIntelligenceGatewayRequest(input: {
  consumer: IntelligenceConsumerId;
  panel: DashboardIntelligencePanelId;
  workspaceId?: WorkspaceId | null;
  mode?: DashboardIntelligencePanelId;
  context?: Partial<IntelligenceGatewayContext>;
  selection?: Partial<IntelligenceGatewayRequest["selection"]>;
  bypassCache?: boolean;
  refreshTrigger?: DashboardIntelligenceRefreshTrigger | null;
}): IntelligenceGatewayRequest {
  return Object.freeze({
    requestId: nextRequestId(),
    consumer: input.consumer,
    workspaceId: input.workspaceId ?? null,
    panel: input.panel,
    mode: input.mode ?? input.panel,
    context: Object.freeze({
      selectionLabel: input.context?.selectionLabel ?? null,
      contextLabel: input.context?.contextLabel ?? null,
      metadata: Object.freeze(input.context?.metadata ?? {}),
    }),
    selection: Object.freeze({
      objectId: input.selection?.objectId ?? null,
      scenarioId: input.selection?.scenarioId ?? null,
      relationshipId: input.selection?.relationshipId ?? null,
      dataSourceId: input.selection?.dataSourceId ?? null,
    }),
    timestamp: nowIso(),
    bypassCache: input.bypassCache,
    refreshTrigger: input.refreshTrigger ?? null,
  });
}

export function requestIntelligence(
  input: IntelligenceGatewayRequest
): IntelligenceGatewayResult {
  const started = performance.now();
  const decision = evaluateRuntimeAccessPolicy({
    consumer: input.consumer,
    panel: input.panel,
    mode: input.mode,
  });

  if (!decision.allowed) {
    recordIntelligenceConsumerDiagnostics(
      buildIntelligenceConsumerDiagnostics({
        requestId: input.requestId,
        consumer: input.consumer,
        requestedMode: input.mode,
        requestedPanel: input.panel,
        runtimeSelected: null,
        normalizationCompleted: false,
        executionTimeMs: performance.now() - started,
        refreshTrigger: input.refreshTrigger,
        errorCode: decision.reason,
      })
    );
    return toGatewayRejection({
      requestId: input.requestId,
      consumer: input.consumer,
      decision,
    });
  }

  const runtimeResponse = requestDashboardIntelligence({
    panel: input.panel,
    workspaceId: input.workspaceId,
    objectId: input.selection.objectId,
    scenarioId: input.selection.scenarioId,
    relationshipId: input.selection.relationshipId,
    dataSourceId: input.selection.dataSourceId,
    selectionLabel: input.context.selectionLabel,
    bypassCache: input.bypassCache,
  });

  recordIntelligenceConsumerDiagnostics(
    buildIntelligenceConsumerDiagnostics({
      requestId: input.requestId,
      consumer: input.consumer,
      requestedMode: input.mode,
      requestedPanel: input.panel,
      runtimeSelected: runtimeResponse.engineId,
      normalizationCompleted: Boolean(runtimeResponse.snapshot?.payload.summary),
      executionTimeMs: performance.now() - started,
      refreshTrigger: input.refreshTrigger,
      errorCode: runtimeResponse.error.hasError ? runtimeResponse.error.code : null,
    })
  );

  return Object.freeze({
    contractVersion: SINGLE_INTELLIGENCE_SOURCE_VERSION,
    requestId: input.requestId,
    consumer: input.consumer,
    gatewaySource: SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
    runtimeResponse,
    generatedAt: nowIso(),
    tags: SINGLE_INTELLIGENCE_SOURCE_TAGS,
  }) satisfies IntelligenceGatewayResponse;
}

export function refreshIntelligence(input: {
  consumer: IntelligenceConsumerId;
  panel?: DashboardIntelligencePanelId;
  workspaceId?: WorkspaceId | null;
  objectId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  dataSourceId?: string | null;
  trigger: DashboardIntelligenceRefreshTrigger;
  bypassCache?: boolean;
}): IntelligenceGatewayResult {
  const request = buildIntelligenceGatewayRequest({
    consumer: input.consumer,
    panel: input.panel ?? "executive_summary",
    workspaceId: input.workspaceId,
    selection: {
      objectId: input.objectId ?? null,
      scenarioId: input.scenarioId ?? null,
      relationshipId: input.relationshipId ?? null,
      dataSourceId: input.dataSourceId ?? null,
    },
    bypassCache: input.bypassCache ?? true,
    refreshTrigger: input.trigger,
  });

  const decision = evaluateRuntimeAccessPolicy({
    consumer: input.consumer,
    panel: request.panel,
    mode: request.mode,
  });
  if (!decision.allowed) {
    return toGatewayRejection({
      requestId: request.requestId,
      consumer: input.consumer,
      decision,
    });
  }

  const runtimeResponse = refreshDashboardIntelligence({
    panel: request.panel,
    trigger: input.trigger,
    workspaceId: input.workspaceId,
    objectId: input.objectId,
    scenarioId: input.scenarioId,
    relationshipId: input.relationshipId,
    dataSourceId: input.dataSourceId,
    bypassCache: input.bypassCache ?? true,
  });

  recordIntelligenceConsumerDiagnostics(
    buildIntelligenceConsumerDiagnostics({
      requestId: request.requestId,
      consumer: input.consumer,
      requestedMode: request.mode,
      requestedPanel: request.panel,
      runtimeSelected: runtimeResponse.engineId,
      normalizationCompleted: Boolean(runtimeResponse.snapshot?.payload.summary),
      executionTimeMs: 0,
      refreshTrigger: input.trigger,
      errorCode: runtimeResponse.error.hasError ? runtimeResponse.error.code : null,
    })
  );

  return Object.freeze({
    contractVersion: SINGLE_INTELLIGENCE_SOURCE_VERSION,
    requestId: request.requestId,
    consumer: input.consumer,
    gatewaySource: SINGLE_INTELLIGENCE_GATEWAY_SOURCE,
    runtimeResponse,
    generatedAt: nowIso(),
    tags: SINGLE_INTELLIGENCE_SOURCE_TAGS,
  }) satisfies IntelligenceGatewayResponse;
}

export function resetSingleIntelligenceSourceGatewayForTests(): void {
  requestSequence = 0;
}

export const SingleIntelligenceSourceGateway = Object.freeze({
  buildIntelligenceGatewayRequest,
  requestIntelligence,
  refreshIntelligence,
  resetSingleIntelligenceSourceGatewayForTests,
});
