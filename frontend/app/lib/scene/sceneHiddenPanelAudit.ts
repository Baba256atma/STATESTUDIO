/** E2:56 — Detect rendered-but-hidden, offscreen, and stacked HUD panels. */

import { emitHudLayoutLog } from "../layout/hudLayoutLogGuard";
import type { SceneHudPanelId } from "./sceneHudRegistry";
import {
  buildHiddenPanelAuditSignature,
  normalizeDomRectForAudit,
} from "./executiveLayoutAuditSignature";

export type HiddenPanelIssue =
  | "rendered_invisible"
  | "rendered_behind"
  | "offscreen"
  | "zero_size_visible"
  | "negative_z_index";

export type HiddenPanelReport = {
  panelId: SceneHudPanelId | string;
  issue: HiddenPanelIssue;
  detail: string;
};

export type HudPanelDomSnapshot = {
  panelId: string;
  rect: { top: number; left: number; width: number; height: number };
  opacity: number;
  visibility: string;
  display: string;
  zIndex: number;
};

const PANEL_SELECTORS: Record<string, string> = {
  sceneInfoHud: '[data-scene-hud-panel="sceneInfoHud"]',
  objectInfoHud: '[data-scene-hud-panel="objectInfoHud"]',
  timelineHud: '[data-scene-hud-panel="timelineHud"]',
  executiveSceneToolbar: '[data-scene-hud-panel="sceneToolbar"]',
  executiveStatusHud: '[data-scene-hud-panel="executiveStatusHud"]',
  quickActionsDock: '[data-scene-hud-panel="quickActionsDock"]',
};

function readDomSnapshots(root?: ParentNode | null): HudPanelDomSnapshot[] {
  if (typeof document === "undefined") return [];
  const scope = root ?? document;
  return Object.entries(PANEL_SELECTORS).flatMap(([panelId, selector]) => {
    const node = scope.querySelector(selector);
    if (!(node instanceof HTMLElement)) return [];
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return [
      {
        panelId,
        rect: normalizeDomRectForAudit({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }),
        opacity: Number.parseFloat(style.opacity || "1"),
        visibility: style.visibility,
        display: style.display,
        zIndex: Number.parseInt(style.zIndex || "0", 10) || 0,
      },
    ];
  });
}

function isBehind(front: HudPanelDomSnapshot, back: HudPanelDomSnapshot): boolean {
  const a = front.rect;
  const b = back.rect;
  const overlaps =
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top;
  return overlaps && front.zIndex > back.zIndex && back.opacity > 0 && back.display !== "none";
}

export function auditHiddenScenePanels(root?: ParentNode | null): HiddenPanelReport[] {
  const snapshots = readDomSnapshots(root);
  const reports: HiddenPanelReport[] = [];
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1440;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 900;

  snapshots.forEach((snap) => {
    if (snap.display === "none") return;

    if (snap.visibility === "hidden" || snap.opacity <= 0.05) {
      reports.push({
        panelId: snap.panelId,
        issue: "rendered_invisible",
        detail: `opacity=${snap.opacity}, visibility=${snap.visibility}`,
      });
    }

    if (snap.rect.width <= 1 && snap.rect.height <= 1 && snap.opacity > 0) {
      reports.push({
        panelId: snap.panelId,
        issue: "zero_size_visible",
        detail: `${snap.rect.width}x${snap.rect.height}`,
      });
    }

    if (
      snap.rect.top + snap.rect.height < 0 ||
      snap.rect.left + snap.rect.width < 0 ||
      snap.rect.top > viewportH ||
      snap.rect.left > viewportW
    ) {
      reports.push({
        panelId: snap.panelId,
        issue: "offscreen",
        detail: `top=${Math.round(snap.rect.top)}, left=${Math.round(snap.rect.left)}`,
      });
    }

    if (snap.zIndex < 0) {
      reports.push({
        panelId: snap.panelId,
        issue: "negative_z_index",
        detail: `z-index=${snap.zIndex}`,
      });
    }
  });

  for (let i = 0; i < snapshots.length; i += 1) {
    for (let j = 0; j < snapshots.length; j += 1) {
      if (i === j) continue;
      const front = snapshots[i];
      const back = snapshots[j];
      if (!front || !back) continue;
      if (isBehind(front, back)) {
        reports.push({
          panelId: back.panelId,
          issue: "rendered_behind",
          detail: `covered by ${front.panelId}`,
        });
      }
    }
  }

  if (reports.length > 0) {
    logHiddenPanel({ count: reports.length, reports });
  }

  return reports;
}

export function logHiddenPanel(payload: Record<string, unknown>): void {
  const reports = Array.isArray(payload.reports)
    ? payload.reports.map((report) => ({
        panelId: String((report as { panelId?: unknown }).panelId ?? "unknown"),
        issue: String((report as { issue?: unknown }).issue ?? "unknown"),
        detail: String((report as { detail?: unknown }).detail ?? ""),
      }))
    : [];
  const signature = buildHiddenPanelAuditSignature({
    count: typeof payload.count === "number" ? payload.count : reports.length,
    reports,
  });
  emitHudLayoutLog("[Nexora][HiddenPanel]", "HiddenPanel", signature, payload);
}

export function resetSceneHiddenPanelAuditLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
}
