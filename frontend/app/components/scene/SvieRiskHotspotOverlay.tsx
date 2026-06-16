"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshStandardMaterial } from "three";

import type { SvieObjectRiskHotspotVisualStyle } from "../../lib/scene/svie/svieRiskHotspotVisualizationContract.ts";

function sanitizeThreeColor(value: string): string {
  return value.trim().length > 0 ? value : "#ffffff";
}

function disableMeshRaycast(): false {
  return false;
}

type SvieRiskHotspotOverlayProps = Readonly<{
  visual: SvieObjectRiskHotspotVisualStyle;
  meshScale: readonly [number, number, number];
  selectedVisual: boolean;
  scannerHaloVisible: boolean;
}>;

function SvieExecutiveAttentionPulseRing({
  visual,
  meshScale,
  materialRef,
}: Readonly<{
  visual: SvieObjectRiskHotspotVisualStyle;
  meshScale: readonly [number, number, number];
  materialRef: React.RefObject<MeshStandardMaterial | null>;
}>): React.ReactElement {
  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material || !visual.executivePulseEnabled) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.executivePulseSpeed);
    material.emissiveIntensity =
      visual.executivePulseMinIntensity +
      (visual.executivePulseMaxIntensity - visual.executivePulseMinIntensity) * pulse;
    material.opacity =
      visual.glowOpacity +
      (visual.outlineOpacity - visual.glowOpacity) * pulse * 0.4;
  });

  const ringScale =
    visual.executiveAttentionTier === "top1" ? 1.66 : visual.executiveAttentionTier === "top3" ? 1.6 : 1.55;

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
      <torusGeometry args={[0.94, 0.044, 12, 36]} />
      <meshStandardMaterial
        ref={materialRef}
        color={sanitizeThreeColor(
          visual.executiveAttentionTier === "top1" ? visual.haloColor || visual.glowColor : visual.glowColor
        )}
        emissive={sanitizeThreeColor(visual.emissiveColor)}
        emissiveIntensity={visual.executivePulseMinIntensity}
        transparent
        opacity={visual.glowOpacity}
      />
    </mesh>
  );
}

function SvieRiskPulseRing({
  visual,
  meshScale,
  materialRef,
}: Readonly<{
  visual: SvieObjectRiskHotspotVisualStyle;
  meshScale: readonly [number, number, number];
  materialRef: React.RefObject<MeshStandardMaterial | null>;
}>): React.ReactElement {
  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material || !visual.pulseEnabled) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * visual.pulseSpeed);
    material.emissiveIntensity =
      visual.pulseMinIntensity + (visual.pulseMaxIntensity - visual.pulseMinIntensity) * pulse;
    material.opacity = visual.glowOpacity + (visual.outlineOpacity - visual.glowOpacity) * pulse * 0.35;
  });

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * 1.58,
        (meshScale[1] ?? 1) * 1.58,
        (meshScale[2] ?? 1) * 1.58,
      ]}
    >
      <torusGeometry args={[0.92, 0.042, 12, 36]} />
      <meshStandardMaterial
        ref={materialRef}
        color={sanitizeThreeColor(visual.glowColor)}
        emissive={sanitizeThreeColor(visual.emissiveColor)}
        emissiveIntensity={visual.emissiveIntensity}
        transparent
        opacity={visual.glowOpacity}
      />
    </mesh>
  );
}

function SvieRiskHaloRing({
  visual,
  meshScale,
  materialRef,
}: Readonly<{
  visual: SvieObjectRiskHotspotVisualStyle;
  meshScale: readonly [number, number, number];
  materialRef: React.RefObject<MeshStandardMaterial | null>;
}>): React.ReactElement {
  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material || !visual.haloEnabled) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (visual.pulseSpeed * 0.85));
    material.emissiveIntensity = visual.haloIntensity + pulse * 0.12;
    material.opacity = visual.haloOpacity + pulse * 0.08;
  });

  return (
    <mesh
      raycast={disableMeshRaycast}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[
        (meshScale[0] ?? 1) * 1.82,
        (meshScale[1] ?? 1) * 1.82,
        (meshScale[2] ?? 1) * 1.82,
      ]}
    >
      <torusGeometry args={[0.98, 0.05, 12, 40]} />
      <meshStandardMaterial
        ref={materialRef}
        color={sanitizeThreeColor(visual.haloColor)}
        emissive={sanitizeThreeColor(visual.haloColor)}
        emissiveIntensity={visual.haloIntensity}
        transparent
        opacity={visual.haloOpacity}
      />
    </mesh>
  );
}

export function SvieRiskHotspotOverlay({
  visual,
  meshScale,
  selectedVisual,
  scannerHaloVisible,
}: SvieRiskHotspotOverlayProps): React.ReactElement | null {
  const pulseMaterialRef = useRef<MeshStandardMaterial | null>(null);
  const haloMaterialRef = useRef<MeshStandardMaterial | null>(null);

  if (!visual.showOverlay || selectedVisual || scannerHaloVisible) {
    return null;
  }

  return (
    <>
      {visual.showOutline && !visual.pulseEnabled ? (
        <mesh
          raycast={disableMeshRaycast}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[
            (meshScale[0] ?? 1) * 1.52,
            (meshScale[1] ?? 1) * 1.52,
            (meshScale[2] ?? 1) * 1.52,
          ]}
        >
          <torusGeometry args={[0.9, 0.034, 12, 36]} />
          <meshStandardMaterial
            color={sanitizeThreeColor(visual.outlineColor)}
            emissive={sanitizeThreeColor(visual.outlineColor)}
            emissiveIntensity={visual.outlineOpacity}
            transparent
            opacity={visual.outlineOpacity}
          />
        </mesh>
      ) : null}
      {visual.executivePulseEnabled ? (
        <SvieExecutiveAttentionPulseRing
          visual={visual}
          meshScale={meshScale}
          materialRef={pulseMaterialRef}
        />
      ) : null}
      {!visual.executivePulseEnabled && visual.pulseEnabled ? (
        <SvieRiskPulseRing visual={visual} meshScale={meshScale} materialRef={pulseMaterialRef} />
      ) : null}
      {visual.haloEnabled ? (
        <SvieRiskHaloRing visual={visual} meshScale={meshScale} materialRef={haloMaterialRef} />
      ) : null}
    </>
  );
}
