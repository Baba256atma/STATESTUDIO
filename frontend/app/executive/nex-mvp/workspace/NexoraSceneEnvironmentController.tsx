"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CanvasTexture, Color, DoubleSide } from "three";
import type { Fog, MeshStandardMaterial } from "three";
import {
  NEXORA_MVP_STAGE_ATMOSPHERE_FIELD,
  type NexoraMVPSceneEnvironmentVisualState,
} from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import type { ExecutiveLightingGroundResponse } from "@/app/lib/spatial-presentation/executiveLightingFoundation";
import { EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION } from "@/app/lib/spatial-presentation/executiveLightingFoundation";

type Props = {
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly groundResponse: ExecutiveLightingGroundResponse;
  readonly onClearSelection: () => void;
};

function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

/** One shared field gradient. Soft center haze, darker edges, no hard disc. */
function createStageCenterHazeTexture(
  haze: NexoraMVPSceneEnvironmentVisualState["atmosphereHaze"],
): CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context == null) return null;
  const center = size / 2;
  const gradient = context.createRadialGradient(
    center,
    center,
    size * 0.04,
    center,
    center,
    size * 0.72,
  );
  gradient.addColorStop(0, haze.center);
  gradient.addColorStop(0.32, haze.mid);
  gradient.addColorStop(0.68, haze.edge);
  gradient.addColorStop(1, haze.rim);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Interpolates Stage fog / background / ground from environment visual tokens.
 * SP:3.1 lighting lives in NexoraExecutiveLightingRig — this controller no
 * longer owns the executive lighting rig.
 * Presentation only — does not infer workspace semantics.
 */
export function NexoraSceneEnvironmentController({
  environment,
  groundResponse,
  onClearSelection,
}: Props) {
  const { scene } = useThree();
  const fogRef = useRef<Fog>(null);
  const groundMatRef = useRef<MeshStandardMaterial>(null);
  const targetBg = useRef(new Color(environment.background));
  const targetGround = useRef(new Color(environment.groundColor));
  const groundShadow = EXECUTIVE_LIGHTING_SHADOW_PARTICIPATION.stageGround;
  const centerHaze = useMemo(() => {
    const texture = createStageCenterHazeTexture(environment.atmosphereHaze);
    return texture;
  }, [
    environment.atmosphereHaze.center,
    environment.atmosphereHaze.edge,
    environment.atmosphereHaze.mid,
    environment.atmosphereHaze.rim,
  ]);

  useEffect(() => {
    targetBg.current.set(environment.background);
    targetGround.current.set(environment.groundColor);
  }, [environment.background, environment.groundColor]);

  useEffect(() => {
    if (groundMatRef.current == null) return;
    groundMatRef.current.metalness = groundResponse.materialMetalness;
    groundMatRef.current.roughness = groundResponse.materialRoughness;
  }, [groundResponse.materialMetalness, groundResponse.materialRoughness]);

  useFrame((_, delta) => {
    const speed = Math.min(
      1,
      delta * (1000 / Math.max(80, environment.transitionMs)),
    );

    // Prefer mutating an existing Color instance (R3F/Three presentation).
    const background = scene.background;
    if (background instanceof Color) {
      background.lerp(targetBg.current, speed);
    }

    if (fogRef.current) {
      fogRef.current.color.lerp(targetBg.current, speed);
      fogRef.current.near = lerp(
        fogRef.current.near,
        environment.fogNear,
        speed,
      );
      fogRef.current.far = lerp(fogRef.current.far, environment.fogFar, speed);
    }
    if (groundMatRef.current) {
      groundMatRef.current.color.lerp(targetGround.current, speed);
      groundMatRef.current.opacity = lerp(
        groundMatRef.current.opacity,
        environment.groundOpacity,
        speed,
      );
    }
  });

  return (
    <group>
      <fog
        ref={fogRef}
        attach="fog"
        args={[environment.background, environment.fogNear, environment.fogFar]}
      />
      <mesh
        position={[0, 0, -6]}
        renderOrder={-30}
        castShadow={groundShadow.castShadow}
        receiveShadow={
          groundShadow.receiveShadow && groundResponse.receiveShadows
        }
        userData={{
          stageAtmosphereField: "merged-ground",
          stageVisibilityLayer: "environment-background",
          retiredFloorY: NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.positionY,
          visibleCircularBoundary:
            NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.visibleCircularBoundary,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onClearSelection();
        }}
      >
        <planeGeometry
          args={[
            NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent,
            NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent,
          ]}
        />
        <meshStandardMaterial
          ref={groundMatRef}
          color={environment.groundColor}
          transparent
          opacity={environment.groundOpacity}
          metalness={groundResponse.materialMetalness}
          roughness={groundResponse.materialRoughness}
          depthWrite={false}
          depthTest={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {centerHaze ? (
        <mesh
          position={[0, 0, -5.4]}
          renderOrder={-28}
          raycast={() => null}
        >
          <planeGeometry
            args={[
              NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent,
              NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent,
            ]}
          />
          <meshBasicMaterial
            map={centerHaze}
            transparent
            depthWrite={false}
            depthTest={false}
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}
