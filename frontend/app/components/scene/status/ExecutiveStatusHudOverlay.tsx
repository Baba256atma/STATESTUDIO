"use client";

import React from "react";
import { Html } from "@react-three/drei";

import { resolveExecutiveStatusHudPlacement } from "../../../lib/scene/executiveStatusPlacement";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayoutOptional } from "../../../lib/ui/useWorkspaceLayout";
import { ExecutiveStatusHud } from "./ExecutiveStatusHud";
import type { ExecutiveStatusHudModel } from "./ExecutiveStatusHud.types";

export type ExecutiveStatusHudOverlayProps = {
  model: ExecutiveStatusHudModel;
  themeMode?: NexoraHudThemeMode;
};

/**
 * E2:22 — Upper-right scene-native executive status intelligence HUD.
 */
export function ExecutiveStatusHudOverlay(props: ExecutiveStatusHudOverlayProps): React.ReactElement {
  const layout = useWorkspaceLayoutOptional();
  const placement = layout?.getHudPlacement("executiveStatusHud");
  const placementStyle = layout
    ? resolveExecutiveStatusHudPlacement(layout.contract)
    : {
        position: "absolute" as const,
        top: 12,
        right: 12,
        zIndex: 6,
        pointerEvents: "none" as const,
        maxWidth: "min(280px, 34vw)",
      };

  if (placement && !placement.visible) return <></>;

  return (
    <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
      <div style={placementStyle}>
        <ExecutiveStatusHud
          model={props.model}
          themeMode={props.themeMode}
          panelSizeMode={placement?.sizeMode ?? "normal"}
        />
      </div>
    </Html>
  );
}

export default ExecutiveStatusHudOverlay;
