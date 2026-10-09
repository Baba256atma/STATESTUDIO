"use client";

import { forwardRef, useEffect, useMemo, type ReactNode } from "react";
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
import { createExecutiveOvsProblemPrismGeometry } from "@/app/lib/spatial-presentation/executiveOvsProblemPrismGeometry";

type Props = {
  readonly language: ExecutiveOvsObjectVisualLanguage;
  readonly bodyMaterial: ReactNode;
  readonly interactiveHandlers: Record<string, unknown>;
  readonly innerLightColor: string;
  readonly innerLightOpacity?: number;
  readonly innerLightRadiusFactor?: number;
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
        geometry: (
          <ProblemPrismGeometry width={width} height={height} depth={depth} />
        ),
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

function ProblemPrismGeometry({
  width,
  height,
  depth,
}: {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}) {
  const geometry = useMemo(
    () => createExecutiveOvsProblemPrismGeometry(width, height, depth),
    [width, height, depth],
  );
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);
  return <primitive object={geometry} attach="geometry" />;
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
  opacity,
  radiusFactor,
}: {
  readonly primitive: ExecutiveOvsPrimitive;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly centerZ: number;
  readonly color: string;
  readonly opacity: number;
  readonly radiusFactor: number;
}) {
  const radius = Math.min(width, height) * radiusFactor;
  const geometry =
    primitive === "diamond" ? (
      <octahedronGeometry args={[radius, 0]} />
    ) : primitive === "orb" || primitive === "rounded-block" || primitive === "prism" ? (
      <sphereGeometry args={[radius, 16, 12]} />
    ) : primitive === "cylinder" || primitive === "hex-prism" ? (
      <sphereGeometry args={[radius * 0.78, 16, 12]} />
    ) : primitive === "ring" ? (
      <sphereGeometry args={[radius * 0.55, 12, 10]} />
    ) : (
      <sphereGeometry args={[radius, 16, 12]} />
    );
  void depth;
  return (
    <mesh
      position={[0, 0, centerZ]}
      raycast={() => null}
      renderOrder={0}
      frustumCulled
      userData={{ visualLayerRole: "inner-light", decorative: true }}
    >
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
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
    { language, bodyMaterial, interactiveHandlers, innerLightColor, innerLightOpacity, innerLightRadiusFactor },
    ref,
  ) {
    const { primitive, family, width, height, depth, centerZ } = language;
    const lightOpacity =
      innerLightOpacity ?? language.material.innerLightOpacity;
    const lightRadius =
      innerLightRadiusFactor ?? language.material.innerLightRadiusFactor;
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
              opacity={lightOpacity}
              radiusFactor={lightRadius}
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
            opacity={lightOpacity}
            radiusFactor={lightRadius}
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
