"use client";

import { useMemo, type ReactNode } from "react";
import type {
  Executive3DObjectFacePrimitive,
  Executive3DObjectFaceSymbology,
} from "@/app/lib/spatial-presentation/executive3DObjectFaceSymbology";

type Props = {
  readonly face: Executive3DObjectFaceSymbology;
  readonly frontZ: number;
  readonly faceWidth: number;
  readonly faceHeight: number;
  readonly renderShape:
    | "rounded-slab"
    | "rect-slab"
    | "disc-slab"
    | "hex-slab"
    | "diamond-slab"
    | "soft-plate";
  readonly frontColor: string;
  readonly symbolColor: string;
  readonly edgeTrimColor: string;
  readonly symbolOpacity: number;
  readonly incomplete: boolean;
};

function mixHexToward(hex: string, toward: string, amount: number): string {
  const parse = (value: string) => {
    const raw = value.replace("#", "");
    const full =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw.padStart(6, "0").slice(0, 6);
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
    };
  };
  try {
    const a = parse(hex);
    const b = parse(toward);
    const t = Math.min(1, Math.max(0, amount));
    const to = (n: number) => Math.round(n).toString(16).padStart(2, "0");
    return `#${to(a.r + (b.r - a.r) * t)}${to(a.g + (b.g - a.g) * t)}${to(
      a.b + (b.b - a.b) * t,
    )}`;
  } catch {
    return hex;
  }
}

/**
 * Map normalized face coords [-1,+1] into physical face extents with safe zone.
 * Diamond body uses visual Z rotation; symbol stays face-aligned (no extra Z rot).
 */
function toWorld(
  nx: number,
  ny: number,
  halfW: number,
  halfH: number,
  safe: number,
  scale: number,
): readonly [number, number] {
  const sx = halfW * (1 - safe) * scale;
  const sy = halfH * (1 - safe) * scale;
  return [nx * sx, ny * sy] as const;
}

