"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieScenarioConfidenceNodeVisualStyle } from "../../lib/scene/svie/svieScenarioConfidenceLayerContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieScenarioConfidenceNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieScenarioConfidenceNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;

    if (visual.pulseMode === "stable") {
      material.emissiveIntensity = visual.glowIntensity;
      material.opacity = visual.glowOpacity;
      return;
    }

    if (visual.pulseMode === "soft") {
      const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed);
      material.emissiveIntensity = visual.glowIntensity + pulse * visual.pulseAmplitude;
      material.opacity = visual.glowOpacity + pulse * visual.pulseAmplitude * 0.5;
      return;
    }

    const wobble =
      0.5 +
      0.5 *
        Math.sin(clock.elapsedTime * visual.pulseSpeed + Math.sin(clock.elapsedTime * 1.5) * 0.9);
    material.emissiveIntensity = visual.glowIntensity + wobble * visual.pulseAmplitude;
    material.opacity = visual.glowOpacity + wobble * visual.pulseAmplitude * 0.65;
  });

  if (selectedVisual || scannerHaloVisible) {
    return null;
  }

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * visual.ringScale,
        (meshScale[1] ?? 1) * visual.ringScale,
        (meshScale[2] ?? 1) * visual.ringScale,
      ]}
    >
      <torusGeometry args={[0.78, 0.02, 10, 28]} />
      <meshStandardMaterial
        ref={materialRef}
        color={sanitizeThreeColor(visual.glowColor)}
        emissive={sanitizeThreeColor(visual.glowColor)}
        emissiveIntensity={visual.glowIntensity}
        transparent
        opacity={visual.glowOpacity}
      />
    </mesh>
  );
}
