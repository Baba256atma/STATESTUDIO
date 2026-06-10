"use client";

import React from "react";
import type { DashboardSurfaceEntry } from "../../../lib/dashboard/dashboardSurfaceRegistry.ts";

export type DashboardSurfacePlaceholderProps = {
  entry: DashboardSurfaceEntry;
};

export function DashboardSurfacePlaceholder(props: DashboardSurfacePlaceholderProps): React.ReactElement {
  const { entry } = props;
  return (
    <div
      data-nx="dashboard-surface-placeholder"
      data-surface={entry.id}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        minHeight: 0,
        flex: 1,
        color: "var(--nx-text-secondary, rgba(255,255,255,0.72))",
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
        Dashboard Surface · Placeholder
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "var(--nx-text-primary, #fff)" }}>{entry.title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 420 }}>{entry.description}</div>
      <div style={{ fontSize: 11, opacity: 0.55, marginTop: 8 }}>
        Phase 3:1 foundation — implementation arrives in a future prompt.
      </div>
    </div>
  );
}

export default DashboardSurfacePlaceholder;
