"use client";

import React from "react";

import { resolveSceneNavigationToolbarPlacement } from "../../../lib/scene/sceneNavigationPlacement";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayoutOptional } from "../../../lib/ui/useWorkspaceLayout";
import { SceneHudOverlayRoot } from "../SceneHudOverlayRoot";
import { ExecutiveSceneToolbar } from "./ExecutiveSceneToolbar";

export type ExecutiveSceneToolbarOverlayProps = {
  themeMode?: NexoraHudThemeMode;
};

const TOOLBAR_VISIBLE_Z_INDEX = 1600;
const loggedToolbarVisibleSignatures = new Set<string>();

function logToolbarVisibleOnce(input: {
  visible: true;
  placement: "TOP_RIGHT" | "TOP_CENTER";
  collisionResolved: true;
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = JSON.stringify(input);
  if (loggedToolbarVisibleSignatures.has(signature)) return;
  loggedToolbarVisibleSignatures.add(signature);
  console.debug("[Nexora][ToolbarVisible]", input);
}

/**
 * E2:21 — Top-center scene-native executive navigation toolbar.
 */
export function ExecutiveSceneToolbarOverlay(props: ExecutiveSceneToolbarOverlayProps): React.ReactElement {
  const layout = useWorkspaceLayoutOptional();
  const density =
    layout?.contract.breakpoint === "mobile" || layout?.contract.breakpoint === "tablet"
      ? layout.contract.breakpoint
      : "desktop";
  const basePlacementStyle = layout
    ? resolveSceneNavigationToolbarPlacement(layout.contract)
    : {
        position: "absolute" as const,
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: TOOLBAR_VISIBLE_Z_INDEX,
        pointerEvents: "none" as const,
      };
  const placement: "TOP_RIGHT" | "TOP_CENTER" =
    layout?.contract.breakpoint === "compactDesktop" || layout?.contract.breakpoint === "wideDesktop"
      ? "TOP_RIGHT"
      : "TOP_CENTER";
  const placementStyle: React.CSSProperties =
    placement === "TOP_RIGHT"
      ? {
          ...basePlacementStyle,
          top: Math.max(Number(basePlacementStyle.top ?? 12), 12),
          right: 16,
          left: "auto",
          transform: "none",
          zIndex: TOOLBAR_VISIBLE_Z_INDEX,
          pointerEvents: "none",
          maxWidth: "min(360px, calc(100vw - 32px))",
        }
      : {
          ...basePlacementStyle,
          top: Math.max(Number(basePlacementStyle.top ?? 12), 12),
          zIndex: TOOLBAR_VISIBLE_Z_INDEX,
          pointerEvents: "none",
        };

  logToolbarVisibleOnce({
    visible: true,
    placement,
    collisionResolved: true,
  });

  return (
    <SceneHudOverlayRoot panelId="sceneToolbar" style={placementStyle}>
      <ExecutiveSceneToolbar themeMode={props.themeMode} density={density} />
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveSceneToolbarOverlay;
