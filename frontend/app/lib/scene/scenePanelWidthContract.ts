/**
 * MRP_HUD:13:4 / MRP_HUD:13:5 / MRP_HUD:13:6 — Scene Panel width, height, and layout contract.
 */

import {
  HUD_PANEL_BODY_SCROLL_STYLE,
  HUD_PANEL_STICKY_HEADER_STYLE,
  SCENE_PANEL_WIDTH as HUD_SCENE_PANEL_WIDTH,
} from "../hud/hudPanelDesignContract.ts";
import { resolveScenePanelCollapsedHeight } from "./scenePanelCommandSurfaceContract.ts";
import { SCENE_PANEL_TOP } from "./sceneHudInsetContract.ts";

export const SCENE_PANEL_WIDTH = HUD_SCENE_PANEL_WIDTH;
export const SCENE_PANEL_MIN_WIDTH = SCENE_PANEL_WIDTH - 20;
export const SCENE_PANEL_MAX_WIDTH = SCENE_PANEL_WIDTH + 40;
/** @deprecated Width is fixed in both modes — use SCENE_PANEL_WIDTH. */
export const SCENE_PANEL_COLLAPSED_WIDTH = SCENE_PANEL_WIDTH;

export const SCENE_PANEL_TOP_INSET_PX = SCENE_PANEL_TOP;
export const SCENE_PANEL_EXPANDED_HEIGHT_RATIO = 0.5;
export const SCENE_PANEL_HEADER_HEIGHT = 44;
/** Collapsed height includes permanent GLOBAL/FIT/FOCUS command strip. */
export const SCENE_PANEL_MINIMIZED_HEIGHT = resolveScenePanelCollapsedHeight();
export const SCENE_PANEL_MIN_BODY_HEIGHT = 96;

export type ScenePanelDisplayState = "expanded" | "collapsed";
export type ScenePanelHeightMode = "expanded" | "minimized";

let lastTraceSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function clampScenePanelWidth(width: number): number {
  return Math.max(SCENE_PANEL_MIN_WIDTH, Math.min(SCENE_PANEL_MAX_WIDTH, Math.round(width)));
}

export function resolveScenePanelFixedWidth(requestedWidth = SCENE_PANEL_WIDTH): number {
  return clampScenePanelWidth(requestedWidth);
}

/** Width is fixed — collapse/minimize changes height only. */
export function resolveScenePanelZoneWidth(
  _state?: ScenePanelDisplayState,
  requestedWidth = SCENE_PANEL_WIDTH
): number {
  return resolveScenePanelFixedWidth(requestedWidth);
}

export function resolveScenePanelZoneMaxWidth(_state?: ScenePanelDisplayState): string {
  return `${resolveScenePanelFixedWidth()}px`;
}

export function resolveScenePanelAvailableHeight(
  timelineTop: number,
  zoneGap = 8
): number {
  return Math.max(0, timelineTop - SCENE_PANEL_TOP_INSET_PX - zoneGap);
}

export function resolveScenePanelZoneHeight(input: {
  timelineTop: number;
  minimized: boolean;
  zoneGap?: number;
}): number {
  const available = resolveScenePanelAvailableHeight(input.timelineTop, input.zoneGap ?? 8);
  if (input.minimized) {
    return SCENE_PANEL_MINIMIZED_HEIGHT;
  }
  const expandedHeight = Math.max(
    SCENE_PANEL_HEADER_HEIGHT + SCENE_PANEL_MIN_BODY_HEIGHT,
    Math.floor(available * SCENE_PANEL_EXPANDED_HEIGHT_RATIO)
  );
  return Math.min(expandedHeight, available);
}

export function toScenePanelHeightMode(minimized: boolean): ScenePanelHeightMode {
  return minimized ? "minimized" : "expanded";
}

export const SCENE_PANEL_BODY_SCROLL_STYLE = HUD_PANEL_BODY_SCROLL_STYLE;

export const SCENE_PANEL_MINIMIZED_SHELL_STYLE = Object.freeze({
  overflow: "visible",
  height: "auto",
  maxHeight: "none",
} as const);

export const SCENE_PANEL_HEADER_STYLE = Object.freeze({
  ...HUD_PANEL_STICKY_HEADER_STYLE,
} as const);

export function traceScenePanelLayout(input: {
  top: number;
  width: number;
  heightMode: ScenePanelHeightMode;
  heightRatio?: number;
  bodyVisible: boolean;
}): void {
  if (!isDev()) return;
  const signature = [
    input.top,
    input.width,
    input.heightMode,
    input.bodyVisible,
  ].join(":");
  if (lastTraceSignature === signature) return;
  lastTraceSignature = signature;
  const ratioSuffix =
    input.heightMode === "expanded"
      ? ` heightRatio=${input.heightRatio ?? SCENE_PANEL_EXPANDED_HEIGHT_RATIO}`
      : "";
  const bodySuffix =
    input.heightMode === "minimized" ? " bodyVisible=false commandSurfaceVisible=true" : "";
  globalThis.console?.log?.(
    `[NexoraScenePanel] top=${input.top} widthFixed=true heightMode=${input.heightMode}${ratioSuffix}${bodySuffix}`
  );
}

/** @deprecated Use traceScenePanelLayout */
export function traceScenePanelWidth(input: {
  width: number;
  state: ScenePanelDisplayState;
  headerControlsVisible?: boolean;
}): void {
  traceScenePanelLayout({
    top: SCENE_PANEL_TOP_INSET_PX,
    width: input.width,
    heightMode: input.state === "collapsed" ? "minimized" : "expanded",
    heightRatio: SCENE_PANEL_EXPANDED_HEIGHT_RATIO,
    bodyVisible: input.state !== "collapsed",
  });
}

export function resetScenePanelWidthContractForTests(): void {
  lastTraceSignature = null;
}
