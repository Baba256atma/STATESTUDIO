"use client";

import React from "react";

import {
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  resolveAssistantPanelExpandTooltip,
  type AssistantPanelDockId,
} from "../../../lib/assistant/assistantPanelDockContract";
import {
  useAssistantPanelDockControls,
  useAssistantSupportAccordionOpenPanelId,
} from "../../../lib/assistant/useAssistantPanelDock";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

const PANEL_COLLAPSE_MS = 200;

export type AssistantPanelIconDockProps = Readonly<{
  availablePanels: readonly AssistantPanelDockId[];
  themeMode?: NexoraHudThemeMode;
}>;

export function AssistantPanelIconDock(props: AssistantPanelIconDockProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const openPanelId = useAssistantSupportAccordionOpenPanelId();
  const { expandPanel } = useAssistantPanelDockControls();

  const collapsedPanels = props.availablePanels.filter((panelId) => panelId !== openPanelId);

  if (!collapsedPanels.length) {
    return <></>;
  }

  return (
    <div
      data-nx="assistant-panel-icon-dock"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        gap: 4,
        padding: "4px 6px",
      }}
    >
      {collapsedPanels.map((panelId) => {
        const definition = ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId];
        return (
          <button
            key={panelId}
            type="button"
            data-nx="assistant-panel-icon-dock-button"
            data-nx-panel={panelId}
            aria-label={resolveAssistantPanelExpandTooltip(panelId)}
            title={resolveAssistantPanelExpandTooltip(panelId)}
            onClick={() => expandPanel(panelId)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.text,
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: `opacity ${PANEL_COLLAPSE_MS}ms ease, transform ${PANEL_COLLAPSE_MS}ms ease`,
            }}
          >
            {definition.icon}
          </button>
        );
      })}
    </div>
  );
}

export default AssistantPanelIconDock;
