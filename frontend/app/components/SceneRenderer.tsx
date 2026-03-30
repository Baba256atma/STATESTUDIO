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
  resolveScannerCausalityRole,
  traceScannerCausalityRole,
} from "../lib/visual/scannerCausalityPolicy";
import { resolveScannerPrimaryTarget } from "../lib/visual/scannerPrimaryTargetResolver";
import {
  resolveScannerVisualPriority,
  traceScannerVisualPriorityPolicy,
} from "../lib/visual/scannerVisualPriorityPolicy";
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

function getInteractionProfile(role: InteractionRole) {
  switch (role) {
    case "primary":
      return {
        hoverScale: 1.06,
        emissiveBoost: 0.35,
        opacityBoost: 0.1,
        neighborDim: 0.15,
        edgeBoost: 1.25,
      };
    case "affected":
      return {
        hoverScale: 1.04,
        emissiveBoost: 0.22,
        opacityBoost: 0.06,
        neighborDim: 0.1,
        edgeBoost: 1.15,
      };
    case "context":
      return {
        hoverScale: 1.015,
        emissiveBoost: 0.08,
        opacityBoost: 0.02,
        neighborDim: 0.05,
        edgeBoost: 1.05,
      };
    default:
      return {
        hoverScale: 1.0,
        emissiveBoost: 0,
        opacityBoost: 0,
        neighborDim: 0,
        edgeBoost: 1.0,
      };
  }
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
  switch (role) {
    case "primary":
      return {
        biasStrength: 0.18,
        distanceBias: -0.02,
        verticalBias: 0.04,
      };
    case "affected":
      return {
        biasStrength: 0.1,
        distanceBias: -0.008,
        verticalBias: 0.02,
      };
    case "context":
      return {
        biasStrength: 0.05,
        distanceBias: 0,
        verticalBias: 0.008,
      };
    default:
      return {
        biasStrength: 0.01,
        distanceBias: 0,
        verticalBias: 0,
      };
  }
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
}) {
  if (process.env.NODE_ENV === "production") return;
  console.debug("[Nexora][NarrativeFocus]", payload);
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

  const hoveredRole = roleById(hoveredId);
  if (hoveredId && hoveredRole !== "neutral") {
    const hoveredPosition = resolveStableObjectPosition(objects, hoveredId);
    if (hoveredPosition) {
      return { target: hoveredPosition, role: hoveredRole, kind: "hover" };
    }
  }

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
  if (!source || typeof source !== "object" || !Array.isArray(source[field])) return [];
  return source[field]
    .map((value: unknown) => String(value ?? "").trim())
    .filter(Boolean);
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
  scannerSceneActive = false,
  primaryId = null,
  affectedIds = [],
  contextIds = [],
  scannerFragilityScore = 0,
  scannerStoryReveal = { primary: 1, edge: 1, affected: 1, context: 1 },
  hoveredId = null,
  hoveredInteractionRole = "neutral",
  attentionMemoryStrengthById = new Map<string, number>(),
  narrativeFocusStrength = 0,
  narrativePathEdges = [],
  simulationSourceId = null,
  simulationPathEdges = [],
  decisionPathEdges = [],
}: {
  objects: any[];
  loops: SceneLoop[];
  activeLoopId: string | null;
  showLoops: boolean | undefined;
  showLoopLabels?: boolean;
  modeId?: string;
  theme?: "day" | "night" | "stars";
  scannerSceneActive?: boolean;
  primaryId?: string | null;
  affectedIds?: string[];
  contextIds?: string[];
  scannerFragilityScore?: number;
  scannerStoryReveal?: ScannerStoryReveal;
  hoveredId?: string | null;
  hoveredInteractionRole?: InteractionRole;
  attentionMemoryStrengthById?: Map<string, number>;
  narrativeFocusStrength?: number;
  narrativePathEdges?: Array<{ from: string; to: string }>;
  simulationSourceId?: string | null;
  simulationPathEdges?: SimulatedPathEdge[];
  decisionPathEdges?: DecisionPathRendererEdge[];
}) {
  type LoopEdge = {
    from: string;
    to: string;
    weight: number;
    polarity: string;
    loopId: string;
    label?: string;
    kind?: string;
  };
  const tokens = useMemo(() => getThemeTokens(theme, modeId), [theme, modeId]);
  const relationSeverity = normalizeScannerLabelSeverity(undefined, scannerFragilityScore);
  const hoveredInteractionProfile = getInteractionProfile(hoveredInteractionRole);
  const narrativePathEdgeSet = useMemo(
    () =>
      new Set(
        narrativePathEdges.flatMap((edge) => [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`])
      ),
    [narrativePathEdges]
  );
  const simulationEdgeStrengthByKey = useMemo(() => {
    const map = new Map<string, { depth: number; strength: number }>();
    simulationPathEdges.forEach((edge) => {
      const keys = [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`];
      keys.forEach((key) => {
        const existing = map.get(key);
        if (!existing || edge.strength > existing.strength) {
          map.set(key, { depth: edge.depth, strength: edge.strength });
        }
      });
    });
    return map;
  }, [simulationPathEdges]);
  const decisionPathEdgeByKey = useMemo(() => {
    const map = new Map<string, DecisionPathRendererEdge>();
    decisionPathEdges.forEach((edge) => {
      const keys = [`${edge.from}::${edge.to}`, `${edge.to}::${edge.from}`];
      keys.forEach((key) => {
        const existing = map.get(key);
        if (!existing || edge.strength > existing.strength) {
          map.set(key, edge);
        }
      });
    });
    return map;
  }, [decisionPathEdges]);
  const getEdgeMemoryStrength = (edgeList: LoopEdge[]) =>
    edgeList.reduce(
      (maxStrength, edge) =>
        Math.max(
          maxStrength,
          attentionMemoryStrengthById.get(edge.from) ?? 0,
          attentionMemoryStrengthById.get(edge.to) ?? 0
        ),
      0
    );
  const getDecisionNarrativeRole = (edgeList: LoopEdge[]): NarrativeEdgeRole =>
    edgeList.some((edge) => {
      const decisionEdge = decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`);
      return decisionEdge?.narrativeRole === "path" || narrativePathEdgeSet.has(`${edge.from}::${edge.to}`);
    })
      ? "path"
      : edgeList.some((edge) => decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`)?.narrativeRole === "secondary")
      ? "secondary"
      : edgeList.some(
          (edge) =>
            primaryId === edge.from ||
            primaryId === edge.to ||
            affectedIds.includes(edge.from) ||
            affectedIds.includes(edge.to) ||
            contextIds.includes(edge.from) ||
            contextIds.includes(edge.to)
        )
      ? "secondary"
      : "outside";
  const getCombinedSimulationEdge = (
    edgeList: LoopEdge[]
  ): { depth: number; strength: number } | null =>
    edgeList.reduce<{ depth: number; strength: number } | null>((best, edge) => {
      const current =
        simulationEdgeStrengthByKey.get(`${edge.from}::${edge.to}`) ??
        (() => {
          const decisionEdge = decisionPathEdgeByKey.get(`${edge.from}::${edge.to}`);
          return decisionEdge ? { depth: decisionEdge.depth, strength: decisionEdge.strength } : null;
        })();
      if (!current) return best;
      if (!best || current.strength > best.strength) return current;
      return best;
    }, null);
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
    const all: LoopEdge[] = [];
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
  const groupedEdges = useMemo(() => {
    const makeGroups = (edgeList: LoopEdge[]) => {
      const groups = new Map<RelationRole, LoopEdge[]>();
      edgeList.forEach((edge) => {
        const relationRole = scannerSceneActive
          ? classifyRelationRole({
              fromId: edge.from,
              toId: edge.to,
              primaryId,
              affectedIds,
              contextIds,
            })
          : "neutral";
        const existing = groups.get(relationRole) ?? [];
        existing.push(edge);
        groups.set(relationRole, existing);
      });
      return groups;
    };
    return {
      inactive: makeGroups(safeInactiveEdges),
      active: makeGroups(safeActiveEdges),
    };
  }, [affectedIds, contextIds, primaryId, safeActiveEdges, safeInactiveEdges, scannerSceneActive]);

  const buildGeometry = (edgeList: LoopEdge[]) => {
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
  const scannerInactiveGroups = useMemo(() => {
    if (!scannerSceneActive) return [] as Array<{
      role: RelationRole;
      isHovered: boolean;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
    }>;
    const groups: Array<{
      role: RelationRole;
      isHovered: boolean;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
    }> = [];
    groupedEdges.inactive.forEach((edgeList, role) => {
      const geometry = buildGeometry(edgeList);
      if (!geometry) return;
      const isHovered = !!hoveredId && edgeList.some((edge) => edge.from === hoveredId || edge.to === hoveredId);
      const leadProfile = resolveRelationVisualProfile({
        kind: edgeList[0]?.kind,
        polarity: edgeList[0]?.polarity,
        active: false,
        mode_id: modeId,
      });
      const style = getRelationEmphasisStyle({
        relationRole: role,
        severity: relationSeverity,
        theme,
        active: false,
      });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
          ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
          : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
          ? scannerStoryReveal.context
          : 1;
      const revealOpacity = 0.42 + relationReveal * 0.58;
      const memoryBoost = getEdgeMemoryStrength(edgeList);
      const narrativeRole = getDecisionNarrativeRole(edgeList);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(edgeList);
      const simulationStyle = simulationEdge
        ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength)
        : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      const color = new THREE.Color(leadProfile.color || inactiveProfile.color || tokens.design.colors.relationNeutral);
      color.multiplyScalar(
        (0.88 + (style.colorMul - 0.88) * revealOpacity) *
          interactionBoost *
          (1 + memoryBoost * 0.08) *
          narrativeStyle.colorMul *
          simulationStyle.colorMul
      );
      groups.push({
        role,
        isHovered,
        geometry,
        material: new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: Math.min(
            1,
            style.opacity *
              revealOpacity *
              interactionBoost *
              (1 + memoryBoost * 0.12) *
              narrativeStyle.opacityMul *
              simulationStyle.opacityMul
          ),
        }),
      });
    });
    return groups;
  }, [getCombinedSimulationEdge, getDecisionNarrativeRole, groupedEdges.inactive, hoveredId, hoveredInteractionProfile.edgeBoost, inactiveProfile.color, modeId, narrativeFocusStrength, relationSeverity, scannerSceneActive, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.edge, theme, tokens.design.colors.relationNeutral]);
  const scannerActiveGroups = useMemo(() => {
    if (!scannerSceneActive) return [] as Array<{
      role: RelationRole;
      isHovered: boolean;
      geos: THREE.BufferGeometry[];
      materials: THREE.LineBasicMaterial[];
    }>;
    const groups: Array<{
      role: RelationRole;
      isHovered: boolean;
      geos: THREE.BufferGeometry[];
      materials: THREE.LineBasicMaterial[];
    }> = [];
    groupedEdges.active.forEach((edgeList, role) => {
      const baseGeometry = buildGeometry(edgeList);
      if (!baseGeometry) return;
      const isHovered = !!hoveredId && edgeList.some((edge) => edge.from === hoveredId || edge.to === hoveredId);
      const leadProfile = resolveRelationVisualProfile({
        kind: edgeList[0]?.kind,
        polarity: edgeList[0]?.polarity,
        active: true,
        mode_id: modeId,
      });
      const style = getRelationEmphasisStyle({
        relationRole: role,
        severity: relationSeverity,
        theme,
        active: true,
      });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
          ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
          : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
          ? scannerStoryReveal.context
          : 1;
      const revealOpacity = role === "primary_to_affected" ? 0.52 + relationReveal * 0.48 : 0.32 + relationReveal * 0.38;
      const memoryBoost = getEdgeMemoryStrength(edgeList);
      const narrativeRole = getDecisionNarrativeRole(edgeList);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(edgeList);
      const simulationStyle = simulationEdge
        ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength)
        : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      const color = new THREE.Color(leadProfile.color || tokens.design.colors.relationNeutral);
      color.multiplyScalar(
        (0.9 + (style.colorMul - 0.9) * revealOpacity) *
          interactionBoost *
          (1 + memoryBoost * 0.1) *
          narrativeStyle.colorMul *
          simulationStyle.colorMul
      );
      const baseOpacity = Math.min(
        1,
        style.opacity *
          revealOpacity *
          interactionBoost *
          (1 + memoryBoost * 0.14) *
          narrativeStyle.opacityMul *
          simulationStyle.opacityMul
      );
      const materials = Array.from({ length: style.lineCopies }, (_, idx) =>
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: idx === 0 ? baseOpacity : Math.max(0.08, baseOpacity * 0.46),
        })
      );
      const geos = materials.map((_, idx) => {
        const offset = idx === 0 ? 0 : idx % 2 === 1 ? 0.006 * idx : -0.006 * idx;
        const geo = baseGeometry.clone();
        const posArr = geo.getAttribute("position") as THREE.BufferAttribute;
        const arr = posArr.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          arr[i + 1] += offset;
        }
        posArr.needsUpdate = true;
        return geo;
      });
      groups.push({ role, isHovered, geos, materials });
    });
    return groups;
  }, [getCombinedSimulationEdge, getDecisionNarrativeRole, groupedEdges.active, hoveredId, hoveredInteractionProfile.edgeBoost, modeId, narrativeFocusStrength, relationSeverity, scannerSceneActive, scannerStoryReveal.affected, scannerStoryReveal.context, scannerStoryReveal.edge, theme, tokens.design.colors.relationNeutral]);

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
    const pulse = 0.72 + 0.28 * Math.sin(t * tokens.motion.relationPulseHz * 0.8);
    const base = 0.26 + activeWeightMean * 0.16;
    activeMaterials.forEach((m) => {
      m.opacity = Math.min(1, base + pulse * 0.38);
    });
    scannerActiveGroups.forEach(({ role, isHovered, materials }) => {
      const style = getRelationEmphasisStyle({
        relationRole: role,
        severity: relationSeverity,
        theme,
        active: true,
      });
      const relationReveal =
        role === "primary_to_affected"
          ? scannerStoryReveal.edge
          : role === "affected_to_affected"
          ? (scannerStoryReveal.edge + scannerStoryReveal.affected) * 0.5
          : role === "primary_to_context" || role === "affected_to_context" || role === "context_to_context"
          ? scannerStoryReveal.context
          : 1;
      const revealOpacity = role === "primary_to_affected" ? 0.52 + relationReveal * 0.48 : 0.32 + relationReveal * 0.38;
      const roleEdges = groupedEdges.active.get(role) ?? [];
      const memoryBoost = materials.length > 0 ? getEdgeMemoryStrength(roleEdges) : 0;
      const narrativeRole = getDecisionNarrativeRole(roleEdges);
      const narrativeStyle = getNarrativeEdgeStyle(narrativeRole, narrativeFocusStrength);
      const simulationEdge = getCombinedSimulationEdge(roleEdges);
      const simulationStyle = simulationEdge
        ? getSimulationEdgeStyle(simulationEdge.depth, simulationEdge.strength)
        : getSimulationEdgeStyle(3, 0);
      const interactionBoost = isHovered ? hoveredInteractionProfile.edgeBoost : 1;
      const rolePulse =
        role === "primary_to_affected"
          ? 0.08
          : role === "primary_to_context"
          ? 0.04
          : role === "affected_to_affected"
          ? 0.025
          : 0.012;
      materials.forEach((m, idx) => {
        const baseOpacity =
          style.opacity *
          revealOpacity *
          interactionBoost *
          (1 + memoryBoost * 0.14) *
          narrativeStyle.opacityMul *
          simulationStyle.opacityMul;
        const layeredOpacity = idx === 0 ? baseOpacity : Math.max(0.08, baseOpacity * 0.46);
        m.opacity = Math.min(
          1,
          layeredOpacity +
            pulse * (rolePulse + narrativeStyle.pulseBoost + simulationStyle.pulseBoost) * relationReveal
        );
      });
    });
  });

  // Memoize active loop offset geometries and clean up
  const activeGeos = React.useMemo(() => {
    if (!activeGeo) return [] as THREE.BufferGeometry[];
    return activeMaterials.map((_, idx) => {
      const offset = idx === 0 ? 0 : idx === 1 ? 0.007 : -0.007;
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
  React.useEffect(() => {
    return () => {
      scannerInactiveGroups.forEach(({ geometry, material }) => {
        try {
          geometry.dispose();
        } catch {}
        try {
          material.dispose();
        } catch {}
      });
    };
  }, [scannerInactiveGroups]);
  React.useEffect(() => {
    return () => {
      scannerActiveGroups.forEach(({ geos, materials }) => {
        geos.forEach((geometry) => {
          try {
            geometry.dispose();
          } catch {}
        });
        materials.forEach((material) => {
          try {
            material.dispose();
          } catch {}
        });
      });
    };
  }, [scannerActiveGroups]);

  const hasAny = safeInactiveEdges.length > 0 || safeActiveEdges.length > 0;
  if (!showLoops || !hasAny) return null;

  return (
    <group name="loop-lines" userData={{ showLoopLabels }}>
      {scannerSceneActive
        ? scannerInactiveGroups.map(({ role, geometry, material }) => (
            <lineSegments key={`inactive-${role}`} geometry={geometry} material={material} />
          ))
        : inactiveGeo && <lineSegments geometry={inactiveGeo} material={inactiveMat} />}
      {scannerSceneActive
        ? scannerActiveGroups.flatMap(({ role, geos, materials }) =>
            geos.map((geometry, idx) => {
              const material = materials[idx];
              return material ? (
                <lineSegments key={`active-${role}-${idx}`} geometry={geometry} material={material} />
              ) : null;
            })
          )
        : activeGeos.length > 0 &&
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
  resolvedPrimaryRenderId = null,
  labelOwnerId = null,
  decisionCenter = [0, 0, 0],
  scannerPrimaryRole = "neutral",
  scannerPrimaryLabelTitle = null,
  scannerPrimaryLabelBody = null,
  scannerTargetIds = [],
  affectedTargetIds = [],
  contextTargetIds = [],
  riskSourceIds = [],
  riskTargetIds = [],
  scannerStoryReveal = { primary: 1, edge: 1, affected: 1, context: 1 },
  hoveredId = null,
  hoveredInteractionRole = "neutral",
  setHoveredId,
  neighborIds = [],
  attentionMemoryStrength = 0,
  narrativeFocusStrength = 0,
  narrativeFocusRole = "outside",
  simulationStrength = 0,
  isSimulationSource = false,
  decisionPathStrength = 0,
  decisionPathRole = "outside",
  decisionPathVisualHints,
  isDecisionPathSource = false,
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
  resolvedPrimaryRenderId?: string | null;
  labelOwnerId?: string | null;
  decisionCenter?: [number, number, number];
  scannerPrimaryRole?: "primary_cause" | "affected" | "related_context" | "neutral";
  scannerPrimaryLabelTitle?: string | null;
  scannerPrimaryLabelBody?: string | null;
  scannerTargetIds?: string[];
  affectedTargetIds?: string[];
  contextTargetIds?: string[];
  riskSourceIds?: string[];
  riskTargetIds?: string[];
  scannerStoryReveal?: ScannerStoryReveal;
  hoveredId?: string | null;
  hoveredInteractionRole?: InteractionRole;
  setHoveredId?: React.Dispatch<React.SetStateAction<string | null>>;
  neighborIds?: string[];
  attentionMemoryStrength?: number;
  narrativeFocusStrength?: number;
  narrativeFocusRole?: NarrativeNodeRole;
  simulationStrength?: number;
  isSimulationSource?: boolean;
  decisionPathStrength?: number;
  decisionPathRole?: DecisionPathNarrativeNodeRole;
  decisionPathVisualHints?: DecisionPathNodeVisualHints;
  isDecisionPathSource?: boolean;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const sv = useStateVector();
  const setSelectedId = useSetSelectedId();
  const tags = obj.tags ?? [];
  const stableId = obj.id ?? `${obj.type ?? "obj"}:${index}`;
  const objectLabelName = buildProfessionalObjectLabelName(obj, index, modeId);
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
  const ambientPhase = useMemo(() => hashIdToUnit(String(stableIdWithName)) * Math.PI * 2, [stableIdWithName]);
  const focusScaleMul = isFocused ? 1.03 : dimOthers ? 0.97 : 1.0;
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
  const isLowFragilityScan = scannerSceneActive && scannerFragilityScore <= 0.1;
  const isPinned = focusMode === "pinned" && isFocused;
  const scannerCausality = useMemo(
    () =>
      resolveScannerCausalityRole({
        scannerSceneActive,
        scannerPrimaryTargetId,
        scannerTargetIds: Array.from(scannerTargetIdSet),
        affectedTargetIds,
        contextTargetIds,
        riskSourceIds,
        riskTargetIds,
        currentObjectIds: [stableIdWithName, stableId],
      }),
    [
      riskSourceIds,
      riskTargetIds,
      affectedTargetIds,
      contextTargetIds,
      scannerPrimaryTargetId,
      scannerSceneActive,
      scannerTargetIdSet,
      stableId,
      stableIdWithName,
    ]
  );

  const isScannerTarget =
    scannerSceneActive &&
    (scannerTargetIdSet.has(stableIdWithName) || scannerTargetIdSet.has(stableId));
  const isScannerPrimaryTarget =
    scannerSceneActive &&
    !!resolvedPrimaryRenderId &&
    (resolvedPrimaryRenderId === stableIdWithName ||
      resolvedPrimaryRenderId === stableId);
  const isScannerLabelOwner =
    scannerSceneActive &&
    !!labelOwnerId &&
    (labelOwnerId === stableIdWithName || labelOwnerId === stableId);
  const scannerPolicy = useMemo(
    () =>
      resolveScannerVisualPriority({
        scannerSceneActive,
        causalRole: scannerCausality.role,
        isFocused,
        isSelected,
        isPinned,
        dimUnrelatedObjects: scannerDimRequested,
        scannerFragilityScore,
        scannerHighlighted: isScannerTarget,
        scannerFocused: isScannerPrimaryTarget,
      }),
    [
      isFocused,
      isPinned,
      isSelected,
      scannerCausality.role,
      scannerDimRequested,
      scannerFragilityScore,
      scannerSceneActive,
      isScannerPrimaryTarget,
      isScannerTarget,
    ]
  );
  const scannerHighlighted = scannerPolicy.isHighlighted || isScannerTarget;
  const scannerFocused = scannerPolicy.rank === "primary" || isScannerPrimaryTarget;
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
    isScannerPrimaryTarget;
  const scannerEmphasis = clamp01(
    typeof obj.scanner_emphasis === "number"
      ? obj.scanner_emphasis
      : 0
  );
  const scannerColor = severityToScannerColor(obj.scanner_severity, theme ?? "night");
  const scannerLabelSeverity = normalizeScannerLabelSeverity(obj.scanner_severity, scannerFragilityScore);
  const scannerHierarchyRole =
    isScannerPrimaryTarget || isScannerLabelOwner
      ? "primary"
      : scannerCausality.role === "affected"
      ? "affected"
      : scannerCausality.role === "related_context"
      ? "context"
      : "neutral";
  const scannerLabelTone = getScannerLabelVisualTone(
    scannerLabelSeverity,
    scannerHierarchyRole,
    theme ?? "night",
    scannerColor
  );
  const interactionRole = resolveInteractionRole({
    isScannerPrimary: isScannerPrimaryTarget,
    causalityRole: scannerCausality.role,
  });
  const interactionProfile = getInteractionProfile(interactionRole);
  const hoveredInteractionProfile = getInteractionProfile(hoveredInteractionRole);
  const isHovered = hoveredId === stableIdWithName || hoveredId === stableId;
  const isNeighbor =
    !!hoveredId &&
    hoveredId !== stableId &&
    hoveredId !== stableIdWithName &&
    neighborIds.includes(hoveredId);
  const shouldSoftDim = !!hoveredId && !isHovered && !isNeighbor && scannerSceneActive;
  const neighborDimFactor = shouldSoftDim ? 1 - hoveredInteractionProfile.neighborDim : 1;
  const passiveAttentionMemoryStrength = !isHovered && !isSelected ? attentionMemoryStrength : 0;
  const decisionPathNarrativeRole =
    decisionPathRole !== "outside" ? decisionPathRole : narrativeFocusRole;
  const decisionNarrativeStrength = Math.max(
    narrativeFocusStrength,
    decisionPathStrength *
      (decisionPathVisualHints?.isCriticalPath ? 1 : decisionPathVisualHints?.isLeveragePoint ? 0.94 : 0.82)
  );
  const decisionSimulationStrength = Math.max(
    simulationStrength,
    decisionPathStrength *
      (decisionPathVisualHints?.isProtected
        ? 0.36
        : decisionPathVisualHints?.isBottleneck
        ? 0.92
        : decisionPathVisualHints?.isLeveragePoint
        ? 0.88
        : 0.74)
  );
  const narrativeNodeStyle = getNarrativeNodeStyle(decisionPathNarrativeRole, decisionNarrativeStrength);
  const simulationNodeStyle = getSimulationNodeStyle(
    decisionSimulationStrength,
    isSimulationSource || isDecisionPathSource
  );
  const roleMotionProfile =
    scannerHierarchyRole === "primary"
      ? {
          pulseBoost: 1.16,
          driftMul: 0.74,
          scaleAuthority: 1.05,
          wobbleMul: 0.72,
        }
      : scannerHierarchyRole === "affected"
      ? {
          pulseBoost: 1.04,
          driftMul: 0.92,
          scaleAuthority: 1.02,
          wobbleMul: 0.94,
        }
      : scannerHierarchyRole === "context"
      ? {
          pulseBoost: 0.92,
          driftMul: 0.8,
          scaleAuthority: 0.98,
          wobbleMul: 0.78,
        }
      : {
          pulseBoost: 0.86,
          driftMul: 0.72,
          scaleAuthority: 0.96,
          wobbleMul: 0.68,
        };
  const roleLayoutProfile = getRoleDynamicLayoutProfile(scannerHierarchyRole);
  const nodeStoryReveal =
    scannerHierarchyRole === "primary"
      ? scannerStoryReveal.primary
      : scannerHierarchyRole === "affected"
      ? scannerStoryReveal.affected
      : scannerHierarchyRole === "context"
      ? scannerStoryReveal.context
      : 1;
  const nodeStoryEmphasis = scannerSceneActive ? 0.72 + nodeStoryReveal * 0.28 : 1;
  const roleSpatialOffset = useMemo<[number, number, number]>(() => {
    const baseX = Number(finalPosition?.[0] ?? 0);
    const baseY = Number(finalPosition?.[1] ?? 0);
    const baseZ = Number(finalPosition?.[2] ?? 0);
    const centerX = Number(decisionCenter?.[0] ?? 0);
    const centerZ = Number(decisionCenter?.[2] ?? 0);
    const toCenterX = centerX - baseX;
    const toCenterZ = centerZ - baseZ;
    const planarDistance = Math.hypot(toCenterX, toCenterZ);
    const dirX = planarDistance > 1e-4 ? toCenterX / planarDistance : Math.cos(ambientPhase);
    const dirZ = planarDistance > 1e-4 ? toCenterZ / planarDistance : Math.sin(ambientPhase);
    const netPull = roleLayoutProfile.attraction - roleLayoutProfile.repulsion;
    const orbitX = -dirZ * Math.cos(ambientPhase * 0.9) * roleLayoutProfile.orbitStrength;
    const orbitZ = dirX * Math.sin(ambientPhase * 0.75) * roleLayoutProfile.orbitStrength;
    return [
      toCenterX * netPull + orbitX,
      roleLayoutProfile.yLift,
      toCenterZ * netPull + roleLayoutProfile.zBias + orbitZ,
    ];
  }, [ambientPhase, decisionCenter, finalPosition, roleLayoutProfile]);
  const scannerHaloVisible =
    ((scannerPolicy.shouldUseScannerHalo && scannerHierarchyRole === "primary") || showCalmScannerConfirmation) &&
    obj.type !== "line_path" &&
    obj.type !== "points_cloud";
  const hasLabelContent =
    !!(isScannerPrimaryTarget ? scannerPrimaryLabelTitle : null) ||
    !!(isScannerPrimaryTarget ? scannerPrimaryLabelBody : null) ||
    !!scannerReason ||
    !!scannerPolicy.labelTitle ||
    isScannerLabelOwner;
  const shouldShowPrimaryLabel =
    scannerSceneActive &&
    isScannerLabelOwner &&
    hasLabelContent;
  const showScannerLabel = shouldShowPrimaryLabel;

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
    if (
      scannerPolicy.colorMode === "scanner_primary" ||
      scannerPolicy.colorMode === "scanner_affected" ||
      scannerPolicy.colorMode === "scanner_related"
    ) {
      const scannerColor = severityToScannerColor(obj.scanner_severity, theme ?? "night");
      const blend =
        scannerPolicy.colorMode === "scanner_primary"
          ? 0.52
          : scannerPolicy.colorMode === "scanner_affected"
          ? 0.28
          : scannerPolicy.colorMode === "scanner_related"
          ? 0.18
          : isLowFragilityScan
          ? 0.08
          : 0.26;
      const brightMul =
        scannerPolicy.colorMode === "scanner_primary"
          ? 1.18
          : scannerPolicy.colorMode === "scanner_affected"
          ? 1.06
          : scannerPolicy.colorMode === "scanner_related"
          ? 1.03
          : isLowFragilityScan
          ? 1.02
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
        ? 0.8
        : 0.66
      : theme === "day"
      ? 0.35
      : 0.55;
    c.multiplyScalar(mul);
    return `#${c.getHexString()}`;
  }, [color, finalColorOverride, genericFocusDimmed, isLowFragilityScan, obj.scanner_severity, scannerBackgroundDimmed, scannerPolicy.colorMode, theme, visualRole, tokens.design.colors.pressure, tokens.design.colors.strategic]);

  const handleSelect = (e: any) => {
    setHovered(false);
    setHoveredId?.(null);
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
          const softShadowFloor = theme === "day" ? 0.58 : 0.5;
          return Math.max(Math.min(adjusted, softShadowFloor), theme === "day" ? 0.5 : 0.4);
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
  const hoveredOpacity = isHovered && !isFocused && !isSelected
    ? Math.min(1, baseOpacity + tokens.interaction.hoverOpacityBoost + interactionProfile.opacityBoost)
    : baseOpacity;
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
    ? Math.max(baseOpacity * Math.min(scannerPolicy.opacityMultiplier, 0.88), theme === "day" ? 0.56 : 0.5)
    : visualState.isHighlighted
    ? Math.max(scannerOpacity, 0.72)
    : visualState.isFocused || visualState.isSelected || visualState.isPinned
    ? Math.max(focusedOpacity, 0.92)
    : scannerBackgroundDimmed
    ? baseOpacity
    : genericFocusDimmed
    ? baseOpacity
    : scannerOpacity;
  const storyAdjustedOpacity =
    scannerSceneActive && scannerHierarchyRole !== "neutral"
      ? Math.min(1, finalOpacity * (0.9 + nodeStoryReveal * 0.1))
      : finalOpacity;
  const interactionAdjustedOpacity = clamp(storyAdjustedOpacity * neighborDimFactor, 0.08, 1);
  const narrativeAdjustedOpacity = clamp(
    interactionAdjustedOpacity * narrativeNodeStyle.opacityMul + narrativeNodeStyle.opacityBoost,
    0.08,
    1
  );
  const simulationAdjustedOpacity = clamp(
    narrativeAdjustedOpacity + simulationNodeStyle.opacityBoost,
    0.08,
    1
  );
  const memoryAdjustedOpacity = clamp(
    simulationAdjustedOpacity + passiveAttentionMemoryStrength * 0.05,
    0.08,
    1
  );
  const baseEmissiveIntensity = materialProps.emissiveIntensity ?? 0;
  const focusEmissiveBoost = isFocused
    ? Math.max(0.85, baseEmissiveIntensity + tokens.interaction.focusGlow)
    : Math.max(0, baseEmissiveIntensity + vStyle.emissiveBoost);
  const scannerGlowBoost = scannerPolicy.rank === "primary"
    ? scannerPolicy.emissiveBoost + scannerEmphasis * 2
    : scannerPolicy.rank === "secondary"
    ? scannerPolicy.emissiveBoost + scannerEmphasis * 0.8
    : scannerHighlighted
    ? Math.max(0.12, scannerEmphasis * 0.18)
    : 0;
  const scannerRoleTitle =
    (isScannerPrimaryTarget ? scannerPrimaryLabelTitle : null) ??
    scannerPolicy.labelTitle ??
    (isScannerLabelOwner
      ? "Primary Risk Node"
      : scannerCausality.role === "affected"
      ? "Affected Node"
      : scannerCausality.role === "related_context"
      ? "Related Context"
      : scannerFocused
      ? "Scanner Focus"
      : "Fragility Signal");
  const scannerRoleBody =
    (isScannerPrimaryTarget ? scannerPrimaryLabelBody : null) ??
    (scannerCausality.role === "affected"
      ? "Downstream impact"
      : scannerCausality.role === "related_context"
      ? "Related context"
      : null) ??
    scannerReason ??
    (isScannerLabelOwner ? "Primary decision focus" : null);
  const intelligentScannerLabel = buildIntelligentScannerLabel({
    objectLabelName,
    scannerRoleTitle,
    scannerRoleBody,
    scannerCausalityRole: scannerCausality.role,
    scannerFragilityScore,
    scannerSeverity: obj.scanner_severity,
    isScannerPrimaryTarget: isScannerLabelOwner,
    affectedCount: affectedTargetIds.length,
    contextCount: contextTargetIds.length,
    activeDomainId: modeId,
  });
  const scannerLabelTitle = intelligentScannerLabel.title;
  const effectiveScannerReason = intelligentScannerLabel.body;
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
  const storyAdjustedEmissiveIntensity =
    scannerSceneActive && scannerHierarchyRole !== "neutral"
      ? effectiveEmissiveIntensity * (0.74 + nodeStoryReveal * 0.26)
      : effectiveEmissiveIntensity;
  const interactionAdjustedEmissiveIntensity = Math.max(
    0,
    (isHovered ? storyAdjustedEmissiveIntensity + interactionProfile.emissiveBoost : storyAdjustedEmissiveIntensity) *
      neighborDimFactor
  );
  const narrativeAdjustedEmissiveIntensity =
    interactionAdjustedEmissiveIntensity + narrativeNodeStyle.emissiveBoost;
  const simulationAdjustedEmissiveIntensity =
    narrativeAdjustedEmissiveIntensity + simulationNodeStyle.emissiveBoost;
  const memoryAdjustedEmissiveIntensity = simulationAdjustedEmissiveIntensity + passiveAttentionMemoryStrength * 0.12;

  useEffect(() => {
    traceScannerCausalityRole(stableIdWithName, {
      scannerSceneActive,
      scannerPrimaryTargetId,
      scannerTargetIds: Array.from(scannerTargetIdSet),
      affectedTargetIds,
      contextTargetIds,
      riskSourceIds,
      riskTargetIds,
      currentObjectIds: [stableIdWithName, stableId],
    }, scannerCausality);
  }, [
    riskSourceIds,
    riskTargetIds,
    affectedTargetIds,
    contextTargetIds,
    scannerCausality,
    scannerPrimaryTargetId,
    scannerSceneActive,
    scannerTargetIdSet,
    stableId,
    stableIdWithName,
  ]);

  useEffect(() => {
    traceScannerVisualPriorityPolicy(stableIdWithName, {
      scannerSceneActive,
      causalRole: scannerCausality.role,
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
    scannerCausality.role,
    scannerDimRequested,
    scannerFocused,
    scannerFragilityScore,
    scannerPolicy,
    scannerSceneActive,
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
      causalRole: scannerCausality.role,
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
    scannerCausality.role,
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
  const ambientAmp = useMemo(() => {
    if (obj.type === "line_path" || obj.type === "points_cloud") return 0.05;
    return 0.08 * vStyle.ambientMul * roleMotionProfile.driftMul;
  }, [obj.type, roleMotionProfile.driftMul, vStyle.ambientMul]);
  const scannerScaleMul =
    scannerBackgroundDimmed
      ? 0.92
      : showCalmScannerConfirmation
      ? 1 + 0.03 + scannerEmphasis * 0.04 * roleMotionProfile.scaleAuthority
      : scannerPolicy.rank === "primary"
      ? scannerPolicy.scaleMultiplier + 0.18 + scannerEmphasis * 0.18 * roleMotionProfile.scaleAuthority
      : scannerPolicy.rank === "secondary"
      ? scannerPolicy.scaleMultiplier + 0.02 + scannerEmphasis * 0.04 * roleMotionProfile.scaleAuthority
      : visualState.isFocused || visualState.isSelected || visualState.isPinned
      ? 1.04
      : 1;
  const storyScaleMul = scannerSceneActive ? 0.94 + nodeStoryReveal * 0.06 : 1;
  const interactionScaleMul = isHovered ? interactionProfile.hoverScale : 1;
  const narrativeScaleMul = narrativeNodeStyle.scaleMul;
  const simulationScaleMul = simulationNodeStyle.scaleMul;
  const memoryScaleMul = 1 + passiveAttentionMemoryStrength * (interactionRole === "primary" ? 0.02 : interactionRole === "affected" ? 0.014 : 0.008);
  const selectionRoleMul =
    isSelected && interactionRole === "primary"
      ? 1.03
      : isSelected && interactionRole === "affected"
      ? 1.02
      : isSelected && interactionRole === "context"
      ? 1.008
      : 1;
  const selectionLiftY =
    isSelected && interactionRole === "affected"
      ? 0.04
      : isSelected && interactionRole === "primary"
      ? 0.02
      : isSelected && interactionRole === "context"
      ? 0.01
      : 0;
  const narrativeLiftY = narrativeNodeStyle.liftY;
  const simulationLiftY =
    decisionSimulationStrength > 0
      ? decisionSimulationStrength * (isSimulationSource || isDecisionPathSource ? 0.032 : 0.014)
      : 0;

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
      pulseFactor = 1 + Math.sin(t * 2) * 0.08 * k * roleMotionProfile.pulseBoost * nodeStoryEmphasis;
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
      m.rotation.x += Math.sin(t * 2) * 0.25 * k * roleMotionProfile.wobbleMul * nodeStoryEmphasis;
      m.rotation.z += Math.cos(t * 2) * 0.25 * k * roleMotionProfile.wobbleMul * nodeStoryEmphasis;
    }

    // Subtle ambient drift keeps scene objects "alive" without pointer/click side-effects.
    const baseX = Number(finalPosition?.[0] ?? 0);
    const baseY = Number(finalPosition?.[1] ?? 0);
    const baseZ = Number(finalPosition?.[2] ?? 0);
    const spatialBaseX = baseX + roleSpatialOffset[0];
    const spatialBaseY = baseY + roleSpatialOffset[1] + selectionLiftY + narrativeLiftY + simulationLiftY;
    const spatialBaseZ = baseZ + roleSpatialOffset[2];
    const driftSpeed = tokens.motion.sceneIdleSway;
    const driftX = Math.cos(t * 0.31 * driftSpeed + ambientPhase) * ambientAmp * 0.55;
    const driftY = Math.sin(t * 0.45 * driftSpeed + ambientPhase) * ambientAmp;
    const driftZ = Math.sin(t * 0.27 * driftSpeed + ambientPhase * 0.7) * ambientAmp * 0.5;
    const targetX = spatialBaseX + driftX;
    const targetY = spatialBaseY + driftY;
    const targetZ = spatialBaseZ + driftZ;
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
            ? 1 + Math.sin(t * 1.6 + ambientPhase) * (0.008 + scannerEmphasis * 0.01) * roleMotionProfile.pulseBoost * nodeStoryEmphasis
            : 1
          : scannerFocused
          ? 1 + Math.sin(t * 2.8 + ambientPhase) * (0.014 + scannerEmphasis * 0.01) * roleMotionProfile.pulseBoost * nodeStoryEmphasis
          : 1
        : 1;
    const simulationPulse =
      decisionSimulationStrength > 0
        ? 1 +
          Math.sin(t * (isSimulationSource || isDecisionPathSource ? 1.9 : 1.5) + ambientPhase * 0.7) *
            simulationNodeStyle.motionBoost *
            0.035
        : 1;
    const applied =
      smoothUniform.current *
      pulseFactor *
      scannerPulse *
      simulationPulse *
      focusScaleMul *
      hierarchyScaleMul *
      hoverScaleMul *
      modeEmphasisMul *
      scannerScaleMul *
      storyScaleMul *
      interactionScaleMul *
      narrativeScaleMul *
      simulationScaleMul *
      memoryScaleMul *
      selectionRoleMul;
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
        setHoveredId?.(stableIdWithName);
      },
      onPointerOut: () => {
        setHovered(false);
        setHoveredId?.(null);
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
                (meshScale?.[0] ?? 1) * (scannerFocused ? 1.72 : 1.58),
                (meshScale?.[1] ?? 1) * (scannerFocused ? 1.72 : 1.58),
                (meshScale?.[2] ?? 1) * (scannerFocused ? 1.72 : 1.58),
              ]}
            >
              <torusGeometry args={[0.88, 0.05, 14, 40]} />
              <meshStandardMaterial
                color={scannerColor}
                emissive={scannerColor}
                emissiveIntensity={scannerFocused ? 1.05 : 0.72}
                transparent
                opacity={scannerFocused ? 0.34 : 0.22}
              />
            </mesh>
          </>
        ) : null}
        {isFocused ? (
          <mesh
            {...(meshProps as any)}
            scale={[
              (meshScale?.[0] ?? 1) * 1.03,
              (meshScale?.[1] ?? 1) * 1.03,
              (meshScale?.[2] ?? 1) * 1.03,
            ]}
          >
            {geometryNode}
            <meshBasicMaterial
              color={theme === "day" ? "#111827" : "#ffffff"}
              transparent
              opacity={theme === "day" ? 0.1 : 0.06}
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
                : memoryAdjustedEmissiveIntensity
            }
            transparent
            opacity={memoryAdjustedOpacity}
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
  const scannerLabelYOffset = isScannerLabelOwner ? 0.56 : 0.45;

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
        <Html position={[0, labelY + scannerLabelYOffset, 0]} center style={{ pointerEvents: "none" }}>
          <div
            style={{
              display: "grid",
              gap: 5,
              minWidth: 140,
              maxWidth: 200,
              padding: "9px 11px",
              borderRadius: tokens.design.radius.md,
              border: `1px solid ${scannerLabelTone.borderColor}`,
              background: scannerLabelTone.background,
              boxShadow: scannerLabelTone.boxShadow,
              color: tokens.design.colors.textPrimary,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.1,
                textTransform: "none",
                color: scannerLabelTone.titleColor,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: scannerLabelTone.dotColor,
                  boxShadow: scannerLabelTone.dotGlow,
                }}
              />
              {scannerLabelTitle}
            </div>
            {effectiveScannerReason ? (
              <div
                style={{
                  fontSize: 10.5,
                  lineHeight: 1.35,
                  color: scannerLabelTone.bodyColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {effectiveScannerReason}
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
function CameraLerper({
  target,
  lookAtTarget = [0, 0, 0],
  enabled = true,
}: {
  target: [number, number, number];
  lookAtTarget?: [number, number, number];
  enabled?: boolean;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...target));
  const lookAtRef = useRef(new THREE.Vector3(...lookAtTarget));
  useEffect(() => {
    targetRef.current.set(...target);
  }, [target]);
  useEffect(() => {
    lookAtRef.current.set(...lookAtTarget);
  }, [lookAtTarget]);
  useFrame(() => {
    if (!enabled) return;
    camera.position.lerp(targetRef.current, 0.08);
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
  propagationOverlay = null,
  decisionPathOverlay = null,
}: SceneRendererProps) {
  if (!sceneJson) return null;

  const chatOffset = useChatOffset();
  const selectedIdCtx = useSelectedId();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
  const cameraBiasTarget = scannerSceneActive || cameraIntelligence.kind !== "scene_center"
    ? cameraIntelligence.target
    : null;
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
    traceNarrativeFocus({
      primaryId: narrativeFocusPath.primaryId,
      affectedCount: narrativeFocusPath.affectedIds.length,
      contextCount: narrativeFocusPath.contextIds.length,
      strength: narrativeFocusStrength,
    });
  }, [narrativeFocusPath, narrativeFocusStrength]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !effectivePropagationSourceId) return;
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
          const kindBoost =
            cameraIntelligence.kind === "hover"
              ? 0.03
              : cameraIntelligence.kind === "selected"
              ? 0.05
              : cameraIntelligence.kind === "primary"
              ? 0.02
              : 0;
          const biasStrength = clamp01(focusProfile.biasStrength * (0.8 + storyStrength * 0.2) + kindBoost);
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
        (narrativeFocusRoleById(narrativeFocusPath.primaryId) === "primary" ? 0.16 : 0.1)
    );
    const narrativeTargetLookAt: [number, number, number] = [
      baseTarget[0] + (narrativeTarget[0] - baseTarget[0]) * narrativeBias,
      baseTarget[1] + (narrativeCentroid[1] - baseTarget[1]) * narrativeBias,
      baseTarget[2] + (narrativeCentroid[2] - baseTarget[2]) * narrativeBias,
    ];
    if (!effectivePropagationSourceId) return narrativeTargetLookAt;
    const simulationTarget = resolveStableObjectPosition(objects, effectivePropagationSourceId) ?? simulationCentroid;
    const simulationBias = clamp01((effectivePropagationSourceStrength || 0) * 0.08);
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
      <CameraLerper target={camPos} lookAtTarget={cameraLookAtTarget} enabled={shouldUseCameraBias} />
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
              setHoveredId={setHoveredId}
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
