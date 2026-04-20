"use client";

import React from "react";
import * as THREE from "three";

import type { SceneObject } from "../../lib/sceneTypes";
import { riskToColor, clamp01 } from "../../lib/colorUtils";
import {
  resolveDomainAwareLabelTemplate,
  resolveDomainAwareObjectName,
  resolveDomainVocabulary,
  type DomainLabelSeverity,
} from "../../lib/visual/domainVocabulary";

export type GeometryKind =
  | SceneObject["type"]
  | "ring";

export type ScannerStoryReveal = {
  primary: number;
  edge: number;
  affected: number;
  context: number;
};

export type InteractionRole = "primary" | "affected" | "context" | "neutral";
export type NarrativeNodeRole = "primary" | "affected" | "context" | "outside";
export type NarrativeEdgeRole = "path" | "secondary" | "outside";
export type SimulatedPathEdge = {
  from: string;
  to: string;
  depth: number;
  strength: number;
};

export type RelationRole =
  | "primary_to_affected"
  | "primary_to_context"
  | "affected_to_affected"
  | "affected_to_context"
  | "context_to_context"
  | "neutral";

export type SceneObjectVisualState = {
  isHighlighted: boolean;
  isFocused: boolean;
  isSelected: boolean;
  isPinned: boolean;
  isProtectedFromDim: boolean;
  shouldDimAsUnrelated: boolean;
};

