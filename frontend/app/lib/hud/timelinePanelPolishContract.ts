/**
 * MRP_TIMELINE:13:3 — Timeline panel visual polish + HUD alignment contract.
 */

import type React from "react";

import {
  HUD_PANEL_HEADER_PADDING_STYLE,
  HUD_PANEL_RADIUS,
  HUD_PANEL_SAFE_TEXT_STYLE,
  HUD_PANEL_STICKY_HEADER_STYLE,
  HUD_PANEL_TRUNCATE_TEXT_STYLE,
} from "./hudPanelDesignContract.ts";
import { TIMELINE_BOTTOM_INSET_PX } from "./timelineBottomAnchorContract.ts";
import { resolveTimelineSceneWidthRatio } from "./timelineZoneContract.ts";

/** Derived from unified HUD edge inset contract for a reference scene width. */
export const TIMELINE_PANEL_WIDTH_RATIO = resolveTimelineSceneWidthRatio(900);
export const TIMELINE_PANEL_BOTTOM_INSET_PX = TIMELINE_BOTTOM_INSET_PX;

export const TIMELINE_TRANSPORT_HEADER_STYLE = Object.freeze({
  ...HUD_PANEL_STICKY_HEADER_STYLE,
  height: "auto",
  minHeight: HUD_PANEL_STICKY_HEADER_STYLE.minHeight,
  alignItems: "center",
  ...HUD_PANEL_HEADER_PADDING_STYLE,
  boxSizing: "border-box",
} as const satisfies React.CSSProperties);

export const TIMELINE_TRANSPORT_CONTROL_STYLE = Object.freeze({
  minHeight: 32,
  padding: "0 10px",
  borderRadius: HUD_PANEL_RADIUS,
  flexShrink: 0,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  whiteSpace: "nowrap",
} as const satisfies React.CSSProperties);

export const TIMELINE_TRANSPORT_TITLE_STYLE = Object.freeze({
  color: "inherit",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
} as const satisfies React.CSSProperties);

export const TIMELINE_TRANSPORT_SUMMARY_STYLE = Object.freeze({
  ...HUD_PANEL_TRUNCATE_TEXT_STYLE,
  fontSize: 11,
  fontWeight: 650,
} as const satisfies React.CSSProperties);

export const TIMELINE_TRANSPORT_COUNT_STYLE = Object.freeze({
  minWidth: 52,
  textAlign: "center",
  fontSize: 12,
  fontWeight: 800,
  fontVariantNumeric: "tabular-nums",
  padding: "6px 8px",
  borderRadius: HUD_PANEL_RADIUS,
  flexShrink: 0,
} as const satisfies React.CSSProperties);

let lastPolishTraceSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceTimelinePolish(input?: {
  bottomAnchored?: boolean;
  widthRatio?: number;
}): void {
  if (!isDev()) return;
  const bottomAnchored = input?.bottomAnchored ?? true;
  const widthRatio = input?.widthRatio ?? TIMELINE_PANEL_WIDTH_RATIO;
  const signature = [bottomAnchored, widthRatio].join(":");
  if (lastPolishTraceSignature === signature) return;
  lastPolishTraceSignature = signature;
  globalThis.console?.log?.(
    `[NexoraTimelinePolish] radius=${HUD_PANEL_RADIUS} bottomAnchored=${bottomAnchored} widthRatio=${widthRatio}`
  );
}

export function resetTimelinePanelPolishContractForTests(): void {
  lastPolishTraceSignature = null;
}
