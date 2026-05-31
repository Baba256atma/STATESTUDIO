/**
 * E2:71 — Stable executive layout audit input signature.
 */

import type { ExecutiveLayoutAuditInput, ExecutiveLayoutAuditReport } from "../scene/executiveLayoutAuditRuntime";
import { bucketViewportWidth, normalizeHudLayoutNumber } from "../layout/hudLayoutSignature";

export function buildExecutiveLayoutAuditInputSignature(input: ExecutiveLayoutAuditInput): string {
  const viewportWidth =
    input.contract.breakpoint === "mobile" ? 390 : input.contract.breakpoint === "tablet" ? 820 : 1440;

  const visiblePanels = Object.entries(input.visiblePanels ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([panelId, visible]) => `${panelId}:${visible ? 1 : 0}`)
    .join(",");

  return JSON.stringify({
    preset: input.contract.preset,
    breakpoint: input.contract.breakpoint,
    viewportBucket: bucketViewportWidth(viewportWidth),
    selectedObjectId: input.selectedObjectId ?? null,
    pipelineStatus: input.pipelineStatus,
    timelineHeightMode: input.timelineHeightMode ?? null,
    timelineExpanded: input.contract.timelineExpanded,
    visiblePanels,
  });
}

export function buildExecutiveLayoutAuditReportSignature(report: ExecutiveLayoutAuditReport): string {
  return JSON.stringify({
    collisionsDetected: report.collisionsDetected,
    hiddenPanelsDetected: report.hiddenPanelsDetected,
    invalidAnchors: [...report.invalidAnchors].sort(),
    layoutWarnings: [...report.layoutWarnings].sort(),
  });
}

export function buildHiddenPanelAuditSignature(input: {
  count: number;
  reports: Array<{ panelId: string; issue: string; detail: string }>;
}): string {
  const normalizedReports = input.reports.map((report) => ({
    panelId: report.panelId,
    issue: report.issue,
    detail: report.detail,
  }));
  return JSON.stringify({
    count: input.count,
    reports: normalizedReports,
  });
}

export function normalizeDomRectForAudit(rect: {
  top: number;
  left: number;
  width: number;
  height: number;
}): { top: number; left: number; width: number; height: number } {
  return {
    top: normalizeHudLayoutNumber(rect.top) as number,
    left: normalizeHudLayoutNumber(rect.left) as number,
    width: normalizeHudLayoutNumber(rect.width) as number,
    height: normalizeHudLayoutNumber(rect.height) as number,
  };
}
