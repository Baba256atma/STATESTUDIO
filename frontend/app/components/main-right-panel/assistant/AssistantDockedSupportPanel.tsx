"use client";

import React from "react";

import {
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  type AssistantPanelDockId,
} from "../../../lib/assistant/assistantPanelDockContract";
import {
  useAssistantPanelDockControls,
  useAssistantPanelVisible,
} from "../../../lib/assistant/useAssistantPanelDock";
import { ASSISTANT_PANEL_COLLAPSE_MS } from "../../../lib/assistant/assistantPanelOverflowTokens";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { AssistantPanelCollapseButton } from "./AssistantPanelCollapseButton";
import { AssistantPanelScrollContainer } from "./AssistantPanelScrollContainer";

export type AssistantDockedSupportPanelProps = Readonly<{
  panelId: AssistantPanelDockId;
  available?: boolean;
  themeMode?: NexoraHudThemeMode;
  children: React.ReactNode;
}>;

export function AssistantDockedSupportPanel(
  props: AssistantDockedSupportPanelProps
): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const visible = useAssistantPanelVisible(props.panelId);
  const { collapsePanel } = useAssistantPanelDockControls();
  const definition = ASSISTANT_PANEL_DOCK_DEFINITIONS[props.panelId];

  if (props.available === false) {
    return <></>;
  }

  return (
    <section
      data-nx="assistant-docked-support-panel"
      data-nx-panel={props.panelId}
      data-nx-expanded={visible ? "true" : "false"}
      aria-hidden={!visible}
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
        borderTop: visible ? `1px solid ${theme.shellBorder}` : "1px solid transparent",
        background: theme.shellBackground,
        transition: `opacity ${ASSISTANT_PANEL_COLLAPSE_MS}ms ease`,
      }}
    >
      {visible ? (
        <header
          data-nx="assistant-docked-support-panel-header"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "6px 10px",
            borderBottom: `1px solid ${theme.shellBorder}`,
          }}
        >
          <div
            style={{
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: theme.text,
            }}
          >
            <span aria-hidden>{definition.icon}</span>
            <span>{definition.label}</span>
          </div>
          <AssistantPanelCollapseButton
            panelId={props.panelId}
            themeMode={props.themeMode}
            onCollapse={() => collapsePanel(props.panelId)}
          />
        </header>
      ) : null}

      <AssistantPanelScrollContainer panelId={props.panelId} visible={visible}>
        {props.children}
      </AssistantPanelScrollContainer>
    </section>
  );
}

export default AssistantDockedSupportPanel;
