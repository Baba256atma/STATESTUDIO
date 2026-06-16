"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieScenarioDeltaNodeVisualStyle } from "../../lib/scene/svie/svieScenarioDeltaVisualizationContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieScenarioDeltaNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieScenarioDeltaNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed);
    material.emissiveIntensity = visual.glowIntensity + pulse * 0.07;
    material.opacity = visual.glowOpacity + pulse * 0.05;
  });

  if (selectedVisual || scannerHaloVisible) {
    return null;
  }

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * visual.radiusMultiplier,
        (meshScale[1] ?? 1) * visual.radiusMultiplier,
        (meshScale[2] ?? 1) * visual.radiusMultiplier,
      ]}
    >
      <torusGeometry
        args={[
          0.96,
          visual.direction === "increase" ? 0.04 : visual.direction === "decrease" ? 0.034 : 0.026,
          12,
          36,
        ]}
      />
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
