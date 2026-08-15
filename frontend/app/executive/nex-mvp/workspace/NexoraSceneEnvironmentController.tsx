"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import type { Fog, MeshStandardMaterial } from "three";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
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
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.15, 0]}
        castShadow={groundShadow.castShadow}
        receiveShadow={
          groundShadow.receiveShadow && groundResponse.receiveShadows
        }
        onClick={(event) => {
          event.stopPropagation();
          onClearSelection();
        }}
      >
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial
          ref={groundMatRef}
          color={environment.groundColor}
          transparent
          opacity={environment.groundOpacity}
          metalness={groundResponse.materialMetalness}
          roughness={groundResponse.materialRoughness}
        />
      </mesh>
    </group>
  );
}
