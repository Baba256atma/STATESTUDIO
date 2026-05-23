"use client";

import React from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import {
  logExecutiveAssistantCollapsed,
  logExecutiveAssistantExpanded,
} from "../../lib/ui/executiveAssistantInstrumentation";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";

export type ExecutiveAssistantPanelShellProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** E2:13 — stacked scenario suggestions host below assistant. */
  showScenarioHost?: boolean;
  /** E2:14 — scenario comparison workspace below suggestions. */
  showComparisonHost?: boolean;
  children?: React.ReactNode;
};

function toggleButtonStyle(theme: ReturnType<typeof useSceneHudTheme>): React.CSSProperties {
  return {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 8,
    border: `1px solid ${theme.controlBorder}`,
    background: theme.buttonBackground,
    color: theme.buttonText,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function HiddenPortalHost(props: { id: string; "data-nx": string }): React.ReactElement {
  return (
    <div
      id={props.id}
      data-nx={props["data-nx"]}
      aria-hidden
      style={{ display: "none" }}
    />
  );
}

export function ExecutiveAssistantPanelShell(
  props: ExecutiveAssistantPanelShellProps
): React.ReactElement {
  const showScenarioHost = props.showScenarioHost ?? false;
  const showComparisonHost = props.showComparisonHost ?? false;
  const stackedExecutiveColumn = showScenarioHost || showComparisonHost;
  const { contract } = useWorkspaceLayout();
  const theme = useSceneHudTheme();
  const stack = contract.rightRailStack;
  const transitionMs = contract.transitionMs;

  const handleToggle = React.useCallback(() => {
    if (props.collapsed) {
      logExecutiveAssistantExpanded();
    } else {
      logExecutiveAssistantCollapsed();
    }
    props.onToggleCollapsed();
  }, [props.collapsed, props.onToggleCollapsed]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("nexora:executive-assistant-collapsed-changed", {
        detail: { collapsed: props.collapsed },
      })
    );
  }, [props.collapsed]);

  if (props.collapsed) {
    return (
      <div
        id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantShell}
        data-nx="executive-assistant-shell"
        data-nx-state="collapsed"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          flex: "1 1 auto",
          background: theme.shellBackground,
          borderLeft: `1px solid ${theme.shellBorder}`,
        }}
      >
        <header
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "10px 6px",
            borderBottom: `1px solid ${theme.shellBorder}`,
          }}
        >
          <span
            aria-hidden
            title="Nexora AI online"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: theme.success,
              boxShadow: theme.mode === "night" ? `0 0 8px color-mix(in srgb, ${theme.success} 55%, transparent)` : undefined,
            }}
          />
          <button
            type="button"
            aria-label="Expand Nexora AI assistant"
            title="Expand Nexora AI assistant"
            onClick={handleToggle}
            style={toggleButtonStyle(theme)}
          >
            ⟨
          </button>
          <span
            aria-hidden
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: theme.label,
            }}
          >
            AI
          </span>
        </header>
        <HiddenPortalHost
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost}
          data-nx="executive-assistant-host"
        />
        {showScenarioHost ? (
          <HiddenPortalHost
            id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
            data-nx="executive-scenario-host"
          />
        ) : null}
        {showComparisonHost ? (
          <HiddenPortalHost
            id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
            data-nx="executive-comparison-host"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantShell}
      data-nx="executive-assistant-shell"
      data-nx-state="expanded"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        flex: "1 1 auto",
        minWidth: 0,
        background: theme.shellBackground,
        borderLeft: `1px solid ${theme.shellBorder}`,
        boxShadow: theme.shellShadow,
      }}
    >
      <div
        id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost}
        data-nx="executive-assistant-host"
        style={{
          flex: stackedExecutiveColumn ? `0 1 ${Math.round(stack.assistantFlex * 100)}%` : "1 1 auto",
          minHeight: stackedExecutiveColumn ? 180 : 0,
          maxHeight: stackedExecutiveColumn ? stack.assistantMaxHeight : undefined,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderBottom: stackedExecutiveColumn ? `1px solid ${theme.shellBorder}` : undefined,
          transition: `flex-basis ${transitionMs}ms ease, max-height ${transitionMs}ms ease`,
        }}
      >
        {props.children}
      </div>
      {showScenarioHost ? (
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}
          data-nx="executive-scenario-host"
          style={{
            flex: showComparisonHost
              ? `0 1 ${Math.round(stack.scenarioFlex * 100)}%`
              : `1 1 ${Math.round((stack.scenarioFlex + stack.comparisonFlex) * 100)}%`,
            minHeight: showComparisonHost ? 130 : 200,
            maxHeight: showComparisonHost ? stack.scenarioMaxHeight : undefined,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderBottom: showComparisonHost ? `1px solid ${theme.shellBorder}` : undefined,
            transition: `flex-basis ${transitionMs}ms ease, max-height ${transitionMs}ms ease`,
          }}
        />
      ) : null}
      {showComparisonHost ? (
        <div
          id={EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}
          data-nx="executive-comparison-host"
          style={{
            flex: `1 1 ${Math.round(stack.comparisonFlex * 100)}%`,
            minHeight: 160,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: `flex-basis ${transitionMs}ms ease`,
          }}
        />
      ) : null}
    </div>
  );
}
