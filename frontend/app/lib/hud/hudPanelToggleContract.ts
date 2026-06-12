/**
 * MRP_HUD:14:7 — Unified expand/collapse control for Scene / Object / Timeline HUD panels.
 */

export type HudPanelToggleId = "scene" | "object" | "timeline";

export type HudPanelToggleState = "expanded" | "collapsed";

export const HUD_TOGGLE_BUTTON_SIZE = 28;
export const HUD_TOGGLE_BUTTON_RADIUS = 6;

const loggedToggleKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

/** Expanded body visible → ▼ (collapse). Collapsed/minimized → ▲ (expand). */
export function resolveHudPanelToggleIcon(expanded: boolean): string {
  return expanded ? "▼" : "▲";
}

export function resolveHudPanelToggleState(expanded: boolean): HudPanelToggleState {
  return expanded ? "expanded" : "collapsed";
}

export function resolveHudPanelToggleAriaLabel(
  panelId: HudPanelToggleId,
  expanded: boolean
): string {
  if (panelId === "scene") {
    return expanded ? "Minimize scene panel" : "Expand scene panel";
  }
  if (panelId === "object") {
    return expanded ? "Collapse object panel" : "Expand object panel";
  }
  return expanded ? "Compact timeline" : "Expand timeline";
}

export function resolveHudPanelToggleTitle(
  panelId: HudPanelToggleId,
  expanded: boolean
): string {
  if (panelId === "scene") {
    return expanded ? "Minimize" : "Expand";
  }
  if (panelId === "object") {
    return expanded ? "Collapse" : "Expand";
  }
  return expanded ? "Compact" : "Expand";
}

export function traceNexoraHudToggle(panelId: HudPanelToggleId, expanded: boolean): void {
  if (!isDev()) return;
  const state = resolveHudPanelToggleState(expanded);
  const key = `${panelId}:${state}`;
  if (loggedToggleKeys.has(key)) return;
  loggedToggleKeys.add(key);
  globalThis.console?.log?.(`[NexoraHudToggle] panel=${panelId} shared=true state=${state}`);
}

export function resetHudPanelToggleContractForTests(): void {
  loggedToggleKeys.clear();
}
