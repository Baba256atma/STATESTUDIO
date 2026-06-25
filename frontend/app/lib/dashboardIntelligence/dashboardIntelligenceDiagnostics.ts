/**
 * INT-1 — Dashboard Intelligence diagnostics.
 * Dev-only diagnostic emission — no production logs.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type {
  DashboardIntelligenceDiagnostics,
  DashboardIntelligenceEngineId,
  DashboardIntelligenceEvent,
  DashboardIntelligenceEventType,
  DashboardIntelligencePanelId,
  DashboardIntelligenceRefreshTrigger,
} from "./dashboardIntelligenceContract.ts";
import {
  DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
  NEXORA_DASHBOARD_INTELLIGENCE_LOG_PREFIX,
} from "./dashboardIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

const eventLog: DashboardIntelligenceEvent[] = [];

export function emitDashboardIntelligenceDiagnostic(
  diagnostics: DashboardIntelligenceDiagnostics
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("dashboardIntelligence", NEXORA_DASHBOARD_INTELLIGENCE_LOG_PREFIX, {
    panel: diagnostics.panel,
    engineId: diagnostics.engineId,
    runtimeDurationMs: diagnostics.runtimeDurationMs,
    normalizationDurationMs: diagnostics.normalizationDurationMs,
    cacheUsed: diagnostics.cacheUsed,
    refreshTrigger: diagnostics.refreshTrigger,
    tags: DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS,
    phase: "INT-1",
  });
}

export function recordDashboardIntelligenceEvent(input: {
  type: DashboardIntelligenceEventType;
  panel?: DashboardIntelligencePanelId | null;
  workspaceId?: WorkspaceId | null;
  trigger?: DashboardIntelligenceRefreshTrigger | null;
}): DashboardIntelligenceEvent {
  const event = Object.freeze({
    type: input.type,
    panel: input.panel ?? null,
    workspaceId: input.workspaceId ?? null,
    trigger: input.trigger ?? null,
    timestamp: new Date().toISOString(),
  });
  eventLog.push(event);
  return event;
}

export function getDashboardIntelligenceEvents(): readonly DashboardIntelligenceEvent[] {
  return Object.freeze([...eventLog]);
}

export function resetDashboardIntelligenceDiagnosticsForTests(): void {
  eventLog.length = 0;
}

export function buildDashboardIntelligenceDiagnostics(input: {
  panel: DashboardIntelligencePanelId;
  engineId: DashboardIntelligenceEngineId;
  runtimeDurationMs: number;
  normalizationDurationMs: number;
  cacheUsed: boolean;
  refreshTrigger?: DashboardIntelligenceRefreshTrigger | null;
}): DashboardIntelligenceDiagnostics {
  return Object.freeze({
    panel: input.panel,
    engineId: input.engineId,
    runtimeDurationMs: input.runtimeDurationMs,
    normalizationDurationMs: input.normalizationDurationMs,
    cacheUsed: input.cacheUsed,
    refreshTrigger: input.refreshTrigger ?? null,
    generatedAt: new Date().toISOString(),
  });
}
