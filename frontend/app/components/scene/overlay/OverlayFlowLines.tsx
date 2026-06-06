"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import {
  getRuntimeObjPos,
  logConnectionRuntimeProviders,
  resolveRuntimeObjectPositionFromContext,
  type RuntimeObjectPositionContext,
} from "../sceneRenderUtils";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import {
  NEXORA_THREE_COLOR_TOKENS,
  sanitizeThreeColor,
} from "../../../lib/scene/threeColorSanitizer";
import { recordGeometryCreated } from "../../../lib/diagnostics/connectionRuntimeStabilityAudit";
import { buildOverlayFlowGeometrySignature } from "../../../lib/scene/topology/connectionGeometrySignature";
import { resolveStableOverlayFlowGeometry } from "../../../lib/scene/topology/connectionGeometryRuntime";

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

const OVERLAY_FLOW_COLOR_FALLBACK = "#93c5fd";

function resolveOverlayFlowThreeColor(input: unknown, fallback = OVERLAY_FLOW_COLOR_FALLBACK): string {
  if (typeof input !== "string") return fallback;
  const value = input.trim();
  if (!value) return fallback;

  if (value.includes("color-mix(")) {
    const tokenMatch = value.match(/var\((--nx-[^)]+)\)/);
    const tokenValue = tokenMatch ? NEXORA_THREE_COLOR_TOKENS[`var(${tokenMatch[1]})`] : null;
    return tokenValue ?? fallback;
  }

  if (value === "transparent") return fallback;

  return sanitizeThreeColor(value, fallback);
}

function extractObjectIds(objects: any[]): string[] {
  return objects
    .map((object, index) => String(object?.id ?? object?.name ?? `obj_${index}`).trim())
    .filter(Boolean)
    .sort();
}

export const OverlayFlowLines = React.memo(function OverlayFlowLines(props: OverlayFlowLinesProps): React.ReactElement | null {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const yOffset = props.yOffset ?? 0.08;
  const objectIds = useMemo(() => extractObjectIds(props.objects), [props.objects]);
  const connectionGeometrySignature = useMemo(
    () =>
      buildOverlayFlowGeometrySignature({
        edges: props.edges,
        objectIds,
        yOffset,
      }),
    [objectIds, props.edges, yOffset]
  );

  const geometry = useMemo(
    () =>
      resolveStableOverlayFlowGeometry({
        signature: connectionGeometrySignature,
        reason: "overlay-flow-lines",
        build: () =>
          buildLineGeometry(props.objects, props.edges, yOffset, props.runtimeObjectPositionContext),
      }),
    [connectionGeometrySignature, props.edges, props.objects, props.runtimeObjectPositionContext, yOffset]
  );

  const lineColor = useMemo(() => resolveOverlayFlowThreeColor(props.color), [props.color]);

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
