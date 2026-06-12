import type React from "react";

import { nx } from "../../components/ui/nexoraTheme.ts";
import {
  SCENE_PANEL_ACTION_BUTTON_FONT_SIZE,
  SCENE_PANEL_ACTION_BUTTON_GAP,
  SCENE_PANEL_ACTION_BUTTON_HEIGHT,
  SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH,
  SCENE_PANEL_ACTION_BUTTON_PADDING_X,
} from "../scene/scenePanelCommandSurfaceContract.ts";

export {
  SCENE_PANEL_ACTION_BUTTON_COUNT,
  SCENE_PANEL_ACTION_BUTTON_FONT_SIZE,
  SCENE_PANEL_ACTION_BUTTON_GAP,
  SCENE_PANEL_ACTION_BUTTON_HEIGHT,
  SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH,
  SCENE_PANEL_ACTION_BUTTON_PADDING_X,
  SCENE_PANEL_TITLE_ROW_HEIGHT,
} from "../scene/scenePanelCommandSurfaceContract.ts";

/** Single-row horizontal command strip — never wraps. */
export const SCENE_PANEL_COMMAND_STRIP_STYLE = Object.freeze({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "stretch",
  gap: SCENE_PANEL_ACTION_BUTTON_GAP,
  minWidth: 0,
  overflowX: "hidden",
  width: "100%",
  flexShrink: 0,
} as const satisfies React.CSSProperties);

export function scenePanelCommandButtonStyle(
  primary = false,
  active = false
): React.CSSProperties {
  return {
    minHeight: SCENE_PANEL_ACTION_BUTTON_HEIGHT,
    height: SCENE_PANEL_ACTION_BUTTON_HEIGHT,
    minWidth: SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH,
    padding: `0 ${SCENE_PANEL_ACTION_BUTTON_PADDING_X}px`,
    borderRadius: 8,
    border: primary || active ? "1px solid rgba(56,189,248,0.38)" : `1px solid ${nx.borderSoft}`,
    background: primary || active ? "rgba(56,189,248,0.14)" : "rgba(2,6,23,0.32)",
    color: primary || active ? nx.text : nx.textSoft,
    fontSize: SCENE_PANEL_ACTION_BUTTON_FONT_SIZE,
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    cursor: "pointer",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "1 1 auto",
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
}

/** @deprecated Use SCENE_PANEL_COMMAND_STRIP_STYLE */
export const SCENE_PANEL_HEADER_ACTION_ROW_STYLE = SCENE_PANEL_COMMAND_STRIP_STYLE;

/** @deprecated Use scenePanelCommandButtonStyle */
export function scenePanelHeaderActionButtonStyle(
  primary = false,
  active = false
): React.CSSProperties {
  return scenePanelCommandButtonStyle(primary, active);
}
