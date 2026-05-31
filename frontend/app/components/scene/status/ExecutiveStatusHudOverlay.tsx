"use client";

import React from "react";

import { resolveExecutiveStatusHudPlacement } from "../../../lib/scene/executiveStatusPlacement";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useFocusHudPresentation } from "../../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayoutOptional } from "../../../lib/ui/useWorkspaceLayout";
import { SceneHudOverlayRoot } from "../SceneHudOverlayRoot";
import { ExecutiveStatusHud } from "./ExecutiveStatusHud";
import type { ExecutiveStatusHudModel } from "./ExecutiveStatusHud.types";

export type ExecutiveStatusHudOverlayProps = {
  model: ExecutiveStatusHudModel;
  themeMode?: NexoraHudThemeMode;
  commandBarVisible?: boolean;
};

/**
 * E2:22 — Upper-right scene-native executive status intelligence HUD.
 */
export function ExecutiveStatusHudOverlay(props: ExecutiveStatusHudOverlayProps): React.ReactElement {
  const layout = useWorkspaceLayoutOptional();
  const placement = layout?.getHudPlacement("executiveStatusHud");
  const focusHud = useFocusHudPresentation("executiveStatusHud", placement?.visible ?? true);
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

  if (placement && !placement.visible && !focusHud.preserveMount) return <></>;

  return (
    <SceneHudOverlayRoot panelId="executiveStatusHud" style={{ ...placementStyle, ...focusHud.style }}>
      <ExecutiveStatusHud
        model={props.model}
        themeMode={props.themeMode}
        panelSizeMode={placement?.sizeMode ?? "normal"}
        commandBarVisible={props.commandBarVisible ?? true}
      />
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveStatusHudOverlay;
