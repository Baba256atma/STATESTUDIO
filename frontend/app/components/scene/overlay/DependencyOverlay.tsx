"use client";

import React, { useMemo } from "react";

import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { collectDependencyOverlayEdges } from "../../../lib/relationships/relationshipRuntime";
import { OverlayFlowLines, overlayThemeToFlowProps } from "./OverlayFlowLines";

export type DependencyOverlayProps = {
  objects: any[];
  sceneJson: unknown;
  visible: boolean;
  themeTokens: OverlayThemeTokens;
};

/** E2:23 foundation — renders object dependency edges without mutating scene contracts. */
export const DependencyOverlay = React.memo(function DependencyOverlay(
  props: DependencyOverlayProps
): React.ReactElement | null {
  const edges = useMemo(() => collectDependencyOverlayEdges(props.sceneJson), [props.sceneJson]);

  const flowProps = overlayThemeToFlowProps(props.themeTokens, "dependency");

  if (!props.visible || edges.length === 0) return null;

  return (
    <group data-nx-overlay="dependency">
      <OverlayFlowLines objects={props.objects} edges={edges} animated={false} yOffset={0.06} {...flowProps} />
    </group>
  );
});

export default DependencyOverlay;
