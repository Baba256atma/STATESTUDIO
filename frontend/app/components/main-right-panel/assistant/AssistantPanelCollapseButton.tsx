"use client";

import React from "react";

import type { AssistantPanelDockId } from "../../../lib/assistant/assistantPanelDockContract";
import { resolveAssistantPanelCollapseTooltip } from "../../../lib/assistant/assistantPanelDockContract";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantPanelCollapseButtonProps = Readonly<{
  panelId: AssistantPanelDockId;
  themeMode?: NexoraHudThemeMode;
  onCollapse: () => void;
}>;

export function AssistantPanelCollapseButton(
  props: AssistantPanelCollapseButtonProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);

  return (
    <button
      type="button"
      data-nx="assistant-panel-collapse-button"
      data-nx-panel={props.panelId}
      aria-label={resolveAssistantPanelCollapseTooltip(props.panelId)}
      title={resolveAssistantPanelCollapseTooltip(props.panelId)}
      onClick={props.onCollapse}
      style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `1px solid ${theme.controlBorder}`,
        background: theme.controlBackground,
        color: theme.textMuted,
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 700,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ▼
    </button>
  );
}

export default AssistantPanelCollapseButton;
