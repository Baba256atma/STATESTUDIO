"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import type {
  AmbientLight,
  DirectionalLight,
  Fog,
  MeshStandardMaterial,
} from "three";
import type { NexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";

type Props = {
  readonly environment: NexoraMVPSceneEnvironmentVisualState;
  readonly onClearSelection: () => void;
};

function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
}

/**
 * Interpolates Stage lighting / fog / ground from environment visual tokens.
 * Presentation only — does not infer workspace semantics.
 */
export function NexoraSceneEnvironmentController({
  environment,
  onClearSelection,
}: Props) {
  const { scene } = useThree();
  const ambientRef = useRef<AmbientLight>(null);
  const keyRef = useRef<DirectionalLight>(null);
  const fillRef = useRef<DirectionalLight>(null);
  const fogRef = useRef<Fog>(null);
  const groundMatRef = useRef<MeshStandardMaterial>(null);
  const targetBg = useRef(new Color(environment.background));
  const targetKey = useRef(new Color(environment.keyLightColor));
  const targetFill = useRef(new Color(environment.fillLightColor));
  const targetGround = useRef(new Color(environment.groundColor));

  useEffect(() => {
    targetBg.current.set(environment.background);
    targetKey.current.set(environment.keyLightColor);
    targetFill.current.set(environment.fillLightColor);
    targetGround.current.set(environment.groundColor);
  }, [
    environment.background,
    environment.fillLightColor,
    environment.groundColor,
    environment.keyLightColor,
  ]);

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

    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(
        ambientRef.current.intensity,
        environment.ambientIntensity,
        speed,
      );
    }
    if (keyRef.current) {
      keyRef.current.intensity = lerp(
        keyRef.current.intensity,
        environment.keyLightIntensity,
        speed,
      );
      keyRef.current.color.lerp(targetKey.current, speed);
    }
    if (fillRef.current) {
      fillRef.current.intensity = lerp(
        fillRef.current.intensity,
        environment.fillLightIntensity,
        speed,
      );
      fillRef.current.color.lerp(targetFill.current, speed);
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
      <ambientLight ref={ambientRef} intensity={environment.ambientIntensity} />
      <directionalLight
        ref={keyRef}
        position={[4.5, 7.5, 3.5]}
        intensity={environment.keyLightIntensity}
        color={environment.keyLightColor}
      />
      <directionalLight
        ref={fillRef}
        position={[-5, 2.5, -3]}
        intensity={environment.fillLightIntensity}
        color={environment.fillLightColor}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.15, 0]}
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
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}
