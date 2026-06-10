"use client";

import type React from "react";

import type { AssistantActionCardContext } from "../../lib/assistant-bridge/assistantActionCardContract";
import { useAssistantConversationContinuity } from "../../lib/assistant-bridge/useAssistantConversationContinuity";
import { AssistantConversationContinuityPanel } from "../assistant/AssistantConversationContinuityPanel";
import { AssistantExecutiveContextPanel } from "../assistant/AssistantExecutiveContextPanel";
import { AssistantExecutiveLaunchSurface } from "../assistant/AssistantExecutiveLaunchSurface";
import { nx } from "../ui/nexoraTheme";

export type MainRightPanelAssistantPlaceholderProps = {
  actionCardContext: AssistantActionCardContext;
};

export function MainRightPanelAssistantPlaceholder(
  props: MainRightPanelAssistantPlaceholderProps
): React.ReactElement {
  const { continuity, workspaceAwareMessage, promptHints } = useAssistantConversationContinuity();
  const syncSummary = continuity.lastSyncSummary;

  return (
    <div
      data-nx="mrp-assistant-placeholder"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        overflow: "auto",
      }}
    >
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${nx.border}`,
          background: nx.bgElevated,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Nexora Assistant
        </div>
        <div style={{ color: nx.text, fontSize: 14, fontWeight: 700 }}>Strategic consultant</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
          Executive action cards launch Dashboard workspaces through the bridge. Assistant suggests;
          Dashboard Runtime executes.
        </div>
      </div>

      <AssistantExecutiveContextPanel syncSummary={syncSummary} />

      <AssistantConversationContinuityPanel
        continuity={continuity}
        workspaceAwareMessage={workspaceAwareMessage}
        promptHints={promptHints}
      />

      <AssistantExecutiveLaunchSurface
        context={props.actionCardContext}
        syncSummary={syncSummary}
        workspaceAwareMessage={workspaceAwareMessage}
      />

      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          borderRadius: 12,
          border: `1px dashed ${nx.border}`,
          background: nx.bgControl,
          color: nx.lowMuted,
          fontSize: 12,
        }}
      >
        Consultant input will appear here. Action cards are launch surfaces only.
      </div>
    </div>
  );
}

export default MainRightPanelAssistantPlaceholder;
