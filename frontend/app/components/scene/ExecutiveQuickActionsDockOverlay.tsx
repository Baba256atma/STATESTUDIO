"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";
import {
  ExecutiveQuickActionsDock,
  type ExecutiveQuickActionsDockProps,
} from "./ExecutiveQuickActionsDock";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";

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
  const focusHud = useFocusHudPresentation("quickActionsDock", placement.visible);

  if (!placement.visible) return <></>;

  return (
    <SceneHudOverlayRoot
      panelId="quickActionsDock"
      style={{
        ...hudStyle("quickActionsDock"),
        ...focusHud.style,
      }}
    >
      <ExecutiveQuickActionsDock {...dockProps} panelSizeMode={placement.sizeMode} />
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveQuickActionsDockOverlay;
