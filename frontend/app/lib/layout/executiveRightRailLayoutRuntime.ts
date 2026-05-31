/**
 * E2:61 — Right rail width: SSR default first, responsive after hydration.
 */

import { EXECUTIVE_HUD_SSR_LAYOUT } from "./executiveHudSSRContract";
import {
  getExecutiveHudViewportWidth,
  isExecutiveHudLayoutHydrated,
} from "./executiveHudHydrationRuntime";
import {
  EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX,
  resolveExecutiveWorkspaceBreakpoint,
} from "../ui/executiveWorkspaceLayout";
import type { WorkspaceLayoutPreset } from "../ui/workspaceLayoutTypes";

export const EXECUTIVE_RIGHT_RAIL_SSR_WIDTH_PX = EXECUTIVE_HUD_SSR_LAYOUT.rightRailWidth;

export function resolveExecutiveRightRailWidth(
  preset: WorkspaceLayoutPreset,
  viewportWidth?: number
): number {
  if (viewportWidth == null && !isExecutiveHudLayoutHydrated()) {
    return EXECUTIVE_RIGHT_RAIL_SSR_WIDTH_PX;
  }

  const width = viewportWidth ?? getExecutiveHudViewportWidth();
  const breakpoint = resolveExecutiveWorkspaceBreakpoint(width);
  const base = EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX;

  if (breakpoint === "mobile") return Math.min(base, 320);
  if (breakpoint === "tablet") return Math.min(base + 20, 380);
  if (preset === "analysis") return base + 48;
  if (preset === "simulation") return base + 64;
  return base;
}
