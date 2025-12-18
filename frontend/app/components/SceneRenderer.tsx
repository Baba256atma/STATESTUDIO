"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { smoothValue } from "../lib/smooth";

import type { SceneJson, SceneObject } from "../lib/sceneTypes";
import { riskToColor, clamp01 } from "../lib/colorUtils";
import { useStateVector, useSetSelectedId, useOverrides, useSelectedId } from "./SceneContext";
import { clamp } from "../lib/sizeCommands";

// --------------------
// Geometry registry
// --------------------
function geometryFor(type: SceneObject["type"]) {
  switch (type) {
    case "sphere":
      return <sphereGeometry args={[0.8, 32, 32]} />;
    case "box":
      return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    case "torus":
      return <torusGeometry args={[0.8, 0.25, 20, 60]} />;
    case "cone":
      return <coneGeometry args={[0.8, 1.4, 32]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.6, 0.6, 1.4, 32]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.9, 0]} />;
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
}

// --------------------
// Auto color / intensity helpers
// --------------------
function computeAutoColor(tags: string[], sv: Record<string, number> | null) {
  if (!sv) return "#dddddd";
  const qualityRisk = clamp01(sv.quality_risk ?? 0.2);
  const inventoryPressure = clamp01(sv.inventory_pressure ?? 0.2);
  const timePressure = clamp01(sv.time_pressure ?? 0.2);

  if (tags.includes("quality")) return riskToColor(qualityRisk);
  if (tags.includes("inventory")) return riskToColor(inventoryPressure);
  if (tags.includes("time")) return riskToColor(timePressure);

  const avg = clamp01((qualityRisk + inventoryPressure + timePressure) / 3);
  return riskToColor(avg);
}

function computeAutoIntensity(tags: string[], base: number, sv: Record<string, number> | null) {
  let k = base;
  if (!sv) return k;

  const q = clamp01(sv.quality_risk ?? 0.2);
  const inv = clamp01(sv.inventory_pressure ?? 0.2);
  const tp = clamp01(sv.time_pressure ?? 0.2);

  if (tags.includes("quality")) k = Math.max(k, q);
  if (tags.includes("inventory")) k = Math.max(k, inv);
  if (tags.includes("time")) k = Math.max(k, tp);
  if (tags.includes("state_core")) k = Math.max(k, (q + inv + tp) / 3);

  return k;
}

// --------------------
// Lights
// --------------------
function JsonLights({ sceneJson, shadowsEnabled }: { sceneJson: SceneJson; shadowsEnabled: boolean }) {
  // If lights are missing in JSON, fallback
  const lights = sceneJson.scene?.lights ?? [];
  if (lights.length === 0) {
    return (
      <>
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 10, 4]} intensity={0.9} castShadow={shadowsEnabled} />
        <pointLight position={[0, 4, -3]} intensity={0.4} />
      </>
    );
  }

  return (
    <>
      {lights.map((l: any, i: number) => {
        if (l.type === "ambient") return <ambientLight key={i} intensity={l.intensity ?? 0.6} />;
        if (l.type === "directional")
          return (
            <directionalLight
              key={i}
              position={l.pos ?? [5, 8, 3]}
              intensity={l.intensity ?? 0.9}
              castShadow={shadowsEnabled}
            />
          );
        if (l.type === "point")
          return <pointLight key={i} position={l.pos ?? [0, 5, 0]} intensity={l.intensity ?? 1.0} />;
        return null;
      })}
    </>
  );
}

