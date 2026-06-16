"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieRecommendationNodeVisualStyle } from "../../lib/scene/svie/svieRecommendationVisualizationContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieRecommendationNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieRecommendationNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material || !visual.showHighlight) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed);
    material.emissiveIntensity = visual.glowIntensity + pulse * 0.1;
    material.opacity = visual.glowOpacity + pulse * 0.06;
  });

  if (!visual.showHighlight || selectedVisual || scannerHaloVisible) {
    return null;
  }

  const ringScale = visual.ringScale;

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * ringScale,
        (meshScale[1] ?? 1) * ringScale,
        (meshScale[2] ?? 1) * ringScale,
      ]}
    >
      <torusGeometry args={[0.9, visual.tier === 1 ? 0.04 : visual.tier === 2 ? 0.034 : 0.028, 12, 32]} />
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
