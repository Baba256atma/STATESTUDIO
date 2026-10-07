"use client";

import { forwardRef, type ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import { AdditiveBlending, type Mesh } from "three";
import {
  EXECUTIVE_OVS_BODY_READ_POSE,
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
  readonly innerLightColor: string;
};

type PrimitivePlacement = {
  readonly geometry: ReactNode;
  readonly rotation: readonly [number, number, number];
  readonly position: readonly [number, number, number];
};

/**
 * Primitive orientation is local mesh construction.
 * Language rotationX/Y stay 0. EXECUTIVE_OVS_BODY_READ_POSE reveals thickness
 * at the locked camera; it does not move the Stage camera or the label.
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

function InnerLight({
  primitive,
  width,
  height,
  depth,
  centerZ,
  color,
}: {
  readonly primitive: ExecutiveOvsPrimitive;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly centerZ: number;
  readonly color: string;
}) {
  const radius = Math.min(width, height) * 0.22;
  const geometry =
    primitive === "diamond" ? (
      <octahedronGeometry args={[radius, 0]} />
    ) : primitive === "orb" ? (
      <sphereGeometry args={[radius, 16, 12]} />
    ) : primitive === "cylinder" || primitive === "hex-prism" ? (
      <cylinderGeometry args={[radius * 0.7, radius * 0.7, height * 0.42, primitive === "hex-prism" ? 6 : 16]} />
    ) : primitive === "ring" ? (
      <torusGeometry args={[radius * 0.8, radius * 0.22, 8, 16]} />
    ) : (
      <boxGeometry args={[width * 0.28, height * 0.28, Math.max(depth * 0.28, 0.05)]} />
    );
  return (
    <mesh
      position={[0, 0, centerZ]}
      raycast={() => null}
      renderOrder={0}
      frustumCulled
    >
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
        blending={AdditiveBlending}
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
    { language, bodyMaterial, interactiveHandlers, innerLightColor },
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

    const readPose: [number, number, number] = [
      EXECUTIVE_OVS_BODY_READ_POSE.pitchX,
      EXECUTIVE_OVS_BODY_READ_POSE.yawY,
      0,
    ];

    if (primitive === "rounded-block") {
      return (
        <group>
          <group rotation={readPose}>
            <InnerLight
              primitive={primitive}
              width={width}
              height={height}
              depth={depth}
              centerZ={centerZ}
              color={innerLightColor}
            />
            <RoundedBox
              ref={ref}
              args={[width, height, depth]}
              radius={roundedCornerRadius(family, width, height)}
              smoothness={
                EXECUTIVE_OVS_PRIMITIVE_CONSTRUCTION.roundedBlockSmoothness
              }
              position={[0, 0, centerZ]}
              rotation={[0, 0, 0]}
              renderOrder={2}
              castShadow
              receiveShadow
              {...interactiveHandlers}
            >
              {bodyMaterial}
            </RoundedBox>
          </group>
        </group>
      );
    }

    return (
      <group>
        <group rotation={readPose}>
          <InnerLight
            primitive={primitive}
            width={width}
            height={height}
            depth={depth}
            centerZ={centerZ}
            color={innerLightColor}
          />
          <mesh
            ref={ref}
            position={placement.position}
            rotation={placement.rotation}
            renderOrder={2}
            castShadow
            receiveShadow
            {...interactiveHandlers}
          >
            {placement.geometry}
            {bodyMaterial}
          </mesh>
        </group>
      </group>
    );
  },
);
