"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import type { CognitiveTwinTwinEntity } from "../../../lib/scene/twin/executiveCognitiveTwinTypes";
import { getObjPos } from "../sceneRenderUtils";

const HEALTH_COLOR: Record<string, string> = {
  warning: "#c9b35a",
  degraded: "#d4a24f",
  critical: "#d86b6b",
  recovering: "#8bc48a",
};

export type CognitiveTwinLivingStateOverlayLayerProps = {
  objects: any[];
  livingEntities: readonly CognitiveTwinTwinEntity[];
  visible?: boolean;
};

function LivingTwinMarker(props: {
  entity: CognitiveTwinTwinEntity;
  objects: any[];
}): React.ReactElement | null {
  const objectId = props.entity.objectIds[0];
  if (!objectId) return null;

  const position = useMemo(() => {
    const pos = getObjPos(objectId, props.objects);
    return new THREE.Vector3(pos.x, pos.y + 0.14, pos.z);
  }, [objectId, props.objects]);

  const color = HEALTH_COLOR[props.entity.healthState] ?? "#7aa7c7";
  const scale = props.entity.healthState === "critical" ? 0.11 : props.entity.healthState === "degraded" ? 0.09 : 0.07;

  return (
    <group position={position.toArray()} data-nx-twin-living={props.entity.twinId}>
      <mesh scale={scale}>
        <ringGeometry args={[1, 1.35, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.72}
          emissive={color}
          emissiveIntensity={0.28}
        />
      </mesh>
      {props.entity.healthState === "critical" || props.entity.healthState === "degraded" ? (
        <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
          <div
            style={{
              padding: "1px 5px",
              borderRadius: 5,
              border: `1px solid ${color}`,
              background: "rgba(8, 14, 24, 0.72)",
              color: "#eef4ff",
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {props.entity.healthState}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export const CognitiveTwinLivingStateOverlayLayer = React.memo(function CognitiveTwinLivingStateOverlayLayer(
  props: CognitiveTwinLivingStateOverlayLayerProps
): React.ReactElement | null {
  if (props.visible === false || props.livingEntities.length === 0) return null;

  return (
    <group data-nx-overlay="cognitive-twin-living">
      {props.livingEntities.map((entity) => (
        <LivingTwinMarker key={entity.twinId} entity={entity} objects={props.objects} />
      ))}
    </group>
  );
});

export default CognitiveTwinLivingStateOverlayLayer;
