/**
 * MRP_NAV:14:10 — Unified left navigation button corner radius contract.
 */

import type React from "react";

export const LEFT_NAV_BUTTON_RADIUS = 4;
export const LEFT_NAV_UTILITY_BUTTON_COUNT = 2;

let lastStyleTraceSignature: string | null = null;
let lastUniformRadius: boolean | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveLeftNavButtonBorderRadius(): number {
  return LEFT_NAV_BUTTON_RADIUS;
}

export function leftNavPrimaryButtonStyle(input: {
  active: boolean;
  navTileActiveBorder: string;
  navTileActiveBg: string;
  navTileInactiveBg: string;
  navTileActiveShadow: string;
  border: string;
  text: string;
  muted: string;
}): React.CSSProperties {
  return {
    height: 54,
    borderRadius: LEFT_NAV_BUTTON_RADIUS,
    border: input.active ? `1px solid ${input.navTileActiveBorder}` : `1px solid ${input.border}`,
    background: input.active ? input.navTileActiveBg : input.navTileInactiveBg,
    color: input.active ? input.text : input.muted,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    boxShadow: input.active ? input.navTileActiveShadow : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 3,
    padding: "0 8px",
  };
}

export function leftNavUtilityButtonStyle(input: {
  active: boolean;
  navTileActiveBorder: string;
  navTileActiveBg: string;
  navTileActiveShadow: string;
  border: string;
  bgPanelSoft: string;
  text: string;
  lowMuted: string;
}): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    padding: 0,
    borderRadius: LEFT_NAV_BUTTON_RADIUS,
    border: input.active ? `1px solid ${input.navTileActiveBorder}` : `1px solid ${input.border}`,
    background: input.active ? input.navTileActiveBg : input.bgPanelSoft,
    color: input.active ? input.text : input.lowMuted,
    boxShadow: input.active ? input.navTileActiveShadow : "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

export function validateLeftNavButtonRadii(radii: readonly number[]): boolean {
  if (radii.length === 0) return true;
  return radii.every((radius) => Math.abs(radius - LEFT_NAV_BUTTON_RADIUS) <= 0.01);
}

export function traceNexoraLeftNavStyle(input: {
  buttonCount: number;
  observedRadii?: readonly number[];
}): void {
  if (!isDev()) return;

  const uniformRadius = validateLeftNavButtonRadii(input.observedRadii ?? [LEFT_NAV_BUTTON_RADIUS]);
  const signature = `${input.buttonCount}:${uniformRadius}:${(input.observedRadii ?? []).join(",")}`;

  if (lastStyleTraceSignature !== signature) {
    lastStyleTraceSignature = signature;
    globalThis.console?.log?.(
      `[NexoraLeftNavStyle] radius=${LEFT_NAV_BUTTON_RADIUS} buttonCount=${input.buttonCount}`
    );
  }

  if (lastUniformRadius !== uniformRadius) {
    lastUniformRadius = uniformRadius;
    globalThis.console?.log?.(`[NexoraLeftNavStyle] uniformRadius=${uniformRadius}`);
    if (!uniformRadius) {
      globalThis.console?.warn?.("[NexoraLeftNavStyle][Brake] reason=mixed_corner_radius_detected");
    }
  }
}

export function resolveLeftNavInteractiveButtonCount(primaryButtonCount: number): number {
  return primaryButtonCount + LEFT_NAV_UTILITY_BUTTON_COUNT;
}

export function resetLeftNavDesignTokensForTests(): void {
  lastStyleTraceSignature = null;
  lastUniformRadius = null;
}
