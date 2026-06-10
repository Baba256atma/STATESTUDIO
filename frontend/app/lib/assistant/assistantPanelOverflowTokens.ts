/**
 * MRP:11:2:3 — Executive scroll container sizing + styling tokens.
 */

import type { CSSProperties } from "react";

import type { AssistantPanelDockId } from "./assistantPanelDockContract";
import {
  ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL,
  type AssistantPanelOverflowSizeTier,
} from "./assistantPanelOverflowContract.ts";

/** Derived from design spacing scale (lg=16): compact 8×, small 9×, medium 12×. */
export const ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX: Readonly<
  Record<AssistantPanelOverflowSizeTier, number>
> = Object.freeze({
  compact: 128,
  small: 144,
  medium: 192,
});

export const ASSISTANT_PANEL_SCROLL_CONTAINER_CLASS = "nx-assistant-panel-scroll" as const;

export const ASSISTANT_PANEL_COLLAPSE_MS = 200;

export function resolveAssistantPanelOverflowSizeTier(
  panelId: AssistantPanelDockId
): AssistantPanelOverflowSizeTier {
  return ASSISTANT_PANEL_OVERFLOW_SIZE_BY_PANEL[panelId];
}

export function resolveAssistantPanelMaxHeightPx(panelId: AssistantPanelDockId): number {
  const tier = resolveAssistantPanelOverflowSizeTier(panelId);
  return ASSISTANT_PANEL_OVERFLOW_MAX_HEIGHT_PX[tier];
}

export function resolveAssistantPanelScrollContainerStyle(input: {
  panelId: AssistantPanelDockId;
  visible: boolean;
}): CSSProperties {
  const maxHeightPx = resolveAssistantPanelMaxHeightPx(input.panelId);

  return {
    flexShrink: 0,
    minHeight: 0,
    maxHeight: input.visible ? maxHeightPx : 0,
    opacity: input.visible ? 1 : 0,
    overflowX: "hidden",
    overflowY: input.visible ? "auto" : "hidden",
    overscrollBehavior: "contain",
    pointerEvents: input.visible ? "auto" : "none",
    scrollbarWidth: "thin",
    transition: `max-height ${ASSISTANT_PANEL_COLLAPSE_MS}ms ease, opacity ${ASSISTANT_PANEL_COLLAPSE_MS}ms ease`,
  };
}
