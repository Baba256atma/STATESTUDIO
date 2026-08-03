"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ExecutiveSignalSeverity } from "./ExecutiveSignalTypes";

const COLOR: Record<ExecutiveSignalSeverity, string> = {
  Low: "#98A2B3",
  Medium: "#53B1FD",
  High: "#FDB022",
  Critical: "#F04438",
};

type Props = {
  readonly severity: ExecutiveSignalSeverity;
};

export function ExecutivePriorityBadge({ severity }: Props) {
  const color = COLOR[severity];
  return (
    <span
      data-testid={`executive-priority-badge-${severity.toLowerCase()}`}
      style={{
        padding: "0.15rem 0.4rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${color}`,
        background: `${color}22`,
        color,
        fontSize: "0.55rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {severity}
    </span>
  );
}
