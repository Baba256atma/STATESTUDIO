"use client";

import React from "react";

import { resolveAssistantSuggestionsTooltip } from "../../../lib/assistant/assistantSuggestionsVisibilityContract";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantSuggestionsToggleButtonProps = Readonly<{
  visible: boolean;
  themeMode?: NexoraHudThemeMode;
  onToggle: () => void;
}>;

export function AssistantSuggestionsToggleButton(
  props: AssistantSuggestionsToggleButtonProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const tooltip = resolveAssistantSuggestionsTooltip(props.visible);

  return (
    <button
      type="button"
      data-nx="assistant-suggestions-toggle"
      data-nx-suggestions-visible={props.visible ? "true" : "false"}
      aria-label={tooltip}
      aria-pressed={props.visible}
      title={tooltip}
      onClick={props.onToggle}
      style={{
        flexShrink: 0,
        width: 26,
        height: 26,
        borderRadius: 8,
        border: `1px solid ${props.visible ? theme.accent : theme.controlBorder}`,
        background: props.visible
          ? "color-mix(in srgb, var(--nx-accent) 10%, transparent)"
          : theme.controlBackground,
        color: props.visible ? theme.text : theme.textMuted,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {props.visible ? "▾" : "▸"}
    </button>
  );
}

export default AssistantSuggestionsToggleButton;
