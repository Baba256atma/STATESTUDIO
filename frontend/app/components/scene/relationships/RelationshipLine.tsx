"use client";

import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

import { getObjPos } from "../sceneRenderUtils";
import { getRelationshipTypeDefinition } from "../../../lib/relationships/relationshipRegistry";
import { logRelationshipRendered } from "../../../lib/relationships/relationshipInstrumentation";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";
import { resolveRelationshipVisualTokens } from "../../../lib/relationships/relationshipTheme";
import type { SceneThemeId } from "../../../lib/theme/sceneThemeTypes";
import { RelationshipLabel } from "./RelationshipLabel";

export type RelationshipLineProps = {
  relationship: NexoraRelationship;
  objects: any[];
  themeId: SceneThemeId;
  showLabel?: boolean;
  selected?: boolean;
  emphasized?: boolean;
  onSelect?: (relationship: NexoraRelationship) => void;
};

function midpoint(a: THREE.Vector3, b: THREE.Vector3): [number, number, number] {
  return [(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.12, (a.z + b.z) / 2];
}

function arrowPoint(from: THREE.Vector3, to: THREE.Vector3, t = 0.82): THREE.Vector3 {
  return new THREE.Vector3().lerpVectors(from, to, t);
}

export const RelationshipLine = React.memo(function RelationshipLine(
  props: RelationshipLineProps
): React.ReactElement | null {
  const tokens = useMemo(
    () => resolveRelationshipVisualTokens(props.themeId, props.relationship.type),
    [props.relationship.type, props.themeId]
  );

  const geometry = useMemo(() => {
    const from = getObjPos(props.relationship.sourceId, props.objects);
    const to = getObjPos(props.relationship.targetId, props.objects);
    const yOffset = 0.1;
    const start: [number, number, number] = [from.x, from.y + yOffset, from.z];
    const end: [number, number, number] = [to.x, to.y + yOffset, to.z];
    const points: [number, number, number][] = [start, end];

    if (props.relationship.direction === "bi") {
      const mid = midpoint(from, to);
      return { points, mid, arrow: null as [number, number, number] | null };
    }

    const arrow = arrowPoint(from, to);
    return {
      points,
      mid: midpoint(from, to),
      arrow: [arrow.x, arrow.y + yOffset, arrow.z] as [number, number, number],
    };
  }, [props.objects, props.relationship.direction, props.relationship.sourceId, props.relationship.targetId]);

  React.useEffect(() => {
    logRelationshipRendered({
      relationshipId: props.relationship.id,
      sourceId: props.relationship.sourceId,
      targetId: props.relationship.targetId,
      type: props.relationship.type,
    });
  }, [props.relationship.id, props.relationship.sourceId, props.relationship.targetId, props.relationship.type]);

  if (geometry.points.length < 2) return null;

  const typeLabel =
    getRelationshipTypeDefinition(props.relationship.type)?.label ?? props.relationship.type;
  const visualOpacity = props.selected ? Math.min(1, tokens.opacity + 0.22) : props.emphasized ? Math.min(1, tokens.opacity + 0.1) : tokens.opacity;
  const lineWidth = props.selected ? tokens.lineWidth + 0.9 : props.emphasized ? tokens.lineWidth + 0.35 : tokens.lineWidth;
  const handleSelect = (event: any) => {
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();
    props.onSelect?.(props.relationship);
  };

  return (
    <group data-nx-relationship-id={props.relationship.id} data-nx-relationship-type={props.relationship.type}>
      {props.selected ? (
        <Line
          points={geometry.points}
          color={tokens.lineColor}
          transparent
          opacity={0.18}
          lineWidth={lineWidth + 3}
        />
      ) : null}
      <Line
        points={geometry.points}
        color={tokens.lineColor}
        transparent
        opacity={visualOpacity}
        lineWidth={lineWidth}
        onClick={handleSelect}
        onPointerDown={(event: any) => event.stopPropagation()}
      />
      {tokens.variant === "double" ? (
        <Line
          points={geometry.points.map(([x, y, z]) => [x, y + 0.035, z] as [number, number, number])}
          color={tokens.lineColor}
          transparent
          opacity={Math.max(0.28, visualOpacity - 0.18)}
          lineWidth={Math.max(0.6, lineWidth - 0.25)}
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
      {geometry.arrow ? (
        <mesh position={geometry.arrow}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color={tokens.arrowColor} transparent opacity={props.selected ? 1 : 0.85} />
        </mesh>
      ) : null}
      {props.showLabel !== false ? (
        <RelationshipLabel position={geometry.mid} text={typeLabel} tokens={tokens} />
      ) : null}
    </group>
  );
});

export default RelationshipLine;