function PrimitiveMeshes({
  primitives,
  halfW,
  halfH,
  safe,
  scale,
  z,
  color,
  opacity,
}: {
  readonly primitives: readonly Executive3DObjectFacePrimitive[];
  readonly halfW: number;
  readonly halfH: number;
  readonly safe: number;
  readonly scale: number;
  readonly z: number;
  readonly color: string;
  readonly opacity: number;
}): ReactNode {
  const material = (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.14}
      metalness={0.06}
      roughness={0.4}
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped
    />
  );

  return (
    <>
      {primitives.map((primitive, index) => {
        const key = `face-prim-${index}-${primitive.type}`;
        if (primitive.type === "rect") {
          const [cx, cy] = toWorld(
            primitive.x,
            primitive.y,
            halfW,
            halfH,
            safe,
            scale,
          );
          const w = Math.abs(primitive.w) * halfW * (1 - safe) * scale * 2;
          const h = Math.abs(primitive.h) * halfH * (1 - safe) * scale * 2;
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[cx, cy, z]}
              castShadow={false}
              receiveShadow={false}
            >
              <planeGeometry args={[Math.max(w, 0.01), Math.max(h, 0.01)]} />
              {material}
            </mesh>
          );
        }
        if (primitive.type === "circle") {
          const [cx, cy] = toWorld(
            primitive.x,
            primitive.y,
            halfW,
            halfH,
            safe,
            scale,
          );
          const r =
            primitive.r * Math.min(halfW, halfH) * (1 - safe) * scale * 2;
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[cx, cy, z]}
              castShadow={false}
              receiveShadow={false}
            >
              <circleGeometry
                args={[Math.max(r, 0.008), primitive.segments ?? 24]}
              />
              {material}
            </mesh>
          );
        }
        if (primitive.type === "ring") {
          const [cx, cy] = toWorld(
            primitive.x,
            primitive.y,
            halfW,
            halfH,
            safe,
            scale,
          );
          const unit = Math.min(halfW, halfH) * (1 - safe) * scale * 2;
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[cx, cy, z]}
              castShadow={false}
              receiveShadow={false}
            >
              <ringGeometry
                args={[
                  Math.max(primitive.inner * unit, 0.01),
                  Math.max(primitive.outer * unit, 0.014),
                  primitive.segments ?? 36,
                ]}
              />
              {material}
            </mesh>
          );
        }
        if (primitive.type === "line") {
          const [x1, y1] = toWorld(
            primitive.x1,
            primitive.y1,
            halfW,
            halfH,
            safe,
            scale,
          );
          const [x2, y2] = toWorld(
            primitive.x2,
            primitive.y2,
            halfW,
            halfH,
            safe,
            scale,
          );
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 0.01;
          const angle = Math.atan2(dy, dx);
          const thickness = Math.max(
            primitive.thickness *
              Math.min(halfW, halfH) *
              (1 - safe) *
              scale *
              2,
            Math.min(halfW, halfH) * 0.045,
          );
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[(x1 + x2) * 0.5, (y1 + y2) * 0.5, z]}
              rotation={[0, 0, angle]}
              castShadow={false}
              receiveShadow={false}
            >
              <planeGeometry args={[len, Math.max(thickness, 0.008)]} />
              {material}
            </mesh>
          );
        }
        // poly
        const pts = primitive.points.map(([px, py]) =>
          toWorld(px, py, halfW, halfH, safe, scale),
        );
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const cx = (minX + maxX) * 0.5;
        const cy = (minY + maxY) * 0.5;
        // Approximate polygon with a small circle/diamond for lightweight mesh budget.
        if (pts.length === 4) {
          const r =
            Math.max(maxX - minX, maxY - minY) * 0.42 || 0.02;
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[cx, cy, z]}
              rotation={[0, 0, Math.PI / 4]}
              castShadow={false}
              receiveShadow={false}
            >
              <circleGeometry args={[r, 4]} />
              {material}
            </mesh>
          );
        }
        if (pts.length === 3) {
          const r =
            Math.max(maxX - minX, maxY - minY) * 0.45 || 0.016;
          return (
            <mesh
              key={key}
              raycast={() => null}
              position={[cx, cy, z]}
              castShadow={false}
              receiveShadow={false}
            >
              <circleGeometry args={[r, 3]} />
              {material}
            </mesh>
          );
        }
        return (
          <mesh
            key={key}
            raycast={() => null}
            position={[cx, cy, z]}
            castShadow={false}
            receiveShadow={false}
          >
            <circleGeometry args={[0.02, 12]} />
            {material}
          </mesh>
        );
      })}
    </>
  );
}

/**
 * STAGE-3DOBJ:2 — front-face plate + semantic symbol layers.
 * Children of object transform; raycast disabled (parent body owns clicks).
 */
