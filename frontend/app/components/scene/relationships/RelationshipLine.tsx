"use client";

import React, { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { resolveRuntimeConnectionEndpoints, type RuntimeObjectPositionContext } from "../sceneRenderUtils";
import { logRelationshipRendered } from "../../../lib/relationships/relationshipInstrumentation";
import type { RelationshipRenderPlan } from "../../../lib/relationships/executive/executiveRelationshipTypes";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import {
  resolveExecutiveRelationshipLineTokens,
  resolveRelationshipVisualTokens,
} from "../../../lib/relationships/relationshipTheme";
import { resolveExecutiveRelationshipGraphicsProfile } from "../../../lib/scene/graphics/executiveGraphicsProfile";
import type { WorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeTypes";
import type { SceneThemeId } from "../../../lib/theme/sceneThemeTypes";
import { RelationshipLabel } from "./RelationshipLabel";
import { sanitizeThreeColor } from "../../../lib/scene/threeColorSanitizer";

export type RelationshipLineProps = {
  relationship: NexoraRelationship;
  objects: any[];
  themeId: SceneThemeId;
  viewMode?: WorkspaceViewMode;
  lineOpacityMul?: number;
  renderPlan?: RelationshipRenderPlan | null;
  showLabel?: boolean;
  billboardLabels?: boolean;
  selected?: boolean;
  emphasized?: boolean;
  onSelect?: (relationship: NexoraRelationship) => void;
  runtimeObjectPositionContext?: RuntimeObjectPositionContext;
};

function midpoint(a: THREE.Vector3, b: THREE.Vector3): [number, number, number] {
  return [(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.12, (a.z + b.z) / 2];
}

function arrowPoint(from: THREE.Vector3, to: THREE.Vector3, t = 0.82): THREE.Vector3 {
  return new THREE.Vector3().lerpVectors(from, to, t);
}

function dependencyStrengthWidth(
  relationship: NexoraRelationship,
  baseWidth: number,
  lineWidthMultiplier = 1
): number {
  const rawStrength = relationship.metadata?.strength;
  const strength = typeof rawStrength === "number" ? rawStrength : 0.5;
  return baseWidth * lineWidthMultiplier * (0.82 + Math.min(1, Math.max(0, strength)) * 0.28);
}

const PulsingExecutiveLine = React.memo(function PulsingExecutiveLine(props: {
  points: [number, number, number][];
  color: string;
  baseOpacity: number;
  lineWidth: number;
  pulseEnabled: boolean;
  riskPulse: boolean;
  onClick: (event: any) => void;
  onPointerDown: (event: any) => void;
}): React.ReactElement {
  const lineRef = useRef<THREE.Object3D | null>(null);

  useFrame(({ clock }) => {
    if (!props.pulseEnabled || !lineRef.current) return;
    const material = (lineRef.current as THREE.Object3D & { material?: THREE.Material & { opacity?: number } })
      .material;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (props.riskPulse ? 1.05 : 0.75));
    const amplitude = props.riskPulse ? 0.12 : 0.07;
    material.opacity = props.baseOpacity + amplitude * pulse;
  });

  return (
    <Line
      ref={lineRef as never}
      points={props.points}
      color={props.color}
      transparent
      opacity={props.baseOpacity}
      lineWidth={props.lineWidth}
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
    />
  );
});

export const RelationshipLine = React.memo(function RelationshipLine(
  props: RelationshipLineProps
): React.ReactElement | null {
  const viewMode = props.viewMode ?? "3D";
  const relationshipGraphics = useMemo(
    () => resolveExecutiveRelationshipGraphicsProfile(viewMode),
    [viewMode]
  );
  const lineOpacityMul = props.lineOpacityMul ?? relationshipGraphics.lineOpacityMul;

  const tokens = useMemo(() => {
    const resolved = resolveExecutiveRelationshipLineTokens({
      themeId: props.themeId,
      relationship: props.relationship,
      renderPlan: props.renderPlan,
    });
    return {
      ...resolved,
      lineColor: sanitizeThreeColor(resolved.lineColor),
      arrowColor: sanitizeThreeColor(resolved.arrowColor),
    };
  }, [props.relationship, props.renderPlan, props.themeId]);

  const baseTokens = useMemo(
    () => resolveRelationshipVisualTokens(props.themeId, props.relationship.type),
    [props.relationship.type, props.themeId]
  );

  const geometry = useMemo(() => {
    const yOffset = viewMode === "2D" ? 0.06 : 0.1;
    const endpoints = resolveRuntimeConnectionEndpoints({
      connectionId: props.relationship.id,
      sourceObjectId: props.relationship.sourceId,
      targetObjectId: props.relationship.targetId,
      objects: props.objects,
      context: props.runtimeObjectPositionContext,
      sourceYOffset: yOffset,
      targetYOffset: yOffset,
    });
    const from = endpoints.source;
    const to = endpoints.target;
    const start: [number, number, number] = [from.x, from.y + yOffset, from.z];
    const end: [number, number, number] = [to.x, to.y + yOffset, to.z];
    const points: [number, number, number][] = [start, end];

    if (props.relationship.direction === "bi") {
      const mid = midpoint(from, to);
      return { points, mid, arrow: null as [number, number, number] | null, arrowRotation: null as [number, number, number] | null };
    }

    const arrow = arrowPoint(from, to);
    const direction = new THREE.Vector3().subVectors(to, from).normalize();
    const arrowQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    const arrowEuler = new THREE.Euler().setFromQuaternion(arrowQuat);
    return {
      points,
      mid: midpoint(from, to),
      arrow: [arrow.x, arrow.y + yOffset, arrow.z] as [number, number, number],
      arrowRotation: [arrowEuler.x, arrowEuler.y, arrowEuler.z] as [number, number, number],
    };
  }, [
    props.objects,
    props.relationship.direction,
    props.relationship.id,
    props.relationship.sourceId,
    props.relationship.targetId,
    props.runtimeObjectPositionContext,
    viewMode,
  ]);

  React.useEffect(() => {
    logRelationshipRendered({
      relationshipId: props.relationship.id,
      sourceId: props.relationship.sourceId,
      targetId: props.relationship.targetId,
      type: props.relationship.type,
      emphasis: props.renderPlan?.emphasis,
      classification: props.renderPlan?.classification,
    });
  }, [
    props.relationship.id,
    props.relationship.sourceId,
    props.relationship.targetId,
    props.relationship.type,
    props.renderPlan?.classification,
    props.renderPlan?.emphasis,
  ]);

  if (geometry.points.length < 2) return null;

  const labelText = props.renderPlan?.executiveLabel ?? props.relationship.type;
  const isRiskLine =
    props.renderPlan?.classification === "RISK" ||
    props.relationship.type === "risk" ||
    props.relationship.type === "blocks";
  const profileOpacity = Math.min(0.96, tokens.opacity * lineOpacityMul);
  const visualOpacity = props.selected
    ? Math.min(0.98, profileOpacity + 0.14)
    : props.emphasized
      ? profileOpacity
      : Math.max(0.12, profileOpacity * 0.86);
  const lineWidth = dependencyStrengthWidth(
    props.relationship,
    props.selected ? tokens.lineWidth + 0.45 : tokens.lineWidth,
    props.renderPlan?.lineWidthMultiplier ?? 1
  );
  const showGlow = props.renderPlan?.glow || props.selected || (isRiskLine && props.emphasized);
  const shouldPulse =
    relationshipGraphics.pulseEnabled &&
    (props.selected || props.emphasized || isRiskLine);
  const showDirectionCue =
    relationshipGraphics.directionCue &&
    props.relationship.direction !== "bi" &&
    geometry.arrow !== null;

  const handleSelect = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    props.onSelect?.(props.relationship);
  };

  return (
    <group
      data-nx-relationship-id={props.relationship.id}
      data-nx-relationship-type={props.relationship.type}
      data-nx-relationship-class={props.renderPlan?.classification}
      data-nx-relationship-emphasis={props.renderPlan?.emphasis}
    >
      {showGlow ? (
        <Line
          points={geometry.points}
          color={tokens.lineColor}
          transparent
          opacity={props.selected ? 0.11 : isRiskLine ? 0.09 : 0.06}
          lineWidth={lineWidth + (props.selected ? 2.0 : 1.6)}
        />
      ) : null}
      {shouldPulse ? (
        <PulsingExecutiveLine
          points={geometry.points}
          color={tokens.lineColor}
          baseOpacity={visualOpacity}
          lineWidth={lineWidth}
          pulseEnabled
          riskPulse={isRiskLine}
          onClick={handleSelect}
          onPointerDown={(event: any) => event.stopPropagation()}
        />
      ) : (
        <Line
          points={geometry.points}
          color={tokens.lineColor}
          transparent
          opacity={visualOpacity}
          lineWidth={lineWidth}
          onClick={handleSelect}
          onPointerDown={(event: any) => event.stopPropagation()}
        />
      )}
      {tokens.variant === "double" ? (
        <Line
          points={geometry.points.map(([x, y, z]) => [x, y + 0.035, z] as [number, number, number])}
          color={tokens.lineColor}
          transparent
          opacity={Math.max(0.16, visualOpacity - 0.24)}
          lineWidth={Math.max(0.4, lineWidth - 0.22)}
          onClick={handleSelect}
          onPointerDown={(event: any) => event.stopPropagation()}
        />
      ) : null}
      <Line
        points={geometry.points}
        color={tokens.lineColor}
        transparent
        opacity={0}
        lineWidth={8}
        onClick={handleSelect}
        onPointerDown={(event: any) => event.stopPropagation()}
      />
      {showDirectionCue && geometry.arrow ? (
        <mesh position={geometry.arrow} rotation={geometry.arrowRotation ?? [0, 0, 0]}>
          <coneGeometry
            args={[
              props.renderPlan?.emphasis === "PRIMARY" ? 0.042 : 0.034,
              props.renderPlan?.emphasis === "PRIMARY" ? 0.09 : 0.072,
              8,
            ]}
          />
          <meshStandardMaterial
            color={tokens.arrowColor}
            emissive={tokens.arrowColor}
            emissiveIntensity={props.selected ? 0.35 : 0.18}
            metalness={0.32}
            roughness={0.48}
            transparent
            opacity={props.selected ? 0.92 : visualOpacity * 0.88}
          />
        </mesh>
      ) : null}
      {props.showLabel !== false ? (
        <RelationshipLabel
          position={geometry.mid}
          text={labelText}
          tokens={baseTokens}
          compact={props.renderPlan?.emphasis === "BACKGROUND"}
          billboard={props.billboardLabels ?? false}
        />
      ) : null}
    </group>
  );
});

export default RelationshipLine;
