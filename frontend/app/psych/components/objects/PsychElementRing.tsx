"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Line, Text } from "@react-three/drei";
import FoggySunObject from "./FoggySunObject";
import WaterObject from "./WaterObject";
import FireObject from "./FireObject";
import AirObject from "./AirObject";
import EarthObject from "./EarthObject";
import EgoObject from "./EgoObject";
import PSYCH_ELEMENT_CONFIGS from "../../../lib/psych/psychElementObjects";
import type { ObjectState, PsychElementId, PsychState } from "../../../lib/psych/reactionTypes";
import { mapPsychToVisual } from "../../lib/visual/psychVisualMapping";

const OBJECT_SCALE = 0.48;
const ORBIT_TILT: [number, number, number] = [Math.PI / 2.2, 0.16, Math.PI / 8];

type PsychElementRingProps = {
  psychState: PsychState;
  objects?: Record<PsychElementId, ObjectState>;
  selectedObjectId?: PsychElementId | null;
  onObjectClick?: (id: string) => void;
};

type ElementObjectProps = {
  brightness?: number;
  activity?: number;
  selected?: boolean;
  visual?: ReturnType<typeof mapPsychToVisual>[PsychElementId];
  onObjectClick?: (id: string) => void;
};

const COMPONENT_BY_ID: Partial<Record<PsychElementId, React.ElementType<ElementObjectProps>>> = {
  sun: FoggySunObject,
  water: WaterObject,
  fire: FireObject,
  air: AirObject,
  earth: EarthObject,
  ego: EgoObject,
};

const DEFAULT_OBJECTS: Record<PsychElementId, ObjectState> = {
  fire: { id: "fire", brightness: 0.2, activity: 0.2 },
  water: { id: "water", brightness: 0.2, activity: 0.1 },
  air: { id: "air", brightness: 0.2, activity: 0.1 },
  earth: { id: "earth", brightness: 0.2, activity: 0.05 },
  sun: { id: "sun", brightness: 0.2, activity: 0.1 },
  ego: { id: "ego", brightness: 0.2, activity: 0.1 },
};

function setPointerCursor(active: boolean): void {
  if (typeof document === "undefined") return;
  document.body.style.cursor = active ? "pointer" : "";
}

const CONNECTION_POINTS_BY_ID = Object.fromEntries(
  PSYCH_ELEMENT_CONFIGS
    .filter((cfg) => cfg.id !== "ego")
    .map((cfg) => [cfg.id, [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...cfg.position)]])
) as Partial<Record<PsychElementId, [THREE.Vector3, THREE.Vector3]>>;

const PsychElementRing = React.memo(function PsychElementRing({ psychState, objects, selectedObjectId = null, onObjectClick }: PsychElementRingProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B03][ObjectsMounted]");
    return () => setPointerCursor(false);
  }, []);

  const resolvedObjects = useMemo(() => objects ?? DEFAULT_OBJECTS, [objects]);
  const visualMap = useMemo(() => mapPsychToVisual({ psychState, objects: resolvedObjects, selectedId: selectedObjectId }), [psychState, resolvedObjects, selectedObjectId]);

  return (
    <group>
      <group data-nx="psych-connection-lines" name="psych-connection-lines">
        {PSYCH_ELEMENT_CONFIGS.filter((cfg) => cfg.id !== "ego").map((cfg) => (
          <Line
            key={`ego-${cfg.id}`}
            points={CONNECTION_POINTS_BY_ID[cfg.id] ?? []}
            color="#bba477"
            lineWidth={0.8}
            transparent
            opacity={0.22}
          />
        ))}
      </group>
      {PSYCH_ELEMENT_CONFIGS.map((cfg) => {
        const key = cfg.id;
        const ElementComponent = COMPONENT_BY_ID[key];
        if (!ElementComponent) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("[Sycho][B11-FIX][MissingElementComponent]", { id: cfg.id });
          }
          return null;
        }
        const pos = cfg.position as [number, number, number];
        const objectState = resolvedObjects[key];
        const clickId = key === "water" ? "liquid" : key;
        const visualIntensity = Math.min(1, (objectState?.brightness ?? cfg.defaultBrightness) * 0.58 + (objectState?.activity ?? cfg.defaultActivity) * 0.42);
        const props = {
          brightness: objectState?.brightness ?? cfg.defaultBrightness,
          activity: objectState?.activity ?? cfg.defaultActivity,
          visual: visualMap[key],
          selected: selectedObjectId === key,
          onObjectClick,
        };
        const haloColor = new THREE.Color(cfg.baseColor);
        return (
          <group key={key} position={pos} scale={OBJECT_SCALE} name={`psych-object-${key === "water" ? "liquid" : key}`}>
            <mesh
              data-nx={`psych-object-${key === "water" ? "liquid" : key}-hit-area`}
              onClick={(event) => {
                event.stopPropagation();
                onObjectClick?.(clickId);
              }}
              onPointerOver={(event) => {
                event.stopPropagation();
                setPointerCursor(true);
              }}
              onPointerOut={() => setPointerCursor(false)}
            >
              <sphereGeometry args={[1.72, 20, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh rotation={ORBIT_TILT} renderOrder={-2} scale={1 + visualIntensity * 0.04}>
              <torusGeometry args={[1.34, 0.009, 8, 112]} />
              <meshBasicMaterial color={haloColor} transparent opacity={0.18 + visualIntensity * 0.22} depthWrite={false} />
            </mesh>
            <ElementComponent {...props} />
            <Text
              position={[0, -1.18, 0.08]}
              fontSize={0.16}
              letterSpacing={0.02}
              anchorX="center"
              anchorY="middle"
              color="#d7d4c8"
              fillOpacity={0.74}
              outlineWidth={0.004}
              outlineColor="#05070f"
            >
              {cfg.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
});

export default PsychElementRing;
