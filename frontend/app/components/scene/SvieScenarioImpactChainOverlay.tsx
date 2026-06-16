"use client";

import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { SvieScenarioImpactChainConnectionVisualStyle } from "../../lib/scene/svie/svieScenarioImpactChainContract.ts";
import {
  resolveRuntimeConnectionEndpoints,
  type RuntimeObjectPositionContext,
} from "./sceneRenderUtils";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableLineRaycast(): false {
  return false;
}

const ScenarioImpactConnectionSegment = React.memo(function ScenarioImpactConnectionSegment({
  visual,
  objects,
  runtimeObjectPositionContext,
}: Readonly<{
  visual: SvieScenarioImpactChainConnectionVisualStyle;
  objects: readonly unknown[];
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
}>): React.ReactElement | null {
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);

  const endpoints = useMemo(() => {
    try {
      return resolveRuntimeConnectionEndpoints({
        connectionId: visual.id,
        sourceObjectId: visual.fromObjectId,
        targetObjectId: visual.toObjectId,
        objects: objects as never[],
        context: runtimeObjectPositionContext,
        sourceYOffset: 0.24,
        targetYOffset: 0.24,
      });
    } catch {
      return null;
    }
  }, [objects, runtimeObjectPositionContext, visual.fromObjectId, visual.id, visual.toObjectId]);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.9 + visual.sequentialGlowPhase * Math.PI * 2);
    material.opacity = visual.highlightOpacity + pulse * 0.14;
  });

  if (!endpoints) return null;

  const points: [number, number, number][] = [
    [endpoints.source.x, endpoints.source.y, endpoints.source.z],
    [endpoints.target.x, endpoints.target.y, endpoints.target.z],
  ];

  return (
    <Line
      points={points}
      color={sanitizeThreeColor(visual.highlightColor)}
      lineWidth={visual.lineWidth}
      transparent
      opacity={visual.highlightOpacity}
      raycast={disableLineRaycast}
      ref={(line) => {
        const material = line?.material;
        materialRef.current = material instanceof THREE.LineBasicMaterial ? material : null;
      }}
    />
  );
});

export type SvieScenarioImpactChainOverlayProps = Readonly<{
  connectionVisuals: readonly SvieScenarioImpactChainConnectionVisualStyle[];
  objects: readonly unknown[];
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
}>;

export function SvieScenarioImpactChainOverlay({
  connectionVisuals,
  objects,
  runtimeObjectPositionContext,
}: SvieScenarioImpactChainOverlayProps): React.ReactElement | null {
  if (connectionVisuals.length === 0) return null;

  return (
    <>
      {connectionVisuals.map((visual) => (
        <ScenarioImpactConnectionSegment
          key={visual.id}
          visual={visual}
          objects={objects}
          runtimeObjectPositionContext={runtimeObjectPositionContext}
        />
      ))}
    </>
  );
}
