"use client";

import React, { useEffect, useRef } from "react";

import {
  resolveAssistantConversationAreaStyle,
  resolveAssistantMessageBubbleStyle,
} from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantConversationMessage = Readonly<{
  id: string;
  role: "user" | "assistant";
  text: string;
}>;

export type AssistantConversationAreaProps = Readonly<{
  messages: readonly AssistantConversationMessage[];
  loading?: boolean;
  themeMode?: NexoraHudThemeMode;
  emptyStateMessage?: string;
}>;

export function AssistantConversationArea(props: AssistantConversationAreaProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const listRef = useRef<HTMLDivElement | null>(null);
  const emptyMessage =
    props.emptyStateMessage ??
    "Ask Nexora about this workspace, object, scenario, or decision.";

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [props.messages.length, props.loading]);

  return (
    <div
      ref={listRef}
      data-nx="assistant-conversation-area"
      style={resolveAssistantConversationAreaStyle()}
    >
      {props.messages.length === 0 ? (
        <div
          style={{
            margin: "auto 0",
            padding: "12px 4px",
            fontSize: 12,
            color: theme.textMuted,
            lineHeight: 1.62,
            textAlign: "center",
          }}
        >
          {emptyMessage}
        </div>
      ) : (
        props.messages.map((message) => (
          <div
            key={message.id}
            data-nx="assistant-reading-message"
            data-nx-role={message.role}
            style={resolveAssistantMessageBubbleStyle({
              role: message.role,
              theme,
            })}
          >
            {message.text}
          </div>
        ))
      )}
      {props.loading ? (
        <div
          style={{
            ...resolveAssistantMessageBubbleStyle({ role: "assistant", theme }),
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Analyzing...
        </div>
      ) : null}
    </div>
  );
}

export default AssistantConversationArea;
