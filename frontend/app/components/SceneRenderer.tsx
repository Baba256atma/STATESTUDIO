"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

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
  resolveScannerCausalityRole,
  traceScannerCausalityRole,
} from "../lib/visual/scannerCausalityPolicy";
import { resolveScannerPrimaryTarget } from "../lib/visual/scannerPrimaryTargetResolver";
import {
  resolveScannerVisualPriority,
  traceScannerVisualPriorityPolicy,
} from "../lib/visual/scannerVisualPriorityPolicy";
import { dedupeNexoraDevLog } from "../lib/debug/panelConsoleTraceDedupe";
import {
  type DomainLabelSeverity,
  resolveDomainAwareLabelTemplate,
  resolveDomainAwareObjectName,
  resolveDomainVocabulary,
} from "../lib/visual/domainVocabulary";
import type { PropagationOverlayState } from "../lib/simulation/propagationTypes";
import type {
  DecisionPathNarrativeNodeRole,
  DecisionPathNodeVisualHints,
  DecisionPathRendererEdge,
  DecisionPathRendererState,
} from "./overlays/DecisionPathOverlayLayer";
import { getThemeTokens } from "../lib/design/designTokens";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import { CALM_FRAMING } from "../lib/scene/calmCameraFraming";
import { AnimatableObject } from "./scene/AnimatableObject";
import { LoopLinesAnimated } from "./scene/LoopLinesAnimated";
const EMPTY_STRING_ARRAY: string[] = [];

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

function normalizeScannerLabelSeverity(
  scannerSeverity: string | undefined,
  scannerFragilityScore: number
): DomainLabelSeverity {
  const severity = normalizeText(scannerSeverity);
  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium" || severity === "moderate") return "medium";
  if (severity === "low") return "low";
  if (scannerFragilityScore >= 0.9) return "critical";
  if (scannerFragilityScore >= 0.72) return "high";
  if (scannerFragilityScore >= 0.42) return "medium";
  return "low";
}

function colorWithAlpha(color: string, alpha: number): string {
  const normalizedAlpha = clamp01(alpha);
  try {
    const parsed = new THREE.Color(color);
    const r = Math.round(parsed.r * 255);
    const g = Math.round(parsed.g * 255);
    const b = Math.round(parsed.b * 255);
    return `rgba(${r},${g},${b},${normalizedAlpha})`;
  } catch {
    return color;
  }
}

function getScannerLabelVisualTone(
  severity: DomainLabelSeverity,
  role: "primary" | "affected" | "context" | "neutral",
  theme: "day" | "night" | "stars",
  baseColor: string
): {
  titleColor: string;
  dotColor: string;
  dotGlow: string;
  borderColor: string;
  boxShadow: string;
  bodyColor: string;
  background: string;
} {
  const isDay = theme === "day";
  const tone =
    severity === "critical"
      ? {
          titleAlpha: 1,
          dotAlpha: 0.98,
          glowAlpha: 0.44,
          glowSize: 18,
          borderAlpha: isDay ? 0.36 : 0.34,
          shadowAlpha: isDay ? 0.2 : 0.5,
          ringAlpha: isDay ? 0.14 : 0.18,
          bodyColor: isDay ? "#1e293b" : "#f1f5f9",
          background: isDay ? "rgba(255,255,255,0.96)" : "rgba(2,6,23,0.9)",
        }
      : severity === "high"
      ? {
          titleAlpha: 0.98,
          dotAlpha: 0.92,
          glowAlpha: 0.32,
          glowSize: 16,
          borderAlpha: isDay ? 0.28 : 0.26,
          shadowAlpha: isDay ? 0.16 : 0.42,
          ringAlpha: isDay ? 0.1 : 0.14,
          bodyColor: isDay ? "#334155" : "#e2e8f0",
          background: isDay ? "rgba(255,255,255,0.94)" : "rgba(2,6,23,0.86)",
        }
      : severity === "medium"
      ? {
          titleAlpha: 0.94,
          dotAlpha: 0.88,
          glowAlpha: 0.24,
          glowSize: 14,
          borderAlpha: isDay ? 0.2 : 0.18,
          shadowAlpha: isDay ? 0.12 : 0.36,
          ringAlpha: isDay ? 0.08 : 0.12,
          bodyColor: isDay ? "#475569" : "#cbd5e1",
          background: isDay ? "rgba(255,255,255,0.9)" : "rgba(2,6,23,0.82)",
        }
      : {
          titleAlpha: 0.8,
          dotAlpha: 0.72,
          glowAlpha: 0.16,
          glowSize: 11,
          borderAlpha: isDay ? 0.14 : 0.14,
          shadowAlpha: isDay ? 0.09 : 0.28,
          ringAlpha: isDay ? 0.06 : 0.1,
          bodyColor: isDay ? "#64748b" : "#94a3b8",
          background: isDay ? "rgba(255,255,255,0.88)" : "rgba(2,6,23,0.78)",
        };

  const roleTone =
    role === "primary"
      ? {
          titleBoost: 0.08,
          dotBoost: 0.08,
          glowBoost: 0.08,
          glowSizeBoost: 2,
          borderBoost: 0.08,
          shadowBoost: 0.08,
          ringBoost: 0.05,
          background: isDay ? "rgba(255,255,255,0.97)" : "rgba(2,6,23,0.92)",
          bodyColor: isDay ? "#1e293b" : "#f8fafc",
        }
      : role === "affected"
      ? {
          titleBoost: 0,
          dotBoost: 0,
          glowBoost: 0,
          glowSizeBoost: 0,
          borderBoost: 0,
          shadowBoost: 0,
          ringBoost: 0,
          background: tone.background,
          bodyColor: tone.bodyColor,
        }
      : role === "context"
      ? {
          titleBoost: -0.14,
          dotBoost: -0.16,
          glowBoost: -0.12,
          glowSizeBoost: -2,
          borderBoost: -0.08,
          shadowBoost: -0.1,
          ringBoost: -0.04,
          background: isDay ? "rgba(255,255,255,0.87)" : "rgba(2,6,23,0.76)",
          bodyColor: isDay ? "#64748b" : "#94a3b8",
        }
      : {
          titleBoost: -0.2,
          dotBoost: -0.2,
          glowBoost: -0.14,
          glowSizeBoost: -3,
          borderBoost: -0.1,
          shadowBoost: -0.12,
          ringBoost: -0.05,
          background: isDay ? "rgba(255,255,255,0.85)" : "rgba(2,6,23,0.74)",
          bodyColor: isDay ? "#64748b" : "#94a3b8",
        };

  const titleAlpha = clamp01(tone.titleAlpha + roleTone.titleBoost);
  const dotAlpha = clamp01(tone.dotAlpha + roleTone.dotBoost);
  const glowAlpha = clamp01(tone.glowAlpha + roleTone.glowBoost);
  const glowSize = Math.max(8, tone.glowSize + roleTone.glowSizeBoost);
  const borderAlpha = clamp01(tone.borderAlpha + roleTone.borderBoost);
  const shadowAlpha = clamp01(tone.shadowAlpha + roleTone.shadowBoost);
  const ringAlpha = clamp01(tone.ringAlpha + roleTone.ringBoost);

  return {
    titleColor: colorWithAlpha(baseColor, titleAlpha),
    dotColor: colorWithAlpha(baseColor, dotAlpha),
    dotGlow: `0 0 ${glowSize}px ${colorWithAlpha(baseColor, glowAlpha)}`,
    borderColor: colorWithAlpha(baseColor, borderAlpha),
    boxShadow: isDay
      ? `0 8px 28px rgba(15,23,42,${shadowAlpha}), 0 0 0 1px ${colorWithAlpha(baseColor, ringAlpha)}`
      : `0 10px 28px rgba(2,6,23,${shadowAlpha}), 0 0 0 1px ${colorWithAlpha(baseColor, ringAlpha)}`,
    bodyColor: roleTone.bodyColor,
    background: roleTone.background,
  };
}

