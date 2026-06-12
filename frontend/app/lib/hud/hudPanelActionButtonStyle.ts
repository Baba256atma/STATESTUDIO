import type React from "react";

import { nx } from "../../components/ui/nexoraTheme";

/** Shared executive HUD panel action button chrome (Scene + Object panels). */
export function hudPanelActionButtonStyle(
  primary = false,
  active = false
): React.CSSProperties {
  return {
    minHeight: 34,
    padding: "0 10px",
    borderRadius: 8,
    border: primary || active ? "1px solid rgba(56,189,248,0.38)" : `1px solid ${nx.borderSoft}`,
    background: primary || active ? "rgba(56,189,248,0.14)" : "rgba(2,6,23,0.32)",
    color: primary || active ? nx.text : nx.textSoft,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    cursor: "pointer",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 0,
    flex: "1 1 calc(50% - 4px)",
  };
}
