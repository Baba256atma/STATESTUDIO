"use client";

import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

import { readPropagationPaths, type PropagationPath } from "../../../lib/propagation/propagationAuthoringRuntime";
import type { OverlayThemeTokens } from "../../../lib/overlay/overlayTheme";
import { sanitizeThreeColor } from "../../../lib/scene/threeColorSanitizer";
import {
  resolveRuntimeConnectionEndpoints,
  type RuntimeObjectPositionContext,
} from "../sceneRenderUtils";
import { RelationshipLabel } from "../relationships/RelationshipLabel";
import { recordConnectionLineRebuild } from "../../../lib/diagnostics/connectionRuntimeStabilityAudit";

export type AuthoredPropagationOverlayProps = {
  sceneJson: unknown;
  objects: any[];
  visible: boolean;
  themeTokens: OverlayThemeTokens;
  selectedPathId?: string | null;
  onPropagationPathSelect?: (path: PropagationPath) => void;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
};

function midpoint(a: THREE.Vector3, b: THREE.Vector3): [number, number, number] {
  return [(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.18, (a.z + b.z) / 2];
}

function typeLabel(type: PropagationPath["propagationType"]): string {
  if (type === "risk") return "Risk Impact";
  if (type === "resource") return "Resource Impact";
  if (type === "financial") return "Financial Impact";
  if (type === "operational") return "Operational Impact";
  if (type === "dependency") return "Dependency Impact";
  return "Custom Impact";
}

export const AuthoredPropagationOverlay = React.memo(function AuthoredPropagationOverlay(
  props: AuthoredPropagationOverlayProps
): React.ReactElement | null {
  const paths = useMemo(() => readPropagationPaths(props.sceneJson), [props.sceneJson]);
  if (!props.visible || paths.length === 0) return null;

  return (
    <group data-nx-overlay="authored-propagation">
      {paths.map((path) => (
        <AuthoredPropagationPathLine
          key={path.id}
          path={path}
          objects={props.objects}
          themeTokens={props.themeTokens}
          selected={path.id === props.selectedPathId}
          onSelect={props.onPropagationPathSelect}
          runtimeObjectPositionContext={props.runtimeObjectPositionContext}
        />
      ))}
    </group>
  );
});

function AuthoredPropagationPathLine(props: {
  path: PropagationPath;
  objects: any[];
  themeTokens: OverlayThemeTokens;
  selected: boolean;
  onSelect?: (path: PropagationPath) => void;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
}): React.ReactElement | null {
  const geometry = useMemo(() => {
    recordConnectionLineRebuild("overlay-flow-lines");
    const yOffset = 0.18;
    const endpoints = resolveRuntimeConnectionEndpoints({
      connectionId: props.path.id,
      sourceObjectId: props.path.sourceObjectId,
      targetObjectId: props.path.targetObjectId,
      objects: props.objects,
      context: props.runtimeObjectPositionContext,
      sourceYOffset: yOffset,
      targetYOffset: yOffset,
    });
    const from = endpoints.source;
    const to = endpoints.target;
    const points: [number, number, number][] = [
      [from.x, from.y, from.z],
      [to.x, to.y, to.z],
    ];
    const arrow = new THREE.Vector3().lerpVectors(from, to, 0.84);
    return {
      points,
      mid: midpoint(from, to),
      arrow: [arrow.x, arrow.y, arrow.z] as [number, number, number],
    };
  }, [props.objects, props.path.id, props.path.sourceObjectId, props.path.targetObjectId, props.runtimeObjectPositionContext]);

  const strength = Math.max(0, Math.min(100, props.path.strength));
  const opacity = props.selected ? 0.92 : 0.36 + (strength / 100) * 0.34;
  const lineWidth = props.selected ? 2.7 : 0.9 + (strength / 100) * 1.1;
  const handleSelect = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    props.onSelect?.(props.path);
  };

  const propagationColor = sanitizeThreeColor(props.themeTokens.propagationColor);
  const propagationGlow = sanitizeThreeColor(props.themeTokens.propagationGlow);

  return (
    <group data-nx-propagation-path-id={props.path.id} data-nx-propagation-type={props.path.propagationType}>
      {props.selected ? (
        <Line
          points={geometry.points}
          color={propagationGlow}
          transparent
          opacity={0.2}
          lineWidth={lineWidth + 3.5}
        />
      ) : null}
      <Line
        points={geometry.points}
        color={propagationColor}
        transparent
        opacity={opacity}
        lineWidth={lineWidth}
        onClick={handleSelect}
        onPointerDown={(event: any) => event.stopPropagation()}
      />
      <Line
        points={geometry.points}
        color={propagationColor}
        transparent
        opacity={0}
        lineWidth={8}
        onClick={handleSelect}
        onPointerDown={(event: any) => event.stopPropagation()}
      />
      <mesh position={geometry.arrow}>
        <coneGeometry args={[0.055, 0.14, 12]} />
        <meshStandardMaterial color={propagationGlow} transparent opacity={props.selected ? 0.95 : 0.72} />
      </mesh>
      {props.selected ? (
        <RelationshipLabel
          position={geometry.mid}
          text={typeLabel(props.path.propagationType)}
          tokens={{
            lineColor: props.themeTokens.propagationColor,
            labelColor: props.themeTokens.propagationGlow,
            arrowColor: props.themeTokens.propagationGlow,
            opacity,
            lineWidth,
            variant: "directional",
          }}
        />
      ) : null}
    </group>
  );
}

export default AuthoredPropagationOverlay;
