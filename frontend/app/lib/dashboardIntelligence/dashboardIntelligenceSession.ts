/**
 * INT-1 — Dashboard Intelligence session state.
 * Context only — no business logic or intelligence calculations.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligencePanelContext,
  DashboardIntelligencePanelId,
  DashboardIntelligenceSessionState,
} from "./dashboardIntelligenceContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

const EMPTY_SESSION: DashboardIntelligenceSessionState = Object.freeze({
  workspaceId: null,
  objectId: null,
  scenarioId: null,
  relationshipId: null,
  dataSourceId: null,
  activePanel: null,
  selectionContext: null,
  openedAt: null,
  updatedAt: "",
});

let dashboardIntelligenceSession: DashboardIntelligenceSessionState = EMPTY_SESSION;

export function getDashboardIntelligenceSession(): DashboardIntelligenceSessionState {
  return dashboardIntelligenceSession;
}

export function openDashboardIntelligenceSession(input: {
  workspaceId?: WorkspaceId | null;
  panel?: DashboardIntelligencePanelId | null;
}): DashboardIntelligenceSessionState {
  const timestamp = nowIso();
  dashboardIntelligenceSession = Object.freeze({
    workspaceId: normalizeId(input.workspaceId),
    objectId: null,
    scenarioId: null,
    relationshipId: null,
    dataSourceId: null,
    activePanel: input.panel ?? null,
    selectionContext: null,
    openedAt: timestamp,
    updatedAt: timestamp,
  });
  return dashboardIntelligenceSession;
}

export function closeDashboardIntelligenceSession(): DashboardIntelligenceSessionState {
  dashboardIntelligenceSession = Object.freeze({
    ...EMPTY_SESSION,
    updatedAt: nowIso(),
  });
  return dashboardIntelligenceSession;
}

export function updateDashboardIntelligenceSession(
  input: Partial<{
    workspaceId: WorkspaceId | null;
    objectId: string | null;
    scenarioId: string | null;
    relationshipId: string | null;
    dataSourceId: string | null;
    activePanel: DashboardIntelligencePanelId | null;
    selectionContext: string | null;
  }>
): DashboardIntelligenceSessionState {
  dashboardIntelligenceSession = Object.freeze({
    workspaceId:
      input.workspaceId !== undefined
        ? normalizeId(input.workspaceId)
        : dashboardIntelligenceSession.workspaceId,
    objectId:
      input.objectId !== undefined ? normalizeId(input.objectId) : dashboardIntelligenceSession.objectId,
    scenarioId:
      input.scenarioId !== undefined
        ? normalizeId(input.scenarioId)
        : dashboardIntelligenceSession.scenarioId,
    relationshipId:
      input.relationshipId !== undefined
        ? normalizeId(input.relationshipId)
        : dashboardIntelligenceSession.relationshipId,
    dataSourceId:
      input.dataSourceId !== undefined
        ? normalizeId(input.dataSourceId)
        : dashboardIntelligenceSession.dataSourceId,
    activePanel:
      input.activePanel !== undefined ? input.activePanel : dashboardIntelligenceSession.activePanel,
    selectionContext:
      input.selectionContext !== undefined
        ? normalizeId(input.selectionContext)
        : dashboardIntelligenceSession.selectionContext,
    openedAt: dashboardIntelligenceSession.openedAt,
    updatedAt: nowIso(),
  });
  return dashboardIntelligenceSession;
}

export function buildDashboardIntelligencePanelContext(
  input: Partial<DashboardIntelligencePanelContext> & {
    panel: DashboardIntelligencePanelId;
  }
): DashboardIntelligencePanelContext {
  const session = getDashboardIntelligenceSession();
  return Object.freeze({
    panel: input.panel,
    mode: input.panel,
    workspaceId:
      normalizeId(input.workspaceId) ??
      session.workspaceId ??
      null,
    objectId: normalizeId(input.objectId) ?? session.objectId,
    scenarioId: normalizeId(input.scenarioId) ?? session.scenarioId,
    relationshipId: normalizeId(input.relationshipId) ?? session.relationshipId,
    dataSourceId: normalizeId(input.dataSourceId) ?? session.dataSourceId,
    selectionLabel: normalizeId(input.selectionLabel) ?? session.selectionContext,
  });
}

export function resetDashboardIntelligenceSessionForTests(): void {
  dashboardIntelligenceSession = EMPTY_SESSION;
}
