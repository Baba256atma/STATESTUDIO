/**
 * MRP_HUD:13:6 — Unified scene-native HUD panel design tokens.
 */

import type React from "react";

import type { SceneHudThemeSurfaceId } from "../theme/sceneThemeTokens";

export const HUD_PANEL_CONTRACT_RECOVERED_DIAGNOSTIC = "[HUD_PANEL_CONTRACT_RECOVERED]" as const;

export const HUD_PANEL_CONTRACT_REQUIRED_EXPORTS = Object.freeze([
  "HUD_PANEL_BODY_PADDING_STYLE",
  "HUD_PANEL_HEADER_PADDING_STYLE",
  "HUD_PANEL_SAFE_TEXT_STYLE",
  "HUD_PANEL_SCROLL_BODY_STYLE",
  "HUD_PANEL_STICKY_DETAIL_HEADER_STYLE",
  "HUD_PANEL_STICKY_HEADER_STYLE",
  "HUD_PANEL_STICKY_SHELL_STYLE",
  "HUD_PANEL_TRUNCATE_TEXT_STYLE",
  "OBJECT_PANEL_EXPANDED_WIDTH",
  "OBJECT_PANEL_WIDTH",
  "traceHudPanelStickyHeader",
] as const);

export const HUD_PANEL_RADIUS = 3;
export const HUD_PANEL_PADDING_X = 12;
export const HUD_PANEL_PADDING_Y = 10;
export const HUD_PANEL_SUBPANEL_INSET_X = 12;
export const HUD_PANEL_SUBPANEL_GAP = 8;
export const HUD_PANEL_BORDER_WIDTH = 1;
export const HUD_PANEL_WIDTH_UPGRADE_PX = 24;

/** Scene panel zone width — previous 220px + upgrade. */
export const SCENE_PANEL_WIDTH = 220 + HUD_PANEL_WIDTH_UPGRADE_PX;
/** Object panel compact zone width — previous 248px + upgrade. */
export const OBJECT_PANEL_WIDTH = 248 + HUD_PANEL_WIDTH_UPGRADE_PX;
/** Object panel expanded zone width — previous 320px + upgrade. */
export const OBJECT_PANEL_EXPANDED_WIDTH = 320 + HUD_PANEL_WIDTH_UPGRADE_PX;

const SCENE_NATIVE_HUD_PANEL_SURFACES = new Set<SceneHudThemeSurfaceId>([
  "sceneInfoHud",
  "objectInfoHud",
  "timelineHud",
]);

let lastDesignTraceSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function isSceneNativeHudPanelSurface(surface: SceneHudThemeSurfaceId): boolean {
  return SCENE_NATIVE_HUD_PANEL_SURFACES.has(surface);
}

export function resolveSceneNativeHudPanelRadius(surface: SceneHudThemeSurfaceId): number {
  return isSceneNativeHudPanelSurface(surface) ? HUD_PANEL_RADIUS : HUD_PANEL_RADIUS;
}

