"use client";

import React, { useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import PsychNebula from "./PsychNebula";
import PsychStars from "./PsychStars";
import PsychFoggySun from "./visual/PsychFoggySun";
import PsychSparkles from "./visual/PsychSparkles";
import NebulaField from "./effects/NebulaField";
import EmotionSparkles from "./effects/EmotionSparkles";
import PsychElementRing from "./objects/PsychElementRing";
import { useEmotionStore } from "../engine/useEmotionStore";
import type { ObjectState, PsychElementId } from "../../lib/psych/reactionTypes";
import type { PsychState } from "../../lib/psych/reactionTypes";

type PsychSceneProps = {
  psychState?: PsychState;
  objects?: Record<PsychElementId, ObjectState>;
  selectedObjectId?: PsychElementId | null;
  compactStars?: boolean;
  onObjectClick?: (id: string) => void;
};

const DEFAULT_PSYCH_STATE: PsychState = {
  energy: 50,
  calm: 50,
  tension: 50,
  curiosity: 50,
};

function CameraMicroReaction({ psychState }: { psychState: PsychState }): null {
  const emotion = useEmotionStore();
  const smoothControlRef = React.useRef(0);

  useFrame(({ camera }, delta) => {
    const tension = Math.max(0, psychState.tension - 50) / 50;
    const energy = Math.max(0, psychState.energy - 50) / 50;
    const intensity = Math.min(1, Math.max(tension, energy * 0.65));
    const meaning = emotion.current.meaning;
    const controlTarget = meaning.type === "control" ? meaning.weight : 0;
    smoothControlRef.current += (controlTarget - smoothControlRef.current) * 0.05;
    const controlStability = 1 - smoothControlRef.current * 0.45;
    const baseZ = 7.2;
    const targetZ = baseZ - intensity * 0.2 * controlStability;
    const safeDelta = Math.min(delta, 0.033);

    if (Math.abs(camera.position.z - baseZ) < 0.85) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, safeDelta * 1.8);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, tension * 0.01 * controlStability, safeDelta * 1.2);
    }
  });

  return null;
}

function BreathingSpace({ children }: { children: React.ReactNode }): React.JSX.Element {
  const sceneRef = React.useRef<THREE.Group | null>(null);

  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    const t = clock.getElapsedTime();
    const breathe = 1 + Math.sin(t * 0.6) * 0.01;
    sceneRef.current.scale.set(breathe, breathe, breathe);
  });

  return <group ref={sceneRef}>{children}</group>;
}

const PsychScene = React.memo(function PsychScene({ psychState = DEFAULT_PSYCH_STATE, objects, selectedObjectId = null, compactStars = false, onObjectClick }: PsychSceneProps): React.JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B02][SceneMounted]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B03.5-FIX][OrbitControlsReady]");
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][B12.3][CinematicLayerActive]");
  }, []);

  const energyGlow = Math.max(0, psychState.energy - 50) / 50;
  const fireGlow = Math.max(0, psychState.tension - 50) / 50;
  const heatField = energyGlow > 0.35 && fireGlow > 0.35;
  const objectValues = useMemo(() => Object.values(objects ?? {}), [objects]);
  const globalIntensity = useMemo(() => {
    if (!objectValues.length) return 0;
    const avg = objectValues.reduce((sum, object) => sum + (object.activity ?? 0), 0) / objectValues.length;
    return Math.min(1, avg);
  }, [objectValues]);
  const egoIntensity = Math.min(1, (objects?.ego?.brightness ?? 0.2) * 0.58 + (objects?.ego?.activity ?? 0.1) * 0.42);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 7.2], fov: 46 }} style={{ width: "100%", height: "100%", pointerEvents: "auto", touchAction: "none" }}>
        {/* ## SYCHO_VISUAL_LAYER_RULE:
            This pass only enhances visual layers.
            DO NOT change reaction engine, chat logic, or object state contracts.
            All visuals must be driven by existing object props (brightness, activity). */}
        {/* ## SYCHO_CINEMATIC_LAYER
            These effects are visual-only layers.
            Must NOT affect scene logic or geometry buffers.
            GPU-safe and non-reactive to avoid WebGL errors. */}
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 10, 80]} />
        <ambientLight intensity={0.24 + energyGlow * 0.08 + (heatField ? 0.04 : 0)} color={heatField ? "#ffd8a0" : "#f0f6ff"} />
        <directionalLight position={[5, 5, 5]} intensity={0.48} />
        <pointLight position={[0, 1.6, 2.8]} intensity={0.55 + energyGlow * 0.18 + fireGlow * 0.12} color={heatField ? "#ffb35c" : "#d8ad72"} />
        <hemisphereLight args={[0x1c2430, 0x061018, 0.12]} />
        <CameraMicroReaction psychState={psychState} />
        <BreathingSpace>
          <NebulaField />
          <PsychNebula />
          <PsychStars compact={compactStars} energy={psychState.energy} />
          <EmotionSparkles intensity={globalIntensity} />
          <PsychFoggySun intensity={egoIntensity} />
          <PsychSparkles intensity={globalIntensity} />
          <PsychElementRing psychState={psychState} objects={objects} selectedObjectId={selectedObjectId} onObjectClick={onObjectClick} />
        </BreathingSpace>
        <OrbitControls
          enableRotate={true}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.05}
          target={[0, 0, 0]}
          minDistance={5.5}
          maxDistance={10}
        />
      </Canvas>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(circle at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
});

export default PsychScene;
