/** E2:56 — Executive layout audit orchestrator (development only). */

import { emitHudLayoutLog, recordHudLayoutWrite } from "../layout/hudLayoutLogGuard";
import { enforceCanonicalAnchor } from "./executiveHudLayoutGovernance";
import {
  buildExecutiveLayoutAuditInputSignature,
  buildExecutiveLayoutAuditReportSignature,
} from "./executiveLayoutAuditSignature";
import {
  buildHudLayoutPanels,
  detectSceneHudCollisions,
  type SceneHudLayoutContext,
} from "./sceneHudCollisionRuntime";
import { auditHiddenScenePanels } from "./sceneHiddenPanelAudit";
import { getSceneHudRegistration, type SceneHudPanelId } from "./sceneHudRegistry";
import { resolveTimelineSafeZone } from "./timelineSafeZoneRuntime";
import { resolveToolbarSafeZone } from "./toolbarSafeZoneRuntime";
import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";

export type ExecutiveLayoutAuditReport = {
  collisionsDetected: number;
  hiddenPanelsDetected: number;
  invalidAnchors: string[];
  layoutWarnings: string[];
};

export type ExecutiveLayoutAuditInput = {
  contract: WorkspaceLayoutContract;
  selectedObjectId: string | null;
  pipelineStatus: string;
  visiblePanels: Partial<Record<SceneHudPanelId, boolean>>;
  timelineHeightMode?: "collapsed" | "compact" | "expanded" | "full";
  root?: ParentNode | null;
};

const lastAuditInputSignatureRef: { current: string | null } = { current: null };
const lastAuditReportSignatureRef: { current: string | null } = { current: null };
const lastAuditResultRef: { current: ExecutiveLayoutAuditReport | null } = { current: null };

export function runExecutiveLayoutAudit(input: ExecutiveLayoutAuditInput): ExecutiveLayoutAuditReport {
  const inputSignature = buildExecutiveLayoutAuditInputSignature(input);
  if (lastAuditInputSignatureRef.current === inputSignature && lastAuditResultRef.current) {
    return lastAuditResultRef.current;
  }
  lastAuditInputSignatureRef.current = inputSignature;
  recordHudLayoutWrite("audit");
  const viewportWidth = input.contract.breakpoint === "mobile" ? 390 : input.contract.breakpoint === "tablet" ? 820 : 1440;
  const viewportHeight = input.contract.breakpoint === "mobile" ? 844 : 900;
  const timelineZone = resolveTimelineSafeZone({
    viewportWidth,
    viewportHeight,
    timelineVisible: Boolean(input.visiblePanels.timelineHud),
    quickActionsVisible: Boolean(input.visiblePanels.quickActionsDock),
    timelineExpanded: input.contract.timelineExpanded,
    timelineHeightMode: input.timelineHeightMode,
  });
  const toolbarZone = resolveToolbarSafeZone({
    contract: input.contract,
    objectInfoVisible: Boolean(input.visiblePanels.objectInfoHud),
    statusHudVisible: Boolean(input.visiblePanels.executiveStatusHud),
  });

  const layoutContext: SceneHudLayoutContext = {
    viewportWidth,
    viewportHeight,
    toolbarTop: toolbarZone.top,
    timelineBottomOffset: timelineZone.bottomOffset,
    visiblePanels: input.visiblePanels,
  };

  const panels = buildHudLayoutPanels(layoutContext);
  const collisions = detectSceneHudCollisions(panels);
  const hiddenReports = auditHiddenScenePanels(input.root ?? null);

  const invalidAnchors: string[] = [];
  const layoutWarnings: string[] = [];

  (Object.keys(input.visiblePanels) as SceneHudPanelId[]).forEach((panelId) => {
    if (!input.visiblePanels[panelId]) return;
    const entry = getSceneHudRegistration(panelId);
    const enforced = enforceCanonicalAnchor(panelId, entry.zone);
    if (enforced !== entry.zone) {
      invalidAnchors.push(`${panelId}:${entry.zone}->${enforced}`);
    }
  });

  if (input.visiblePanels.objectInfoHud && input.visiblePanels.objectInfoEmptyPlaceholder) {
    layoutWarnings.push("object_info_and_empty_state_both_visible");
  }

  if (collisions.some(([a, b]) => a.panelId === "executiveSceneToolbar" || b.panelId === "executiveSceneToolbar")) {
    layoutWarnings.push("toolbar_collision_detected");
  }

  const report: ExecutiveLayoutAuditReport = {
    collisionsDetected: collisions.length,
    hiddenPanelsDetected: hiddenReports.length,
    invalidAnchors,
    layoutWarnings,
  };

  logLayoutAudit(report);
  lastAuditResultRef.current = report;
  return report;
}

export function logLayoutAudit(payload: ExecutiveLayoutAuditReport): void {
  const signature = buildExecutiveLayoutAuditReportSignature(payload);
  if (lastAuditReportSignatureRef.current === signature) return;
  lastAuditReportSignatureRef.current = signature;
  emitHudLayoutLog("[Nexora][LayoutAudit]", "LayoutAudit", signature, payload as unknown as Record<string, unknown>);
}

export function resetExecutiveLayoutAuditLogsForTests(): void {
  lastAuditInputSignatureRef.current = null;
  lastAuditReportSignatureRef.current = null;
  lastAuditResultRef.current = null;
}
