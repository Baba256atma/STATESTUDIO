"use client";

import React from "react";
import { Html } from "@react-three/drei";

import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import {
  ExecutiveQuickActionsDock,
  type ExecutiveQuickActionsDockProps,
} from "./ExecutiveQuickActionsDock";

export type ExecutiveQuickActionsDockOverlayProps = ExecutiveQuickActionsDockProps & {
  /** When true, dock sits above the timeline HUD stack. */
  stackAboveTimeline?: boolean;
};

/**
 * E2:16 — Bottom-center scene-native executive quick actions dock.
 */
export function ExecutiveQuickActionsDockOverlay(
  props: ExecutiveQuickActionsDockOverlayProps
): React.ReactElement {
  const { stackAboveTimeline = false, ...dockProps } = props;
  const { hudStyle, getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("quickActionsDock");

  if (!placement.visible) return <></>;

  return (
    <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
      <div style={hudStyle("quickActionsDock")}>
        <ExecutiveQuickActionsDock {...dockProps} panelSizeMode={placement.sizeMode} />
      </div>
    </Html>
  );
}

export default ExecutiveQuickActionsDockOverlay;
