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
import {
  resolveScannerVisualPriority,
  traceScannerVisualPriorityPolicy,
} from "../lib/visual/scannerVisualPriorityPolicy";
import { getThemeTokens } from "../lib/design/designTokens";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";

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

function severityToScannerColor(severity: string | undefined, theme: "day" | "night" | "stars"): string {
  const normalized = normalizeText(severity);
  if (normalized === "critical") return theme === "day" ? "#dc2626" : "#fb7185";
  if (normalized === "high") return theme === "day" ? "#ea580c" : "#fb923c";
  if (normalized === "medium" || normalized === "moderate") return theme === "day" ? "#d97706" : "#fbbf24";
  if (normalized === "low") return theme === "day" ? "#0891b2" : "#22d3ee";
  return theme === "day" ? "#2563eb" : "#60a5fa";
}

function compactScannerReason(reason: unknown): string | null {
  const value = String(reason ?? "").trim();
  if (!value) return null;
  if (value.length <= 80) return value;
  return `${value.slice(0, 77).trimEnd()}...`;
}

function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeSemanticKey(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^obj_+/, "")
    .replace(/_\d+$/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildSceneIdentityMap(objects: SceneObject[]): Map<string, string> {
  const identityMap = new Map<string, string>();
  objects.forEach((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    const candidates = [object?.id, object?.name, stableId, stableIdWithName];
    candidates.forEach((candidate) => {
      if (typeof candidate !== "string" || candidate.trim().length === 0) return;
      const normalized = normalizeSemanticKey(candidate);
      if (!normalized || identityMap.has(normalized)) return;
      identityMap.set(normalized, stableId);
    });
  });
  return identityMap;
}

function resolveIdsAgainstScene(candidateIds: string[], objects: SceneObject[]): string[] {
  const exactIds = new Set(
    objects
      .map((object, idx) => String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`))
      .filter(Boolean)
  );
  const identityMap = buildSceneIdentityMap(objects);
  const resolved = new Set<string>();

  candidateIds.forEach((candidateId) => {
    if (typeof candidateId !== "string" || candidateId.length === 0) return;
    if (exactIds.has(candidateId)) {
      resolved.add(candidateId);
      return;
    }
    const normalized = normalizeSemanticKey(candidateId);
    if (!normalized) return;
    const mapped = identityMap.get(normalized);
    if (mapped) resolved.add(mapped);
  });

  return Array.from(resolved);
}

function readStringArrayField(source: any, field: string): string[] {
  if (!source || typeof source !== "object" || !Array.isArray(source[field])) return [];
  return source[field]
    .map((value: unknown) => String(value ?? "").trim())
    .filter(Boolean);
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

type SceneObjectVisualState = {
  isHighlighted: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  isProtectedFromDim: boolean;
  shouldDimAsUnrelated: boolean;
};

function buildSceneObjectVisualState(input: {
  isHighlighted: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  dimUnrelatedObjects: boolean;
  scannerSceneActive: boolean;
  isLowFragilityScan: boolean;
}): SceneObjectVisualState {
  const isProtectedFromDim =
    input.isHighlighted || input.isFocused || input.isSelected || input.isPinned;

  const shouldDimAsUnrelated =
    input.dimUnrelatedObjects &&
    input.scannerSceneActive &&
    !input.isLowFragilityScan &&
    !isProtectedFromDim;

  return {
    isHighlighted: input.isHighlighted,
    isFocused: input.isFocused,
    isSelected: input.isSelected,
    isPinned: input.isPinned,
    isProtectedFromDim,
    shouldDimAsUnrelated,
  };
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
  hasValidFocusedTarget = false,
  theme = "night",
  getUxForObject,
  objectUxById,
  globalScale = 1,
  modeId,
  scannerSceneActive = false,
  scannerFragilityScore = 0,
  scannerPrimaryTargetId = null,
  scannerTargetIds = [],
}: {
  obj: SceneObject;
  anim?: { type: "pulse" | "wobble" | "spin"; intensity: number };
  index: number;
  shadowsEnabled?: boolean;
  focusMode?: "all" | "selected" | "pinned";
  focusedId?: string | null;
  hasValidFocusedTarget?: boolean;
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
  scannerSceneActive?: boolean;
  scannerFragilityScore?: number;
  scannerPrimaryTargetId?: string | null;
  scannerTargetIds?: string[];
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
    hasValidFocusedTarget &&
    focusMode !== "all" &&
    typeof focusedId === "string" &&
    focusedId.length > 0;
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
  const selectedIdCtx = useSelectedId();
  const isSelected = selectedIdCtx === stableIdWithName || selectedIdCtx === stableId;
  const scannerTargetIdSet = useMemo(
    () => new Set((Array.isArray(scannerTargetIds) ? scannerTargetIds : []).map((id) => String(id))),
    [scannerTargetIds]
  );
  const scannerDimRequested = scannerSceneActive && scannerTargetIdSet.size > 0;
  const scannerReason = compactScannerReason(obj.scanner_reason);
  const scannerHighlighted =
    obj.scanner_highlighted === true ||
    scannerTargetIdSet.has(stableIdWithName) ||
    scannerTargetIdSet.has(stableId);
  const scannerFocused =
    obj.scanner_focus === true ||
    scannerPrimaryTargetId === stableIdWithName ||
    scannerPrimaryTargetId === stableId;
  const isLowFragilityScan = scannerSceneActive && scannerFragilityScore <= 0.1;
  const isPinned = focusMode === "pinned" && isFocused;
  const scannerPolicy = useMemo(
    () =>
      resolveScannerVisualPriority({
        scannerSceneActive,
        scannerPrimaryTargetId,
        scannerTargetIds: Array.from(scannerTargetIdSet),
        currentObjectIds: [stableIdWithName, stableId],
        isFocused,
        isSelected,
        isPinned,
        dimUnrelatedObjects: scannerDimRequested,
        scannerFragilityScore,
        scannerHighlighted,
        scannerFocused,
      }),
    [
      isFocused,
      isPinned,
      isSelected,
      scannerDimRequested,
      scannerFocused,
      scannerFragilityScore,
      scannerHighlighted,
      scannerPrimaryTargetId,
      scannerSceneActive,
      scannerTargetIdSet,
      stableId,
      stableIdWithName,
    ]
  );
  const baseVisualState = buildSceneObjectVisualState({
    isHighlighted: scannerHighlighted,
    isFocused,
    isSelected,
    isPinned,
    dimUnrelatedObjects: scannerDimRequested,
    scannerSceneActive,
    isLowFragilityScan,
  });
  const visualState = scannerSceneActive
    ? {
        ...baseVisualState,
        isHighlighted: scannerPolicy.isHighlighted,
        isProtectedFromDim: scannerPolicy.isProtectedFromDim,
        shouldDimAsUnrelated: scannerPolicy.shouldDimAsUnrelated,
      }
    : baseVisualState;
  const genericFocusDimmed = isDimmed && !visualState.isProtectedFromDim;
  const scannerBackgroundDimmed = visualState.shouldDimAsUnrelated;
  const showCalmScannerConfirmation =
    isLowFragilityScan &&
    scannerPolicy.rank === "primary" &&
    (scannerFocused || scannerPrimaryTargetId === stableIdWithName || scannerPrimaryTargetId === stableId);
  const scannerEmphasis = clamp01(
    typeof obj.scanner_emphasis === "number"
      ? obj.scanner_emphasis
      : 0
  );
  const scannerColor = severityToScannerColor(obj.scanner_severity, theme ?? "night");
  const scannerHaloVisible =
    (scannerPolicy.shouldUseScannerHalo || showCalmScannerConfirmation) &&
    obj.type !== "line_path" &&
    obj.type !== "points_cloud";
  const showScannerLabel =
    showCalmScannerConfirmation ||
    (scannerPolicy.shouldShowScannerLabel && !!scannerReason);

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
    if (obj.scanner_highlighted || scannerPolicy.colorMode === "scanner_primary" || scannerPolicy.colorMode === "scanner_secondary") {
      const scannerColor = severityToScannerColor(obj.scanner_severity, theme ?? "night");
      const blend =
        scannerPolicy.colorMode === "scanner_primary"
          ? 0.52
          : scannerPolicy.colorMode === "scanner_secondary"
          ? 0.22
          : isLowFragilityScan
          ? 0.08
          : obj.scanner_focus
          ? 0.42
          : 0.26;
      const brightMul =
        scannerPolicy.colorMode === "scanner_primary"
          ? 1.18
          : scannerPolicy.colorMode === "scanner_secondary"
          ? 1.04
          : isLowFragilityScan
          ? 1.02
          : obj.scanner_focus
          ? 1.12
          : 1.05;
      c.lerp(new THREE.Color(scannerColor), blend);
      c.multiplyScalar(brightMul);
    }
    if (!genericFocusDimmed && !scannerBackgroundDimmed) return `#${c.getHexString()}`;
    if (scannerPolicy.colorMode === "shadowed") {
      c.lerp(new THREE.Color(theme === "day" ? "#6b7280" : "#64748b"), theme === "day" ? 0.58 : 0.52);
    }
    const mul = scannerBackgroundDimmed
      ? theme === "day"
        ? 0.74
        : 0.66
      : theme === "day"
      ? 0.35
      : 0.55;
    c.multiplyScalar(mul);
    return `#${c.getHexString()}`;
  }, [color, finalColorOverride, genericFocusDimmed, isLowFragilityScan, obj.scanner_focus, obj.scanner_highlighted, obj.scanner_severity, scannerBackgroundDimmed, scannerPolicy.colorMode, theme, visualRole, tokens.design.colors.pressure, tokens.design.colors.strategic]);

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
        if (scannerBackgroundDimmed) {
          const softShadowFloor = theme === "day" ? 0.52 : 0.44;
          return Math.max(Math.min(adjusted, softShadowFloor), theme === "day" ? 0.45 : 0.35);
        }
        if (!isFocusActive || !genericFocusDimmed) return adjusted;
        return theme === "day" ? Math.min(adjusted, 0.28) : Math.min(adjusted, 0.18);
      })(),
      emissive: material.emissive,
      emissiveIntensity: material.emissiveIntensity,
    }),
    [
      appliedColor,
      genericFocusDimmed,
      isFocusActive,
      material.emissive,
      material.emissiveIntensity,
      material.opacity,
      scannerBackgroundDimmed,
      theme,
      uxOverrides.opacity,
      vStyle.opacityMul,
    ]
  );

  const baseOpacity = materialProps.opacity ?? 0.9;
  const focusedOpacity = typeof uxOverrides.opacity === "number" ? clamp(uxOverrides.opacity, 0.1, 1) : 1.0;
  const hoveredOpacity = hovered && !isFocused && !isSelected ? Math.min(1, baseOpacity + tokens.interaction.hoverOpacityBoost) : baseOpacity;
  const scannerOpacity = showCalmScannerConfirmation
    ? Math.max(baseOpacity, 0.96)
    : scannerPolicy.opacityMode === "dominant"
    ? 1
    : scannerBackgroundDimmed
    ? Math.max(baseOpacity, theme === "day" ? 0.48 : 0.4)
    : hoveredOpacity;
  const finalOpacity = scannerPolicy.rank === "primary"
    ? Math.max(scannerOpacity, 0.98)
    : scannerPolicy.rank === "secondary"
    ? Math.max(baseOpacity * scannerPolicy.opacityMultiplier, theme === "day" ? 0.68 : 0.62)
    : visualState.isHighlighted
    ? Math.max(scannerOpacity, 0.98)
    : visualState.isFocused || visualState.isSelected || visualState.isPinned
    ? Math.max(focusedOpacity, 0.92)
    : scannerBackgroundDimmed
    ? baseOpacity
    : genericFocusDimmed
    ? baseOpacity
    : scannerOpacity;
  const baseEmissiveIntensity = materialProps.emissiveIntensity ?? 0;
  const focusEmissiveBoost = isFocused
    ? Math.max(0.85, baseEmissiveIntensity + tokens.interaction.focusGlow)
    : Math.max(0, baseEmissiveIntensity + vStyle.emissiveBoost);
  const scannerGlowBoost = scannerHighlighted
    ? isLowFragilityScan
      ? showCalmScannerConfirmation
        ? 0.22 + scannerEmphasis * 0.18
        : 0
      : (scannerFocused ? 2.2 : 1.4) + scannerEmphasis * 1.8
    : scannerPolicy.rank === "primary"
    ? scannerPolicy.emissiveBoost + scannerEmphasis * 2
    : scannerPolicy.rank === "secondary"
    ? scannerPolicy.emissiveBoost + scannerEmphasis * 0.6
    : 0;
  const finalEmissiveIntensity = scannerPolicy.emissiveMode === "quiet"
    ? 0
    : visualState.isProtectedFromDim
    ? Math.max(focusEmissiveBoost, scannerGlowBoost)
    : scannerBackgroundDimmed
    ? 0
    : genericFocusDimmed
    ? 0
    : Math.max(focusEmissiveBoost, scannerGlowBoost);
  const selectedBoost = isSelected ? Math.max(tokens.interaction.selectionGlow, baseEmissiveIntensity) : baseEmissiveIntensity;
  const hoveredBoost =
    hovered && !isSelected && !isFocused
      ? Math.max(baseEmissiveIntensity + tokens.interaction.hoverIntensity, baseEmissiveIntensity)
      : baseEmissiveIntensity;
  const effectiveEmissiveIntensity = visualState.isProtectedFromDim
    ? scannerPolicy.rank === "primary"
      ? Math.max(finalEmissiveIntensity, selectedBoost, hoveredBoost)
      : Math.max(finalEmissiveIntensity, selectedBoost * 0.55, hoveredBoost * 0.55)
    : scannerBackgroundDimmed
    ? 0
    : Math.max(finalEmissiveIntensity, selectedBoost, hoveredBoost);

  useEffect(() => {
    traceScannerVisualPriorityPolicy(stableIdWithName, {
      scannerSceneActive,
      scannerPrimaryTargetId,
      scannerTargetIds: Array.from(scannerTargetIdSet),
      currentObjectIds: [stableIdWithName, stableId],
      isFocused,
      isSelected,
      isPinned,
      dimUnrelatedObjects: scannerDimRequested,
      scannerFragilityScore,
      scannerHighlighted,
      scannerFocused,
    }, scannerPolicy);
  }, [
    isFocused,
    isPinned,
    isSelected,
    scannerDimRequested,
    scannerFocused,
    scannerFragilityScore,
    scannerHighlighted,
    scannerPolicy,
    scannerPrimaryTargetId,
    scannerSceneActive,
    scannerTargetIdSet,
    stableId,
    stableIdWithName,
  ]);

  useEffect(() => {
    if (
      !visualState.isHighlighted &&
      !visualState.isFocused &&
      !visualState.isSelected &&
      !visualState.isPinned &&
      !scannerBackgroundDimmed
    ) {
      return;
    }

    traceHighlightFlow("scene_object_state", {
      objectId: stableIdWithName,
      isHighlighted: visualState.isHighlighted,
      isFocused: visualState.isFocused,
      isSelected: visualState.isSelected,
      isPinned: visualState.isPinned,
      scannerRank: scannerPolicy.rank,
      isProtectedFromDim: visualState.isProtectedFromDim,
      dimUnrelatedObjects: scannerDimRequested,
      scannerBackgroundDimmed,
      finalOpacity,
      finalEmissiveIntensity: effectiveEmissiveIntensity,
    });
  }, [
    effectiveEmissiveIntensity,
    finalOpacity,
    scannerBackgroundDimmed,
    scannerDimRequested,
    stableIdWithName,
    scannerPolicy.rank,
    visualState,
  ]);

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
  const scannerScaleMul =
    scannerBackgroundDimmed
      ? 0.92
      : showCalmScannerConfirmation
      ? 1 + 0.03 + scannerEmphasis * 0.04
      : scannerPolicy.rank === "primary"
      ? scannerPolicy.scaleMultiplier + 0.18 + scannerEmphasis * (scannerFocused ? 0.18 : 0.1)
      : scannerPolicy.rank === "secondary"
      ? scannerPolicy.scaleMultiplier + 0.04 + scannerEmphasis * 0.08
      : scannerHighlighted
      ? 1 + 0.25 + scannerEmphasis * (scannerFocused ? 0.35 : 0.22)
      : visualState.isFocused || visualState.isSelected || visualState.isPinned
      ? 1.04
      : 1;

  useEffect(() => {
    // initialize scale once
    const m = ref.current;
    if (m) {
      const v = smoothUniform.current;
      const s = v * focusScaleMul * scannerScaleMul;
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
    const scannerPulse =
      scannerHighlighted
        ? isLowFragilityScan
          ? showCalmScannerConfirmation
            ? 1 + Math.sin(t * 1.6 + ambientPhase) * (0.008 + scannerEmphasis * 0.01)
            : 1
          : 1 + Math.sin(t * (scannerFocused ? 3.2 : 2.5) + ambientPhase) * (0.035 + scannerEmphasis * 0.03)
        : 1;
    const applied =
      smoothUniform.current *
      pulseFactor *
      scannerPulse *
      focusScaleMul *
      hierarchyScaleMul *
      hoverScaleMul *
      modeEmphasisMul *
      scannerScaleMul;
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
        {scannerHaloVisible ? (
          <>
            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              scale={[
                (meshScale?.[0] ?? 1) * (scannerFocused ? 1.95 : 1.7),
                (meshScale?.[1] ?? 1) * (scannerFocused ? 1.95 : 1.7),
                (meshScale?.[2] ?? 1) * (scannerFocused ? 1.95 : 1.7),
              ]}
            >
              <torusGeometry args={[0.9, 0.08, 16, 48]} />
              <meshStandardMaterial
                color={scannerColor}
                emissive={scannerColor}
                emissiveIntensity={scannerFocused ? 1.6 : 1.05}
                transparent
                opacity={scannerFocused ? 0.55 : 0.38}
              />
            </mesh>
            <mesh
              scale={[
                (meshScale?.[0] ?? 1) * (scannerFocused ? 1.42 : 1.28),
                (meshScale?.[1] ?? 1) * (scannerFocused ? 1.42 : 1.28),
                (meshScale?.[2] ?? 1) * (scannerFocused ? 1.42 : 1.28),
              ]}
            >
              {geometryFor(shape as GeometryKind)}
              <meshBasicMaterial
                color={scannerColor}
                transparent
                opacity={scannerFocused ? 0.16 : 0.1}
                wireframe
              />
            </mesh>
          </>
        ) : null}
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
            emissive={isFocused ? "#ffffff" : isSelected ? "#ffffff" : scannerHighlighted ? scannerColor : materialProps.emissive}
            emissiveIntensity={
              isFocused
                ? Math.max(
                    0.85,
                    (materialProps.emissiveIntensity ?? 0) + (theme === "day" ? 0.35 : 0.55)
                  )
                : isSelected
                ? Math.max(0.6, materialProps.emissiveIntensity ?? 0)
                : effectiveEmissiveIntensity
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
  const labelY = ((baseScale[1] ?? 1) * finalUniform) * scannerScaleMul * 0.6 + 0.24;

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
      {showScannerLabel ? (
        <Html position={[0, labelY + 0.45, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              display: "grid",
              gap: 4,
              minWidth: 140,
              maxWidth: 220,
              padding: "8px 10px",
              borderRadius: tokens.design.radius.md,
              border: `1px solid ${theme === "day" ? "rgba(15,23,42,0.16)" : "rgba(255,255,255,0.12)"}`,
              background: theme === "day" ? "rgba(255,255,255,0.9)" : "rgba(2,6,23,0.82)",
              boxShadow: theme === "day" ? "0 8px 28px rgba(15,23,42,0.12)" : "0 10px 28px rgba(2,6,23,0.36)",
              color: tokens.design.colors.textPrimary,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.45,
                textTransform: "uppercase",
                color: scannerColor,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: scannerColor,
                  boxShadow: `0 0 14px ${scannerColor}`,
                }}
              />
              {scannerFocused ? "Primary Scanner Focus" : "Fragility Signal"}
            </div>
            {scannerReason ? (
              <div style={{ fontSize: 11, lineHeight: 1.35, color: theme === "day" ? "#334155" : "#cbd5e1" }}>
                {scannerReason}
              </div>
            ) : null}
          </div>
        </Html>
      ) : null}
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
  objectSelection?: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
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
  objectSelection,
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
  const payload = sceneJson as any;
  const objectSelectionHighlightedIds = useMemo(
    () => readStringArrayField(objectSelection, "highlighted_objects"),
    [objectSelection]
  );
  const payloadHighlightedIds = useMemo(
    () => readStringArrayField(payload?.object_selection, "highlighted_objects"),
    [payload]
  );
  const payloadSceneHighlightedIds = useMemo(
    () => readStringArrayField(payload?.scene_json?.object_selection, "highlighted_objects"),
    [payload]
  );
  const payloadContextHighlightedIds = useMemo(
    () => readStringArrayField(payload?.context?.object_selection, "highlighted_objects"),
    [payload]
  );
  const highlightedIds = useMemo(
    () =>
      objectSelectionHighlightedIds.length > 0
        ? objectSelectionHighlightedIds
        : payloadHighlightedIds.length > 0
        ? payloadHighlightedIds
        : payloadSceneHighlightedIds.length > 0
        ? payloadSceneHighlightedIds
        : payloadContextHighlightedIds,
    [
      objectSelectionHighlightedIds,
      payloadContextHighlightedIds,
      payloadHighlightedIds,
      payloadSceneHighlightedIds,
    ]
  );
  const objectSelectionRiskSourceIds = useMemo(() => readStringArrayField(objectSelection, "risk_sources"), [objectSelection]);
  const objectSelectionRiskTargetIds = useMemo(() => readStringArrayField(objectSelection, "risk_targets"), [objectSelection]);
  const payloadRiskSourceIds = useMemo(() => readStringArrayField(payload?.object_selection, "risk_sources"), [payload]);
  const payloadRiskTargetIds = useMemo(() => readStringArrayField(payload?.object_selection, "risk_targets"), [payload]);
  const payloadSceneRiskSourceIds = useMemo(
    () => readStringArrayField(payload?.scene_json?.object_selection, "risk_sources"),
    [payload]
  );
  const payloadSceneRiskTargetIds = useMemo(
    () => readStringArrayField(payload?.scene_json?.object_selection, "risk_targets"),
    [payload]
  );
  const scannerDimRequested =
    objectSelection?.dim_unrelated_objects === true ||
    payload?.object_selection?.dim_unrelated_objects === true ||
    payload?.scene_json?.object_selection?.dim_unrelated_objects === true;
  const sceneObjectIds = useMemo(
    () =>
      objects
        .map((object, idx) => String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`))
        .filter(Boolean),
    [objects]
  );
  const sceneObjectIdSet = useMemo(() => new Set(sceneObjectIds), [sceneObjectIds]);
  const sceneIdentityMap = useMemo(() => buildSceneIdentityMap(objects), [objects]);
  const focusIdentitySet = useMemo(() => {
    const identities = new Set<string>();
    objects.forEach((object, idx) => {
      const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
      const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
      const objectId = typeof object?.id === "string" && object.id.length > 0 ? object.id : null;
      const objectName = typeof object?.name === "string" && object.name.length > 0 ? object.name : null;
      identities.add(stableId);
      identities.add(stableIdWithName);
      if (objectId) identities.add(objectId);
      if (objectName) identities.add(objectName);
    });
    return identities;
  }, [objects]);
  const hasValidFocusedTarget = useMemo(
    () => typeof focusedId === "string" && focusedId.length > 0 && focusIdentitySet.has(focusedId),
    [focusIdentitySet, focusedId]
  );
  const visualCandidateIds = useMemo(() => {
    const ordered = [
      ...highlightedIds,
      ...objectSelectionRiskSourceIds,
      ...objectSelectionRiskTargetIds,
      ...payloadRiskSourceIds,
      ...payloadRiskTargetIds,
      ...payloadSceneRiskSourceIds,
      ...payloadSceneRiskTargetIds,
    ];
    if (ordered.length === 0 && typeof focusedId === "string" && focusedId.length > 0) {
      ordered.push(focusedId);
    }
    return Array.from(new Set(ordered));
  }, [
    focusedId,
    highlightedIds,
    objectSelectionRiskSourceIds,
    objectSelectionRiskTargetIds,
    payloadRiskSourceIds,
    payloadRiskTargetIds,
    payloadSceneRiskSourceIds,
    payloadSceneRiskTargetIds,
  ]);
  const scannerTargetResolution = useMemo(() => {
    const flaggedIds = objects
      .map((object, idx) =>
        object?.scanner_highlighted === true
          ? String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`)
          : null
      )
      .filter((id): id is string => !!id);
    const candidateIds = Array.from(new Set([...visualCandidateIds, ...flaggedIds]));
    const resolvedIds = resolveIdsAgainstScene(candidateIds, objects);
    const usedFallback = candidateIds.some((id) => {
      if (sceneObjectIdSet.has(id)) return false;
      const normalized = normalizeSemanticKey(id);
      return !!normalized && sceneIdentityMap.has(normalized);
    });
    return { candidateIds, resolvedIds, usedFallback };
  }, [objects, sceneIdentityMap, sceneObjectIdSet, visualCandidateIds]);
  const scannerTargetIds = scannerTargetResolution.resolvedIds;
  const scannerSceneActive = scannerTargetIds.length > 0;
  const scannerFragilityScore = clamp01(
    typeof (sceneJson as any)?.scene?.scanner_state_vector?.fragility_score === "number"
      ? (sceneJson as any).scene.scanner_state_vector.fragility_score
      : typeof (sceneJson as any)?.state_vector?.fragility_score === "number"
      ? (sceneJson as any).state_vector.fragility_score
      : 0
  );
  const scannerPrimaryTargetId = useMemo(() => {
    const focusedTarget = objects.find((object) => object?.scanner_focus === true)?.id;
    return focusedTarget ?? scannerTargetIds[0] ?? null;
  }, [objects, scannerTargetIds]);
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

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.group("[Nexora][SceneTargetResolution]");
      console.log("payload.object_selection.highlighted_objects", payload?.object_selection?.highlighted_objects);
      console.log(
        "payload.scene_json.object_selection.highlighted_objects",
        payload?.scene_json?.object_selection?.highlighted_objects
      );
      console.log(
        "payload.context.object_selection.highlighted_objects",
        payload?.context?.object_selection?.highlighted_objects
      );
      console.log("highlightedIds", highlightedIds);
      console.groupEnd();
      console.log("SCANNER TARGET IDS:", scannerTargetIds);
    }
  }, [highlightedIds, payload, scannerTargetIds]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (visualCandidateIds.length === 0) return;
    if (scannerTargetIds.length > 0 && !scannerTargetResolution.usedFallback) return;

    traceHighlightFlow("scene_canvas", {
      highlightedIds: objectSelectionHighlightedIds,
      riskSourceIds: [
        ...objectSelectionRiskSourceIds,
        ...payloadRiskSourceIds,
        ...payloadSceneRiskSourceIds,
      ],
      riskTargetIds: [
        ...objectSelectionRiskTargetIds,
        ...payloadRiskTargetIds,
        ...payloadSceneRiskTargetIds,
      ],
      focusedId: focusedId ?? null,
      visualCandidateIds,
      resolvedScannerTargetIds: scannerTargetIds,
      scannerSceneActive,
      sceneObjectIds,
      sceneIdentityKeys: Array.from(sceneIdentityMap.keys()).slice(0, 12),
      usedFallbackResolution: scannerTargetResolution.usedFallback,
    });
  }, [
    focusedId,
    objectSelectionHighlightedIds,
    objectSelectionRiskSourceIds,
    objectSelectionRiskTargetIds,
    payloadRiskSourceIds,
    payloadRiskTargetIds,
    payloadSceneRiskSourceIds,
    payloadSceneRiskTargetIds,
    scannerSceneActive,
    scannerTargetIds,
    scannerTargetResolution.usedFallback,
    sceneIdentityMap,
    sceneObjectIds,
    visualCandidateIds,
  ]);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" ||
      typeof focusedId !== "string" ||
      focusedId.length === 0 ||
      hasValidFocusedTarget
    ) {
      return;
    }

    traceHighlightFlow("scene_canvas", {
      focusMode: focusMode ?? null,
      focusedId,
      sceneObjectIds: Array.from(focusIdentitySet),
      hasValidFocusedTarget,
    });
  }, [focusIdentitySet, focusMode, focusedId, hasValidFocusedTarget]);

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
              hasValidFocusedTarget={hasValidFocusedTarget}
              theme={theme ?? "night"}
              getUxForObject={getUxForObject}
              objectUxById={objectUxById}
              globalScale={globalScale}
              modeId={visualModeId}
              scannerSceneActive={scannerSceneActive}
              scannerFragilityScore={scannerFragilityScore}
              scannerPrimaryTargetId={scannerPrimaryTargetId}
              scannerTargetIds={scannerTargetIds}
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