export function ExecutiveObjectFaceSurface({
  face,
  frontZ,
  faceWidth,
  faceHeight,
  renderShape,
  frontColor,
  symbolColor,
  edgeTrimColor,
  symbolOpacity,
  incomplete,
}: Props) {
  const halfW = faceWidth * 0.5;
  const halfH = faceHeight * 0.5;
  const plateZ = frontZ - Math.max(face.faceInset * 0.15, 0.003);
  const symbolZ = frontZ + face.symbolDepth;
  const trimZ = frontZ + face.symbolDepth * 0.35;

  const plateColor = useMemo(
    () => mixHexToward(frontColor, "#f8fafc", 0.16),
    [frontColor],
  );

  if (!face.enabled || face.symbolKind === "none") {
    return null;
  }

  const plateOpacity = incomplete ? 0.78 : 0.94;
  const markOpacity = incomplete ? symbolOpacity * 0.72 : symbolOpacity;

  let plate: ReactNode = null;
  if (face.surfacePattern !== "plain") {
    const insetScale = 1 - face.faceInset * 1.4;
    if (renderShape === "disc-slab") {
      plate = (
        <mesh
          raycast={() => null}
          position={[0, 0, plateZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <circleGeometry
            args={[Math.min(halfW, halfH) * insetScale * 0.96, 48]}
          />
          <meshStandardMaterial
            color={plateColor}
            metalness={0.05}
            roughness={0.44}
            transparent
            opacity={plateOpacity}
            envMapIntensity={0.38}
            depthWrite={false}
          />
        </mesh>
      );
    } else if (renderShape === "hex-slab") {
      plate = (
        <mesh
          raycast={() => null}
          position={[0, 0, plateZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <circleGeometry
            args={[Math.min(halfW, halfH) * insetScale * 0.92, 6]}
          />
          <meshStandardMaterial
            color={plateColor}
            metalness={0.05}
            roughness={0.44}
            transparent
            opacity={plateOpacity}
            envMapIntensity={0.38}
            depthWrite={false}
          />
        </mesh>
      );
    } else if (renderShape === "diamond-slab") {
      // Face-aligned plate (no diamond Z rotation) so symbol stays readable.
      plate = (
        <mesh
          raycast={() => null}
          position={[0, 0, plateZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <circleGeometry
            args={[Math.min(halfW, halfH) * insetScale * 0.88, 4]}
          />
          <meshStandardMaterial
            color={plateColor}
            metalness={0.05}
            roughness={0.54}
            transparent
            opacity={plateOpacity}
            envMapIntensity={0.28}
            depthWrite={false}
          />
        </mesh>
      );
    } else {
      const pw = faceWidth * insetScale;
      const ph =
        renderShape === "rect-slab" || face.shapeFamily === "execution"
          ? faceHeight * insetScale
          : faceHeight * insetScale;
      plate = (
        <mesh
          raycast={() => null}
          position={[0, 0, plateZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <planeGeometry args={[pw, ph]} />
          <meshStandardMaterial
            color={plateColor}
            metalness={0.06}
            roughness={0.5}
            transparent
            opacity={plateOpacity}
            envMapIntensity={0.32}
            depthWrite={false}
          />
        </mesh>
      );
    }
  }

  const edgeTrim =
    face.faceBorder > 0 && face.meshBudget.edgeTrim > 0 ? (
      renderShape === "disc-slab" ||
      renderShape === "hex-slab" ||
      renderShape === "diamond-slab" ? (
        <mesh
          raycast={() => null}
          position={[0, 0, trimZ]}
          castShadow={false}
          receiveShadow={false}
        >
          <ringGeometry
            args={[
              Math.min(halfW, halfH) * 0.9,
              Math.min(halfW, halfH) * (0.9 + face.faceBorder),
              renderShape === "hex-slab"
                ? 6
                : renderShape === "diamond-slab"
                  ? 4
                  : 48,
            ]}
          />
          <meshBasicMaterial
            color={edgeTrimColor}
            transparent
            opacity={
              face.stateMarker === "critical-edge"
                ? 0.55
                : face.stateMarker === "warm-edge"
                  ? 0.42
                  : face.stateMarker === "positive-edge"
                    ? 0.38
                    : face.stateMarker === "focus-clarity"
                      ? 0.48
                      : 0.28
            }
            depthWrite={false}
          />
        </mesh>
      ) : null
    ) : null;

  return (
    <group
      userData={{
        stage3dobjSurface: true,
        stage3dobjSurfaceContract: "stage-3dobj-2",
        symbolKind: face.symbolKind,
        surfaceRole: face.surfaceRole,
        symbolDepth: face.symbolDepth,
        expandsSilhouette: false,
      }}
    >
      {plate}
      {edgeTrim}
      <PrimitiveMeshes
        primitives={face.primitives}
        halfW={halfW}
        halfH={halfH}
        safe={face.safeZone}
        scale={face.symbolScale}
        z={symbolZ}
        color={symbolColor}
        opacity={markOpacity}
      />
      {face.secondaryPrimitives.length > 0 ? (
        <PrimitiveMeshes
          primitives={face.secondaryPrimitives}
          halfW={halfW}
          halfH={halfH}
          safe={face.safeZone}
          scale={face.symbolScale * 0.92}
          z={symbolZ + face.symbolDepth * 0.25}
          color={mixHexToward(symbolColor, "#ffffff", 0.12)}
          opacity={markOpacity * 0.85}
        />
      ) : null}
    </group>
  );
}
