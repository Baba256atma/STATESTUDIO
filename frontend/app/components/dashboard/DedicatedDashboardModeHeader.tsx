"use client";

import React, { useEffect } from "react";

import {
  dashboardModeLabel,
  type DashboardMode,
} from "../../lib/dashboard/dashboardModeRuntimeContract";
import { DASHBOARD_HOME_RETURN_ACTION_LABEL } from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeReturnPathContract";
import { traceMrp10Runtime, logMrp10RuntimeRenderChain } from "../../lib/dashboard/dashboardHomeReturnPath/dashboardHomeRuntimeTrace";
import { discoverExecutiveWorkspace } from "../../lib/dashboard/executiveWorkspaceRegistryRuntime";
import { nx } from "../ui/nexoraTheme";

export type DedicatedDashboardModeHeaderProps = Readonly<{
  mode: DashboardMode;
  onReturnToDashboardHome?: () => void;
}>;

export function DedicatedDashboardModeHeader(
  props: DedicatedDashboardModeHeaderProps
): React.ReactElement {
  const modeLabel = dashboardModeLabel(props.mode);
  const workspaceEntry = discoverExecutiveWorkspace({ by: "dashboardMode", mode: props.mode });
  const workspaceTitle = workspaceEntry?.name ?? `${modeLabel} Workspace`;

  useEffect(() => {
    traceMrp10Runtime("DedicatedDashboardModeHeader mounted", {
      activeTab: "dashboard",
      dashboardMode: props.mode,
      rendering: "DedicatedDashboardModeHeader",
    });
    logMrp10RuntimeRenderChain({
      activeTab: "dashboard",
      dashboardMode: props.mode,
      rendering: "DedicatedDashboardModeHeader",
    });
  }, [props.mode]);

  return (
    <header
      data-nx="dedicated-dashboard-mode-header"
      data-nx-dashboard-mode={props.mode}
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 14px",
        borderBottom: `1px solid ${nx.borderSoft}`,
        background: nx.bgElevated,
      }}
    >
      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: nx.lowMuted,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Dedicated Workspace
        </div>
        <div style={{ color: nx.text, fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
          {workspaceTitle}
        </div>
        <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.35 }}>
          Active mode: {modeLabel}
        </div>
      </div>

      {props.onReturnToDashboardHome ? (
        <button
          type="button"
          data-nx="dashboard-home-return"
          onClick={props.onReturnToDashboardHome}
          style={{
            flexShrink: 0,
            height: 34,
            padding: "0 14px",
            borderRadius: 999,
            border: `1px solid ${nx.navTileActiveBorder}`,
            background: nx.navTileActiveBg,
            color: nx.text,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {DASHBOARD_HOME_RETURN_ACTION_LABEL}
        </button>
      ) : null}
    </header>
  );
}

export default DedicatedDashboardModeHeader;
