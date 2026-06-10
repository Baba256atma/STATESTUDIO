"use client";

import type React from "react";

import type { ExecutiveConversationContinuity } from "../../lib/assistant-bridge/conversationContinuityContract";
import { dashboardModeLabel } from "../../lib/dashboard/dashboardModeRuntimeContract";
import { nx, softCardStyle } from "../ui/nexoraTheme";

export type AssistantConversationContinuityPanelProps = {
  continuity: ExecutiveConversationContinuity;
  workspaceAwareMessage: string | null;
  promptHints: readonly string[];
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

export function AssistantConversationContinuityPanel(
  props: AssistantConversationContinuityPanelProps
): React.ReactElement {
  const { awareness } = props.continuity;

  return (
    <section
      data-nx="assistant-conversation-continuity-panel"
      data-nx-awareness-level={awareness.awarenessLevel}
      data-nx-lifecycle={awareness.lifecyclePhase}
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
        Conversation Continuity
      </div>

      {props.workspaceAwareMessage ? (
        <div style={{ color: nx.text, fontSize: 12, lineHeight: 1.5 }}>{props.workspaceAwareMessage}</div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {metric("Awareness Level", `L${awareness.awarenessLevel}`)}
        {metric("Intent", awareness.executiveIntent.replace(/_/g, " "))}
        {metric("Workspace", dashboardModeLabel(awareness.currentWorkspace))}
        {metric("Lifecycle", awareness.lifecyclePhase)}
        {metric("Object", awareness.currentObjectName || awareness.currentObjectId || "None")}
        {metric("Tone", awareness.conversationTone)}
      </div>

      {props.promptHints.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              color: nx.lowMuted,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Workspace-Aware Prompts
          </div>
          {props.promptHints.map((hint) => (
            <div
              key={hint}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px dashed ${nx.border}`,
                color: nx.muted,
                fontSize: 11,
                lineHeight: 1.4,
              }}
            >
              {hint}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default AssistantConversationContinuityPanel;
