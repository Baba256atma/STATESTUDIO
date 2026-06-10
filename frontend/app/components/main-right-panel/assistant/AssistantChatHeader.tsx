"use client";

import React from "react";

import type { ExecutiveAssistantStatus } from "../../../lib/ui/executiveAssistantPanelTypes";
import { ASSISTANT_READING_COMFORT_TOKENS } from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
export type AssistantChatHeaderProps = Readonly<{
  status: ExecutiveAssistantStatus;
  contextLabel?: string | null;
  themeMode?: NexoraHudThemeMode;
  onCollapse?: () => void;
}>;

function statusColor(
  phase: ExecutiveAssistantStatus["phase"],
  theme: ReturnType<typeof useSceneHudTheme>
): string {
  if (phase === "online") return theme.success;
  if (phase === "processing") return theme.accent;
  return theme.textSecondary;
}

export function AssistantChatHeader(props: AssistantChatHeaderProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const indicator = statusColor(props.status.phase, theme);

  return (
    <header
      data-nx="assistant-chat-header"
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: `${ASSISTANT_READING_COMFORT_TOKENS.header.paddingY}px ${ASSISTANT_READING_COMFORT_TOKENS.header.paddingX}px`,
        borderBottom: `1px solid ${theme.shellBorder}`,
        background: theme.headerBackground,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: theme.text,
          }}
        >
          Nexora AI
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
            fontSize: 10,
            fontWeight: 600,
            color: theme.textMuted,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: indicator,
              boxShadow: `0 0 6px ${indicator}88`,
            }}
          />
          <span>{props.status.label}</span>
          {props.contextLabel ? (
            <>
              <span aria-hidden>·</span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 180,
                }}
              >
                {props.contextLabel}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
        {props.onCollapse ? (
          <button
            type="button"
            onClick={props.onCollapse}
            title="Collapse assistant"
            aria-label="Collapse assistant"
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: 8,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.textMuted,
              cursor: "pointer",
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            ⟩
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default AssistantChatHeader;
