"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  nexoraHudSectionLabelStyle,
  type NexoraHudThemeMode,
} from "../../lib/scene/nexoraHudTheme";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { useViewportWidthListener } from "../../lib/dom/useDomListener";
import {
  logExecutiveCommandBarActionTriggered,
  logExecutiveCommandBarMounted,
  logExecutiveCommandBarThemeResolved,
  logExecutiveDecisionStatusRendered,
  logExecutiveFrsiStatusRendered,
  logExecutiveReadinessRendered,
  logExecutiveScenarioStatusRendered,
} from "../../lib/ui/executiveCommandBarInstrumentation";
import {
  EXECUTIVE_COMMAND_BAR_ACTIONS,
  type ExecutiveCommandBarActionId,
  type ExecutiveCommandBarModel,
  type ExecutivePrioritySemantic,
} from "../../lib/ui/executiveCommandBarTypes";
import { ExecutiveViewModeControlResponsive } from "./ExecutiveViewModeControl";
import { ExecutiveLayoutPresetControlResponsive } from "./ExecutiveLayoutPresetControl";
import { ExecutiveHudSettingsMenu } from "./ExecutiveHudSettingsMenu";

export type ExecutiveCommandBarProps = {
  model: ExecutiveCommandBarModel;
  themeMode?: NexoraHudThemeMode;
  onAction?: (actionId: ExecutiveCommandBarActionId) => void;
};

function priorityColor(priority: ExecutivePrioritySemantic, theme: ReturnType<typeof useSceneHudTheme>): string {
  if (priority === "critical") return theme.critical;
  if (priority === "warning") return theme.warning;
  if (priority === "attention") return theme.accent;
  return theme.success;
}

function StatusBlock(props: {
  title: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  priority: ExecutivePrioritySemantic;
  theme: ReturnType<typeof useSceneHudTheme>;
}): React.ReactElement {
  const accent = priorityColor(props.priority, props.theme);
  return (
    <div
      style={{
        minWidth: 0,
        flex: "1 1 140px",
        padding: "8px 10px",
        borderRadius: 10,
        border: `1px solid ${props.theme.controlBorder}`,
        background: props.theme.controlBackground,
        boxShadow: props.theme.mode === "night" ? `inset 0 0 0 1px ${accent}12` : undefined,
      }}
    >
      <div style={{ ...nexoraHudSectionLabelStyle(props.theme), marginBottom: 4 }}>{props.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        <span
          aria-hidden
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accent,
            boxShadow: props.theme.mode === "night" ? `0 0 8px ${accent}66` : undefined,
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 13, fontWeight: 800, color: props.theme.text, lineHeight: 1.2, minWidth: 0 }}>
          {props.primary}
        </div>
      </div>
      <div style={{ marginTop: 4, fontSize: 10, fontWeight: 600, color: props.theme.textMuted, lineHeight: 1.35 }}>
        {props.secondary}
      </div>
      {props.tertiary ? (
        <div style={{ marginTop: 2, fontSize: 10, fontWeight: 700, color: accent, lineHeight: 1.35 }}>{props.tertiary}</div>
      ) : null}
    </div>
  );
}

export function ExecutiveCommandBar(props: ExecutiveCommandBarProps): React.ReactElement {
  const { model, themeMode = "night", onAction } = props;
  const mountedRef = useRef(false);
  const theme = useSceneHudTheme(themeMode);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );

  useViewportWidthListener(setViewportWidth, "ExecutiveCommandBar");

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    logExecutiveCommandBarMounted();
  }, []);

  useEffect(() => {
    logExecutiveCommandBarThemeResolved(theme.mode);
  }, [theme.mode]);

  useEffect(() => {
    logExecutiveFrsiStatusRendered(model.frsi.score);
    logExecutiveScenarioStatusRendered(model.scenario.name);
    logExecutiveDecisionStatusRendered(model.decision.phase);
    logExecutiveReadinessRendered(model.readiness.phase);
  }, [model.decision.phase, model.frsi.score, model.readiness.phase, model.scenario.name]);

  const layoutMode = viewportWidth < 768 ? "mobile" : viewportWidth < 1100 ? "tablet" : "desktop";

  const handleAction = (actionId: ExecutiveCommandBarActionId) => {
    logExecutiveCommandBarActionTriggered(actionId);
    onAction?.(actionId);
  };

  return (
    <div
      id="nexora-executive-command-bar"
      data-hud="executive-command-bar"
      data-nx-layout={layoutMode}
      style={{
        position: "relative",
        zIndex: 12,
        flexShrink: 0,
        borderBottom: `1px solid ${theme.shellBorder}`,
        background: theme.shellBackground,
        backdropFilter: "blur(14px)",
        boxShadow: theme.shellShadow,
        color: theme.text,
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: layoutMode === "mobile" ? "10px 12px" : "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: layoutMode === "mobile" ? "wrap" : "nowrap",
            gap: 8,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: layoutMode === "mobile" ? "wrap" : "nowrap",
              gap: 8,
              alignItems: "stretch",
              flex: "1 1 auto",
              minWidth: 0,
            }}
          >
          <StatusBlock
            title="FRSI"
            primary={model.frsi.score != null ? `FRSI ${model.frsi.score}` : "FRSI —"}
            secondary={model.frsi.fragilityLabel}
            tertiary={model.frsi.trendLabel}
            priority={model.frsi.priority}
            theme={theme}
          />
          <StatusBlock
            title="Scenario"
            primary={model.scenario.name}
            secondary={model.scenario.stateLabel}
            priority={model.scenario.priority}
            theme={theme}
          />
          <StatusBlock
            title="Decision"
            primary={model.decision.label}
            secondary="Executive decision state"
            priority={model.decision.priority}
            theme={theme}
          />
          <StatusBlock
            title="Readiness"
            primary={model.readiness.label}
            secondary="System readiness"
            priority={model.readiness.priority}
            theme={theme}
          />
          </div>
          <div
            style={{
              display: "inline-flex",
              flexDirection: layoutMode === "mobile" ? "column" : "row",
              alignItems: layoutMode === "mobile" ? "stretch" : "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <ExecutiveHudSettingsMenu />
            <ExecutiveLayoutPresetControlResponsive />
            <ExecutiveViewModeControlResponsive />
          </div>
        </div>

        {model.miniInsight ? (
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: theme.textMuted,
              lineHeight: 1.4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0 2px",
            }}
            title={model.miniInsight}
          >
            {model.miniInsight}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          {EXECUTIVE_COMMAND_BAR_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleAction(action.id)}
              title={action.label}
              style={{
                height: 28,
                padding: "0 10px",
                borderRadius: 8,
                border: `1px solid ${theme.controlBorder}`,
                background: theme.buttonBackground,
                color: theme.buttonText,
                fontSize: 10,
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
