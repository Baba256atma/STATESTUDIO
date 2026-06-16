"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieScenarioComparisonNodeVisualStyle } from "../../lib/scene/svie/svieScenarioComparisonLayerContract.ts";
import { sanitizeThreeColor } from "../../lib/scene/threeColorSanitizer";

function disableMeshRaycast(): false {
  return false;
}

export function SvieScenarioComparisonNodeHighlight({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: Readonly<{
  visual: SvieScenarioComparisonNodeVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>): React.ReactElement | null {
  const materialRef = useRef<MeshStandardMaterial | null>(null);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed);
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
        (meshScale[0] ?? 1) * visual.radiusMultiplier,
        (meshScale[1] ?? 1) * visual.radiusMultiplier,
        (meshScale[2] ?? 1) * visual.radiusMultiplier,
      ]}
    >
      <torusGeometry
        args={[
          1.02,
          visual.role === "primary" ? 0.044 : visual.role === "secondary" ? 0.034 : 0.026,
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
