/**
 * MRP_SCENE:14:3–14:5 — Permanent horizontal scene command strip.
 */

import { SCENE_PANEL_WIDTH } from "../hud/hudPanelDesignContract.ts";
import { HUD_PANEL_PADDING_X, HUD_PANEL_PADDING_Y, HUD_PANEL_SUBPANEL_GAP } from "../hud/hudPanelDesignContract.ts";

/** Single-row text command strip — fits fixed Scene Panel width. */
export const SCENE_PANEL_ACTION_BUTTON_HEIGHT = 28;
export const SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH = 52;
export const SCENE_PANEL_ACTION_BUTTON_FONT_SIZE = 10;
export const SCENE_PANEL_ACTION_BUTTON_PADDING_X = 8;
export const SCENE_PANEL_ACTION_BUTTON_GAP = HUD_PANEL_SUBPANEL_GAP;
export const SCENE_PANEL_ACTION_BUTTON_COUNT = 3;
export const SCENE_PANEL_TITLE_ROW_HEIGHT = 28;

let loggedCommandSurface = false;
let loggedCommandStrip = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveSceneCommandStripInnerWidth(
  panelWidth = SCENE_PANEL_WIDTH
): number {
  return Math.max(0, panelWidth - HUD_PANEL_PADDING_X * 2);
}

/** Collapsed panel height: title row + single horizontal command strip. */
export function resolveScenePanelCollapsedHeight(): number {
  const headerPadding = HUD_PANEL_PADDING_Y * 2;
  return (
    headerPadding +
    SCENE_PANEL_TITLE_ROW_HEIGHT +
    HUD_PANEL_SUBPANEL_GAP +
    SCENE_PANEL_ACTION_BUTTON_HEIGHT
  );
}

export function traceScenePanelCommandSurface(): void {
  if (!isDev() || loggedCommandSurface) return;
  loggedCommandSurface = true;
  globalThis.console?.log?.(
    "[ScenePanelCommandSurface] alwaysVisible=true collapsedActionsVisible=true expandedActionsVisible=true"
  );
}

export function traceSceneCommandStrip(): void {
  if (!isDev() || loggedCommandStrip) return;
  loggedCommandStrip = true;
  globalThis.console?.log?.(
    `[SceneCommandStrip] layout=horizontal rows=1 wrap=false buttonCount=${SCENE_PANEL_ACTION_BUTTON_COUNT}`
  );
}

/** @deprecated Use traceSceneCommandStrip */
export function traceSceneCommandBar(): void {
  traceSceneCommandStrip();
}

export function resetScenePanelCommandSurfaceForTests(): void {
  loggedCommandSurface = false;
  loggedCommandStrip = false;
}
