"use client";

import {
  useCallback,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ATTACHMENTS_PLACEHOLDER } from "./ExecutiveConversationConfig";

type Props = {
  readonly disabled?: boolean;
  readonly onSend: (text: string) => void;
  readonly onStop?: () => void;
  readonly generating?: boolean;
};

export function ExecutiveConversationInput({
  disabled = false,
  onSend,
  onStop,
  generating = false,
}: Props) {
  const [value, setValue] = useState("");

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled || generating) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, generating, onSend]);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div
      data-testid="executive-conversation-input"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
        flexShrink: 0,
      }}
    >
      <textarea
        data-testid="executive-conversation-textarea"
        aria-label="Ask Nexora"
        placeholder="Ask Nexora..."
        value={value}
        disabled={disabled || generating}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={4}
        style={{
          width: "100%",
          minHeight: 80,
          resize: "vertical",
          borderRadius: cockpit.radius.md,
          border: `1px solid ${cockpit.border}`,
          background: "rgba(255,255,255,0.03)",
          color: cockpit.text,
          fontSize: "0.8rem",
          lineHeight: 1.45,
          padding: "0.65rem 0.7rem",
          fontFamily: "inherit",
          outline: "none",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.45rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
          <button
            type="button"
            data-testid="executive-conversation-attach"
            disabled
            title={ATTACHMENTS_PLACEHOLDER}
            aria-disabled="true"
            style={ghostBtn}
          >
            Attach
          </button>
          <button
            type="button"
            data-testid="executive-conversation-voice"
            disabled
            title="Voice conversation is not available in this release"
            aria-disabled="true"
            style={ghostBtn}
          >
            Voice
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {generating && onStop ? (
            <button
              type="button"
              data-testid="executive-conversation-stop"
              onClick={onStop}
              style={{
                ...ghostBtn,
                border: "1px solid #F0443866",
                background: "#F0443820",
                color: "#F04438",
                cursor: "pointer",
                opacity: 1,
              }}
            >
              Stop
            </button>
          ) : null}
          <button
            type="button"
            data-testid="executive-conversation-send"
            disabled={disabled || generating || !value.trim()}
            onClick={submit}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: cockpit.radius.sm,
              border: `1px solid ${cockpit.accent}`,
              background: `${cockpit.accent}22`,
              color: cockpit.accent,
              fontSize: "0.66rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor:
                disabled || generating || !value.trim()
                  ? "default"
                  : "pointer",
              fontFamily: "inherit",
              opacity: disabled || generating || !value.trim() ? 0.45 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const ghostBtn = {
  padding: "0.35rem 0.5rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.lowMuted,
  fontSize: "0.58rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  cursor: "not-allowed",
  fontFamily: "inherit",
  opacity: 0.55,
};
