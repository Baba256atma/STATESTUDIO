"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieExecutiveFutureStoryNodeVisualStyle } from "../../lib/scene/svie/svieExecutiveFutureStoryLayerContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieExecutiveFutureStoryNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieExecutiveFutureStoryNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed + visual.storyIndex * 0.45);
    material.emissiveIntensity = visual.glowIntensity + pulse * 0.07;
    material.opacity = visual.glowOpacity + pulse * 0.04;
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
      <torusGeometry
        args={[
          1.02,
          visual.role === "future_outcome" || visual.role === "future_recommendation" ? 0.038 : 0.03,
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
