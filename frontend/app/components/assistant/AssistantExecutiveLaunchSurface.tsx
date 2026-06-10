"use client";

import type React from "react";

import type { AssistantActionCardContext } from "../../lib/assistant-bridge/assistantActionCardContract";
import {
  formatExecutiveContinuityMessage,
  type DashboardExecutiveContextSummary,
} from "../../lib/assistant-bridge/assistantContextSyncContract";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import { AssistantActionCardGroup } from "./AssistantActionCardGroup";

export type AssistantExecutiveLaunchSurfaceProps = {
  context: AssistantActionCardContext;
  syncSummary?: DashboardExecutiveContextSummary | null;
  workspaceAwareMessage?: string | null;
  insightTitle?: string;
  insightSummary?: string;
};

export function AssistantExecutiveLaunchSurface(
  props: AssistantExecutiveLaunchSurfaceProps
): React.ReactElement {
  const objectLabel = props.context.selectedObjectName?.trim() || props.context.selectedObjectId?.trim();
  const continuityMessage = formatExecutiveContinuityMessage(props.syncSummary ?? null);
  const insightTitle = props.insightTitle ?? "Insight Summary";
  const insightSummary =
    props.insightSummary ??
    props.workspaceAwareMessage ??
    continuityMessage ??
    (objectLabel
      ? `Executive context is available for ${objectLabel}. Select a workspace launch action below.`
      : "Select an object in the scene to enable executive workspace launch actions.");

  return (
    <div
      data-nx="assistant-executive-launch-surface"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div style={{ ...softCardStyle, padding: 12 }}>
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {insightTitle}
        </div>
        <div style={{ marginTop: 8, color: nx.textSoft, fontSize: 12, lineHeight: 1.5 }}>
          {insightSummary}
        </div>
        {objectLabel ? (
          <div style={{ marginTop: 8, color: nx.muted, fontSize: 11 }}>
            Context: {objectLabel} · Dashboard mode: {props.context.dashboardMode}
          </div>
        ) : null}
      </div>

      <AssistantActionCardGroup context={props.context} />
    </div>
  );
}

export default AssistantExecutiveLaunchSurface;
