/** E2:57 — Unified top baseline for Scene Info, Toolbar, and Object Info. */

import type React from "react";

import { getExecutiveHudViewportWidth } from "../layout/executiveHudHydrationRuntime";
import { emitHudLayoutZoneLog } from "../layout/hudLayoutLogGuard";
import {
  EXECUTIVE_SCENE_HUD_GRID,
  logHudGrid,
  resolveExecutiveHudGridMetrics,
  type ExecutiveHudGridAnchor,
} from "./executiveSceneHudGrid";

export type TopRowHudPanelId = "sceneInfoHud" | "executiveSceneToolbar" | "objectInfoHud";

export type UnifiedTopRowPlacement = {
  top: number;
  leftInset: number;
  rightInset: number;
};

const lastTopAlignmentSignatureRef: { current: string | null } = { current: null };

export function resolveExecutiveTopBaseline(viewportWidth?: number): number {
  const width = viewportWidth ?? getExecutiveHudViewportWidth();
  const metrics = resolveExecutiveHudGridMetrics(width);
  return metrics.topMargin;
}

export function resolveExecutiveSideInset(viewportWidth?: number): number {
  const width = viewportWidth ?? getExecutiveHudViewportWidth();
  return resolveExecutiveHudGridMetrics(width).safeMargin;
}

export function resolveUnifiedTopRowPlacement(viewportWidth?: number): UnifiedTopRowPlacement {
  const width = viewportWidth ?? getExecutiveHudViewportWidth();
  const metrics = resolveExecutiveHudGridMetrics(width);
  const placement = {
    top: metrics.topMargin,
    leftInset: metrics.safeMargin,
    rightInset: metrics.safeMargin,
  };
  logTopAlignment({ viewportWidth: width, ...placement });
  return placement;
}

export function resolveTopHudAnchorStyle(input: {
  anchor: ExecutiveHudGridAnchor;
  viewportWidth?: number;
}): React.CSSProperties {
  const width = input.viewportWidth ?? getExecutiveHudViewportWidth();
  const { top, leftInset, rightInset } = resolveUnifiedTopRowPlacement(width);

  if (input.anchor === "LEFT_TOP") {
    return { position: "absolute", top, left: leftInset };
  }
  if (input.anchor === "RIGHT_TOP") {
    return { position: "absolute", top, right: rightInset };
  }
  return {
    position: "absolute",
    top,
    left: "50%",
    transform: "translateX(-50%)",
  };
}

export function resolveTopRowPanelTop(panelId: TopRowHudPanelId, viewportWidth?: number): number {
  const width = viewportWidth ?? getExecutiveHudViewportWidth();
  const top = resolveExecutiveTopBaseline(width);
  logTopAlignment({ panelId, top, unified: true, viewportWidth: width });
  return top;
}

export function isTopRowHudPanel(panelId: string): panelId is TopRowHudPanelId {
  return panelId === "sceneInfoHud" || panelId === "executiveSceneToolbar" || panelId === "objectInfoHud";
}

export function logTopAlignment(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const viewportWidth =
    typeof payload.viewportWidth === "number" ? payload.viewportWidth : getExecutiveHudViewportWidth();
  const signature = JSON.stringify({
    panelId: payload.panelId ?? "top-row",
    top: payload.top ?? null,
    leftInset: payload.leftInset ?? null,
    rightInset: payload.rightInset ?? null,
    unified: payload.unified ?? false,
    viewportBucket: viewportWidth < 768 ? 390 : viewportWidth < 1024 ? 820 : 1440,
  });
  if (lastTopAlignmentSignatureRef.current === signature) return;
  lastTopAlignmentSignatureRef.current = signature;
  emitHudLayoutZoneLog("[Nexora][TopAlignment]", "TopAlignment", payload, viewportWidth);
  logHudGrid({ source: "topAlignment", ...payload });
}

export function resetExecutiveTopAlignmentLogsForTests(): void {
  lastTopAlignmentSignatureRef.current = null;
}

export { EXECUTIVE_SCENE_HUD_GRID };