export function geometryFor(type: GeometryKind) {
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

export function computeAutoColor(tags: string[], sv: Record<string, number> | null) {
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

export function computeAutoIntensity(tags: string[], base: number, sv: Record<string, number> | null) {
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

export function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function severityToScannerColor(severity: string | undefined, theme: "day" | "night" | "stars"): string {
  const normalized = normalizeText(severity);
  if (normalized === "critical") return theme === "day" ? "#dc2626" : "#fb7185";
  if (normalized === "high") return theme === "day" ? "#ea580c" : "#fb923c";
  if (normalized === "medium" || normalized === "moderate") return theme === "day" ? "#d97706" : "#fbbf24";
  if (normalized === "low") return theme === "day" ? "#0891b2" : "#22d3ee";
  return theme === "day" ? "#2563eb" : "#60a5fa";
}

export function compactScannerReason(reason: unknown): string | null {
  const value = String(reason ?? "").trim();
  if (!value) return null;
  if (value.length <= 80) return value;
  return `${value.slice(0, 77).trimEnd()}...`;
}

export function normalizeScannerLabelSeverity(
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

export function colorWithAlpha(color: string, alpha: number): string {
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

export function getScannerLabelVisualTone(
  severity: DomainLabelSeverity,
  role: "primary" | "affected" | "context" | "neutral",
  theme: "day" | "night" | "stars",
  baseColor: string
) {
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

export function getRoleDynamicLayoutProfile(role: "primary" | "affected" | "context" | "neutral") {
  if (role === "primary") return { attraction: 0.16, repulsion: 0, orbitStrength: 0.02, yLift: 0.16, zBias: -0.1 };
  if (role === "affected") return { attraction: 0.08, repulsion: 0, orbitStrength: 0.06, yLift: 0.06, zBias: -0.03 };
  if (role === "context") return { attraction: 0.02, repulsion: 0.04, orbitStrength: 0.09, yLift: 0.02, zBias: 0.04 };
  return { attraction: 0, repulsion: 0, orbitStrength: 0.02, yLift: 0, zBias: 0 };
}

export function resolveInteractionRole(params: {
  isScannerPrimary: boolean;
  causalityRole: string;
}): InteractionRole {
  if (params.isScannerPrimary) return "primary";
  if (params.causalityRole === "affected") return "affected";
  if (params.causalityRole === "related_context") return "context";
  return "neutral";
}

export function getInteractionProfile(role: InteractionRole) {
  switch (role) {
    case "primary":
      return { hoverScale: 1.035, emissiveBoost: 0.28, opacityBoost: 0.08, neighborDim: 0.12, edgeBoost: 1.16 };
    case "affected":
      return { hoverScale: 1.022, emissiveBoost: 0.17, opacityBoost: 0.05, neighborDim: 0.08, edgeBoost: 1.1 };
    case "context":
      return { hoverScale: 1.01, emissiveBoost: 0.06, opacityBoost: 0.015, neighborDim: 0.04, edgeBoost: 1.04 };
    default:
      return { hoverScale: 1.0, emissiveBoost: 0, opacityBoost: 0, neighborDim: 0, edgeBoost: 1.0 };
  }
}

export function buildProfessionalObjectLabelName(obj: SceneObject, index: number, domainId?: string | null): string {
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
    const cleaned = rawId.replace(/^obj_+/, "").replace(/_\d+$/, "").replace(/[_-]+/g, " ").trim();
    if (cleaned) {
      return cleaned.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
    }
  }

  const firstTag = Array.isArray(obj?.tags) ? String(obj.tags[0] ?? "").trim() : "";
  if (firstTag) {
    return firstTag.replace(/[_-]+/g, " ").split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  }

  const fallbackType = String(obj?.type ?? `Object ${index + 1}`);
  return fallbackType.charAt(0).toUpperCase() + fallbackType.slice(1);
}

export function buildIntelligentScannerLabel(params: {
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
}) {
  const objectLabelName = String(params.objectLabelName || "System Node").trim();
  const roleBody = typeof params.scannerRoleBody === "string" ? params.scannerRoleBody.trim() : null;
  const severity = normalizeText(params.scannerSeverity);
  const normalizedSeverity = normalizeScannerLabelSeverity(params.scannerSeverity, params.scannerFragilityScore);
  const isHighPressure =
    params.scannerFragilityScore >= 0.72 || severity === "critical" || severity === "high";
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

export function fallbackPos(index: number, total: number): [number, number, number] {
  const n = Math.max(1, total);
  const radius = Math.max(2.5, n * 0.12);
  const angle = (index / n) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
}

export function hashIdToUnit(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 100000) / 100000;
}

export function fallbackPosFromId(id: string): THREE.Vector3 {
  const unit = hashIdToUnit(id);
  const angle = unit * Math.PI * 2;
  const radius = 2.2;
  return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
}

export function getObjPos(id: string, objects: any[]): THREE.Vector3 {
  const found = objects.find((object: any) => object?.id === id);
  const posCandidates = [found?.position, (found?.transform as any)?.pos, (found as any)?.pos];
  for (const position of posCandidates) {
    if (Array.isArray(position) && position.length >= 3) {
      return new THREE.Vector3(Number(position[0]) || 0, Number(position[1]) || 0, Number(position[2]) || 0);
    }
    if (position && typeof position === "object" && "x" in position && "y" in position && "z" in position) {
      return new THREE.Vector3(Number((position as any).x) || 0, Number((position as any).y) || 0, Number((position as any).z) || 0);
    }
  }

  const baselinePos: Record<string, [number, number, number]> = {
    obj_inventory: [-1.6, 0, 0],
    obj_delivery: [0, 0, 0],
    obj_risk_zone: [1.6, 0, 0],
  };
  if (baselinePos[id]) {
    const [x, y, z] = baselinePos[id];
    return new THREE.Vector3(x, y, z);
  }

  const index = objects.findIndex((object: any) => object?.id === id);
  if (index >= 0) {
    const [x, y, z] = fallbackPos(index, objects.length);
    return new THREE.Vector3(x, y, z);
  }

  return fallbackPosFromId(id);
}

export function buildSceneObjectVisualState(input: {
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

export function toPosTuple(raw: unknown, fallback: [number, number, number]): [number, number, number] {
  if (Array.isArray(raw) && raw.length >= 3) {
    const x = Number(raw[0]);
    const y = Number(raw[1]);
    const z = Number(raw[2]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) return [x, y, z];
  }
  if (raw && typeof raw === "object") {
    const x = Number((raw as any).x);
    const y = Number((raw as any).y);
    const z = Number((raw as any).z);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) return [x, y, z];
  }
  return fallback;
}

export function classifyRelationRole(params: {
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

  if ((isPrimary(fromId) && isAffected(toId)) || (isPrimary(toId) && isAffected(fromId))) return "primary_to_affected";
  if ((isPrimary(fromId) && isContext(toId)) || (isPrimary(toId) && isContext(fromId))) return "primary_to_context";
  if (isAffected(fromId) && isAffected(toId)) return "affected_to_affected";
  if ((isAffected(fromId) && isContext(toId)) || (isAffected(toId) && isContext(fromId))) return "affected_to_context";
  if (isContext(fromId) && isContext(toId)) return "context_to_context";
  return "neutral";
}

export function getRelationEmphasisStyle(params: {
  relationRole: RelationRole;
  severity: DomainLabelSeverity;
  theme: "day" | "night" | "stars";
  active: boolean;
}) {
  const { relationRole, severity, active } = params;
  const severityBoost = severity === "critical" ? 0.08 : severity === "high" ? 0.05 : severity === "medium" ? 0.02 : 0;

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

export function getNarrativeNodeStyle(role: NarrativeNodeRole, strength: number) {
  const safeStrength = clamp01(strength);
  if (role === "primary") return { scaleMul: 1 + safeStrength * 0.026, emissiveBoost: safeStrength * 0.1, opacityMul: 1, opacityBoost: safeStrength * 0.018, liftY: safeStrength * 0.022 };
  if (role === "affected") return { scaleMul: 1 + safeStrength * 0.015, emissiveBoost: safeStrength * 0.055, opacityMul: 0.98, opacityBoost: safeStrength * 0.01, liftY: safeStrength * 0.01 };
  if (role === "context") return { scaleMul: 1 + safeStrength * 0.004, emissiveBoost: safeStrength * 0.018, opacityMul: 0.82, opacityBoost: 0, liftY: safeStrength * 0.003 };
  return { scaleMul: 1, emissiveBoost: 0, opacityMul: 1 - safeStrength * 0.28, opacityBoost: 0, liftY: 0 };
}

export function getNarrativeEdgeStyle(role: NarrativeEdgeRole, strength: number) {
  const safeStrength = clamp01(strength);
  if (role === "path") return { opacityMul: 1 + safeStrength * 0.22, colorMul: 1 + safeStrength * 0.08, pulseBoost: safeStrength * 0.025 };
  if (role === "secondary") return { opacityMul: 1 + safeStrength * 0.06, colorMul: 1 + safeStrength * 0.025, pulseBoost: safeStrength * 0.01 };
  return { opacityMul: 1 - safeStrength * 0.28, colorMul: 1 - safeStrength * 0.08, pulseBoost: 0 };
}

export function getSimulationNodeStyle(strength: number, isSource: boolean) {
  const safeStrength = clamp01(strength);
  if (safeStrength <= 0) return { scaleMul: 1, emissiveBoost: 0, opacityBoost: 0, motionBoost: 0 };
  return {
    scaleMul: 1 + safeStrength * (isSource ? 0.038 : 0.014),
    emissiveBoost: safeStrength * (isSource ? 0.12 : 0.045),
    opacityBoost: safeStrength * (isSource ? 0.04 : 0.012),
    motionBoost: safeStrength * (isSource ? 0.035 : 0.012),
  };
}

export function getSimulationEdgeStyle(depth: number, strength: number) {
  const safeStrength = clamp01(strength);
  const depthFade = depth <= 1 ? 1 : depth === 2 ? 0.76 : 0.58;
  return {
    opacityMul: 1 + safeStrength * 0.2 * depthFade,
    colorMul: 1 + safeStrength * 0.06 * depthFade,
    pulseBoost: safeStrength * 0.014 * depthFade,
  };
}
