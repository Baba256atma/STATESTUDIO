"use client";

import { useMemo, useEffect, forwardRef, type ReactNode } from "react";
import { Shape, ExtrudeGeometry, type Mesh } from "three";
import type { ExecutivePremiumObjectForm } from "@/app/lib/spatial-presentation/executive3DObjectPremiumForm";

type Props = {
  readonly form: ExecutivePremiumObjectForm;
  readonly width: number;
  readonly height: number;
  readonly bodyMaterial: ReactNode;
  readonly faceMaterial: ReactNode;
  readonly recessMaterial: ReactNode;
  readonly edgeColor: string;
  readonly interactiveHandlers: Record<string, unknown>;
};

function roundedRectShape(
  width: number,
  height: number,
  radius: number,
): Shape {
  const w = width * 0.5;
  const h = height * 0.5;
  const r = Math.min(radius, w * 0.45, h * 0.45);
  const shape = new Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);
  return shape;
}

/**
 * STAGE-3DOBJ:3 — purpose-built premium body (extruded plate / tapered solid).
 * Back on semantic plane (z≈0); volume toward +Z. Raycast on body only.
 */
export const ExecutiveObjectPremiumBody = forwardRef<Mesh, Props>(
  function ExecutiveObjectPremiumBody(
    {
      form,
      width,
      height,
      bodyMaterial,
      faceMaterial,
      recessMaterial,
      edgeColor,
      interactiveHandlers,
    },
    ref,
  ) {
    const depth = form.depth;
    const centerZ = form.centerZ;
    const frontScale = form.frontScale;
    const profile = form.bodyProfile;

    const extrudeGeo = useMemo(() => {
      if (
        profile === "target-puck" ||
        profile === "faceted-diamond" ||
        profile === "layered-soft-hex" ||
        profile === "decisive-hex-plate"
      ) {
        return null;
      }
      const shape = roundedRectShape(width, height, form.cornerRadius);
      const geo = new ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 12,
      });
      // Keep rear/base on semantic plane (local +Z only).
      geo.computeBoundingBox();
      const minZ = geo.boundingBox?.min.z ?? 0;
      if (minZ < 0) geo.translate(0, 0, -minZ);
      return geo;
    }, [profile, width, height, form.cornerRadius, depth]);

    useEffect(() => {
      return () => {
        extrudeGeo?.dispose();
      };
    }, [extrudeGeo]);

    // Keep faceMaterial referenced so call sites stay stable; recess uses recessMaterial.
    void faceMaterial;

    const recessW = width * frontScale * (1 - form.recessInset * 1.85);
    const recessH = height * frontScale * (1 - form.recessInset * 1.85);
    const recessZ = form.frontZ - form.recessDepth;
    const recessRadius = Math.min(
      form.cornerRadius * 0.85,
      Math.min(recessW, recessH) * 0.22,
    );

    let body: ReactNode;
    if (
      profile === "target-puck" ||
      profile === "faceted-diamond" ||
      profile === "layered-soft-hex" ||
      profile === "decisive-hex-plate"
    ) {
      const radial = Math.min(width, height) * 0.5;
      const segments =
        profile === "target-puck"
          ? 48
          : profile === "faceted-diamond"
            ? 4
            : 6;
      const zRot = profile === "faceted-diamond" ? Math.PI / 4 : 0;
      // Taper: smaller front radius (cylinder top → +Z after rot).
      body = (
        <mesh
          ref={ref}
          position={[0, 0, centerZ]}
          rotation={[Math.PI / 2, 0, zRot]}
          castShadow={false}
          receiveShadow={false}
          {...interactiveHandlers}
        >
          <cylinderGeometry
            args={[
              radial * frontScale,
              radial,
              depth,
              segments,
            ]}
          />
          {bodyMaterial}
        </mesh>
      );
    } else if (extrudeGeo) {
      body = (
        <mesh
          ref={ref}
          geometry={extrudeGeo}
          position={[0, 0, 0]}
          castShadow={false}
          receiveShadow={false}
          {...interactiveHandlers}
        >
          {bodyMaterial}
        </mesh>
      );
    } else {
      body = (
        <mesh
          ref={ref}
          position={[0, 0, centerZ]}
          castShadow={false}
          receiveShadow={false}
          {...interactiveHandlers}
        >
          <boxGeometry args={[width, height, depth]} />
          {bodyMaterial}
        </mesh>
      );
    }

    const satinFace = null;

    const recess =
      form.recessProfile !== "none" && form.recessDepth > 0 ? (
        profile === "target-puck" ? (
          <mesh
            raycast={() => null}
            position={[0, 0, recessZ]}
            castShadow={false}
            receiveShadow={false}
          >
            <circleGeometry args={[Math.min(recessW, recessH) * 0.48, 48]} />
            {recessMaterial}
          </mesh>
        ) : profile === "faceted-diamond" ||
          profile === "layered-soft-hex" ||
          profile === "decisive-hex-plate" ? (
          <mesh
            raycast={() => null}
            position={[0, 0, recessZ]}
            rotation={[
              0,
              0,
              profile === "faceted-diamond" ? Math.PI / 4 : 0,
            ]}
            castShadow={false}
            receiveShadow={false}
          >
            <circleGeometry
              args={[
                Math.min(recessW, recessH) * 0.46,
                profile === "faceted-diamond" ? 4 : 6,
              ]}
            />
            {recessMaterial}
          </mesh>
        ) : (
          <mesh
            raycast={() => null}
            position={[0, 0, recessZ]}
            castShadow={false}
            receiveShadow={false}
          >
            <shapeGeometry
              args={[roundedRectShape(recessW, recessH, recessRadius)]}
            />
            {recessMaterial}
          </mesh>
        )
      ) : null;

    const recessFrame = null;

    const rim =
      form.edgeProfile !== "quiet" &&
      (profile === "target-puck" ||
        profile === "faceted-diamond" ||
        profile === "layered-soft-hex" ||
        profile === "decisive-hex-plate") ? (
        <mesh
          raycast={() => null}
          position={[0, 0, form.frontZ + 0.001]}
          castShadow={false}
          receiveShadow={false}
        >
          <ringGeometry
            args={[
              Math.min(width, height) * 0.5 * frontScale * 0.92,
              Math.min(width, height) * 0.5 * frontScale * 0.98,
              profile === "faceted-diamond"
                ? 4
                : profile === "target-puck"
                  ? 48
                  : 6,
            ]}
          />
          <meshBasicMaterial
            color={edgeColor}
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
      ) : null;

    const signature =
      form.signatureDetail === "side-seam" ? (
        <mesh
          raycast={() => null}
          position={[width * 0.42, 0, centerZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[0.018, height * 0.55, depth * 0.55]} />
          <meshStandardMaterial
            color="#0a1220"
            roughness={0.78}
            metalness={0.08}
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      ) : form.signatureDetail === "longitudinal-slot" ? (
        <mesh
          raycast={() => null}
          position={[0, height * 0.28, recessZ + 0.001]}
          castShadow={false}
          receiveShadow={false}
        >
          <planeGeometry args={[width * 0.55 * frontScale, 0.02]} />
          <meshBasicMaterial
            color={edgeColor}
            transparent
            opacity={0.28}
            depthWrite={false}
          />
        </mesh>
      ) : form.signatureDetail === "edge-notch" ? (
        <mesh
          raycast={() => null}
          position={[width * 0.48, height * 0.2, centerZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[0.04, 0.12, depth * 0.4]} />
          <meshStandardMaterial
            color="#070d18"
            roughness={0.82}
            metalness={0.05}
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </mesh>
      ) : null;

    return (
      <group
        userData={{
          stage3dobjForm: true,
          stage3dobjFormContract: "stage-3dobj-3",
          bodyProfile: form.bodyProfile,
          frontScale: form.frontScale,
          taper: form.taper,
          recessProfile: form.recessProfile,
        }}
      >
        {body}
        {satinFace}
        {recess}
        {recessFrame}
        {rim}
        {signature}
      </group>
    );
  },
);
