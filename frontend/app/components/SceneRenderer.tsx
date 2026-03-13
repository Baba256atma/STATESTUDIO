"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Line, useCursor } from "@react-three/drei";
import { smoothValue } from "../lib/smooth";

import type { SceneJson, SceneObject, SceneLoop } from "../lib/sceneTypes";
import { riskToColor, clamp01 } from "../lib/colorUtils";
import { useStateVector, useSetSelectedId, useOverrides, useSelectedId, useChatOffset } from "./SceneContext";
import { clamp } from "../lib/sizeCommands";
import {
  buildObjectVisualProfile,
  deriveObjectVisualRole,
  resolveGeometryKindForObject,
  resolveRelationVisualProfile,
  roleToHierarchyStyle,
  type ObjectVisualRole,
  type VisualLanguageContext,
} from "../lib/visual/objectVisualLanguage";
import { getThemeTokens } from "../lib/design/designTokens";

// --------------------
// Geometry registry
// --------------------
type GeometryKind =
  | SceneObject["type"]
  | "ring";

function geometryFor(type: GeometryKind) {
  switch (type) {
    case "sphere":
      return <sphereGeometry args={[0.8, 32, 32]} />;
    case "box":
      return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    case "torus":
      return <torusGeometry args={[0.8, 0.25, 20, 60]} />;
    case "ring":
      return <torusGeometry args={[0.55, 0.12, 16, 32]} />;
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

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function fallbackPos(index: number, total: number): [number, number, number] {
  const n = Math.max(1, total);
  const radius = Math.max(2.5, n * 0.12);
  const angle = (index / n) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

function hashIdToUnit(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return (h % 100000) / 100000;
}

function fallbackPosFromId(id: string): THREE.Vector3 {
  const u = hashIdToUnit(id);
  const angle = u * Math.PI * 2;
  const r = 2.2;
  return new THREE.Vector3(Math.cos(angle) * r, 0, Math.sin(angle) * r);
}

function getObjPos(id: string, objects: any[]): THREE.Vector3 {
  const found = objects.find((o: any) => o?.id === id);
  const posCandidates = [
    found?.position,
    (found?.transform as any)?.pos,
    (found as any)?.pos,
  ];
  for (const p of posCandidates) {
    if (Array.isArray(p) && p.length >= 3) {
      return new THREE.Vector3(Number(p[0]) || 0, Number(p[1]) || 0, Number(p[2]) || 0);
    }
    if (p && typeof p === "object" && "x" in p && "y" in p && "z" in p) {
      return new THREE.Vector3(Number((p as any).x) || 0, Number((p as any).y) || 0, Number((p as any).z) || 0);
    }
  }

  // Preferred static layout for the 3 core business objects when no position provided.
  const baselinePos: Record<string, [number, number, number]> = {
    obj_inventory: [-1.6, 0, 0],
    obj_delivery: [0, 0, 0],
    obj_risk_zone: [1.6, 0, 0],
  };
  if (baselinePos[id]) {
    const [x, y, z] = baselinePos[id];
    return new THREE.Vector3(x, y, z);
  }

  // Fallback to deterministic layout based on index if present in objects array.
  const idx = objects.findIndex((o: any) => o?.id === id);
  if (idx >= 0) {
    const [x, y, z] = fallbackPos(idx, objects.length);
    return new THREE.Vector3(x, y, z);
  }

  // stable deterministic fallback based on id hash
  return fallbackPosFromId(id);
}

function toPosTuple(
  raw: unknown,
  fallback: [number, number, number]
): [number, number, number] {
  if (Array.isArray(raw) && raw.length >= 3) {
    const x = Number(raw[0]);
    const y = Number(raw[1]);
    const z = Number(raw[2]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      return [x, y, z];
    }
  }
  if (raw && typeof raw === "object") {
    const x = Number((raw as any).x);
    const y = Number((raw as any).y);
    const z = Number((raw as any).z);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      return [x, y, z];
    }
  }
  return fallback;
}

function AnimatedDashedEdge({
  from,
  to,
  active,
  strength,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  active: boolean;
  strength: number;
}) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const dashedMatRef = useRef<THREE.LineDashedMaterial>(null);
  const solidMatRef = useRef<THREE.LineBasicMaterial>(null);

  const points = useMemo(() => [from.clone(), to.clone()], [from, to]);

  useEffect(() => {
    if (!geomRef.current) return;
    geomRef.current.setFromPoints(points);
    // ensures dash distances are computed
    // @ts-ignore
    if (geomRef.current.computeLineDistances) geomRef.current.computeLineDistances();
  }, [points]);

  useFrame((state) => {
    if (dashedMatRef.current) {
      const t = state.clock.getElapsedTime();
      // animate via scale for a subtle flowing feel; dashOffset is not typed on the material
      dashedMatRef.current.scale = 1 + Math.sin(t * (active ? 1.2 : 0.8)) * 0.25;
    }
    if (solidMatRef.current) {
      const t = state.clock.getElapsedTime();
      const pulse = 0.05 * Math.sin(t * 1.8);
      solidMatRef.current.opacity = Math.min(1, opacity + 0.25 + pulse);
    }
  });

  const dashSize = 0.2 + clamp01(strength) * 0.35;
  const gapSize = 0.25 + clamp01(strength) * 0.4;
  const opacity = active ? Math.min(1, 0.5 + strength * 0.5) : Math.min(0.65, 0.25 + strength * 0.25);
  const color = active ? "#f1c40f" : "#95a5a6";

  return (
    <group>
      <line>
        <bufferGeometry ref={geomRef} attach="geometry" />
        <lineDashedMaterial
          ref={dashedMatRef}
          attach="material"
          color={color}
          transparent
          opacity={opacity}
          dashSize={dashSize}
          gapSize={gapSize}
        />
      </line>
      {active && (
        <line>
          <bufferGeometry ref={geomRef} attach="geometry" />
          <lineBasicMaterial
            ref={solidMatRef}
            attach="material"
            color={color}
            transparent
            opacity={Math.min(1, opacity + 0.25)}
          />
        </line>
      )}
    </group>
  );
}

// --------------------
// Loop lines renderer
// --------------------
function LoopLinesAnimated({
  objects,
  loops,
  activeLoopId,
  showLoops,
  showLoopLabels,
  modeId,
  theme = "night",
}: {
  objects: any[];
  loops: SceneLoop[];
  activeLoopId: string | null;
  showLoops: boolean | undefined;
  showLoopLabels?: boolean;
  modeId?: string;
  theme?: "day" | "night" | "stars";
}) {
  const tokens = useMemo(() => getThemeTokens(theme, modeId), [theme, modeId]);
  const inactiveProfile = useMemo(
    () => resolveRelationVisualProfile({ kind: "dependency", active: false, mode_id: modeId }),
    [modeId]
  );

  const posMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    objects.forEach((o: any, idx: number) => {
      const id = String(o?.id ?? `obj_${idx}`);
      const v = getObjPos(id, objects);
      map.set(id, [v.x, v.y, v.z]);
    });
    return map;
  }, [objects]);

  const edges = useMemo(() => {
    const all: Array<{
      from: string;
      to: string;
      weight: number;
      polarity: string;
      loopId: string;
      label?: string;
      kind?: string;
    }> = [];
    loops.forEach((l, li) => {
      const loopId = l?.id ?? `loop_${li}`;
      const strength = typeof (l as any)?.severity === "number"
        ? clamp01((l as any).severity)
        : typeof (l as any)?.strength === "number"
        ? clamp01((l as any).strength)
        : 0.5;

      const polarity = ((l as any)?.polarity as string) ?? "neutral";
      if (Array.isArray(l?.edges)) {
        l.edges!.forEach((e, ei) => {
          const from = String((e as any)?.from ?? "");
          const to = String((e as any)?.to ?? "");
          if (!from || !to) return;
          const w = typeof (e as any)?.weight === "number" ? clamp01((e as any).weight) : strength;
          const pol = ((e as any)?.polarity as string) ?? ((e as any)?.kind as string) ?? polarity;
          all.push({
            from,
            to,
            weight: w,
            polarity: pol,
            loopId,
            label: (e as any)?.label ?? (l as any)?.label,
            kind: (e as any)?.kind ?? (l as any)?.type ?? polarity,
          });
        });
      }
    });
    return all;
  }, [loops]);

  const activeEdges = useMemo(() => edges.filter((e) => activeLoopId && e.loopId === activeLoopId), [edges, activeLoopId]);
  const inactiveEdges = useMemo(
    () => edges.filter((e) => !activeLoopId || e.loopId !== activeLoopId),
    [edges, activeLoopId]
  );

  const safeInactiveEdges = Array.isArray(inactiveEdges) ? inactiveEdges : [];
  const safeActiveEdges = Array.isArray(activeEdges) ? activeEdges : [];
  const activeWeightMean = useMemo(() => {
    if (!safeActiveEdges.length) return 0;
    const total = safeActiveEdges.reduce((sum, e) => sum + clamp01(Number(e.weight ?? 0.5)), 0);
    return clamp01(total / safeActiveEdges.length);
  }, [safeActiveEdges]);

  const buildGeometry = (edgeList: typeof edges) => {
    const positions: number[] = [];
    edgeList.forEach((e) => {
      const from = posMap.get(e.from);
      const to = posMap.get(e.to);
      if (!from || !to) return;
      positions.push(...from, ...to);
    });
    if (positions.length === 0) return null as unknown as THREE.BufferGeometry | null;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  };

  const inactiveGeo = useMemo(() => buildGeometry(safeInactiveEdges), [safeInactiveEdges, posMap]);
  const activeGeo = useMemo(() => buildGeometry(safeActiveEdges), [safeActiveEdges, posMap]);

  React.useEffect(() => {
    return () => {
      try {
        inactiveGeo?.dispose();
      } catch {}
    };
  }, [inactiveGeo]);

  React.useEffect(() => {
    return () => {
      try {
        activeGeo?.dispose();
      } catch {}
    };
  }, [activeGeo]);

  const inactiveMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: inactiveProfile.color || tokens.design.colors.relationNeutral,
        transparent: true,
        opacity: safeActiveEdges.length > 0 ? inactiveProfile.opacity : Math.max(0.18, inactiveProfile.opacity),
      }),
    [inactiveProfile.color, inactiveProfile.opacity, safeActiveEdges.length, tokens.design.colors.relationNeutral]
  );

  const activeMaterials = useMemo(() => {
    const leadProfile = resolveRelationVisualProfile({
      kind: safeActiveEdges[0]?.kind,
      polarity: safeActiveEdges[0]?.polarity,
      active: true,
      mode_id: modeId,
    });
    const col = leadProfile.color as THREE.ColorRepresentation;
    const baseOpacity = Math.min(1, leadProfile.opacity + activeWeightMean * 0.18);
    return [
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: baseOpacity }),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: baseOpacity }),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: baseOpacity }),
    ];
  }, [safeActiveEdges, activeWeightMean, modeId]);

  // Dispose materials on unmount
  React.useEffect(() => {
    return () => {
      try {
        inactiveMat.dispose();
      } catch {}
    };
  }, [inactiveMat]);

  React.useEffect(() => {
    return () => {
      activeMaterials.forEach((m) => {
        try {
          m.dispose();
        } catch {}
      });
    };
  }, [activeMaterials]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulse = 0.55 + 0.45 * Math.sin(t * tokens.motion.relationPulseHz);
    const base = 0.34 + activeWeightMean * 0.22;
    activeMaterials.forEach((m) => {
      m.opacity = Math.min(1, base + pulse * 0.38);
    });
  });

  // Memoize active loop offset geometries and clean up
  const activeGeos = React.useMemo(() => {
    if (!activeGeo) return [] as THREE.BufferGeometry[];
    return activeMaterials.map((_, idx) => {
      const offset = idx === 0 ? 0 : idx === 1 ? 0.012 : -0.012;
      const geo = activeGeo.clone();
      const posArr = geo.getAttribute("position") as THREE.BufferAttribute;
      const arr = posArr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += offset;
      }
      posArr.needsUpdate = true;
      return geo;
    });
  }, [activeGeo, activeMaterials]);

  React.useEffect(() => {
    return () => {
      activeGeos.forEach((g) => {
        try {
          g.dispose();
        } catch {}
      });
    };
  }, [activeGeos]);

  const hasAny = safeInactiveEdges.length > 0 || safeActiveEdges.length > 0;
  if (!showLoops || !hasAny) return null;

  return (
    <group name="loop-lines" userData={{ showLoopLabels }}>
      {inactiveGeo && <lineSegments geometry={inactiveGeo} material={inactiveMat} />}
      {activeGeos.length > 0 &&
        activeGeos.map((geo, idx) => {
          const mat = activeMaterials[idx];
          return mat ? <lineSegments key={idx} geometry={geo} material={mat} /> : null;
        })}
    </group>
  );
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
  focusMode,
  focusedId,
  theme = "night",
  getUxForObject,
  objectUxById,
  globalScale = 1,
  modeId,
}: {
  obj: SceneObject;
  anim?: { type: "pulse" | "wobble" | "spin"; intensity: number };
  index: number;
  shadowsEnabled?: boolean;
  focusMode?: "all" | "selected" | "pinned";
  focusedId?: string | null;
  theme?: "day" | "night" | "stars";
  getUxForObject?: (id: string) => {
    shape?: string;
    base_color?: string;
    opacity?: number;
    scale?: number;
  } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  globalScale?: number;
  modeId?: string;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const sv = useStateVector();
  const setSelectedId = useSetSelectedId();
  const tags = obj.tags ?? [];
  const stableId = obj.id ?? `${obj.type ?? "obj"}:${index}`;
  const stableIdWithName = (obj as any).id ?? (obj as any).name ?? `${obj.type ?? "obj"}:${index}`;
  const overrides = useOverrides();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const visualContext = useMemo<VisualLanguageContext>(
    () => ({
      theme: theme ?? "night",
      mode_id: modeId,
    }),
    [theme, modeId]
  );
  const tokens = useMemo(() => getThemeTokens(theme ?? "night", modeId), [theme, modeId]);
  const visualRole = useMemo<ObjectVisualRole>(
    () => deriveObjectVisualRole(obj, tags, visualContext),
    [obj, tags, visualContext]
  );
  const visualProfile = useMemo(
    () => buildObjectVisualProfile(obj, tags, visualContext),
    [obj, tags, visualContext]
  );
  const vStyle = useMemo(
    () => roleToHierarchyStyle(visualRole, visualContext),
    [visualRole, visualContext]
  );

  type MaterialLike = {
    color?: string;
    opacity?: number;
    emissive?: string;
    emissiveIntensity?: number;
    size?: number;
  };

  const material = useMemo<MaterialLike>(() => {
    const m = (obj as any)?.material;
    if (m && typeof m === "object") return m as MaterialLike;
    return { color: "#cccccc", opacity: 0.9 };
  }, [(obj as any)?.material]);
  const isFocusActive =
    focusMode !== "all" && typeof focusedId === "string" && focusedId.length > 0;
  const isFocused = isFocusActive && (focusedId === stableIdWithName || focusedId === stableId);
  const dimOthers = isFocusActive && !isFocused;
  const isDimmed = dimOthers;
  const defaultPos: [number, number, number] = [index * 1.8 - 1.8, 0, 0];
  const transformPos = toPosTuple((obj.transform as any)?.pos ?? (obj as any).position, defaultPos);

  // Scene JSON may provide `transform` as an untyped object; normalize defensively.
  const rawTransform = (obj as any).transform ?? {};
  const rawScale = rawTransform?.scale;
  const rawPos = rawTransform?.pos;

  const transform = {
    pos: toPosTuple(rawPos, transformPos),
    scale: (Array.isArray(rawScale) && rawScale.length >= 3 ? rawScale : [1, 1, 1]) as [number, number, number],
    rot: rawTransform?.rot,
  };

  const baseScale = useMemo(() => transform.scale, [transform.scale]);
  const safeType = obj.type ?? "box";
  // compute uniform override scale (prefer id or name when available)
  const overrideEntry = overrides[stableIdWithName] ?? overrides[stableId] ?? {};
  const ux = getUxForObject?.(stableIdWithName) ?? getUxForObject?.(stableId) ?? null;
  const uxOverrides = objectUxById?.[stableIdWithName] ?? objectUxById?.[stableId] ?? {};
  const overrideScale = overrideEntry.scale;
  const originalUniform =
    Array.isArray(transform.scale) && transform.scale.length > 0 ? Number(transform.scale[0]) || 1 : 1;
  const uxScale = typeof uxOverrides.scale === "number" ? clamp(uxOverrides.scale, 0.5, 2.0) : 1;
  const finalUniform = clamp(originalUniform * (overrideScale ?? 1) * uxScale * (globalScale ?? 1), 0.15, 2.0);
  const focusScaleMul = isFocused ? 1.06 : dimOthers ? 0.92 : 1.0;
  const shape = resolveGeometryKindForObject({
    obj,
    explicitShape: (obj as any).shape ?? ux?.shape,
    fallbackType: safeType,
    profile: visualProfile,
  });

  // compute other override-able props
  const finalPosition = overrideEntry.position ?? transformPos ?? [0, 0, 0];
  const finalRotation = overrideEntry.rotation ?? (transform as any).rot ?? [0, 0, 0]; // radians
  const finalColorOverride = overrideEntry.color;
  const finalVisible = overrideEntry.visible ?? true;

  // Geometry and material preparation
  const color = useMemo(() => {
    const materialColor = material.color ?? ux?.base_color ?? "#cccccc";
    if (materialColor !== "auto") return materialColor;
    return computeAutoColor(tags, sv);
  }, [material.color, tags, sv, ux?.base_color]);

  const appliedColor = useMemo(() => {
    const base = finalColorOverride ?? color;
    const c = new THREE.Color(base);
    if (visualRole === "risk") {
      c.lerp(new THREE.Color(tokens.design.colors.pressure), 0.16);
    } else if (visualRole === "core") {
      c.multiplyScalar(theme === "day" ? 1.05 : 1.08);
    } else if (visualRole === "background") {
      c.multiplyScalar(theme === "day" ? 0.82 : 0.72);
    } else if (visualRole === "strategic") {
      c.lerp(new THREE.Color(tokens.design.colors.strategic), 0.1);
    }
    if (!isDimmed) return `#${c.getHexString()}`;
    const mul = theme === "day" ? 0.35 : 0.55;
    c.multiplyScalar(mul);
    return `#${c.getHexString()}`;
  }, [color, finalColorOverride, isDimmed, theme, visualRole, tokens.design.colors.pressure, tokens.design.colors.strategic]);

  const selectedIdCtx = useSelectedId();
  const isSelected = selectedIdCtx === stableIdWithName || selectedIdCtx === stableId;

  const handleSelect = (e: any) => {
    setHovered(false);
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
    setSelectedId(stableIdWithName);
  };

  const stopPointerOnly = (e: any) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  const materialProps = useMemo(
    () => ({
      color: appliedColor,
      transparent: true,
      opacity: (() => {
        const uxOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1;
        const baseOpacity = material.opacity ?? 0.9;
        const adjusted = baseOpacity * uxOpacity * vStyle.opacityMul;
        if (!isFocusActive || !isDimmed) return adjusted;
        return theme === "day" ? Math.min(adjusted, 0.28) : Math.min(adjusted, 0.18);
      })(),
      emissive: material.emissive,
      emissiveIntensity: material.emissiveIntensity,
    }),
    [
      appliedColor,
      isDimmed,
      isFocusActive,
      material.emissive,
      material.emissiveIntensity,
      material.opacity,
      theme,
      uxOverrides.opacity,
      vStyle.opacityMul,
    ]
  );

  const baseOpacity = materialProps.opacity ?? 0.9;
  const focusedOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1.0;
  const hoveredOpacity = hovered && !isFocused && !isSelected ? Math.min(1, baseOpacity + tokens.interaction.hoverOpacityBoost) : baseOpacity;
  const finalOpacity = isDimmed ? baseOpacity : isFocused ? focusedOpacity : hoveredOpacity;
  const baseEmissiveIntensity = materialProps.emissiveIntensity ?? 0;
  const focusEmissiveBoost = isFocused
    ? Math.max(0.85, baseEmissiveIntensity + tokens.interaction.focusGlow)
    : Math.max(0, baseEmissiveIntensity + vStyle.emissiveBoost);
  const finalEmissiveIntensity = isDimmed ? 0 : focusEmissiveBoost;
  const selectedBoost = isSelected ? Math.max(tokens.interaction.selectionGlow, baseEmissiveIntensity) : baseEmissiveIntensity;
  const hoveredBoost =
    hovered && !isSelected && !isFocused
      ? Math.max(baseEmissiveIntensity + tokens.interaction.hoverIntensity, baseEmissiveIntensity)
      : baseEmissiveIntensity;
  const effectiveEmissiveIntensity = Math.max(finalEmissiveIntensity, selectedBoost, hoveredBoost);

  const pointsData = ((obj as any).data?.points ?? null) as number[][] | null;
  const pointsCount = Array.isArray(pointsData) ? pointsData.length : 0;
  const pointsFirstLast = useMemo(() => {
    if (!Array.isArray(pointsData) || pointsData.length === 0) return "";
    const first = pointsData[0] ?? [];
    const last = pointsData[pointsData.length - 1] ?? [];
    return `${first[0] ?? 0},${first[1] ?? 0},${first[2] ?? 0}:${last[0] ?? 0},${last[1] ?? 0},${last[2] ?? 0}`;
  }, [pointsCount, pointsData]);

  const pathData = ((obj as any).data?.path ?? null) as number[][] | null;
  const pathCount = Array.isArray(pathData) ? pathData.length : 0;
  const pathFirstLast = useMemo(() => {
    if (!Array.isArray(pathData) || pathData.length === 0) return "";
    const first = pathData[0] ?? [];
    const last = pathData[pathData.length - 1] ?? [];
    return `${first[0] ?? 0},${first[1] ?? 0},${first[2] ?? 0}:${last[0] ?? 0},${last[1] ?? 0},${last[2] ?? 0}`;
  }, [pathCount, pathData]);

  const pointsGeometry = useMemo(() => {
    if (obj.type !== "points_cloud") return null;
    const pts = (pointsData ?? []) as number[][];
    const flat: number[] = [];
    for (const p of pts) {
      flat.push(p?.[0] ?? 0, p?.[1] ?? 0, p?.[2] ?? 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));
    return g;
  }, [obj.id, obj.type, pointsCount, pointsFirstLast]);

  const lineGeometry = useMemo(() => {
    if (obj.type !== "line_path") return null;
    const pts = (pathData ?? []) as number[][];
    const flat: number[] = [];
    for (const p of pts) {
      flat.push(p?.[0] ?? 0, p?.[1] ?? 0, p?.[2] ?? 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));
    return g;
  }, [obj.id, obj.type, pathCount, pathFirstLast]);

  // --- Tube geometry for line_path invisible collider
  const tubeGeometry = useMemo(() => {
    if (obj.type !== "line_path") return null;
    const pts = (pathData ?? []) as number[][];
    if (!Array.isArray(pts) || pts.length < 2) return null;
    const curvePts = pts.map((p) => new THREE.Vector3(p?.[0] ?? 0, p?.[1] ?? 0, p?.[2] ?? 0));
    const curve = new THREE.CatmullRomCurve3(curvePts);
    // Slightly thicker than the visual line so it's easier to click
    return new THREE.TubeGeometry(curve, Math.min(200, Math.max(20, curvePts.length * 4)), 0.12, 8, false);
  }, [obj.id, obj.type, pathCount, pathFirstLast]);

  useEffect(() => {
    return () => {
      pointsGeometry?.dispose();
      lineGeometry?.dispose();
      tubeGeometry?.dispose();
    };
  }, [pointsGeometry, lineGeometry, tubeGeometry]);

  // Animation + smooth scaling logic
  const smoothUniform = useRef<number>(finalUniform);
    const speed = tokens.motion.objectEmphasisLerp;
  const ambientPhase = useMemo(() => hashIdToUnit(String(stableIdWithName)) * Math.PI * 2, [stableIdWithName]);
  const ambientAmp = useMemo(() => {
    if (obj.type === "line_path" || obj.type === "points_cloud") return 0.05;
    return 0.08 * vStyle.ambientMul;
  }, [obj.type, vStyle.ambientMul]);

  useEffect(() => {
    // initialize scale once
    const m = ref.current;
    if (m) {
      const v = smoothUniform.current;
      const s = v * focusScaleMul;
      m.scale.set((baseScale[0] ?? 1) * s, (baseScale[1] ?? 1) * s, (baseScale[2] ?? 1) * s);
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

    // Subtle ambient drift keeps scene objects "alive" without pointer/click side-effects.
    const baseX = Number(finalPosition?.[0] ?? 0);
    const baseY = Number(finalPosition?.[1] ?? 0);
    const baseZ = Number(finalPosition?.[2] ?? 0);
    const driftSpeed = tokens.motion.sceneIdleSway;
    const driftX = Math.cos(t * 0.31 * driftSpeed + ambientPhase) * ambientAmp * 0.55;
    const driftY = Math.sin(t * 0.45 * driftSpeed + ambientPhase) * ambientAmp;
    const driftZ = Math.sin(t * 0.27 * driftSpeed + ambientPhase * 0.7) * ambientAmp * 0.5;
    const targetX = baseX + driftX;
    const targetY = baseY + driftY;
    const targetZ = baseZ + driftZ;
    // Smooth settle toward base+idle offset so objects feel alive without jitter.
    const nextX = smoothValue(m.position.x, targetX, 6, delta);
    const nextY = smoothValue(m.position.y, targetY, 6, delta);
    const nextZ = smoothValue(m.position.z, targetZ, 6, delta);
    m.position.set(nextX, nextY, nextZ);

    const hierarchyScaleMul = isFocused || isSelected ? 1 : vStyle.scaleMul;
    const hoverScaleMul = hovered && !isFocused && !isSelected ? 1 + tokens.interaction.hoverIntensity * 0.05 : 1;
    const modeEmphasisMul = tokens.interaction.sceneObjectEmphasis;
    const applied = smoothUniform.current * pulseFactor * focusScaleMul * hierarchyScaleMul * hoverScaleMul * modeEmphasisMul;
    m.scale.set((baseScale[0] ?? 1) * applied, (baseScale[1] ?? 1) * applied, (baseScale[2] ?? 1) * applied);
  });

  // Render selection
  let node: React.ReactNode = null;
  if (obj.type === "points_cloud" && pointsGeometry) {
    node = (
      <group>
        <mesh
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <sphereGeometry args={[1.25, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <points
          geometry={pointsGeometry}
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        >
          <pointsMaterial
            color={appliedColor}
            size={((obj as any).material?.size as number | undefined) ?? 0.03}
            sizeAttenuation
            transparent
            opacity={materialProps.opacity ?? 0.85}
          />
        </points>
      </group>
    );
  } else if (obj.type === "line_path" && lineGeometry) {
    node = (
      <group>
        {tubeGeometry && (
          <mesh
            geometry={tubeGeometry}
            onPointerDown={stopPointerOnly}
            onClick={handleSelect}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={() => {
              setHovered(false);
            }}
          >
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}

        <Line
          points={(pathData ?? []) as any}
          transparent
          opacity={materialProps.opacity ?? 0.9}
          color={appliedColor}
          onPointerDown={stopPointerOnly}
          onClick={handleSelect}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
        />
      </group>
    );
  } else {
    const geometryNode = geometryFor(shape as GeometryKind);
    const meshScale = Array.isArray(baseScale)
      ? (baseScale as any)
      : [baseScale ?? 1, baseScale ?? 1, baseScale ?? 1];

    const meshProps = {
      castShadow: !!shadowsEnabled,
      receiveShadow: !!shadowsEnabled,
      onPointerDown: stopPointerOnly,
      onClick: handleSelect,
      onPointerOver: (e: any) => {
        e.stopPropagation();
        setHovered(true);
      },
      onPointerOut: () => {
        setHovered(false);
      },
      scale: meshScale,
    };

    node = (
      <>
        {isFocused ? (
          <mesh
            {...(meshProps as any)}
            scale={[
              (meshScale?.[0] ?? 1) * 1.06,
              (meshScale?.[1] ?? 1) * 1.06,
              (meshScale?.[2] ?? 1) * 1.06,
            ]}
          >
            {geometryNode}
            <meshBasicMaterial
              color={theme === "day" ? "#111827" : "#ffffff"}
              transparent
              opacity={theme === "day" ? 0.18 : 0.1}
              wireframe
            />
          </mesh>
        ) : null}

        <mesh {...(meshProps as any)}>
          {geometryNode}
          <meshStandardMaterial
            {...materialProps}
            color={appliedColor}
            emissive={isFocused ? "#ffffff" : isSelected ? "#ffffff" : materialProps.emissive}
            emissiveIntensity={
              isFocused
                ? Math.max(
                    0.85,
                    (materialProps.emissiveIntensity ?? 0) + (theme === "day" ? 0.35 : 0.55)
                  )
                : isSelected
                ? Math.max(0.6, materialProps.emissiveIntensity ?? 0)
                : materialProps.emissiveIntensity ?? 0
            }
            transparent
            opacity={finalOpacity}
          />
        </mesh>
        <mesh
          {...(meshProps as any)}
          // Slightly larger hit target for easier selection
          scale={[
            (meshScale?.[0] ?? 1) * 1.25,
            (meshScale?.[1] ?? 1) * 1.25,
            (meshScale?.[2] ?? 1) * 1.25,
          ]}
        >
          {geometryFor(shape as GeometryKind)}
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </>
    );
  }

  const captionText = ((overrideEntry.caption ?? "") as string).trim();
  const showCaption = overrideEntry.showCaption === true;
  const labelY = ((baseScale[1] ?? 1) * finalUniform) * 0.6 + 0.2;

  return (
    <group ref={ref} position={finalPosition} visible={finalVisible}>
      {node}
      {showCaption && captionText.length > 0 && (
        <Html position={[0, labelY, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              fontSize: tokens.design.typography.sm,
              padding: `${tokens.design.spacing.xs}px ${tokens.design.spacing.sm}px`,
              background: tokens.theme === "day" ? "rgba(15,23,42,0.68)" : "rgba(0,0,0,0.55)",
              color: tokens.design.colors.textPrimary,
              borderRadius: tokens.design.radius.sm,
              whiteSpace: "nowrap",
            }}
          >
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

export type SceneRendererProps = {
  sceneJson: SceneJson | null;
  shadowsEnabled?: boolean;
  focusMode?: "all" | "selected" | "pinned";
  focusedId?: string | null;
  theme?: "day" | "night" | "stars";
  getUxForObject?: (id: string) => { shape?: string; base_color?: string } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;
  loops?: SceneLoop[];
  showLoops?: boolean;
  showLoopLabels?: boolean;
  activeLoopId?: string | null;
  globalScale?: number;
};

// --------------------
// Main renderer
// --------------------
export function SceneRenderer({
  sceneJson,
  shadowsEnabled,
  focusMode,
  focusedId,
  theme,
  getUxForObject,
  objectUxById,
  loops,
  showLoops,
  showLoopLabels = false,
  activeLoopId: propActiveLoopId,
  globalScale = 1,
}: SceneRendererProps) {
  if (!sceneJson) return null;

  const chatOffset = useChatOffset();
  const selectedIdCtx = useSelectedId();

  const objects = sceneJson.scene?.objects ?? [];
  const anims = ((sceneJson.scene?.animations ?? []) as any[]);
  const loopList: SceneLoop[] = Array.isArray(loops) ? loops : (sceneJson as any)?.scene?.loops ?? [];
  const activeLoopId: string | null =
    propActiveLoopId ??
    ((sceneJson as any)?.scene?.active_loop as string | undefined) ??
    ((sceneJson as any)?.scene?.activeLoopId as string | undefined) ??
    null;
  const visualModeId: string | undefined =
    String(
      (sceneJson as any)?.product_mode?.mode_id ??
        (sceneJson as any)?.meta?.product_mode_id ??
        ""
    ).trim() || undefined;

  const animMap = useMemo(() => {
    const m = new Map<string, any>();
    for (const a of anims) {
      const target = a?.target != null ? String(a.target) : "";
      if (!target) continue;
      m.set(target, a);
    }
    return m;
  }, [anims]);

  const cam = sceneJson.scene?.camera;

  const camPos: [number, number, number] =
    Array.isArray(cam?.pos) && cam!.pos.length >= 3
      ? [Number(cam!.pos[0]) || 0, Number(cam!.pos[1]) || 3, Number(cam!.pos[2]) || 8]
      : [0, 3, 8];
  const cameraLocked = !!sceneJson.meta?.cameraLockedByUser;
  const parallaxGroup = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = parallaxGroup.current;
    if (!g) return;
    const cx = typeof chatOffset?.x === "number" ? chatOffset.x : 0;
    const cy = typeof chatOffset?.y === "number" ? chatOffset.y : 0;
    const targetX = -cx * 0.9;
    const targetY = cy * 0.6;
    g.position.x += (targetX - g.position.x) * 0.12;
    g.position.y += (targetY - g.position.y) * 0.12;
  });

  return (
    <>
      <CameraLerper target={camPos} enabled={false} />
      <JsonLights sceneJson={sceneJson} shadowsEnabled={!!shadowsEnabled} />
      <group ref={parallaxGroup}>
        {objects.map((o, idx) => {
          const stableId = o.id ?? `${o.type ?? "obj"}:${idx}`;
          return (
            <AnimatableObject
              key={stableId}
              obj={o}
              anim={animMap.get(o.id)}
              index={idx}
              shadowsEnabled={!!shadowsEnabled}
              focusMode={focusMode}
              focusedId={focusedId ?? null}
              theme={theme ?? "night"}
              getUxForObject={getUxForObject}
              objectUxById={objectUxById}
              globalScale={globalScale}
              modeId={visualModeId}
            />
          );
        })}

        <LoopLinesAnimated
          objects={objects}
          loops={loopList}
          activeLoopId={activeLoopId}
          showLoops={showLoops}
          showLoopLabels={showLoopLabels}
          modeId={visualModeId}
          theme={theme ?? "night"}
        />
      </group>
    </>
  );
}
