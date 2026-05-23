"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { getObjPos } from "../sceneRenderUtils";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";

export type OverlayFlowLineEdge = {
  from: string;
  to: string;
  strength: number;
  depth?: number;
};

export type OverlayFlowLinesProps = {
  objects: any[];
  edges: OverlayFlowLineEdge[];
  color: string;
  glowColor: string;
  baseOpacity: number;
  pulseOpacity: number;
  yOffset?: number;
  animated?: boolean;
};

function buildLineGeometry(
  objects: any[],
  edges: OverlayFlowLineEdge[],
  yOffset: number
): THREE.BufferGeometry | null {
  const positions: number[] = [];
  edges.forEach((edge) => {
    const from = getObjPos(edge.from, objects);
    const to = getObjPos(edge.to, objects);
    positions.push(from.x, from.y + yOffset, from.z, to.x, to.y + yOffset, to.z);
  });
  if (positions.length === 0) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

export const OverlayFlowLines = React.memo(function OverlayFlowLines(props: OverlayFlowLinesProps): React.ReactElement | null {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(
    () => buildLineGeometry(props.objects, props.edges, props.yOffset ?? 0.08),
    [props.edges, props.objects, props.yOffset]
  );

  useFrame(({ clock }) => {
    if (!props.animated || !materialRef.current) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.85);
    materialRef.current.opacity =
      props.baseOpacity + (props.pulseOpacity - props.baseOpacity) * pulse * 0.35;
  });

  if (!geometry || props.edges.length === 0) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={props.color}
        transparent
        opacity={props.baseOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
});

export function overlayThemeToFlowProps(
  tokens: OverlayThemeTokens,
  variant: "propagation" | "risk_flow" | "scenario" | "dependency"
): Pick<OverlayFlowLinesProps, "color" | "glowColor" | "baseOpacity" | "pulseOpacity"> {
  if (variant === "risk_flow") {
    return {
      color: tokens.riskFlowColor,
      glowColor: tokens.riskFlowGlow,
      baseOpacity: tokens.baseOpacity * 0.95,
      pulseOpacity: tokens.pulseOpacity,
    };
  }
  if (variant === "scenario") {
    return {
      color: tokens.scenarioColor,
      glowColor: tokens.scenarioGlow,
      baseOpacity: tokens.baseOpacity * 0.82,
      pulseOpacity: tokens.pulseOpacity * 0.9,
    };
  }
  if (variant === "dependency") {
    return {
      color: tokens.dependencyColor,
      glowColor: tokens.dependencyGlow,
      baseOpacity: tokens.baseOpacity * 0.55,
      pulseOpacity: tokens.pulseOpacity * 0.65,
    };
  }
  return {
    color: tokens.propagationColor,
    glowColor: tokens.propagationGlow,
    baseOpacity: tokens.baseOpacity,
    pulseOpacity: tokens.pulseOpacity,
  };
}
