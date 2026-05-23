"use client";

import React, { useEffect, useMemo } from "react";

import type { PropagationOverlayState } from "../../../lib/simulation/propagationTypes";
import { propagationOverlayToEdges } from "../../../lib/overlay/mergePropagationOverlay";
import { logPropagationOverlayRendered } from "../../../lib/overlay/overlayInstrumentation";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { OverlayFlowLines, overlayThemeToFlowProps } from "./OverlayFlowLines";

export type PropagationOverlayProps = {
  objects: any[];
  overlay: PropagationOverlayState | null | undefined;
  visible: boolean;
  themeTokens: OverlayThemeTokens;
};

export const PropagationOverlay = React.memo(function PropagationOverlay(
  props: PropagationOverlayProps
): React.ReactElement | null {
  const edges = useMemo(() => propagationOverlayToEdges(props.overlay), [props.overlay]);
  const flowProps = overlayThemeToFlowProps(props.themeTokens, "propagation");

  useEffect(() => {
    if (!props.visible || edges.length === 0) return;
    logPropagationOverlayRendered({
      edgeCount: edges.length,
      sourceObjectId: props.overlay?.source_object_id ?? null,
      mode: props.overlay?.mode ?? null,
    });
  }, [edges.length, props.overlay?.mode, props.overlay?.source_object_id, props.visible]);

  if (!props.visible || !props.overlay?.active || edges.length === 0) return null;

  return (
    <group data-nx-overlay="propagation">
      <OverlayFlowLines
        objects={props.objects}
        edges={edges}
        animated
        yOffset={0.1}
        {...flowProps}
      />
    </group>
  );
});

export default PropagationOverlay;
