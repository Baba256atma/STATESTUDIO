"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { SystemVisualScene } from "./visual/SystemVisualScene";
import type { VisualState } from "../lib/visualState";

export function SceneViewport({
  visualState,
  focusId,
  backgroundMode,
  orbitMode,
  showAxes,
  onFocus,
}: {
  visualState: VisualState;
  focusId: string | null;
  backgroundMode: "day" | "night" | "stars";
  orbitMode: "auto" | "manual";
  showAxes: boolean;
  onFocus?: (id: string) => void;
}) {
  const visualWithFocus = useMemo(
    () => ({ ...visualState, focus: focusId ?? visualState.focus }),
    [visualState, focusId]
  );

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      {backgroundMode === "day" && <color attach="background" args={["#e8edf6"]} />}
      {backgroundMode === "night" && <color attach="background" args={["#0b0f16"]} />}
      {backgroundMode === "stars" && <color attach="background" args={["#050b2a"]} />}
      {backgroundMode === "stars" && (
        <Stars radius={40} depth={26} count={420} factor={1.6} saturation={0} fade speed={0} />
      )}
      <OrbitControls autoRotate={orbitMode === "auto"} autoRotateSpeed={0.6} />
      {showAxes && <axesHelper args={[3]} />}
      <SystemVisualScene
        visual={visualWithFocus}
        backgroundMode={backgroundMode}
        onFocus={onFocus}
      />
    </Canvas>
  );
}