function getRoleDynamicLayoutProfile(role: "primary" | "affected" | "context" | "neutral") {
  if (role === "primary") {
    return { attraction: 0.16, repulsion: 0, orbitStrength: 0.02, yLift: 0.16, zBias: -0.1 };
  }
  if (role === "affected") {
    return { attraction: 0.08, repulsion: 0, orbitStrength: 0.06, yLift: 0.06, zBias: -0.03 };
  }
  if (role === "context") {
    return { attraction: 0.02, repulsion: 0.04, orbitStrength: 0.09, yLift: 0.02, zBias: 0.04 };
  }
  return { attraction: 0, repulsion: 0, orbitStrength: 0.02, yLift: 0, zBias: 0 };
}

function resolveDecisionCenter(objects: SceneObject[], primaryId: string | null): [number, number, number] {
  if (!primaryId) return [0, 0, 0];
  const primaryIndex = objects.findIndex((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    return primaryId === stableId || primaryId === stableIdWithName;
  });
  if (primaryIndex < 0) return [0, 0, 0];
  const primaryObject = objects[primaryIndex];
  const defaultPos = fallbackPos(primaryIndex, objects.length);
  return toPosTuple((primaryObject?.transform as any)?.pos ?? (primaryObject as any)?.position, defaultPos);
}

