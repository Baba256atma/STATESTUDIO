"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

import type { ExecutiveScenarioUniverseLayer } from "../../../lib/scene/scenario/executiveMultiScenarioUniverseTypes";
import { getObjPos } from "../sceneRenderUtils";
import { sanitizeThreeColor } from "../../../lib/scene/threeColorSanitizer";

export type MultiScenarioUniverseOverlayLayerProps = {
  objects: any[];
  ghostLayers: readonly ExecutiveScenarioUniverseLayer[];
  activeScenarioId: string | null;
  layoutMode: "overlay" | "split" | "ghost";
  visible?: boolean;
};

function layerOffset(index: number, layoutMode: MultiScenarioUniverseOverlayLayerProps["layoutMode"]): [number, number, number] {
  if (layoutMode !== "split") return [0, 0, 0];
  return [index * 1.8, 0, index * 0.6];
}

function GhostScenarioMarker(props: {
  layer: ExecutiveScenarioUniverseLayer;
  objects: any[];
  offset: [number, number, number];
  active: boolean;
}): React.ReactElement | null {
  const simulation = props.layer.simulation;
  if (!simulation || simulation.affectedObjectIds.length === 0) return null;
  const primaryId = simulation.propagationPaths[0]?.to ?? simulation.affectedObjectIds[0];
  if (!primaryId) return null;

  const position = useMemo(() => {
    const pos = getObjPos(primaryId, props.objects);
    return new THREE.Vector3(
      pos.x + props.offset[0],
      pos.y + 0.18 + props.offset[1],
      pos.z + props.offset[2]
    );
  }, [primaryId, props.objects, props.offset]);

  const materialColor = sanitizeThreeColor(props.layer.colorToken);

  return (
    <group position={position.toArray()} data-nx-scenario-ghost={props.layer.metadata.id}>
      <mesh scale={props.active ? 0.1 : 0.07}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={materialColor}
          transparent
          opacity={props.active ? 0.72 : 0.38}
          emissive={materialColor}
          emissiveIntensity={0.22}
        />
      </mesh>
      <Html center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div
          style={{
            padding: "2px 6px",
            borderRadius: 6,
            border: `1px solid ${props.layer.colorToken}`,
            background: "rgba(8, 14, 24, 0.78)",
            color: "#eef4ff",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {props.layer.metadata.title}
        </div>
      </Html>
    </group>
  );
}

export const MultiScenarioUniverseOverlayLayer = React.memo(function MultiScenarioUniverseOverlayLayer(
  props: MultiScenarioUniverseOverlayLayerProps
): React.ReactElement | null {
  if (props.visible === false || props.ghostLayers.length === 0) return null;

  return (
    <group data-nx-overlay="multi-scenario-universe">
      {props.ghostLayers.map((layer, index) => (
        <GhostScenarioMarker
          key={layer.metadata.id}
          layer={layer}
          objects={props.objects}
          offset={layerOffset(index + 1, props.layoutMode)}
          active={layer.metadata.id === props.activeScenarioId}
        />
      ))}
    </group>
  );
});

export default MultiScenarioUniverseOverlayLayer;
