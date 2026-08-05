"use client";

import type { ExecutiveActionPriority } from "./hooks/useExecutiveActionInbox";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly priority: ExecutiveActionPriority;
};

const TONE: Record<ExecutiveActionPriority, string> = {
  Critical: "#F04438",
  High: "#FDB022",
  Normal: cockpit.muted,
};

export function ExecutiveActionBadge({ priority }: Props) {
  if (priority === "Normal") return null;
  const color = TONE[priority];
  return (
    <span
      data-testid={`executive-action-badge-${priority.toLowerCase()}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.1rem 0.32rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${color}55`,
        background: `${color}18`,
        color,
        fontSize: "0.5rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {priority}
    </span>
  );
}