function resolveStableObjectPosition(objects: SceneObject[], objectId: string | null): [number, number, number] | null {
  if (!objectId) return null;
  const objectIndex = objects.findIndex((object, idx) => {
    const stableId = String(object?.id ?? `${object?.type ?? "obj"}:${idx}`);
    const stableIdWithName = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${idx}`);
    return objectId === stableId || objectId === stableIdWithName;
  });
  if (objectIndex < 0) return null;
  const object = objects[objectIndex];
  const defaultPos = fallbackPos(objectIndex, objects.length);
  return toPosTuple((object?.transform as any)?.pos ?? (object as any)?.position, defaultPos);
}

function resolveSceneCenter(objects: SceneObject[]): [number, number, number] {
  if (objects.length === 0) return [0, 0, 0];
  const total = objects.reduce<[number, number, number]>((acc, object, idx) => {
    const defaultPos = fallbackPos(idx, objects.length);
    const pos = toPosTuple((object?.transform as any)?.pos ?? (object as any)?.position, defaultPos);
    return [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]];
  }, [0, 0, 0]);
  return [total[0] / objects.length, total[1] / objects.length, total[2] / objects.length];
}

type ScannerStoryReveal = {
  primary: number;
  edge: number;
  affected: number;
  context: number;
};

type InteractionRole = "primary" | "affected" | "context" | "neutral";
type NarrativeNodeRole = "primary" | "affected" | "context" | "outside";
type NarrativeEdgeRole = "path" | "secondary" | "outside";
type SimulatedPathEdge = {
  from: string;
  to: string;
  depth: number;
  strength: number;
};
type AttentionMemorySource = "hover" | "selected" | "scanner_primary";
type AttentionMemoryEntry = {
  id: string;
  role: InteractionRole;
  timestamp: number;
  source: AttentionMemorySource;
};

function resolveInteractionRole(params: {
  isScannerPrimary: boolean;
  causalityRole: string;
}): InteractionRole {
  if (params.isScannerPrimary) return "primary";
  if (params.causalityRole === "affected") return "affected";
  if (params.causalityRole === "related_context") return "context";
  return "neutral";
}

function getAttentionMemoryLifetime(source: AttentionMemorySource): number {
  if (source === "selected") return 2400;
  if (source === "scanner_primary") return 2800;
  return 1400;
}

function writeAttentionMemory(
  store: Map<string, AttentionMemoryEntry>,
  entry: AttentionMemoryEntry
) {
  if (!entry.id || entry.role === "neutral") return;
  const existing = store.get(entry.id);
  const sourcePriority = entry.source === "selected" ? 3 : entry.source === "scanner_primary" ? 2 : 1;
  const existingPriority =
    existing?.source === "selected" ? 3 : existing?.source === "scanner_primary" ? 2 : existing?.source === "hover" ? 1 : 0;
  if (existing && existingPriority > sourcePriority && existing.timestamp >= entry.timestamp - 400) {
    store.set(entry.id, { ...existing, timestamp: entry.timestamp });
    return;
  }
  store.set(entry.id, entry);
}

function pruneAttentionMemory(store: Map<string, AttentionMemoryEntry>, now: number) {
  let changed = false;
  store.forEach((entry, key) => {
    if (now - entry.timestamp > getAttentionMemoryLifetime(entry.source)) {
      store.delete(key);
      changed = true;
    }
  });
  return changed;
}

function getAttentionMemoryStrength(entry: AttentionMemoryEntry | undefined, now: number): number {
  if (!entry) return 0;
  const lifetime = getAttentionMemoryLifetime(entry.source);
  const age = Math.max(0, now - entry.timestamp);
  if (age >= lifetime) return 0;
  const roleWeight =
    entry.role === "primary"
      ? 1
      : entry.role === "affected"
      ? 0.72
      : entry.role === "context"
      ? 0.5
      : 0.28;
  const sourceWeight =
    entry.source === "selected"
      ? 0.9
      : entry.source === "scanner_primary"
      ? 0.74
      : 0.56;
  const decay = 1 - age / lifetime;
  const easedDecay = decay * decay * (3 - 2 * decay);
  return clamp01(roleWeight * sourceWeight * easedDecay);
}

function getCameraMicroFocusProfile(role: InteractionRole) {
  const biasStrength =
    role === "primary"
      ? CALM_FRAMING.biasStrength.primary
      : role === "affected"
      ? CALM_FRAMING.biasStrength.affected
      : role === "context"
      ? CALM_FRAMING.biasStrength.context
      : CALM_FRAMING.biasStrength.neutral;
  return {
    biasStrength,
    distanceBias: role === "primary" ? -0.01 : role === "affected" ? -0.004 : 0,
    verticalBias: role === "primary" ? 0.02 : role === "affected" ? 0.01 : role === "context" ? 0.004 : 0,
  };
}

function resolveNarrativeFocusPath(params: {
  selectedId: string | null;
  hoveredId: string | null;
  scannerPrimaryId: string | null;
  scannerAffectedIds: string[];
  scannerContextIds: string[];
  edges: Array<{ from: string; to: string }>;
  attentionMemory: Map<string, AttentionMemoryEntry>;
  attentionMemoryStrengthById: Map<string, number>;
}): {
  primaryId: string | null;
  affectedIds: string[];
  contextIds: string[];
  pathEdges: Array<{ from: string; to: string }>;
} {
  const {
    selectedId,
    hoveredId,
    scannerPrimaryId,
    scannerAffectedIds,
    scannerContextIds,
    edges,
    attentionMemory,
    attentionMemoryStrengthById,
  } = params;

  const primaryId =
    selectedId ??
    hoveredId ??
    scannerPrimaryId ??
    Array.from(attentionMemory.entries())
      .map(([id, entry]) => ({
        id,
        score:
          (attentionMemoryStrengthById.get(id) ?? 0) *
          (entry.role === "primary" ? 1 : entry.role === "affected" ? 0.72 : entry.role === "context" ? 0.46 : 0.18),
      }))
      .sort((a, b) => b.score - a.score)[0]?.id ??
    null;

  if (!primaryId) {
    return { primaryId: null, affectedIds: [], contextIds: [], pathEdges: [] };
  }

  const neighborMap = new Map<string, Set<string>>();
  edges.forEach((edge) => {
    if (!neighborMap.has(edge.from)) neighborMap.set(edge.from, new Set<string>());
    if (!neighborMap.has(edge.to)) neighborMap.set(edge.to, new Set<string>());
    neighborMap.get(edge.from)?.add(edge.to);
    neighborMap.get(edge.to)?.add(edge.from);
  });

  const affectedIds = Array.from(
    new Set(
      (scannerAffectedIds.length > 0 ? scannerAffectedIds : Array.from(neighborMap.get(primaryId) ?? [])).filter(
        (id) => id && id !== primaryId
      )
    )
  );
  const contextIds = Array.from(
    new Set(
      (
        scannerContextIds.length > 0
          ? scannerContextIds
          : affectedIds.flatMap((affectedId) =>
              Array.from(neighborMap.get(affectedId) ?? []).filter(
                (id) => id && id !== primaryId && !affectedIds.includes(id)
              )
            )
      ).filter((id) => id && id !== primaryId && !affectedIds.includes(id))
    )
  );

  const narrativeIdSet = new Set<string>([primaryId, ...affectedIds, ...contextIds]);
  const pathEdges = edges.filter((edge) => narrativeIdSet.has(edge.from) && narrativeIdSet.has(edge.to));

  return { primaryId, affectedIds, contextIds, pathEdges };
}

function resolveNarrativeFocusStrength(params: {
  isSelected: boolean;
  isHovered: boolean;
  attentionMemoryStrength: number;
  scannerActive: boolean;
  timeSinceInteraction: number;
}): number {
  const idleFade = 1 - clamp01(params.timeSinceInteraction / 2.8);
  if (params.isSelected) return 1;
  if (params.isHovered) return 0.62 + idleFade * 0.18;
  if (params.attentionMemoryStrength > 0) {
    return clamp01(0.14 + params.attentionMemoryStrength * 0.34 + (params.scannerActive ? 0.08 : 0));
  }
  return params.scannerActive ? 0.18 : 0;
}

function getNarrativeNodeStyle(role: NarrativeNodeRole, strength: number) {
  const safeStrength = clamp01(strength);
  if (role === "primary") {
    return { scaleMul: 1 + safeStrength * 0.026, emissiveBoost: safeStrength * 0.1, opacityMul: 1, opacityBoost: safeStrength * 0.018, liftY: safeStrength * 0.022 };
  }
  if (role === "affected") {
    return { scaleMul: 1 + safeStrength * 0.015, emissiveBoost: safeStrength * 0.055, opacityMul: 0.98, opacityBoost: safeStrength * 0.01, liftY: safeStrength * 0.01 };
  }
  if (role === "context") {
    return { scaleMul: 1 + safeStrength * 0.004, emissiveBoost: safeStrength * 0.018, opacityMul: 0.82, opacityBoost: 0, liftY: safeStrength * 0.003 };
  }
  return { scaleMul: 1, emissiveBoost: 0, opacityMul: 1 - safeStrength * 0.28, opacityBoost: 0, liftY: 0 };
}

function getNarrativeEdgeStyle(role: NarrativeEdgeRole, strength: number) {
  const safeStrength = clamp01(strength);
  if (role === "path") {
    return { opacityMul: 1 + safeStrength * 0.22, colorMul: 1 + safeStrength * 0.08, pulseBoost: safeStrength * 0.025 };
  }
  if (role === "secondary") {
    return { opacityMul: 1 + safeStrength * 0.06, colorMul: 1 + safeStrength * 0.025, pulseBoost: safeStrength * 0.01 };
  }
  return { opacityMul: 1 - safeStrength * 0.28, colorMul: 1 - safeStrength * 0.08, pulseBoost: 0 };
}

function traceNarrativeFocus(payload: {
  primaryId: string | null;
  affectedCount: number;
  contextCount: number;
  strength: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  const { signature, ...rest } = payload;
  dedupeNexoraDevLog("[Nexora][NarrativeFocus]", signature, rest);
}

function buildNarrativeFocusSignature(input: {
  focusedId: string | null;
  highlightedIds: string[];
  sceneVersion?: number | null;
  strength: number;
}) {
  return JSON.stringify({
    f: input.focusedId ?? null,
    h: input.highlightedIds.slice(0, 5),
    v: input.sceneVersion ?? null,
    s: Number(input.strength.toFixed(3)),
  });
}

function getSimulationNodeStyle(strength: number, isSource: boolean) {
  const safeStrength = clamp01(strength);
  if (safeStrength <= 0) {
    return { scaleMul: 1, emissiveBoost: 0, opacityBoost: 0, motionBoost: 0 };
  }
  return {
    scaleMul: 1 + safeStrength * (isSource ? 0.038 : 0.014),
    emissiveBoost: safeStrength * (isSource ? 0.12 : 0.045),
    opacityBoost: safeStrength * (isSource ? 0.04 : 0.012),
    motionBoost: safeStrength * (isSource ? 0.035 : 0.012),
  };
}

function getSimulationEdgeStyle(depth: number, strength: number) {
  const safeStrength = clamp01(strength);
  const depthFade = depth <= 1 ? 1 : depth === 2 ? 0.76 : 0.58;
  return {
    opacityMul: 1 + safeStrength * 0.2 * depthFade,
    colorMul: 1 + safeStrength * 0.06 * depthFade,
    pulseBoost: safeStrength * 0.014 * depthFade,
  };
}

function resolveCameraIntelligenceTarget(params: {
  hoveredId: string | null;
  selectedId: string | null;
  resolvedPrimaryRenderId: string | null;
  decisionCenter: [number, number, number];
  sceneCenter: [number, number, number];
  objects: SceneObject[];
  roleById: (id: string | null) => InteractionRole;
}): {
  target: [number, number, number];
  role: InteractionRole;
  kind: "hover" | "selected" | "primary" | "decision_center" | "scene_center";
} {
  const {
    hoveredId,
    selectedId,
    resolvedPrimaryRenderId,
    decisionCenter,
    sceneCenter,
    objects,
    roleById,
  } = params;

  // Calm camera policy: hover never drives camera target.

  const selectedRole = roleById(selectedId);
  if (selectedId && selectedRole !== "neutral") {
    const selectedPosition = resolveStableObjectPosition(objects, selectedId);
    if (selectedPosition) {
      return { target: selectedPosition, role: selectedRole, kind: "selected" };
    }
  }

  if (resolvedPrimaryRenderId) {
    const primaryPosition = resolveStableObjectPosition(objects, resolvedPrimaryRenderId);
    if (primaryPosition) {
      return { target: primaryPosition, role: "primary", kind: "primary" };
    }
  }

  if (decisionCenter[0] !== 0 || decisionCenter[1] !== 0 || decisionCenter[2] !== 0) {
    return { target: decisionCenter, role: "affected", kind: "decision_center" };
  }

  return { target: sceneCenter, role: "neutral", kind: "scene_center" };
}

function smoothRamp(elapsed: number, start: number, end: number): number {
  if (elapsed <= start) return 0;
  if (elapsed >= end) return 1;
  const t = clamp01((elapsed - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
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
  if (!source || typeof source !== "object" || !Array.isArray(source[field])) return EMPTY_STRING_ARRAY;
  const values = source[field]
    .map((value: unknown) => String(value ?? "").trim())
    .filter(Boolean);
  return values.length > 0 ? values : EMPTY_STRING_ARRAY;
}


function buildProfessionalObjectLabelName(obj: SceneObject, index: number, domainId?: string | null): string {
  const domainAwareName = resolveDomainAwareObjectName({
    explicitLabel: String((obj as any)?.label ?? "").trim() || null,
    objectName: String(obj?.name ?? "").trim() || null,
    objectId: String(obj?.id ?? "").trim() || null,
    tags: Array.isArray(obj?.tags) ? obj.tags.map((tag) => String(tag ?? "")) : null,
    domainId,
  });
  if (domainAwareName) return domainAwareName;

  const rawId = String(obj?.id ?? "").trim();
  if (rawId) {
    const cleaned = rawId
      .replace(/^obj_+/, "")
      .replace(/_\d+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();
    if (cleaned) {
      return cleaned
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }

  const firstTag = Array.isArray(obj?.tags) ? String(obj.tags[0] ?? "").trim() : "";
  if (firstTag) {
    return firstTag
      .replace(/[_-]+/g, " ")
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  const fallbackType = String(obj?.type ?? `Object ${index + 1}`);
  return fallbackType.charAt(0).toUpperCase() + fallbackType.slice(1);
}

function buildIntelligentScannerLabel(params: {
  objectLabelName: string;
  scannerRoleTitle: string;
  scannerRoleBody: string | null;
  scannerCausalityRole: string;
  scannerFragilityScore: number;
  scannerSeverity?: string;
  isScannerPrimaryTarget: boolean;
  affectedCount: number;
  contextCount: number;
  activeDomainId?: string | null;
}): {
  title: string;
  body: string | null;
} {
  const objectLabelName = String(params.objectLabelName || "System Node").trim();
  const roleBody = typeof params.scannerRoleBody === "string" ? params.scannerRoleBody.trim() : null;
  const severity = normalizeText(params.scannerSeverity);
  const normalizedSeverity = normalizeScannerLabelSeverity(params.scannerSeverity, params.scannerFragilityScore);
  const isHighPressure =
    params.scannerFragilityScore >= 0.72 ||
    severity === "critical" ||
    severity === "high";
  const vocabulary = resolveDomainVocabulary(objectLabelName, params.activeDomainId);
  const templateRole = params.isScannerPrimaryTarget
    ? "primary"
    : params.scannerCausalityRole === "affected"
    ? "affected"
    : params.scannerCausalityRole === "related_context"
    ? "context"
    : "neutral";
  const labelTemplate = resolveDomainAwareLabelTemplate({
    objectLabelName,
    domainId: params.activeDomainId,
    role: templateRole,
    severity: normalizedSeverity,
  });

  if (params.isScannerPrimaryTarget) {
    return {
      title: labelTemplate?.titleTemplate ?? `${objectLabelName} — ${vocabulary?.primaryTitle ?? "Primary Risk"}`,
      body:
        labelTemplate?.bodyTemplate ??
        vocabulary?.primaryBody ??
        (isHighPressure ? "High-pressure source" : null) ??
        roleBody ??
        "Main pressure source",
    };
  }

  if (params.scannerCausalityRole === "affected") {
    return {
      title: labelTemplate?.titleTemplate ?? `${objectLabelName} — ${vocabulary?.affectedTitle ?? "Downstream Impact"}`,
      body:
        labelTemplate?.bodyTemplate ??
        vocabulary?.affectedBody ??
        roleBody ??
        (params.affectedCount > 0 ? "Impact linked to active risk" : "Affected system node"),
    };
  }

  if (params.scannerCausalityRole === "related_context") {
    return {
      title: labelTemplate?.titleTemplate ?? `${objectLabelName} — ${vocabulary?.contextTitle ?? "Related Context"}`,
      body:
        labelTemplate?.bodyTemplate ??
        vocabulary?.contextBody ??
        roleBody ??
        (params.contextCount > 0 ? "Linked to active pressure" : "Linked context signal"),
    };
  }

  return {
    title: `${objectLabelName} — Scanner Signal`,
    body: roleBody,
  };
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

  useEffect(() => {
    if (dashedMatRef.current) {
      dashedMatRef.current.scale = 1;
    }
    if (solidMatRef.current) {
      solidMatRef.current.opacity = Math.min(1, opacity + 0.25);
    }
  }, [opacity]);

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

type RelationRole =
  | "primary_to_affected"
  | "primary_to_context"
  | "affected_to_affected"
  | "affected_to_context"
  | "context_to_context"
  | "neutral";

function classifyRelationRole(params: {
  fromId: string;
  toId: string;
  primaryId: string | null;
  affectedIds: string[];
  contextIds: string[];
}): RelationRole {
  const { fromId, toId, primaryId, affectedIds, contextIds } = params;
  const isPrimary = (id: string) => !!primaryId && id === primaryId;
  const isAffected = (id: string) => affectedIds.includes(id);
  const isContext = (id: string) => contextIds.includes(id);

  if ((isPrimary(fromId) && isAffected(toId)) || (isPrimary(toId) && isAffected(fromId))) {
    return "primary_to_affected";
  }
  if ((isPrimary(fromId) && isContext(toId)) || (isPrimary(toId) && isContext(fromId))) {
    return "primary_to_context";
  }
  if (isAffected(fromId) && isAffected(toId)) {
    return "affected_to_affected";
  }
  if ((isAffected(fromId) && isContext(toId)) || (isAffected(toId) && isContext(fromId))) {
    return "affected_to_context";
  }
  if (isContext(fromId) && isContext(toId)) {
    return "context_to_context";
  }
  return "neutral";
}

function getRelationEmphasisStyle(params: {
  relationRole: RelationRole;
  severity: DomainLabelSeverity;
  theme: "day" | "night" | "stars";
  active: boolean;
}) {
  const { relationRole, severity, active } = params;
  const severityBoost =
    severity === "critical"
      ? 0.08
      : severity === "high"
      ? 0.05
      : severity === "medium"
      ? 0.02
      : 0;

  const base =
    relationRole === "primary_to_affected"
      ? { opacity: active ? 0.84 : 0.18, colorMul: 1.14, lineCopies: active ? 2 : 1 }
      : relationRole === "primary_to_context"
      ? { opacity: active ? 0.4 : 0.12, colorMul: 1.03, lineCopies: 1 }
      : relationRole === "affected_to_affected"
      ? { opacity: active ? 0.34 : 0.11, colorMul: 0.98, lineCopies: 1 }
      : relationRole === "affected_to_context"
      ? { opacity: active ? 0.22 : 0.09, colorMul: 0.92, lineCopies: 1 }
      : relationRole === "context_to_context"
      ? { opacity: active ? 0.14 : 0.06, colorMul: 0.84, lineCopies: 1 }
      : { opacity: active ? 0.12 : 0.05, colorMul: 0.8, lineCopies: 1 };

  return {
    opacity: clamp01(base.opacity + severityBoost * (relationRole === "neutral" ? 0.35 : 0.6)),
    colorMul: base.colorMul + severityBoost * (relationRole === "neutral" ? 0.2 : 0.45),
    lineCopies: base.lineCopies,
  };
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
// Camera helper
// --------------------
function CameraLerper({
  target,
  lookAtTarget = [0, 0, 0],
  enabled = true,
  motionCalm = false,
}: {
  target: [number, number, number];
  lookAtTarget?: [number, number, number];
  enabled?: boolean;
  motionCalm?: boolean;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...target));
  const lookAtRef = useRef(new THREE.Vector3(...lookAtTarget));
  const alpha = motionCalm ? CALM_FRAMING.lerperAlphaMotionCalm : CALM_FRAMING.lerperAlpha;
  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);
  useEffect(() => {
    lookAtRef.current.set(...lookAtTarget);
  }, [lookAtTarget]);
  useFrame(() => {
    if (!enabled) return;
    camera.position.lerp(targetRef.current, alpha);
    camera.lookAt(lookAtRef.current);
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
  propagationOverlay?: PropagationOverlayState | null;
  decisionPathOverlay?: DecisionPathRendererState | null;
  /** Softer hover emphasis + throttled pointer updates (Settings → Motion low). */
  motionCalm?: boolean;
};

// --------------------
// Main renderer
// --------------------
function SceneRendererComponent({
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
  propagationOverlay = null,
  decisionPathOverlay = null,
  motionCalm = false,
}: SceneRendererProps) {
  if (!sceneJson) return null;

  const chatOffset = useChatOffset();
  const selectedIdCtx = useSelectedId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const lastCommittedHoverRef = useRef<string | null>(null);
  const lastHoverTickRef = useRef(0);
  const setHoveredIdThrottled = useCallback((id: string | null) => {
    if (id === null) {
      if (lastCommittedHoverRef.current !== null) {
        lastCommittedHoverRef.current = null;
        lastHoverTickRef.current = typeof performance !== "undefined" ? performance.now() : Date.now();
        setHoveredId(null);
      }
      return;
    }
    if (id === lastCommittedHoverRef.current) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastHoverTickRef.current < 120) return;
    lastCommittedHoverRef.current = id;
    lastHoverTickRef.current = now;
    setHoveredId(id);
  }, []);

  const objects = sceneJson.scene?.objects ?? [];
  const payload = sceneJson as any;
  const hasExplicitObjectSelection = !!objectSelection && typeof objectSelection === "object";
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
      hasExplicitObjectSelection
        ? objectSelectionHighlightedIds
        : objectSelectionHighlightedIds.length > 0
        ? objectSelectionHighlightedIds
        : payloadHighlightedIds.length > 0
        ? payloadHighlightedIds
        : payloadSceneHighlightedIds.length > 0
        ? payloadSceneHighlightedIds
        : payloadContextHighlightedIds,
    [
      hasExplicitObjectSelection,
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
  const resolvedRiskSourceIds = useMemo(
    () =>
      resolveIdsAgainstScene(
        hasExplicitObjectSelection
          ? objectSelectionRiskSourceIds
          : Array.from(
              new Set([
                ...objectSelectionRiskSourceIds,
                ...payloadRiskSourceIds,
                ...payloadSceneRiskSourceIds,
              ])
            ),
        objects
      ),
    [hasExplicitObjectSelection, objectSelectionRiskSourceIds, objects, payloadRiskSourceIds, payloadSceneRiskSourceIds]
  );
  const resolvedRiskTargetIds = useMemo(
    () =>
      resolveIdsAgainstScene(
        hasExplicitObjectSelection
          ? objectSelectionRiskTargetIds
          : Array.from(
              new Set([
                ...objectSelectionRiskTargetIds,
                ...payloadRiskTargetIds,
                ...payloadSceneRiskTargetIds,
              ])
            ),
        objects
      ),
    [hasExplicitObjectSelection, objectSelectionRiskTargetIds, objects, payloadRiskTargetIds, payloadSceneRiskTargetIds]
  );
  const objectSelectionDimRequested = Boolean(objectSelection?.dim_unrelated_objects === true);
  const scannerDimRequested =
    hasExplicitObjectSelection
      ? objectSelectionDimRequested
      : objectSelectionDimRequested ||
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
  const shouldAllowFocusedIdPrimaryFallback =
    !scannerSceneActive &&
    highlightedIds.length === 0 &&
    resolvedRiskSourceIds.length === 0 &&
    resolvedRiskTargetIds.length === 0;

  const primaryResolverFocusedId = shouldAllowFocusedIdPrimaryFallback ? focusedId : null;
  const scannerFragilityScore = clamp01(
    typeof (sceneJson as any)?.scene?.scanner_state_vector?.fragility_score === "number"
      ? (sceneJson as any).scene.scanner_state_vector.fragility_score
      : typeof (sceneJson as any)?.state_vector?.fragility_score === "number"
      ? (sceneJson as any).state_vector.fragility_score
      : 0
  );
  const scannerPrimaryResolution = useMemo(
    () =>
      resolveScannerPrimaryTarget({
        highlightedIds,
        resolvedRiskSourceIds,
        resolvedRiskTargetIds,
        scannerTargetIds,
        focusedId: primaryResolverFocusedId,
        sceneObjectIds,
      }),
    [
      primaryResolverFocusedId,
      highlightedIds,
      resolvedRiskSourceIds,
      resolvedRiskTargetIds,
      scannerTargetIds,
      sceneObjectIds,
    ]
  );
  const scannerPrimaryTargetId = scannerPrimaryResolution.primaryTargetId;
  const resolvedPrimaryRenderId = useMemo(() => {
    if (!scannerPrimaryTargetId) return null;
    if (sceneObjectIdSet.has(scannerPrimaryTargetId)) return scannerPrimaryTargetId;

    const normalized = normalizeSemanticKey(scannerPrimaryTargetId);
    if (!normalized) return null;

    return sceneIdentityMap.get(normalized) ?? null;
  }, [scannerPrimaryTargetId, sceneObjectIdSet, sceneIdentityMap]);
  const resolvedLabelOwnerId = useMemo(() => {
    if (resolvedPrimaryRenderId) return resolvedPrimaryRenderId;
    if (scannerTargetIds.length > 0) return scannerTargetIds[0] ?? null;
    return null;
  }, [resolvedPrimaryRenderId, scannerTargetIds]);
  const scannerStoryKey = scannerSceneActive
    ? `${resolvedPrimaryRenderId ?? resolvedLabelOwnerId ?? "none"}:${scannerTargetIds.join("|")}`
    : "inactive";
  const [scannerStoryReveal, setScannerStoryReveal] = useState<ScannerStoryReveal>({
    primary: scannerSceneActive ? 1 : 1,
    edge: scannerSceneActive ? 1 : 1,
    affected: scannerSceneActive ? 1 : 1,
    context: scannerSceneActive ? 1 : 1,
  });
  useEffect(() => {
    if (!scannerSceneActive) {
      setScannerStoryReveal({ primary: 1, edge: 1, affected: 1, context: 1 });
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const nextReveal = {
        primary: smoothRamp(elapsed, 0.0, 0.22),
        edge: smoothRamp(elapsed, 0.12, 0.42),
        affected: smoothRamp(elapsed, 0.28, 0.62),
        context: smoothRamp(elapsed, 0.46, 0.85),
      };
      setScannerStoryReveal((prev) =>
        prev.primary === nextReveal.primary &&
        prev.edge === nextReveal.edge &&
        prev.affected === nextReveal.affected &&
        prev.context === nextReveal.context
          ? prev
          : nextReveal
      );
      if (
        nextReveal.primary < 1 ||
        nextReveal.edge < 1 ||
        nextReveal.affected < 1 ||
        nextReveal.context < 1
      ) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setScannerStoryReveal({ primary: 0, edge: 0, affected: 0, context: 0 });
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [scannerSceneActive, scannerStoryKey]);
  const decisionCenter = useMemo(
    () => resolveDecisionCenter(objects, resolvedPrimaryRenderId),
    [objects, resolvedPrimaryRenderId]
  );
  const sceneCenter = useMemo(() => resolveSceneCenter(objects), [objects]);
  const affectedTargetIds = scannerPrimaryResolution.affectedTargetIds;
  const contextTargetIds = scannerPrimaryResolution.contextTargetIds;
  const scannerPrimaryRole = scannerPrimaryResolution.primaryRole;
  const scannerPrimaryLabelTitle = scannerPrimaryResolution.primaryLabelTitle;
  const scannerPrimaryLabelBody = scannerPrimaryResolution.primaryLabelBody;
  const roleById = useMemo(
    () => (id: string | null): InteractionRole => {
      if (!id) return "neutral";
      if (id === resolvedPrimaryRenderId) return "primary";
      if (affectedTargetIds.includes(id)) return "affected";
      if (contextTargetIds.includes(id)) return "context";
      return "neutral";
    },
    [affectedTargetIds, contextTargetIds, resolvedPrimaryRenderId]
  );
  const cameraIntelligence = useMemo(
    () =>
      resolveCameraIntelligenceTarget({
        hoveredId,
        selectedId: typeof selectedIdCtx === "string" ? selectedIdCtx : null,
        resolvedPrimaryRenderId,
        decisionCenter,
        sceneCenter,
        objects,
        roleById,
      }),
    [decisionCenter, hoveredId, objects, resolvedPrimaryRenderId, roleById, sceneCenter, selectedIdCtx]
  );
  // Strict calm camera rule: renderer-level camera bias only follows explicit selection.
  const cameraBiasTarget = cameraIntelligence.kind === "selected" ? cameraIntelligence.target : null;
  const anims = ((sceneJson.scene?.animations ?? []) as any[]);
  const loopList: SceneLoop[] = Array.isArray(loops) ? loops : (sceneJson as any)?.scene?.loops ?? [];
  const activeLoopId: string | null =
    propActiveLoopId ??
    ((sceneJson as any)?.scene?.active_loop as string | undefined) ??
    ((sceneJson as any)?.scene?.activeLoopId as string | undefined) ??
    null;
  const relatedObjectIdsById = useMemo(() => {
    const relationMap = new Map<string, Set<string>>();
    loopList.forEach((loop) => {
      if (!Array.isArray(loop?.edges)) return;
      loop.edges.forEach((edge: any) => {
        const from = String(edge?.from ?? "").trim();
        const to = String(edge?.to ?? "").trim();
        if (!from || !to) return;
        if (!relationMap.has(from)) relationMap.set(from, new Set<string>());
        if (!relationMap.has(to)) relationMap.set(to, new Set<string>());
        relationMap.get(from)?.add(to);
        relationMap.get(to)?.add(from);
      });
    });
    return relationMap;
  }, [loopList]);
  const hoveredInteractionRole = resolveInteractionRole({
    isScannerPrimary: !!hoveredId && hoveredId === resolvedPrimaryRenderId,
    causalityRole:
      hoveredId && affectedTargetIds.includes(hoveredId)
        ? "affected"
        : hoveredId && contextTargetIds.includes(hoveredId)
        ? "related_context"
        : "neutral",
  });
  const selectedSemanticId = typeof selectedIdCtx === "string" ? selectedIdCtx : null;
  const attentionMemoryRef = useRef<Map<string, AttentionMemoryEntry>>(new Map());
  const [attentionMemoryNow, setAttentionMemoryNow] = useState(() => Date.now());
  useEffect(() => {
    if (!hoveredId || hoveredInteractionRole === "neutral") return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: hoveredId,
      role: hoveredInteractionRole,
      timestamp: Date.now(),
      source: "hover",
    });
    setAttentionMemoryNow(Date.now());
  }, [hoveredId, hoveredInteractionRole]);
  useEffect(() => {
    const selectedId = selectedSemanticId;
    if (!selectedId) return;
    const selectedRole = roleById(selectedId);
    if (selectedRole === "neutral") return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: selectedId,
      role: selectedRole,
      timestamp: Date.now(),
      source: "selected",
    });
    setAttentionMemoryNow(Date.now());
  }, [roleById, selectedSemanticId]);
  useEffect(() => {
    if (!scannerSceneActive || !resolvedPrimaryRenderId) return;
    writeAttentionMemory(attentionMemoryRef.current, {
      id: resolvedPrimaryRenderId,
      role: "primary",
      timestamp: Date.now(),
      source: "scanner_primary",
    });
    setAttentionMemoryNow(Date.now());
  }, [resolvedPrimaryRenderId, scannerSceneActive]);
  useEffect(() => {
    if (attentionMemoryRef.current.size === 0) return;
    let timerId = 0;
    const tick = () => {
      const now = Date.now();
      const changed = pruneAttentionMemory(attentionMemoryRef.current, now);
      if (changed || attentionMemoryRef.current.size > 0) {
        setAttentionMemoryNow(now);
      }
      if (attentionMemoryRef.current.size > 0) {
        timerId = window.setTimeout(tick, 120);
      }
    };
    timerId = window.setTimeout(tick, 120);
    return () => window.clearTimeout(timerId);
  }, [attentionMemoryNow]);
  const attentionMemoryStrengthById = useMemo(() => {
    const strengths = new Map<string, number>();
    attentionMemoryRef.current.forEach((entry, id) => {
      const strength = getAttentionMemoryStrength(entry, attentionMemoryNow);
      if (strength > 0) strengths.set(id, strength);
    });
    return strengths;
  }, [attentionMemoryNow]);
  const loopEdges = useMemo(
    () =>
      loopList.flatMap((loop) =>
        Array.isArray(loop?.edges)
          ? loop.edges
              .map((edge: any) => ({
                from: String(edge?.from ?? "").trim(),
                to: String(edge?.to ?? "").trim(),
                weight:
                  typeof edge?.weight === "number"
                    ? edge.weight
                    : typeof loop?.strength === "number"
                    ? loop.strength
                    : undefined,
              }))
              .filter((edge) => edge.from && edge.to)
          : []
      ),
    [loopList]
  );
  const strongestAttentionMemory = useMemo(
    () =>
      Array.from(attentionMemoryStrengthById.entries()).reduce(
        (best, [id, strength]) => (strength > best.strength ? { id, strength } : best),
        { id: null as string | null, strength: 0 }
      ),
    [attentionMemoryStrengthById]
  );
  const narrativeFocusPath = useMemo(
    () =>
      resolveNarrativeFocusPath({
        selectedId: selectedSemanticId,
        hoveredId,
        scannerPrimaryId: resolvedPrimaryRenderId,
        scannerAffectedIds: affectedTargetIds,
        scannerContextIds: contextTargetIds,
        edges: loopEdges,
        attentionMemory: attentionMemoryRef.current,
        attentionMemoryStrengthById,
      }),
    [
      affectedTargetIds,
      attentionMemoryStrengthById,
      contextTargetIds,
      hoveredId,
      loopEdges,
      resolvedPrimaryRenderId,
      selectedSemanticId,
    ]
  );
  const narrativeFocusStrength = useMemo(
    () =>
      resolveNarrativeFocusStrength({
        isSelected: typeof selectedSemanticId === "string" && selectedSemanticId.length > 0,
        isHovered: typeof hoveredId === "string" && hoveredId.length > 0,
        attentionMemoryStrength: strongestAttentionMemory.strength,
        scannerActive: scannerSceneActive,
        timeSinceInteraction: strongestAttentionMemory.strength > 0 ? 0 : 2.8,
      }),
    [hoveredId, scannerSceneActive, selectedSemanticId, strongestAttentionMemory.strength]
  );
  const narrativeFocusRoleById = useMemo(
    () => (id: string | null): NarrativeNodeRole => {
      if (!id) return "outside";
      if (narrativeFocusPath.primaryId && id === narrativeFocusPath.primaryId) return "primary";
      if (narrativeFocusPath.affectedIds.includes(id)) return "affected";
      if (narrativeFocusPath.contextIds.includes(id)) return "context";
      return "outside";
    },
    [narrativeFocusPath]
  );
  const narrativeCentroid = useMemo<[number, number, number]>(() => {
    const ids = [
      narrativeFocusPath.primaryId,
      ...narrativeFocusPath.affectedIds,
      ...narrativeFocusPath.contextIds,
    ].filter((id): id is string => !!id);
    if (ids.length === 0) return sceneCenter;
    const positions = ids
      .map((id) => resolveStableObjectPosition(objects, id))
      .filter((pos): pos is [number, number, number] => !!pos);
    if (positions.length === 0) return sceneCenter;
    const total = positions.reduce<[number, number, number]>(
      (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]],
      [0, 0, 0]
    );
    return [total[0] / positions.length, total[1] / positions.length, total[2] / positions.length];
  }, [narrativeFocusPath, objects, sceneCenter]);
  const normalizedPropagationOverlay = useMemo(() => {
    if (!propagationOverlay?.active) return null;
    const nodeStrengthById = (propagationOverlay.impacted_nodes ?? []).reduce<Record<string, number>>((acc, impact) => {
      const objectId = String(impact?.object_id ?? "").trim();
      if (!objectId) return acc;
      acc[objectId] = Math.max(acc[objectId] ?? 0, clamp01(Number(impact?.strength ?? 0)));
      return acc;
    }, {});
    const pathEdges = (propagationOverlay.impacted_edges ?? [])
      .map((edge) => ({
        from: String(edge?.from ?? "").trim(),
        to: String(edge?.to ?? "").trim(),
        depth: Math.max(1, Number(edge?.depth ?? 1)),
        strength: clamp01(Number(edge?.strength ?? 0)),
      }))
      .filter((edge) => edge.from && edge.to);
    return {
      sourceId: propagationOverlay.source_object_id,
      pathEdges,
      nodeStrengthById,
      mode: propagationOverlay.mode,
    };
  }, [propagationOverlay]);
  const effectivePropagationSourceId = normalizedPropagationOverlay?.sourceId ?? null;
  const effectivePropagationPathEdges = normalizedPropagationOverlay?.pathEdges ?? [];
  const effectivePropagationNodeStrengthById = normalizedPropagationOverlay?.nodeStrengthById ?? {};
  const effectivePropagationMode = normalizedPropagationOverlay?.mode ?? null;
  const lastNarrativeFocusTraceRef = useRef<string | null>(null);
  const lastPropagationOverlayTraceRef = useRef<string | null>(null);
  const effectivePropagationSourceStrength = useMemo(() => {
    if (effectivePropagationSourceId && effectivePropagationNodeStrengthById[effectivePropagationSourceId] != null) {
      return effectivePropagationNodeStrengthById[effectivePropagationSourceId];
    }
    return 0;
  }, [effectivePropagationNodeStrengthById, effectivePropagationSourceId]);
  const decisionPathNodeStrengthById = decisionPathOverlay?.nodeStrengthById ?? {};
  const decisionPathNodeRoleById = decisionPathOverlay?.nodeRoleById ?? {};
  const decisionPathNodeVisualHintsById = decisionPathOverlay?.nodeVisualHintsById ?? {};
  const decisionPathEdges = decisionPathOverlay?.edges ?? [];
  const decisionPathSourceId = decisionPathOverlay?.sourceId ?? null;
  const simulationCentroid = useMemo<[number, number, number]>(() => {
    const ids = Object.keys(effectivePropagationNodeStrengthById);
    if (ids.length === 0) return narrativeCentroid;
    const positions = ids
      .map((id) => resolveStableObjectPosition(objects, id))
      .filter((pos): pos is [number, number, number] => !!pos);
    if (positions.length === 0) return narrativeCentroid;
    const total = positions.reduce<[number, number, number]>(
      (acc, pos) => [acc[0] + pos[0], acc[1] + pos[1], acc[2] + pos[2]],
      [0, 0, 0]
    );
    return [total[0] / positions.length, total[1] / positions.length, total[2] / positions.length];
  }, [effectivePropagationNodeStrengthById, narrativeCentroid, objects]);
  useEffect(() => {
    const signature = buildNarrativeFocusSignature({
      focusedId: narrativeFocusPath.primaryId ?? null,
      highlightedIds: [...narrativeFocusPath.affectedIds, ...narrativeFocusPath.contextIds],
      sceneVersion: typeof sceneJson?.version === "number" ? sceneJson.version : null,
      strength: narrativeFocusStrength,
    });
    if (lastNarrativeFocusTraceRef.current === signature) {
      return;
    }
    lastNarrativeFocusTraceRef.current = signature;
    traceNarrativeFocus({
      primaryId: narrativeFocusPath.primaryId,
      affectedCount: narrativeFocusPath.affectedIds.length,
      contextCount: narrativeFocusPath.contextIds.length,
      strength: narrativeFocusStrength,
      signature,
    });
  }, [
    narrativeFocusPath.primaryId,
    narrativeFocusPath.affectedIds,
    narrativeFocusPath.contextIds,
    narrativeFocusStrength,
    sceneJson?.version,
  ]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !effectivePropagationSourceId) return;
    const signature = JSON.stringify({
      sourceId: effectivePropagationSourceId,
      impactedCount: Object.keys(effectivePropagationNodeStrengthById).length,
      edgeCount: effectivePropagationPathEdges.length,
      mode: effectivePropagationMode,
    });
    if (lastPropagationOverlayTraceRef.current === signature) {
      return;
    }
    lastPropagationOverlayTraceRef.current = signature;
    console.debug("[Nexora][PropagationOverlay]", {
      sourceId: effectivePropagationSourceId,
      impactedCount: Object.keys(effectivePropagationNodeStrengthById).length,
      edgeCount: effectivePropagationPathEdges.length,
      mode: effectivePropagationMode,
    });
  }, [
    effectivePropagationMode,
    effectivePropagationNodeStrengthById,
    effectivePropagationPathEdges.length,
    effectivePropagationSourceId,
  ]);
  const cameraLookAtTarget = useMemo<[number, number, number]>(() => {
    const baseTarget = !cameraBiasTarget
      ? sceneCenter
      : (() => {
          const focusProfile = getCameraMicroFocusProfile(cameraIntelligence.role);
          const storyStrength =
            cameraIntelligence.kind === "primary"
              ? scannerStoryReveal.primary
              : cameraIntelligence.kind === "hover" || cameraIntelligence.kind === "selected"
              ? Math.max(scannerStoryReveal.primary, scannerStoryReveal.affected * 0.85)
              : scannerStoryReveal.context;
          const kindBoost = 0;
          const biasStrength = clamp01(focusProfile.biasStrength * (0.88 + storyStrength * 0.12) + kindBoost);
          return [
            sceneCenter[0] + (cameraBiasTarget[0] - sceneCenter[0]) * biasStrength,
            sceneCenter[1] + (cameraBiasTarget[1] + focusProfile.verticalBias - sceneCenter[1]) * biasStrength,
            sceneCenter[2] + (cameraBiasTarget[2] + focusProfile.distanceBias - sceneCenter[2]) * biasStrength,
          ] as [number, number, number];
        })();
    if (narrativeFocusStrength <= 0 || !narrativeFocusPath.primaryId) return baseTarget;
    const narrativeTarget =
      resolveStableObjectPosition(objects, narrativeFocusPath.primaryId) ?? narrativeCentroid;
    const narrativeBias = clamp01(
      narrativeFocusStrength *
        (narrativeFocusRoleById(narrativeFocusPath.primaryId) === "primary"
          ? CALM_FRAMING.narrativeBiasPrimary
          : CALM_FRAMING.narrativeBiasOther)
    );
    const narrativeTargetLookAt: [number, number, number] = [
      baseTarget[0] + (narrativeTarget[0] - baseTarget[0]) * narrativeBias,
      baseTarget[1] + (narrativeCentroid[1] - baseTarget[1]) * narrativeBias,
      baseTarget[2] + (narrativeCentroid[2] - baseTarget[2]) * narrativeBias,
    ];
    if (!effectivePropagationSourceId) return narrativeTargetLookAt;
    const simulationTarget = resolveStableObjectPosition(objects, effectivePropagationSourceId) ?? simulationCentroid;
    const simulationBias = clamp01((effectivePropagationSourceStrength || 0) * CALM_FRAMING.simulationBiasScale);
    return [
      narrativeTargetLookAt[0] + (simulationTarget[0] - narrativeTargetLookAt[0]) * simulationBias,
      narrativeTargetLookAt[1] + (simulationCentroid[1] - narrativeTargetLookAt[1]) * simulationBias,
      narrativeTargetLookAt[2] + (simulationCentroid[2] - narrativeTargetLookAt[2]) * simulationBias,
    ];
  }, [cameraBiasTarget, cameraIntelligence.kind, cameraIntelligence.role, effectivePropagationSourceId, effectivePropagationSourceStrength, narrativeCentroid, narrativeFocusPath.primaryId, narrativeFocusRoleById, narrativeFocusStrength, objects, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.primary, sceneCenter, simulationCentroid]);
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
  const shouldUseCameraBias = !cameraLocked && !!cameraBiasTarget;
  const parallaxGroup = useRef<THREE.Group>(null);
  const lastSceneTargetResolutionSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const signature = JSON.stringify({
        payloadHighlighted: payload?.object_selection?.highlighted_objects ?? null,
        sceneHighlighted: payload?.scene_json?.object_selection?.highlighted_objects ?? null,
        contextHighlighted: payload?.context?.object_selection?.highlighted_objects ?? null,
        highlightedIds,
        scannerTargetIds,
      });
      if (lastSceneTargetResolutionSignatureRef.current === signature) {
        return;
      }
      lastSceneTargetResolutionSignatureRef.current = signature;
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
      resolvedRiskSourceIds,
      resolvedRiskTargetIds,
      primaryTargetId: scannerPrimaryTargetId,
      affectedTargetIds,
      contextTargetIds,
      primaryReason: scannerPrimaryResolution.reason,
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
    scannerPrimaryResolution.reason,
    resolvedRiskSourceIds,
    resolvedRiskTargetIds,
    scannerPrimaryTargetId,
    affectedTargetIds,
    contextTargetIds,
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

  useEffect(() => {
    const g = parallaxGroup.current;
    if (!g) return;
    const cx = typeof chatOffset?.x === "number" ? chatOffset.x : 0;
    const cy = typeof chatOffset?.y === "number" ? chatOffset.y : 0;
    // Calm scene: keep parallax static, no frame-by-frame drift.
    g.position.x = -cx * 0.9;
    g.position.y = cy * 0.6;
  }, [chatOffset?.x, chatOffset?.y]);

  return (
    <>
      <CameraLerper
        target={camPos}
        lookAtTarget={cameraLookAtTarget}
        enabled={shouldUseCameraBias}
        motionCalm={motionCalm === true}
      />
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
              resolvedPrimaryRenderId={resolvedPrimaryRenderId}
              labelOwnerId={resolvedLabelOwnerId}
              decisionCenter={decisionCenter}
              scannerPrimaryRole={scannerPrimaryRole}
              scannerPrimaryLabelTitle={scannerPrimaryLabelTitle}
              scannerPrimaryLabelBody={scannerPrimaryLabelBody}
              scannerTargetIds={scannerTargetIds}
              affectedTargetIds={affectedTargetIds}
              contextTargetIds={contextTargetIds}
              riskSourceIds={resolvedRiskSourceIds}
              riskTargetIds={resolvedRiskTargetIds}
              scannerStoryReveal={scannerStoryReveal}
              hoveredId={hoveredId}
              hoveredInteractionRole={hoveredInteractionRole}
              setHoveredId={setHoveredIdThrottled}
              motionCalm={motionCalm}
              neighborIds={Array.from(
                new Set([
                  ...Array.from(relatedObjectIdsById.get(stableId) ?? []),
                  ...Array.from(relatedObjectIdsById.get(String(o.name ?? "")) ?? []),
                ])
              )}
              attentionMemoryStrength={Math.max(
                attentionMemoryStrengthById.get(stableId) ?? 0,
                attentionMemoryStrengthById.get(String(o.id ?? "")) ?? 0,
                attentionMemoryStrengthById.get(String(o.name ?? "")) ?? 0
              )}
              narrativeFocusStrength={narrativeFocusStrength}
              narrativeFocusRole={narrativeFocusRoleById(
                String(o.id ?? o.name ?? `${o.type ?? "obj"}:${idx}`)
              )}
              simulationStrength={Math.max(
                effectivePropagationNodeStrengthById[String(o.id ?? "")] ?? 0,
                effectivePropagationNodeStrengthById[String(o.name ?? "")] ?? 0,
                effectivePropagationNodeStrengthById[String(stableId)] ?? 0
              )}
              isSimulationSource={
                !!effectivePropagationSourceId &&
                (effectivePropagationSourceId === String(o.id ?? "") ||
                  effectivePropagationSourceId === String(o.name ?? "") ||
                  effectivePropagationSourceId === String(stableId))
              }
              decisionPathStrength={Math.max(
                decisionPathNodeStrengthById[String(o.id ?? "")] ?? 0,
                decisionPathNodeStrengthById[String(o.name ?? "")] ?? 0,
                decisionPathNodeStrengthById[String(stableId)] ?? 0
              )}
              decisionPathRole={
                decisionPathNodeRoleById[String(o.id ?? "")] ??
                decisionPathNodeRoleById[String(o.name ?? "")] ??
                decisionPathNodeRoleById[String(stableId)] ??
                "outside"
              }
              decisionPathVisualHints={
                decisionPathNodeVisualHintsById[String(o.id ?? "")] ??
                decisionPathNodeVisualHintsById[String(o.name ?? "")] ??
                decisionPathNodeVisualHintsById[String(stableId)]
              }
              isDecisionPathSource={
                !!decisionPathSourceId &&
                (decisionPathSourceId === String(o.id ?? "") ||
                  decisionPathSourceId === String(o.name ?? "") ||
                  decisionPathSourceId === String(stableId))
              }
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
          scannerSceneActive={scannerSceneActive}
          primaryId={resolvedPrimaryRenderId}
          affectedIds={affectedTargetIds}
          contextIds={contextTargetIds}
          scannerFragilityScore={scannerFragilityScore}
          scannerStoryReveal={scannerStoryReveal}
          hoveredId={hoveredId}
          hoveredInteractionRole={hoveredInteractionRole}
          attentionMemoryStrengthById={attentionMemoryStrengthById}
          narrativeFocusStrength={narrativeFocusStrength}
          narrativePathEdges={narrativeFocusPath.pathEdges}
          simulationSourceId={effectivePropagationSourceId}
          simulationPathEdges={effectivePropagationPathEdges}
          decisionPathEdges={decisionPathEdges}
        />
      </group>
    </>
  );
}

export const SceneRenderer = React.memo(SceneRendererComponent);
