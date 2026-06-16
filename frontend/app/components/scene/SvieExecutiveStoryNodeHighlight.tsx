"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieExecutiveStoryNodeVisualStyle } from "../../lib/scene/svie/svieExecutiveStoryLayerContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieExecutiveStoryNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieExecutiveStoryNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed + visual.storyIndex * 0.4);
    material.emissiveIntensity = visual.glowIntensity + pulse * 0.06;
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
      <torusGeometry args={[0.86, visual.role === "recommendation" ? 0.036 : 0.028, 12, 32]} />
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
