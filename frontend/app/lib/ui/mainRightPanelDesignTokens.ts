/**
 * MRP:14:11 — Main Right Panel header tab geometry contract (Insight + Assistant).
 */

import type React from "react";

import { resolveMrpHeaderControlHeight } from "./mainRightPanelHeaderContract.ts";

export const MRP_TAB_RADIUS = 4;

export const MRP_TAB_DISPLAY_LABELS = Object.freeze(["Insight", "Assistant"] as const);

let lastTabTraceSignature: string | null = null;
let lastUniformRadius: boolean | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveMrpTabBorderRadius(): number {
  return MRP_TAB_RADIUS;
}

export function mrpTabButtonStyle(input: {
  selected: boolean;
  navTileActiveBorder: string;
  navTileActiveBg: string;
  border: string;
  bgControl: string;
  text: string;
  muted: string;
}): React.CSSProperties {
  return {
    height: resolveMrpHeaderControlHeight(),
    padding: "0 12px",
    borderRadius: MRP_TAB_RADIUS,
    border: input.selected ? `1px solid ${input.navTileActiveBorder}` : `1px solid ${input.border}`,
    background: input.selected ? input.navTileActiveBg : input.bgControl,
    color: input.selected ? input.text : input.muted,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}

export function validateMrpTabRadii(radii: readonly number[]): boolean {
  if (radii.length === 0) return true;
  return radii.every((radius) => Math.abs(radius - MRP_TAB_RADIUS) <= 0.01);
}

export function traceNexoraMRPTabs(input?: { observedRadii?: readonly number[] }): void {
  if (!isDev()) return;

  const uniformRadius = validateMrpTabRadii(input?.observedRadii ?? [MRP_TAB_RADIUS]);
  const signature = `${MRP_TAB_RADIUS}:${uniformRadius}:${(input?.observedRadii ?? []).join(",")}`;

  if (lastTabTraceSignature !== signature) {
    lastTabTraceSignature = signature;
    globalThis.console?.log?.(
      `[NexoraMRPTabs] tabRadius=${MRP_TAB_RADIUS} tabs=${MRP_TAB_DISPLAY_LABELS.join(",")}`
    );
  }

  if (lastUniformRadius !== uniformRadius) {
    lastUniformRadius = uniformRadius;
    globalThis.console?.log?.(`[NexoraMRPTabs] uniformRadius=${uniformRadius}`);
    if (!uniformRadius) {
      globalThis.console?.warn?.("[NexoraMRPTabs][Brake] reason=radius_mismatch");
    }
  }
}

export function resetMainRightPanelDesignTokensForTests(): void {
  lastTabTraceSignature = null;
  lastUniformRadius = null;
}
