"use client";

import React from "react";

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../../lib/ui/executiveWorkspaceLayout";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import { useSceneHudTheme } from "../../lib/theme/useSceneTheme";

export type MainRightPanelAssistantStackHostsProps = Readonly<{
  showScenarioHost?: boolean;
  showComparisonHost?: boolean;
}>;

/**
 * Portal targets for Type-C assistant tab — same host ids as ExecutiveAssistantPanelShell.
 * Renders inside visible MainRightPanelShell assistant tabpanel (MRP:10:12).
 */
export function MainRightPanelAssistantStackHosts(
  props: MainRightPanelAssistantStackHostsProps
): React.ReactElement {
  const showScenarioHost = props.showScenarioHost ?? true;
  const showComparisonHost = props.showComparisonHost ?? true;
  const stackedExecutiveColumn = showScenarioHost || showComparisonHost;
  const { contract } = useWorkspaceLayout();
  const theme = useSceneHudTheme();
  const stack = contract.rightRailStack;
  const transitionMs = contract.transitionMs;

  return (
    <div
      data-nx="mrp-assistant-stack"
      style={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: theme.shellBackground,
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
      />
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

export default MainRightPanelAssistantStackHosts;
