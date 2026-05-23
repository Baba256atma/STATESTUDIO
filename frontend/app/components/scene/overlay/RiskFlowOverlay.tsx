"use client";

import React, { useEffect, useMemo } from "react";

import type { PropagationOverlayState } from "../../../lib/simulation/propagationTypes";
import { logRiskFlowOverlayRendered } from "../../../lib/overlay/overlayInstrumentation";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { OverlayFlowLines, overlayThemeToFlowProps } from "./OverlayFlowLines";

export type RiskFlowOverlayProps = {
  objects: any[];
  visible: boolean;
  themeTokens: OverlayThemeTokens;
  riskSources?: string[] | null;
  riskTargets?: string[] | null;
  propagation?: PropagationOverlayState | null;
};

export const RiskFlowOverlay = React.memo(function RiskFlowOverlay(
  props: RiskFlowOverlayProps
): React.ReactElement | null {
  const edges = useMemo(() => {
    const sources = (props.riskSources ?? []).map(String).filter(Boolean);
    const targets = (props.riskTargets ?? []).map(String).filter(Boolean);
    if (sources.length > 0 && targets.length > 0) {
      return sources.flatMap((from, index) => {
        const to = targets[index % targets.length];
        return to ? [{ from, to, strength: 0.82, depth: 1 }] : [];
      });
    }
    const propagationEdges = (props.propagation?.impacted_edges ?? [])
      .filter((edge) => Number(edge.strength ?? 0) >= 0.55)
      .map((edge) => ({
        from: String(edge.from),
        to: String(edge.to),
        strength: Number(edge.strength ?? 0.7),
        depth: Number(edge.depth ?? 1),
      }));
    return propagationEdges;
  }, [props.propagation?.impacted_edges, props.riskSources, props.riskTargets]);

  const flowProps = overlayThemeToFlowProps(props.themeTokens, "risk_flow");

  useEffect(() => {
    if (!props.visible || edges.length === 0) return;
    logRiskFlowOverlayRendered({
      edgeCount: edges.length,
      sourceCount: props.riskSources?.length ?? 0,
      targetCount: props.riskTargets?.length ?? 0,
    });
  }, [edges.length, props.riskSources?.length, props.riskTargets?.length, props.visible]);

  if (!props.visible || edges.length === 0) return null;

  return (
    <group data-nx-overlay="risk-flow">
      <OverlayFlowLines objects={props.objects} edges={edges} animated yOffset={0.12} {...flowProps} />
    </group>
  );
});

export default RiskFlowOverlay;
