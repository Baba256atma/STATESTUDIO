"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieCauseChainNodeVisualStyle } from "../../lib/scene/svie/svieCauseChainVisualizationContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieCauseChainNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieCauseChainNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material || !visual.showNodeHighlight) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2 + visual.sequentialGlowPhase * Math.PI * 2);
    material.emissiveIntensity = visual.glowIntensity + pulse * 0.12;
    material.opacity = visual.glowOpacity + pulse * 0.08;
  });

  if (!visual.showNodeHighlight || selectedVisual || scannerHaloVisible) {
    return null;
  }

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * 1.48,
        (meshScale[1] ?? 1) * 1.48,
        (meshScale[2] ?? 1) * 1.48,
      ]}
    >
      <torusGeometry args={[0.88, 0.032, 12, 32]} />
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
