"use client";

import type React from "react";

import {
  EXECUTIVE_WORKSPACE_ZONE_IDS,
  type ExecutiveWorkspaceLayoutMetrics,
} from "../../lib/ui/executiveWorkspaceLayout";
import { nx } from "../ui/nexoraTheme";
import { ScenePanelShell } from "./ScenePanelShell";

export type ExecutiveLeftDockZoneProps = {
  metrics: ExecutiveWorkspaceLayoutMetrics;
  scenePanelCollapsed: boolean;
  onToggleScenePanelCollapsed: () => void;
  onAddObjectPlaceholderClick?: () => void;
};

/**
 * ARCHITECTURE CONTRACT:
 * Left dock zone hosts the canonical scene-native Scene Panel. This is not
 * Left Navigation and not Main Right Panel. See docs/nexora-scene-panel-architecture.md.
 */
export function ExecutiveLeftDockZone(props: ExecutiveLeftDockZoneProps): React.ReactElement {
  const widthPx = props.metrics.leftDockWidthPx;

  return (
    <aside
      id={EXECUTIVE_WORKSPACE_ZONE_IDS.leftDock}
      data-nx-zone="left-dock"
      data-nx-dock-state={props.scenePanelCollapsed ? "collapsed" : "expanded"}
      aria-label="Scene workspace dock"
      style={{
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: `${widthPx}px`,
        width: widthPx,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        position: "relative",
        height: "100%",
        borderRight: `1px solid ${nx.borderStrong}`,
        background: nx.bgShell,
        backdropFilter: "blur(10px)",
        transition: "width 160ms ease, flex-basis 160ms ease",
        overflow: "hidden",
      }}
    >
      <div
        id={EXECUTIVE_WORKSPACE_ZONE_IDS.leftDockHost}
        data-nx-slot="scene-panel"
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ScenePanelShell
          collapsed={props.scenePanelCollapsed}
          onToggleCollapsed={props.onToggleScenePanelCollapsed}
          onAddObjectClick={props.onAddObjectPlaceholderClick}
        />
      </div>
    </aside>
  );
}
