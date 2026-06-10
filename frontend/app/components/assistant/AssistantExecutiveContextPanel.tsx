"use client";

import type React from "react";

import {
  formatExecutiveContinuityMessage,
  type DashboardExecutiveContextSummary,
} from "../../lib/assistant-bridge/assistantContextSyncContract";
import { dashboardModeLabel } from "../../lib/dashboard/dashboardModeRuntimeContract";
import { nx, softCardStyle } from "../ui/nexoraTheme";

export type AssistantExecutiveContextPanelProps = {
  syncSummary: DashboardExecutiveContextSummary | null;
};

function metric(label: string, value: string): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: nx.lowMuted,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, fontWeight: 650, color: nx.textSoft, lineHeight: 1.3 }}>
        {value}
      </div>
    </div>
  );
}

export function AssistantExecutiveContextPanel(
  props: AssistantExecutiveContextPanelProps
): React.ReactElement | null {
  const summary = props.syncSummary;
  if (!summary) return null;

  const continuityMessage = formatExecutiveContinuityMessage(summary);

  return (
    <section
      data-nx="assistant-executive-context-panel"
      data-nx-sync-completion={summary.completionStatus}
      style={{ ...softCardStyle, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div
        style={{
          color: nx.lowMuted,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Executive Continuity
      </div>

      {continuityMessage ? (
        <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.5 }}>{continuityMessage}</div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {metric("Current Workspace", dashboardModeLabel(summary.workspaceType))}
        {metric("Completion", summary.completionStatus.replace(/_/g, " "))}
        {metric("Object", summary.objectName || summary.objectId || "None")}
        {metric("Route", summary.routeType.replace(/_/g, " "))}
      </div>
    </section>
  );
}

export default AssistantExecutiveContextPanel;
