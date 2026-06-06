"use client";

import React from "react";
import { Html } from "@react-three/drei";

import type { ExecutiveTimelineHudModel } from "../../lib/scene/executiveTimelineHudTypes";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import { ExecutiveTimelineHud } from "./ExecutiveTimelineHud";

export type ExecutiveTimelineHudOverlayProps = {
  model: ExecutiveTimelineHudModel;
  themeMode?: NexoraHudThemeMode;
};

/**
 * ARCHITECTURE CONTRACT:
 * Bottom-center scene-native Timeline HUD. Timeline is not a Main Right Panel
 * tab, Left Nav page, modal, or separate route.
 * See docs/nexora-timeline-architecture.md.
 */
export function ExecutiveTimelineHudOverlay(props: ExecutiveTimelineHudOverlayProps): React.ReactElement {
  const { hudStyle, getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("timelineHud");

  if (!placement.visible) return <></>;

  return (
    <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
      <div style={hudStyle("timelineHud")}>
        <ExecutiveTimelineHud
          {...props.model}
          themeMode={props.themeMode}
          panelSizeMode={placement.sizeMode}
          expanded={placement.sizeMode === "expanded"}
        />
      </div>
    </Html>
  );
}

export default ExecutiveTimelineHudOverlay;
