"use client";

import React from "react";

import {
  resolveAssistantMessageInputFieldStyle,
  resolveAssistantMessageInputShellStyle,
} from "../../../lib/assistant/assistantReadingComfortTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { nx } from "../../ui/nexoraTheme";

export type AssistantMessageInputProps = Readonly<{
  value: string;
  loading?: boolean;
  themeMode?: NexoraHudThemeMode;
  onChange: (value: string) => void;
  onSubmit: () => void;
}>;

export function AssistantMessageInput(props: AssistantMessageInputProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const disabled = props.loading || !props.value.trim();

  return (
    <div
      data-nx="assistant-message-input"
      style={resolveAssistantMessageInputShellStyle(theme)}
    >
      <textarea
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!props.loading && props.value.trim()) props.onSubmit();
          }
        }}
        placeholder="Ask Nexora..."
        rows={2}
        disabled={props.loading}
        aria-label="Message Nexora"
        style={{
          ...resolveAssistantMessageInputFieldStyle(theme),
          opacity: props.loading ? 0.65 : 1,
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={props.onSubmit}
        title="Send"
        aria-label="Send message"
        style={{
          flexShrink: 0,
          alignSelf: "stretch",
          minWidth: 52,
          borderRadius: 10,
          border: `1px solid ${theme.controlBorder}`,
          background: nx.accentSoft,
          color: nx.accent,
          fontSize: 12,
          fontWeight: 800,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        Send
      </button>
    </div>
  );
}

export default AssistantMessageInput;
