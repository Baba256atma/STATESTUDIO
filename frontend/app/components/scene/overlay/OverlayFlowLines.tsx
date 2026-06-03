"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import {
  getRuntimeObjPos,
  logConnectionRuntimeProviders,
  resolveRuntimeObjectPositionFromContext,
  type RuntimeObjectPositionContext,
} from "../sceneRenderUtils";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { sanitizeThreeColor } from "../../../lib/scene/threeColorSanitizer";
import {
  recordConnectionLineRebuild,
  recordGeometryCreated,
  recordGeometryDisposed,
} from "../../../lib/diagnostics/connectionRuntimeStabilityAudit";

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
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
};

function buildLineGeometry(
  objects: any[],
  edges: OverlayFlowLineEdge[],
  yOffset: number,
  runtimeObjectPositionContext?: RuntimeObjectPositionContext
): THREE.BufferGeometry | null {
  const positions: number[] = [];
  edges.forEach((edge) => {
    const sourceResolved = resolveRuntimeObjectPositionFromContext(
      edge.from,
      objects,
      runtimeObjectPositionContext
    );
    const targetResolved = resolveRuntimeObjectPositionFromContext(
      edge.to,
      objects,
      runtimeObjectPositionContext
    );
    logConnectionRuntimeProviders({
      connectionId: `${edge.from}__to__${edge.to}`,
      sourceProvider: sourceResolved.provider,
      targetProvider: targetResolved.provider,
    });
    const from = getRuntimeObjPos(edge.from, objects, runtimeObjectPositionContext);
    const to = getRuntimeObjPos(edge.to, objects, runtimeObjectPositionContext);
    positions.push(from.x, from.y + yOffset, from.z, to.x, to.y + yOffset, to.z);
  });
  if (positions.length === 0) return null;
  recordGeometryCreated("overlay-flow-lines");
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

export const OverlayFlowLines = React.memo(function OverlayFlowLines(props: OverlayFlowLinesProps): React.ReactElement | null {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    recordConnectionLineRebuild("overlay-flow-lines");
    return buildLineGeometry(
      props.objects,
      props.edges,
      props.yOffset ?? 0.08,
      props.runtimeObjectPositionContext
    );
  }, [props.edges, props.objects, props.runtimeObjectPositionContext, props.yOffset]);

  useEffect(() => {
    if (!geometry) return;
    return () => {
      geometry.dispose();
      recordGeometryDisposed("overlay-flow-lines");
    };
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!props.animated || !materialRef.current) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.85);
    materialRef.current.opacity =
      props.baseOpacity + (props.pulseOpacity - props.baseOpacity) * pulse * 0.35;
  });

  if (!geometry || props.edges.length === 0) return null;

  const lineColor = sanitizeThreeColor(props.color);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={lineColor}
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