// --------------------
// Scene object renderer
// --------------------
function AnimatableObject({
  obj,
  anim,
  index,
  shadowsEnabled = false,
}: {
  obj: SceneObject;
  anim?: { type: "pulse" | "wobble" | "spin"; intensity: number };
  index: number;
  shadowsEnabled?: boolean;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const sv = useStateVector();
  const setSelectedId = useSetSelectedId();
  const tags = obj.tags ?? [];
  const stableId = obj.id ?? `${obj.type ?? "obj"}:${index}`;
  const stableIdWithName = (obj as any).id ?? (obj as any).name ?? `${obj.type ?? "obj"}:${index}`;
  const overrides = useOverrides();
  const material = useMemo(
    () => obj.material ?? { color: "#cccccc", opacity: 0.9 },
    [obj.material]
  );
  const transform = obj.transform ?? { pos: [0, 0, 0], scale: [1, 1, 1] };
  const baseScale = useMemo(() => transform.scale ?? [1, 1, 1], [transform.scale]);
  const safeType = obj.type ?? "box";
  // compute uniform override scale (prefer id or name when available)
  const overrideEntry = overrides[stableIdWithName] ?? overrides[stableId] ?? {};
  const overrideScale = overrideEntry.scale;
  const originalUniform = Array.isArray(transform.scale) && transform.scale.length > 0 ? Number(transform.scale[0]) || 1 : 1;
  const finalUniform = clamp(originalUniform * (overrideScale ?? 1), 0.2, 2.0);
  const groupScale: [number, number, number] = [
    (baseScale[0] ?? 1) * finalUniform,
    (baseScale[1] ?? 1) * finalUniform,
    (baseScale[2] ?? 1) * finalUniform,
  ];

  // compute other override-able props
  const finalPosition = overrideEntry.position ?? transform.pos ?? [0, 0, 0];
  const finalRotation = overrideEntry.rotation ?? (transform as any).rot ?? [0, 0, 0]; // radians
  const finalColorOverride = overrideEntry.color;
  const finalVisible = overrideEntry.visible ?? true;

  // Geometry and material preparation
  const color = useMemo(() => {
    const materialColor = material.color ?? "#cccccc";
    if (materialColor !== "auto") return materialColor;
    return computeAutoColor(tags, sv);
  }, [material.color, tags, sv]);

  const appliedColor = finalColorOverride ?? color;
  const selectedIdCtx = useSelectedId();
  const isSelected = selectedIdCtx === stableIdWithName || selectedIdCtx === stableId;

  const materialProps = useMemo(
    () => ({
      color,
      transparent: true,
      opacity: material.opacity ?? 0.9,
      emissive: material.emissive,
      emissiveIntensity: material.emissiveIntensity,
    }),
    [color, material.opacity, material.emissive, material.emissiveIntensity]
  );

  const pointsGeometry = useMemo(() => {
    if (obj.type !== "points_cloud") return null;
    const pts: number[][] = obj.data?.points ?? [];
    const flat: number[] = [];
    for (const p of pts) {
      flat.push(p[0] ?? 0, p[1] ?? 0, p[2] ?? 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));
    return g;
  }, [obj.id, JSON.stringify(obj.data)]);

  const lineGeometry = useMemo(() => {
    if (obj.type !== "line_path") return null;
    const pts: number[][] = obj.data?.path ?? [];
    const flat: number[] = [];
    for (const p of pts) {
      flat.push(p[0] ?? 0, p[1] ?? 0, p[2] ?? 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));
    return g;
  }, [obj.id, JSON.stringify(obj.data)]);

  useEffect(() => {
    return () => {
      pointsGeometry?.dispose();
      lineGeometry?.dispose();
    };
  }, [pointsGeometry, lineGeometry]);

  // Animation + smooth scaling logic
  const smoothUniform = useRef<number>(finalUniform);
  const speed = 12;

  useEffect(() => {
    // initialize scale once
    const m = ref.current;
    if (m) {
      const v = smoothUniform.current;
      m.scale.set((baseScale[0] ?? 1) * v, (baseScale[1] ?? 1) * v, (baseScale[2] ?? 1) * v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;

    // smooth toward latest finalUniform
    smoothUniform.current = smoothValue(smoothUniform.current, finalUniform, speed, delta);

    const t = state.clock.getElapsedTime();
    const k = computeAutoIntensity(tags, anim?.intensity ?? 0.3, sv);

    let pulseFactor = 1;
    if (anim?.type === "pulse") {
      pulseFactor = 1 + Math.sin(t * 2) * 0.08 * k;
    }

    // apply base rotation (from overrides or json)
    try {
      m.rotation.set(finalRotation[0] ?? 0, finalRotation[1] ?? 0, finalRotation[2] ?? 0);
    } catch (e) {
      // ignore if rotation values invalid
    }

    // spin: additive increment
    if (anim?.type === "spin") {
      m.rotation.y += 0.01 * k;
    }

    // wobble: additive offsets on top of base rotation
    if (anim?.type === "wobble") {
      m.rotation.x += Math.sin(t * 2) * 0.25 * k;
      m.rotation.z += Math.cos(t * 2) * 0.25 * k;
    }

    const applied = smoothUniform.current * pulseFactor;
    m.scale.set((baseScale[0] ?? 1) * applied, (baseScale[1] ?? 1) * applied, (baseScale[2] ?? 1) * applied);
  });

  // Render selection
  let node: React.ReactNode = null;
  if (obj.type === "points_cloud" && pointsGeometry) {
    node = (
      <points
        geometry={pointsGeometry}
        onPointerDown={(e) => {
          console.log("[select] click", stableIdWithName);
          e.stopPropagation();
          setSelectedId(stableIdWithName);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <pointsMaterial
          color={appliedColor}
          size={obj.material?.size ?? 0.03}
          sizeAttenuation
          transparent
          opacity={obj.material?.opacity ?? 0.85}
        />
      </points>
    );
  } else if (obj.type === "line_path" && lineGeometry) {
    const lineMaterial = useMemo(() => {
      return new THREE.LineBasicMaterial({
        color: new THREE.Color(appliedColor),
        transparent: true,
        opacity: obj.material?.opacity ?? 0.9,
      });
      // NOTE: material disposed in effect below
    }, [appliedColor, obj.material?.opacity]);

    const lineObj = useMemo(() => {
      return new THREE.Line(lineGeometry, lineMaterial);
    }, [lineGeometry, lineMaterial]);

    useEffect(() => {
      return () => {
        lineMaterial.dispose();
      };
    }, [lineMaterial]);

    node = (
      <primitive
        object={lineObj}
        onPointerDown={(e: any) => {
          console.log("[select] click", stableIdWithName);
          e.stopPropagation();
          setSelectedId(stableIdWithName);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
    );
  } else {
    const geometryNode = geometryFor(safeType);
    node = (
      <mesh
          castShadow={!!shadowsEnabled}
          receiveShadow={!!shadowsEnabled}
        onPointerDown={(e) => {
          console.log("[select] click", stableIdWithName);
          e.stopPropagation();
          setSelectedId(stableIdWithName);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {geometryNode}
        <meshStandardMaterial
          {...materialProps}
          color={appliedColor}
          emissive={isSelected ? "#ffffff" : materialProps.emissive}
          emissiveIntensity={isSelected ? Math.max(0.6, materialProps.emissiveIntensity ?? 0) : (materialProps.emissiveIntensity ?? 0)}
        />
      </mesh>
    );
  }

  React.useEffect(() => {
    if (selectedIdCtx === stableIdWithName || selectedIdCtx === stableId) {
      console.log("[select] selected changed for", stableIdWithName, "->", selectedIdCtx);
    }
  }, [selectedIdCtx, stableIdWithName, stableId]);

  const captionText = ((overrideEntry.caption ?? "") as string).trim();
  const showCaption = overrideEntry.showCaption === true;
  const labelY = ((baseScale[1] ?? 1) * finalUniform) * 0.6 + 0.2;

  return (
    <group ref={ref} position={finalPosition} visible={finalVisible}>
      {node}
      {showCaption && captionText.length > 0 && (
        <Html position={[0, labelY, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{ fontSize: 13, padding: "4px 8px", background: "rgba(0,0,0,0.55)", color: "white", borderRadius: 6, whiteSpace: "nowrap" }}>
            {captionText}
          </div>
        </Html>
      )}
    </group>
  );
}

// --------------------
// Camera helper
// --------------------
function CameraLerper({ target, enabled = true }: { target: [number, number, number]; enabled?: boolean }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...target));
  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);
  useFrame(() => {
    if (!enabled) return;
    camera.position.lerp(targetRef.current, 0.08);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// --------------------
// Main renderer
// --------------------
export function SceneRenderer({ sceneJson, shadowsEnabled }: { sceneJson: SceneJson | null; shadowsEnabled?: boolean }) {
  const sv = useStateVector();
  if (!sceneJson) return null;

  const objects = sceneJson.scene?.objects ?? [];
  const anims = sceneJson.scene?.animations ?? [];

  const animMap = useMemo(() => {
    const m = new Map<string, any>();
    for (const a of anims) m.set(a.target, a);
    return m;
  }, [anims]);

  const cam = sceneJson.scene?.camera;

  const camPos: [number, number, number] =
    Array.isArray(cam?.pos) && cam!.pos.length >= 3
      ? [
          Number(cam!.pos[0]) || 0,
          Number(cam!.pos[1]) || 3,
          Number(cam!.pos[2]) || 8,
        ]
      : [0, 3, 8];
  const cameraLocked = !!sceneJson.meta?.cameraLockedByUser;

  return (
    <>
      <CameraLerper target={camPos} enabled={!cameraLocked} />
      <JsonLights sceneJson={sceneJson} shadowsEnabled={!!shadowsEnabled} />

      {objects.map((o, idx) => {
        const stableId = o.id ?? `${o.type ?? "obj"}:${idx}`;
        return <AnimatableObject key={stableId} obj={o} anim={animMap.get(o.id)} index={idx} shadowsEnabled={!!shadowsEnabled} />;
      })}
    </>
  );
}
