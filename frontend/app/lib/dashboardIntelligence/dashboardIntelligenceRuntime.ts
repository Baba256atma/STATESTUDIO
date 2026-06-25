/**
 * INT-1 — Dashboard Intelligence runtime.
 * Unified request API for dashboard panels — route, normalize, cache, diagnose.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  buildDashboardIntelligenceCacheKey,
  createInMemoryDashboardIntelligenceCacheStore,
  type DashboardIntelligenceCacheStore,
} from "./dashboardIntelligenceCacheContract.ts";
import {
  DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
  DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
  DASHBOARD_INTELLIGENCE_MODES,
  type DashboardIntelligencePanelId,
  type DashboardIntelligenceRefreshTrigger,
  type DashboardIntelligenceRequest,
  type DashboardIntelligenceRefreshRequest,
  type DashboardIntelligenceResponse,
} from "./dashboardIntelligenceContract.ts";
import {
  buildDashboardIntelligenceDiagnostics,
  emitDashboardIntelligenceDiagnostic,
  recordDashboardIntelligenceEvent,
} from "./dashboardIntelligenceDiagnostics.ts";
import {
  normalizeDashboardIntelligenceError,
  normalizeDashboardIntelligencePayload,
} from "./dashboardIntelligenceNormalization.ts";
import {
  getDashboardIntelligencePanelRegistration,
  resolveDashboardIntelligenceEngineId,
  setDashboardIntelligenceRuntimeStatus,
} from "./dashboardIntelligenceRegistry.ts";
import { routeDashboardIntelligenceRequest } from "./dashboardIntelligenceRouter.ts";
import {
  buildDashboardIntelligencePanelContext,
  updateDashboardIntelligenceSession,
} from "./dashboardIntelligenceSession.ts";

let cacheStore: DashboardIntelligenceCacheStore = createInMemoryDashboardIntelligenceCacheStore();
let latestDashboardIntelligenceResponse: DashboardIntelligenceResponse | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function emptyLoading(panel: DashboardIntelligencePanelId | null = null) {
  return Object.freeze({
    loading: false,
    panel,
    startedAt: null,
  });
}

function emptyError(panel: DashboardIntelligencePanelId | null = null) {
  return Object.freeze({
    hasError: false,
    panel,
    code: null,
    message: null,
  });
}

function applyRefreshTriggerToSession(
  trigger: DashboardIntelligenceRefreshTrigger,
  input: DashboardIntelligenceRefreshRequest
): void {
  switch (trigger) {
    case "workspace_changed":
      updateDashboardIntelligenceSession({
        workspaceId: input.workspaceId ?? null,
        objectId: null,
        scenarioId: null,
        relationshipId: null,
        dataSourceId: null,
      });
      break;
    case "object_selected":
      updateDashboardIntelligenceSession({
        objectId: input.objectId ?? null,
        workspaceId: input.workspaceId ?? null,
      });
      break;
    case "scenario_changed":
      updateDashboardIntelligenceSession({
        scenarioId: input.scenarioId ?? null,
        workspaceId: input.workspaceId ?? null,
      });
      break;
    case "relationship_changed":
      updateDashboardIntelligenceSession({
        relationshipId: input.relationshipId ?? null,
        workspaceId: input.workspaceId ?? null,
      });
      break;
    case "data_source_updated":
      updateDashboardIntelligenceSession({
        dataSourceId: input.dataSourceId ?? null,
        workspaceId: input.workspaceId ?? null,
      });
      break;
    case "manual":
    case "automatic":
    default:
      updateDashboardIntelligenceSession({
        workspaceId: input.workspaceId ?? undefined,
        objectId: input.objectId ?? undefined,
        scenarioId: input.scenarioId ?? undefined,
        relationshipId: input.relationshipId ?? undefined,
        dataSourceId: input.dataSourceId ?? undefined,
        activePanel: input.panel ?? undefined,
      });
      break;
  }
}

function fulfillDashboardIntelligenceRequest(input: {
  panel: DashboardIntelligencePanelId;
  workspaceId?: WorkspaceId | null;
  objectId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  dataSourceId?: string | null;
  selectionLabel?: string | null;
  bypassCache?: boolean;
  refreshTrigger?: DashboardIntelligenceRefreshTrigger | null;
}): DashboardIntelligenceResponse {
  const runtimeStarted = performance.now();
  const panel = input.panel;
  const registration = getDashboardIntelligencePanelRegistration(panel);

  if (!registration?.enabled) {
    const engineId = resolveDashboardIntelligenceEngineId(panel) ?? "reserved_timeline";
    const diagnostics = buildDashboardIntelligenceDiagnostics({
      panel,
      engineId,
      runtimeDurationMs: performance.now() - runtimeStarted,
      normalizationDurationMs: 0,
      cacheUsed: false,
      refreshTrigger: input.refreshTrigger ?? null,
    });
    const response = Object.freeze({
      contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
      success: false,
      panel,
      engineId,
      runtimeStatus: "error" as const,
      loading: emptyLoading(panel),
      error: Object.freeze({
        hasError: true,
        panel,
        code: "panel_disabled",
        message: `Dashboard panel "${panel}" is not enabled.`,
      }),
      snapshot: null,
      diagnostics,
      generatedAt: nowIso(),
      tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
    });
    latestDashboardIntelligenceResponse = response;
    recordDashboardIntelligenceEvent({
      type: "PanelFailed",
      panel,
      workspaceId: input.workspaceId ?? null,
      trigger: input.refreshTrigger ?? null,
    });
    emitDashboardIntelligenceDiagnostic(diagnostics);
    setDashboardIntelligenceRuntimeStatus("error");
    return response;
  }

  const context = buildDashboardIntelligencePanelContext({
    panel,
    workspaceId: input.workspaceId,
    objectId: input.objectId,
    scenarioId: input.scenarioId,
    relationshipId: input.relationshipId,
    dataSourceId: input.dataSourceId,
    selectionLabel: input.selectionLabel,
  });

  updateDashboardIntelligenceSession({
    workspaceId: context.workspaceId,
    objectId: context.objectId,
    scenarioId: context.scenarioId,
    relationshipId: context.relationshipId,
    dataSourceId: context.dataSourceId,
    activePanel: panel,
    selectionContext: context.selectionLabel,
  });

  const cacheKey = buildDashboardIntelligenceCacheKey({
    panel,
    workspaceId: context.workspaceId ?? "",
    objectId: context.objectId,
    scenarioId: context.scenarioId,
    relationshipId: context.relationshipId,
    dataSourceId: context.dataSourceId,
  });

  if (!input.bypassCache) {
    const cached = cacheStore.get(cacheKey);
    if (cached) {
      const diagnostics = buildDashboardIntelligenceDiagnostics({
        panel,
        engineId: cached.snapshot.engineId,
        runtimeDurationMs: performance.now() - runtimeStarted,
        normalizationDurationMs: 0,
        cacheUsed: true,
        refreshTrigger: input.refreshTrigger ?? null,
      });
      const response = Object.freeze({
        contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
        success: true,
        panel,
        engineId: cached.snapshot.engineId,
        runtimeStatus: "ready" as const,
        loading: emptyLoading(panel),
        error: emptyError(panel),
        snapshot: cached.snapshot,
        diagnostics,
        generatedAt: nowIso(),
        tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
      });
      latestDashboardIntelligenceResponse = response;
      recordDashboardIntelligenceEvent({
        type: "PanelLoaded",
        panel,
        workspaceId: context.workspaceId,
        trigger: input.refreshTrigger ?? null,
      });
      emitDashboardIntelligenceDiagnostic(diagnostics);
      setDashboardIntelligenceRuntimeStatus("ready");
      return response;
    }
  }

  recordDashboardIntelligenceEvent({
    type: "PanelRequested",
    panel,
    workspaceId: context.workspaceId,
    trigger: input.refreshTrigger ?? null,
  });

  setDashboardIntelligenceRuntimeStatus("refreshing");

  try {
    const enginePayload = routeDashboardIntelligenceRequest(context);
    const normalizationStarted = performance.now();
    const normalized = normalizeDashboardIntelligencePayload(enginePayload);
    const normalizationDurationMs = performance.now() - normalizationStarted;

    const snapshot = Object.freeze({
      panel,
      engineId: enginePayload.engineId,
      workspaceId: enginePayload.workspaceId,
      payload: normalized,
      capturedAt: nowIso(),
    });

    cacheStore.set(
      Object.freeze({
        key: cacheKey,
        snapshot,
        storedAt: nowIso(),
      })
    );

    const diagnostics = buildDashboardIntelligenceDiagnostics({
      panel,
      engineId: enginePayload.engineId,
      runtimeDurationMs: performance.now() - runtimeStarted,
      normalizationDurationMs,
      cacheUsed: false,
      refreshTrigger: input.refreshTrigger ?? null,
    });

    const response = Object.freeze({
      contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
      success: normalized.status !== "error",
      panel,
      engineId: enginePayload.engineId,
      runtimeStatus: "ready" as const,
      loading: emptyLoading(panel),
      error: emptyError(panel),
      snapshot,
      diagnostics,
      generatedAt: nowIso(),
      tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
    });

    latestDashboardIntelligenceResponse = response;
    recordDashboardIntelligenceEvent({
      type: "PanelLoaded",
      panel,
      workspaceId: context.workspaceId,
      trigger: input.refreshTrigger ?? null,
    });
    emitDashboardIntelligenceDiagnostic(diagnostics);
    setDashboardIntelligenceRuntimeStatus("ready");
    return response;
  } catch (error) {
    const engineId = resolveDashboardIntelligenceEngineId(panel) ?? "reserved_timeline";
    const message =
      error instanceof Error ? error.message : "Dashboard intelligence request failed.";
    const normalized = normalizeDashboardIntelligenceError({ panel, engineId, message });
    const diagnostics = buildDashboardIntelligenceDiagnostics({
      panel,
      engineId,
      runtimeDurationMs: performance.now() - runtimeStarted,
      normalizationDurationMs: 0,
      cacheUsed: false,
      refreshTrigger: input.refreshTrigger ?? null,
    });
    const response = Object.freeze({
      contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
      success: false,
      panel,
      engineId,
      runtimeStatus: "error" as const,
      loading: emptyLoading(panel),
      error: Object.freeze({
        hasError: true,
        panel,
        code: "runtime_error",
        message,
      }),
      snapshot: Object.freeze({
        panel,
        engineId,
        workspaceId: context.workspaceId,
        payload: normalized,
        capturedAt: nowIso(),
      }),
      diagnostics,
      generatedAt: nowIso(),
      tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
    });
    latestDashboardIntelligenceResponse = response;
    recordDashboardIntelligenceEvent({
      type: "PanelFailed",
      panel,
      workspaceId: context.workspaceId,
      trigger: input.refreshTrigger ?? null,
    });
    emitDashboardIntelligenceDiagnostic(diagnostics);
    setDashboardIntelligenceRuntimeStatus("error");
    return response;
  }
}

export function requestDashboardIntelligence(
  input: DashboardIntelligenceRequest
): DashboardIntelligenceResponse {
  return fulfillDashboardIntelligenceRequest({
    panel: input.panel,
    workspaceId: input.workspaceId,
    objectId: input.objectId,
    scenarioId: input.scenarioId,
    relationshipId: input.relationshipId,
    dataSourceId: input.dataSourceId,
    selectionLabel: input.selectionLabel,
    bypassCache: input.bypassCache,
    refreshTrigger: null,
  });
}

export function refreshDashboardIntelligence(
  input: DashboardIntelligenceRefreshRequest
): DashboardIntelligenceResponse {
  recordDashboardIntelligenceEvent({
    type: "DashboardRefreshRequested",
    panel: input.panel ?? null,
    workspaceId: input.workspaceId ?? null,
    trigger: input.trigger,
  });

  applyRefreshTriggerToSession(input.trigger, input);

  const panel = input.panel ?? "executive_summary";
  const response = fulfillDashboardIntelligenceRequest({
    panel,
    workspaceId: input.workspaceId,
    objectId: input.objectId,
    scenarioId: input.scenarioId,
    relationshipId: input.relationshipId,
    dataSourceId: input.dataSourceId,
    bypassCache: input.bypassCache ?? true,
    refreshTrigger: input.trigger,
  });

  recordDashboardIntelligenceEvent({
    type: "DashboardRefreshCompleted",
    panel,
    workspaceId: input.workspaceId ?? null,
    trigger: input.trigger,
  });

  return response;
}

export function openDashboardIntelligence(input?: {
  workspaceId?: WorkspaceId | null;
  panel?: DashboardIntelligencePanelId | null;
}): void {
  recordDashboardIntelligenceEvent({
    type: "DashboardOpened",
    panel: input?.panel ?? null,
    workspaceId: input?.workspaceId ?? null,
  });
  setDashboardIntelligenceRuntimeStatus("ready");
}

export function closeDashboardIntelligence(): void {
  recordDashboardIntelligenceEvent({
    type: "DashboardClosed",
    panel: null,
    workspaceId: null,
  });
  setDashboardIntelligenceRuntimeStatus("idle");
}

export function getLatestDashboardIntelligenceResponse(): DashboardIntelligenceResponse | null {
  return latestDashboardIntelligenceResponse;
}

export function getSupportedDashboardIntelligencePanels(): readonly DashboardIntelligencePanelId[] {
  return DASHBOARD_INTELLIGENCE_MODES;
}

export function resetDashboardIntelligenceRuntimeForTests(): void {
  cacheStore = createInMemoryDashboardIntelligenceCacheStore();
  latestDashboardIntelligenceResponse = null;
  setDashboardIntelligenceRuntimeStatus("idle");
}

export const DashboardIntelligenceRuntime = Object.freeze({
  requestDashboardIntelligence,
  refreshDashboardIntelligence,
  openDashboardIntelligence,
  closeDashboardIntelligence,
  getLatestDashboardIntelligenceResponse,
  getSupportedDashboardIntelligencePanels,
  resetDashboardIntelligenceRuntimeForTests,
});
