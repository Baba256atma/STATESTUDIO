/**
 * E2:71 — Signature-gated HUD layout diagnostics (read-only; no state mutation).
 */

import { buildHudZoneLayoutSignature } from "./hudLayoutSignature";

export type HudLayoutLogCategory =
  | "TopAlignment"
  | "HudGrid"
  | "SafeZone"
  | "ToolbarSafeZone"
  | "TimelineSafeZone"
  | "HiddenPanel"
  | "LayoutAudit"
  | "ResponsiveLayoutApplied"
  | "HudAnchorUpdated";

const layoutWriteCounters: Record<string, number> = {
  layoutWrites: 0,
  anchorWrites: 0,
  auditRuns: 0,
  resizeEvents: 0,
};

const emittedLogKeys = new Set<string>();

export function shouldEmitHudLayoutLog(category: HudLayoutLogCategory, signature: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const key = `${category}:${signature}`;
  if (emittedLogKeys.has(key)) return false;
  emittedLogKeys.add(key);
  return true;
}

export function emitHudLayoutLog(
  label: string,
  category: HudLayoutLogCategory,
  signature: string,
  payload: Record<string, unknown>
): void {
  if (!shouldEmitHudLayoutLog(category, signature)) return;
  globalThis.console?.debug?.(label, payload);
}

export function emitHudLayoutZoneLog(
  label: string,
  category: HudLayoutLogCategory,
  payload: Record<string, unknown>,
  viewportWidth?: number
): void {
  const signature = buildHudZoneLayoutSignature(category, payload, viewportWidth);
  emitHudLayoutLog(label, category, signature, payload);
}

export function recordHudLayoutWrite(kind: "layout" | "anchor" | "audit" | "resize"): void {
  if (process.env.NODE_ENV === "production") return;
  if (kind === "layout") layoutWriteCounters.layoutWrites += 1;
  if (kind === "anchor") layoutWriteCounters.anchorWrites += 1;
  if (kind === "audit") layoutWriteCounters.auditRuns += 1;
  if (kind === "resize") layoutWriteCounters.resizeEvents += 1;
}

export function getHudLayoutWriteCounters(): Readonly<typeof layoutWriteCounters> {
  return layoutWriteCounters;
}

export function resetHudLayoutLogGuardForTests(): void {
  emittedLogKeys.clear();
  layoutWriteCounters.layoutWrites = 0;
  layoutWriteCounters.anchorWrites = 0;
  layoutWriteCounters.auditRuns = 0;
  layoutWriteCounters.resizeEvents = 0;
}
