"use client";

import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly collapsed: boolean;
  readonly onToggle: () => void;
};

export function ExecutiveAdvisorCollapseButton({
  collapsed,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      data-testid="executive-advisor-collapse"
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Expand Advisor" : "Collapse Advisor"}
      onClick={onToggle}
      style={{
        padding: collapsed ? "0.35rem 0.3rem" : "0.28rem 0.45rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(255,255,255,0.03)",
        color: cockpit.muted,
        fontSize: "0.58rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        width: collapsed ? "100%" : "auto",
      }}
    >
      {collapsed ? "▶" : "◀ Collapse"}
    </button>
  );
}