export const HUD_PANEL_SHELL_RADIUS_STYLE = Object.freeze({
  borderRadius: HUD_PANEL_RADIUS,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_BODY_SCROLL_STYLE = Object.freeze({
  overflowY: "auto",
  overflowX: "hidden",
  minWidth: 0,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_SHELL_OVERFLOW_STYLE = Object.freeze({
  overflow: "hidden",
  minWidth: 0,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_HEADER_PADDING_STYLE = Object.freeze({
  padding: `${HUD_PANEL_PADDING_Y}px ${HUD_PANEL_PADDING_X}px`,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_BODY_PADDING_STYLE = Object.freeze({
  padding: `${HUD_PANEL_PADDING_Y}px ${HUD_PANEL_PADDING_X}px`,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_SUBPANEL_BODY_STYLE = Object.freeze({
  paddingLeft: HUD_PANEL_SUBPANEL_INSET_X,
  paddingRight: HUD_PANEL_SUBPANEL_INSET_X,
  paddingTop: HUD_PANEL_PADDING_Y,
  paddingBottom: HUD_PANEL_PADDING_Y,
  display: "flex",
  flexDirection: "column",
  gap: HUD_PANEL_SUBPANEL_GAP,
  minWidth: 0,
  overflowX: "hidden",
} as const satisfies React.CSSProperties);

export const HUD_PANEL_SAFE_TEXT_STYLE = Object.freeze({
  minWidth: 0,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
} as const satisfies React.CSSProperties);

export const HUD_PANEL_TRUNCATE_TEXT_STYLE = Object.freeze({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const satisfies React.CSSProperties);

/** MRP_HUD:13:7 — stable sticky header chrome for scene/object panels. */
export const HUD_PANEL_STICKY_HEADER_Z_INDEX = 2;
export const HUD_PANEL_STICKY_HEADER_HEIGHT = 44;

export const HUD_PANEL_STICKY_HEADER_STYLE = Object.freeze({
  position: "sticky",
  top: 0,
  zIndex: HUD_PANEL_STICKY_HEADER_Z_INDEX,
  flexShrink: 0,
  minHeight: HUD_PANEL_STICKY_HEADER_HEIGHT,
  height: HUD_PANEL_STICKY_HEADER_HEIGHT,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: HUD_PANEL_SUBPANEL_GAP,
  minWidth: 0,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_STICKY_DETAIL_HEADER_STYLE = Object.freeze({
  ...HUD_PANEL_STICKY_HEADER_STYLE,
  height: "auto",
  alignItems: "flex-start",
} as const satisfies React.CSSProperties);

export const HUD_PANEL_STICKY_SHELL_STYLE = Object.freeze({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxHeight: "100%",
  overflow: "hidden",
  minWidth: 0,
} as const satisfies React.CSSProperties);

export const HUD_PANEL_SCROLL_BODY_STYLE = Object.freeze({
  flex: 1,
  minHeight: 0,
  ...HUD_PANEL_SUBPANEL_BODY_STYLE,
  ...HUD_PANEL_BODY_SCROLL_STYLE,
} as const satisfies React.CSSProperties);

export type HudStickyHeaderPanelId = "scene" | "object";

const loggedStickyHeaderPanels = new Set<HudStickyHeaderPanelId>();

export function traceHudPanelStickyHeader(input: {
  panel: HudStickyHeaderPanelId;
  sticky?: boolean;
  bodyScroll?: boolean;
}): void {
  if (!isDev()) return;
  if (loggedStickyHeaderPanels.has(input.panel)) return;
  loggedStickyHeaderPanels.add(input.panel);
  const sticky = input.sticky ?? true;
  const bodyScroll = input.bodyScroll ?? true;
  globalThis.console?.log?.(
    `[NexoraHUDStickyHeader] panel=${input.panel} sticky=${sticky} bodyScroll=${bodyScroll}`
  );
}

export function resetHudPanelStickyHeaderContractForTests(): void {
  loggedStickyHeaderPanels.clear();
}

export function areHudSubpanelInsetsEqual(
  paddingLeft: number,
  paddingRight: number
): boolean {
  return Math.abs(paddingLeft - paddingRight) <= 0.5;
}

export function traceHudPanelDesign(input: {
  scenePanelWidth: number;
  objectPanelWidth: number;
}): void {
  if (!isDev()) return;
  const signature = [input.scenePanelWidth, input.objectPanelWidth].join(":");
  if (lastDesignTraceSignature === signature) return;
  lastDesignTraceSignature = signature;
  globalThis.console?.log?.(
    `[NexoraHUDDesign] radius=${HUD_PANEL_RADIUS} scenePanelWidth=${input.scenePanelWidth} objectPanelWidth=${input.objectPanelWidth} subpanelInsetsEqual=${areHudSubpanelInsetsEqual(HUD_PANEL_SUBPANEL_INSET_X, HUD_PANEL_SUBPANEL_INSET_X)}`
  );
}

export function resetHudPanelDesignContractForTests(): void {
  lastDesignTraceSignature = null;
  loggedStickyHeaderPanels.clear();
}
