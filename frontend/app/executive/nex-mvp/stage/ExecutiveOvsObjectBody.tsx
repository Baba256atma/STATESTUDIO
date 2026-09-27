"use client";

import { forwardRef, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import {
  EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION,
  EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY,
  type ExecutiveOvsObjectFamily,
  type ExecutiveOvsObjectVisualLanguage,
  type ExecutiveOvsPrimitive,
} from "@/app/lib/spatial-presentation/executiveOvsObjectVisualLanguage";

type Props = {
  readonly language: ExecutiveOvsObjectVisualLanguage;
  readonly bodyMaterial: ReactNode;
  readonly interactiveHandlers: Record<string, unknown>;
};

type PrimitivePlacement = {
  readonly geometry: ReactNode;
  readonly rotation: readonly [number, number, number];
  readonly position: readonly [number, number, number];
};

/**
 * Primitive orientation is local mesh construction so silhouettes read in Stage XY.
 * Language rotationX/Y stay 0 — this is not a camera tilt.
 */
function primitivePlacement(
  primitive: ExecutiveOvsPrimitive,
  width: number,
  height: number,
  depth: number,
  centerZ: number,
): PrimitivePlacement {
  const radius = Math.min(width, height) * 0.48;
  switch (primitive) {
    case "orb":
      return {
        geometry: (
          <sphereGeometry
            args={[
              radius,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.orbWidthSegments,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.orbHeightSegments,
            ]}
          />
        ),
        rotation: [0, 0, 0],
        position: [0, 0, radius],
      };
    case "cylinder":
      return {
        geometry: (
          <cylinderGeometry
            args={[
              radius * 0.72,
              radius * 0.72,
              height,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.cylinderRadialSegments,
            ]}
          />
        ),
        rotation: [0, 0, 0],
        position: [0, 0, radius * 0.72],
      };
    case "hex-prism":
      return {
        geometry: (
          <cylinderGeometry
            args={[
              radius * 0.92,
              radius * 0.92,
              depth,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.hexPrismRadialSegments,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.hexPrismHeightSegments,
            ]}
          />
        ),
        rotation: [Math.PI / 2, 0, 0],
        position: [0, 0, centerZ],
      };
    case "prism":
      return {
        geometry: <boxGeometry args={[width, height, depth]} />,
        rotation: [0, 0, 0],
        position: [0, 0, centerZ],
      };
    case "diamond":
      return {
        geometry: (
          <octahedronGeometry
            args={[radius, EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.diamondDetail]}
          />
        ),
        rotation: [0, 0, 0],
        position: [0, 0, radius],
      };
    case "ring":
      return {
        geometry: (
          <torusGeometry
            args={[
              radius * 0.72,
              radius * 0.18,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.torusRadialSegments,
              EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.torusTubularSegments,
            ]}
          />
        ),
        rotation: [0, 0, 0],
        position: [0, 0, radius * 0.18],
      };
    case "rounded-block":
    default:
      return {
        geometry: null,
        rotation: [0, 0, 0],
        position: [0, 0, centerZ],
      };
  }
}

function roundedCornerRadius(
  family: ExecutiveOvsObjectFamily,
  width: number,
  height: number,
): number {
  const factor =
    family === "scenario"
      ? EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.scenario
      : family === "execution"
        ? EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.execution
        : EXECUTIVE_OVS_ROUNDED_CORNER_BY_FAMILY.operational;
  return Math.max(0.03, Math.min(width, height) * factor);
}

function ContactPresence({ width, height }: { readonly width: number; readonly height: number }) {
  const radius = Math.max(width, height) * 0.5;
  return (
    <mesh
      position={[0, 0, 0.006]}
      renderOrder={-2}
      raycast={() => null}
      frustumCulled
    >
      <circleGeometry args={[radius, 20]} />
      <meshBasicMaterial
        color="#050910"
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * OVS:1 primitive body on the existing Stage object group.
 * Back on semantic z=0, volume toward the camera. No second scene.
 */
export const ExecutiveOvsObjectBody = forwardRef<Mesh, Props>(
  function ExecutiveOvsObjectBody(
    { language, bodyMaterial, interactiveHandlers },
    ref,
  ) {
    const { primitive, family, width, height, depth, centerZ } = language;
    const placement = primitivePlacement(
      primitive,
      width,
      height,
      depth,
      centerZ,
    );

    if (primitive === "rounded-block") {
      return (
        <group>
          <ContactPresence width={width} height={height} />
          <RoundedBox
          ref={ref}
          args={[width, height, depth]}
          radius={roundedCornerRadius(family, width, height)}
          smoothness={
            EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.roundedBlockSmoothness
          }
          position={[0, 0, centerZ]}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
          {...interactiveHandlers}
        >
          {bodyMaterial}
        </RoundedBox>
        </group>
      );
    }

    return (
      <group>
        <ContactPresence width={width} height={height} />
        <mesh
        ref={ref}
        position={placement.position}
        rotation={placement.rotation}
        castShadow
        receiveShadow
        {...interactiveHandlers}
      >
        {placement.geometry}
        {bodyMaterial}
      </mesh>
      </group>
    );
  },
);
