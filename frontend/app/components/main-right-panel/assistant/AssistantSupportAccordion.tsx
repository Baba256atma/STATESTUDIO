"use client";

import React, { useCallback, useState } from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../../lib/ui/executiveWorkspaceLayout";
import type { ExecutiveAssistantActionCard } from "../../../lib/ui/executiveAssistantPanelTypes";
import { useSceneHudTheme } from "../../../lib/theme/useSceneTheme";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";

export type AssistantSupportPanelId = "guidance" | "scenario" | "decision" | "actions";

export type AssistantSupportAccordionProps = Readonly<{
  guidanceText?: string | null;
  showScenarioHost?: boolean;
  showComparisonHost?: boolean;
  recommendedActions?: readonly ExecutiveAssistantActionCard[];
  themeMode?: NexoraHudThemeMode;
  onActionSelect?: (action: ExecutiveAssistantActionCard) => void;
}>;

type PanelConfig = Readonly<{
  id: AssistantSupportPanelId;
  label: string;
}>;

export function AssistantSupportAccordion(props: AssistantSupportAccordionProps): React.ReactElement {
  const theme = useSceneHudTheme(props.themeMode);
  const [openPanelId, setOpenPanelId] = useState<AssistantSupportPanelId | null>(null);

  const togglePanel = useCallback((id: AssistantSupportPanelId) => {
    setOpenPanelId((current) => (current === id ? null : id));
  }, []);

  const panels: PanelConfig[] = [];
  if (props.guidanceText?.trim()) panels.push({ id: "guidance", label: "Guidance" });
  if (props.showScenarioHost) panels.push({ id: "scenario", label: "Scenario" });
  if (props.showComparisonHost) panels.push({ id: "decision", label: "Decision" });
  if (props.recommendedActions?.length) panels.push({ id: "actions", label: "Actions" });

  const panelOpen = (id: AssistantSupportPanelId) => openPanelId === id;

  return (
    <div
      data-nx="assistant-support-accordion"
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${theme.shellBorder}`,
        background: theme.shellBackground,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        maxHeight: openPanelId ? "36%" : undefined,
      }}
    >
      {panels.length ? (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            padding: "6px 8px",
          }}
        >
          {panels.map((panel) => {
            const open = panelOpen(panel.id);
            return (
              <button
                key={panel.id}
                type="button"
                aria-expanded={open}
                onClick={() => togglePanel(panel.id)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: `1px solid ${open ? theme.accent : theme.controlBorder}`,
                  background: open
                    ? "color-mix(in srgb, var(--nx-accent) 12%, transparent)"
                    : theme.controlBackground,
                  color: open ? theme.text : theme.textMuted,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {panel.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {panelOpen("guidance") && props.guidanceText ? (
        <div
          data-nx="assistant-support-guidance"
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            padding: "8px 12px 10px",
            fontSize: 11,
            lineHeight: 1.5,
            color: theme.textMuted,
            borderTop: `1px solid ${theme.shellBorder}`,
          }}
        >
          {props.guidanceText}
        </div>
      ) : null}

      <div
        style={{
          display: panelOpen("scenario") && props.showScenarioHost ? "flex" : "none",
          flex: "1 1 auto",
          minHeight: 0,
          flexDirection: "column",
          overflow: "hidden",
          borderTop: panelOpen("scenario") ? `1px solid ${theme.shellBorder}` : undefined,
        }}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
          data-nx="executive-scenario-host"
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "auto" }}
        />
      </div>

      <div
        style={{
          display: panelOpen("decision") && props.showComparisonHost ? "flex" : "none",
          flex: "1 1 auto",
          minHeight: 0,
          flexDirection: "column",
          overflow: "hidden",
          borderTop: panelOpen("decision") ? `1px solid ${theme.shellBorder}` : undefined,
        }}
      >
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
          data-nx="executive-comparison-host"
          style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "auto" }}
        />
      </div>

      {panelOpen("actions") && props.recommendedActions?.length ? (
        <div
          data-nx="assistant-support-actions"
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
            padding: "8px 12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            borderTop: `1px solid ${theme.shellBorder}`,
          }}
        >
          {props.recommendedActions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              onClick={() => props.onActionSelect?.(action)}
              style={{
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.controlBackground,
                color: theme.text,
                cursor: action.disabled ? "not-allowed" : "pointer",
                opacity: action.disabled ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700 }}>{action.label}</div>
              {action.hint ? (
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 2 }}>{action.hint}</div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {/* Stable hidden portal targets when support panels are collapsed */}
      {!panelOpen("scenario") && props.showScenarioHost ? (
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
          data-nx="executive-scenario-host"
          aria-hidden
          style={{ display: "none" }}
        />
      ) : null}
      {!panelOpen("decision") && props.showComparisonHost ? (
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
          data-nx="executive-comparison-host"
          aria-hidden
          style={{ display: "none" }}
        />
      ) : null}
    </div>
  );
}

export default AssistantSupportAccordion;
