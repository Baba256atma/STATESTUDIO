/**
 * E2:61 — Right rail width: SSR default first, responsive after hydration.
 * MRP:11:2:4 — Assistant rail width uses reading-comfort adaptive resolver.
 */

import { resolveAssistantRailWidth } from "../assistant/assistantRailWidthRuntime";
import { EXECUTIVE_HUD_SSR_LAYOUT } from "./executiveHudSSRContract";
import {
  getExecutiveHudViewportWidth,
  isExecutiveHudLayoutHydrated,
} from "./executiveHudHydrationRuntime";
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
  return resolveAssistantRailWidth({ viewportWidth: width, preset });
}
