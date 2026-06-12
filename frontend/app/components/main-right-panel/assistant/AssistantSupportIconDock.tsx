"use client";

import React, { useEffect } from "react";

import {
  ASSISTANT_PANEL_DOCK_DEFINITIONS,
  resolveAssistantPanelExpandTooltip,
} from "../../../lib/assistant/assistantPanelDockContract";
import { ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER } from "../../../lib/assistant/assistantSupportAccordionContract";
import {
  useAssistantPanelDockControls,
  useAssistantSupportAccordionOpenPanelId,
} from "../../../lib/assistant/useAssistantPanelDock";
import { traceMrp127AssistantSupportDockMounted } from "../../../lib/assistant/mrp127RuntimeDiagnostics";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { nx } from "../../ui/nexoraTheme";

export type AssistantSupportIconDockProps = Readonly<{
  themeMode?: NexoraHudThemeMode;
}>;

/** MRP:12:7 — Executive utility icon dock (right rail of Assistant workspace). */
export function AssistantSupportIconDock(props: AssistantSupportIconDockProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const openPanelId = useAssistantSupportAccordionOpenPanelId();
  const { togglePanel } = useAssistantPanelDockControls();

  useEffect(() => {
    traceMrp127AssistantSupportDockMounted();
  }, []);

  return (
    <div
      data-nx="assistant-support-icon-dock"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 4,
        padding: "4px 6px",
      }}
    >
      {ASSISTANT_SUPPORT_ACCORDION_PANEL_ORDER.map((panelId) => {
        const definition = ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId];
        const selected = openPanelId === panelId;
        return (
          <button
            key={panelId}
            type="button"
            data-nx="assistant-support-icon-dock-button"
            data-nx-panel={panelId}
            aria-pressed={selected}
            aria-label={resolveAssistantPanelExpandTooltip(panelId)}
            title={resolveAssistantPanelExpandTooltip(panelId)}
            onClick={() => togglePanel(panelId)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: selected ? `1px solid ${nx.accent}` : `1px solid ${theme.controlBorder}`,
              background: theme.controlBackground,
              color: theme.text,
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: selected ? `0 0 0 1px ${nx.accentSoft}` : undefined,
            }}
          >
            {definition.icon}
          </button>
        );
      })}
    </div>
  );
}

export default AssistantSupportIconDock;
