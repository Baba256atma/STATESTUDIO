"use client";

import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import { cockpit } from "../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly disabled?: boolean;
  readonly placeholder?: string;
  readonly autoFocusPending?: boolean;
  readonly onSubmit: (utterance: string) => void;
};

/**
 * CC:5 — restrained executive conversational input.
 * No Stage / Runtime mutation logic.
 */
export function NexoraConversationalInput({
  disabled = false,
  placeholder = "Ask Nexora or tell it what to focus on…",
  autoFocusPending = false,
  onSubmit,
}: Props) {
  const [value, setValue] = useState("");
  const labelId = useId();

  useEffect(() => {
    if (!autoFocusPending || disabled) return;
    const node = document.querySelector<HTMLTextAreaElement>('[data-testid="nexora-conversational-input-field"]');
    node?.focus();
  }, [autoFocusPending, disabled]);

  const submit = useCallback(() => {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  }, [disabled, onSubmit, value]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <div
      data-testid="nexora-conversational-input"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        paddingTop: "0.45rem",
        borderTop: `1px solid ${cockpit.border}`,
      }}
    >
      <label
        id={labelId}
        htmlFor={`${labelId}-field`}
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cockpit.muted,
        }}
      >
        Ask Nexora
      </label>
      <div style={{ display: "flex", gap: "0.35rem", alignItems: "flex-end" }}>
        <textarea
          id={`${labelId}-field`}
          data-testid="nexora-conversational-input-field"
          aria-labelledby={labelId}
          aria-busy={disabled}
          disabled={disabled}
          rows={2}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            resize: "none",
            border: `1px solid ${cockpit.border}`,
            background: "rgba(0,0,0,0.25)",
            color: cockpit.text,
            fontFamily: "inherit",
            fontSize: "0.78rem",
            lineHeight: 1.35,
            padding: "0.4rem 0.5rem",
            borderRadius: 2,
            outline: "none",
          }}
        />
        <button
          type="button"
          data-testid="nexora-conversational-submit"
          aria-label="Submit to Nexora"
          disabled={disabled || value.trim().length === 0}
          onClick={submit}
          style={{
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.45rem 0.55rem",
            cursor: disabled ? "default" : "pointer",
            fontFamily: "inherit",
            opacity: disabled || value.trim().length === 0 ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
