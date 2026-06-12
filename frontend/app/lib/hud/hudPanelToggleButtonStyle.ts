import type React from "react";

import { nx } from "../../components/ui/nexoraTheme.ts";
import {
  HUD_TOGGLE_BUTTON_RADIUS,
  HUD_TOGGLE_BUTTON_SIZE,
} from "./hudPanelToggleContract.ts";

export function hudPanelToggleButtonStyle(options?: {
  disabled?: boolean;
  hovered?: boolean;
}): React.CSSProperties {
  const disabled = options?.disabled === true;
  const hovered = options?.hovered === true && !disabled;
  return {
    flexShrink: 0,
    width: HUD_TOGGLE_BUTTON_SIZE,
    height: HUD_TOGGLE_BUTTON_SIZE,
    minWidth: HUD_TOGGLE_BUTTON_SIZE,
    minHeight: HUD_TOGGLE_BUTTON_SIZE,
    borderRadius: HUD_TOGGLE_BUTTON_RADIUS,
    border: `1px solid ${nx.border}`,
    background: hovered
      ? "color-mix(in srgb, var(--nx-bg-control) 88%, transparent)"
      : nx.btnSecondaryBg,
    color: nx.textSoft,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };
}
