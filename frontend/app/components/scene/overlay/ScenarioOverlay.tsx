"use client";

import React, { useEffect, useMemo } from "react";

import type { DecisionPathOverlayState } from "../../../lib/simulation/decisionPathOverlayTypes";
import { decisionPathOverlayToEdges } from "../../../lib/overlay/mergePropagationOverlay";
import { logScenarioOverlayRendered } from "../../../lib/overlay/overlayInstrumentation";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { OverlayFlowLines, overlayThemeToFlowProps } from "./OverlayFlowLines";
import type { RuntimeObjectPositionContext } from "../sceneRenderUtils";

export type ScenarioOverlayProps = {
  objects: any[];
  overlay: DecisionPathOverlayState | null | undefined;
  visible: boolean;
  themeTokens: OverlayThemeTokens;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
};

export const ScenarioOverlay = React.memo(function ScenarioOverlay(
  props: ScenarioOverlayProps
): React.ReactElement | null {
  const edges = useMemo(() => decisionPathOverlayToEdges(props.overlay), [props.overlay]);
  const flowProps = overlayThemeToFlowProps(props.themeTokens, "scenario");

  useEffect(() => {
    if (!props.visible || edges.length === 0) return;
    logScenarioOverlayRendered({
      edgeCount: edges.length,
      sourceId: props.overlay?.sourceId ?? null,
      actionId: props.overlay?.meta?.actionId ?? null,
    });
  }, [edges.length, props.overlay?.meta?.actionId, props.overlay?.sourceId, props.visible]);

  if (!props.visible || !props.overlay?.active || edges.length === 0) return null;

  return (
    <group data-nx-overlay="scenario">
      <OverlayFlowLines
        objects={props.objects}
        edges={edges}
        animated
        yOffset={0.14}
        runtimeObjectPositionContext={props.runtimeObjectPositionContext}
        {...flowProps}
      />
    </group>
  );
});

export default ScenarioOverlay;
