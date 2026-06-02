"use client";

import React, { useMemo } from "react";

import type { ExecutiveScenarioPropagationView } from "../../../lib/scene/scenario/executiveScenarioPlaybackTypes";
import { OverlayFlowLines, overlayThemeToFlowProps } from "./OverlayFlowLines";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";

export type ScenarioPlaybackPropagationLayerProps = {
  objects: any[];
  view: ExecutiveScenarioPropagationView | null;
  visible: boolean;
  themeTokens: OverlayThemeTokens;
};

export const ScenarioPlaybackPropagationLayer = React.memo(function ScenarioPlaybackPropagationLayer(
  props: ScenarioPlaybackPropagationLayerProps
): React.ReactElement | null {
  const edges = useMemo(
    () =>
      (props.view?.propagationEdges ?? []).map((edge) => ({
        from: edge.from,
        to: edge.to,
        strength: edge.strength,
        depth: edge.depth,
      })),
    [props.view?.propagationEdges]
  );

  const flowProps = overlayThemeToFlowProps(
    props.themeTokens,
    props.view?.kind === "opportunity" ? "scenario" : "risk_flow"
  );

  if (!props.visible || !props.view || edges.length === 0) return null;

  return (
    <group data-nx-overlay="scenario-playback-propagation">
      <OverlayFlowLines
        objects={props.objects}
        edges={edges}
        animated
        yOffset={props.view.kind === "opportunity" ? 0.16 : 0.12}
        {...flowProps}
      />
    </group>
  );
});

export default ScenarioPlaybackPropagationLayer;
