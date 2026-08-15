"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  type Group,
  type Points,
} from "three";
import {
  EXECUTIVE_STAGE_DEEP_Z_BOUNDARY,
  EXECUTIVE_STAGE_DEEP_Z_RANGE,
  isExecutiveStageDeepZEnvironmentEnabled,
} from "@/app/lib/spatial-presentation/executiveStageDeepZVisualEnvironment";
import {
  EXECUTIVE_OBJECT_PRESENCE_DEEP_Z,
  isExecutiveObjectPresenceV2Enabled,
} from "@/app/lib/spatial-presentation/executiveObjectPresenceIdentity";

type Props = {
  /** Overview vs anchored — tiny restrained atmosphere response only. */
  readonly topologyMode: "overview" | "anchored";
  /** When false, render nothing (dev/test compare path). */
  readonly enabled?: boolean;
};

/**
 * STAGE-DEPTH:1 — Deep-Z visual vortex / atmosphere behind the Executive plane.
 *
 * Presentation-only. Non-interactive. No NexoraObject identity.
 * Uses negative Z (camera at z=11 looks toward −Z).
 */
export function NexoraStageDeepZEnvironment({
  topologyMode,
  enabled,
}: Props) {
  const groupRef = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = enabled ?? isExecutiveStageDeepZEnvironmentEnabled();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const particleGeometry = useMemo(() => {
    const count = EXECUTIVE_STAGE_DEEP_Z_RANGE.particleCount;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = i / count;
      const angle = t * Math.PI * 2 * 3.7;
      const radius = 0.35 + (i % 17) * 0.14 + (i % 5) * 0.05;
      const depth =
        EXECUTIVE_STAGE_DEEP_Z_RANGE.near -
        0.4 -
        (i % 11) * 0.75 -
        (i % 3) * 0.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.92;
      positions[i * 3 + 2] = Math.max(
        EXECUTIVE_STAGE_DEEP_Z_RANGE.far + 0.2,
        depth,
      );
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const radialPositions = useMemo(() => {
    const segments = EXECUTIVE_STAGE_DEEP_Z_RANGE.radialSegmentCount;
    const points: number[] = [];
    const inner = EXECUTIVE_STAGE_DEEP_Z_RANGE.quietZoneRadius * 0.55;
    const outer = 3.2;
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      points.push(cos * inner, sin * inner, -2.2);
      points.push(cos * outer, sin * outer, -8.4);
    }
    return new Float32Array(points);
  }, []);

  const radialGeometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(radialPositions, 3),
    );
    return geometry;
  }, [radialPositions]);

  useFrame((_, delta) => {
    if (!active || reducedMotion) return;
    const group = groupRef.current;
    if (group) {
      // Almost imperceptible Z-axis drift.
      group.rotation.z += delta * 0.018;
    }
    const points = pointsRef.current;
    if (points) {
      points.rotation.z -= delta * 0.012;
    }
  });

  if (!active) return null;

  const convergenceBoost = topologyMode === "anchored" ? 1.12 : 1;
  // STAGE-OBJ:2 — keep Deep-Z subordinate to enlarged object presence.
  const presenceAtmosphere = isExecutiveObjectPresenceV2Enabled()
    ? EXECUTIVE_OBJECT_PRESENCE_DEEP_Z
    : null;
  const farDiscOpacity = presenceAtmosphere?.farDiscOpacity ?? 0.55;
  const ringOpacityScale = presenceAtmosphere?.ringOpacityScale ?? 1;
  const particleOpacityScale = presenceAtmosphere?.particleOpacityScale ?? 1;
  const ringColor = new Color("#6b8cae");
  const particleColor = new Color("#8aa4c0");

  return (
    <group
      ref={groupRef}
      userData={{
        spatialLayer: "visual-depth-environment",
        stageDepthEnvironment: "deep-z",
        interactive: false,
        isNexoraObject: false,
        boundary: EXECUTIVE_STAGE_DEEP_Z_BOUNDARY.architecturalRole,
      }}
      renderOrder={-20}
    >
      {/* Far field disc — calm backdrop, no raycast. */}
      <mesh
        position={[0, 0, EXECUTIVE_STAGE_DEEP_Z_RANGE.far]}
        renderOrder={-25}
        raycast={() => null}
      >
        <circleGeometry args={[6.5, 48]} />
        <meshBasicMaterial
          color="#0a1018"
          transparent
          opacity={farDiscOpacity}
          depthWrite={false}
          depthTest
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Soft near atmosphere plane with central quiet bias via low opacity. */}
      <mesh
        position={[0, 0, EXECUTIVE_STAGE_DEEP_Z_RANGE.near - 0.15]}
        renderOrder={-22}
        raycast={() => null}
      >
        <ringGeometry
          args={[
            EXECUTIVE_STAGE_DEEP_Z_RANGE.quietZoneRadius,
            4.8,
            64,
          ]}
        />
        <meshBasicMaterial
          color="#152033"
          transparent
          opacity={0.08 * convergenceBoost * ringOpacityScale}
          depthWrite={false}
          depthTest
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {EXECUTIVE_STAGE_DEEP_Z_RANGE.rings.map((ring, index) => (
        <mesh
          key={`deep-z-ring-${index}`}
          position={[0, 0, ring.z]}
          scale={[ring.scale, ring.scale, 1]}
          renderOrder={-21 + index}
          raycast={() => null}
        >
          <ringGeometry args={[0.72, 0.78, 72]} />
          <meshBasicMaterial
            color={ringColor}
            transparent
            opacity={ring.opacity * convergenceBoost * ringOpacityScale}
            depthWrite={false}
            depthTest
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Faint radial tunnel traces */}
      <lineSegments
        geometry={radialGeometry}
        renderOrder={-18}
        raycast={() => null}
      >
        <lineBasicMaterial
          color="#5a7390"
          transparent
          opacity={0.045 * convergenceBoost * ringOpacityScale}
          depthWrite={false}
          depthTest
          toneMapped={false}
        />
      </lineSegments>

      <points
        ref={pointsRef}
        geometry={particleGeometry}
        renderOrder={-17}
        raycast={() => null}
      >
        <pointsMaterial
          color={particleColor}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.22 * convergenceBoost * particleOpacityScale}
          depthWrite={false}
          depthTest
          toneMapped={false}
        />
      </points>
    </group>
  );
}
