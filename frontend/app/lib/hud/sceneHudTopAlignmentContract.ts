/**
 * MRP_HUD:13:3 — Unified scene HUD top row alignment + vertical-only panel scroll.
 */

import type React from "react";

import { resolveExecutiveTopBaseline } from "../scene/executiveTopAlignmentRuntime.ts";
import {
  OBJECT_PANEL_TOP,
  SCENE_PANEL_TOP,
} from "../scene/sceneHudInsetContract.ts";
import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";

export type SceneHudTopAlignment = Readonly<{
  SCENE_HUD_TOP_Y: number;
  SCENE_PANEL_TOP_Y: number;
  SCENE_MENU_BAR_TOP_Y: number;
  OBJECT_PANEL_TOP_Y: number;
}>;

export const SCENE_HUD_PANEL_SCROLL_STYLE = Object.freeze({
  overflowY: "auto",
  overflowX: "hidden",
} as const satisfies React.CSSProperties);

let lastTopAlignSignature: string | null = null;
const loggedPanelScroll = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveSceneHudTopAlignment(input: {
  layoutWidth: number;
}): SceneHudTopAlignment {
  const topY = resolveExecutiveTopBaseline(input.layoutWidth);
  return Object.freeze({
    SCENE_HUD_TOP_Y: topY,
    SCENE_PANEL_TOP_Y: SCENE_PANEL_TOP,
    SCENE_MENU_BAR_TOP_Y: topY,
    OBJECT_PANEL_TOP_Y: OBJECT_PANEL_TOP,
  });
}

export function isSceneHudTopRowAligned(contract: SceneHudZoneContract): boolean {
  return (
    Math.abs(contract.scenePanelZone.top - SCENE_PANEL_TOP) <= 0.5 &&
    Math.abs(contract.objectPanelZone.top - OBJECT_PANEL_TOP) <= 0.5 &&
    Math.abs(contract.scenePanelZone.top - contract.objectPanelZone.top) <= 0.5
  );
}

export function traceSceneHudTopAlign(contract: SceneHudZoneContract): void {
  if (!isDev()) return;
  const signature = [
    contract.scenePanelZone.top,
    contract.topBarZone.top,
    contract.objectPanelZone.top,
    contract.sceneWidth,
  ].join(":");
  if (lastTopAlignSignature === signature) return;
  lastTopAlignSignature = signature;

  const aligned = isSceneHudTopRowAligned(contract);
  globalThis.console?.log?.(
    `[NexoraHUDTopAlign] scenePanelTop=${contract.scenePanelZone.top} objectPanelTop=${contract.objectPanelZone.top} aligned=${aligned}`
  );

  if (!aligned) {
    globalThis.console?.warn?.("[NexoraHUDTopAlign][Brake] reason=top_alignment_mismatch");
  }
}

export function traceSceneHudPanelScroll(panel: "scene" | "object"): void {
  if (!isDev() || loggedPanelScroll.has(panel)) return;
  loggedPanelScroll.add(panel);
  globalThis.console?.log?.(
    `[NexoraHUDPanelScroll] panel=${panel} overflowX=false overflowY=true`
  );
}

export function resetSceneHudTopAlignmentContractForTests(): void {
  lastTopAlignSignature = null;
  loggedPanelScroll.clear();
}
